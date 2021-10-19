let models = require("../models")
let bcrypt = require("bcrypt")
let jwt = require('jsonwebtoken');
let fs = require('fs');
let AWS = require('aws-sdk');
let s3 = new AWS.S3({
    region: process.env.region,
    "accessKeyId": process.env.accessKeyId,
    "secretAccessKey": process.env.secretAccessKey,
    httpOptions: { timeout: 10 * 60 * 1000 }
});
const stream = require('stream');

const createFile = async (req, res) => {
    try {
        let file = req.files.file[0];
        let imageFile = req.files.image[0]
        let params = {
            Bucket: "w3appbucket/files", Key: new Date().getTime() + file.originalname, Body: file.buffer, Metadata: {
                "Content-Type": file.mimetype
            }
        };
        let options = { partSize: 5 * 1024 * 1024, queueSize: 10 };

        s3.upload(params, options)
            .on('httpUploadProgress', function (evt) {
                console.log('Completed ' +
                    (evt.loaded * 100 / evt.total).toFixed() +
                    '% of upload');
                // io.emit("videoProgress", { percentage: (evt.loaded * 100 / evt.total).toFixed() })
            })
            .send(async function (err, data) {
                try {
                    if (err) {
                        console.log(err, "11")
                    } else {
                        s3.upload({ Bucket: "w3appbucket/images", Key: new Date().getTime() + imageFile.originalname, Body: imageFile.buffer }, async function (imageerr, images3Data) {
                            console.log('Upload done', err, data, imageerr, images3Data);
                            req.body.fileLink = data.Location;
                            req.body.image = images3Data.Location;
                            console.log(req.body)
                            let fileData = await models.file.create(req.body)
                            if (req.body.courseId) {
                                let updateCourse = await models.courses.updateMany({ _id: { $in: req.body.courseId } }, { $addToSet: { files: fileData._id } })
                            }
                            if (req.body.addToHeroCarousel == "true") {
                                req.body.type = "file";
                                req.body.fileId = fileData._id;
                                let addTosliderData = await models.sliderData.create(req.body)
                            }
                            res.json({ error: 0, data: fileData })
                        })

                    }

                } catch (error) {
                    console.log(error, "-----------------")
                    res.status(500).json({ error: 1, data: error })
                }

            });
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }
}

const getFiles = async (req, res) => {
    try {
        let data = await models.file.find({})
        res.json(data)
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }
}


const removeFile = async (req, res) => {
    try {
        let file = await models.file.findOne({ _id: req.params._id })
        let removefile = await models.file.remove({ _id: req.params._id })
        var params = { Bucket: 'w3appbucket/files', Key: file.key };

        s3.deleteObject(params, function (err, data) {
            console.log(err, data)
        })
        let coursesUpdate = await models.courses.update(
            {},
            { $pull: { files: req.params._id } },
            { multi: true }
        )
        res.json(removefile)
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }
}

const updateFile = async (req, res) => {
    try {
        let data = await models.file.update({ _id: req.params._id }, req.body)
        if (req.body.courseId) {
            let updateCourse = await models.courses.updateMany({ _id: { $in: req.body.courseId } }, { $addToSet: { files: req.params._id } })
        }
        if (req.body.addToHeroCarousel == "true") {
            let fileData = await models.file.findOne({ _id: req.params._id }).lean()
            fileData.type = "file";
            fileData.fileId = fileData._id;
            let addTosliderData = await models.sliderData.create(fileData)
        }
        res.json({ error: 0, data })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 1, data: error })
    }
}

module.exports = {
    createFile,
    getFiles,
    removeFile,
    updateFile
}

