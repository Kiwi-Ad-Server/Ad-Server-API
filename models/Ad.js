/**
 * Ad.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const mongoose = require("mongoose");

const AdSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    content: String, // This could be a URL to an image, HTML code, etc.
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    creative: String, // URL to the ad creative
    bidAmount: Number, // Bid amount per impression
    // Add more properties as needed
  },

  { timestamps: true }
);

module.exports = mongoose.model("Ad", AdSchema);
