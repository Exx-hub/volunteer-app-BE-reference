var mongoose = require("mongoose")
const { Schema } = mongoose;

const regionSchema = new Schema({
    'region':{
        'type': String,
        'required': true
    },
    'description':{
        'type': String,
        'required': false
    }
}, {
    'versionKey': false,
    'timestamps': true,
    'autoIndex': true
});

const region = mongoose.model('region', regionSchema);

module.exports = region;