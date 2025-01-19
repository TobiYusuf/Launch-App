const Food = require("../models/foodModel");
const Category = require("../models/foodCategoryModel");
const AppError = require("../utils/appError");

const addFood = async (req, res, next) => {
  const { foodName, price, picture, category } = req.body;
  //   console.log(foodName, price, category);

  try {
    const foodCategory = await Category.findOne({ categoryName: category });
    if (!foodCategory) {
      return next(new AppError("Category not found !", 404));
    }
    // console.log("********", foodCategory._id);
    const addedFood = await Food.create({
      foodName,
      price,
      picture,
      category: foodCategory._id,
    });

    // update the category with the food
    foodCategory.food.push(addedFood._id);
    await foodCategory.save();
    res.status(200).json({
      success: true,
      addedFood,
    });
  } catch (error) {
    next(error);
  }
};

const getFood = async (req, res, next) => {
  const { foodId } = req.params;
  try {
    const foodMenu = await Food.findById(foodId).populate(
      "category",
      "categoryName"
    );
    if (foodMenu.length === 0) {
      res.status(404).json({
        success: false,
        message: "No food on the menu",
        foodMenu,
      });
    }
    res.status(200).json({
      success: true,
      foodMenu,
    });
  } catch (error) {
    next(error);
  }
};

const getAllFood = async (req, res, next) => {
  //return an array of categories with their food populated
  try {
    const food = await Food.find().populate("category", "categoryName");
    if (food.length === 0) {
      return next(new AppError("No Food found", 404));
    }

    res.status(200).json({
      success: true,
      food,
    });
  } catch (error) {
    next(error);
  }
};

const updateFood = async (req, res, next) => {
  const { foodId } = req.params;
  const { foodName, price, picture, category } = req.body;

  try {
    const updatedFood = await Food.findByIdAndUpdate(
      foodId,
      {
        foodName,
        price,
        picture,
      },
      { new: true }
    );

    if (category) {
      const foodCategory = await Category.findOne({ categoryName: category });
      if (!foodCategory) {
        return next(new AppError("Category not found !", 404));
      }

      updatedFood.category = foodCategory._id;
      await updatedFood.save();
    }

    res.status(200).json({
      success: true,
      message: "Food updated succesffuly",
      updatedFood,
    });
  } catch (error) {
    next(new AppError("Error updating food item", 500));
  }
};

const removeFood = async (req, res, next) => {
  const { foodId } = req.params;

  try {
    const food = await Food.findByIdAndDelete(foodId);
    if (!food) {
      next(new AppError("Food item was not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Food item was successfully deleted",
      food,
    });
  } catch (error) {
    next(new AppError("Error occured while trying to delete food item"));
  }
};



module.exports = { addFood, getFood, getAllFood, updateFood, removeFood };
