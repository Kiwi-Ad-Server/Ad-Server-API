/**
 * campaignController.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const Campaign = require("../models/Campaign");
const Zone = require("../models/Zone");

// Fetch all campaigns for an advertiser
exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ advertiser: req.user.id }).populate(
      "ads"
    );
    res.json(campaigns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Create a new campaign
exports.createCampaign = async (req, res) => {
  try {
    const newCampaign = new Campaign({
      ...req.body,
      advertiser: req.user.id,
    });
    const campaign = await newCampaign.save();
    res.status(201).json(campaign);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateCampaign = async (req, res) => {
  const { id } = req.params;
  try {
    const campaign = await Campaign.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    res.json(campaign);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCampaign = async (req, res) => {
  const { id } = req.params;
  try {
    const campaign = await Campaign.findByIdAndDelete(id);
    if (!campaign) {
      return res.status(404).json({ msg: "Campaign not found" });
    }
    res.json({ msg: "Campaign deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Connect a campaign to a zone
exports.connectCampaignToZone = async (req, res) => {
  const { campaignId, zoneId } = req.body;

  try {
    // Find the campaign and zone
    const campaign = await Campaign.findById(campaignId);
    const zone = await Zone.findById(zoneId);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    if (!zone) {
      return res.status(404).json({ message: "Zone not found" });
    }

    // Assuming your Zone model has a field to store related campaigns
    // Check if the campaign is already connected to the zone
    if (zone.campaigns && zone.campaigns.includes(campaignId)) {
      return res
        .status(400)
        .json({ message: "Campaign is already connected to this zone" });
    }

    // Connect the campaign to the zone
    zone.campaigns = zone.campaigns
      ? [...zone.campaigns, campaignId]
      : [campaignId];
    await zone.save();

    res.json({ message: "Campaign connected to zone successfully", zone });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getCampaignAnalytics = async (req, res) => {
  const { campaignId } = req.params;

  try {
    // Aggregate campaign analytics data
    const analytics = await CampaignAnalytics.aggregate([
      { $match: { campaign: mongoose.Types.ObjectId(campaignId) } },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(analytics);
  } catch (error) {
    res
      .status(500)
      .send("Error retrieving campaign analytics: " + error.message);
  }
};

exports.collectImpressions = async (req, res) => {
  const { adId } = req.body;

  try {
    await Ad.findByIdAndUpdate(adId, { $inc: { impressions: 1 } });
    res.status(200).send("Impression recorded");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.collectClicks = async (req, res) => {
  const { adId } = req.body;

  try {
    await Ad.findByIdAndUpdate(adId, { $inc: { clicks: 1 } });
    res.status(200).send("Click recorded");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
