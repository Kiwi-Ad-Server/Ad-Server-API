/**
 * Advertiser.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const mongoose = require("mongoose");

const AdvertiserSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: { type: String, required: true },
    website: String,
    billingInfo: {
      address: String,
      city: String,
      country: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Advertiser", AdvertiserSchema);
