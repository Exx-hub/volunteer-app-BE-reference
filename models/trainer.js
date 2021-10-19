var mongoose = require("mongoose")
const { Schema } = mongoose;

const trainerSchema = new Schema({
    about: String,
    verified: { type: Boolean, default: false },
    rating: Array,
    name: String,
    role: String,
    profilePicture: String,
}, {
    timestamps: true
});

const trainer = mongoose.model('trainer', trainerSchema);
module.exports = trainer;