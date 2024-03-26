/**
 * userController.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const User = require("../models/User");
const Advertiser = require("../models/Advertiser");
const Publisher = require("../models/Publisher");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// User login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = generateToken(user);
    req.session.userId = user.id;
    req.session.role = user.role;
    req.session.token = token;
    res.json({
      token,
      user: { username: user.username, email, role: user.role },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error during login.");
  }
};

// Register a new user
const register = async (req, res) => {
  const {
    username,
    email,
    password,
    role,
    company,
    website,
    billingInfo,
    platformName,
    websiteUrl,
    contactName,
    trafficInfo,
    paymentInfo,
    audienceDemographics,
    platformType,
  } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      const matchedField = existingUser.email === email ? "email" : "username";
      return res
        .status(400)
        .json({ message: `A user with this ${matchedField} already exists.` });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    let user = new User({ username, email, password, role });
    await user.save({ session });

    let additionalProfile;
    if (user.role === "Advertiser") {
      additionalProfile = new Advertiser({
        user: user._id,
        company,
        website,
        billingInfo,
      });
      await additionalProfile.save({ session });
    } else if (user.role === "Publisher") {
      additionalProfile = new Publisher({
        user: user._id,
        platformName,
        websiteUrl,
        contactName,
        trafficInfo,
        paymentInfo,
        audienceDemographics,
        platformType,
      });
      await additionalProfile.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    const token = generateToken(user);
    req.session.token = token;
    req.session.userId = user._id;
    req.session.role = user.role;
    res.status(201).json({
      message: "Successfully registered!",
      token,
      user: { username, email, role },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error.message);
    res.status(500).send("Server Error during registration.");
  }
};

// Logout from current session
const logout = (req, res) => {
  req.session.destroy(() => {
    res
      .clearCookie("connect.sid", { path: "/api/auth" })
      .json({ msg: "Logged out!" });
  });
};

// Check if username is taken
const isUsernameTaken = async (req, res) => {
  const { username } = req.query;
  try {
    const userExists = await User.findOne({ username });
    res.json({ available: !userExists });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error during username check.");
  }
};

// Retrieve a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password'); // Exclude password from the result

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
// Update a user by ID
exports.updateUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    // Optional: Validate the updates against a schema

    // Find the user and update it
    const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// Delete a user by ID
exports.deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const userToDelete = await User.findById(userId);

    // Check if the user to delete exists
    if (!userToDelete) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if the authenticated user is an admin
    if (req.user.role === "Admin") {
      // Admin can delete any user
      await User.findByIdAndDelete(userId);
      return res.status(200).json({ success: true, message: "User deleted successfully" });
    } else {
      // Non-admin users can only delete their own account
      if (req.user._id.toString() !== userId) {
        return res.status(403).json({ success: false, message: "You are not authorized to delete this user" });
      }
      await User.findByIdAndDelete(userId);
      return res.status(200).json({ success: true, message: "User deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Helper function to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};




module.exports = { register, login, logout, isUsernameTaken };
