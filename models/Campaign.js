/**
 * Campaign.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  advertiser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Advertiser",
  },
  // Define other fields based on your requirements
});

module.exports = mongoose.model("Campaign", CampaignSchema);
