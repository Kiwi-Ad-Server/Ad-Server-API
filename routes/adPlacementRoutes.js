/**
 * adPlacementRoutes.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const express = require("express");
const {
  createPlacement,
  getPlacements,
  updatePlacement,
  deletePlacement,
} = require("../controllers/adPlacementController");
const router = express.Router();

router.post("/", createPlacement);
router.get("/", getPlacements);
router.put("/:id", updatePlacement);
router.delete("/:id", deletePlacement);

module.exports = router;
