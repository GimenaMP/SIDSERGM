const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function listWorkingModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  const testList = [
    'gemini-1.5-pro',
    'gemini-1.5-flash-8b',
    'gemini-2.0-pro-exp-02-05',
    'gemini-2.0-flash-lite-preview-02-05',
    'gemini-2.0-flash-exp',
    'gemini-exp-1206',
    'learnlm-1.5-pro-experimental'
  ];

  for (const m of testList) {
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const res = await model.generateContent('ping');
      console.log(`✅ DISPONIBLE: ${m} ->`, res.response.text().trim().slice(0, 40));
    } catch (e) {
      console.log(`❌ NO DISPONIBLE: ${m} (${e.status || e.message.slice(0, 60)})`);
    }
  }
}

listWorkingModels();
