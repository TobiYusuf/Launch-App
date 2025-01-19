const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    categoryName: { type: String, require: true, unique: true },
    description: { type: String, require: false }, // A description of the category
    food: [{ type: mongoose.Schema.Types.ObjectId, ref: "Food" }],
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
