const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/jwtToken");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/appError");

// Implement input data validation before saving data

//User Registration
const registerUser = async (req, res, next) => {
  const { name, email, password, profilePic } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return next(new AppError("User already exists", 400));
      // return res.status(400).json({ status: "User already exists" });
    }
    const user = new User({ name, email, password, profilePic });
    await user.save();
    const token = generateToken(user._id, "1hr");
    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    //   expiresIn: "1h",
    // });
    user.password = undefined;
    res.status(201).json({ accessToken: token, user });
  } catch (error) {
    // console.error(error)
    next(error);
    // res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("User not found !", 404));
      // return res.status(404).json({ message: "User not found !" });
    }
    // verify the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new AppError("Invalid credentials", 400));
      // return res.status(400).json({ message: "Invalid credentials" });
    }
    const accessToken = generateToken(user._id, "1hr");
    const refreshToken = generateToken(user._id, "7d");

    user.password = undefined; // Sensitive information should not be returned
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Make the cookie inaccessible to JavaScript
      secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // Set expiry for the refresh token cookie (7 days)
      sameSite: "Strict", // Protect against CSRF by not sending cookie with cross-site requests
    });

    res.status(201).json({
      success: true,
      message: "User logged in successfully",
      token: accessToken,
      user: user,
    });
  } catch (error) {
    // console.error(error.message);
    // res.status(500).json({ message: "Server error" });
    next(error);
  }
};

const loginAdmin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("Admin doesn't exist", 404))
    }
    console.log(user);
    if (user.role !== "admin") {
      return next(
        new AppError("Permission denied, admin access required", 403)
      );
    }
    // verify the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new AppError("Invalid credentials", 400));
      // return res.status(400).json({ message: "Invalid credentials" });
    }
    const accessToken = generateToken(user._id, "1hr");
    const refreshToken = generateToken(user._id, "7d");

    user.password = undefined; // Sensitive information should not be returned
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Make the cookie inaccessible to JavaScript
      secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // Set expiry for the refresh token cookie (7 days)
      sameSite: "Strict", // Protect against CSRF by not sending cookie with cross-site requests
    });

    res.status(201).json({
      success: true,
      message: "Admin logged in successfully",
      token: accessToken,
      user: user,
    });
  } catch (error) {
    // console.error(error.message);
    // res.status(500).json({ message: "Server error" });
    next(error);
  }
};

const logoutUser = async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) {
    return next(new AppError("No refresh token in cookies"));
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true, //process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

const handleRefreshToken = async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return next(new AppError("Refresh token not found !", 401));
  }

  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(
        new AppError("There is something wrong with the refresh token", 401)
      );
    }
    const newAccessToken = generateToken(decoded._id, "1hr");
    const newRefreshToken = generateToken(decoded._id, "7d");
    res.cookies("refreshtoken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 1000,
      sameSite: "Strict",
    });

    res.json({ accessToken: newAccessToken });
  });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  handleRefreshToken,
  loginAdmin,
};
