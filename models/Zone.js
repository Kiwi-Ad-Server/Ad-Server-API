/**
 * Zone.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const mongoose = require("mongoose");

const ZoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Publisher",
    required: true,
  },
  description: String,

  // Additional fields as necessary, e.g., size, allowedTypes, etc.
});

module.exports = mongoose.model("Zone", ZoneSchema);
