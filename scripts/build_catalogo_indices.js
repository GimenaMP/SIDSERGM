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
      competencias: b.competencias || ['Desarrolla las competencias curriculares del CNB para el grado y área.'],
      indicadoresLogro: b.indicadoresLogro || ['Demuestra logro en las evaluaciones formativas y sumativas.'],
      temas: uTopics.map((t, idx) => ({
        numero: idx + 1,
        titulo: `${t.titulo} (Pág. ${t.pag})`,
        paginaInicio: t.pag,
        paginaFin: t.pag
      }))
    };
  });
}

// Generar objeto con todas las materias actualizadas para 4, 5 y 6
const catalogUpdates = {
  4: {
    cnyt: groupIntoUnits(extractTopics('Ciencias Naturales y Tecnología 4'), [
      { start: 12, end: 59, titulo: 'Unidad 1: Observo y respondo (La célula, Membrana celular, Funciones vitales)' },
      { start: 60, end: 107, titulo: 'Unidad 2: Los ecosistemas, Cadenas tróficas y Biodiversidad de Guatemala' },
      { start: 108, end: 155, titulo: 'Unidad 3: Materia, Energía y Máquinas simples en la comunidad' },
      { start: 156, end: 202, titulo: 'Unidad 4: La Tierra en el Universo, Recursos naturales y Prevención' }
    ]),
    csyc: groupIntoUnits(extractTopics('Ciencias Sociales y Ciudadana 4'), [
      { start: 12, end: 59, titulo: 'Unidad 1: Sociedades prehispánicas, Periodo Arcaico, Mesoamérica y Pueblos de Guatemala' },
      { start: 60, end: 107, titulo: 'Unidad 2: Geografía de Guatemala, Departamentos, Recursos y Cultura de Paz' },
      { start: 108, end: 155, titulo: 'Unidad 3: Conquista, Colonia, Independencia de Guatemala y Símbolos patrios' },
      { start: 156, end: 202, titulo: 'Unidad 4: Época contemporánea, Derechos de la niñez, Ciudadanía y Organización' }
    ]),
    cyl: groupIntoUnits(extractTopics('Comunicación y Lenguaje 4'), [
      { start: 13, end: 59, titulo: 'Unidad 1: Muchas formas para comunicarnos (Diálogo, Recetas, El sustantivo)' },
      { start: 60, end: 108, titulo: 'Unidad 2: Palabras que cuentan historias (Cuentos tradicionales, El adjetivo)' },
      { start: 109, end: 155, titulo: 'Unidad 3: Descubriendo nuestro entorno (La descripción, El verbo y conjugación)' },
      { start: 156, end: 198, titulo: 'Unidad 4: Expresándonos con libertad (Poemas, Teatro escolar y Ortografía)' }
    ])
  },
  5: {
    cnyt: groupIntoUnits(extractTopics('Ciencias Naturales y Tecnología 5'), [
      { start: 12, end: 59, titulo: 'Unidad 1: Observo y realizo (La célula, Vacunas, Origen de la vida, Universo)' },
      { start: 60, end: 107, titulo: 'Unidad 2: Observo y respondo (Reproducción humana, Reinos de la naturaleza, Agua)' },
      { start: 108, end: 155, titulo: 'Unidad 3: Analizo y respondo (Desarrollo embrionario, Nutrición, Ecosistemas)' },
      { start: 156, end: 202, titulo: 'Unidad 4: Leo y aporto mis ideas (Drogadicción, Fotosíntesis, Reciclaje, Máquinas)' }
    ]),
    csyc: groupIntoUnits(extractTopics('Ciencias Sociales y Ciudadana 5'), [
      { start: 13, end: 59, titulo: 'Unidad 1: Extensión y límites de América, Sociedades prehispánicas, Mesoamérica' },
      { start: 61, end: 107, titulo: 'Unidad 2: Conquista, Época Colonial, Relieve de América y Cultura de Paz' },
      { start: 109, end: 155, titulo: 'Unidad 3: Independencia de América, Población, Desarrollo humano y Legislación' },
      { start: 157, end: 202, titulo: 'Unidad 4: Siglo XX en América, Globalización, Desastres naturales y Participación' }
    ]),
    cyl: groupIntoUnits(extractTopics('Comunicación y Lenguaje 5'), [
      { start: 13, end: 59, titulo: 'Unidad 1: Compartamos nuestras experiencias (Conversación, El maíz, Gramática)' },
      { start: 60, end: 108, titulo: 'Unidad 2: Descubriendo nuevos saberes (La narración, Poesía, El verbo)' },
      { start: 109, end: 155, titulo: 'Unidad 3: Convivamos en armonía (El panel, La fábula, Modificadores del sujeto)' },
      { start: 156, end: 198, titulo: 'Unidad 4: Nuestras tradiciones y saberes comunitarios (Medios masivos, Ensayo)' }
    ])
  },
  6: {
    cnyt: groupIntoUnits(extractTopics('Ciencias Naturales y Tecnología 6'), [
      { start: 12, end: 59, titulo: 'Unidad 1: Subunidad 1 (La célula, El microscopio, Genética y Sistemas)' },
      { start: 60, end: 107, titulo: 'Unidad 2: Subunidad 2 (Biodiversidad, Ecosistemas y Recursos hídricos)' },
      { start: 108, end: 155, titulo: 'Unidad 3: Subunidad 3 (Materia, Fenómenos químicos y Leyes del movimiento)' },
      { start: 156, end: 198, titulo: 'Unidad 4: Subunidad 4 (Astronomía, Cosmología maya y Tecnología espacial)' }
    ]),
    csyc: groupIntoUnits(extractTopics('Ciencias Sociales y Ciudadana 6'), [
      { start: 13, end: 59, titulo: 'Unidad 1: La Prehistoria, Sociedades antiguas de Asia, Europa y África' },
      { start: 60, end: 107, titulo: 'Unidad 2: Edad Media, Renacimiento y Expansión marítima europea' },
      { start: 108, end: 155, titulo: 'Unidad 3: Siglos XVIII y XIX: Revoluciones, Independencias y América Latina' },
      { start: 156, end: 202, titulo: 'Unidad 4: Siglo XX y XXI: Guerras mundiales, Acuerdos de Paz y Desafíos globales' }
    ]),
    cyl: groupIntoUnits(extractTopics('Comunicación y Lenguaje 6'), [
      { start: 13, end: 59, titulo: 'Unidad 1: El valor de la palabra (Exposición oral, Cuentos, Gramática)' },
      { start: 60, end: 108, titulo: 'Unidad 2: Construyamos el futuro (El debate, Poesía, El verbo)' },
      { start: 109, end: 155, titulo: 'Unidad 3: Aprendamos juntos (El panel, Símbolos mayas, El proyecto científico)' },
      { start: 156, end: 198, titulo: 'Unidad 4: Comunicación para la paz (Medios masivos, Crítica literaria y Ensayo)' }
    ])
  }
};

fs.writeFileSync('C:/Users/gimen/.gemini/antigravity/scratch/Plataforma_SIDSER/data/catalogo_indices_extraidos.json', JSON.stringify(catalogUpdates, null, 2), 'utf8');
console.log('Archivo catalogo_indices_extraidos.json guardado con éxito.');
