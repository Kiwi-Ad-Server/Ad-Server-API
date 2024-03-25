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
    contactEmail,
    trafficInfo,
    paymentInfo,
    audienceDemographics,
    platformType,
  } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let user = new User({ username, email, password, role });
    await user.save({ session }); // Save within the transaction

    // For Advertiser: create an advertiser profile within the same transaction
    if (user.role === "Advertiser") {
      const advertiser = new Advertiser({
        user: user._id,
        company,
        website,
        billingInfo,
      });
      await advertiser.save({ session });
    }

    // For Publisher
    if (user.role === "Publisher") {
      const publisher = new Publisher({
        user: user._id,
        platformName,
        websiteUrl,
        contactName,
        contactEmail,
        trafficInfo,
        paymentInfo,
        audienceDemographics,
        platformType,
      });
      await publisher.save({ session });
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(201).json({ message: "Successfully registered!", token });
  } catch (err) {
    // Abort the transaction on error
    await session.abortTransaction();
    session.endSession();
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch || !(await user.comparePassword(password)))
      return res.status(400).json({ msg: "Invalid Credentials" });

    const token = jwt.sign(
      { user: { id: user.id, role: user.role } },
      process.env.JWT_SECRET,
      { expiresIn: "5h" }
    );
    res.json({ message: "Logged in", token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = { register, login };
