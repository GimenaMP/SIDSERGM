const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/app/api/planificacion/route.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Ensure getSubtemaForDay is imported from '@/utils/ragEngine'
if (!content.includes('getSubtemaForDay')) {
  content = content.replace(
    "import { generateUnifiedRAGPlan, searchCNBCorresponding, searchMineducExercises, RAGRequestParams } from '@/utils/ragEngine';",
    "import { generateUnifiedRAGPlan, searchCNBCorresponding, searchMineducExercises, RAGRequestParams, getSubtemaForDay } from '@/utils/ragEngine';"
  );
}

// 2. Add calculateTextSimilarity function if not present
if (!content.includes('function calculateTextSimilarity')) {
  const similarityFunc = `
function calculateTextSimilarity(query: string, targetText: string): number {
  if (!query || !targetText) return 0;
  const qTokens = query.toLowerCase().split(/\\W+/).filter(w => w.length > 2);
  const tTokens = new Set(targetText.toLowerCase().split(/\\W+/).filter(w => w.length > 2));
  if (qTokens.length === 0 || tTokens.size === 0) return 0;
  let matches = 0;
  for (const token of qTokens) {
    if (tTokens.has(token)) matches++;
  }
  return matches / Math.sqrt(qTokens.length * tTokens.size);
}
`;
  content = content.replace('// Inicializar cliente Supabase opcional', similarityFunc + '\n// Inicializar cliente Supabase opcional');
}

// 3. Update SYSTEM_PROMPT with the rigid 4-moment didactic progression and zero-repetition rule
const oldSystemPromptMatch = /const SYSTEM_PROMPT = `[\s\S]*?`;/;
const newSystemPrompt = `const SYSTEM_PROMPT = \`
Eres el metodólogo experto en el Currículum Nacional Base (CNB) de Guatemala y educación multigrado oficial del Ministerio de Educación (DIGECUR / MINEDUC).
Tu misión es diseñar la planificación semanal completa (Lunes a Jueves con Evaluación de Viernes) para aulas multigrado, estructurando la jornada bajo un TEMA EJE TRANSVERSAL y aplicando la PONDERACIÓN HORARIA OFICIAL 60/40 EN DOS BLOQUES MIXTOS DIARIOS.

REGLAS METODOLÓGICAS OBLIGATORIAS DEL CNB Y GUÍAS MINEDUC:
1. PONDERACIÓN HORARIA CURRICULAR 60/40 Y BLOQUES MIXTOS DIARIOS (CERO TRATAMIENTO PLANO):
   No todas las materias tienen el mismo peso. La jornada diaria de 08:00 a 12:00 h se divide obligatoriamente en DOS bloques fundamentales:
   - 08:00 – 08:15 h (15 min): Diálogo de Saberes Comunitario (Inicio Común con todos los grados articulados al Tema Eje Transversal).
   - 08:15 – 09:55 h (100 min · Bloque Fundamental - 60% Carga Horaria):
     * Dedicado a Matemáticas (5 horas semanales) y Comunicación y Lenguaje L1 (4 horas semanales).
     * Se aplica Atención Alternada Rotativa: en el Período 1 (08:15-09:05) el maestro brinda Atención Directa al Grado A modelando la lección en la pizarra mientras el Grado B realiza Trabajo Autónomo en su libro; en el Período 2 (09:05-09:55) se invierten estrictamente los roles.
   - 09:55 – 10:00 h (5 min): Transición y orden.
   - 10:00 – 10:30 h (30 min): 🔔 RECESO ESCOLAR LIBRE (Estrictamente libre de clases).
   - 10:30 – 11:50 h (80 min · Bloque Formativo / Aplicado - 40% Carga Horaria):
     * Dedicado a Medio Social y Natural (Ciclo I: 1.°-3.°) o Ciencias Naturales y Tecnología / Ciencias Sociales (Ciclo II: 4.°-6.°), articuladas interdisciplinariamente bajo el Tema Generador Común.
     * Período 3 (10:30-11:15): Indagación y observación del entorno comunitario.
     * Período 4 (11:15-11:50): Rincones de Aprendizaje, tutoría entre pares y cuaderno de trabajo.
   - 11:50 – 12:00 h (10 min): Cierre Común y Gobierno Escolar.

2. SECUENCIACIÓN PROGRESIVA RÍGIDA EN 4 MOMENTOS DIDÁCTICOS (1 PÁGINA = 1 DÍA):
   En las Guías Metodológicas y libros de texto oficiales del MINEDUC, CADA PÁGINA FÍSICA ESTÁ DISEÑADA COMO 1 SESIÓN DE APRENDIZAJE DE UN ÚNICO TEMA.
   Está estrictamente prohibido usar la misma narrativa o plantilla en días diferentes:
   - LUNES (Fase 1: Saberes Previos y Exploración): Activación de conocimientos previos con preguntas generadoras del entorno comunitario. Presentación y modelado inicial en pizarra para el Grado Base mientras los otros grados realizan lectura guiada en su libro MINEDUC.
   - MARTES (Fase 2: Comprensión, Algoritmo y Modelado): Explicación formal del algoritmo o procedimiento matemático/lingüístico en la pizarra con Atención Directa al Grado Secundario. Identificación y aclaración de errores frecuentes. Ejercitación guiada en cuaderno.
   - MIÉRCOLES (Fase 3: Práctica Autónoma Intensiva y Aplicación Contextual): Los alumnos resuelven de manera 100% individual y autónoma los ejercicios literales del libro MINEDUC en su cuaderno. Aplicación a situaciones cotidianas comunitarias (mercado local, compras, siembra). Tutoría entre pares.
   - JUEVES (Fase 4: Consolidación, Verificación Cruzada y Síntesis): Verificación y revisión cruzada de respuestas en parejas intergrado. Resolución de los retos de la sección 'Pongo a prueba mis conocimientos' o 'Repaso'. Síntesis comunitaria en papelógrafo o rincón de aprendizaje.
   - VIERNES: Evaluación Formativa Corta (Test individual escrito con 3 problemas desarrollados por grado y lista de cotejo con 3 criterios observables de desempeño).

3. REGLA DE TOLERANCIA CERO A LA REPETICIÓN O CLONACIÓN DE PLANTILLAS:
   - ESTÁ TERMINANTEMENTE PROHIBIDO copiar la misma redacción, consignas o plantilla entre Lunes, Martes, Miércoles y Jueves.
   - Cada día DEBE usar vocabulario didáctico exclusivo correspondiente a su fase.
   - Si los textos de las actividades entre días superan el 55% de similitud, la respuesta es nula y violatoria de la norma pedagógica MINEDUC.

4. DETALLE FÁCTICO COMPLETO EN CADA DÍA:
   Para cada grado y día debes especificar:
   - Nombre literal del tema y subtema del libro MINEDUC.
   - Número de página física real del libro (ej. Pág. 9).
   - Ejercicios e incisos literales específicos de esa página física.
   - Guía explícita para el docente: qué dice, modela y dibuja en la pizarra, y qué resuelven los alumnos en sus cuadernos.

GUARDRAILS DE SEGURIDAD:
- Usa EXCLUSIVAMENTE los libros, páginas y temas del contexto RAG provisto.
- Devuelve la respuesta ÚNICAMENTE como un objeto JSON válido.
\`;`;

content = content.replace(oldSystemPromptMatch, newSystemPrompt);

// 4. Before invoking Gemini, construct ragDesglosadoPorDia
const targetRagMarker = '// 3. Construir el contexto de selección textual para el prompt';
const ragDesglosadoCode = `
    // 2.1 Construir desglose RAG por sesión y día (1 Página = 1 Día de clase)
    const diasSemanaConst = ['Lunes', 'Martes', 'Miércoles', 'Jueves'] as const;
    const fasesDidacticasPorDia: Record<string, string> = {
      'Lunes': 'Fase 1: Saberes previos, exploración del Tema Eje y modelado inicial en pizarra.',
      'Martes': 'Fase 2: Comprensión, explicación formal del algoritmo matemático/lingüístico y ejercitación guiada.',
      'Miércoles': 'Fase 3: Práctica autónoma intensiva con ejercicios del libro MINEDUC y aplicación comunitaria.',
      'Jueves': 'Fase 4: Consolidación, verificación cruzada en parejas, sección \"Pongo a prueba mis conocimientos\" y síntesis.'
    };

    const ragDesglosadoPorDia: Record<string, any> = {};

    for (const d of diasSemanaConst) {
      ragDesglosadoPorDia[d] = {
        dia: d,
        faseDidactica: fasesDidacticasPorDia[d],
        grados: items.map(item => {
          const sub = getSubtemaForDay(d, item as any);
          const pagBuscada = sub.pagina;
          const ejerciciosMineduc = mineducDatabase.filter(m =>
            m.grado_especifico === item.grado &&
            m.numero_pagina === pagBuscada
          );

          let ejerciciosTextos: string[] = [];
          let instruccionDocente = '';
          if (ejerciciosMineduc.length > 0) {
            ejerciciosTextos = ejerciciosMineduc.map(e => e.enunciado_ejercicio ? String(e.enunciado_ejercicio).slice(0, 300) : '').filter(Boolean);
            instruccionDocente = ejerciciosMineduc[0].instrucciones_docente || '';
          } else {
            const closest = mineducDatabase
              .filter(m => m.grado_especifico === item.grado)
              .sort((a, b) => Math.abs(a.numero_pagina - pagBuscada) - Math.abs(b.numero_pagina - pagBuscada))[0];
            if (closest) {
              if (closest.enunciado_ejercicio) ejerciciosTextos.push(String(closest.enunciado_ejercicio).slice(0, 300));
              instruccionDocente = closest.instrucciones_docente || '';
            }
          }

          return {
            grado: item.grado,
            materia: item.materia,
            subtemaExclusivoDelDia: sub.titulo,
            paginaFisicaExclusivaDelDia: pagBuscada,
            ejerciciosRealesDelLibro: ejerciciosTextos.slice(0, 3),
            instruccionGuiaDocente: instruccionDocente.slice(0, 300)
          };
        })
      };
    }

    // 3. Construir el contexto de selección textual para el prompt`;

content = content.replace(targetRagMarker, ragDesglosadoCode);

// 5. In the Gemini Prompt, inject the ragDesglosadoPorDia
content = content.replace(
  '--- LIBROS Y EJERCICIOS OFICIALES MINEDUC (por página exacta seleccionada) ---\n${JSON.stringify(allMineducContexto, null, 2)}',
  '--- CONTEXTO DIDÁCTICO RAG DESGLOSADO DÍA POR DÍA (1 PÁGINA = 1 DÍA) ---\n${JSON.stringify(ragDesglosadoPorDia, null, 2)}\n\n--- REGISTRO GENERAL MINEDUC ---\n${JSON.stringify(allMineducContexto.slice(0, 10), null, 2)}'
);

// 6. Update Sanitizer with calculateTextSimilarity antiduplicate check (> 0.55 similarity discard)
const oldSanitizerBlock = `            const mergedDias: any = {};
            const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves'] as const;
            const seenActivities = new Set<string>();

            const sanitizeActivity = (text: any, fallback: string): string => {
              if (typeof text !== 'string') return fallback;
              const clean = text.trim();
              if (clean.length < 20) return fallback;
              const key = clean.toLowerCase().replace(/\\s+/g, ' ');
              if (seenActivities.has(key)) return fallback;
              seenActivities.add(key);
              return clean;
            };`;

const newSanitizerBlock = `            const mergedDias: any = {};
            const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves'] as const;
            
            // Historial de textos aceptados por grado para evitar similitud mayor al 55%
            const acceptedActivitiesByGrade: Record<number, string[]> = {};
            gradosNums.forEach(g => { acceptedActivitiesByGrade[g] = []; });

            const sanitizeActivity = (text: any, fallback: string, gradoNum: number): string => {
              if (typeof text !== 'string') return fallback;
              const clean = text.trim();
              if (clean.length < 25) return fallback;

              const history = acceptedActivitiesByGrade[gradoNum] || [];
              for (const pastText of history) {
                const sim = calculateTextSimilarity(clean, pastText);
                if (sim > 0.55) {
                  // Duplicado o plantilla detectada por similitud de tokens > 55%
                  return fallback;
                }
              }

              history.push(clean);
              return clean;
            };`;

content = content.replace(oldSanitizerBlock, newSanitizerBlock);

// 7. Update calls to sanitizeActivity inside gradosSincronizados.map
content = content.replace(
  'periodo1_actividad: sanitizeActivity(aiItem.periodo1_actividad, baseItem.periodo1_actividad),',
  'periodo1_actividad: sanitizeActivity(aiItem.periodo1_actividad, baseItem.periodo1_actividad, baseItem.gradoNumero),'
);
content = content.replace(
  'periodo2_actividad: sanitizeActivity(aiItem.periodo2_actividad, baseItem.periodo2_actividad),',
  'periodo2_actividad: sanitizeActivity(aiItem.periodo2_actividad, baseItem.periodo2_actividad, baseItem.gradoNumero),'
);
content = content.replace(
  'periodo3_actividad: sanitizeActivity(aiItem.periodo3_actividad, baseItem.periodo3_actividad),',
  'periodo3_actividad: sanitizeActivity(aiItem.periodo3_actividad, baseItem.periodo3_actividad, baseItem.gradoNumero),'
);
content = content.replace(
  'periodo4_actividad: sanitizeActivity(aiItem.periodo4_actividad, baseItem.periodo4_actividad),',
  'periodo4_actividad: sanitizeActivity(aiItem.periodo4_actividad, baseItem.periodo4_actividad, baseItem.gradoNumero),'
);
content = content.replace(
  'actividadDocente: sanitizeActivity(aiItem.actividadDocente, baseItem.actividadDocente),',
  'actividadDocente: sanitizeActivity(aiItem.actividadDocente, baseItem.actividadDocente, baseItem.gradoNumero),'
);
content = content.replace(
  'actividadEstudiante: sanitizeActivity(aiItem.actividadEstudiante, baseItem.actividadEstudiante),',
  'actividadEstudiante: sanitizeActivity(aiItem.actividadEstudiante, baseItem.actividadEstudiante, baseItem.gradoNumero),'
);
content = content.replace(
  'tareaCasa: sanitizeActivity(aiItem.tareaCasa, baseItem.tareaCasa),',
  'tareaCasa: sanitizeActivity(aiItem.tareaCasa, baseItem.tareaCasa, baseItem.gradoNumero),'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✓ Successfully patched route.ts with daily RAG breakdown, rigid prompt progression and antiduplicate sanitizer!');
