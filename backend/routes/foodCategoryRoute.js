const express = require("express");
const {
  createCategory,
  updateCategory,
  getCategory,
  getAllCategories,
  removeCategory,
} = require("../controllers/foodCategoryCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/categories", getAllCategories);

router.post("/create-category", authMiddleware, isAdmin, createCategory);
router.get("/category/:categoryId", getCategory);
router.put("/category/:categoryId", authMiddleware, isAdmin, updateCategory);
router.delete("/category/:categoryId", removeCategory);

module.exports = router;
