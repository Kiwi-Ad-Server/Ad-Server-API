/**
 * CampaignAnalytics.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const mongoose = require("mongoose");

const CampaignAnalyticsSchema = new mongoose.Schema({
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
  date: {
    type: Date,
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
  conversions: {
    type: Number,
    default: 0,
  },
});

CampaignAnalyticsSchema.index({ campaign: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("CampaignAnalytics", CampaignAnalyticsSchema);
