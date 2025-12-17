const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    req.userId = decoded.id;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Admin middleware - must be used after protect middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied. Admin only." });
};

// optional: attach user if token present, otherwise continue anonymously
const optional = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) return next();
    const token = header.split(" ")[1];
    if (!token) return next();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    req.userId = decoded.id;
    return next();
  } catch (error) {
    // don't block on invalid token for optional
    return next();
  }
};

// Export protect as default middleware for backward compatibility
module.exports = protect;
module.exports.protect = protect;
module.exports.admin = admin;
module.exports.optional = optional;
