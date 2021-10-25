var mongoose = require("mongoose")
const { Schema } = mongoose;

const adminSchema = new Schema({
    'username': {
      'type': String, 
      'required': true
    },
    'fullName': {
      'type': String,
      'required': true
    },
    'firstName': {
      'type': String,
      'required': true
    },
    'lastName': {
      'type': String,
      'required': true
    },
    'password': {
      'type': String, 
      'required': true
    },
    'sessionInfo': {
        'deviceId': {
          'type': String
        },
        'deviceType': {
          'type': Number
        },
        'token': {
          'type': String
        },
        'destroyTime': {
          'type': Date
        }
      }
}, {
  'versionKey': false,
  'timestamps': true,
  'autoIndex': true
});

const admin = mongoose.model('admin', adminSchema);

module.exports = admin;