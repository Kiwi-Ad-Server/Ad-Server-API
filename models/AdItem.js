/**
 * AdItem.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const mongoose = require("mongoose");

const adItemSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    imageUrl: { type: String, required: true },
    landingPageUrl: { type: String, required: true },
    // Additional properties like adType, dimensions, etc.
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdItem", adItemSchema);
