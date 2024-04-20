/**
 * adServeRoutes.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const express = require("express");
const router = express.Router();
const { selectAd } = require("../services/adSelectionService");

router.get("/serve", async (req, res) => {
  try {
    const targetingInfo = req.query; // Simplified example
    const ad = await selectAd(targetingInfo);
    if (!ad) return res.status(404).send("No ad found");

    // Add impression tracking to the ad response
    ad.impressionTrackUrl = `${process.env.BASE_URL}/track/impression?adId=${ad._id}`;
    ad.clickTrackUrl = `${process.env.BASE_URL}/track/click?adId=${ad._id}`;

    res.json(ad);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error serving ad");
  }
});

module.exports = router;
