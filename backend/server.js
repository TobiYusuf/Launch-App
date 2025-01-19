const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("../backend/config/db");
const authRoutes = require("../backend/routes/authRoutes");
const categoryRoutes = require('./routes/foodCategoryRoute')
const foodRoutes = require('./routes/foodMenuRoute')
const orderRoutes = require("./routes/orderRoutes")
const morgan = require("morgan");
const cookieParser = require('cookie-parser');

dotenv.config(); // Load environment variables from .env file
const app = express();
connectDB();

app.use(morgan("dev"));
app.use(express.json()); // middleware to parse JSON bodies
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/food-category", categoryRoutes);
app.use("/api/food-menu", foodRoutes);
app.use("/api/order", orderRoutes);

// Example route
app.get("/", (req, res) => {
  res.send("Hello world from the Lunch App API");
});

app.use((err, req, res, next) => {
  console.error(err); // Logs the full stack trace for debugging

  // if the error is operational, send the error message and status code
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      status: err.status || 500,
      statusCode: err.statusCode,
      message: err.message || "Something went wrong",
    });
  }
  // return a response with the error status code and message
  res.status(err.status || 500).json({
    message: err.message || "An unexpected error occurred.",
  });
});

// setup a port and start serve
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
