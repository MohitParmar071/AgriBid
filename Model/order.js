// models/Order.js
const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: String, required: true }, // keep "5kg", "10kg"
  numericQty: { type: Number, required: true }, // numeric quantity (for calculations)
  image: { type: String },
  total: { type: Number, required: true }, // price * numericQty
  sellerEmail: { type: String }, // seller/farmer email
});

const orderSchema = new mongoose.Schema({
  buyerName: { type: String, required: true },
  buyerEmail: { type: String, required: true },
  buyerAddress: { type: String, required: true },
  cartItems: [cartItemSchema],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);