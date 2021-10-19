var mongoose = require("mongoose")
const { Schema } = mongoose;

const fileSchema = new Schema({
    title: String,
    subTitle: String,
    description: String,
    image: String,
    fileLink: String
}, {
    timestamps: true
});

const file = mongoose.model('file', fileSchema);
module.exports = file;