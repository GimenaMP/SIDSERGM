const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/utils/ragEngine.ts');
let content = fs.readFileSync(filePath, 'utf8');

const markerStart = '// Alternancia rotativa estructurada (Jornada 08:00 a 12:00 - 210 min efectivos)';
const markerEnd = '// Generador de la Guía Pedagógica Unificada con Eje Integrador';

const startIndex = content.indexOf(markerStart);
const endIndex = content.indexOf(markerEnd);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found!');
  process.exit(1);
}

const newTimelineFunction = `// Alternancia rotativa estructurada (Jornada 08:00 a 12:00 - 210 min efectivos)
function buildRotationalTimeline(
  dia: DiaSemana, 
  grados: number[], 
  gradoPrincipal: number,
  materia: string = 'Matemáticas',
  tema: string = 'Contenido CNB'
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

  // 1. Textos diferenciados por día de la semana (Lunes a Jueves) para garantizar progresión didáctica
  let docDirecta = '';
  let estDirecta = '';
  let docAutonomo = '';
  let estAutonomo = '';
  let actIndagacion = '';
  let actConsolidacion = '';

  if (dia === 'Lunes') {
    // FASE 1: APERTURA Y MODELADO CONCEPTUAL INICIAL
    if (matLower.includes('lengua') || matLower.includes('comunic')) {
      docDirecta = \`Fase de Apertura: Presentación en pizarra del vocabulario clave y modelado de lectura comprensiva sobre "\${tema}".\`;
      estDirecta = \`Lectura guiada en voz alta, activación de conocimientos previos y subrayado de ideas centrales en el libro oficial.\`;
      docAutonomo = \`Acompañamiento rotativo a dudas de lectura y verificación del trazo ortográfico inicial.\`;
      estAutonomo = \`Lectura silenciosa de la lección oficial MINEDUC y resolución de las primeras 2 preguntas exploratorias en el cuaderno.\`;
      actIndagacion = \`Diálogo e indagación grupal: Identificar anécdotas o relatos tradicionales de la comunidad relacionados con el tema.\`;
      actConsolidacion = \`Registro del glosario de términos nuevos en el cuaderno con ilustraciones del entorno.\`;
    } else if (matLower.includes('ciencia') || matLower.includes('medio')) {
      docDirecta = \`Fase de Exploración: Explicación de los principios científicos y formulación de preguntas generadoras sobre "\${tema}".\`;
      estDirecta = \`Observación guiada de elementos de la comunidad, toma de notas e hipótesis en el cuaderno.\`;
      docAutonomo = \`Supervisión de esquemas iniciales y verificación de conceptos científicos básicos.\`;
      estAutonomo = \`Lectura reflexiva de la sección del libro MINEDUC y dibujo del esquema explicativo en el cuaderno.\`;
      actIndagacion = \`Indagación en Rincones de Aprendizaje: Clasificación de materiales u organismos de la aldea vinculados al tema.\`;
      actConsolidacion = \`Construcción del mapa conceptual inicial de la unidad en el cuaderno de trabajo.\`;
    } else if (matLower.includes('social') || matLower.includes('ciudad')) {
      docDirecta = \`Fase de Introducción Cívica: Presentación participativa de hechos históricos, geografía y convivencia comunitaria: "\${tema}".\`;
      estDirecta = \`Participación en la lluvia de ideas y análisis de la situación social comunitaria.\`;
      docAutonomo = \`Monitoreo de la lectura guiada de mapas y normativas ciudadanas.\`;
      estAutonomo = \`Lectura del texto introductorio en el libro MINEDUC y respuesta a las preguntas de ubicación geográfica o cívica.\`;
      actIndagacion = \`Conversatorio grupal sobre los derechos, responsabilidades y costumbres en nuestra comunidad.\`;
      actConsolidacion = \`Redacción de compromisos personales de convivencia pacífica en el cuaderno.\`;
    } else {
      // Matemáticas Lunes
      docDirecta = \`Fase de Modelado: Presentación del algoritmo y modelado paso a paso en pizarra de la situación problema para "\${tema}".\`;
      estDirecta = \`Atención al modelado docente, resolución interactiva de ejemplos en pizarra y copia del algoritmo modelo en cuaderno.\`;
      docAutonomo = \`Supervisión individual del planteamiento matemático y corrección de alineación numérica.\`;
      estAutonomo = \`Resolución de los primeros 3 incisos de cálculo del libro oficial MINEDUC en el cuaderno cuadriculado.\`;
      actIndagacion = \`Uso de material concreto (semillas, tapitas, ábaco) en el Rincón de Matemáticas para comprobar cantidades.\`;
      actConsolidacion = \`Comprobación de respuestas numéricas y cálculo mental de cierre diario.\`;
    }
  } else if (dia === 'Martes') {
    // FASE 2: PROFUNDIZACIÓN Y EJERCITACIÓN GUIADA
    if (matLower.includes('lengua') || matLower.includes('comunic')) {
      docDirecta = \`Fase de Profundización: Análisis de concordancia gramatical, estructura sintáctica y redacción dirigida sobre "\${tema}".\`;
      estDirecta = \`Identificación de conectores, adjetivos y redacción guiada de oraciones complejas en pizarra.\`;
      docAutonomo = \`Orientación en redacción individual y corrección de signos de puntuación.\`;
      estAutonomo = \`Producción de un párrafo descriptivo en el cuaderno y resolución de los incisos de aplicación del libro MINEDUC.\`;
      actIndagacion = \`Taller de escritura creativa en parejas: Redactar un cartel con mensajes sobre la convivencia escolar.\`;
      actConsolidacion = \`Intercambio de cuadernos para coevaluación ortográfica con lápiz de color.\`;
    } else if (matLower.includes('ciencia') || matLower.includes('medio')) {
      docDirecta = \`Fase de Profundización Experimental: Análisis de relaciones causa-efecto, ciclos y procesos naturales en "\${tema}".\`;
      estDirecta = \`Elaboración de tablas comparativas y análisis de los experimentos o datos presentados en el libro.\`;
      docAutonomo = \`Guía en el registro metódico de observaciones científicas en los cuadernos.\`;
      estAutonomo = \`Resolución de las actividades de experimentación y cuestionarios analíticos del libro oficial MINEDUC.\`;
      actIndagacion = \`Experimentación guiada con muestras botánicas o recursos del entorno en el Rincón de Ciencias.\`;
      actConsolidacion = \`Redacción de conclusiones científicas fundamentadas en el cuaderno.\`;
    } else if (matLower.includes('social') || matLower.includes('ciudad')) {
      docDirecta = \`Fase de Análisis Social: Interpretación crítica de hechos del pasado y su impacto en la organización comunitaria actual.\`;
      estDirecta = \`Análisis de líneas de tiempo, mapas temáticos y debate moderado por el maestro.\`;
      docAutonomo = \`Acompañamiento en el análisis de fuentes históricas y cuadros de datos del libro.\`;
      estAutonomo = \`Resolución de las actividades analíticas del libro MINEDUC y cuadro comparativo de causas y consecuencias.\`;
      actIndagacion = \`Dramatización o juego de roles sobre la mediación de conflictos en el Gobierno Escolar.\`;
      actConsolidacion = \`Registro de propuestas para el fortalecimiento comunitario en el cuaderno.\`;
    } else {
      // Matemáticas Martes
      docDirecta = \`Fase de Ejercitación Dirigida: Resolución de problemas de mayor complejidad, despeje de dudas y análisis de casos especiales en "\${tema}".\`;
      estDirecta = \`Planteamiento guiado de operaciones combinadas o fracciones complejas y comprobación en la pizarra.\`;
      docAutonomo = \`Verificación de procedimientos paso a paso y atención diferenciada a estudiantes rezagados.\`;
      estAutonomo = \`Resolución autónoma de los incisos avanzados y problemas de aplicación del libro oficial MINEDUC.\`;
      actIndagacion = \`Resolución en parejas de desafíos matemáticos con apoyo de tarjetas didácticas.\`;
      actConsolidacion = \`Corrección colaborativa de ejercicios y verificación del orden en cuaderno.\`;
    }
  } else if (dia === 'Miércoles') {
    // FASE 3: INDAGACIÓN, APLICACIÓN CONTEXTUAL Y TUTORÍA ENTRE PARES
    if (matLower.includes('lengua') || matLower.includes('comunic')) {
      docDirecta = \`Fase de Aplicación Comunitaria: Vinculación de la lectura y expresión oral con los relatos, leyendas y oficios de la aldea.\`;
      estDirecta = \`Lectura dramatizada o exposición oral corta aplicando entonación, fluidez y volumen adecuado.\`;
      docAutonomo = \`Monitoreo de tutoría entre pares: estudiantes mayores escuchan y apoyan la lectura de los menores.\`;
      estAutonomo = \`Redacción de un texto testimonial o resumen estructurado aplicando las reglas de la unidad en el cuaderno.\`;
      actIndagacion = \`Círculo de lectura comunitaria: Los estudiantes comparten anécdotas locales y saberes ancestrales.\`;
      actConsolidacion = \`Elaboración de una ficha de síntesis para el mural pedagógico del aula.\`;
    } else if (matLower.includes('ciencia') || matLower.includes('medio')) {
      docDirecta = \`Fase de Aplicación Ecológica: Conexión de "\${tema}" con el cuidado del medio ambiente, la salud preventiva y los recursos locales.\`;
      estDirecta = \`Propuesta de acciones concretas de conservación comunitaria y exposición de conclusiones.\`;
      docAutonomo = \`Orientación a grupos mixtos en el diseño de proyectos escolares de higiene o medio ambiente.\`;
      estAutonomo = \`Resolución de los ejercicios de aplicación comunitaria del libro MINEDUC y diseño de un afiche ecológico.\`;
      actIndagacion = \`Recorrido por el huerto o patio escolar para registrar evidencias vivas del tema estudiado.\`;
      actConsolidacion = \`Síntesis grupal y registro en el cuaderno de compromisos con la madre naturaleza.\`;
    } else if (matLower.includes('social') || matLower.includes('ciudad')) {
      docDirecta = \`Fase de Integración Ciudadana: Estudio de casos de liderazgo comunitario, autoridades locales y participación de la niñez.\`;
      estDirecta = \`Propuesta de mejoras cívicas para la escuela multigrado en diálogo con el maestro.\`;
      docAutonomo = \`Supervisión de dinámicas cooperativas y registro de acuerdos en actas simuladas.\`;
      estAutonomo = \`Completación de esquemas cívicos del libro MINEDUC y redacción de propuestas de convivencia.\`;
      actIndagacion = \`Sesión de comisiones del Gobierno Escolar para organizar el rincón de paz del aula.\`;
      actConsolidacion = \`Elaboración de un decálogo de convivencia para exhibir en el aula.\`;
    } else {
      // Matemáticas Miércoles
      docDirecta = \`Fase de Aplicación Comunitaria: Formulación de problemas matemáticos contextualizados en el mercado local, cosecha agrícola y compras familiares.\`;
      estDirecta = \`Planteamiento y cálculo de presupuestos reales en Quetzales usando operaciones de "\${tema}".\`;
      docAutonomo = \`Tutoría entre pares: estudiantes de grado superior apoyan en la verificación de cálculos a los menores.\`;
      estAutonomo = \`Resolución individual de los problemas contextuales del libro MINEDUC registrando planteamiento y respuesta.\`;
      actIndagacion = \`Juego de simulación "Mercadito Escolar": compra y venta con billetes didácticos aplicando el tema.\`;
      actConsolidacion = \`Registro del balance comercial y comprobación aritmética en cuaderno.\`;
    }
  } else {
    // FASE 4 (JUEVES): SÍNTESIS, CONSOLIDACIÓN Y PREPARACIÓN PARA EVALUACIÓN
    if (matLower.includes('lengua') || matLower.includes('comunic')) {
      docDirecta = \`Fase de Síntesis Semanal: Revisión integral de indicadores de logro, aclaración final de dudas y simulación de prueba de comprensión.\`;
      estDirecta = \`Resolución de preguntas de autoevaluación, repaso de vocabulario y lectura de verificación.\`;
      docAutonomo = \`Revisión de cuadernos completos y orientación individualizada a estudiantes con rezago.\`;
      estAutonomo = \`Resolución de la sección "Compruebo mis aprendizajes" del libro oficial MINEDUC en silencio.\`;
      actIndagacion = \`Revisión colectiva de la lista de cotejo para verificar criterios alcanzados durante la semana.\`;
      actConsolidacion = \`Organización del portafolio semanal y firma de compromisos para el test de mañana viernes.\`;
    } else if (matLower.includes('ciencia') || matLower.includes('medio')) {
      docDirecta = \`Fase de Consolidación Semanal: Repaso de conceptos clave de "\${tema}", esquemas anatómicos/ecológicos y preguntas diagnósticas.\`;
      estDirecta = \`Socialización oral de los aprendizajes más significativos y autoevaluación guiada.\`;
      docAutonomo = \`Inspección de actividades terminadas en el libro MINEDUC y cuaderno de trabajo.\`;
      estAutonomo = \`Resolución de la autoevaluación de la unidad en el libro oficial MINEDUC sin consultar notas.\`;
      actIndagacion = \`Plenaria de síntesis escolar: Exposición de los murales científicos elaborados en la semana.\`;
      actConsolidacion = \`Auto-verificación de la lista de cotejo científica y preparación final para la prueba de viernes.\`;
    } else if (matLower.includes('social') || matLower.includes('ciudad')) {
      docDirecta = \`Fase de Síntesis Ciudadana: Balance semanal de saberes cívicos y geográficos, integración de aprendizajes y repaso formativo.\`;
      estDirecta = \`Participación en la ronda de preguntas rápidas y comprobación de conocimientos en pizarra.\`;
      docAutonomo = \`Acompañamiento a los alumnos en la revisión de sus cuadernos y lecciones del libro.\`;
      estAutonomo = \`Resolución de los ejercicios de consolidación y evaluación formativa del libro oficial MINEDUC.\`;
      actIndagacion = \`Asamblea de aula con el Gobierno Escolar para evaluar el orden y la convivencia semanal.\`;
      actConsolidacion = \`Firma de la lista de cotejo ciudadana y repaso de conceptos para la prueba de viernes.\`;
    } else {
      // Matemáticas Jueves
      docDirecta = \`Fase de Consolidación y Síntesis: Repaso estructurado de los algoritmos de "\${tema}", resolución de ejercicios tipo examen y aclaración de dudas.\`;
      estDirecta = \`Resolución de 3 problemas muestra en pizarra con explicación paso a paso de cada estudiante.\`;
      docAutonomo = \`Verificación de cuadernos al día, atención a dudas individuales y refuerzo a alumnos rezagados.\`;
      estAutonomo = \`Resolución de la sección "Pongo a prueba mis conocimientos" del libro oficial MINEDUC como simulación de prueba.\`;
      actIndagacion = \`Dinámica de retos matemáticos en equipos para afianzar agilidad de cálculo mental.\`;
      actConsolidacion = \`Revisión final de la lista de cotejo matemática y preparación formal para el test escrito de viernes.\`;
    }
  }

  // Rotación del Período 1 (08:15 - 09:05) y Período 2 (09:05 - 09:55)
  // Lunes: gIndex 0 inicia con Directa; Martes: gIndex 1 inicia con Directa; Miércoles: rotación según cantidad de grados
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
    // Jueves: Síntesis semanal rotativa
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
    ? \`10:30 - 11:15 | Atención Directa de Profundización: Orientación en \${materia}.\`
    : \`10:30 - 11:15 | Bloque Integrado e Indagación: \${actIndagacion}\`;

  const p4Text = \`11:15 - 11:50 | Práctica Autónoma y Consolidación: \${actConsolidacion}\`;

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
}
`;

content = content.slice(0, startIndex) + newTimelineFunction + content.slice(endIndex);
fs.writeFileSync(filePath, content, 'utf8');
console.log('src/utils/ragEngine.ts updated with day-differentiated buildRotationalTimeline!');
