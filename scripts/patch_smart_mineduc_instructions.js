const fs = require('fs');

// ============================================================================
// 1. PATCH src/utils/ragEngine.ts
// ============================================================================
const ragPath = 'src/utils/ragEngine.ts';
let rag = fs.readFileSync(ragPath, 'utf8');

const oldFindExercises = `// Búsqueda de ejercicios literales fácticos en la base de datos de libros MINEDUC
export function findExercisesInMineduc(
  grado: number,
  materia: string,
  pagInicio: number,
  pagFin: number,
  tema?: string
): string[] {`;

const newFindExercises = `// Búsqueda y extracción inteligente de ejercicios e instrucciones literales en libros MINEDUC
export function findExercisesInMineduc(
  grado: number,
  materia: string,
  pagInicio: number,
  pagFin: number,
  tema?: string,
  dia?: DiaSemana
): string[] {`;

if (rag.includes(oldFindExercises)) {
  rag = rag.replace(oldFindExercises, newFindExercises);
}

// Replace the body of findExercisesInMineduc
const targetFindExercisesFull = `// Búsqueda y extracción inteligente de ejercicios e instrucciones literales en libros MINEDUC
export function findExercisesInMineduc(
  grado: number,
  materia: string,
  pagInicio: number,
  pagFin: number,
  tema?: string,
  dia?: DiaSemana
): string[] {
  const matLower = materia.toLowerCase();
  const isSoc = matLower.includes('social') || matLower.includes('ciudad') || matLower.includes('historia') || matLower.includes('geograf');
  const isNat = (matLower.includes('ciencia') || matLower.includes('natural') || matLower.includes('medio')) && !isSoc;
  const isMate = matLower.includes('mate');
  const isLeng = matLower.includes('lengua') || matLower.includes('comunic');

  const matches = mineducDatabase.filter(m => {
    const gMatch = m.grado_especifico === grado;
    const pMatch = m.numero_pagina >= pagInicio && m.numero_pagina <= pagFin;
    if (!gMatch || !pMatch) return false;
    const itemMat = (m.materia || '').toLowerCase();
    if (isSoc) return itemMat.includes('social') || itemMat.includes('ciudad') || itemMat.includes('historia') || itemMat.includes('cs');
    if (isNat) return (itemMat.includes('ciencia') || itemMat.includes('natural') || itemMat.includes('medio')) && !itemMat.includes('social');
    if (isLeng) return itemMat.includes('lengua') || itemMat.includes('comunic');
    if (isMate) return itemMat.includes('mate');
    return true;
  });

  const list: string[] = [];

  if (matches.length > 0) {
    for (const m of matches) {
      if (!m.enunciado_ejercicio || m.enunciado_ejercicio.trim().length <= 15) continue;
      const raw = m.enunciado_ejercicio.replace(/\\s+/g, ' ').trim();

      // Filtrar mensajes institucionales
      if (/estimado|autoridad|editorial|ministr|índice|tabla de contenido|carta al docente|presentación|créditos|himno|guatemala feliz/i.test(raw)) {
        continue;
      }
      if (m.numero_pagina < 8 && /bienvenido|saludo|guatemala|cuadernillo|gratuita/i.test(raw)) {
        continue;
      }

      // 1. Detección de sección "Organizo" / "Nos organizamos" / "Organizamos"
      const organizoMatch = raw.match(/(?:Organizo|Organizamos|Nos organizamos)\\s*[:\\.]?\\s*([^%\\n]{15,350})/i);
      if (organizoMatch) {
        list.push(\`Pág. \${m.numero_pagina}: Organizo: \${organizoMatch[1].trim()}\`);
        continue;
      }

      // 2. Detección de sección "Instrucciones" / "Actividades" / "Aplico" / "En mi cuaderno"
      const instrucMatch = raw.match(/(?:Instrucciones|Instrucción|Actividades|Aplico lo aprendido|En mi cuaderno|Copiamos en el cuaderno)\\s*[:\\.]?\\s*([^%\\n]{15,350})/i);
      if (instrucMatch) {
        list.push(\`Pág. \${m.numero_pagina}: \${instrucMatch[0].trim()}\`);
        continue;
      }

      // 3. Detección de ejercicios numerados (1. ... 2. ...)
      const numberedMatch = raw.match(/(?:1\\.\\s*[^2]{15,200}(?:2\\.\\s*[^3]{15,200})?)/i);
      if (numberedMatch && numberedMatch[0].length > 25) {
        list.push(\`Pág. \${m.numero_pagina}: Actividades del libro: \${numberedMatch[0].trim().slice(0, 320)}\`);
        continue;
      }

      // 4. Detección de viñetas de tareas/experimentos (• ...)
      const bulletMatch = raw.match(/(?:•\\s*[^•]{15,180}(?:•\\s*[^•]{15,180})?)/i);
      if (bulletMatch && bulletMatch[0].length > 25 && !bulletMatch[0].includes('Autoridades') && !bulletMatch[0].includes('Ministeriales')) {
        list.push(\`Pág. \${m.numero_pagina}: Actividades guiadas: \${bulletMatch[0].trim().slice(0, 320)}\`);
        continue;
      }

      // 5. Si la página es expositiva/conceptual sin sección explícita de "Organizo" o "Instrucciones":
      // Aplicar la regla didáctica de dos sesiones
      const esSesion1 = (isNat && (dia === 'Lunes' || !dia)) || 
                        (isSoc && (dia === 'Martes' || !dia)) || 
                        (!isNat && !isSoc && (dia === 'Lunes' || dia === 'Martes' || !dia));

      if (esSesion1) {
        list.push(\`Pág. \${m.numero_pagina}: Sesión 1 (Explicación Docente): Lectura guiada sobre "\${tema || materia}". El docente modela los conceptos clave en pizarra, activa presaberes y formula preguntas generadoras a la clase.\`);
      } else {
        list.push(\`Pág. \${m.numero_pagina}: Sesión 2 (Aplicación en Cuaderno): Lectura comprensiva individual. Los estudiantes extraen las 3 ideas principales del tema en su cuaderno y elaboran un organizador gráfico (cuadro sinóptico o mapa conceptual ilustrado).\`);
      }
    }

    if (list.length > 0) return list;
  }

  // Fallback didáctico riguroso si no se encontraron páginas físicas en BD
  const pInicioEfectiva = pagInicio < 8 ? 8 : pagInicio;
  const esSesion1 = (isNat && (dia === 'Lunes' || !dia)) || (isSoc && (dia === 'Martes' || !dia));
  if (esSesion1) {
    return [
      \`Pág. \${pInicioEfectiva}: Sesión 1 (Explicación Docente): Modelado y explicación de conceptos clave en la pizarra sobre "\${tema || materia}".\`,
      \`Pág. \${pInicioEfectiva}: Lectura compartida en el libro oficial MINEDUC y resolución de preguntas exploratorias.\`
    ];
  } else {
    return [
      \`Pág. \${pInicioEfectiva}: Sesión 2 (Aplicación en Cuaderno): Lectura analítica individual de "\${tema || materia}".\`,
      \`Pág. \${pInicioEfectiva}: Extracción de las 3 ideas principales en el cuaderno y elaboración de un organizador gráfico (mapa conceptual o cuadro comparativo).\`
    ];
  }
}`;

// Replace findExercisesInMineduc from function header to start of formatLiteralExercises
const startMarker = '// Búsqueda y extracción inteligente de ejercicios e instrucciones literales en libros MINEDUC';
const startMarkerOld = '// Búsqueda de ejercicios literales fácticos en la base de datos de libros MINEDUC';
const endMarker = '// Estructurar enunciados literales del libro MINEDUC';

if (rag.includes(startMarker) && rag.includes(endMarker)) {
  const idxStart = rag.indexOf(startMarker);
  const idxEnd = rag.indexOf(endMarker);
  rag = rag.slice(0, idxStart) + targetFindExercisesFull + '\n\n' + rag.slice(idxEnd);
} else if (rag.includes(startMarkerOld) && rag.includes(endMarker)) {
  const idxStart = rag.indexOf(startMarkerOld);
  const idxEnd = rag.indexOf(endMarker);
  rag = rag.slice(0, idxStart) + targetFindExercisesFull + '\n\n' + rag.slice(idxEnd);
}

// Pass dia in the call sites inside generateUnifiedRAGPlan
rag = rag.replace(
  'const matEjercicios = findExercisesInMineduc(g, it.materia, subDia.pagina, subDia.pagina, subDia.titulo);',
  'const matEjercicios = findExercisesInMineduc(g, it.materia, subDia.pagina, subDia.pagina, subDia.titulo, dia);'
);
rag = rag.replace(
  'const ejerciciosDia = findExercisesInMineduc(g, mainItem.materia, subtemaDia.pagina, subtemaDia.pagina, subtemaDia.titulo);',
  'const ejerciciosDia = findExercisesInMineduc(g, mainItem.materia, subtemaDia.pagina, subtemaDia.pagina, subtemaDia.titulo, dia);'
);
rag = rag.replace(
  'const ejerciciosDia2 = secondItem ? findExercisesInMineduc(g, secondItem.materia, subtemaDia2.pagina, subtemaDia2.pagina, subtemaDia2.titulo) : [];',
  'const ejerciciosDia2 = secondItem ? findExercisesInMineduc(g, secondItem.materia, subtemaDia2.pagina, subtemaDia2.pagina, subtemaDia2.titulo, dia) : [];'
);

fs.writeFileSync(ragPath, rag, 'utf8');
console.log('src/utils/ragEngine.ts updated with smart instruction and session extractor!');

// ============================================================================
// 2. PATCH src/app/api/planificacion/route.ts
// ============================================================================
const routePath = 'src/app/api/planificacion/route.ts';
let route = fs.readFileSync(routePath, 'utf8');

// Pass d to findExercisesInMineduc in ragDesglosadoPorDia
route = route.replace(
  'const ejerciciosTextos = findExercisesInMineduc(item.grado, item.materia, pagBuscada, pagBuscada, sub.titulo);',
  'const ejerciciosTextos = findExercisesInMineduc(item.grado, item.materia, pagBuscada, pagBuscada, sub.titulo, d as any);'
);

// Add instruction to prompt
const oldPromptInstructionMarker = 'INSTRUCCIONES CLAVE DE GENERACIÓN Y PRIORIZACIÓN CNB (RF-01 AL RF-09):';
const newPromptInstruction = `INSTRUCCIÓN RIGUROSA SOBRE ACTIVIDADES Y EJERCICIOS DEL LIBRO OFICIAL (RF-06):
- NADA DEBE SER GENÉRICO. DEBES BASARTE EN EL TEXTO REAL RECUPERADO DE LA PÁGINA:
  1. Si la página tiene un apartado de 'Organizo', 'Instrucciones', ejercicios numerados o viñetas: CITA TEXTUALMENTE ESA ACTIVIDAD EXACTA QUE DEBEN RESOLVER (ej: 'Organizo: Realizo un cuadro comparativo...', '1. Copio el mapa...').
  2. Si la página es conceptual y no contiene apartado explícito de ejercicios:
     - En Sesión 1 (Lunes en Naturales, Martes en Sociales): El profesor toma la sesión para modelar y explicar los conceptos clave en la pizarra con preguntas generadoras.
     - En Sesión 2 (Miércoles en Naturales, Jueves en Sociales): Los alumnos leen en su libro, extraen las 3 ideas principales del tema en su cuaderno y elaboran un organizador gráfico (cuadro sinóptico o mapa conceptual ilustrado).

INSTRUCCIONES CLAVE DE GENERACIÓN Y PRIORIZACIÓN CNB (RF-01 AL RF-09):`;

if (route.includes(oldPromptInstructionMarker) && !route.includes('INSTRUCCIÓN RIGUROSA SOBRE ACTIVIDADES')) {
  route = route.replace(oldPromptInstructionMarker, newPromptInstruction);
}

fs.writeFileSync(routePath, route, 'utf8');
console.log('src/app/api/planificacion/route.ts updated with instruction prompt guidelines!');
