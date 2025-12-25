const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const express = require("express");
const cors = require("cors");

// Import routes
const authRoutes = require("./routes/auth");
const hotelRoutes = require("./routes/hotels");
const favoriteRoutes = require("./routes/favorites");
const scrapingRoutes = require("./routes/scraping");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend folder
app.use(express.static(path.join(__dirname, "../frontend")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/scraping", scrapingRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Hotel Management API is running",
    timestamp: new Date().toISOString(),
  });
});

// Serve frontend for non-API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(
    `📁 Serving frontend from: ${path.join(__dirname, "../frontend")}`
  );
});

module.exports = app;
