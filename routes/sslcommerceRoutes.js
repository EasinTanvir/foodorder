const express = require("express");
const router = express.Router();
const SSL_Commercce = require("../controllers/sslCommerceCtrl");
const protectRoutes = require("../helper/protectRoutes");

router
  .route("/checkout")
  .post(protectRoutes, SSL_Commercce.SSLCommerz_payment_init);
router.post("/checkout/success", SSL_Commercce.SSLCommerz_payment_success);
router.post("/checkout/fail", SSL_Commercce.SSLCommerz_payment_fail);
router.post("/checkout/cancel", SSL_Commercce.SSLCommerz_payment_cancel);

module.exports = router;
