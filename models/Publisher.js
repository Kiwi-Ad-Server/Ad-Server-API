/**
 * Publisher.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const mongoose = require("mongoose");

const PublisherSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  platformName: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  contactName: String,
  // contactEmail: { type: String, unique: true, sparse: true }, // sparse for optional uniqueness
  trafficInfo: {
    monthlyViews: Number,
    uniqueVisitors: Number,
  },
  paymentInfo: {
    method: String,
    details: String,
  },
  audienceDemographics: {
    ageRange: String,
    interests: [String],
    location: String,
  },
  platformType: {
    type: String,
    enum: ["Blog", "News Site", "Forum", "E-commerce", "Other"],
    required: true,
  },
  // Additional fields as needed
});

module.exports = mongoose.model("Publisher", PublisherSchema);
