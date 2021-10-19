let models = require("../models")

const addToVideoBank = async (req, res) => {
    try {
        console.log(req.body,"dskaslk")
        for await( let item of req.body.video){
            let exist = await models.videoBank.findOne({video:item, type:req.body.bankType});
            console.log(exist)
            if(!exist){
                console.log("-------------")
                let data = await models.videoBank.create({video:item,type:req.body.bankType})
            }
        }
        res.json({
            status: 1,
            message: "success",
        })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }
}

const getVideoBank = async (req, res) => {
    try {
        let data = await models.videoBank.find().populate("video")
            
        res.json({
            status: 1,
            message: "success",
            data: data
        })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }
}

const deleteVideoBank = async (req, res) => {
    try {
        let data = await models.videoBank.remove({_id:req.params._id})
            
        res.json({
            status: 1,
            message: "success",
            data: data
        })
    } catch (error) {
        console.log(error, "-----------------")
        res.status(500).json({ error: 1, data: error })
    }
}

module.exports = {
    addToVideoBank,
    getVideoBank,
    deleteVideoBank
}

