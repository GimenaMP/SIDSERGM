const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function testUnlimitedModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  const models = [
    'gemini-4-argon',
    'gemini-3.5-flash-lite',
    'gemini-flash-lite-latest',
    'gemini-3.1-flash-lite',
    'gemini-2.5-flash-lite',
    'gemini-3.8-flash',
    'gemini-3.6-flash'
  ];

  console.log('--- TEST DE MODELOS ILIMITADOS / ALTA CUOTA ---');
  for (const m of models) {
    const t0 = Date.now();
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const res = await model.generateContent('Di OK');
      console.log(`✅ DISPONIBLE: ${m} (${Date.now() - t0}ms) -> ${res.response.text().trim()}`);
    } catch (e) {
      console.log(`❌ ERROR ${m} (${Date.now() - t0}ms): ${e.message.slice(0, 90)}`);
    }
  }
}

testUnlimitedModels();
