const uniqid = require("uniqid");
const SSLCommerz = require("ssl-commerz-node");
const PaymentSession = SSLCommerz.PaymentSession;
const HttpError = require("../helper/HttpError");
const orderSchema = require("../models/orderSchema");

const payment = new PaymentSession(
  true,
  process.env.STORE_ID,
  process.env.STORE_PASSWORD
);

const SSLCommerz_payment_init = async (req, res, next) => {
  const transactionId = `transaction_${uniqid()}`;

  const { productid } = req.query;

  const {
    orderItems,
    deliveryMethod,
    customerInfo,
    shippingInfo,
    itemPrice,
    totalPrice,
    taxPrice,
    shippingPrice,
  } = req.body;
  const { name, email } = customerInfo;
  const { userName, address, city, country, state, pinCode, method } =
    shippingInfo;

  if (productid) {
    const existingId = await orderSchema.findById(productid);

    if (
      !(existingId.orderItems.length >= 0) ||
      !(existingId.totalPrice > 0) ||
      !existingId.customerInfo ||
      !existingId.shippingInfo
    ) {
      const errors = new HttpError("All field ie required", 500);
      return next(errors);
    } else {
      try {
        payment.setUrls({
          success: `${process.env.SERVER_URL}/api/payment/checkout/success?transactionId=${existingId._id}`, // If payment Succeed
          fail: `${process.env.SERVER_URL}/api/payment/checkout/fail`, // If payment failed
          cancel: `${process.env.SERVER_URL}/api/payment/checkout/cancel`, // If user cancel payment
          ipn: `${process.env.SERVER_URL}/ipn`, // SSLCommerz will send http post request in this link
        });

        payment.setOrderInfo({
          total_amount: existingId.totalPrice, // Number field
          currency: "BDT", // Must be three character string
          tran_id: existingId._id, // Unique Transaction id
          emi_option: 0, // 1 or 0
          multi_card_name: "internetbank", // Do not Use! If you do not customize the gateway list,
          allowed_bin: "371598,371599,376947,376948,376949", // Do not Use! If you do not control on transaction
          emi_max_inst_option: 3, // Max instalment Option
          emi_allow_only: 0, // Value is 1/0, if value is 1 then only EMI transaction is possible
        });

        payment.setCusInfo({
          name,
          email,
          add1: "66/A Midtown",
          add2: "Andarkilla",
          city,
          state: state,
          postcode: pinCode,
          country,
          phone: "0101",
          fax: "Customer_fax_id",
        });

        payment.setShippingInfo({
          method: method, //Shipping method of the order. Example: YES or NO or Courier
          num_item: 2,
          name: userName,
          add1: "66/A Midtown",
          add2: "Andarkilla",
          city,
          state: state,
          postcode: pinCode,
          country,
        });
        payment.setProductInfo({
          product_name: "Computer",
          product_category: "Electronics",
          product_profile: "general",
        });

        payment.paymentInit().then(async (response) => {
          // console.log(response);
          res.send(response["GatewayPageURL"]);
          // paymentDone = response["status"] === "SUCCESS";
        });
      } catch (err) {
        const errors = new HttpError("payment failed", 500);
        return next(errors);
      }
    }
  } else {
    if (
      !(orderItems.length >= 0) ||
      !(totalPrice > 0) ||
      !customerInfo ||
      !shippingInfo
    ) {
      const errors = new HttpError("All field ie required", 500);
      return next(errors);
    } else {
      try {
        payment.setUrls({
          success: `${process.env.SERVER_URL}/api/payment/checkout/success?transactionId=${transactionId}`, // If payment Succeed
          fail: `${process.env.SERVER_URL}/api/payment/checkout/fail`, // If payment failed
          cancel: `${process.env.SERVER_URL}/api/payment/checkout/cancel`, // If user cancel payment
          ipn: `${process.env.SERVER_URL}/ipn`, // SSLCommerz will send http post request in this link
        });

        payment.setOrderInfo({
          total_amount: totalPrice, // Number field
          currency: "BDT", // Must be three character string
          tran_id: transactionId, // Unique Transaction id
          emi_option: 0, // 1 or 0
          multi_card_name: "internetbank", // Do not Use! If you do not customize the gateway list,
          allowed_bin: "371598,371599,376947,376948,376949", // Do not Use! If you do not control on transaction
          emi_max_inst_option: 3, // Max instalment Option
          emi_allow_only: 0, // Value is 1/0, if value is 1 then only EMI transaction is possible
        });
        // const { name, email } = customerInfo;
        // const { userName, address, city, country, state, pinCode, method } =
        //   shippingInfo;
        payment.setCusInfo({
          name,
          email,
          add1: "66/A Midtown",
          add2: "Andarkilla",
          city,
          state: state,
          postcode: pinCode,
          country,
          phone: "0101",
          fax: "Customer_fax_id",
        });

        payment.setShippingInfo({
          method: method, //Shipping method of the order. Example: YES or NO or Courier
          num_item: 2,
          name: userName,
          add1: "66/A Midtown",
          add2: "Andarkilla",
          city,
          state: state,
          postcode: pinCode,
          country,
        });

        payment.setProductInfo({
          product_name: "Computer",
          product_category: "Electronics",
          product_profile: "general",
        });

        payment.paymentInit().then(async (response) => {
          // console.log(response);
          res.send(response["GatewayPageURL"]);
          // paymentDone = response["status"] === "SUCCESS";

          const newOrder = new orderSchema({
            _id: transactionId,
            user: req.userData.id,
            orderItems,
            customerInfo,
            shippingInfo,
            itemPrice,
            totalPrice,
            taxPrice,
            shippingPrice,
          });

          const save = await newOrder.save();
        });
      } catch (err) {
        const errors = new HttpError("payment faileds", 500);
        return next(errors);
      }
    }
  }
};

const SSLCommerz_payment_success = async (req, res, next) => {
  const { transactionId } = req.query;

  if (!transactionId) {
    const errors = new HttpError("transactionId must be required", 500);
    return next(errors);
  } else {
    const currentOrder = orderSchema.findByIdAndUpdate(transactionId, {
      isPaid: true,
      updatedAt: Date.now(),
    });

    currentOrder.exec((err, result) => {
      if (err) console.log(err);
      res.redirect(
        `${process.env.CLIENT_URL}/checkout/success/${transactionId}`
      );
    });
  }
};
const SSLCommerz_payment_fail = async (req, res, next) => {
  res.redirect(`${process.env.CLIENT_URL}/checkout/fail`);
};
const SSLCommerz_payment_cancel = async (req, res, next) => {
  res.redirect(`${process.env.CLIENT_URL}/checkout/cancel`);
};

module.exports = {
  SSLCommerz_payment_init,
  SSLCommerz_payment_success,
  SSLCommerz_payment_fail,
  SSLCommerz_payment_cancel,
};
