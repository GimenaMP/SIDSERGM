const https = require('https');
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY;
https.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      if (data.models) {
        console.log('Modelos disponibles:', data.models.map(m => m.name.replace('models/', '')));
      } else {
        console.log('Respuesta:', body);
      }
    } catch (e) {
      console.log('Error:', e);
    }
  });
});
