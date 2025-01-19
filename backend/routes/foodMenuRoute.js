const express = require('express')
const {addFood, getFood, getAllFood, updateFood, removeFood } = require('../controllers/foodMenuCtrl')
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware')

const router = express.Router()

router.post("/addfood", authMiddleware, isAdmin, addFood )
router.get("/getfood/:foodId", getFood)
router.get("/getfood", getAllFood)
router.put("/editfood/:foodId",authMiddleware, isAdmin, updateFood)
router.delete("/removefood/:foodId",authMiddleware, isAdmin, removeFood)

module.exports = router