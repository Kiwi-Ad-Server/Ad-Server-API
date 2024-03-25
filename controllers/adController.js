/**
 * adController.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

// adController.js
const Placement = require("../models/Placement");
const Campaign = require("../models/Campaign");
const Ad = require("../models/Ad"); // Ensure you've required the Ad model

// Serve an ad based on zoneId
exports.serveAd = async (req, res) => {
  try {
    const { zoneId } = req.params;
    const placement = await Placement.findOne({
      zone: zoneId,
      status: "active",
    }).populate({
      path: "campaign",
      populate: { path: "ads" }, // Assuming a campaign has a reference to its ads
    });

    if (
      !placement ||
      !placement.campaign ||
      placement.campaign.ads.length === 0
    ) {
      return res
        .status(404)
        .send("No active campaigns or ads found for this zone.");
    }

    // Simplified ad selection logic: choose a random ad
    const ad =
      placement.campaign.ads[
        Math.floor(Math.random() * placement.campaign.ads.length)
      ];

    // Increment impression for the chosen ad
    await Ad.findByIdAndUpdate(ad._id, { $inc: { impressions: 1 } });

    // Return the chosen ad's content
    res.json({ adContent: ad.content });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Placeholder for collecting clicks - Implementation assumes a specific ad is targeted
exports.collectClicks = async (req, res) => {
  const { adId } = req.body; // Assume adId is passed in the request

  try {
    await Ad.findByIdAndUpdate(adId, { $inc: { clicks: 1 } });
    res.status(200).send("Click recorded");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// The collectImpressions function can be omitted as impressions are collected directly in serveAd function
