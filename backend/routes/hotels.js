const express = require("express");
const router = express.Router();
const {
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
} = require("../controllers/hotelController");
const { authMiddleware, optionalAuth } = require("../middleware/auth");

// Public routes (optional auth for favorite status)
router.get("/", optionalAuth, getAllHotels);
router.get("/:id", optionalAuth, getHotelById);

// Protected routes
router.post("/", authMiddleware, createHotel);
router.put("/:id", authMiddleware, updateHotel);
router.delete("/:id", authMiddleware, deleteHotel);

module.exports = router;
