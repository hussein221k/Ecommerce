const express = require("express");
const router = express.Router();
const favController = require("../controllers/favoriteController");
const auth = require("../middleware/auth");

// Add favorite (protected)
router.post("/add", auth.protect, favController.addFavorite);
router.post("/", auth.protect, favController.addFavorite); // Alternative route

// Remove favorite (protected)
router.post("/remove", auth.protect, favController.removeFavorite);
router.delete("/", auth.protect, favController.removeFavorite); // Alternative route

// Check if product is favorited (protected)
router.get("/check/:productId", auth.protect, favController.checkFavorite);

// Get current user's favorites (protected)
router.get("/me", auth.protect, favController.getMyFavorites);

// Get favorites by user ID (protected)
router.get("/user/:userId", auth.protect, favController.getFavoritesByUser);

module.exports = router;
