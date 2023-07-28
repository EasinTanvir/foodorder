const express = require("express");
const router = express.Router();
const orderCntrl = require("../controllers/orderCntrl");
const protectRoutes = require("../helper/protectRoutes");
const adminRoutes = require("../helper/adminRoutes");

router.route("/").get(protectRoutes, orderCntrl.fetchOrders);
router.route("/admin").get(protectRoutes, orderCntrl.fetchAllOrders);
router.route("/:id").get(protectRoutes, orderCntrl.singleOrders);
router.route("/:id").patch(protectRoutes, adminRoutes, orderCntrl.updateOrders);

module.exports = router;
