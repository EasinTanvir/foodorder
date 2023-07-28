const HttpError = require("./HttpError");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  let token;

  try {
    token = req.headers.authorization.split(" ")[1];

    if (!token) {
      const errors = new HttpError("Invalid token failed", 500);
      return next(errors);
    }

    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    req.userData = {
      id: decodedToken.id,
      userName: decodedToken.userName,
      isAdmin: decodedToken.isAdmin,
    };
    next();
  } catch (err) {
    const errors = new HttpError("Invalid token", 500);
    return next(errors);
  }
};
