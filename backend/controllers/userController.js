const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Register user
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validate required fields
    if (!name || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, password, and phone are required",
      });
    }

    // Validate phone format (Egyptian)
    const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Egyptian phone number format (should be 11 digits starting with 01)",
      });
    }

    // Check if user exists by phone (phone is unique)
    let user = await User.findOne({ phone });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "Phone number already registered" });
    }

    // If email provided, check if it's already used
    if (email) {
      const emailUser = await User.findOne({ email });
      if (emailUser) {
        return res
          .status(400)
          .json({ success: false, message: "Email already registered" });
      }
    }

    // Create user (email is optional)
    user = await User.create({ name, email: email || null, password, phone });

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    // Validate required fields - phone and password are required
    if (!phone || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Phone number and password are required" });
    }

    // Validate phone format
    const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Egyptian phone number format",
      });
    }

    // Find user by phone (phone is unique and required)
    let user = await User.findOne({ phone }).select("+password");

    // If not found by phone and email provided, try email (for backward compatibility)
    if (!user && email) {
      user = await User.findOne({ email }).select("+password");
      // If found by email but phone doesn't match, reject
      if (user && user.phone !== phone) {
        return res
          .status(401)
          .json({ success: false, message: "Phone number does not match account" });
      }
    }

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Ensure user's phone is set
    if (user.phone !== phone) {
      user.phone = phone;
      await user.save();
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.userId, req.body, {
      new: true,
      runValidators: true,
    });
    res
      .status(200)
      .json({ success: true, message: "Profile updated", data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
