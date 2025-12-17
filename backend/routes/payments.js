const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const auth = require("../middleware/auth");

// BankAlAhly payment (mock)
router.post("/bankalahly", auth.protect, paymentController.bankAlAhlyPayment);

// Vodafone Cash payment
router.post("/vodafonecash", auth.protect, paymentController.vodafoneCashPayment);

module.exports = router;
