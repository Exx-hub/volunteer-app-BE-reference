let models = require("../models")
let bcrypt = require("bcrypt")
var jwt = require('jsonwebtoken');
let AWS = require('aws-sdk');
const Puid = require('puid');
const { update } = require("../models/news");
let s3 = new AWS.S3({
    region: process.env.region,
    "accessKeyId": process.env.accessKeyId,
    "secretAccessKey": process.env.secretAccessKey
});
let puid = new Puid();

const addNews = async (req, res) => {
    try {
        let newsExist = await models.news.findOne({ headline: req.body.headline })
        if (!newsExist) {
            let data = await models.news.create(req.body)
            let regionData = await models.region.findOne({ _id: data.regionId })
            let municipalityData = await models.municipality.findOne({ _id: data.municipalityId })
            res.json({
                success: "true",
                data: {
                    '_id': data._id,
                    'headline': data.headline,
                    'description': data.description,
                    'regionId': data.regionId,
                    'region': regionData.region,
                    'municipalityId': data.municipality,
                    'municipality': municipalityData.municipality,
                    'createdAt': data.createdAt,
                    'updatedAt': data.updatedAt
                }
            })
        } else {
            res.status(409).json({ success: "false", errorCode: "4001", message: "News already exist!" })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

const updateNews = async (req, res) => {
    try {
        let newsExist = await models.news.findOne({ _id: req.params.newsId })
        if (newsExist) {
            let data = await models.news.update({ _id: req.params.newsId }, req.body)
            let newsData = await models.news.findOne({ _id: req.params.newsId })
            let regionData = await models.region.findOne({ _id: newsData.regionId })
            let municipalityData = await models.municipality.findOne({ _id: newsData.municipalityId })
            res.json({
                success: "true",
                data: {
                    '_id': newsData._id,
                    'headline': newsData.headline,
                    'description': newsData.description,
                    'regionId': newsData.regionId,
                    'region': regionData.region,
                    'municipalityId': newsData.municipality,
                    'municipality': municipalityData.municipality,
                    'createdAt': newsData.createdAt,
                    'updatedAt': newsData.updatedAt
                }
            })
        } else {
            res.status(409).json({ success: "false", errorCode: "4002", message: "news doesn't exists!" })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

const deleteNews = async (req, res) => {
    try {
        let newsExist = await models.news.findOne({ _id: req.params.newsId })
        if (newsExist) {
            let data = await models.news.deleteOne({ _id: req.params.newsId })
            res.json({ success: "true" })
        }else{
            res.status(409).json({ success: "false", errorCode: "4002", message: "news doesn't exists!" })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

const newsById = async (req, res) => {
    try {
        let newsData = await models.news.findOne({ _id: req.params.newsId }).select("_id headline description regionId municipalityId createdAt updatedAt")
        let regionData = await models.region.findOne({ _id: newsData.regionId })
        let municipalityData = await models.region.findOne({ _id: newsData.municipalityId })
        res.json({
            success: "true",
            data: {
                '_id': newsData._id,
                'headline': newsData.headline,
                'description': newsData.description,
                'regionId': newsData.regionId,
                'region': regionData.region,
                'municipalityId': newsData.municipality,
                'municipality': municipalityData.municipality,
                'createdAt': newsData.createdAt,
                'updatedAt': newsData.updatedAt
            }
        })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

const newsByRegionId = async (req, res) => {
    try {
        let newsData = await models.news.find({ regionId: req.params.regionId }).select("_id headline description regionId municipalityId createdAt updatedAt")
        /*let newsData = await models.news.aggregate([
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
              $lookup: {
                from: "municipalities",
                localField: "municipalityId",
                foreignField: "_id",
                as: "municipality_info",
              },
            },
            { $unwind: "$municipality_info" },
            { $match: { regionId: req.params.regionId }},
            {
              $project: {
                _id: 1,
                headline: 1,
                description: 1,
                regionId: 1,
                region: "$region_info.region",
                municipalityId: 1,
                municipality: "$municipality_info.municipality",
                createdAt: 1,
                updatedAt: 1
              }
            }
        ])*/
        res.json({ success: "true", data: newsData })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

const newsByMunicipalityId = async (req, res) => {
    try {
        let newsData = await models.news.find({ municipalityId: req.params.municipalityId }).select("_id headline description regionId municipalityId createdAt updatedAt")
        /*let newsData = await models.news.aggregate([
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
              $lookup: {
                from: "municipalities",
                localField: "municipalityId",
                foreignField: "_id",
                as: "municipality_info",
              },
            },
            { $unwind: "$municipality_info" },
            { $match: { municipalityId: req.params.municipalityId }},
            {
              $project: {
                _id: 1,
                headline: 1,
                description: 1,
                regionId: 1,
                region: "$region_info.region",
                municipalityId: 1,
                municipality: "$municipality_info.municipality",
                createdAt: 1,
                updatedAt: 1
              }
            }
        ])*/
        res.json({ success: "true", data: newsData })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

const listNews = async (req, res) => {
    try {
        //let newsData = await models.news.find({}).select("_id headline description regionId municipalityId createdAt updatedAt")
        let newsData = await models.news.aggregate([
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
              $lookup: {
                from: "municipalities",
                localField: "municipalityId",
                foreignField: "_id",
                as: "municipality_info",
              },
            },
            { $unwind: "$municipality_info" },
            {
              $project: {
                _id: 1,
                headline: 1,
                description: 1,
                regionId: 1,
                region: "$region_info.region",
                municipalityId: 1,
                municipality: "$municipality_info.municipality",
                createdAt: 1,
                updatedAt: 1
              }
            }
        ])
        res.json({ success: "true", data: newsData })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

module.exports = {
    addNews,
    updateNews,
    deleteNews,
    newsById,
    newsByRegionId,
    newsByMunicipalityId,
    listNews
}