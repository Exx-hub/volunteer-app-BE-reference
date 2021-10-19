var mongoose = require("mongoose")
const { Schema } = mongoose;
let trainer = require("./trainer")
let video = require("./video")
let file = require("./file")

const courseSchema = new Schema({
    title: String,
    subTitle: String,
    trainerId: { type: Schema.Types.ObjectId, ref: trainer },
    description: String,
    videoLink: String,
    image: String,
    videos: [{ type: Schema.Types.ObjectId, ref: video }],
    files: [{ type: Schema.Types.ObjectId, ref: file }]
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }, timestamps: true
});
courseSchema.virtual('aboutTrainer').get(function () {
    return this.trainerId;
});

const course = mongoose.model('course', courseSchema);
module.exports = course;