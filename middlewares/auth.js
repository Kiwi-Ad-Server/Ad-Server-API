/**
 * auth.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

// Middleware to validate token and attach user to request
exports.validateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ error: "A token is required for authentication" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Retrieve the full user document and attach it to the request
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    req.user = user;
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }

  next();
};

// Middleware to check user role
exports.authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Unauthorized access" });
    }
    next();
  };
};
