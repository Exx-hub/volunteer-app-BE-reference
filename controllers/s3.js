let models = require("../models")
let bcrypt = require("bcrypt")
let jwt = require('jsonwebtoken');
let fs = require('fs');
let AWS = require('aws-sdk');
let s3 = new AWS.S3({
    region: process.env.region,
    "accessKeyId": process.env.accessKeyId,
    "secretAccessKey": process.env.secretAccessKey
});

const getFile = async (req, res) => {
    try {
        let params = {
            Bucket: 'w3appbucket',
            Key: req.params.fileName
        }
        let imgStream = s3.getObject(params).createReadStream();
        imgStream.pipe(res);
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }
}

const getDownloadAbleFile = async (req, res) => {
    try {
        let params = {
            Bucket: 'w3appbucket',
            Key: req.params.fileName
        }
        let imgStream = s3.getObject(params).createReadStream();
        imgStream.pipe(res);
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }
}

module.exports = {
    getFile,
    getDownloadAbleFile
}

