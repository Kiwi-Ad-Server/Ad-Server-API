/**
 * analyticsController.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const CampaignAnalytics = require("../models/CampaignAnalytics");

// Record an impression for a campaign
exports.recordImpression = async (req, res) => {
  try {
    const { campaignId } = req.body;

    // Check if the campaign exists
    const campaignExists = await Campaign.findById(campaignId);
    if (!campaignExists) {
      return res.status(404).send("Campaign not found.");
    }

    await CampaignAnalytics.create({
      campaign: campaignId,
      type: "impression",
      date: new Date(),
    });

    res.status(200).send("Impression recorded successfully.");
  } catch (error) {
    res.status(500).send("Error recording impression: " + error.message);
  }
};

// analyticsController.js

exports.recordBulkImpressions = async (req, res) => {
  const impressions = req.body; // Expecting an array of { campaignId, date }

  const bulkOps = impressions.map(impression => ({
    insertOne: {
      document: { 
        campaign: impression.campaignId, 
        type: "impression", 
        date: impression.date || new Date() 
      }
    }
  }));

  CampaignAnalytics.bulkWrite(bulkOps)
    .then(result => res.status(200).json({ message: "Impressions recorded successfully.", result }))
    .catch(error => res.status(500).json({ message: "Error recording impressions", error: error.message }));
};


// Record a click for a campaign
exports.recordClick = async (req, res) => {
  try {
    const { campaignId } = req.body;
    await CampaignAnalytics.create({
      campaign: campaignId,
      type: "click",
      date: new Date(),
    });
    res.status(200).send("Click recorded successfully.");
  } catch (error) {
    res.status(500).send("Error recording click: " + error.message);
  }
};

// Record a conversion for a campaign
exports.recordConversion = async (req, res) => {
  try {
    const { campaignId } = req.body;
    await CampaignAnalytics.create({
      campaign: campaignId,
      type: "conversion",
      date: new Date(),
    });
    res.status(200).send("Conversion recorded successfully.");
  } catch (error) {
    res.status(500).send("Error recording conversion: " + error.message);
  }
};
