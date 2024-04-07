/**
 * Report.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    impressions: { type: Number, required: true },
    clicks: { type: Number, required: true },
    conversions: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    // Additional fields as necessary
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", ReportSchema);
