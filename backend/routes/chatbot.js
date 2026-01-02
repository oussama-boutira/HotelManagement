const express = require("express");
const router = express.Router();
const chatbotController = require("../controllers/chatbotController");

// POST /api/chatbot/message - Send a message to the chatbot (direct OpenRouter)
router.post("/message", chatbotController.sendMessage);

// POST /api/chatbot/n8n - Send a message via n8n workflow (proxy to avoid CORS)
router.post("/n8n", chatbotController.sendMessageN8n);

module.exports = router;
