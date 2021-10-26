let models = require("../models")
let bcrypt = require("bcrypt")
var jwt = require('jsonwebtoken');
let AWS = require('aws-sdk');
const Puid = require('puid');
const { update } = require("../models/municipality");
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
            let regionData = await models.region.findOne({ _id: data.regionId })
            res.json({
                success: "true",
                data: {
                    '_id': data._id,
                    'regionId': data.regionId,
                    'region': regionData.region,
                    'municipality': data.municipality,
                    'createdAt': data.createdAt,
                    'updatedAt': data.updatedAt
                }
            })
        } else {
            res.status(409).json({ success: "false", errorCode: "3001", message: "Municipality already exist!" })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

const updateMunicipality = async (req, res) => {
    try {
        let municipalityExist = await models.municipality.findOne({ _id: req.params.municipalityId })
        if (municipalityExist) {
            let data = await models.municipality.update({ _id: req.params.municipalityId }, req.body)
            let municipalityData = await models.municipality.findOne({ _id: req.params.municipalityId })
            let regionData = await models.region.findOne({ _id: municipalityData.regionId })
            res.json({
                success: "true",
                data: {
                    '_id': municipalityData._id,
                    'regionId': municipalityData.regionId,
                    'region': regionData.region,
                    'municipality': municipalityData.municipality,
                    'createdAt': municipalityData.createdAt,
                    'updatedAt': municipalityData.updatedAt
                }
            })
        } else {
            res.status(409).json({ success: "false", errorCode: "3002", message: "Municipality doesn't exists!" })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

const deleteMunicipality = async (req, res) => {
    try {
        let municipalityExist = await models.municipality.findOne({ _id: req.params.municipalityId })
        if (municipalityExist) {
            let data = await models.municipality.deleteOne({ _id: req.params.municipalityId })
            res.json({ success: "true" })
        }else{
            res.status(409).json({ success: "false", errorCode: "3002", message: "Municipality doesn't exists!" })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

const municipalityById = async (req, res) => {
    try {
        let municipalityData = await models.municipality.findOne({ _id: req.params.municipalityId }).select("_id regionId municipality createdAt updatedAt")
        let regionData = await models.region.findOne({ _id: municipalityData.regionId })
        res.json({
            success: "true",
            data: {
                '_id': municipalityData._id,
                'regionId': municipalityData.regionId,
                'region': regionData.region,
                'municipality': municipalityData.municipality,
                'createdAt': municipalityData.createdAt,
                'updatedAt': municipalityData.updatedAt
            }
        })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

const municipalityByRegionId = async (req, res) => {
    try {
        //let municipalityData = await models.municipality.find({ regionId: req.params.regionId }).select("_id regionId municipality createdAt updatedAt")
        let municipalityData = await models.municipality.aggregate([
            { 
              $lookup: {
                from: "regions",
                localField: "regionId",
                foreignField: "_id",
                as: "region_info",
              },
            },
            { $unwind: "$region_info" },
            { $match: { regionId: req.params.regionId }},
            {
              $project: {
                _id: 1,
                regionId: 1,
                region: "$region_info.region",
                municipalityId: 1,
                createdAt: 1,
                updatedAt: 1
              }
            }
        ])
        res.json({ success: "true", data: municipalityData })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

const listMunicipality = async (req, res) => {
    try {
        //let municipalityData = await models.municipality.find({}).select("_id regionId municipality createdAt updatedAt")
        let municipalityData = await models.municipality.aggregate([
            { 
              $lookup: {
                from: "regions",
                localField: "regionId",
                foreignField: "_id",
                as: "region_info",
              },
            },
            { $unwind: "$region_info" },
            {
              $project: {
                _id: 1,
                regionId: 1,
                region: "$region_info.region",
                municipalityId: 1,
                createdAt: 1,
                updatedAt: 1
              }
            }
        ])
        res.json({ success: "true", data: municipalityData })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
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