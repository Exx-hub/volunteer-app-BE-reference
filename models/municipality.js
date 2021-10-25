var mongoose = require("mongoose")
const { Schema } = mongoose;

const municipalitySchema = new Schema({
    'municipality':{
        'type': String,
        'required': true
    },
    'regionId': {
        'type': mongoose.Schema.Types.ObjectId,
        'required': true
    },
}, {
    'versionKey': false,
    'timestamps': true,
    'autoIndex': true
});

const municipality = mongoose.model('municipality', municipalitySchema);

module.exports = municipality;