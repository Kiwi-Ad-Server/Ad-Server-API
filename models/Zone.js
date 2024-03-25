/**
 * Zone.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const mongoose = require("mongoose");

const ZoneSchema = new mongoose.Schema({
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Publisher",
    required: true,
  },
  name: String,
  campaigns: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
    },
  ],
  // Add more properties as needed
});

module.exports = mongoose.model("Zone", ZoneSchema);
