var mongoose = require("mongoose")
const { Schema } = mongoose;
let video = require("./video")

const videoBankSchema = new Schema({
    video: { type: Schema.Types.ObjectId, ref: video },
    type: String
}, {
    timestamps: true
});

const videoBank = mongoose.model('videoBank', videoBankSchema);
module.exports = videoBank;