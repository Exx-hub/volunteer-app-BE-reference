let models = require("../models")
let bcrypt = require("bcrypt")
var jwt = require('jsonwebtoken');
let AWS = require('aws-sdk');
const Puid = require('puid');
const { update } = require("../models/admin");
let s3 = new AWS.S3({
    region: process.env.region,
    "accessKeyId": process.env.accessKeyId,
    "secretAccessKey": process.env.secretAccessKey
});
let puid = new Puid();

const addUser = async (req, res) => {
    try {
        let userExist = await models.admin.findOne({ username: req.body.username })
        let encryptedPassword = await bcrypt.hash(req.body.password, parseInt(process.env.saltRounds))
        //let token = jwt.sign({ _id: data._id }, process.env.jwtSecret, new Date());
        if (!userExist) {
            req.body.fullName = req.body.firstName + ' ' + req.body.lastName;
            req.body.password = encryptedPassword;
            let data = await models.admin.create(req.body)
            res.json({
                success: "true",
                data: data
            })
        } else {
            res.status(409).json({ success: "false", errorCode: "1001", message: "User already exist!" })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }

}

const login = async (req, res) => {
    try {
        let data = await models.admin.findOne({
            username: req.body.username,
        }, {
            "_id": 1,
            "username": 1,
            "fullName": 1,
            "password": 1
        }).lean();
        let comp = await bcrypt.compare(req.body.password, data.password);
        if (data && comp) {
            delete data.password;
            //let token = jwt.sign({ _id: data._id }, process.env.jwtSecret, { expiresIn: 60 * 60 });
            let token = puid.generate();
            let updateData = await models.admin.updateOne({_id:data._id},{$set:{'sessionInfo.token':token}});
            data.token = token;
            res.json({
                success: "true",
                data: data
            })
        } else {
            res.status(500).json({ success: "false", errorCode: "1000", message: "Invalid username or password!" })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

const updateUser = async (req, res) => {
    try {
        let userExist = await models.admin.findOne({ _id: req.params.userId })
        if (userExist) {
            if(req.body.firstName || req.body.lastName){
                req.body.fullName = req.body.firstName + ' ' + req.body.lastName;
            }

            if(req.body.password){
                let encryptedPassword = await bcrypt.hash(req.body.password, parseInt(process.env.saltRounds))
                req.body.password = encryptedPassword;
            }

            let data = await models.admin.update({ _id: req.params.userId }, req.body)
            let userData = await models.admin.findOne({ _id: req.params.userId })
            res.json({ success: "true", userData })
        } else {
            res.status(409).json({ success: "false", errorCode: "1002", message: "user doesn't exists!" })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

const deleteUser = async (req, res) => {
    try {
        let userExist = await models.admin.findOne({ _id: req.params.userId })
        if (userExist) {
            let data = await models.admin.deleteOne({ _id: req.params.userId })
            res.json({ success: "true" })
        }else{
            res.status(409).json({ success: "false", errorCode: "1002", message: "user doesn't exists!" })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

const userById = async (req, res) => {
    try {
        let userData = await models.admin.findOne({ _id: req.params.userId }).select("_id username fullName password createdAt updatedAt")
        res.json({ success: "true", data: userData })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

const listUsers = async (req, res) => {
    try {
        let userData = await models.admin.find({}).select("_id username fullName password createdAt updatedAt")
        res.json({ success: "true", data: userData })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

module.exports = {
    addUser,
    login,
    updateUser,
    deleteUser,
    userById,
    listUsers
}