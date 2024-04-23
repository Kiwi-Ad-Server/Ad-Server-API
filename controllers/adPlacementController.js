/**
 * placementController.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * © 2024 All rights reserved
 */

const AdPlacement = require("../models/AdPlacement.js");

// Create ad placement
exports.createPlacement = async (req, res) => {
  try {
    const adPlacement = new AdPlacement(req.body);
    await adPlacement.save();
    res.status(201).json(adPlacement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Get all ad placements
exports.getPlacements = async (req, res) => {
  // try {
  //   const placements = await Placement.find().populate('campaign').populate('zone');
  //   res.json(placements);
  // } catch (err) {
  //   console.error(err);
  //   res.status(500).send('Server Error');
  // }

  try {
    const adPlacements = await AdPlacement.find();
    res.json(adPlacements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
// Update ad placement by ID
exports.updatePlacement = async (req, res) => {
  const { id } = req.params;
  try {
    const adPlacement = await AdPlacement.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!adPlacement) {
      return res.status(404).json({ error: "Ad placement not found" });
    }
    res.json(adPlacement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Delete ad placement by ID
exports.deletePlacement = async (req, res) => {
  const { id } = req.params;
  try {
    const adPlacement = await AdPlacement.findByIdAndDelete(id);
    if (!adPlacement) {
      return res.status(404).json({ msg: "Ad placement not found" });
    }
    res.json({ msg: "Ad placement deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
