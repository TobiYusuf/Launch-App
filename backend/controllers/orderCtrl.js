const Order = require("../models/orderModel");
const Food = require("../models/foodModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

// Create an order (add food to the cart)
const createOrder = async (req, res) => {
  const { _id: userId } = req.user; // {user object same as is in the DB}
  const { foodItems } = req.body; // {  foodItems: [{ foodId: 'food_id', quantity: 2 }] }
  // console.log(foodItems);
  if (!userId || !foodItems || foodItems.length === 0) {
    // return res.status(400).json({ message: 'Invalid input' });
    return next(new AppError("Invalid input", 400));
  }

  try {
    // Fetch the user's budget (to validate against total order price)
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const items = [];
    let totalPrice = 0;
    // Loop through selected food items
    for (const item of foodItems) {
      console.log("**************", item.food);
      const food = await Food.findOne({ foodName: item.food });
      if (!food) {
        return res
          .status(404)
          .json({ message: `Food item not found: ${item.food}` });
      }
      const totalItemPrice = food.price * item.quantity;
      items.push({
        foodId: food._id,
        quantity: item.quantity,
        price: totalItemPrice,
      });
      totalPrice += totalItemPrice;
    }
    // console.log(items);
    // console.log(totalPrice);
    // Check if the user's budget allows them to place the order
    // 2500 < 2600
    if (user.budget < totalPrice) {
      return res.status(400).json({ message: "You have exceeded your budget" });
    }
    // Create the order
    // const order = new Order({
    //   user: userId,
    //   items,
    //   totalPrice,
    // });
    // await order.save();
    const order = await Order.create({
      user: userId,
      items,
      totalPrice,
    });
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// View the user's cart or order
const viewCart = async (req, res, next) => {
  const { _id: userId } = req.user;

  try {
    const order = await Order.findOne({
      user: userId,
      status: "pending",
    });
    if (!order) {
      return next(new AppError("No pending order found for this user", 404));
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};



module.exports = { createOrder, viewCart };
