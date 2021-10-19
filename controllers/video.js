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

const video = async (req, res) => {
    try {
        console.log(req.headers.range)
        let key = 'story.mp4'
        let params = {
            Bucket: 'w3appbucket',
            Key: key
        }
        console.log(params)
        s3.headObject(params, function (err, headData) {
            const head = {
                'Content-Length': headData.ContentLength,
                'Content-Type': headData.ContentType,
            }
            var stream = s3.getObject(params).createReadStream();
            res.writeHead(200, head)

            stream.pipe(res);
        })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }

}

const createVideo = async (req, res) => {
    try {
        const io = req.app.get('socketio'); //Here you use the exported socketio module
        console.log(req.body, req.files)
        let videoFile = req.files.video[0];
        let imageFile = req.files.image[0];
        var params = {
            Bucket: "w3appbucket/videos",
            Key: new Date().getTime() + videoFile.originalname,
            Body: videoFile.buffer,
            ContentType: videoFile.mimetype,
        };
        console.log(params, "params")
        var options = { partSize: 5 * 1024 * 1024, queueSize: 10 };
        s3.upload(params, options).on('httpUploadProgress', function (evt) {
            console.log('Completed ' + (evt.loaded * 100 / evt.total).toFixed() + '% of upload');
            io.emit("videoProgress", { percentage: (evt.loaded * 100 / evt.total).toFixed() })
        })
            .send(async function (err, data) {
                try {
                    if (err) {
                        console.log(err, "error")
                    } else {
                        s3.upload({ Bucket: "w3appbucket/images", Key: new Date().getTime() + imageFile.originalname, Body: imageFile.buffer }, async function (imageerr, images3Data) {
                            console.log('Upload done', err, data, imageerr, images3Data);
                            req.body.videoLink = data.Location;
                            req.body.image = images3Data.Location;
                            let videoData = await models.video.create(req.body)
                            if (req.body.courseId) {
                                let updateCourse = await models.courses.updateMany({ _id: { $in: req.body.courseId } }, { $addToSet: { videos: videoData._id } })
                            }
                            if (req.body.addToBank == "true") {
                                let addToBank = await models.videoBank.create({ video: videoData._id, type: req.body.bankType })
                            }
                            if (req.body.addToHeroCarousel == "true") {
                                req.body.type = "video";
                                req.body.videoId = videoData._id;
                                let addTosliderData = await models.sliderData.create(req.body)
                            }
                            res.json({ error: 0, data: videoData })
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

const getVideos = async (req, res) => {
    try {
        let data = await models.video.find({})
        res.json(data)
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }
}


const removeVideo = async (req, res) => {
    try {
        let video = await models.video.findOne({ _id: req.params._id })
        let removeVideo = await models.video.remove({ _id: req.params._id })
        var params = { Bucket: 'w3appbucket/videos', Key: video.key };

        s3.deleteObject(params, function (err, data) {
            console.log(err, data)
        })
        let coursesUpdate = await models.courses.update(
            {},
            { $pull: { videos: req.params._id } },
            { multi: true }
        )
        res.json(removeVideo)
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }
}

const updateVideo = async (req, res) => {
    try {
        console.log(req.body, req.fields, "askalksalkslakslkas")
        let data = await models.video.update({ _id: req.params._id }, req.body)
        if (req.body.courseId) {
            let updateCourse = await models.courses.updateMany({ _id: { $in: req.body.courseId } }, { $addToSet: { videos: req.params._id } })
        }
        if (req.body.addToBank == "true") {
            let addToBank = await models.videoBank.create({ video: req.params._id, type: req.body.bankType })
        }
        if (req.body.addToHeroCarousel == "true") {
            let videoData = await models.video.findOne({ _id: req.params._id }).lean()
            videoData.type = "video";
            videoData.videoId = videoData._id;
            let addTosliderData = await models.sliderData.create(videoData)
        }
        res.json({ error: 0, data })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 1, data: error })
    }
}

module.exports = {
    video,
    // test,
    createVideo,
    getVideos,
    removeVideo,
    updateVideo
}

