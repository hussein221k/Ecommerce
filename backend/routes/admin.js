const express = require("express");
const {
  adminLogin,
  getDashboardStats,
  getAllUsers,
  deleteUser,
} = require("../controllers/adminController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Public route
router.post("/login", adminLogin);

// Protected admin routes
router.get("/stats", authMiddleware, getDashboardStats);
router.get("/users", authMiddleware, getAllUsers);
router.delete("/users/:id", authMiddleware, deleteUser);

module.exports = router;
