var mongoose = require("mongoose")
const { Schema } = mongoose;

const userSchema = new Schema({
    mobileNo: Number,
    name: String,
    firstName: String,
    lastName: String,
    sessionInfo: {
        deviceId: {
          type: String
        },
        deviceType: {
          type: Number
        },
        token: {
          type: String
        },
        destroyTime: {
          type: Date
        }
      }
}, {
    timestamps: true
});

const user = mongoose.model('user', userSchema);
module.exports = user;