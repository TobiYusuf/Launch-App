const express = require("express")
const {createOrder, viewCart} = require("../controllers/orderCtrl")
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware")

router = express.Router()

router.post("/create-order",authMiddleware, createOrder)
router.get("/veiw-cart", viewCart)

module.exports = router