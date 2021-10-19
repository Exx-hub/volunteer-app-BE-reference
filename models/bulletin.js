var mongoose = require("mongoose")
const { Schema } = mongoose;

const bulletinSchema = new Schema({
    title: String,
    description: String,
    regionId: mongoose.Schema.Types.ObjectId,
    municipalityId: mongoose.Schema.Types.ObjectId
}, {
    timestamps: true
});

const bulletin = mongoose.model('bulletin', bulletinSchema);

module.exports = bulletin;