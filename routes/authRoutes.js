/**
 * authRoutes.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Could not log out, please try again");
    }
    res.send("Logged out successfully");
  });
});
router.get("/some-protected-route", (req, res) => {
  if (req.session.userId) {
    res.send("You are logged in");
  } else {
    res.status(401).send("You are not logged in");
  }
});

router.get("/api/username-check", authController.isUsernameTaken);

module.exports = router;
