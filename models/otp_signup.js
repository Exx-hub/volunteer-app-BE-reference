var mongoose = require("mongoose")
const { Schema } = mongoose;

const otpSignupSchema = new Schema({
    'userId': {
      'type': mongoose.Schema.Types.ObjectId,
      'required': true
    },  
    'mobileNo': {
      'type': Number, 
      'required': true
    },
    'otp': {
      'code': String,
      'timeout': Date
    }
}, {
  'versionKey': false,
  'timestamps': true,
  'autoIndex': true
});

const otp_signup = mongoose.model('otp_signup', otpSignupSchema);

module.exports = otp_signup;