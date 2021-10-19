let models = require("../models")
let bcrypt = require("bcrypt")
var jwt = require('jsonwebtoken');
let AWS = require('aws-sdk');
const stripe = require('stripe')(process.env.stripeSK);
let s3 = new AWS.S3({
    region: process.env.region,
    "accessKeyId": process.env.accessKeyId,
    "secretAccessKey": process.env.secretAccessKey
});

const addUser = async (req, res) => {
    try {
        let userExist = await models.user.findOne({ username: req.body.username })
        let encryptedPassword = await bcrypt.hash(req.body.password, parseInt(process.env.saltRounds))
        //let token = jwt.sign({ _id: data._id }, process.env.jwtSecret, new Date());
        if (!userExist) {
            req.body.name = req.body.firstName + ' ' + req.body.lastName;
            req.body.password = encryptedPassword;
            let data = await models.user.create(req.body)
            res.json({
                success: "true",
                data: data
            })
        } else {
            res.status(409).json({ success: "false", errorCode: "100", message: "already exist!" })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }

}

const login = async (req, res) => {
    try {
        let data = await models.user.findOne({
            username: req.body.username,
        }, {
            "_id": 1,
            "username": 1,
            "name": 1,
            "password": 1
        }).lean();
        let comp = await bcrypt.compare(req.body.password, data.password);
        if (data && comp) {
            delete data.password;
            //let token = jwt.sign({ _id: data._id }, process.env.jwtSecret, new Date());
            res.json({
                status: 1,
                message: "success",
                data: data
            })
        } else {
            res.status(500).json({ error: 1, message: "incorrect mobile or password!" })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }
}

const updateUser = async (req, res) => {
    try {
        let data = await models.user.update({ _id: req.params.userId }, req.body, {
            "_id": 1,
            "username": 1,
            "name": 1,
            "password": 1
        }).lean();
        //res.json({ error: 0, data })
        if(data){
            res.json({ success: "true", data })
        }else{
            return Promise.reject({errorCode:'1000', data})
        }
    } catch (error) {
        console.log(error, "-----------------")
        //res.status(500).json({ error: 1, data: error })
        return Promise.reject({errorCode:'1000'})
    }
}

const deleteUser = async (req, res) => {
    try {
        let data = await models.user.deleteOne({ _id: req.params.userId })
        //res.json({ error: 0, data })
        res.json({
            success: "true"
        })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ success: "false", data: error })
    }
}

const userById = async (req, res) => {
    try {
        let userData = await models.user.findOne({ _id: req.params.userId }).select("_id mobileNo name password createdAt updatedAt")
        res.json({ error: 0, data: userData })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }
}

const listUsers = async (req, res) => {
    try {
        let userData = await models.user.find({}).select("_id mobileNo name password createdAt updatedAt")
        res.json({ error: 0, data: userData })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
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