const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const baseDir = path.join(__dirname, '../data/nivelacion_mineduc');

async function inspectPdf(relPath) {
  const fullPath = path.join(baseDir, relPath);
  if (!fs.existsSync(fullPath)) {
    console.log(`Not found: ${fullPath}`);
    return null;
  }
  const buffer = fs.readFileSync(fullPath);
  const uint8 = new Uint8Array(buffer);
  try {
    const parser = new PDFParse(uint8);
    const info = await parser.getInfo();
    const textObj = await parser.getText();
    
    // textObj has text or text content
    const fullText = (typeof textObj === 'string' ? textObj : (textObj.text || JSON.stringify(textObj))).trim();
    
    console.log(`\n======================================================`);
    console.log(`FILE: ${relPath}`);
    console.log(`TOTAL PAGES: ${info ? (info.numPages || info.total || 'N/A') : 'N/A'}`);
    console.log(`TEXT LENGTH: ${fullText.length} chars`);
    console.log(`PREVIEW (first 600 chars):\n${fullText.substring(0, 600)}`);
    console.log(`======================================================\n`);
    
    return {
      relPath,
      numPages: info ? (info.numPages || info.total) : null,
      charCount: fullText.length,
      sample: fullText.substring(0, 1000)
    };
  } catch (err) {
    console.error(`Error reading ${relPath}:`, err.message);
    return null;
  }
}

async function run() {
  const filesToInspect = [
    'eval/a_instructivo.pdf',
    'eval/capacitacion/presentacion_webinar.pdf',
    'eval/f_registro_evaluaciones.pdf',
    'eval/laminas/lamina_segundo_grado.pdf',
    'interv/a_guia_docente.pdf',
    'interv/b_folleto_planificaciones.pdf',
    'interv/e_folleto_lecturas_formativa.pdf',
    'interv/tarjetas_etapa/etapa_1_emergente.pdf',
    'interv/tarjetas_etapa/etapa_3_decodificables.pdf',
    'interv/historias/historias_1_10.pdf'
  ];

  const results = [];
  for (const f of filesToInspect) {
    const res = await inspectPdf(f);
    if (res) results.push(res);
  }

  fs.writeFileSync(
    path.join(baseDir, 'resumen_estructura_documentos.json'),
    JSON.stringify(results, null, 2),
    'utf8'
  );
  console.log('Saved resumen_estructura_documentos.json successfully');
}

run();
