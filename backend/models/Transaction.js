const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    provider: {
      type: String,
      enum: ["BankAlAhly", "VodafoneCash"],
      required: true,
    },
    phone: {
      type: String, // For Vodafone Cash
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Completed", // Simulating instant success for now
    },
    // phone: {
    //   type: String, // For Vodafone Cash
    // },
    metadata: {
      type: Object, // Store any extra provider response data
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
