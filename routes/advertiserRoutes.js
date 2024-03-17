/**
 * advertiserRoutes.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const express = require("express");
const {
  listAdvertisers,
  createAdvertiser,
} = require("../controllers/advertiserController");
const router = express.Router();

router.get("/", listAdvertisers);
router.post("/", createAdvertiser);

module.exports = router;
