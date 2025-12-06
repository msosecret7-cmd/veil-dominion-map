exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // *** KEY ထည့်ရန် ***
    const API_KEY = "AIzaSyCs9vAJjkCzUa71Qd_tkhOmpnbCGMxlNuA";
    
    // Google's Direct Endpoint (Library မလိုပါ)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const data = JSON.parse(event.body);
    const userMessage = data.question;

    // Shadow Archivist Persona
    const systemInstruction = "You are MSO-7 (Shadow Archivist) of the Veil Dominion. Speak briefly, mystically, and with authority. Context: Pong Pha is active. Giza is blocked.";

    // Data Packet Preparation
    const payload = {
      contents: [{
        parts: [{
          text: systemInstruction + "\n\nUser asks: " + userMessage
        }]
      }]
    };

    // Sending the Signal (Fetch API)
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    // Check for API Errors
    if (result.error) {
      throw new Error(result.error.message);
    }

    // Extracting the answer
    const replyText = result.candidates[0].content.parts[0].text;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: replyText }),
    };

  } catch (error) {
    console.error("Direct Link Error:", error);
    return {
      statusCode: 200,
      body: JSON.stringify({ reply: "SIGNAL ERROR: " + error.message })
    };
  }
};
