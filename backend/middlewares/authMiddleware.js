const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

// const authMiddleware = asyncHandler(async (req, res, next) => {
//   let token;
//   if (req?.headers?.authorization?.startsWith("Bearer")) {
//     token = req.headers.authorization.split(" ")[1];
//     // console.log("auth of token", token);
//     try {
//       if (token) {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findById(decoded?.id);
//         req.user = user;
//         next();
//       }
//     } catch (error) {
//       throw new Error("Not authorized token expired, Please login again");
//     }
//   } else {
//     throw new Error("There is no token attached to header");
//   }
// });

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    console.log(token);
    if (!token) {
      return next(new AppError("No token, authorization denied", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded?.id);

    // Attach the uset information to the request object
    req.user = user;
    next();
  } catch (error) {
    next(new AppError("Invalid or expired token", 401));
  }
};

const isAdmin = async (req, res, next) => {
  const { email } = req.user;
  console.log(email);
  const adminUser = await User.findOne({ email });
  if (adminUser.role !== "admin") {
    return next(new AppError("You are not an admin !", 400));
  } else {
    next();
  }
};

module.exports = { authMiddleware, isAdmin };
