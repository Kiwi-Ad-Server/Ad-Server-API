/**
 * Placement.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const mongoose = require("mongoose");

const PlacementSchema = new mongoose.Schema({
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
  zone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Zone",
    required: true,
  },
  startDate: Date,
  endDate: Date,
  status: {
    type: String,
    enum: ["active", "inactive", "completed"],
    default: "active",
  },
  // Additional settings like targeting or A/B testing configurations
});

module.exports = mongoose.model("Placement", PlacementSchema);
