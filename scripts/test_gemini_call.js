const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('API Key exists:', !!apiKey, 'Length:', apiKey ? apiKey.length : 0);

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelsToTest = [
    'gemini-2.5-flash',
    'gemini-1.5-flash',
    'gemini-2.0-flash',
    'gemini-flash-latest',
    'gemini-3-flash-preview',
    'gemini-3.8-flash'
  ];

  for (const m of modelsToTest) {
    try {
      console.log(`\nProbando modelo: ${m}...`);
      const model = genAI.getGenerativeModel({ model: m });
      const res = await model.generateContent('Di "Hola" en una palabra');
      console.log(`✅ ${m} funcionó! Respuesta:`, res.response.text().trim());
      break;
    } catch (err) {
      console.log(`❌ ${m} falló:`, err.message);
    }
  }
}

testGemini();
