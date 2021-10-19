var mongoose = require("mongoose")
const { Schema } = mongoose;

const adminSchema = new Schema({
    username: String,
    name: String,
    firstName: String,
    lastName: String,
    password: String,
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

const admin = mongoose.model('admin', adminSchema);

module.exports = admin;