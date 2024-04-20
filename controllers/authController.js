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
const logger = require("../utils/logger.js");

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
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
    res
      .status(200)
      .json({ user: { username: user.username, email, role: user.role }, token });
  } catch (error) {
    console.log(error.message);
    logger.error(error.message);
    res.status(500).send("Server error during login.");
  }
};

// Register a new user
// const register = async (req, res) => {
//   const {
//     username,
//     email,
//     password,
//     role,
//     company,
//     website,
//     billingInfo,
//     platformName,
//     websiteUrl,
//     contactName,
//     trafficInfo,
//     paymentInfo,
//     audienceDemographics,
//     platformType,
//   } = req.body;

//   try {
//     const existingUser = await User.findOne({ $or: [{ email }, { username }] });
//     if (existingUser) {
//       const matchedField = existingUser.email === email ? "email" : "username";
//       return res
//         .status(400)
//         .json({ message: `A user with this ${matchedField} already exists.` });
//     }

//     const session = await mongoose.startSession();
//     session.startTransaction();

//     let user = new User({ username, email, password, role });
//     await user.save({ session });

//     let additionalProfile;
//     if (user.role === "Advertiser") {
//       additionalProfile = new Advertiser({
//         user: user._id,
//         company,
//         website,
//         billingInfo,
//       });
//       await additionalProfile.save({ session });
//     } else if (user.role === "Publisher") {
//       additionalProfile = new Publisher({
//         user: user._id,
//         platformName,
//         websiteUrl,
//         contactName,
//         trafficInfo,
//         paymentInfo,
//         audienceDemographics,
//         platformType,
//       });
//       await additionalProfile.save({ session });
//     }

//     await session.commitTransaction();
//     session.endSession();

//     const token = generateToken(user);
//     req.session.token = token;
//     req.session.userId = user._id;
//     req.session.role = user.role;
//     res.status(201).json({
//       message: "Successfully registered!",
//       token,
//       user: { username, email, role },
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error(error.message);
//     res.status(500).send("Server Error during registration.");
//   }
// };
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

  // Declare the session variable outside the try block to ensure it's scoped correctly.
  let session = null; // Initialize session variable

  try {
    session = await mongoose.startSession(); // Start the session and assign it
    session.startTransaction();

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    }).session(session);
    if (existingUser) {
      const matchedField = existingUser.email === email ? "email" : "username";
      await session.abortTransaction(); // Ensure to abort the transaction if user exists
      session.endSession(); // End the session
      return res
        .status(400)
        .json({ message: `A user with this ${matchedField} already exists.` });
    }

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
    }
    if (additionalProfile) {
      await additionalProfile.save({ session });
    }

    await session.commitTransaction();
    const token = generateToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
    res.status(201).json({
      message: "Successfully registered!",
      token,
      user: { username, email, role },
    });
  } catch (error) {
    if (session) {
      await session.abortTransaction(); // Abort transaction if session exists
    }
    console.error(error.message);
    res.status(500).send("Server Error during registration.");
  } finally {
    if (session) {
      session.endSession(); // Ensure session ends regardless of outcome
    }
  }
};

// Logout from current session
const logout = (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.json({ message: "Logged out" });
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
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password"); // Exclude password from the result

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};
// Retrieve a single user by ID
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};
// Update a user by ID
const updateUserById = async (req, res) => {
  try {
    const userId = req.query.id;
    const updates = req.body;

    // Optional: Validate the updates against a schema

    // Find the user and update it
    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    }).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found", id: userId });
    }

    res
      .status(200)
      .json({ success: true, message: "User updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// Delete a user by ID
const deleteUserById = async (req, res) => {
  try {
    const userId = req.query.id;
    const userToDelete = await User.findById(userId);

    // Check if the user to delete exists
    if (!userToDelete) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if the authenticated user is an admin
    // // if (req.user.role === "Admin") {
    //   // Admin can delete any user
    //   await User.findByIdAndDelete(userId);
    //   return res
    //     .status(200)
    //     .json({ success: true, message: "User deleted successfully" });
    // } else {
    //   // Non-admin users can only delete their own account
    //   if (req.user._id.toString() !== userId) {
    //     return res.status(403).json({
    //       success: false,
    //       message: "You are not authorized to delete this user",
    //     });
    // }
    await User.findByIdAndDelete(userId);
    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
    // }
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

module.exports = {
  register,
  login,
  logout,
  isUsernameTaken,
  getUsers,
  updateUserById,
  deleteUserById,
  getUserById,
};
