const express = require("express");
const router = express.Router();
const chatbotController = require("../controllers/chatbotController");

// POST /api/chatbot/message - Send a message to the chatbot
router.post("/message", chatbotController.sendMessage);

module.exports = router;
