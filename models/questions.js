var mongoose = require("mongoose")
const { Schema } = mongoose;
let questionCategories = require("./questionCategories")

const questionSchema = new Schema({
    question: String,
    active:  { type: Boolean, default: true },
    seq: Number,
    categoryId: { type: Schema.Types.ObjectId, ref: questionCategories },
}, {
    timestamps: true
});

const question = mongoose.model('question', questionSchema);
module.exports = question;