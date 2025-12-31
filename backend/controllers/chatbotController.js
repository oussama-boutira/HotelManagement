// Chatbot Controller - Proxies requests to OpenRouter API

const sendMessage = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        message: "Messages array is required",
      });
    }

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    if (!OPENROUTER_API_KEY) {
      console.error("OPENROUTER_API_KEY not found in environment variables");
      return res.status(500).json({
        success: false,
        message: "Chatbot service is not configured",
      });
    }

    // Build messages array with system prompt
    const fullMessages = [
      {
        role: "system",
        content:
          "You are a helpful assistant for P2P Hotels, a peer-to-peer hotel booking platform. You help users find hotels, answer questions about booking, provide travel tips, and assist with any hotel-related inquiries. Be friendly, concise, and helpful. If users ask about specific hotels, guide them to use the search functionality on the website.",
      },
      ...messages.slice(-10), // Keep last 10 messages for context
    ];

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": req.headers.origin || "http://localhost:3000",
          "X-Title": "P2P Hotels",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemma-3-27b-it:free",
          messages: fullMessages,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", response.status, errorText);
      return res.status(response.status).json({
        success: false,
        message: "Failed to get response from AI",
      });
    }

    const data = await response.json();

    if (data.choices && data.choices[0] && data.choices[0].message) {
      return res.json({
        success: true,
        message: data.choices[0].message.content,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Invalid response from AI",
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request",
    });
  }
};

module.exports = {
  sendMessage,
};
