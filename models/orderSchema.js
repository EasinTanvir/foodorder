const mongoose = require("mongoose");
const createOrder = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        size: { type: String, required: true },
        price: { type: Number, required: true },

        _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "pizzas",
        },
      },
    ],
    customerInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
    shippingInfo: {
      userName: { type: String, required: true },

      address: { type: String, required: true },

      city: { type: String, required: true },

      country: { type: String, required: true },
    },

    // paymentResults: {
    //   id: { type: String },
    //   status: { type: String },
    //   update_time: { type: String },
    //   email_address: { type: String },
    // },
    itemPrice: {
      type: Number,
      default: 0,
    },
    taxPrice: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: String,
      enum: ["place", "confirm", "preparation", "delivery", "complete"],
      default: "confirm",
    },
    successDelivereds: {
      type: String,
      enum: ["place1", "confirm1", "preparation1", "delivery1", "complete1"],
      default: "place1",
    },
    deliveredAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("orders", createOrder);
