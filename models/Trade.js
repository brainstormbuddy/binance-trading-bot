const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema({
  symbol: String,
  price: Number,
  qty: Number,
  time: Date,
});

module.exports = mongoose.model("Trade", tradeSchema);
