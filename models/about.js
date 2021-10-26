var mongoose = require("mongoose")
const { Schema } = mongoose;

const aboutSchema = new Schema({
    'details': {
        'type': String,
        'required': true
    },
    'sort': {
        'type': Number,
        'required': false
    }
}, {
    'versionKey': false,
    'timestamps': true,
    'autoIndex': true
});

const about = mongoose.model('about', aboutSchema);

module.exports = about;