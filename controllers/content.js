let models = require("../models")
let fs = require('fs');
let AWS = require('aws-sdk');
let s3 = new AWS.S3({
    region: process.env.region,
    "accessKeyId": process.env.accessKeyId,
    "secretAccessKey": process.env.secretAccessKey,
    httpOptions: { timeout: 10 * 60 * 1000 }
});

const createSliderData = async (req, res) => {
    try {
        if (req.body.videoId) {
            let video = await models.video.findOne({ _id: req.body.videoId }).lean()
            delete video._id;
            req.body = Object.assign(req.body, video)
        }
        if (req.body.type == "image") {
            s3.upload({
                Bucket: "w3appbucket/images",
                Key: new Date().getTime() + req.file.originalname,
                Body: req.file.buffer
            }, async function (imageerr, images3Data) {
                if (imageerr) {
                    res.status(500).json({ error: 1, data: imageerr })
                } else {
                    console.log(images3Data)
                    req.body.image = images3Data.Location
                    let data = await models.sliderData.create(req.body);
                    res.json(data)
                }

            })
        } else {
            let data = await models.sliderData.create(req.body);
            res.json(data)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 1, data: error })
    }
}

const deleteSliderData = async (req, res) => {
    try {
        let data = await models.sliderData.remove({ _id: req.params._id });
        res.json(data)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 1, data: error })
    }
}

const updateSliderData = async (req, res) => {
    try {
        let data = await models.sliderData.update({ _id: req.params._id }, req.body)
        res.json({ error: 0, data })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 1, data: error })
    }
}

const listSliderData = async (req, res) => {
    try {
        let query = {}
        if (req.query.webapp != "true") {
            query.appearInCarousel = true
        }
        let data = await models.sliderData.find()
        res.json({ error: 0, data })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 1, data: error })
    }
}

listAllQuestions = async (req, res) => {
    try {
        let data = await models.questions.find();
        res.json(data)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 1, data: error })
    }
}

getQuestions = async (req, res) => {
    try {
        let data = await models.questions.find({ active: true }).sort({ seq: 1 })
        res.json(data)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 1, data: error })
    }
}

const createQuestion = async (req, res) => {
    try {
        let data = await models.questions.create(req.body);
        res.json(data)
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }
}

const createQuestionCategory = async (req, res) => {
    try {
        let data = await models.questionCategories.create(req.body);
        res.json({
            status: 1,
            message: "success",
            data: data
        })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }
}

const getQuestionCategory = async (req, res) => {
    try {
        let superCategories = await models.questionCategories.find({ type: "parent" })
        let finalData = [];
        for await (let item of superCategories) {
            let data = await models.questionCategories.aggregate([{
                $match: { parentCategoryId: item._id }
            }, {
                $lookup: {
                    from: "questions",
                    localField: "_id",
                    foreignField: "categoryId",
                    as: "questions"
                }
            }])
            console.log(data.length)
            item = JSON.parse(JSON.stringify(item))
            item.subCategories = data
            finalData.push(item)
        }

        res.json({
            status: 1,
            message: "success",
            data: finalData
        })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }
}

const updateQuestionCategory = async (req, res) => {
    try {
        let data = await models.questionCategories.update({ _id: req.params.categoryId }, req.body)
        res.json({
            status: 1,
            message: "success",
            data: data
        })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }
}

const deleteQuestionCategory = async (req, res) => {
    try {
        let data = await models.questionCategories.remove({ _id: req.params.categoryId })
        res.json({
            status: 1,
            message: "success",
            data: data
        })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }
}

listQuestionsByCategory = async (req, res) => {
    try {
        let data = await models.questions.find({ categoryId: req.params.categoryId }).sort({ seq: 1 })
        res.json({
            status: 1,
            message: "success",
            data: data
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 1, data: error })
    }
}
module.exports = {
    getQuestions,
    createQuestion,
    listAllQuestions,
    createSliderData,
    deleteSliderData,
    updateSliderData,
    listSliderData,
    createQuestionCategory,
    getQuestionCategory,
    updateQuestionCategory,
    deleteQuestionCategory,
    listQuestionsByCategory
}

