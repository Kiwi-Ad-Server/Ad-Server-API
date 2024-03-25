/**
 * publisherRoutes.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const express = require("express");
const { validateToken, authorizeRole } = require("../middlewares/auth");
const {
  createPublisher,
  getPublisher,
  updatePublisher,
  deletePublisher,
} = require("../controllers/publisherController");

const router = express.Router();

// Apply the validateToken middleware to all routes
router.use(validateToken);

router.post("/", createPublisher);
router.get("/:id", validateToken, getPublisher);
router.put(
  "/:id",
  [validateToken, authorizeRole("Publisher")],
  updatePublisher
);
router.delete(
  "/:id",
  [validateToken, authorizeRole("Admin", "Publisher")],
  deletePublisher
);

module.exports = router;
