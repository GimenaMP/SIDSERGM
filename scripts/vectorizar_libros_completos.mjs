import fs from 'fs';
import path from 'path';

let PDFParseClass;

async function getPDFParser() {
  if (!PDFParseClass) {
    const pdfModule = await import('pdf-parse');
    PDFParseClass = pdfModule.PDFParse;
  }
  return PDFParseClass;
}

const BASE_DIR = path.resolve('data', 'libros_pdf');
const OUTPUT_FILE = path.resolve('data', 'mineduc_ejercicios.json');
const OUTPUT_FULL_FILE = path.resolve('data', 'mineduc_ejercicios_completos.json');

// Normalizador de materia
function normalizarMateria(materiaDir) {
  const map = {
    'Matematicas': 'Matemáticas',
    'Comunicacion_y_Lenguaje': 'Comunicación y Lenguaje',
    'Medio_Social_y_Natural': 'Medio Social y Natural',
    'Ciencias_Naturales_y_Tecnologia': 'Ciencias Naturales y Tecnología',
    'Ciencias_Sociales_y_Ciudadana': 'Ciencias Sociales y Ciudadana',
    'Formacion_Ciudadana': 'Formación Ciudadana'
  };
  return map[materiaDir] || materiaDir.replace(/_/g, ' ');
}

// Extrae el grado numérico desde la carpeta o nombre
function extraerGrado(gradoDir) {
  const match = gradoDir.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

// Limpia y detecta títulos de unidad o lección en una página
function extraerUnidadOTema(texto, numPagina, materia) {
  const lineas = texto.split('\n').map(l => l.trim()).filter(Boolean);
  
  for (let i = 0; i < Math.min(lineas.length, 6); i++) {
    const l = lineas[i];
    if (/^(unidad|bloque|lecci[oó]n|tema|cap[ií]tulo)\s+\d+/i.test(l)) {
      return l;
    }
    if (/^[A-ZÁÉÍÓÚÑ0-9\s\.\-]{5,50}$/.test(l) && !l.includes('MINEDUC') && !l.includes('PÁGINA') && !l.includes('PROHIBIDA')) {
      return l;
    }
  }

  return `${materia} — Página ${numPagina}`;
}

// Extrae ejercicios concretos y enunciados
function extraerEjercicios(texto, numPagina, materia) {
  const lineas = texto.split('\n').map(l => l.trim()).filter(Boolean);
  
  const lineasUtiles = lineas.filter(l => {
    const lower = l.toLowerCase();
    if (lower.includes('ministerio de educación') || lower.includes('distribución gratuita') || lower.includes('prohibida su venta')) return false;
    if (lower.startsWith('página ') || lower === String(numPagina)) return false;
    return true;
  });

  const textoLimpio = lineasUtiles.join('\n');

  // Buscar fragmentos con enumeraciones típicas de ejercicios
  const ejerciciosDetectados = [];
  const regexEjercicios = /(?:^|\n)(?:(\d+[\.\)]|[a-e][\.\)]|•|-|\*)\s+)([^\n]+(?:\n(?!(?:\d+[\.\)]|[a-e][\.\)]|•|-|\*))[^\n]+)*)/g;
  let match;

  while ((match = regexEjercicios.exec(textoLimpio)) !== null) {
    const item = match[0].trim();
    if (item.length > 15 && item.length < 600) {
      ejerciciosDetectados.push(item.replace(/\s+/g, ' '));
    }
    if (ejerciciosDetectados.length >= 6) break;
  }

  if (ejerciciosDetectados.length > 0) {
    return ejerciciosDetectados.join('\n\n');
  }

  // Si no hay viñetas explícitas, tomar los párrafos sustanciales
  const parrafos = textoLimpio
    .split(/\n\s*\n/)
    .map(p => p.trim().replace(/\s+/g, ' '))
    .filter(p => p.length > 25);

  if (parrafos.length > 0) {
    return parrafos.slice(0, 4).join('\n\n');
  }

  return textoLimpio.slice(0, 500);
}

// Extrae notas metodológicas o sugerencias didácticas para el maestro
function extraerOrientacionesDocente(texto) {
  const match = texto.match(/(?:orientaci[oó]n|nota al docente|sugerencia|para el maestro|atenci[oó]n|evaluaci[oó]n)[^\n\.\:]*[\:\.]([^\n]+(?:\n[^\n]+){1,3})/i);
  if (match) {
    return match[0].trim().replace(/\s+/g, ' ').slice(0, 300);
  }
  return "Promover el trabajo cooperativo, contextualizar con elementos del entorno y verificar la resolución de ejercicios en la guía.";
}

// Búsqueda recursiva de archivos PDF
function encontrarPdfs(dir) {
  let pdfs = [];
  if (!fs.existsSync(dir)) return pdfs;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      pdfs = pdfs.concat(encontrarPdfs(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.pdf') && !entry.name.endsWith('.tmp')) {
      pdfs.push(fullPath);
    }
  }
  return pdfs;
}

async function procesarLibro(pdfPath, Parser) {
  const relPath = path.relative(BASE_DIR, pdfPath).replace(/\\/g, '/');
  const partes = relPath.split('/');
  
  const cicloRaw = partes[0] || 'Segundo_Ciclo';
  const gradoDir = partes[1] || '4to_Primaria';
  const materiaDir = partes[2] || 'Matematicas';
  const nombreArchivo = partes[3] || path.basename(pdfPath);

  const ciclo = cicloRaw.toLowerCase().includes('primer') ? 'primer_ciclo' : 'segundo_ciclo';
  const gradoNumero = extraerGrado(gradoDir);
  const materia = normalizarMateria(materiaDir);
  const libroTitulo = `${materia} ${gradoNumero > 0 ? gradoNumero + '.º Primaria' : ''} — MINEDUC Oficial`.trim();

  console.log(`\n📖 [${materia} - Grado ${gradoNumero}] ${nombreArchivo}`);

  const buffer = fs.readFileSync(pdfPath);
  const parser = new Parser({ data: buffer });
  await parser.load();

  // En pdf-parse v2, parser.getText() extrae todas las páginas con su número y texto
  const result = await parser.getText();
  const totalPaginas = result.total || (result.pages ? result.pages.length : 0);
  console.log(`   Páginas detectadas: ${totalPaginas}`);

  const registrosPaginas = [];
  const pagesList = result.pages || [];

  for (let i = 0; i < pagesList.length; i++) {
    const pageObj = pagesList[i];
    const numPagina = pageObj.num || (i + 1);
    const rawText = pageObj.text || '';
    const textoLimpio = rawText.trim();

    // Descartar páginas de índice en blanco o portadillas mínimas
    if (textoLimpio.length < 20) continue;

    const seccionUnidad = extraerUnidadOTema(textoLimpio, numPagina, materia);
    const enunciado = extraerEjercicios(textoLimpio, numPagina, materia);
    const orientacion = extraerOrientacionesDocente(textoLimpio);

    registrosPaginas.push({
      libro_titulo: libroTitulo,
      archivo_fuente: nombreArchivo,
      grado_especifico: gradoNumero,
      grados_aplicables: [gradoNumero],
      ciclo: ciclo,
      materia: materia,
      numero_pagina: numPagina,
      total_paginas_libro: totalPaginas,
      seccion_unidad: seccionUnidad,
      tipo_recurso: 'ejercicio_estudiante',
      enunciado_ejercicio: enunciado,
      instrucciones_docente: orientacion,
      longitud_texto: textoLimpio.length
    });
  }

  console.log(`   ✨ Extraídas ${registrosPaginas.length} páginas útiles indexadas.`);
  return registrosPaginas;
}

async function main() {
  console.log('========================================================================');
  console.log('🔍 VECTORIZACIÓN Y EXTRACCIÓN TOTAL DE LIBROS MINEDUC (1.º A 6.º)');
  console.log('========================================================================\n');

  const Parser = await getPDFParser();
  const pdfFiles = encontrarPdfs(BASE_DIR);

  console.log(`Archivos PDF encontrados para indexar: ${pdfFiles.length}`);
  if (pdfFiles.length === 0) {
    console.log('⚠️ No se encontraron PDFs en data/libros_pdf/.');
    return;
  }

  let todosLosRegistros = [];
  let nuevosRegistrosCount = 0;

  for (let i = 0; i < pdfFiles.length; i++) {
    const pdfPath = pdfFiles[i];
    try {
      console.log(`[${i + 1}/${pdfFiles.length}] Procesando...`);
      const paginas = await procesarLibro(pdfPath, Parser);
      todosLosRegistros = todosLosRegistros.concat(paginas);
      nuevosRegistrosCount += paginas.length;
    } catch (err) {
      console.error(`❌ Error procesando ${pdfPath}: ${err.message}`);
    }
  }

  // Ordenar registros por grado, materia y número de página
  todosLosRegistros.sort((a, b) => {
    if (a.grado_especifico !== b.grado_especifico) return a.grado_especifico - b.grado_especifico;
    if (a.materia !== b.materia) return a.materia.localeCompare(b.materia);
    return a.numero_pagina - b.numero_pagina;
  });

  // Guardar en data/mineduc_ejercicios.json y data/mineduc_ejercicios_completos.json
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(todosLosRegistros, null, 2), 'utf8');
  fs.writeFileSync(OUTPUT_FULL_FILE, JSON.stringify(todosLosRegistros, null, 2), 'utf8');

  console.log('\n========================================================================');
  console.log('🎉 PROCESAMIENTO E INDEXACIÓN COMPLETO:');
  console.log(`   • Total páginas/ejercicios reales en base RAG: ${todosLosRegistros.length}`);
  console.log(`   • Archivo de salida activo: ${OUTPUT_FILE}`);
  console.log('========================================================================\n');
}

main().catch(console.error);
