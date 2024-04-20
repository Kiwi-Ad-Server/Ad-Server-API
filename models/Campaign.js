/**
 * Campaign.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema(
  {
    advertiser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Advertiser",
      required: true,
    },
    ads: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ad" }],
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Paused", "Ended"],
      default: "Active",
    },
    budget: {
      type: Number,
      required: true,
    },

    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    targetAudience: {
      ageRange: String,
      interests: [String],
    },
    duration: {
      start: Date,
      end: Date,
    },
    adPlacements: [
      { type: mongoose.Schema.Types.ObjectId, ref: "AdPlacement" },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Campaign", CampaignSchema);
