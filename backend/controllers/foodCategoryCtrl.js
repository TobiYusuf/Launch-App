const Category = require("../models/foodCategoryModel");
const AppError = require("../utils/appError");

// middleware to check who is calling this endpoint
const createCategory = async (req, res, next) => {
  const { categoryName, description } = req.body;

  try {
    const existingCat = await Category.findOne({ categoryName });
    if (existingCat) {
      return next(new AppError("Category already exist", 400));
    }

    const newCat = await Category.create({ categoryName, description });
    res.status(200).json({
      success: true,
      category: newCat,
    });
  } catch (error) {
    next(error);
  }

  // if not create endpoint
};

const getAllCategories = async (req, res, next) => {
  //return an array of categories with their food populated
  try {
    const categories = await Category.find().populate("food");
    if (categories.length === 0) {
      return next(new AppError("No categories found", 404));
    }

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

const getCategory = async (req, res, next) => {
  const { categoryId } = req.params;

  try {
    const category = await Category.findById(categoryId).populate("food");
    if (!category) {
      return next(new AppError("Category not found", 404));
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  const { categoryId } = req.params;
  const { categoryName, description } = req.body;

  // find the category with the id
  try {
    const category = await Category.findByIdAndUpdate(
      categoryId,
      { categoryName, description },
      { new: true }
    );

    if (!category) {
      return next(new AppError("Category not found !", 404));
    }

    res.status(200).json({
      status: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

const removeCategory = async (req, res, next) => {
  const { categoryId } = req.params;

  try {
    const deletedCategory = await Category.findByIdAndDelete({ categoryId });
    if (!deletedCategory) {
      return next(new AppError("Category not found", 404));
    }
    res.status(200).json({
      success: true,
      message: "Category and related foods removed successfully",
      deletedCategory,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  updateCategory,
  getCategory,
  getAllCategories,
  removeCategory,
};
