const mongoose = require("mongoose");
const createPizza = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  isConfirm: {
    type: Boolean,
    default: false,
  },
  isPrepared: {
    type: Boolean,
    default: false,
  },
  isDelivered: {
    type: Boolean,
    default: false,
  },
  isComplete: {
    type: Boolean,
    default: false,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("pizzas", createPizza);
