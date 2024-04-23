/**
 * adController.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

// adController.js
const Placement = require("../models/AdPlacement");
const Campaign = require("../models/Campaign");
const Ad = require("../models/Ad");

// Controller function to handle uploading ad creative
exports.uploadAdCreative = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const adCreativeFile = req.file; // Assuming the uploaded file is available in req.file

    // Save ad creative file to server or cloud storage
    // For example, if using a cloud storage service like Amazon S3:
    // const adCreativeUrl = await saveToS3(adCreativeFile);

    // Associate ad creative with campaign
    const campaign = await Campaign.findById(campaignId);
    const newAd = new Ad({ campaign: campaignId, url: adCreativeUrl }); // Assuming adCreativeUrl is the URL of the saved file
    await newAd.save();

    campaign.ads.push(newAd._id);
    await campaign.save();

    res
      .status(200)
      .json({ success: true, message: "Ad creative uploaded successfully" });
  } catch (error) {
    console.error("Error uploading ad creative:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Serve an ad based on zoneId
exports.serveAd = async (req, res) => {
  try {
    const { zoneId } = req.params;
    const placement = await Placement.findOne({
      zone: zoneId,
      status: "active",
    }).populate({
      path: "campaign",
      populate: { path: "ads" },
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

    res.json({ adContent: ad.content });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Collect clicks for an ad
exports.collectClicks = async (req, res) => {
  const { adId } = req.body;

  try {
    await Ad.findByIdAndUpdate(adId, { $inc: { clicks: 1 } });
    res.status(200).send("Click recorded");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
