/**
 * File.js
 *
 * @author Selma Auala <selmaauala15@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  filename: String,
  size: Number,
  mimeType: String,
  storageUrl: String,
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('File', FileSchema);
