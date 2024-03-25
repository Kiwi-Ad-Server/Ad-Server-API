/**
 * campaignRoutes.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const express = require("express");
const { validateToken, authorizeRole } = require("../middlewares/auth");
const {
  createCampaign,
  getCampaigns,
  updateCampaign,
  deleteCampaign,
  connectCampaignToZone,
  // serveAd,
} = require("../controllers/campaignController");

const router = express.Router();

// Routes for basic CRUD operations
router.post("/", [validateToken, authorizeRole("Advertiser")], createCampaign);
router.get("/", [validateToken, authorizeRole("Advertiser")], getCampaigns);
router.put(
  "/:id",
  [validateToken, authorizeRole("Advertiser")],
  updateCampaign
);
router.delete(
  "/:id",
  [validateToken, authorizeRole("Advertiser")],
  deleteCampaign
);

// Additional route to connect a campaign to a zone
router.post(
  "/connect-to-zone",
  [validateToken, authorizeRole("Advertiser")],
  connectCampaignToZone
);

// Optional: Route to serve a preview ad from a campaign for testing (if applicable)
// This might not align exactly with your ad serving logic, but it's an example if you need it
// router.get(
//   "/serve-ad/:campaignId",
//   [validateToken, authorizeRole("Advertiser")],
//   serveAd
// );

module.exports = router;
