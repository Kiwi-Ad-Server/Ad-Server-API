/**
 * advertiserRoutes.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

// routes/advertiserRoutes.js
const express = require("express");
const router = express.Router();
const {
  createAdvertiser,
  getAllAdvertisers,
  getAdvertiserById,
  updateAdvertiser,
  deleteAdvertiser,
} = require("../controllers/advertiserController");
const { validateToken, authorizeRole } = require("../middlewares/auth");

router.post(
  "/",
  [validateToken, authorizeRole("Admin", "Advertiser")],
  createAdvertiser
);
router.get("/", validateToken, getAllAdvertisers);
router.get("/:id", validateToken, getAdvertiserById);
router.put(
  "/:id",
  [validateToken, authorizeRole("Admin", "Advertiser")],
  updateAdvertiser
);
router.delete(
  "/:id",
  [validateToken, authorizeRole("Admin", "Advertiser")],
  deleteAdvertiser
);

module.exports = router;
