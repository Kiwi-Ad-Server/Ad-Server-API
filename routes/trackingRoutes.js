/**
 * trackingRoutes.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const express = require("express");
const router = express.Router();
const { logConversion } = require("../controllers/trackingController");

router.get("/convert/track", logConversion);

module.exports = router;
