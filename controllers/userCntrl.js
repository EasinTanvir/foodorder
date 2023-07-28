const userSchema = require("../models/userSchema");
const HttpError = require("../helper/HttpError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createUser = async (req, res, next) => {
  const { email, password } = req.body;

  let exisitingUser;

  try {
    exisitingUser = await userSchema.findOne({ email });
  } catch (err) {
    const errors = new HttpError("find existing user failed", 500);
    return next(errors);
  }

  if (exisitingUser) {
    const errors = new HttpError("Sorry email already taken", 500);
    return next(errors);
  }

  if (password.trim().length < 6) {
    const errors = new HttpError("Password must be 6 character", 500);
    return next(errors);
  }

  let hashPass;

  try {
    hashPass = await bcrypt.hash(password, 12);
  } catch (err) {
    const errors = new HttpError("hash password failed", 500);
    return next(errors);
  }

  let user;

  try {
    user = await userSchema.create({ ...req.body, password: hashPass });
  } catch (err) {
    const errors = new HttpError("create user failed", 500);
    return next(errors);
  }

  let token;
  try {
    token = jwt.sign(
      {
        id: user._id,
        userName: user.userName,
        isAdmin: user.isAdmin,
        token: token,
      },
      process.env.TOKEN_KEY,
      { expiresIn: "24h" }
    );
  } catch (err) {
    const errors = new HttpError("create token failed", 500);
    return next(errors);
  }

  res.status(200).json({
    id: user._id,
    userName: user.userName,
    email: user.email,
    token: token,
    isAdmin: user.isAdmin,
  });
};
const signIn = async (req, res, next) => {
  const { userName, password } = req.body;

  let user;

  try {
    user = await userSchema.findOne({
      $or: [{ userName }, { email: userName }],
    });
  } catch (err) {
    const errors = new HttpError("find user failed", 500);
    return next(errors);
  }

  if (!user) {
    const errors = new HttpError("Sorry no user found", 500);
    return next(errors);
  }

  let hashPass;

  try {
    hashPass = await bcrypt.compare(password, user.password);
  } catch (err) {
    const errors = new HttpError("compare  password failed", 500);
    return next(errors);
  }

  if (!hashPass) {
    const errors = new HttpError("Invalid password", 500);
    return next(errors);
  }

  let token;
  try {
    token = jwt.sign(
      {
        id: user._id,
        userName: user.userName,
        isAdmin: user.isAdmin,
        token: token,
      },
      process.env.TOKEN_KEY,
      { expiresIn: "24h" }
    );
  } catch (err) {
    const errors = new HttpError("create token failed", 500);
    return next(errors);
  }

  res.status(200).json({
    id: user._id,
    userName: user.userName,
    email: user.email,
    token: token,
    isAdmin: user.isAdmin,
  });
};

module.exports = {
  createUser,
  signIn,
};
