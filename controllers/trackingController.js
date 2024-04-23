/**
 * trackingController.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const ConversionPixel = require("../models/ConversionPixel");

/**
 * Logs a conversion event in the database.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
exports.logConversion = async (req, res) => {
  const { ad_item_id, action } = req.query;

  try {
    // Create a new ConversionPixel record in the database
    await ConversionPixel.create({
      adItemId: ad_item_id,
      action,
    });
    res.status(200).send("Conversion logged");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
