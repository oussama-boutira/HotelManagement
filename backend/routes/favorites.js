const express = require("express");
const router = express.Router();
const {
  addFavorite,
  removeFavorite,
  getMyFavorites,
} = require("../controllers/favoriteController");
const { authMiddleware } = require("../middleware/auth");

// All routes require authentication
router.use(authMiddleware);

// GET /api/favorites/my-favorites
router.get("/my-favorites", getMyFavorites);

// POST /api/favorites/:hotelId
router.post("/:hotelId", addFavorite);

// DELETE /api/favorites/:hotelId
router.delete("/:hotelId", removeFavorite);

module.exports = router;
