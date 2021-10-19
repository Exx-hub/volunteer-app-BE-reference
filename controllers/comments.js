let models = require("../models")

saveComment = async (req, res) => {
    try {
        let data = await models.comments.create(req.body);
        res.json(data)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 1, data: error })
    }
}
getComment = async (req, res) => {
    try {
        let finalData = []
        let data = await models.comments.find({courseId:req.params.courseId, parentId: null }).lean()
        let users = await models.user.find({}).select("_id name email profilePicture").lean();
        for await (let item of data) {
            let userData = users.find(user=>{
                return user._id ==item.userId
            })
            item.userData = userData

            let replies = await models.comments.find({ parentId: item._id }).lean()
            for await (let val of replies) {
                let userData = users.find(user=>{
                    return user._id ==val.userId
                })
                // cons
                val.userData = userData
            }
            item.replies = replies;
        }
        res.json(data)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 1, data: error })
    }
}
module.exports = {
    saveComment,
    getComment
}

