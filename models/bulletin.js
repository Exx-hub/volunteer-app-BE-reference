var mongoose = require("mongoose")
const { Schema } = mongoose;

const bulletinSchema = new Schema({
    'title': {
        'type': String,
        'required': true
    },
    'description': {
        'type': String,
        'required': true,
    },
    'isRegional': {
        'type': Number,
        'required': true
    },
    'regionId': {
        'type': mongoose.Schema.Types.ObjectId,
        'required': false
    },
    'municipalityId': {
        'type': mongoose.Schema.Types.ObjectId,
        'required': false
    }
}, {
    'versionKey': false,
    'timestamps': true,
    'autoIndex': true
});

const bulletin = mongoose.model('bulletin', bulletinSchema);

module.exports = bulletin;