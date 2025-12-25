const express = require("express");
const router = express.Router();
const { triggerScraping } = require("../controllers/scrapingController");
const { authMiddleware } = require("../middleware/auth");

// POST /api/scraping/trigger (protected)
router.post("/trigger", authMiddleware, triggerScraping);

module.exports = router;
