var mongoose = require("mongoose")
const { Schema } = mongoose;

const newsSchema = new Schema({
    headline: String,
    description: String,
    newsDate: Date,
    regionId: mongoose.Schema.Types.ObjectId,
    municipalityId: mongoose.Schema.Types.ObjectId
}, {
    timestamps: true
});

const news = mongoose.model('news', newsSchema);

module.exports = news;