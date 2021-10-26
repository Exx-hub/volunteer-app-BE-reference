let models = require("../models")
let bcrypt = require("bcrypt")
var jwt = require('jsonwebtoken');
let AWS = require('aws-sdk');
const Puid = require('puid');
const { update } = require("../models/bulletin");
let s3 = new AWS.S3({
    region: process.env.region,
    "accessKeyId": process.env.accessKeyId,
    "secretAccessKey": process.env.secretAccessKey
});
let puid = new Puid();

const addBulletin = async (req, res) => {
    try {
        let bulletinExist = await models.bulletin.findOne({ title: req.body.title })
        if (!bulletinExist) {
            let data = await models.bulletin.create(req.body)
            if(data.isRegional === 1){
                let regionData = await models.region.findOne({ _id: data.regionId })
                res.json({
                    success: "true",
                    data: {
                        '_id': data._id,
                        'title': data.title,
                        'description': data.description,
                        'isRegional': data.isRegional,
                        'regionId': data.regionId,
                        'region': regionData.region,
                        'createdAt': data.createdAt,
                        'updatedAt': data.updatedAt
                    }
                })
            }else{
                res.json({ success: "true", data: data })
            }
        } else {
            res.status(409).json({ success: "false", errorCode: "5001", message: "Bulletin already exist!" })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

const updateBulletin = async (req, res) => {
    try {
        let bulletinExist = await models.bulletin.findOne({ _id: req.params.bulletinId })
        if (bulletinExist) {
            let data = await models.bulletin.update({ _id: req.params.bulletinId }, req.body)
            let bulletinData = await models.bulletin.findOne({ _id: req.params.bulletinId })
            if(bulletinData.isRegional === 1){
                let regionData = await models.region.findOne({ _id: bulletinData.regionId })
                res.json({
                    success: "true",
                    data: {
                        '_id': bulletinData._id,
                        'title': bulletinData.title,
                        'description': bulletinData.description,
                        'isRegional': bulletinData.isRegional,
                        'regionId': bulletinData.regionId,
                        'region': regionData.region,
                        'createdAt': bulletinData.createdAt,
                        'updatedAt': bulletinData.updatedAt
                    }
                })
            }else{
                res.json({ success: "true", data })
            }
        } else {
            res.status(409).json({ success: "false", errorCode: "5002", message: "bulletin doesn't exists!" })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

const deleteBulletin = async (req, res) => {
    try {
        let bulletinExist = await models.bulletin.findOne({ _id: req.params.bulletinId })
        if (bulletinExist) {
            let data = await models.bulletin.deleteOne({ _id: req.params.bulletinId })
            res.json({ success: "true" })
        }else{
            res.status(409).json({ success: "false", errorCode: "5002", message: "bulletin doesn't exists!" })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

const bulletinById = async (req, res) => {
    try {
        let bulletinData = await models.bulletin.findOne({ _id: req.params.bulletinId }).select("_id title description isRegional regionId createdAt updatedAt")
        if(bulletinData.isRegional === 1){
            let regionData = await models.region.findOne({ _id: data.regionId })
            res.json({
                success: "true",
                data: {
                    '_id': data._id,
                    'title': data.title,
                    'description': data.description,
                    'isRegional': data.isRegional,
                    'regionId': data.regionId,
                    'region': regionData.region,
                    'createdAt': data.createdAt,
                    'updatedAt': data.updatedAt
                }
            })
        }else{
           res.json({ success: "true", data: bulletinData })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

const bulletinByRegionId = async (req, res) => {
    try {
        //let bulletinData = await models.bulletin.find({ regionId: req.params.regionId }).select("_id title description isRegional regionId createdAt updatedAt")
        let bulletinData = await models.bulletin.aggregate([
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
                title: 1,
                description: 1,
                isRegional: 1,
                regionId: 1,
                region: "$region_info.region",
                createdAt: 1,
                updatedAt: 1
              }
            }
        ])
        res.json({ success: "true", data: bulletinData })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

const bulletinNationwide = async (req, res) => {
    try {
        let bulletinData = await models.bulletin.find({ isRegional: 0 }).select("_id title description isRegional createdAt updatedAt")
        res.json({ success: "true", data: bulletinData })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

const bulletinRegional = async (req, res) => {
    try {
        //let bulletinData = await models.bulletin.find({ isRegional: 1 }).select("_id title description isRegional regionId createdAt updatedAt")
        let bulletinData = await models.bulletin.aggregate([
            { 
              $lookup: {
                from: "regions",
                localField: "regionId",
                foreignField: "_id",
                as: "region_info",
              },
            },
            { $unwind: "$region_info" },
            { $match: { isRegional: 1 }},
            {
              $project: {
                _id: 1,
                title: 1,
                description: 1,
                isRegional: 1,
                regionId: 1,
                region: "$region_info.region",
                createdAt: 1,
                updatedAt: 1
              }
            }
        ])
        res.json({ success: "true", data: bulletinData })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

const listBulletin = async (req, res) => {
    try {
        //let bulletinData = await models.bulletin.find({}).select("_id title description isRegional regionId createdAt updatedAt")
        let bulletinData = await models.bulletin.aggregate([
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
                title: 1,
                description: 1,
                isRegional: 1,
                regionId: 1,
                region: "$region_info.region",
                createdAt: 1,
                updatedAt: 1
              }
            }
        ])
        res.json({ success: "true", data: bulletinData })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

module.exports = {
    addBulletin,
    updateBulletin,
    deleteBulletin,
    bulletinById,
    bulletinByRegionId,
    bulletinNationwide,
    bulletinRegional,
    listBulletin
}