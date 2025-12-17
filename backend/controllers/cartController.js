const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Get user cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.userId }).populate(
      "items.productId"
    );
    if (!cart) {
      cart = await Cart.create({ userId: req.userId, items: [] });
    }
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, selectedSize } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      cart = await Cart.create({ userId: req.userId, items: [] });
    }

    // Check if item already in cart
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, selectedSize });
    }

    // Calculate total price
    cart.totalPrice = 0;
    for (const item of cart.items) {
      const prod = await Product.findById(item.productId);
      cart.totalPrice += prod.price * item.quantity;
    }

    await cart.save();
    res
      .status(200)
      .json({ success: true, message: "Item added to cart", data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    // Calculate total price
    cart.totalPrice = 0;
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      cart.totalPrice += product.price * item.quantity;
    }

    await cart.save();
    res
      .status(200)
      .json({ success: true, message: "Item removed from cart", data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity < 1) {
      return res
        .status(400)
        .json({ success: false, message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not in cart" });
    }

    item.quantity = quantity;

    // Calculate total price
    cart.totalPrice = 0;
    for (const cartItem of cart.items) {
      const product = await Product.findById(cartItem.productId);
      cart.totalPrice += product.price * cartItem.quantity;
    }

    await cart.save();
    res
      .status(200)
      .json({ success: true, message: "Cart updated", data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { userId: req.userId },
      { items: [], totalPrice: 0 },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, message: "Cart cleared", data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
