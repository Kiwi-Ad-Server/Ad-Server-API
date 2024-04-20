/**
 * adServingRouter.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const express = require("express");
const router = express.Router();

// Models
const Zone = require("../models/Zone");
const Campaign = require("../models/Campaign");
const Ad = require("../models/Ad");

router.get("/serve-ad/:zoneId", async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.zoneId);
    if (!zone) return res.status(404).send("Zone not found");

    // Find campaigns targeting this zone based on characteristics
    const campaigns = await Campaign.find({
      "targetingCriteria.locations": { $in: zone.characteristics.locations },
      "targetingCriteria.interests": { $in: zone.characteristics.interests },
      // Add more matching criteria as needed
    }).populate("ads");

    // Select the ad with the highest bid from these campaigns
    let highestBidAd = null;
    campaigns.forEach((campaign) => {
      campaign.ads.forEach((ad) => {
        if (!highestBidAd || ad.bidAmount > highestBidAd.bidAmount) {
          highestBidAd = ad;
        }
      });
    });

    if (highestBidAd) {
      res.json({ ad: highestBidAd });
    } else {
      res.status(404).send("No matching ad found");
    }
  } catch (error) {
    console.error("Error serving ad:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
