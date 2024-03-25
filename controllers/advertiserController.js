/**
 * advertiserController.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const Advertiser = require("../models/Advertiser");

// Create an Advertiser
exports.createAdvertiser = async (req, res) => {
  try {
    const advertiser = new Advertiser(req.body);
    await advertiser.save();
    res.status(201).json(advertiser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all Advertisers
exports.getAllAdvertisers = async (req, res) => {
  try {
    const advertisers = await Advertiser.find();
    res.status(200).json(advertisers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single Advertiser by ID
exports.getAdvertiserById = async (req, res) => {
  try {
    const advertiser = await Advertiser.findById(req.params.id);
    if (!advertiser)
      return res.status(404).json({ message: "Advertiser not found" });
    res.status(200).json(advertiser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an Advertiser
exports.updateAdvertiser = async (req, res) => {
  try {
    const updatedAdvertiser = await Advertiser.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedAdvertiser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an Advertiser
exports.deleteAdvertiser = async (req, res) => {
  try {
    const deletedAdvertiser = await Advertiser.findByIdAndDelete(req.params.id);
    if (!deletedAdvertiser)
      return res.status(404).json({ message: "Advertiser not found" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
