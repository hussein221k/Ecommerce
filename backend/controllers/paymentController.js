const Transaction = require("../models/Transaction");
const Order = require("../models/Order");

exports.bankAlAhlyPayment = async (req, res) => {
  try {
    const { amount, userId, orderId } = req.body;
    if (!amount || !orderId || !userId)
      return res
        .status(400)
        .json({
          success: false,
          message: "amount, orderId, and userId required",
        });

    // Simulate calling BankAlAhly API
    const txnId = `BAA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Save to DB
    const transaction = await Transaction.create({
      user: userId,
      order: orderId,
      amount,
      provider: "BankAlAhly",
      transactionId: txnId,
      status: "Completed",
    });

    // Update order payment status
    await Order.findByIdAndUpdate(orderId, { paymentStatus: "completed" });

    res.status(200).json({
      success: true,
      data: transaction,
      message: "Payment processed successfully via Bank Al Ahly",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Vodafone Cash payment
exports.vodafoneCashPayment = async (req, res) => {
  try {
    const { amount, userId, orderId, phone } = req.body;
    if (!amount || !orderId || !userId || !phone)
      return res
        .status(400)
        .json({
          success: false,
          message: "amount, orderId, userId, and phone are required",
        });

    // Validate Egyptian phone number format
    const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Egyptian phone number format",
      });
    }

    // Simulate calling Vodafone Cash API
    const txnId = `VFC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Save to DB
    const transaction = await Transaction.create({
      user: userId,
      order: orderId,
      amount,
      provider: "VodafoneCash",
      transactionId: txnId,
      phone: phone,
      status: "Completed",
    });

    // Update order payment status
    await Order.findByIdAndUpdate(orderId, { paymentStatus: "completed" });

    res.status(200).json({
      success: true,
      data: transaction,
      message: "Payment processed successfully via Vodafone Cash",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
