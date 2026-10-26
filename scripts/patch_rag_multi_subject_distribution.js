const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/utils/ragEngine.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update function signature of buildRotationalTimeline
content = content.replace(
  `function buildRotationalTimeline(
  dia: DiaSemana, 
  grados: number[], 
  gradoPrincipal: number,
  materia: string = 'Matemáticas',
  tema: string = 'Contenido CNB',
  paginaDia: number = 8,
  ejerciciosDia: string[] = []
): { `,
  `function buildRotationalTimeline(
  dia: DiaSemana, 
  grados: number[], 
  gradoPrincipal: number,
  materia: string = 'Matemáticas',
  tema: string = 'Contenido CNB',
  paginaDia: number = 8,
  ejerciciosDia: string[] = [],
  materiaSecundaria?: string,
  temaSecundario?: string,
  paginaDiaSecundaria?: number,
  ejerciciosDiaSecundarios?: string[]
): { `
);

// 2. Insert logic for materiaSecundaria before rotation logic
const targetMarker = '  // Rotación del Período 1 (08:15 - 09:05) y Período 2 (09:05 - 09:55)';

const secondaryLogic = `  // Generación didáctica específica para la segunda materia seleccionada (Período 3 y 4)
  if (materiaSecundaria) {
    const mat2Lower = materiaSecundaria.toLowerCase();
    const pag2 = paginaDiaSecundaria || paginaDia;
    const t2 = temaSecundario || 'Tema Integrado';
    const ej2Texto = (ejerciciosDiaSecundarios && ejerciciosDiaSecundarios[0]) ? ejerciciosDiaSecundarios[0].slice(0, 100) : '';

    if (mat2Lower.includes('ciencia') || mat2Lower.includes('medio')) {
      if (dia === 'Lunes') {
        actIndagacion = \`Indagación en \${materiaSecundaria} (Pág. \${pag2} · \${t2}): Observación de ilustraciones y fenómenos naturales del libro oficial MINEDUC, formulación de preguntas de activación sobre el entorno comunitario y dibujo de saberes previos en el cuaderno.\`;
        actConsolidacion = \`Rincón de Ciencias: Manipulación de elementos del entorno escolar, clasificación biológica/ecológica y registro de dos compromisos ambientales en el cuaderno.\`;
      } else if (dia === 'Martes') {
        actIndagacion = \`Comprensión Científica en \${materiaSecundaria} (Pág. \${pag2} · \${t2}): Explicación de relaciones causa-efecto, ciclos biológicos y lectura comentada del texto oficial con resolución guiada de esquemas en cuaderno.\`;
        actConsolidacion = \`Taller de esquemas: Elaboración de mapas conceptuales anatómicos o ecológicos en parejas con coevaluación formativa.\`;
      } else if (dia === 'Miércoles') {
        actIndagacion = \`Aplicación Comunitaria en \${materiaSecundaria} (Pág. \${pag2} · \${t2}): Conexión de la lección con la salud, saneamiento ambiental, siembra y protección de fuentes de agua locales en la comunidad.\`;
        actConsolidacion = \`Rincón de Experimentación: Diseño de carteles ecológicos en grupos mixtos y registro de acciones prácticas de conservación en el hogar.\`;
      } else {
        actIndagacion = \`Consolidación en \${materiaSecundaria} (Pág. \${pag2} · \${t2}): Repaso de conceptos científicos clave, resolución individual de la autoevaluación del libro oficial y preparación para los criterios de la lista de cotejo.\`;
        actConsolidacion = \`Asamblea de Cierre Científico: Exposición de conclusiones grupales y verificación de cuadernos completos con firmas.\`;
      }
    } else if (mat2Lower.includes('social') || mat2Lower.includes('ciudad')) {
      if (dia === 'Lunes') {
        actIndagacion = \`Introducción Cívica y Social en \${materiaSecundaria} (Pág. \${pag2} · \${t2}): Presentación participativa de hechos históricos, geografía y convivencia comunitaria según la página \${pag2} del libro oficial MINEDUC.\`;
        actConsolidacion = \`Registro en el cuaderno de normas de convivencia y valores cívicos identificados en la lección comunitaria.\`;
      } else if (dia === 'Martes') {
        actIndagacion = \`Profundización Cívica en \${materiaSecundaria} (Pág. \${pag2} · \${t2}): Análisis de instituciones locales, derechos y deberes ciudadanos mediante lectura guiada del libro de texto.\`;
        actConsolidacion = \`Elaboración en cuaderno de cuadros comparativos sobre responsabilidades familiares y comunitarias.\`;
      } else if (dia === 'Miércoles') {
        actIndagacion = \`Participación Ciudadana en \${materiaSecundaria} (Pág. \${pag2} · \${t2}): Estudio de casos de liderazgo comunitario, comisiones del Gobierno Escolar y resolución pacífica de conflictos.\`;
        actConsolidacion = \`Simulación de asamblea comunitaria y redacción del decálogo de convivencia del aula.\`;
      } else {
        actIndagacion = \`Síntesis Cívica en \${materiaSecundaria} (Pág. \${pag2} · \${t2}): Balance semanal de aprendizajes cívicos, autoevaluación formativa del libro oficial MINEDUC y verificación de logros.\`;
        actConsolidacion = \`Portafolio Cívico: Organización de notas y revisión de la lista de cotejo ciudadana para el viernes.\`;
      }
    } else if (mat2Lower.includes('lengua') || mat2Lower.includes('comunic')) {
      if (dia === 'Lunes') {
        actIndagacion = \`Lectura Comprensiva en \${materiaSecundaria} (Pág. \${pag2} · \${t2}): Lectura compartida del texto oficial MINEDUC, localización de vocabulario clave y preguntas de inferencia.\`;
        actConsolidacion = \`Rincón de Lectura: Práctica de fluidez lectora en parejas con tarjetas de palabras y oraciones.\`;
      } else if (dia === 'Martes') {
        actIndagacion = \`Taller de Redacción en \${materiaSecundaria} (Pág. \${pag2} · \${t2}): Explicación de reglas gramaticales y ortográficas con modelado en pizarra y redacción guiada de oraciones en cuaderno.\`;
        actConsolidacion = \`Intercambio de cuadernos para coevaluación ortográfica entre compañeros de clase.\`;
      } else if (dia === 'Miércoles') {
        actIndagacion = \`Expresión Oral y Comunitaria en \${materiaSecundaria} (Pág. \${pag2} · \${t2}): Narración de anécdotas locales, leyendas y producción de párrafos descriptivos sobre la comunidad.\`;
        actConsolidacion = \`Elaboración de un mural lingüístico con coplas, refranes y adivinanzas populares de la región.\`;
      } else {
        actIndagacion = \`Consolidación Lingüística en \${materiaSecundaria} (Pág. \${pag2} · \${t2}): Autoevaluación de comprensión lectora en el libro oficial MINEDUC y preparación de la lista de cotejo.\`;
        actConsolidacion = \`Firma de compromisos de lectura diaria y repaso final de vocabulario para el test del viernes.\`;
      }
    } else {
      actIndagacion = \`Aplicación Práctica en \${materiaSecundaria} (Pág. \${pag2} · \${t2}): Ejercitación guiada en libro oficial y cuaderno con planteamiento de situaciones cotidianas.\`;
      actConsolidacion = \`Rincón de Aprendizaje: Comprobación de resultados en parejas y síntesis en cuaderno.\`;
    }
  }

  // Rotación del Período 1 (08:15 - 09:05) y Período 2 (09:05 - 09:55)`;

content = content.replace(targetMarker, secondaryLogic);

// 3. Update rotation logic for Monogrado vs Multigrado
const oldRotationTexts = `  const modalidad: 'Atención Directa Docente' | 'Trabajo Autónomo con Guía' | 'Trabajo Cooperativo / Práctica' =
    tieneDirectaP1 ? 'Atención Directa Docente' : (tieneDirectaP2 ? 'Trabajo Autónomo con Guía' : 'Trabajo Cooperativo / Práctica');

  const p1Text = tieneDirectaP1
    ? \`08:15 - 09:05 | Atención Directa Docente: \${docDirecta}\`
    : \`08:15 - 09:05 | Trabajo Autónomo con Guía: \${estAutonomo}\`;

  const p2Text = tieneDirectaP2
    ? \`09:05 - 09:55 | Atención Directa Docente (Rotación): El maestro rota a este grado. \${docDirecta}\`
    : \`09:05 - 09:55 | Trabajo Autónomo con Guía: \${estAutonomo}\`;

  const p3Text = tieneDirectaP3
    ? \`10:30 - 11:15 | Atención Directa de Profundización (\${gradoPrincipal}.° Grado): Orientación en \${materia} sobre "\${tema}" (Pág. \${paginaDia}).\`
    : \`10:30 - 11:15 | Bloque Integrado e Indagación (\${gradoPrincipal}.° Grado): \${actIndagacion}\`;

  const p4Text = \`11:15 - 11:50 | Práctica Autónoma y Consolidación (\${gradoPrincipal}.° Grado): \${actConsolidacion}\`;`;

const newRotationTexts = `  const isMonogrado = (grados.length === 1);
  const modalidad: 'Atención Directa Docente' | 'Trabajo Autónomo con Guía' | 'Trabajo Cooperativo / Práctica' =
    isMonogrado 
      ? 'Atención Directa Docente' 
      : (tieneDirectaP1 ? 'Atención Directa Docente' : (tieneDirectaP2 ? 'Trabajo Autónomo con Guía' : 'Trabajo Cooperativo / Práctica'));

  let p1Text = '';
  let p2Text = '';
  let p3Text = '';
  let p4Text = '';

  if (isMonogrado) {
    p1Text = \`08:15 - 09:05 | \${materia} (Atención Directa y Modelado): \${docDirecta}\`;
    p2Text = \`09:05 - 09:55 | \${materia} (Ejercitación en Cuaderno y Libro): Los estudiantes resuelven de forma individual y guiada los ejercicios del libro oficial MINEDUC (Pág. \${paginaDia} · \${tema}) en el cuaderno, mientras el docente atiende dudas y supervisa.\`;
    p3Text = materiaSecundaria
      ? \`10:30 - 11:15 | \${materiaSecundaria} (Atención Directa e Indagación): \${actIndagacion}\`
      : \`10:30 - 11:15 | \${materia} (Aplicación Comunitaria): \${actIndagacion}\`;
    p4Text = \`11:15 - 11:50 | Rincones de Aprendizaje y Fijación (\${gradoPrincipal}.° Grado): \${actConsolidacion}\`;
  } else {
    p1Text = tieneDirectaP1
      ? \`08:15 - 09:05 | \${materia} (Atención Directa Docente): \${docDirecta}\`
      : \`08:15 - 09:05 | \${materia} (Trabajo Autónomo con Guía): \${estAutonomo}\`;

    p2Text = tieneDirectaP2
      ? \`09:05 - 09:55 | \${materia} (Atención Directa Docente - Rotación): El maestro rota a este grado. \${docDirecta}\`
      : \`09:05 - 09:55 | \${materia} (Trabajo Autónomo con Guía): \${estAutonomo}\`;

    p3Text = materiaSecundaria
      ? \`10:30 - 11:15 | \${materiaSecundaria} (Bloque Integrado / Tema Eje · Pág. \${paginaDiaSecundaria || paginaDia}): \${actIndagacion}\`
      : (tieneDirectaP3
          ? \`10:30 - 11:15 | Atención Directa de Profundización (\${gradoPrincipal}.° Grado): Orientación en \${materia} sobre "\${tema}" (Pág. \${paginaDia}).\`
          : \`10:30 - 11:15 | Bloque Integrado e Indagación (\${gradoPrincipal}.° Grado): \${actIndagacion}\`);

    p4Text = \`11:15 - 11:50 | Rincones de Aprendizaje y Tutoría entre Pares (\${gradoPrincipal}.° Grado): \${actConsolidacion}\`;
  }`;

content = content.replace(oldRotationTexts, newRotationTexts);

// 4. Update the call to buildRotationalTimeline in generateUnifiedRAGPlan
const oldCallBlock = `        const mainItem = itemsG[0];
        const subtemaDia = getSubtemaForDay(dia, mainItem);
        const ejerciciosDia = findExercisesInMineduc(g, mainItem.materia, subtemaDia.pagina, subtemaDia.pagina, subtemaDia.titulo);
        const rotacion = buildRotationalTimeline(
          dia, 
          grados, 
          g, 
          mainItem.materia, 
          subtemaDia.titulo, 
          subtemaDia.pagina, 
          ejerciciosDia
        );`;

const newCallBlock = `        const mainItem = itemsG[0];
        const secondItem = itemsG[1] || null;
        const subtemaDia = getSubtemaForDay(dia, mainItem);
        const subtemaDia2 = secondItem ? getSubtemaForDay(dia, secondItem) : null;
        const ejerciciosDia = findExercisesInMineduc(g, mainItem.materia, subtemaDia.pagina, subtemaDia.pagina, subtemaDia.titulo);
        const ejerciciosDia2 = secondItem ? findExercisesInMineduc(g, secondItem.materia, subtemaDia2.pagina, subtemaDia2.pagina, subtemaDia2.titulo) : [];

        const rotacion = buildRotationalTimeline(
          dia, 
          grados, 
          g, 
          mainItem.materia, 
          subtemaDia.titulo, 
          subtemaDia.pagina, 
          ejerciciosDia,
          secondItem ? secondItem.materia : undefined,
          subtemaDia2 ? subtemaDia2.titulo : undefined,
          subtemaDia2 ? subtemaDia2.pagina : undefined,
          ejerciciosDia2
        );`;

content = content.replace(oldCallBlock, newCallBlock);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✓ Successfully patched ragEngine.ts with multi-subject distribution and Monogrado vs Multigrado logic!');
