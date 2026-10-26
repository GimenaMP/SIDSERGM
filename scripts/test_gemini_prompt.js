const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function testPrompt() {
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: 'gemini-3-flash-preview',
    generationConfig: {
      temperature: 0.1,
      responseMimeType: 'application/json'
    }
  });

  const samplePrompt = `Genera un JSON con la estructura:
{
  "tema_generador_comun": "La célula y la continuidad de la vida",
  "categoria_conceptual": "Biología y Ciencias Naturales",
  "proposito_comun": "Comprender la función celular",
  "dias": {
    "Lunes": {
      "dia": "Lunes",
      "periodo3_actividad": "Explicación en pizarra de la célula y mitosis",
      "grados": [
        { "grado": "5.° Primaria", "tema": "La célula y organelos", "pagina": 18, "tarea": "Dibujar célula" },
        { "grado": "6.° Primaria", "tema": "Reproducción celular", "pagina": 24, "tarea": "Cuadro de mitosis" }
      ]
    }
  }
}`;

  console.log('Enviando prompt a Gemini...');
  const t0 = Date.now();
  try {
    const res = await model.generateContent(samplePrompt);
    console.log(`✅ Respuesta en ${(Date.now() - t0)}ms:`);
    console.log(res.response.text().slice(0, 500));
  } catch (err) {
    console.log(`❌ Error después de ${(Date.now() - t0)}ms:`, err.message);
  }
}

testPrompt();
