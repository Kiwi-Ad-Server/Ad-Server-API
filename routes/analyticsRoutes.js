/**
 * CampaignAnalytics.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const express = require("express");
const {
  recordImpression,
  recordClick,
  recordConversion,
} = require("../controllers/analyticsController");

const router = express.Router();

router.post("/impression", recordImpression);
router.post("/click", recordClick);
router.post("/conversion", recordConversion);


module.exports = router;


