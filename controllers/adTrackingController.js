/**
 * adTrackingController.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const Ad = require("../models/Ad");

exports.logImpression = async (req, res) => {
  const { adId } = req.body;
  await Ad.findByIdAndUpdate(adId, { $inc: { impressions: 1 } });
  res.send({ message: "Impression logged" });
};

exports.logClick = async (req, res) => {
  const { adId } = req.body;
  await Ad.findByIdAndUpdate(adId, { $inc: { clicks: 1 } });
  res.send({ message: "Click logged" });
};
