/**
 * ConversionPixel.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const mongoose = require("mongoose");

const ConversionPixelSchema = new mongoose.Schema(
  {
    adItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdItem", // Assuming you have an AdItem model
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: ["click", "view", "conversion"],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    // Additional tracking fields as necessary, e.g., user IP, page URL, etc.
  },
  { timestamps: true }
);

module.exports = mongoose.model("ConversionPixel", ConversionPixelSchema);
