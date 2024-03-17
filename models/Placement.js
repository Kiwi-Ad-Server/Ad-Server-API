/**
 * Placement.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const mongoose = require("mongoose");

const PlacementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
  zone: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone' },
  // Additional fields as necessary, e.g., dimensions, position, etc.
});

module.exports = mongoose.model("Placement", PlacementSchema);
