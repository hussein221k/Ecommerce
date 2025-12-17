const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const connectDB = require("./config/db");

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const adminExists = await User.findOne({ email: "admin@ecommerce.com" });
    if (adminExists) {
      console.log("❌ Admin user already exists!");
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: "Admin",
      email: "admin@ecommerce.com",
      password: "Admin@123456", // Change this in production!
      phone: "1234567890",
      role: "admin",
      isActive: true,
      address: {
        street: "Admin Street",
        city: "Admin City",
        state: "Admin State",
        zipCode: "00000",
        country: "Admin Country",
      },
    });

    console.log("✅ Admin user created successfully!");
    console.log("\n📋 Admin Credentials:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`📧 Email:    admin@ecommerce.com`);
    console.log(`🔐 Password: Admin@123456`);
    console.log(`👤 Name:     Admin`);
    console.log(`🔑 Role:     admin`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n⚠️  IMPORTANT: Change this password in production!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
