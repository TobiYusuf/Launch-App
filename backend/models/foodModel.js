const mongoose = require("mongoose");
const Category = require("./foodCategoryModel");

const foodSchema = new mongoose.Schema(
  {
    foodName: {
      type: String,
      require: true,
    },
    picture: {
      type: String,
      require: false,
    },
    price: {
      type: Number,
      require: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

const Food = mongoose.model("Food", foodSchema);

module.exports = Food;
