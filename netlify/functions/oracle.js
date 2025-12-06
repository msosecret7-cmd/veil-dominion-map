const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // *** အရေးကြီး ***
    // ဒီအောက်က " " ကြားထဲမှာ Key ကို ထည့်ပါ။
    const MY_API_KEY = "AIzaSyCs9vAJjkCzUa71Qd_tkhOmpnbCGMxlNuA";

    const genAI = new GoogleGenerativeAI(MY_API_KEY);
    
    // FIX: Version အသစ်နဲ့ ကိုက်ညီတဲ့ Model ကို သုံးပါမည်
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

    const data = JSON.parse(event.body);
    const userPrompt = data.question;

    const systemPrompt = "You are MSO-7 (Shadow Archivist). Speak briefly and mystically about the Veil Dominion map.";
    
    const result = await model.generateContent(systemPrompt + " User: " + userPrompt);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: text }),
    };

  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 200, 
      body: JSON.stringify({ reply: "SYSTEM ERROR: " + error.message }) 
    };
  }
};
