const express = require("express");
const {
  createOrder,
  getUserOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
} = require("../controllers/orderController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Protected routes
router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getUserOrders);
router.get("/:id", authMiddleware, getOrder);
router.put("/:id", authMiddleware, updateOrderStatus);
router.put("/:id/cancel", authMiddleware, cancelOrder);

// Admin route (protected)
router.get("/admin/all", authMiddleware, getAllOrders);

module.exports = router;
