let models = require("../models")
let bcrypt = require("bcrypt")
var jwt = require('jsonwebtoken');
let AWS = require('aws-sdk');
const Puid = require('puid');
const { update } = require("../models/region");
let s3 = new AWS.S3({
    region: process.env.region,
    "accessKeyId": process.env.accessKeyId,
    "secretAccessKey": process.env.secretAccessKey
});
let puid = new Puid();

const addRegion = async (req, res) => {
    try {
        let regionExist = await models.region.findOne({ region: req.body.region })
        if (!regionExist) {
            let data = await models.region.create(req.body)
            res.json({
                success: "true",
                data: data
            })
        } else {
            res.status(409).json({ success: "false", errorCode: "2001", message: "Region already exist!" })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }

}

const updateRegion = async (req, res) => {
    try {
        let regionExist = await models.region.findOne({ _id: req.params.regionId })
        if (regionExist) {
            let data = await models.region.update({ _id: req.params.regionId }, req.body)
            let regionData = await models.region.findOne({ _id: req.params.regionId })
            res.json({ success: "true", regionData })
        } else {
            res.status(409).json({ success: "false", errorCode: "2002", message: "region doesn't exists!" })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

const deleteRegion = async (req, res) => {
    try {
        let regionExist = await models.region.findOne({ _id: req.params.regionId })
        if (regionExist) {
            let data = await models.region.deleteOne({ _id: req.params.regionId })
            res.json({ success: "true" })
        }else{
            res.status(409).json({ success: "false", errorCode: "2002", message: "region doesn't exists!" })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

const regionById = async (req, res) => {
    try {
        let regionData = await models.region.findOne({ _id: req.params.regionId }).select("_id region description createdAt updatedAt")
        res.json({ success: "true", data: regionData })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

const listRegions = async (req, res) => {
    try {
        let regionData = await models.region.find({}).select("_id region description createdAt updatedAt")
        res.json({ success: "true", data: regionData })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

module.exports = {
    addRegion,
    updateRegion,
    deleteRegion,
    regionById,
    listRegions
}