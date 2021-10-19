var mongoose = require("mongoose")
const { Schema } = mongoose;

const municipalitySchema = new Schema({
    region: String
}, {
    timestamps: true
});

const municipality = mongoose.model('municipality', municipalitySchema);

module.exports = municipality;