/**
 * adTrackingRoutes.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const express = require("express");
const router = express.Router();
const {
  logImpression,
  logClick,
} = require("../controllers/adTrackingController");

router.post("/impression", logImpression);
router.post("/click", logClick);

module.exports = router;
