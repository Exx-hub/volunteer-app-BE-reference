let models = require("../models")
let bcrypt = require("bcrypt")
var jwt = require('jsonwebtoken');
let AWS = require('aws-sdk');
const axios = require("axios")
const Puid = require('puid');
const { update } = require("../models/user");
let s3 = new AWS.S3({
    region: process.env.region,
    "accessKeyId": process.env.accessKeyId,
    "secretAccessKey": process.env.secretAccessKey
});
let puid = new Puid();

const baseUrl = "http://svr20.synermaxx.asia/vmobile/movon/api/sendnow.php";
const un = 'movonapi';
const pwd = '4cdaf2bf98ccc0e98a4bc9a1170e8d80';
const originator = 'MOVON';

const createUser = async (req, res) => {
    try {
        let userExist = await models.user.findOne({ mobileNo: req.body.mobileNo })
        let encryptedPassword = await bcrypt.hash(req.body.password, parseInt(process.env.saltRounds))
        if (!userExist) {
            req.body.fullName = req.body.firstName + ' ' + req.body.lastName;
            req.body.password = encryptedPassword;
            let data = await models.user.create(req.body)
            let regionData = await models.region.findOne({ _id: req.body.regionId })
            let municipalityData = await models.municipality.findOne({ _id: req.body.municipalityId })
            res.json({
                success: "true",
                data: {
                    '_id': data._id,
                    'mobileNo': data.mobileNo,
                    'password': data.password,
                    'firstName': data.firstName,
                    'lastName': data.lastName,
                    'address': data.address,
                    'gender': data.gender,
                    'birthDate': req.body.birthDate,
                    'regionId': data.regionId,
                    'region': regionData.region,
                    'municipalityId': data.municipalityId,
                    'municipality': municipalityData.municipality,
                    'createdAt': data.createdAt,
                    'updatedAt': data.updatedAt
                }
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
        let data = await models.user.findOne({ mobileNo: req.body.mobileNo }).select("_id mobileNo fullName firstName lastName password address gender birthDate regionId municipalityId createdAt updatedAt");
        let comp = await bcrypt.compare(req.body.password, data.password);
        if (data && comp) {
            let token = puid.generate();
            let updateData = await models.user.updateOne({_id:data._id},{$set:{'sessionInfo.token':token}});
            let regionData = await models.region.findOne({ _id: data.regionId })
            let municipalityData = await models.municipality.findOne({ _id: data.municipalityId })
            res.json({
                success: "true",
                data: {
                    '_id': data._id,
                    'mobileNo': data.mobileNo,
                    'password': data.password,
                    'firstName': data.firstName,
                    'lastName': data.lastName,
                    'address': data.address,
                    'gender': data.gender,
                    'birthDate': req.body.birthDate,
                    'regionId': data.regionId,
                    'region': regionData.region,
                    'municipalityId': data.municipalityId,
                    'municipality': municipalityData.municipality,
                    'token': token
                }
            });
        } else {
            res.status(500).json({ success: "false", errorCode: "1000", message: "Invalid mobile number or password!" })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

const updateUser = async (req, res) => {
    try {
        let userExist = await models.user.findOne({ _id: req.params.userId })
        if (userExist) {
            if(req.body.firstName || req.body.lastName){
                req.body.fullName = req.body.firstName + ' ' + req.body.lastName;
            }

            if(req.body.password){
                let encryptedPassword = await bcrypt.hash(req.body.password, parseInt(process.env.saltRounds))
                req.body.password = encryptedPassword;
            }

            let data = await models.user.updateOne({ _id: req.params.userId }, req.body)
            let userData = await models.user.findOne({ _id: req.params.userId })
            let regionData = await models.region.findOne({ _id: userData.regionId })
            let municipalityData = await models.municipality.findOne({ _id: userData.municipalityId })
            res.json({
                success: "true",
                data: {
                    '_id': userData._id,
                    'mobileNo': userData.mobileNo,
                    'password': userData.password,
                    'firstName': userData.firstName,
                    'lastName': userData.lastName,
                    'address': userData.address,
                    'gender': userData.gender,
                    'birthDate': userData.birthDate,
                    'regionId': userData.regionId,
                    'region': regionData.region,
                    'municipalityId': userData.municipalityId,
                    'municipality': municipalityData.municipality
                }
            });
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
        let userExist = await models.user.findOne({ _id: req.params.userId })
        if (userExist) {
            let data = await models.user.deleteOne({ _id: req.params.userId })
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
        let userData = await models.user.findOne({ _id: req.params.userId }).select("_id mobileNo fullName firstName lastName password address gender birthDate regionId municipalityId createdAt updatedAt")
        let regionData = await models.region.findOne({ _id: userData.regionId })
        let municipalityData = await models.municipality.findOne({ _id: userData.municipalityId })
        res.json({
            success: "true",
            data: {
                '_id': userData._id,
                'mobileNo': userData.mobileNo,
                'password': userData.password,
                'firstName': userData.firstName,
                'lastName': userData.lastName,
                'address': userData.address,
                'gender': userData.gender,
                'birthDate': userData.birthDate,
                'regionId': userData.regionId,
                'region': regionData.region,
                'municipalityId': userData.municipalityId,
                'municipality': municipalityData.municipality,
                'createdAt': userData.createdAt,
                'updatedAt': userData.updatedAt
            }
        });
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

const listUsers = async (req, res) => {
    try {
        //let userData = await models.user.find({}).select("_id mobileNo fullName firstName lastName password address gender birthDate regionId municipalityId createdAt updatedAt")
        let userData = await models.user.aggregate([
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
                mobileNo: 1,
                fullName: 1,
                firstName: 1,
                lastName: 1,
                password: 1,
                address: 1,
                gender: 1,
                birthDate: 1,
                regionId: 1,
                region: "$region_info.region",
                municipalityId: 1,
                municipality: "$municipality_info.municipality",
                createdAt: 1,
                updatedAt: 1
              }
            }
        ])
        res.json({ success: "true", data: userData })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

const signupRequestOTP = async (req, res) => {
    try {
        let userExist = await models.user.findOne({ mobileNo: req.body.mobileNo })
        let encryptedPassword = await bcrypt.hash(req.body.password, parseInt(process.env.saltRounds))
        let otp = {
            'code': generateOTP(6),
            'timeout': new Date((new Date()).getTime() + (60 * 60 * 1000))
        }
        let otp_msg = 'Your One-Time Pin is ' + otp.code + '. It will expire in 5 minutes. For your safety, never share this PIN to anyone.\n\nVolunteer App';
        
        if (!userExist) {
            req.body.fullName = req.body.firstName + ' ' + req.body.lastName;
            req.body.password = encryptedPassword;
            req.body.otp = otp;
            let userInfo = {userInfo:req.body};
            let data = await models.tempuser.create(userInfo)

            //send sms - otp
            let phone = '+63' + req.body.mobileNo;
            let _url = `${baseUrl}?username=${un}&password=${pwd}&mobilenum=${phone}&fullmesg=${otp_msg}&originator=${originator}`
            axios.get(_url).then(function(response){console.log(response.data);});

            res.json({ success: "true", otp: otp.code })
        }else{
            res.status(409).json({ success: "false", errorCode: "1005", message: "mobile number already exist!" })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

const signupVerifyOTP = async (req, res) => {
    try {
        let userExist = await models.tempuser.findOne({ 'userInfo.mobileNo': req.body.mobileNo })
        userExist = JSON.parse(JSON.stringify(userExist))
        if (userExist && userExist.userInfo.otp.code === req.body.otp) {
            let userData = await models.user.create(userExist.userInfo);
            userData = JSON.parse(JSON.stringify(userData))
            await models.tempuser.deleteOne({ _id: userExist._id })
            let regionData = await models.region.findOne({ _id: userData.regionId })
            let municipalityData = await models.municipality.findOne({ _id: userData.municipalityId })
            res.json({
                success: "true",
                data: {
                    '_id': userData._id,
                    'mobileNo': userData.mobileNo,
                    'password': userData.password,
                    'firstName': userData.firstName,
                    'lastName': userData.lastName,
                    'address': userData.address,
                    'gender': userData.gender,
                    'birthDate': userData.birthDate,
                    'regionId': userData.regionId,
                    'region': regionData.region,
                    'municipalityId': userData.municipalityId,
                    'municipality': municipalityData.municipality,
                    'createdAt': userData.createdAt,
                    'updatedAt': userData.updatedAt
                }
            });
        }else{
            res.status(409).json({ success: "false", errorCode: "1005", message: "otp verification error!" })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

const generateOTP = function(length) {
    let otp = (Math.random() * Math.pow(10, length)).toFixed();
    if (otp.length < length) {
        otp += Array(length - otp.length).fill(0).join('');
    }
    return otp;
}

const forgotPassRequestOTP = async (req, res) => {
    try {
        let userExist = await models.user.findOne({ mobileNo: req.body.mobileNo })
        let otp = {
            'code': generateOTP(6),
            'timeout': new Date((new Date()).getTime() + (60 * 60 * 1000))
        }
        let otp_msg = 'Your One-Time Pin is ' + otp.code + '. It will expire in 5 minutes. For your safety, never share this PIN to anyone.\n\nVolunteer App';
        
        if (userExist) {
            let data = await models.user.updateOne({_id:userExist._id},{$set:{'otp':otp}});

            //send sms - otp
            let phone = '+63' + req.body.mobileNo;
            let _url = `${baseUrl}?username=${un}&password=${pwd}&mobilenum=${phone}&fullmesg=${otp_msg}&originator=${originator}`
            axios.get(_url).then(function(response){console.log(response.data);});

            res.json({ success: "true", otp: otp.code })
        }else{
            res.status(409).json({ success: "false", errorCode: "1005", message: "mobile number already exist!" })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

const forgotPassVerifyOTP = async (req, res) => {
    try {
        let userExist = await models.user.findOne({ mobileNo: req.body.mobileNo })
        let encryptedPassword = await bcrypt.hash(req.body.password, parseInt(process.env.saltRounds))
        userExist = JSON.parse(JSON.stringify(userExist))
        if (userExist && userExist.otp.code === req.body.otp) {
            let userData = await models.user.updateOne({_id:userExist._id},{$set:{'password':encryptedPassword}});
            res.json({ success: "true"})
        }else{
            res.status(409).json({ success: "false", errorCode: "1005", message: "otp verification error!" })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, success: "false", data: error })
    }
}

module.exports = {
    createUser,
    login,
    updateUser,
    deleteUser,
    userById,
    listUsers,
    signupRequestOTP,
    signupVerifyOTP,
    generateOTP,
    forgotPassRequestOTP,
    forgotPassVerifyOTP
}