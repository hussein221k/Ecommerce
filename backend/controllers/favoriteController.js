const Favorite = require("../models/Favorite");

// Add favorite
exports.addFavorite = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId; // Get from auth middleware
    
    if (!productId)
      return res
        .status(400)
        .json({ success: false, message: "productId is required" });

    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });

    // Check if favorite already exists
    const existing = await Favorite.findOne({ user: userId, product: productId });
    if (existing) {
      return res.status(200).json({ 
        success: true, 
        message: "Already favorited",
        data: existing 
      });
    }

    // Create new favorite
    const fav = await Favorite.create({
      user: userId,
      product: productId,
    });

    // Populate product details
    await fav.populate("product");

    res.status(201).json({ success: true, data: fav });
  } catch (error) {
    if (error.code === 11000)
      return res
        .status(409)
        .json({ success: false, message: "Already favorited" });
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove favorite
exports.removeFavorite = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId; // Get from auth middleware
    
    if (!productId)
      return res
        .status(400)
        .json({ success: false, message: "productId is required" });

    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });

    const deleted = await Favorite.findOneAndDelete({ 
      user: userId, 
      product: productId 
    });
    
    if (!deleted) {
      return res.status(404).json({ 
        success: false, 
        message: "Favorite not found" 
      });
    }

    res.status(200).json({ success: true, message: "Removed from favorites" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get favorites for a user
exports.getFavoritesByUser = async (req, res) => {
  try {
    const userId = req.userId || req.params.userId; // Support both auth middleware and params
    
    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });

    const favs = await Favorite.find({ user: userId })
      .populate("product")
      .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, count: favs.length, data: favs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get current user's favorites (using auth middleware)
exports.getMyFavorites = async (req, res) => {
  try {
    const userId = req.userId;
    
    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });

    const favs = await Favorite.find({ user: userId })
      .populate("product")
      .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, count: favs.length, data: favs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Check if product is favorited by current user
exports.checkFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.userId;
    
    if (!productId)
      return res
        .status(400)
        .json({ success: false, message: "productId is required" });

    if (!userId)
      return res.status(200).json({ success: true, isFavorite: false });

    const fav = await Favorite.findOne({ user: userId, product: productId });
    res.status(200).json({ success: true, isFavorite: !!fav });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
