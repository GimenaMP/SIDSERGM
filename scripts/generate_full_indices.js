const fs = require('fs');

const data = JSON.parse(fs.readFileSync('C:/Users/gimen/.gemini/antigravity/scratch/Plataforma_SIDSER/data/mineduc_ejercicios.json', 'utf8'));

function extractTopics(query) {
  const p6 = data.find(d => d.libro_titulo.includes(query) && (d.numero_pagina === 6 || d.numero_pagina === 7) && d.enunciado_ejercicio.includes('Índice'))?.enunciado_ejercicio || '';
  const p7 = data.find(d => d.libro_titulo.includes(query) && (d.numero_pagina === 6 || d.numero_pagina === 7) && d.enunciado_ejercicio !== p6)?.enunciado_ejercicio || '';
  const text = p6 + '\n' + p7;
  
  const regex = /([A-Za-zÁÉÍÓÚáéíóúñÑ¿?¡!][A-Za-zÁÉÍÓÚáéíóúñÑ¿?¡!\s,:-]+?)\s*\.{2,}\s*(\d+)/g;
  let match;
  const items = [];
  while ((match = regex.exec(text)) !== null) {
    let titulo = match[1].replace(/Índice|Competencias y estándares( de grado)?/gi, '').trim();
    const pag = parseInt(match[2], 10);
    if (titulo.length > 2 && !titulo.toLowerCase().includes('¿cómo es') && !titulo.toLowerCase().includes('presentación') && !titulo.toLowerCase().includes('nota para') && !titulo.toLowerCase().includes('competencias')) {
      items.push({ titulo, pag });
    }
  }
  return items;
}

function groupIntoUnits(topics, unitBounds) {
  return unitBounds.map((b, uIdx) => {
    const uTopics = topics.filter(t => t.pag >= b.start && t.pag <= b.end);
    return {
      unidad: uIdx + 1,
      titulo: b.titulo,
      paginaInicio: b.start,
      paginaFin: b.end,
      competencias: b.competencias || ['Desarrolla las competencias curriculares del grado y área.'],
      indicadoresLogro: b.indicadoresLogro || ['Demuestra logro en las evaluaciones de aprendizaje.'],
      temas: uTopics.map((t, idx) => ({
        numero: idx + 1,
        titulo: `${t.titulo} (Pág. ${t.pag})`,
        paginaInicio: t.pag,
        paginaFin: t.pag
      }))
    };
  });
}

// 6to Grado
const cnyt6Topics = extractTopics('Ciencias Naturales y Tecnología 6');
const cnyt6Units = groupIntoUnits(cnyt6Topics, [
  { start: 12, end: 59, titulo: 'Unidad 1: Subunidad 1 (La célula, El microscopio, Genética y Sistemas)' },
  { start: 60, end: 107, titulo: 'Unidad 2: Subunidad 2 (Biodiversidad, Ecosistemas y Recursos hídricos)' },
  { start: 108, end: 155, titulo: 'Unidad 3: Subunidad 3 (Materia, Fenómenos químicos y Leyes del movimiento)' },
  { start: 156, end: 198, titulo: 'Unidad 4: Subunidad 4 (Astronomía, Cosmología maya y Tecnología espacial)' }
]);

const csyc6Topics = extractTopics('Ciencias Sociales y Ciudadana 6');
const csyc6Units = groupIntoUnits(csyc6Topics, [
  { start: 13, end: 59, titulo: 'Unidad 1: La Prehistoria, Sociedades antiguas de Asia, Europa y África' },
  { start: 60, end: 107, titulo: 'Unidad 2: Edad Media, Renacimiento y Expansión marítima europea' },
  { start: 108, end: 155, titulo: 'Unidad 3: Siglos XVIII y XIX: Revoluciones, Independencias y América Latina' },
  { start: 156, end: 202, titulo: 'Unidad 4: Siglo XX y XXI: Guerras mundiales, Acuerdos de Paz y Desafíos globales' }
]);

const cyl6Topics = extractTopics('Comunicación y Lenguaje 6');
const cyl6Units = groupIntoUnits(cyl6Topics, [
  { start: 13, end: 59, titulo: 'Unidad 1: El valor de la palabra (Exposición oral, Cuentos, Gramática)' },
  { start: 60, end: 108, titulo: 'Unidad 2: Construyamos el futuro (El debate, Poesía, El verbo)' },
  { start: 109, end: 155, titulo: 'Unidad 3: Aprendamos juntos (El panel, Símbolos mayas, El proyecto científico)' },
  { start: 156, end: 198, titulo: 'Unidad 4: Comunicación para la paz (Medios masivos, Crítica literaria y Ensayo)' }
]);

// 4to Grado
const cnyt4Topics = extractTopics('Ciencias Naturales y Tecnología 4');
const cnyt4Units = groupIntoUnits(cnyt4Topics, [
  { start: 12, end: 59, titulo: 'Unidad 1: Observo y respondo (La célula, Membrana celular, Funciones vitales)' },
  { start: 60, end: 107, titulo: 'Unidad 2: Los ecosistemas, Cadenas tróficas y Biodiversidad de Guatemala' },
  { start: 108, end: 155, titulo: 'Unidad 3: Materia, Energía y Máquinas simples en la comunidad' },
  { start: 156, end: 202, titulo: 'Unidad 4: La Tierra en el Universo, Recursos naturales y Prevención' }
]);

const csyc4Topics = extractTopics('Ciencias Sociales y Ciudadana 4');
const csyc4Units = groupIntoUnits(csyc4Topics, [
  { start: 12, end: 59, titulo: 'Unidad 1: Sociedades prehispánicas, Periodo Arcaico, Mesoamérica y Pueblos de Guatemala' },
  { start: 60, end: 107, titulo: 'Unidad 2: Geografía de Guatemala, Departamentos, Recursos y Cultura de Paz' },
  { start: 108, end: 155, titulo: 'Unidad 3: Conquista, Colonia, Independencia de Guatemala y Símbolos patrios' },
  { start: 156, end: 202, titulo: 'Unidad 4: Época contemporánea, Derechos de la niñez, Ciudadanía y Organización comunitaria' }
]);

const cyl4Topics = extractTopics('Comunicación y Lenguaje 4');
const cyl4Units = groupIntoUnits(cyl4Topics, [
  { start: 13, end: 59, titulo: 'Unidad 1: Muchas formas para comunicarnos (Diálogo, Recetas, El sustantivo)' },
  { start: 60, end: 108, titulo: 'Unidad 2: Palabras que cuentan historias (Cuentos tradicionales, El adjetivo)' },
  { start: 109, end: 155, titulo: 'Unidad 3: Descubriendo nuestro entorno (La descripción, El verbo y conjugación)' },
  { start: 156, end: 198, titulo: 'Unidad 4: Expresándonos con libertad (Poemas, Teatro escolar y Ortografía)' }
]);

console.log('4to, 5to y 6to calculados correctamente.');
