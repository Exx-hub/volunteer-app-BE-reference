var mongoose = require("mongoose")
const { Schema } = mongoose;

const appUserSchema = new Schema({
    mobileNo: Number,
    name: String,
    firstName: String,
    lastName: String,
    address: String,
    gender: String,
    birthDate: Date,
    email: String,
    regionId: mongoose.Schema.Types.ObjectId,
    municipalityId: mongoose.Schema.Types.ObjectId,
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

const appUser = mongoose.model('appUser', appUserSchema);

module.exports = appUser;