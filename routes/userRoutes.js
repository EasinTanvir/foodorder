const express = require("express");
const router = express.Router();
const userSchema = require("../controllers/userCntrl");

router.route("/signup").post(userSchema.createUser);
router.route("/login").post(userSchema.signIn);

module.exports = router;
