var mongoose = require("mongoose")
const { Schema } = mongoose;

const videoSchema = new Schema({
    title: String,
    subTitle: String,
    description: String,
    image: String,
    videoLink: String
}, {
    timestamps: true
});

const video = mongoose.model('video', videoSchema);
module.exports = video;