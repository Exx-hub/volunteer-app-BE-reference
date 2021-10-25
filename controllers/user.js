let models = require("../models")
let bcrypt = require("bcrypt")
var jwt = require('jsonwebtoken');
let AWS = require('aws-sdk');
const axios = require("axios")
const Puid = require('puid');
const { update } = require("../models/user");
const tempuser = require("../models/tempuser");
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
            res.json({
                success: "true",
                data: data
            })
        } else {
            res.status(409).json({ success: "false", errorCode: "1001", message: "User already exist!" })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }
}

const login = async (req, res) => {
    try {
        let data = await models.user.findOne({ mobileNo: req.body.mobileNo }).select("_id mobileNo fullName firstName lastName password address gender birthDate regionId municipalityId createdAt updatedAt");
        let comp = await bcrypt.compare(req.body.password, data.password);
        if (data && comp) {
            delete data.password;
            delete data.otp;
            //let token = jwt.sign({ _id: data._id }, process.env.jwtSecret, new Date());
            let token = puid.generate();
            let updateData = await models.user.updateOne({_id:data._id},{$set:{'sessionInfo.token':token}});
            data.token = token;
            
            res.json({
                status: 1,
                message: "success",
                data: data
            })
        } else {
            res.status(500).json({ success: "false", errorCode: "1000", message: "Invalid mobile number or password!" })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }
}

const updateUser = async (req, res) => {
    try {
        let userExist = await models.user.findOne({ _id: req.params.userId })
        let encryptedPassword = await bcrypt.hash(req.body.password, parseInt(process.env.saltRounds))
        if (userExist) {
            req.body.fullName = req.body.firstName + ' ' + req.body.lastName;
            req.body.password = encryptedPassword;
            let data = await models.user.updateOne({ _id: req.params.userId }, req.body)
            res.json({ success: "true", data })
        } else {
            res.status(409).json({ success: "false", errorCode: "1002", message: "user doesn't exists!" })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ success: "false", data: error })
    }
}

const deleteUser = async (req, res) => {
    try {
        let userExist = await models.user.findOne({ _id: req.params.userId })
        if (userExist) {
            let data = await models.user.deleteOne({ _id: req.params.userId })
            //res.json({ error: 0, data })
            res.json({ success: "true" })
        }else{
            res.status(409).json({ success: "false", errorCode: "1002", message: "user doesn't exists!" })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ success: "false", data: error })
    }
}

const userById = async (req, res) => {
    try {
        let userData = await models.user.findOne({ _id: req.params.userId }).select("_id mobileNo fullName firstName lastName password address gender birthDate regionId municipalityId createdAt updatedAt")
        res.json({ error: 0, data: userData })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ success: "false", data: error })
    }
}

const listUsers = async (req, res) => {
    try {
        let userData = await models.user.find({}).select("_id mobileNo fullName firstName lastName password address gender birthDate regionId municipalityId createdAt updatedAt")
        res.json({ error: 0, data: userData })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ success: "false", data: error })
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
            let data = await tempuser.create(userInfo)

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
        res.status(500).json({ success: "false", data: error })
    }
}

const signupVerifyOTP = async (req, res) => {
    try {
        let userExist = await tempuser.findOne({ 'userInfo.mobileNo': req.body.mobileNo })
        userExist = JSON.parse(JSON.stringify(userExist))
        if (userExist && userExist.userInfo.otp.code === req.body.otp) {
            let userData = await models.user.create(userExist.userInfo);
            let data = JSON.parse(JSON.stringify(userData))
            await tempuser.deleteOne({ _id: userExist._id })
            delete userExist.userInfo.otp;
            res.json({ success: "true", data})

        }else{
            res.status(409).json({ success: "false", errorCode: "1005", message: "otp verification error!" })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ success: "false", data: error })
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
        res.status(500).json({ success: "false", data: error })
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
        res.status(500).json({ success: "false", data: error })
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