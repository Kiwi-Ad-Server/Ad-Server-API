/**
 * adRoutes.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const express = require("express");
const {
  serveAd,
//   collectImpressions,
  collectClicks,
} = require("../controllers/adController");
const { validateToken } = require("../middlewares/auth");

const router = express.Router();

// Route to serve an ad based on the zone
router.get("/serve/:zoneId", serveAd);

// Optional: Secure these routes if needed
// router.post("/impression", [validateToken], collectImpressions);
router.post("/click", [validateToken], collectClicks);

module.exports = router;
