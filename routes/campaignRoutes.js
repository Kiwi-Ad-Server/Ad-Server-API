/**
 * campaignRoutes.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const express = require("express");
const router = express.Router();
const {
  listCampaigns,
  createCampaign,
  connectCampaignToZone,
  collectImpressions,
  collectClicks,
} = require("../controllers/campaignController");

// List campaigns
router.get("/", listCampaigns);

// Create a new campaign
router.post("/", createCampaign);

// Connect a campaign to a publisher's zone
router.post("/connect", connectCampaignToZone);

// Collect impressions and clicks
router.post("/impressions", collectImpressions);
router.post("/clicks", collectClicks);

module.exports = router;
