exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // *** KEY နေရာမှာ Key အစစ်ကို ထည့်ပါ ***
    const API_KEY = "AIzaSyC6hh6zCR7LVM4C8fYiylJz2CgItuSjkWo";
    
    // STEP 1: မော်ဒယ်စာရင်းကို အရင်လှမ်းမေးပါမည် (Check Available Models)
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
    const listResponse = await fetch(listUrl);
    const listData = await listResponse.json();

    if (listData.error) {
      return { statusCode: 200, body: JSON.stringify({ reply: "KEY ERROR: " + listData.error.message }) };
    }

    // STEP 2: 'Gemini' ပါဝင်ပြီး Chat လို့ရတဲ့ မော်ဒယ်တစ်ခုကို ရှာပါမည်
    let targetModel = "models/gemini-1.5-flash"; // Default backup
    
    if (listData.models) {
        const validModel = listData.models.find(m => 
            m.name.includes('gemini') && 
            m.supportedGenerationMethods.includes('generateContent')
        );
        if (validModel) {
            targetModel = validModel.name; // အလိုအလျောက် တွေ့ရှိသော မော်ဒယ်
        }
    }

    // STEP 3: တွေ့ရှိသော မော်ဒယ်ဖြင့် စကားပြောပါမည်
    const chatUrl = `https://generativelanguage.googleapis.com/v1beta/${targetModel}:generateContent?key=${API_KEY}`;
    
    const data = JSON.parse(event.body);
    const payload = {
      contents: [{
        parts: [{
          text: "You are MSO-7 (Shadow Archivist). Speak briefly and mystically. User asks: " + data.question
        }]
      }]
    };

    const response = await fetch(chatUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.error) {
      return { statusCode: 200, body: JSON.stringify({ reply: "GENERATE ERROR: " + result.error.message }) };
    }

    // အဖြေပြန်ထုတ်ခြင်း
    let replyText = "The Oracle is silent.";
    if (result.candidates && result.candidates[0].content && result.candidates[0].content.parts) {
       replyText = result.candidates[0].content.parts[0].text;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: replyText + ` (Model Used: ${targetModel})` }),
    };

  } catch (error) {
    return {
      statusCode: 200,
      body: JSON.stringify({ reply: "SYSTEM CRASH: " + error.message })
    };
  }
};
