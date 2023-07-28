const orderSchema = require("../models/orderSchema");
const HttpError = require("../helper/HttpError");

const fetchOrders = async (req, res, next) => {
  let order;
  console.log(req.userData.id);
  try {
    order = await orderSchema.find({ user: req.userData.id });
  } catch (err) {
    const errors = new HttpError("fetch order failed", 500);
    return next(errors);
  }
  res.status(200).json(order);
};

const fetchAllOrders = async (req, res, next) => {
  let order;

  try {
    order = await orderSchema.find();
  } catch (err) {
    const errors = new HttpError("fetch order failed", 500);
    return next(errors);
  }
  res.status(200).json(order);
};

const singleOrders = async (req, res, next) => {
  let order;
  const { id } = req.params;
  try {
    order = await orderSchema.findById(id);
  } catch (err) {
    const errors = new HttpError("fetch order failed", 500);
    return next(errors);
  }

  res.status(200).json(order);
};

const updateOrders = async (req, res, next) => {
  const { data1, data2 } = req.body;

  const io = req.app.get("name");
  io.emit("message", { delivery: data1 });

  let order;
  const { id } = req.params;

  try {
    order = await orderSchema.findById(id);
  } catch (err) {
    const errors = new HttpError("fetch order failed to update", 500);
    return next(errors);
  }

  order.isDelivered = data1;
  order.successDelivereds = data2;

  let result;
  try {
    result = await order.save();
  } catch (err) {
    const errors = new HttpError("update failed", 500);
    return next(errors);
  }

  res.status(200).json(result);
};
module.exports = {
  fetchOrders,
  singleOrders,
  fetchAllOrders,
  updateOrders,
};
