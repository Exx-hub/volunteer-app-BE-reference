var mongoose = require("mongoose")
const { Schema } = mongoose;

const regionSchema = new Schema({
    region: String
}, {
    timestamps: true
});

const region = mongoose.model('region', regionSchema);

module.exports = region;