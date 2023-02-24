const express = require('express');
const router = express.Router();
const {isAuthenticateUser} = require("../middleware/auth");
const {processPayment, sendStripeApi} = require("../controllers/paymentController");

router.route("/payment/process").post(isAuthenticateUser, processPayment);
router.route("/stipeapikey").get(isAuthenticateUser, sendStripeApi);

module.exports = router;