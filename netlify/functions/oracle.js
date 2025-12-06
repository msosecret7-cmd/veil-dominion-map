exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // *** KEY နေရာမှာ Key အစစ်ကို ထည့်ပါ ***
    // (Space မပါစေနဲ့၊ " " ထဲမှာပဲ ရှိပါစေ)
    const API_KEY = "AIzaSyCs9vAJjkCzUa71Qd_tkhOmpnbCGMxlNuA";
    
    // FIX: 'gemini-pro' ကို ပြောင်းသုံးထားပါတယ် (ဒါက အငြိမ်ဆုံးပါ)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

    const data = JSON.parse(event.body);
    const userMessage = data.question;

    // Data format
    const payload = {
      contents: [{
        parts: [{
          text: "You are MSO-7 (Shadow Archivist). Answer briefly and mystically. User asks: " + userMessage
        }]
      }]
    };

    // Direct Signal Sending
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    // Google Error စစ်ဆေးခြင်း
    if (result.error) {
      return {
        statusCode: 200, 
        body: JSON.stringify({ reply: "GOOGLE ERROR: " + result.error.message })
      };
    }

    // အဖြေထုတ်ယူခြင်း (Safe Extraction)
    let replyText = "The Oracle is silent.";
    if (result.candidates && result.candidates[0].content && result.candidates[0].content.parts) {
       replyText = result.candidates[0].content.parts[0].text;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: replyText }),
    };

  } catch (error) {
    return {
      statusCode: 200,
      body: JSON.stringify({ reply: "CONNECTION ERROR: " + error.message })
    };
  }
};
