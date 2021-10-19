var mongoose = require("mongoose")
const { Schema } = mongoose;

const questionCategoriesSchema = new Schema({
    name: String,
    parentCategoryId: { type: Schema.Types.ObjectId, ref: "questionCategories" },
    type:String
}, {
    timestamps: true
});

const questionCategories = mongoose.model('questionCategories', questionCategoriesSchema);
module.exports = questionCategories;