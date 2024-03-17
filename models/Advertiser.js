/**
 * Advertiser.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const mongoose = require('mongoose');

const AdvertiserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactEmail: { type: String, required: true, unique: true },
  // Define additional fields as necessary
});

module.exports = mongoose.model('Advertiser', AdvertiserSchema);
