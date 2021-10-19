var mongoose = require("mongoose")
const { Schema } = mongoose;

const commentSchema = new Schema({
    comment: String,
    parentId: {
        type: String,
        default: null
    },
    courseId: String,
    userId: String
}, {
    timestamps: true
});

const comment = mongoose.model('comment', commentSchema);
module.exports = comment;