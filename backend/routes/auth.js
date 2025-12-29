const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  googleAuth,
} = require("../controllers/authController");
const { authMiddleware } = require("../middleware/auth");

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/google
router.post("/google", googleAuth);

// GET /api/auth/google-client-id (public - returns client ID for frontend)
router.get("/google-client-id", (req, res) => {
  res.json({
    success: true,
    clientId: process.env.GOOGLE_CLIENT_ID || "",
  });
});

// GET /api/auth/me (protected)
router.get("/me", authMiddleware, getMe);

module.exports = router;
