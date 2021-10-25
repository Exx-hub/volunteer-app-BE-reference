let models = require("../models")
let bcrypt = require("bcrypt")
var jwt = require('jsonwebtoken');
let AWS = require('aws-sdk');
const Puid = require('puid');
const { update } = require("../models/municipality");
const region = require("../models/region");
let s3 = new AWS.S3({
    region: process.env.region,
    "accessKeyId": process.env.accessKeyId,
    "secretAccessKey": process.env.secretAccessKey
});
let puid = new Puid();

const addMunicipality = async (req, res) => {
    try {
        let municipalityExist = await models.municipality.findOne({ municipality: req.body.municipality })
        if (!municipalityExist) {
            let data = await models.municipality.create(req.body)
            res.json({
                success: "true",
                data: data
            })
        } else {
            res.status(409).json({ success: "false", errorCode: "3001", message: "Municipality already exist!" })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }

}

const updateMunicipality = async (req, res) => {
    try {
        let municipalityExist = await models.municipality.findOne({ _id: req.params.municipalityId })
        if (municipalityExist) {
            let data = await models.municipality.update({ _id: req.params.municipalityId }, req.body)
            res.json({ success: "true", data })
        } else {
            res.status(409).json({ success: "false", errorCode: "3002", message: "Municipality doesn't exists!" })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ success: "false", data: error })
    }
}

const deleteMunicipality = async (req, res) => {
    try {
        let municipalityExist = await models.municipality.findOne({ _id: req.params.municipalityId })
        if (municipalityExist) {
            let data = await models.municipality.deleteOne({ _id: req.params.municipalityId })
            //res.json({ error: 0, data })
            res.json({ success: "true" })
        }else{
            res.status(409).json({ success: "false", errorCode: "3002", message: "Municipality doesn't exists!" })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ success: "false", data: error })
    }
}

const municipalityById = async (req, res) => {
    try {
        let municipalityData = await models.municipality.findOne({ _id: req.params.municipalityId }).select("_id regionId municipality")
        let regionData = await region.findOne({ _id: municipalityData.regionId })
        municipalityData.region = regionData.region
        res.json({ error: 0, data: municipalityData })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ success: "false", data: error })
    }
}

const municipalityByRegionId = async (req, res) => {
    try {
        let municipalityData = await models.municipality.find({ regionId: req.params.regionId }).select("_id regionId municipality")
        res.json({ error: 0, data: municipalityData })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ success: "false", data: error })
    }
}

const listMunicipality = async (req, res) => {
    try {
        let municipalityData = await models.municipality.find({}).select("_id regionId municipality createdAt updatedAt")
        res.json({ error: 0, data: municipalityData })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ success: "false", data: error })
    }
}

module.exports = {
    addMunicipality,
    updateMunicipality,
    deleteMunicipality,
    municipalityById,
    municipalityByRegionId,
    listMunicipality
}