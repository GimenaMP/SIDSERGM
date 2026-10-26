const fs = require('fs');
let code = fs.readFileSync('src/utils/ragEngine.ts', 'utf8');

// 1. Update SelectedItemParam interface
const selParamTarget = `export interface SelectedItemParam {
  grado: number;
  materia: string;
  materiaId?: string;
  materiaBase?: string;
  libroTitulo: string;
  unidad: number;
  unidadTitulo: string;
  tema: string;
  temaNumero: number;
  todosLosTemasNumeros?: number[];
  paginaInicio: number;
  paginaFin: number;
  competencias?: string[];
  indicadores?: string[];
  periodosSemanales?: number;
  pesoPorcentaje?: number;
}`;

const selParamReplacement = `export interface SelectedItemParam {
  grado: number;
  materia: string;
  materiaId?: string;
  materiaBase?: string;
  libroTitulo: string;
  unidad: number;
  unidadTitulo: string;
  tema: string;
  temaNumero: number;
  todosLosTemasNumeros?: number[];
  temasSeleccionados?: {
    numero: number;
    titulo: string;
    paginaInicio: number;
    paginaFin: number;
  }[];
  paginaInicio: number;
  paginaFin: number;
  competencias?: string[];
  indicadores?: string[];
  periodosSemanales?: number;
  pesoPorcentaje?: number;
}`;

if (code.includes(selParamTarget)) {
  code = code.replace(selParamTarget, selParamReplacement);
  console.log('Updated SelectedItemParam interface');
} else {
  console.log('Could not find exact SelectedItemParam interface, attempting regex replace');
  code = code.replace(/export interface SelectedItemParam \{[\s\S]*?pesoPorcentaje\?: number;\s*\}/, selParamReplacement);
}

// 2. Add getSubtemaForDay function before buildRotationalTimeline
const helperCode = `
// ============================================================================
// HELPER PARA OBTENER EL SUBTEMA Y PÁGINA ESPECÍFICA POR DÍA DE LA SEMANA
// ============================================================================
export function getSubtemaForDay(
  dia: DiaSemana,
  mainItem: SelectedItemParam
): { titulo: string; pagina: number } {
  if (mainItem.temasSeleccionados && mainItem.temasSeleccionados.length > 0) {
    const list = mainItem.temasSeleccionados;
    if (list.length === 1) {
      const t = list[0];
      const pag = (dia === 'Miércoles' || dia === 'Jueves') && t.paginaFin > t.paginaInicio 
        ? t.paginaFin 
        : t.paginaInicio;
      return { titulo: t.titulo, pagina: pag };
    }
    if (list.length === 2) {
      const idx = (dia === 'Lunes' || dia === 'Martes') ? 0 : 1;
      return { titulo: list[idx].titulo, pagina: list[idx].paginaInicio };
    }
    if (list.length === 3) {
      const idx = dia === 'Lunes' ? 0 : dia === 'Martes' ? 1 : 2;
      return { titulo: list[idx].titulo, pagina: list[idx].paginaInicio };
    }
    const idx = dia === 'Lunes' ? 0 : dia === 'Martes' ? 1 : dia === 'Miércoles' ? 2 : 3;
    const item = list[idx] || list[list.length - 1];
    return { titulo: item.titulo, pagina: item.paginaInicio };
  }

  if (mainItem.tema.includes(',')) {
    const parts = mainItem.tema.split(',').map(p => p.trim()).filter(Boolean);
    if (parts.length > 1) {
      let partIndex = 0;
      if (parts.length === 2) {
        partIndex = (dia === 'Lunes' || dia === 'Martes') ? 0 : 1;
      } else if (parts.length === 3) {
        partIndex = dia === 'Lunes' ? 0 : dia === 'Martes' ? 1 : 2;
      } else {
        partIndex = dia === 'Lunes' ? 0 : dia === 'Martes' ? 1 : dia === 'Miércoles' ? 2 : 3;
      }
      const part = parts[partIndex] || parts[0];
      const pageMatch = part.match(/\\(Pág\\.\\s*(\\d+)\\)/i);
      const pag = pageMatch ? parseInt(pageMatch[1], 10) : (mainItem.paginaInicio + partIndex);
      return { titulo: part, pagina: pag };
    }
  }

  const pInicio = mainItem.paginaInicio || 8;
  const pFin = mainItem.paginaFin || pInicio;
  let pDia = pInicio;
  if (pFin > pInicio) {
    if (dia === 'Martes') pDia = Math.min(pInicio + 1, pFin);
    else if (dia === 'Miércoles') pDia = Math.min(pInicio + 2, pFin);
    else if (dia === 'Jueves') pDia = pFin;
  }
  return { titulo: mainItem.tema, pagina: pDia };
}
`;

// Insert getSubtemaForDay right before buildRotationalTimeline
const rotStartIdx = code.indexOf('function buildRotationalTimeline');
if (rotStartIdx !== -1) {
  code = code.slice(0, rotStartIdx) + helperCode + '\n' + code.slice(rotStartIdx);
  console.log('Added getSubtemaForDay helper');
}

// 3. Update buildRotationalTimeline definition and body
const newBuildRotationalTimeline = `function buildRotationalTimeline(
  dia: DiaSemana, 
  grados: number[], 
  gradoPrincipal: number,
  materia: string = 'Matemáticas',
  tema: string = 'Contenido CNB',
  paginaDia: number = 8,
  ejerciciosDia: string[] = []
): { 
  tiempos: TimeAllocation[]; 
  modalidad: 'Atención Directa Docente' | 'Trabajo Autónomo con Guía' | 'Trabajo Cooperativo / Práctica'; 
  actividadDocente: string; 
  actividadEstudiante: string;
  periodo1_actividad: string;
  periodo2_actividad: string;
  periodo3_actividad: string;
  periodo4_actividad: string;
} {
  const gIndex = grados.indexOf(gradoPrincipal);
  const matLower = materia.toLowerCase();
  const ejTexto = (ejerciciosDia[0] || '').slice(0, 100);

  let docDirecta = '';
  let estDirecta = '';
  let docAutonomo = '';
  let estAutonomo = '';
  let actIndagacion = '';
  let actConsolidacion = '';

  if (dia === 'Lunes') {
    // FASE 1: APERTURA Y MODELADO CONCEPTUAL INICIAL
    if (matLower.includes('lengua') || matLower.includes('comunic')) {
      docDirecta = \`Fase de Apertura (Pág. \${paginaDia} · \${tema}): Presentación en pizarra del vocabulario clave y modelado de lectura comprensiva. El docente lee en voz alta con entonación adecuada y formula preguntas de activación previa.\`;
      estDirecta = \`Lectura compartida en el libro oficial MINEDUC (Pág. \${paginaDia}), seguimiento con el dedo, subrayado de palabras desconocidas y participación en el diálogo guiado.\`;
      docAutonomo = \`Acompañamiento rotativo pupitre por pupitre para verificar la comprensión del texto de la página \${paginaDia}.\`;
      estAutonomo = \`Trabajo Autónomo en Cuaderno (Pág. \${paginaDia}): Lectura silenciosa y resolución de las preguntas exploratorias y ejercicios del libro en el cuaderno de líneas.\`;
      actIndagacion = \`Rincón de Lectura: Práctica de fluidez lectora en parejas utilizando tarjetas de vocabulario de la página \${paginaDia}.\`;
      actConsolidacion = \`Registro del glosario con 3 términos nuevos de la lección en el cuaderno ilustrados con dibujos.\`;
    } else if (matLower.includes('ciencia') || matLower.includes('medio')) {
      docDirecta = \`Fase de Exploración (Pág. \${paginaDia} · \${tema}): Explicación de los principios científicos centrales y formulación de preguntas generadoras conectadas con el entorno comunitario.\`;
      estDirecta = \`Observación atenta de imágenes del libro (Pág. \${paginaDia}), toma de notas y formulación de hipótesis en el cuaderno.\`;
      docAutonomo = \`Supervisión de esquemas iniciales y orientación a los estudiantes en la lectura del texto oficial.\`;
      estAutonomo = \`Trabajo Autónomo (Pág. \${paginaDia}): Lectura guiada en el libro MINEDUC y dibujo del esquema explicativo en el cuaderno.\`;
      actIndagacion = \`Rincón de Ciencias: Clasificación de elementos naturales u objetos del entorno escolar vinculados a la lección.\`;
      actConsolidacion = \`Construcción colectiva del mapa conceptual inicial en la pizarra y copia en el cuaderno.\`;
    } else if (matLower.includes('social') || matLower.includes('ciudad')) {
      docDirecta = \`Fase de Introducción Cívica (Pág. \${paginaDia} · \${tema}): Presentación participativa de hechos históricos, geografía y convivencia comunitaria según la página \${paginaDia}.\`;
      estDirecta = \`Participación en la lluvia de ideas y análisis de la situación social de la comunidad.\`;
      docAutonomo = \`Monitoreo de la lectura de textos y mapas del libro oficial MINEDUC.\`;
      estAutonomo = \`Trabajo Autónomo (Pág. \${paginaDia}): Lectura del texto introductorio y respuesta a preguntas de reflexión en el cuaderno.\`;
      actIndagacion = \`Conversatorio grupal sobre los derechos, responsabilidades y valores cívicos en la aldea.\`;
      actConsolidacion = \`Redacción de compromisos de convivencia armónica en el cuaderno de trabajo.\`;
    } else {
      // Matemáticas Lunes
      docDirecta = \`Fase de Modelado (Pág. \${paginaDia} · \${tema}): El maestro explica en la pizarra los conceptos fundamentales paso a paso, modela la resolución del ejercicio muestra (\${ejTexto || 'ejercicio 1'}) y aclara dudas antes de asignar el trabajo autónomo.\`;
      estDirecta = \`Atención al modelado docente en la pizarra, resolución guiada de dos ejemplos y copia del procedimiento en el cuaderno cuadriculado.\`;
      docAutonomo = \`Supervisión individual del planteamiento matemático y corrección de la alineación numérica en los cuadernos.\`;
      estAutonomo = \`Trabajo Autónomo (Pág. \${paginaDia} · \${tema}): Resolución individual en el cuaderno cuadriculado de los primeros incisos de cálculo del libro oficial MINEDUC (\${ejTexto || 'incisos a, b y c'}).\`;
      actIndagacion = \`Rincón de Matemáticas: Uso de material concreto (semillas, tapitas, ábaco o billetes) para comprobar las cantidades y operaciones de la página \${paginaDia}.\`;
      actConsolidacion = \`Comprobación colectiva en la pizarra del primer ejercicio y cálculo mental de cierre.\`;
    }
  } else if (dia === 'Martes') {
    // FASE 2: PROFUNDIZACIÓN Y EJERCITACIÓN GUIADA
    if (matLower.includes('lengua') || matLower.includes('comunic')) {
      docDirecta = \`Fase de Profundización (Pág. \${paginaDia} · \${tema}): Análisis de concordancia gramatical, estructura sintáctica y redacción dirigida de oraciones en la pizarra.\`;
      estDirecta = \`Identificación de conectores, adjetivos o verbos en oraciones muestra y redacción guiada en la pizarra.\`;
      docAutonomo = \`Orientación en redacción individual y corrección de ortografía y puntuación en los pupitres.\`;
      estAutonomo = \`Trabajo Autónomo (Pág. \${paginaDia}): Producción de un párrafo descriptivo en el cuaderno y resolución de las actividades gramaticales del libro MINEDUC.\`;
      actIndagacion = \`Taller de escritura creativa en parejas: Redactar un cartel con mensajes sobre la convivencia escolar.\`;
      actConsolidacion = \`Intercambio de cuadernos para coevaluación ortográfica con lápiz de color.\`;
    } else if (matLower.includes('ciencia') || matLower.includes('medio')) {
      docDirecta = \`Fase de Profundización Experimental (Pág. \${paginaDia} · \${tema}): Análisis de relaciones causa-efecto, ciclos y procesos naturales guiados por el libro de texto.\`;
      estDirecta = \`Elaboración de tablas comparativas en el cuaderno y análisis de los experimentos o datos presentados.\`;
      docAutonomo = \`Guía en el registro metódico de observaciones científicas en los cuadernos.\`;
      estAutonomo = \`Trabajo Autónomo (Pág. \${paginaDia}): Resolución de las actividades de experimentación y cuestionarios analíticos del libro MINEDUC.\`;
      actIndagacion = \`Experimentación guiada con muestras botánicas o recursos del entorno en el Rincón de Ciencias.\`;
      actConsolidacion = \`Redacción de conclusiones científicas fundamentadas en el cuaderno.\`;
    } else if (matLower.includes('social') || matLower.includes('ciudad')) {
      docDirecta = \`Fase de Análisis Social (Pág. \${paginaDia} · \${tema}): Interpretación crítica de hechos del pasado y su impacto en la organización comunitaria actual.\`;
      estDirecta = \`Análisis de líneas de tiempo, mapas temáticos y debate moderado por el maestro.\`;
      docAutonomo = \`Acompañamiento en el análisis de fuentes históricas y cuadros de datos del libro.\`;
      estAutonomo = \`Trabajo Autónomo (Pág. \${paginaDia}): Resolución de actividades analíticas del libro MINEDUC y cuadro comparativo de causas y consecuencias.\`;
      actIndagacion = \`Dramatización o juego de roles sobre la mediación de conflictos en el Gobierno Escolar.\`;
      actConsolidacion = \`Registro de propuestas para el fortalecimiento comunitario en el cuaderno.\`;
    } else {
      // Matemáticas Martes
      docDirecta = \`Fase de Ejercitación Dirigida (Pág. \${paginaDia} · \${tema}): Resolución de problemas de mayor complejidad, análisis de errores comunes en el cálculo y modelado de estrategias de simplificación.\`;
      estDirecta = \`Planteamiento guiado de operaciones combinadas o fracciones complejas y comprobación en la pizarra.\`;
      docAutonomo = \`Verificación de procedimientos paso a paso y atención diferenciada a estudiantes que requieren refuerzo.\`;
      estAutonomo = \`Trabajo Autónomo (Pág. \${paginaDia} · \${tema}): Resolución individual en el cuaderno de los incisos avanzados y problemas de aplicación del libro oficial MINEDUC (\${ejTexto || 'ejercicios de práctica'}).\`;
      actIndagacion = \`Resolución en parejas de desafíos matemáticos con apoyo de tarjetas didácticas numéricas.\`;
      actConsolidacion = \`Corrección colaborativa de ejercicios y verificación del orden algorítmico en el cuaderno.\`;
    }
  } else if (dia === 'Miércoles') {
    // FASE 3: INDAGACIÓN, APLICACIÓN CONTEXTUAL Y TUTORÍA ENTRE PARES
    if (matLower.includes('lengua') || matLower.includes('comunic')) {
      docDirecta = \`Fase de Aplicación Comunitaria (Pág. \${paginaDia} · \${tema}): Vinculación de la lectura y expresión oral con los relatos, leyendas y oficios de la aldea.\`;
      estDirecta = \`Lectura dramatizada o exposición oral corta aplicando entonación, fluidez y volumen adecuado.\`;
      docAutonomo = \`Monitoreo de tutoría entre pares: estudiantes mayores apoyan en la fluidez de lectura a los de menor grado.\`;
      estAutonomo = \`Trabajo Autónomo (Pág. \${paginaDia}): Redacción de un texto testimonial o resumen estructurado aplicando las reglas de la unidad en el cuaderno.\`;
      actIndagacion = \`Círculo de lectura comunitaria: Los estudiantes comparten anécdotas locales y saberes ancestrales.\`;
      actConsolidacion = \`Elaboración de una ficha de síntesis para el mural pedagógico del aula.\`;
    } else if (matLower.includes('ciencia') || matLower.includes('medio')) {
      docDirecta = \`Fase de Aplicación Ecológica (Pág. \${paginaDia} · \${tema}): Conexión de la lección con el cuidado del medio ambiente, la salud preventiva y los recursos locales.\`;
      estDirecta = \`Propuesta de acciones concretas de conservación comunitaria y exposición de conclusiones.\`;
      docAutonomo = \`Orientación a grupos mixtos en el diseño de proyectos escolares de higiene o medio ambiente.\`;
      estAutonomo = \`Trabajo Autónomo (Pág. \${paginaDia}): Resolución de los ejercicios de aplicación comunitaria del libro MINEDUC y diseño de un afiche ecológico.\`;
      actIndagacion = \`Recorrido por el huerto o patio escolar para registrar evidencias vivas del tema estudiado.\`;
      actConsolidacion = \`Síntesis grupal y registro en el cuaderno de compromisos con la madre naturaleza.\`;
    } else if (matLower.includes('social') || matLower.includes('ciudad')) {
      docDirecta = \`Fase de Integración Ciudadana (Pág. \${paginaDia} · \${tema}): Estudio de casos de liderazgo comunitario, autoridades locales y participación de la niñez.\`;
      estDirecta = \`Propuesta de mejoras cívicas para la escuela multigrado en diálogo con el maestro.\`;
      docAutonomo = \`Supervisión de dinámicas cooperativas y registro de acuerdos en actas simuladas.\`;
      estAutonomo = \`Trabajo Autónomo (Pág. \${paginaDia}): Completación de esquemas cívicos del libro MINEDUC y redacción de propuestas de convivencia.\`;
      actIndagacion = \`Sesión de comisiones del Gobierno Escolar para organizar el rincón de paz del aula.\`;
      actConsolidacion = \`Elaboración de un decálogo de convivencia para exhibir en el aula.\`;
    } else {
      // Matemáticas Miércoles
      docDirecta = \`Fase de Aplicación Comunitaria (Pág. \${paginaDia} · \${tema}): Formulación de problemas matemáticos contextualizados en el mercado local, cosecha agrícola y compras familiares.\`;
      estDirecta = \`Planteamiento y cálculo de presupuestos reales en Quetzales usando operaciones de "\${tema}".\`;
      docAutonomo = \`Tutoría entre pares: estudiantes de grado superior apoyan en la verificación de cálculos a los menores.\`;
      estAutonomo = \`Trabajo Autónomo y Cooperativo (Pág. \${paginaDia} · \${tema}): Resolución individual de los problemas contextuales del libro MINEDUC (\${ejTexto || 'problemas contextuales'}), registrando datos, planteamiento y respuesta completa.\`;
      actIndagacion = \`Juego de simulación "Mercadito Escolar": compra y venta con billetes didácticos aplicando el tema.\`;
      actConsolidacion = \`Registro del balance comercial y comprobación aritmética en cuaderno.\`;
    }
  } else {
    // FASE 4 (JUEVES): SÍNTESIS, CONSOLIDACIÓN Y PREPARACIÓN PARA EVALUACIÓN
    if (matLower.includes('lengua') || matLower.includes('comunic')) {
      docDirecta = \`Fase de Síntesis Semanal (Pág. \${paginaDia} · \${tema}): Revisión integral de indicadores de logro, aclaración final de dudas y simulación de prueba de comprensión.\`;
      estDirecta = \`Resolución de preguntas de autoevaluación, repaso de vocabulario y lectura de verificación.\`;
      docAutonomo = \`Revisión de cuadernos completos y orientación individualizada a estudiantes con rezago.\`;
      estAutonomo = \`Trabajo Autónomo (Pág. \${paginaDia}): Resolución de la sección "Compruebo mis aprendizajes" del libro oficial MINEDUC en silencio en el cuaderno.\`;
      actIndagacion = \`Revisión colectiva de la lista de cotejo para verificar criterios alcanzados durante la semana.\`;
      actConsolidacion = \`Organización del portafolio semanal y firma de compromisos para el test de mañana viernes.\`;
    } else if (matLower.includes('ciencia') || matLower.includes('medio')) {
      docDirecta = \`Fase de Consolidación Semanal (Pág. \${paginaDia} · \${tema}): Repaso de conceptos clave de "\${tema}", esquemas anatómicos/ecológicos y preguntas diagnósticas.\`;
      estDirecta = \`Socialización oral de los aprendizajes más significativos y autoevaluación guiada.\`;
      docAutonomo = \`Inspección de actividades terminadas en el libro MINEDUC y cuaderno de trabajo.\`;
      estAutonomo = \`Trabajo Autónomo (Pág. \${paginaDia}): Resolución de la autoevaluación de la unidad en el libro oficial MINEDUC sin consultar notas.\`;
      actIndagacion = \`Plenaria de síntesis escolar: Exposición de los murales científicos elaborados en la semana.\`;
      actConsolidacion = \`Auto-verificación de la lista de cotejo científica y preparación final para la prueba de viernes.\`;
    } else if (matLower.includes('social') || matLower.includes('ciudad')) {
      docDirecta = \`Fase de Síntesis Ciudadana (Pág. \${paginaDia} · \${tema}): Balance semanal de saberes cívicos y geográficos, integración de aprendizajes y repaso formativo.\`;
      estDirecta = \`Participación en la ronda de preguntas rápidas y comprobación de conocimientos en pizarra.\`;
      docAutonomo = \`Acompañamiento a los alumnos en la revisión de sus cuadernos y lecciones del libro.\`;
      estAutonomo = \`Trabajo Autónomo (Pág. \${paginaDia}): Resolución de los ejercicios de consolidación y evaluación formativa del libro oficial MINEDUC.\`;
      actIndagacion = \`Asamblea de aula con el Gobierno Escolar para evaluar el orden y la convivencia semanal.\`;
      actConsolidacion = \`Firma de la lista de cotejo ciudadana y repaso de conceptos para la prueba de viernes.\`;
    } else {
      // Matemáticas Jueves
      docDirecta = \`Fase de Consolidación y Síntesis (Pág. \${paginaDia} · \${tema}): Repaso estructurado de los algoritmos de "\${tema}", resolución de ejercicios tipo examen y aclaración de dudas finales.\`;
      estDirecta = \`Resolución de 3 problemas muestra en pizarra con explicación paso a paso de cada estudiante.\`;
      docAutonomo = \`Verificación de cuadernos al día, atención a dudas individuales y refuerzo a alumnos rezagados.\`;
      estAutonomo = \`Trabajo Autónomo de Simulación (Pág. \${paginaDia} · \${tema}): Resolución individual en silencio de la sección "Pongo a prueba mis conocimientos" del libro oficial MINEDUC (\${ejTexto || 'ejercicios de evaluación'}).\`;
      actIndagacion = \`Dinámica de retos matemáticos en equipos para afianzar agilidad de cálculo mental.\`;
      actConsolidacion = \`Revisión final de la lista de cotejo matemática y preparación formal para el test escrito de viernes.\`;
    }
  }

  // Rotación del Período 1 (08:15 - 09:05) y Período 2 (09:05 - 09:55)
  let tieneDirectaP1 = false;
  let tieneDirectaP2 = false;
  let tieneDirectaP3 = false;

  if (grados.length === 1) {
    tieneDirectaP1 = true;
  } else if (dia === 'Lunes') {
    tieneDirectaP1 = (gIndex === 0);
    tieneDirectaP2 = (gIndex === 1);
    tieneDirectaP3 = (gIndex >= 2);
  } else if (dia === 'Martes') {
    tieneDirectaP1 = (gIndex === 1);
    tieneDirectaP2 = (gIndex === 0);
    tieneDirectaP3 = (gIndex >= 2);
  } else if (dia === 'Miércoles') {
    tieneDirectaP1 = (gIndex === (grados.length > 2 ? 2 : 0));
    tieneDirectaP2 = (gIndex === 1);
    tieneDirectaP3 = (gIndex === 0);
  } else {
    tieneDirectaP1 = (gIndex === 0);
    tieneDirectaP2 = (gIndex === 1);
    tieneDirectaP3 = (gIndex >= 2);
  }

  const modalidad: 'Atención Directa Docente' | 'Trabajo Autónomo con Guía' | 'Trabajo Cooperativo / Práctica' =
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

  const p4Text = \`11:15 - 11:50 | Práctica Autónoma y Consolidación (\${gradoPrincipal}.° Grado): \${actConsolidacion}\`;

  const tiempos: TimeAllocation[] = [
    {
      rango: '08:15 - 09:05',
      rolDocente: tieneDirectaP1 ? 'atencion_directa' : 'trabajo_autonomo',
      descripcion: tieneDirectaP1 ? \`Período 1 (Atención Directa): \${docDirecta}\` : \`Período 1 (Trabajo Autónomo): \${estAutonomo}\`
    },
    {
      rango: '09:05 - 09:55',
      rolDocente: tieneDirectaP2 ? 'atencion_directa' : 'trabajo_autonomo',
      descripcion: tieneDirectaP2 ? \`Período 2 (Atención Directa): \${docDirecta}\` : \`Período 2 (Trabajo Autónomo): \${estAutonomo}\`
    },
    {
      rango: '10:30 - 11:15',
      rolDocente: tieneDirectaP3 ? 'atencion_directa' : 'trabajo_autonomo',
      descripcion: \`Período 3 (Bloque Integrado): \${actIndagacion}\`
    },
    {
      rango: '11:15 - 11:50',
      rolDocente: 'trabajo_autonomo',
      descripcion: \`Período 4 (Consolidación): \${actConsolidacion}\`
    }
  ];

  return {
    modalidad,
    actividadDocente: tieneDirectaP1 ? docDirecta : docAutonomo,
    actividadEstudiante: tieneDirectaP1 ? estDirecta : estAutonomo,
    periodo1_actividad: p1Text,
    periodo2_actividad: p2Text,
    periodo3_actividad: p3Text,
    periodo4_actividad: p4Text,
    tiempos
  };
}`;

const oldRotRegex = /function buildRotationalTimeline\([\s\S]*?tiempos\s*\n\s*\};\s*\n\}/;
code = code.replace(oldRotRegex, newBuildRotationalTimeline);
console.log('Replaced buildRotationalTimeline');

// 4. Update the daily loop in generateUnifiedRAGPlan
const oldLoopTarget = `        const mainItem = itemsG[0];
        const rotacion = buildRotationalTimeline(dia, grados, g, mainItem.materia, mainItem.tema);
        const todosEjercicios = matSeleccionadasDetalle.flatMap(m => m.ejerciciosLiterales);

        let tarea = '';
        if (dia === 'Lunes') {
          tarea = \`Pág. \${mainItem.paginaInicio} (\${g}.° Grado): Resolver las actividades complementarias de "\${mainItem.tema}" en familia.\`;
        } else if (dia === 'Martes') {
          tarea = \`Pág. \${mainItem.paginaInicio + 1} (\${g}.° Grado): Lectura y fijación de conceptos en el cuaderno de trabajo.\`;
        } else if (dia === 'Miércoles') {
          tarea = \`Cuaderno (\${g}.° Grado): Socializar con la familia las aplicaciones prácticas de \${mainItem.materia}.\`;
        } else {
          tarea = \`Preparación para el Test de Viernes (\${g}.° Grado): Repasar las páginas \${mainItem.paginaInicio}-\${mainItem.paginaFin} vistas durante la semana.\`;
        }

        gradosSincronizados.push({
          grado: \`\${g}.° Primaria\`,
          gradoNumero: g,
          bloque: \`Jornada Diaria (08:00 - 12:00 hrs | 210 min efectivos)\`,
          duracionTotal: '210 min',
          materia: itemsG.map(i => i.materia).join(' + '),
          tema: itemsG.map(i => i.tema).join(' / '),
          modalidad: rotacion.modalidad,
          actividadDocente: rotacion.actividadDocente,
          actividadEstudiante: rotacion.actividadEstudiante,
          periodo1_actividad: rotacion.periodo1_actividad,
          periodo2_actividad: rotacion.periodo2_actividad,
          periodo3_actividad: rotacion.periodo3_actividad,
          periodo4_actividad: rotacion.periodo4_actividad,
          cnbCompetencia: mainItem.competencias?.[0] || 'Competencia oficial CNB',
          cnbIndicador: mainItem.indicadores?.[0] || 'Indicador oficial CNB',
          libroTitulo: mainItem.libroTitulo,
          numeroPagina: mainItem.paginaInicio,
          paginaFin: mainItem.paginaFin,
          seccionLibro: mainItem.unidadTitulo ? \`Unidad \${mainItem.unidad}: \${mainItem.unidadTitulo}\` : \`Unidad \${mainItem.unidad}\`,
          tiemposReferencia: rotacion.tiempos,
          ejerciciosLiterales: todosEjercicios,
          tareaCasa: tarea,
          completado: dia === 'Lunes',
          esTemaRezagado: false,
          materiasSeleccionadas: matSeleccionadasDetalle
        });`;

const newLoopReplacement = `        const mainItem = itemsG[0];
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
        );
        const todosEjercicios = ejerciciosDia.length > 0 ? ejerciciosDia : matSeleccionadasDetalle.flatMap(m => m.ejerciciosLiterales);

        let tarea = '';
        if (dia === 'Lunes') {
          tarea = \`Pág. \${subtemaDia.pagina} (\${g}.° Grado): Resolver los ejercicios de aplicación de "\${subtemaDia.titulo}" en el cuaderno y practicar en familia.\`;
        } else if (dia === 'Martes') {
          tarea = \`Pág. \${subtemaDia.pagina} (\${g}.° Grado): Ejercitación guiada en el cuaderno y fijación de conceptos vistos hoy en clase.\`;
        } else if (dia === 'Miércoles') {
          tarea = \`Pág. \${subtemaDia.pagina} (\${g}.° Grado): Aplicar lo aprendido en situaciones cotidianas del hogar o la comunidad.\`;
        } else {
          tarea = \`Preparación para el Test de Viernes (\${g}.° Grado): Repasar los temas y ejercicios vistos durante la semana (Págs. \${mainItem.paginaInicio}-\${mainItem.paginaFin}) con apoyo de la lista de cotejo.\`;
        }

        gradosSincronizados.push({
          grado: \`\${g}.° Primaria\`,
          gradoNumero: g,
          bloque: \`Jornada Diaria (08:00 - 12:00 hrs | 210 min efectivos)\`,
          duracionTotal: '210 min',
          materia: itemsG.map(i => i.materia).join(' + '),
          tema: subtemaDia.titulo,
          modalidad: rotacion.modalidad,
          actividadDocente: rotacion.actividadDocente,
          actividadEstudiante: rotacion.actividadEstudiante,
          periodo1_actividad: rotacion.periodo1_actividad,
          periodo2_actividad: rotacion.periodo2_actividad,
          periodo3_actividad: rotacion.periodo3_actividad,
          periodo4_actividad: rotacion.periodo4_actividad,
          cnbCompetencia: mainItem.competencias?.[0] || 'Competencia oficial CNB',
          cnbIndicador: mainItem.indicadores?.[0] || 'Indicador oficial CNB',
          libroTitulo: mainItem.libroTitulo,
          numeroPagina: subtemaDia.pagina,
          paginaFin: subtemaDia.pagina,
          seccionLibro: mainItem.unidadTitulo ? \`Unidad \${mainItem.unidad}: \${mainItem.unidadTitulo}\` : \`Unidad \${mainItem.unidad}\`,
          tiemposReferencia: rotacion.tiempos,
          ejerciciosLiterales: todosEjercicios,
          tareaCasa: tarea,
          completado: dia === 'Lunes',
          esTemaRezagado: false,
          materiasSeleccionadas: matSeleccionadasDetalle
        });`;

if (code.includes(oldLoopTarget)) {
  code = code.replace(oldLoopTarget, newLoopReplacement);
  console.log('Replaced daily loop target');
} else {
  console.log('Could not find exact oldLoopTarget, attempting flexible replace');
  const loopRegex = /const mainItem = itemsG\[0\];[\s\S]*?materiasSeleccionadas: matSeleccionadasDetalle\s*\n\s*\}\);/;
  code = code.replace(loopRegex, newLoopReplacement);
  console.log('Replaced daily loop via regex');
}

fs.writeFileSync('src/utils/ragEngine.ts', code, 'utf8');
console.log('Successfully saved src/utils/ragEngine.ts!');
