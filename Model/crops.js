// Model: Model/crops.js
const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema({
  name: { type: String, required: true },
  Type:{type: String , default:"buy"},
  price: { type: Number, required: true },       // starting/base price (₹)
  quantity: { type: String, required: true },    // e.g. "50kg"
  seller: { type: String, required: true },
  email: { type: String, required: true },       // seller email
  contact: { type: Number, required: true },
  city: { type: String, required: true },
  imageUrl: { type: String, required: true },
  upi: { type: String },

  // bidding fields
  highestBid: { type: Number, default: 0 },
  highestBidder: { type: String, default: null },
  highestBidderEmail: { type: String, default: null },

  // auction times & sold flag
  startTime: { type: Date, default: null }, // when first bid placed
  endTime: { type: Date, default: null },   // set to startTime + 3 days
  sold: { type: Boolean, default: false }
}, { timestamps: true });


module.exports = mongoose.model("Crops", cropSchema);

