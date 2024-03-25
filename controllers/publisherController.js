/**
 * publisherController.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const Publisher = require("../models/Publisher");

// Create a new Publisher profile
exports.createPublisher = async (req, res) => {
  try {
    const publisher = new Publisher({ ...req.body, user: req.user.userId });
    await publisher.save();
    res.status(201).json(publisher);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to create publisher", error: error.message });
  }
};

// Get Publisher profile
exports.getPublisher = async (req, res) => {
  try {
    const publisher = await Publisher.findById(req.params.id);
    if (!publisher) {
      return res.status(404).json({ message: "Publisher not found" });
    }
    res.json(publisher);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Update Publisher profile
exports.updatePublisher = async (req, res) => {
  try {
    const publisher = await Publisher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!publisher) {
      return res.status(404).json({ message: "Publisher not found" });
    }
    res.json(publisher);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Delete Publisher profile
exports.deletePublisher = async (req, res) => {
  try {
    const publisher = await Publisher.findByIdAndDelete(req.params.id);
    if (!publisher) {
      return res.status(404).json({ message: "Publisher not found" });
    }
    res.json({ message: "Publisher deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
