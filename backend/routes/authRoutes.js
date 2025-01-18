const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  handleRefreshToken,
  loginAdmin,
} = require("../controllers/userCtrl");

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/admin-portal", loginAdmin);
router.get("/logout", logoutUser);
router.get("/refresh", handleRefreshToken);

module.exports = router;
