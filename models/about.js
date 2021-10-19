var mongoose = require("mongoose")
const { Schema } = mongoose;

const aboutSchema = new Schema({
    details: String,
    sort: Number
}, {
    timestamps: true
});

const about = mongoose.model('about', aboutSchema);

module.exports = about;