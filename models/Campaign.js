/**
 * Campaign.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema({
  advertiser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Advertiser",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  targetAudience: {
    ageRange: String,
    interests: [String],
    // Add more targeting options as needed
  },
  duration: {
    start: Date,
    end: Date,
  },
  // Include additional fields that might be relevant to your ad campaigns
});

module.exports = mongoose.model("Campaign", CampaignSchema);
