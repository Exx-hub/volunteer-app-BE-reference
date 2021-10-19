let models = require("../models")
let AWS = require('aws-sdk');
let s3 = new AWS.S3({
    region: process.env.region,
    "accessKeyId": process.env.accessKeyId,
    "secretAccessKey": process.env.secretAccessKey
});

const createCourse = async (req, res) => {
    try {
        if (req.file) {
            let params = {
                Bucket: 'w3appbucket/images',
                Key: new Date().getTime() + req.file.originalname,
                Body: req.file.buffer
            }
            s3.upload(params, async function (err, s3Data) {
                if (err) {
                    res.status(500).json({ error: 1, data: err })
                } else {
                    console.log("Upload Success", s3Data.Location);
                    req.body.image = s3Data.Location
                    console.log(req.body, "kkkkkkkk")
                    let data = await models.courses.create(req.body)
                    res.json({ error: 0, data })
                }
            });
        } else {
            let data = await models.courses.create(req.body)
            res.json({ error: 0, data })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }
}

const getCoursestest = async (req, res) => {
    try {
        let data = await models.courses.find({})
        res.json({ error: 0, data })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }
}
courseDataTempTest = async (req, res) => {
    try {
        let data = await models.courses.findOne({_id:req.params.courseId}).populate('trainerId videos files')
        data = JSON.parse(JSON.stringify(data))
        let sum = 0;
        data.aboutTrainer.rating.forEach(element => {
            sum+=parseInt(element)
        });
        data.aboutTrainer.rating=sum/data.aboutTrainer.rating.length;
        delete data.trainerId;
        res.json({ error: 0, data })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }

}

const updateCourse = async (req, res) => {
    try {
        if (req.file) {
            let params = {
                Bucket: 'w3appbucket',
                Key: new Date().getTime() + req.file.originalname,
                Body: req.file.buffer
            }
            s3.upload(params, async function (err, s3Data) {
                if (err) {
                    res.status(500).json({ error: 1, data: err })
                } else {
                    console.log("Upload Success", s3Data.Location);
                    req.body.profilePicture = s3Data.Location
                    console.log(req.body, "kkkkkkkk")
                    let data = await models.courses.update({ _id: req.params.courseId }, req.body)
                    res.json({ error: 0, data })
                }
            });
        } else {
            console.log(req.params, req.body)
            delete req.body.image;
            let data = await models.courses.update({ _id: req.params.courseId }, req.body)
            res.json({ error: 0, data })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }
}

const deleteCourse = async (req, res) => {
    try {
        let data = await models.courses.deleteOne({ _id: req.params.courseId })
        res.json({ error: 0, data })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }

}

module.exports = {
    createCourse,
    getCoursestest,
    updateCourse,
    deleteCourse,
    courseDataTempTest
}

