const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const auth = require("../middleware/auth");

// Create review (optional auth)
router.post("/", auth.optional, reviewController.createReview);

// Get reviews for a product
router.get("/product/:productId", reviewController.getReviewsByProduct);

// Delete a review (protected)
router.delete("/:id", auth.protect, reviewController.deleteReview);

module.exports = router;
