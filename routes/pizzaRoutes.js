const express = require("express");
const router = express.Router();
const createPizz = require("../controllers/createPizza");

router.route("/create").post(createPizz.createPizza);
router.route("/").get(createPizz.fetchPizza);

module.exports = router;
