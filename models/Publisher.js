/**
 * Publisher.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const mongoose = require('mongoose');

const PublisherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  website: { type: String, required: true },
  // Additional fields as necessary
});

module.exports = mongoose.model('Publisher', PublisherSchema);
