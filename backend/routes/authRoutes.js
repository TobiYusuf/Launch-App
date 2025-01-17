const express = require("express")
const {registerUser, loginUser, logoutUser, handleRefreshToken} = require("../controllers/authController")

const router = express.Router()

router.post("/signup", registerUser)
router.post("/login", loginUser)
router.get("/logout", logoutUser)
router.get("/refresh", handleRefreshToken)

module.exports = router
