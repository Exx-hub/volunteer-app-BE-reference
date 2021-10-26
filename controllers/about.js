let models = require("../models")
let bcrypt = require("bcrypt")
var jwt = require('jsonwebtoken');
let AWS = require('aws-sdk');
const Puid = require('puid');
const { update } = require("../models/about");
let s3 = new AWS.S3({
    region: process.env.region,
    "accessKeyId": process.env.accessKeyId,
    "secretAccessKey": process.env.secretAccessKey
});
let puid = new Puid();

const addAbout = async (req, res) => {
    try {
        let data = await models.about.create(req.body)
        res.json({
            success: "true",
            data: data
        })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

const updateAbout = async (req, res) => {
    try {
        let data = await models.about.update({ _id: req.params.aboutId }, req.body)
        let aboutData = await models.about.findOne({ _id: req.params.aboutId })
        res.json({ success: "true", aboutData })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

const deleteAbout = async (req, res) => {
    try {
        let data = await models.about.deleteOne({ _id: req.params.aboutId })
        //res.json({ error: 0, data })
        res.json({ success: "true" })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

const aboutById = async (req, res) => {
    try {
        let aboutData = await models.about.findOne({ _id: req.params.aboutId }).select("_id details description createdAt updatedAt")
        res.json({ success: "true", data: aboutData })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

const listAbout = async (req, res) => {
    try {
        let aboutData = await models.about.find({}).select("_id details description createdAt updatedAt")
        res.json({ success: "true", data: aboutData })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

module.exports = {
    addAbout,
    updateAbout,
    deleteAbout,
    aboutById,
    listAbout
}