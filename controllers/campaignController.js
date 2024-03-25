/**
 * campaignController.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const Campaign = require("../models/Campaign");
// Other required models like Placement

exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().populate("advertiser");
    res.json(campaigns);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
exports.createCampaign = async (req, res) => {
  const { name, budget, targetAudience, duration, advertiser } = req.body;
  try {
    const newCampaign = new Campaign({
      name,
      budget,
      targetAudience,
      duration,
      advertiser: req.user._id, // Assuming the advertiser's ID is stored in req.user._id
    });
    const campaign = await newCampaign.save();
    res.status(201).json(campaign);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.updateCampaign = async (req, res) => {
  const { id } = req.params;
  try {
    const campaign = await Campaign.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!campaign) {
      return res.status(404).json({ msg: "Campaign not found" });
    }
    res.json(campaign);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
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
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.connectCampaignToZone = async (req, res) => {
  const { zoneId, campaignId } = req.body;

  try {
    const zone = await Zone.findById(zoneId);

    if (!zone) {
      return res.status(404).json({ message: "Zone not found" });
    }

    // Add the campaign to the zone's campaigns array if it's not already included
    if (!zone.campaigns.includes(campaignId)) {
      zone.campaigns.push(campaignId);
      await zone.save();
    }

    res.status(200).json(zone);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.collectImpressions = async (req, res) => {
  const { adId } = req.body;

  try {
    await Ad.findByIdAndUpdate(adId, { $inc: { impressions: 1 } });
    res.status(200).send("Impression recorded");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.collectClicks = async (req, res) => {
  const { adId } = req.body;

  try {
    await Ad.findByIdAndUpdate(adId, { $inc: { clicks: 1 } });
    res.status(200).send("Click recorded");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.collectClicks = async (req, res) => {
  const { adId } = req.body;

  try {
    await Ad.findByIdAndUpdate(adId, { $inc: { clicks: 1 } });
    res.status(200).send("Click recorded");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
