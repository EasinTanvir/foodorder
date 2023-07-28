const pizzaSchema = require("../models/createPizza");
const HttpError = require("../helper/HttpError");
const createPizza = async (req, res, next) => {
  let pizza;

  try {
    pizza = await pizzaSchema.create(req.body);
  } catch (err) {
    const errors = new HttpError("create pizza failed", 500);
    return next(errors);
  }
  res.status(200).json(pizza);
};

const fetchPizza = async (req, res, next) => {
  let pizza;

  try {
    pizza = await pizzaSchema.find();
  } catch (err) {
    const errors = new HttpError("create pizza failed", 500);
    return next(errors);
  }
  res.status(200).json(pizza);
};

module.exports = {
  createPizza,
  fetchPizza,
};
