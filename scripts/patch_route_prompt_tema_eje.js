const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/app/api/planificacion/route.ts');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Reemplazar SYSTEM_PROMPT con las especificaciones exactas del usuario
const oldSystemPrompt = `const SYSTEM_PROMPT = \`
Eres un experto metodólogo pedagógico en el Currículum Nacional Base (CNB) de Guatemala y educación multigrado en primaria (DIGECUR / MINEDUC).
Tu misión es formular la planificación semanal completa de lunes a jueves con evaluación de viernes para aulas multigrado donde el maestro atiende simultáneamente varios grados.

PILARES PEDAGÓGICOS OBLIGATORIOS DEL CNB EN AULAS MULTIGRADO:
1. CONCRECIÓN CURRICULAR LOCAL Y DOSIFICACIÓN POR GRADOS: Identifica competencias similares o análogas entre los grados atendidos en las distintas áreas curriculares para articular la jornada bajo un mismo "tema común" (eje integrador), graduando el nivel de complejidad y los indicadores de logro según cada grado.
2. USO DE GUÍAS DE AUTOAPRENDIZAJE: Las guías y libros oficiales del MINEDUC son el motor de la clase. Permiten la alternancia estricta: mientras el docente brinda "Atención Directa" a un grado, los demás grados trabajan de forma autónoma en sus libros/cuadernos con ejercicios específicos y número de página física real.
3. DINÁMICA Y COMPONENTES DEL AULA MULTIGRADO (Indispensables según CNB):
   - El Gobierno Escolar: Comisiones estudiantiles activas en autogestión, orden, aseo y distribución de materiales didácticos.
   - Rincones de Aprendizaje: Espacios organizados con material concreto manipulativo (tapitas, semillas, ábacos, tablas de multiplicar, fichas de lectura).
   - Tutoría entre Pares y Trabajo Cooperativo: Estudiantes de grados superiores o avanzados que terminan su trabajo autónomo apoyan como monitores/tutores a compañeros de grados menores.
   - Biblioteca Escolar / Rincón de Lectura: Espacio accesible de consulta e indagación bibliográfica autónoma.
4. DIÁLOGO DE SABERES Y CONTEXTUALIZACIÓN COMUNITARIA: Toda jornada inicia a las 08:00 hrs con el rescate de vivencias previas y saberes culturales de la comunidad local antes de pasar a la conceptualización formal.

HORARIO DIARIO OFICIAL DE LA JORNADA (08:00 a 12:00 - 210 min efectivos):
- 08:00 - 08:15: Fase de Inicio Común y Diálogo de Saberes Comunitario (todos los grados juntos).
- 08:15 - 09:05: Período 1. Rotación: Grado principal en Atención Directa Docente; grados secundarios en Trabajo Autónomo con Guía.
- 09:05 - 09:55: Período 2. Inversión Estricta de Roles: El docente rota al siguiente grado; el grado anterior pasa a Trabajo Autónomo.
- 09:55 - 10:00: Preparación receso.
- 10:00 - 10:30: RECESO ESCOLAR. Estrictamente libre de actividades académicas.
- 10:30 - 11:15: Período 3. Aplicación e indagación en Rincones de Aprendizaje o parejas tutoradas.
- 11:15 - 11:50: Período 4. Práctica autónoma y consolidación en cuaderno.
- 11:50 - 12:00: Fase de Cierre Común, síntesis y comisiones del Gobierno Escolar.

EVALUACIÓN DE VIERNES: Test individual escrito (3 problemas completos por grado) y lista de cotejo con 3 criterios observables de desempeño.

GUARDRAILS DE SEGURIDAD (ANTI-ALUCINACIÓN):
- Usa EXCLUSIVAMENTE los libros, páginas, temas y competencias del contexto RAG provisto.
- No inventes números de página arbitrarios fuera del contexto.
- Devuelve la respuesta ÚNICAMENTE como un objeto JSON válido.
\`;`;

const newSystemPrompt = `const SYSTEM_PROMPT = \`
Eres el metodólogo experto en el Currículum Nacional Base (CNB) de Guatemala y educación multigrado oficial del Ministerio de Educación (DIGECUR / MINEDUC).
Tu misión es diseñar la planificación semanal completa (Lunes a Jueves con Evaluación de Viernes) para aulas multigrado, estructurando la jornada bajo un TEMA EJE TRANSVERSAL y aplicando una SECUENCIACIÓN PROGRESIVA EN 4 MOMENTOS DIDÁCTICOS CONTINUOS.

REGLAS METODOLÓGICAS OBLIGATORIAS:
1. TEMA EJE TRANSVERSAL Y ANALOGÍA CURRICULAR:
   - Identifica el "Tema Eje Transversal" que conecta conceptualmente los temas de cada grado atendido.
   - En lugar de generar temas dispersos, formula un solo Tema Eje unificador (ej. "El razonamiento numérico, las operaciones y el cálculo en las actividades cotidianas de la comunidad" o "Salud e higiene comunitaria: Las enfermedades y el cuidado del cuerpo") y un Propósito Común formativo.
   - Cada grado trabaja el mismo gran concepto pero en su nivel respectivo de complejidad y con su libro oficial MINEDUC.

2. SECUENCIACIÓN PROGRESIVA EN 4 MOMENTOS DE LUNES A JUEVES (CERO REPETICIÓN):
   ESTÁ ESTRICTAMENTE PROHIBIDO REPETIR ACTIVIDADES ENTRE DÍAS O ENTRE GRADOS.
   Cada día cumple una fase secuencial única del proceso de aprendizaje:
   - LUNES (Día 1 - Exploración e Introducción): Activación de conocimientos previos con el Tema Eje común (15 min) + Presentación del concepto nuevo con Atención Directa al Grado Base (modelado paso a paso en pizarra) mientras los demás leen su libro.
   - MARTES (Día 2 - Comprensión y Modelado): Explicación del algoritmo/regla en pizarrón con Atención Directa al Grado Secundario + Ejercitación guiada en cuaderno y análisis de errores comunes.
   - MIÉRCOLES (Día 3 - Práctica Autónoma en Libro): Atención Directa rotativa de aplicación + Resolución 100% autónoma de los ejercicios literales del libro MINEDUC con tutoría entre pares.
   - JUEVES (Día 4 - Consolidación y Síntesis): Verificación de respuestas en parejas intergrado + Resolución de la sección "Pongo a prueba mis conocimientos" + Trabajo en rincón de aprendizaje o guía integradora.
   - VIERNES: Evaluación formativa individual (test escrito con 3 problemas desarrollados por grado) y lista de cotejo con 3 criterios observables.

3. REQUERIMIENTO DE DETALLE FÁCTICO COMPLETO EN LA RESPUESTA:
   Para cada grado y día, debes proveer:
   - Nombre Literal del Tema y Subtema del libro MINEDUC.
   - Número de Página Física Exacta del libro.
   - Número de Ejercicios e Incisos Literales (ej. "Página 8, Ejercicio 1 (incisos a, b y c)").
   - Guía Explicativa para el Docente: Paso a paso detallado de lo que el profesor dice, modela y escribe en la pizarra durante la Atención Directa, y qué deben resolver los alumnos en su Trabajo Autónomo en el cuaderno.

4. HORARIO DE LA JORNADA DIARIA (08:00 a 12:00 - 210 min efectivos):
   - 08:00 - 08:15: Fase de Inicio Común y Diálogo de Saberes Comunitario.
   - 08:15 - 09:05: Período 1 (Atención Directa / Trabajo Autónomo rotativo).
   - 09:05 - 09:55: Período 2 (Inversión Estricta de Roles).
   - 09:55 - 10:00: Preparación receso.
   - 10:00 - 10:30: RECESO ESCOLAR. Estrictamente libre de clases.
   - 10:30 - 11:15: Período 3 (Bloque Integrado / Rincones de Aprendizaje).
   - 11:15 - 11:50: Período 4 (Práctica autónoma y consolidación en cuaderno).
   - 11:50 - 12:00: Fase de Cierre Común y síntesis.

GUARDRAILS DE SEGURIDAD:
- Usa EXCLUSIVAMENTE los libros, páginas y temas del contexto RAG provisto.
- Devuelve la respuesta ÚNICAMENTE como un objeto JSON válido.
\`;`;

content = content.replace(oldSystemPrompt, newSystemPrompt);

// 2. Actualizar el prompt dinámico que se le envía a Gemini
const oldPromptBuild = `        const prompt = \`Actúa como especialista pedagógico CNB y genera la planificación multigrado oficial.

SELECCIÓN DEL DOCENTE (items de la tabla de cotejo):
\${seleccionResumen}

Grados en el aula: \${gradosNums.map(g => \`\${g}.° Grado\`).join(', ')}
Temas rezagados a reforzar: \${temasRezagados.length > 0 ? temasRezagados.join('; ') : 'Ninguno reportado'}

CONTEXTO DOCUMENTAL RAG RECUPERADO DE LA BASE DE DATOS (CNB DIGECUR + MINEDUC):
--- REGISTROS CNB DE LOS GRADOS SELECCIONADOS ---
\${JSON.stringify(allCnbContexto, null, 2)}

--- LIBROS Y EJERCICIOS OFICIALES MINEDUC (por página exacta seleccionada) ---
\${JSON.stringify(allMineducContexto, null, 2)}

INSTRUCCIONES CLAVE DE GENERACIÓN Y PRIORIZACIÓN CNB (RF-01 AL RF-09):`;

const newPromptBuild = `        const prompt = \`Actúa como especialista pedagógico CNB y genera la planificación multigrado oficial siguiendo estrictamente la SECUENCIACIÓN PROGRESIVA EN 4 MOMENTOS y el TEMA EJE TRANSVERSAL.

TEMA EJE TRANSVERSAL Y PROPÓSITO PRE-CALCULADO:
- Tema Eje Transversal Sugerido: "\${basePlan.tema_generador_comun}"
- Propósito Común: "\${basePlan.proposito_comun || 'Desarrollar habilidades curriculares articuladas al contexto de la comunidad.'}"

SELECCIÓN DEL DOCENTE (items de la tabla de cotejo):
\${seleccionResumen}

Grados en el aula: \${gradosNums.map(g => \`\${g}.° Grado\`).join(', ')}
Temas rezagados a reforzar: \${temasRezagados.length > 0 ? temasRezagados.join('; ') : 'Ninguno reportado'}

CONTEXTO DOCUMENTAL RAG RECUPERADO DE LA BASE DE DATOS (CNB DIGECUR + MINEDUC):
--- REGISTROS CNB DE LOS GRADOS SELECCIONADOS ---
\${JSON.stringify(allCnbContexto, null, 2)}

--- LIBROS Y EJERCICIOS OFICIALES MINEDUC (por página exacta seleccionada) ---
\${JSON.stringify(allMineducContexto, null, 2)}

INSTRUCCIONES CLAVE DE GENERACIÓN Y PRIORIZACIÓN CNB (RF-01 AL RF-09):
1. TEMA EJE TRANSVERSAL UNIFICADOR:
   - Debe integrar los contenidos de todos los grados representados bajo un mismo propósito didáctico.
   - Llena los campos "tema_generador_comun", "categoria_conceptual", "proposito_comun" y "descripcion_eje_integrador".

2. SECUENCIACIÓN PROGRESIVA DIARIA (LUNES A JUEVES - CERO REPETICIÓN):
   - LUNES (Día 1 - Exploración e Introducción): Activación de presaberes con el Tema Eje (15 min) + Presentación y modelado del concepto nuevo con Atención Directa al Grado Base (modelado en pizarra) mientras los demás leen su libro.
   - MARTES (Día 2 - Comprensión y Modelado): Explicación del algoritmo en pizarrón con Atención Directa al Grado Secundario + Ejercitación guiada en cuaderno.
   - MIÉRCOLES (Día 3 - Práctica Autónoma en Libro): Atención Directa rotativa de aplicación + Resolución 100% autónoma de los ejercicios literales del libro MINEDUC con tutoría entre pares.
   - JUEVES (Día 4 - Consolidación y Síntesis): Verificación de respuestas en parejas intergrado + Sección "Pongo a prueba mis conocimientos" + Trabajo en rincón de aprendizaje.

3. DETALLE FÁCTICO COMPLETO POR GRADO:
   Para cada grado en cada día debes especificar:
   - "nombreTemaLiteral": Nombre literal del tema y subtema del libro MINEDUC.
   - "numeroPagina": Número de página física real del libro (ej. Págs. 8-25).
   - "ejerciciosLiterales": Array con páginas, ejercicios e incisos literales (ej. ["Pág. 8, Ejercicio 1 (incisos a, b y c): ..."]).
   - "actividadDocente": Guía paso a paso de lo que el docente dice, modela y escribe en la pizarra.
   - "actividadEstudiante": Acciones autónomas del alumno en su cuaderno con incisos específicos.`;

content = content.replace(oldPromptBuild, newPromptBuild);

// 3. Asegurar que completePlan reciba tema_generador_comun, proposito_comun, etc.
const oldCompletePlan = `            const completePlan = {
              ...basePlan,
              area_curricular: area,
              tema_generador_comun: aiData.tema_generador_comun || basePlan.tema_generador_comun,
              descripcion_eje_integrador: aiData.descripcion_eje_integrador || basePlan.descripcion_eje_integrador,`;

const newCompletePlan = `            const completePlan = {
              ...basePlan,
              area_curricular: area,
              tema_generador_comun: aiData.tema_generador_comun || basePlan.tema_generador_comun,
              categoria_conceptual: aiData.categoria_conceptual || basePlan.categoria_conceptual,
              proposito_comun: aiData.proposito_comun || basePlan.proposito_comun,
              descripcion_eje_integrador: aiData.descripcion_eje_integrador || basePlan.descripcion_eje_integrador,
              actividades_lenguaje: aiData.actividades_lenguaje || basePlan.actividades_lenguaje,
              materiales_didacticos: aiData.materiales_didacticos || basePlan.materiales_didacticos,`;

content = content.replace(oldCompletePlan, newCompletePlan);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('✅ route.ts actualizado con el prompt de Tema Eje Transversal y Secuenciación Progresiva!');
