const express = require("express");
const {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
} = require("../controllers/cartController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Protected routes
router.get("/", authMiddleware, getCart);
router.post("/add", authMiddleware, addToCart);
router.post("/remove", authMiddleware, removeFromCart);
router.put("/update", authMiddleware, updateCartItem);
router.delete("/clear", authMiddleware, clearCart);

module.exports = router;
