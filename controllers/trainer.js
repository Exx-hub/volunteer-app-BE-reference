let models = require("../models")
let bcrypt = require("bcrypt")
var jwt = require('jsonwebtoken');
var fs = require('fs');
let AWS = require('aws-sdk');
let s3 = new AWS.S3({
    region: process.env.region,
    "accessKeyId": process.env.accessKeyId,
    "secretAccessKey": process.env.secretAccessKey
});

// console.log(process.env, "")

const getTrainers = async (req, res) => {
    try {
        let data = await models.trainer.find()
        res.json({ error: 0, data })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }
}

const createTrainer = async (req, res) => {
    try {
        console.log(req.body,"====")
        if (req.file) {
            console.log("fileeee")
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
                    req.body.profilePicture = s3Data.Location
                    console.log(req.body, "kkkkkkkk")
                    let data = await models.trainer.create(req.body)
                    res.json({ error: 0, data })
                }
            });
        } else {
            console.log("nullll")
            let data = await models.trainer.create(req.body)
            res.json({ error: 0, data })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }
}

const updateTrainer = async (req, res) => {
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
                    let data = await models.trainer.update({ _id: req.params.trainerId }, req.body)
                    res.json({ error: 0, data })
                }
            });
        } else {
            delete req.body.avtar;
            let data = await models.trainer.update({ _id: req.params.trainerId }, req.body)
            res.json({ error: 0, data })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }
}


const deleteTrainer = async (req, res) => {
    try {
        let data = await models.trainer.deleteOne({ _id: req.params.trainerId })
        res.json({ error: 0, data })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }

}


module.exports = {
    getTrainers,
    createTrainer,
    updateTrainer,
    deleteTrainer
}

