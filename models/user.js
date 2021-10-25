var mongoose = require("mongoose")
const { Schema } = mongoose;

const userSchema = new Schema({
    'mobileNo': {
      'type': Number, 
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
    'address': {
      'type': String,
      'required': true
    },
    'gender': {
      'type': String,
      'required': true
    },
    'birthDate': {
      'type': Date,
      'required': true
    },
    'email': {
      'type': String,
      'required': false
    },
    'regionId': {
      'type': mongoose.Schema.Types.ObjectId,
      'required': true
    },
    'municipalityId': {
      'type': mongoose.Schema.Types.ObjectId,
      'required': true
    },
    'otp': {
      'code': String,
      'timeout': Date
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

const user = mongoose.model('user', userSchema);

module.exports = user;