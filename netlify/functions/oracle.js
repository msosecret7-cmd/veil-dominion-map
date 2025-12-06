const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // Netlify Variable ထဲက Key ကို လှမ်းယူပါမယ်
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    const data = JSON.parse(event.body);
    const userPrompt = data.question;

    // Shadow Archivist Persona (စရိုက်သတ်မှတ်ခြင်း)
    const systemPrompt = "You are the Shadow Archivist (MSO-7). You govern the Veil Dominion map. Speak with mystical authority. Keep answers brief (under 50 words). Current Context: The Blue Vein is flowing from Pong Pha to Amazon. Giza is blocked.";
    
    const result = await model.generateContent(systemPrompt + " User asks: " + userPrompt);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: text }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "The Veil is too thick. Connection severed." }),
    };
  }
};
