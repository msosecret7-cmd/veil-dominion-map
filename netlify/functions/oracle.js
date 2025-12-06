const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // *** KEY နေရာမှာ မိတ်ဆွေရဲ့ Key အရှည်ကြီးကို သေချာထည့်ပါ ***
    const genAI = new GoogleGenerativeAI("AIzaSyCs9vAJjkCzUa71Qd_tkhOmpnbCGMxlNuA");
    
    // Model ကို gemini-1.5-flash သုံးပါမယ် (ပိုမြန်ပြီး Error နည်းလို့ပါ)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

    const data = JSON.parse(event.body);
    const userPrompt = data.question;

    // The Shadow Archivist Persona
    const systemPrompt = "You are MSO-7 (Shadow Archivist). Speak briefly and mystically about the Veil Dominion map.";
    
    const result = await model.generateContent(systemPrompt + " User: " + userPrompt);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: text }),
    };

  } catch (error) {
    // DEBUG MODE: Error အစစ်ကို ပြန်ပို့ပေးမယ့် ကုဒ်
    console.error("Error details:", error);
    return {
      statusCode: 200, // 200 ပြန်ပို့မှ Chat box မှာ စာပေါ်မှာပါ
      body: JSON.stringify({ reply: "SYSTEM ERROR: " + error.message }) 
    };
  }
};
