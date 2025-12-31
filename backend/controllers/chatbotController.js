// Chatbot Controller - Proxies requests to OpenRouter API

const sendMessage = async (req, res) => {
  try {
    const { messages } = req.body;

    console.log("Chatbot request received:", {
      messageCount: messages?.length,
    });

    if (!messages || !Array.isArray(messages)) {
      console.log("Error: Messages array is missing or invalid");
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
        message: "Chatbot service is not configured - API key missing",
      });
    }

    console.log("API Key found, length:", OPENROUTER_API_KEY.length);

    // =====================================================
    // SYSTEM PROMPT - This is how you "train" your AI!
    // Customize this text to change how the AI behaves
    // =====================================================
    const systemPrompt = `You are a helpful and friendly AI assistant for P2P Hotels, a peer-to-peer hotel booking platform.

## Your Role:
- Help users find the perfect hotel for their needs
- Answer questions about booking, pricing, and availability
- Provide travel tips and destination recommendations
- Assist with any hotel-related inquiries

## About P2P Hotels:
- We are a peer-to-peer hotel marketplace
- Users can browse hotels by city, category, star rating, and availability status
- Hotels can be filtered as "Available" or "Full"
- Users can save favorite hotels to their list
- Property owners can list their hotels on the platform

## How to Respond:
- Be friendly, helpful, and conversational
- Keep responses concise but informative
- If users ask to search for hotels, tell them to use the search bar at the top of the page
- If users ask to filter hotels, explain they can use category buttons, city filter, or star rating filter
- If users want to save a hotel, tell them to click the heart icon (they need to be logged in)
- For booking questions, explain they should click on a hotel card to view details

## Important Notes:
- Always respond in the same language the user writes in
- Be positive and encouraging about travel
- If you don't know something specific, admit it and suggest they explore the website`;

    // Build messages array with system prompt
    const fullMessages = [
      {
        role: "system",
        content: systemPrompt,
      },
      ...messages.slice(-10), // Keep last 10 messages for context
    ];

    console.log("Sending request to OpenRouter...");

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer":
            req.headers.origin ||
            req.headers.referer ||
            "http://localhost:3000",
          "X-Title": "P2P Hotels",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemma-3-27b-it:free",
          messages: fullMessages,
        }),
      }
    );

    console.log("OpenRouter response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", response.status, errorText);
      return res.status(response.status).json({
        success: false,
        message: `AI service error: ${response.status}`,
        debug: errorText,
      });
    }

    const data = await response.json();
    console.log("OpenRouter response received:", {
      hasChoices: !!data.choices,
    });

    if (data.choices && data.choices[0] && data.choices[0].message) {
      return res.json({
        success: true,
        message: data.choices[0].message.content,
      });
    }

    console.error("Invalid response structure:", JSON.stringify(data));
    return res.status(500).json({
      success: false,
      message: "Invalid response from AI",
    });
  } catch (error) {
    console.error("Chatbot error:", error.message, error.stack);
    return res.status(500).json({
      success: false,
      message: "An error occurred: " + error.message,
    });
  }
};

module.exports = {
  sendMessage,
};
