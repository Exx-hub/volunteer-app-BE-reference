var mongoose = require("mongoose")
const { Schema } = mongoose;

const newsSchema = new Schema({
    'headline': {
        'type': String,
        'required': true
    },
    'description': {
        'type': String,
        'required': true
    },
    'newsDate': {
        'type': Date,
        'required': false
    },
    'regionId': {
        'type': mongoose.Schema.Types.ObjectId,
        'required': true
    },
    'municipalityId': {
        'type': mongoose.Schema.Types.ObjectId,
        'required': true
    }
}, {
    'versionKey': false,
    'timestamps': true,
    'autoIndex': true
});

const news = mongoose.model('news', newsSchema);

module.exports = news;