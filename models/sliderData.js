var mongoose = require("mongoose")
const { Schema } = mongoose;

const sliderSchema = new Schema({
    type: String,
    image: String,
    videoLink: String,
    videoId: String,
    title: String,
    subTitle: String,
    description: String,
    content: String,
    fileLink: String,
    appearInCarousel:Boolean
}, {
    timestamps: true
});

const sliderData = mongoose.model('sliderData', sliderSchema);
module.exports = sliderData;