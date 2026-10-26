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

// 1. CNyT 5to
const cnyt5Topics = extractTopics('Ciencias Naturales y Tecnología 5');
const cnyt5Units = groupIntoUnits(cnyt5Topics, [
  { start: 12, end: 59, titulo: 'Unidad 1: Observo y realizo (La célula, Vacunas, Origen de la vida, Universo)' },
  { start: 60, end: 107, titulo: 'Unidad 2: Observo y respondo (Reproducción humana, Reinos de la naturaleza, Agua)' },
  { start: 108, end: 155, titulo: 'Unidad 3: Analizo y respondo (Desarrollo embrionario, Nutrición, Ecosistemas)' },
  { start: 156, end: 202, titulo: 'Unidad 4: Leo y aporto mis ideas (Drogadicción, Fotosíntesis, Reciclaje, Máquinas)' }
]);

// 2. CSyC 5to
const csyc5Topics = extractTopics('Ciencias Sociales y Ciudadana 5');
const csyc5Units = groupIntoUnits(csyc5Topics, [
  { start: 13, end: 59, titulo: 'Unidad 1: Extensión y límites de América, Sociedades prehispánicas, Mesoamérica' },
  { start: 61, end: 107, titulo: 'Unidad 2: Conquista, Época Colonial, Relieve de América y Cultura de Paz' },
  { start: 109, end: 155, titulo: 'Unidad 3: Independencia de América, Población, Desarrollo humano y Legislación' },
  { start: 157, end: 202, titulo: 'Unidad 4: Siglo XX en América, Globalización, Desastres naturales y Participación' }
]);

// 3. CyL 5to
const cyl5Topics = extractTopics('Comunicación y Lenguaje 5');
const cyl5Units = groupIntoUnits(cyl5Topics, [
  { start: 13, end: 59, titulo: 'Unidad 1: Compartamos nuestras experiencias (Conversación, El maíz, Gramática)' },
  { start: 60, end: 108, titulo: 'Unidad 2: Descubriendo nuevos saberes (La narración, Poesía, El verbo)' },
  { start: 109, end: 155, titulo: 'Unidad 3: Convivamos en armonía (El panel, La fábula, Modificadores del sujeto)' },
  { start: 156, end: 198, titulo: 'Unidad 4: Nuestras tradiciones y saberes comunitarios (Medios masivos, Ensayo)' }
]);

console.log('CNyT 5to U1 temas:', cnyt5Units[0].temas.length);
console.log('CSyC 5to U1 temas:', csyc5Units[0].temas.length);
console.log('CyL 5to U1 temas:', cyl5Units[0].temas.length);
