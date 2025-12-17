const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// If CLOUDINARY_URL is provided, it typically overrides the above,
// but let's ensure we parse it if needed or just rely on the env var being set correctly by the user.
// The user gave CLOUDINARY_URL directly. Next-Cloudinary and the node SDK can often auto-configure from CLOUDINARY_URL too.
// However, explicit config is safer if we decompose the URL.
// But wait, the user provided the full CLOUDINARY_URL.
// The cloudinary SDK automatically picks up CLOUDINARY_URL environment variable if it exists.
// So we might just need to require it.

module.exports = cloudinary;
