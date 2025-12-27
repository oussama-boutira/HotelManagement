const axios = require("axios");

// Trigger n8n scraping workflow
const triggerScraping = async (req, res) => {
  try {
    const { city, keyword } = req.body;

    // Validate input
    if (!city || !keyword) {
      return res.status(400).json({
        success: false,
        message: "City and keyword are required",
      });
    }

    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!webhookUrl) {
      // Return mock response if n8n is not configured
      return res.json({
        success: true,
        message: "Scraping triggered (demo mode - n8n not configured)",
        sheetUrl: "https://docs.google.com/spreadsheets/d/1De7XSybchpAk_Mne-lQVgN0EmchODsboeT_1lfkG860/edit?gid=0#gid=0",
        demo: true,
      });
    }

    // Call n8n webhook
    const response = await axios.post(
      webhookUrl,
      {
        city,
        keyword,
        userEmail: req.user.email,
        userId: req.user.id,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30 seconds timeout
      }
    );

    res.json({
      success: true,
      message: "Scraping workflow triggered successfully",
      sheetUrl: response.data.sheetUrl || null,
      data: response.data,
    });
  } catch (error) {
    console.error("TriggerScraping error:", error.message);

    // Handle axios errors
    if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
      return res.status(503).json({
        success: false,
        message:
          "n8n service is not available. Please check your webhook configuration.",
      });
    }

    if (error.code === "ETIMEDOUT") {
      return res.status(504).json({
        success: false,
        message:
          "Scraping request timed out. The analysis may take longer than expected.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error triggering scraping workflow",
    });
  }
};

module.exports = { triggerScraping };
