/**
 * authRoutes.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const express = require("express");
const authController = require("../controllers/authController");
const { validateToken } = require("../middlewares/auth.js");
const UserModel = require("../models/User");

const router = express.Router();

UserModel.methods(["get", "put", "delete", "post"]); // Enable all methods for the user model
UserModel.register(router, "/users");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.put("/update", authController.updateUserById);
router.delete("/", authController.deleteUserById);
router.get("/", authController.getUsers);
router.post("/logout", authController.logout);
router.get("/some-protected-route", (req, res) => {
  if (req.session.userId) {
    res.send("You are logged in");
  } else {
    res.status(401).send("You are not logged in");
  }
});

router.get("/api/username-check", authController.isUsernameTaken);
router.get("/validate-session", validateToken, (req, res) => {
  // If middleware passes, token is valid, and req.user is populated
  res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      role: req.user.role,
    },
  });
});

module.exports = router;
