const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function testWorking() {
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  const candidates = [
    'gemini-2.5-flash-lite',
    'gemini-flash-lite-latest',
    'gemini-3.1-flash-lite',
    'gemini-3.5-flash-lite',
    'gemini-3.8-flash',
    'gemini-2.5-pro'
  ];

  for (const c of candidates) {
    try {
      const model = genAI.getGenerativeModel({ model: c });
      const res = await model.generateContent('Di OK');
      console.log(`✅ FUNCIONA: ${c} ->`, res.response.text().trim());
    } catch (e) {
      console.log(`❌ ERROR en ${c}:`, e.message.slice(0, 100));
    }
  }
}

testWorking();
