const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const connectDB = require("./config/db");

dotenv.config();

const seedProducts = async () => {
  try {
    await connectDB();

    // Clear existing products
    await Product.deleteMany({});

    const categories = ["بناطيل", "سويت شيرت", "هودي", "ترنج"];

    const products = Array.from({ length: 72 }, (_, i) => {
      const id = i + 1;
      const category = categories[i % categories.length];

      return {
        id: id,
        name: `منتج رقم ${id}`,
        price: 20.99 + i * 5,
        description: `هذا وصف توضيحي للمنتج رقم ${id}. يتم استخدامه لتوضيح شكل وتصميم المتجر الإلكتروني ونظام العرض الجديد.`,
        image: `/images/${id}.jpg`,
        category: category,
        sizes: ["S", "M", "L", "XL"],
        rating: 4.0 + (id % 10) / 10,
        stock: 100,
        reviews: [
          {
            user: "مستخدم تجريبي",
            comment: "هذا المنتج يبدو رائعاً في التصميم الجديد!",
            rating: 5,
          },
        ],
      };
    });

    await Product.insertMany(products);
    console.log(
      `✅ Successfully seeded ${products.length} products to MongoDB`
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
    process.exit(1);
  }
};

seedProducts();
