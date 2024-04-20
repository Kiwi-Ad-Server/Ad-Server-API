/**
 * AdPlacement.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const mongoose = require("mongoose");

const AdPlacementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    adSlotId: {
      type: String,
      required: true,
      unique: true,
    },
    placementType: {
      type: String,
      enum: ["Banner", "Sidebar", "Interstitial", "Video"],
      required: true,
    },
    pricingModel: {
      type: String,
      enum: ["CPM", "CPC", "CPA"], // Cost Per Mille (impressions), Cost Per Click, Cost Per Acquisition
      default: "CPM",
    },
    price: {
      type: Number,
      required: true,
    },
    impressions: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdPlacement", AdPlacementSchema);
