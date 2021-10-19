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

const signup = async (req, res) => {
    try {
        let userExist = await models.user.findOne({ mobileNo: req.body.mobile })
        let encryptedPassword = await bcrypt.hash(req.body.password, parseInt(process.env.saltRounds))
        req.body.password = encryptedPassword;
        if (!userExist) {
            console.log('body',req.body);
            req.body.name = req.body.firstName + ' ' + req.body.lastName;
            let data = await models.user.create(req.body)
            let token = jwt.sign({ _id: data._id }, 'videoPlaybackSecret', { expiresIn: 60 * 60 });
            res.json({
                status: 1,
                message: "success",
                data: data,
                token
            })
        } else {
            res.status(409).json({ error: 1, message: "already exist!" })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }

}

const login = async (req, res) => {
    try {
        let data = await models.user.findOne({
            email: req.body.email,
        }, {
            "_id": 1,
            "email": 1,
            "name": 1,
            "password": 1
        }).lean();
        let comp = await bcrypt.compare(req.body.password, data.password);
        if (data && comp) {
            delete data.password;
            let token = jwt.sign({ _id: data._id }, process.env.jwtSecret, { expiresIn: 60 * 60 });
            res.json({
                status: 1,
                message: "success",
                data: data,
                token
            })
        } else {
            res.status(500).json({ error: 1, message: "incorrect email or password!" })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }
}

const socialLogin = async (req, res) => {
    let exist = await models.user.findOne({
        $or: [
            {
                email: req.body.email
            },
            {
                socialLoginId: req.body.socialLoginId
            }]
    }, {
        "_id": 1,
        "email": 1,
        "name": 1
    })
    if (exist) {
        let token = jwt.sign({ _id: exist._id }, process.env.jwtSecret, { expiresIn: 60 * 60 });
        res.json({
            error: 0,
            data: exist,
            token
        })
    } else {
        let encryptedPassword = await bcrypt.hash(req.body.password, parseInt(process.env.saltRounds))
        req.body.password = encryptedPassword;
        req.body.subscription = "free"
        let data = await models.user.create(req.body)
        let token = jwt.sign({ _id: data._id }, process.env.jwtSecret, { expiresIn: 60 * 60 });
        res.json({
            error: 0,
            data,
            token
        })
    }
}

const updateProfile = async (req, res) => {
    try {
        if (req.file) {
            let params = {
                Bucket: 'w3appbucket/images',
                Key: new Date().getTime() + req.file.originalname,
                Body: req.file.buffer
            }
            s3.upload(params, async function (err, s3Data) {
                if (err) {
                    res.status(500).json({ error: 1, data: err })
                } else {
                    console.log("Upload Success", s3Data.Location);
                    req.body.profilePicture = s3Data.Location
                    console.log(req.body, "kkkkkkkk")
                    let data = await models.user.update({ _id: req.params.userId }, req.body)
                    res.json({ error: 0, data })
                }
            });
        } else {
            let data = await models.user.update({ _id: req.params.userId }, req.body)
            res.json({ error: 0, data })
        }
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }
}

const userProfileById = async (req, res) => {
    try {
        let userData = await models.user.findOne({ _id: req.params.userId }).select("_id name email profilePicture subscription createdAt updatedAt")
        res.json({ error: 0, data: userData })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }
}

const listUsers = async (req, res) => {
    try {
        let userData = await models.user.find({}).select("_id name email profilePicture subscription")
        res.json({ error: 0, data: userData })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }
}


const payment = async (req, res) => {
    try {
        console.log(req.body, "body")
        let transaction = await stripe.charges.create({
            amount: 1999, //adding amount on backend because of JS issue which comes after 19.99*100
            source: req.body.token,
            currency: 'usd',
            description: 'upgrading to premium!',
        })
        if (transaction.id) {
            let data = await models.user.update({ _id: req.body.userId }, { subscription: "premium", paymentId: transaction.id })
        }
        res.json({ error: 0, message: "success!" })
    } catch (error) {
        console.log(error.message, "-----------------")
        res.status(500).json({ error: 1, message: error.message || "", data: error })
    }
}

module.exports = {
    signup,
    login,
    socialLogin,
    updateProfile,
    userProfileById,
    listUsers,
    payment
}