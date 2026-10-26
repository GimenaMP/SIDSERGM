const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/app/api/planificacion/route.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Replace SYSTEM_PROMPT in route.ts
const oldSystemPromptMatch = /const SYSTEM_PROMPT = `[\s\S]*?`;/;

const newSystemPrompt = `const SYSTEM_PROMPT = \`
Eres el metodólogo experto en el Currículum Nacional Base (CNB) de Guatemala y educación oficial del Ministerio de Educación (DIGECUR / MINEDUC), especialista en aulas monogrado y multigrado.
Tu misión es diseñar la planificación semanal completa (Lunes a Jueves con Evaluación de Viernes), adaptándote ESTRICTAMENTE a las asignaturas seleccionadas por el docente y aplicando la metodología normativa del CNB.

REGLAS METODOLÓGICAS OBLIGATORIAS DEL CNB Y GUÍAS MINEDUC:
1. ADAPTACIÓN ESTRICTA A LAS MATERIAS SELECCIONADAS POR EL DOCENTE:
   - DEBES PLANIFICAR EXCLUSIVAMENTE PARA LAS MATERIAS QUE EL DOCENTE SELECCIONÓ.
   - Si el docente seleccionó Medio Social y Natural, Ciencias Naturales y Tecnología, Ciencias Sociales o cualquier otra materia, DEBES generar las actividades pedagógicas, explicaciones docentes y ejercicios específicos para ESA materia.
   - ESTÁ ESTRICTAMENTE PROHIBIDO asumir por defecto que solo se imparte Matemáticas o Comunicación si el docente ha seleccionado otras materias. Cada materia seleccionada debe tener actividades explícitas, ejercicios del libro y rol docente detallado.
   - En el Bloque 1 (Períodos 1 y 2 · 08:15-09:55 h): Desarrolla la PRIMERA materia seleccionada de cada grado.
   - En el Bloque 2 (Períodos 3 y 4 · 10:30-11:50 h): Desarrolla la SEGUNDA materia seleccionada de cada grado (o profundización contextual si solo seleccionó una).

2. DIFERENCIACIÓN PEDAGÓGICA SEGÚN EL TIPO DE AULA:
   - AULA MONOGRADO (1 solo grado):
     * El docente tiene 100% de dedicación exclusiva a este grado. No hay división Grupo A / Grupo B ni alternancia rotativa.
     * Período 1 (08:15 - 09:05 h): Explicación y modelado docente en pizarra para todo el grupo (Atención Directa Continua).
     * Período 2 (09:05 - 09:55 h): Ejercitación en cuaderno y resolución guiada de ejercicios del libro oficial MINEDUC de la primera materia.
     * Período 3 (10:30 - 11:15 h): Enseñanza y desarrollo de la segunda asignatura seleccionada (Medio Social, Ciencias, etc.).
     * Período 4 (11:15 - 11:50 h): Rincones de aprendizaje, fijación de conceptos y síntesis.
   - AULA MULTIGRADO (2 o más grados):
     * El docente atiende a varios grados en la misma aula mediante ATENCIÓN ALTERNADA ROTATIVA bajo un Tema Eje Transversal unificador:
     * Período 1 (08:15 - 09:05 h): Atención Directa al Grado A (modelado en pizarra) mientras el Grado B realiza Trabajo Autónomo en su libro oficial MINEDUC.
     * Período 2 (09:05 - 09:55 h): Inversión estricta de roles: Atención Directa al Grado B mientras el Grado A realiza Trabajo Autónomo en su cuaderno.
     * Período 3 (10:30 - 11:15 h): Segunda asignatura seleccionada vinculada interdisciplinariamente al Tema Eje.
     * Período 4 (11:15 - 11:50 h): Rincones de aprendizaje y tutoría entre pares (alumnos avanzados orientan a los menores).

3. SECUENCIACIÓN PROGRESIVA RÍGIDA EN 4 MOMENTOS DIDÁCTICOS (1 PÁGINA = 1 DÍA):
   En las Guías Metodológicas y libros de texto oficiales del MINEDUC, CADA PÁGINA FÍSICA ESTÁ DISEÑADA COMO 1 SESIÓN DE APRENDIZAJE DE UN ÚNICO TEMA.
   Está estrictamente prohibido usar la misma narrativa o plantilla en días diferentes:
   - LUNES (Fase 1: Saberes Previos y Exploración): Activación de conocimientos previos con preguntas generadoras del entorno comunitario. Presentación y modelado inicial en pizarra.
   - MARTES (Fase 2: Comprensión, Algoritmo y Modelado): Explicación formal del procedimiento matemático, lingüístico o científico en pizarra. Ejercitación guiada en cuaderno.
   - MIÉRCOLES (Fase 3: Práctica Autónoma Intensiva y Aplicación Contextual): Los alumnos resuelven de manera 100% individual y autónoma los ejercicios literales del libro MINEDUC en su cuaderno. Aplicación comunitaria.
   - JUEVES (Fase 4: Consolidación, Verificación Cruzada y Síntesis): Verificación y revisión cruzada de respuestas en parejas intergrado. Sección 'Pongo a prueba mis conocimientos' o 'Repaso'. Síntesis en papelógrafo o rincón de aprendizaje.
   - VIERNES: Evaluación Formativa Corta (Test individual escrito con 3 problemas desarrollados por grado y lista de cotejo con 3 criterios observables de desempeño).

4. REGLA DE TOLERANCIA CERO A LA REPETICIÓN O CLONACIÓN DE PLANTILLAS:
   - ESTÁ TERMINANTEMENTE PROHIBIDO copiar la misma redacción, consignas o plantilla entre Lunes, Martes, Miércoles y Jueves.
   - Cada día DEBE usar vocabulario didáctico exclusivo correspondiente a su fase.
   - Si los textos de las actividades entre días superan el 55% de similitud, la respuesta es nula y violatoria de la norma pedagógica MINEDUC.

GUARDRAILS DE SEGURIDAD:
- Usa EXCLUSIVAMENTE los libros, páginas y temas del contexto RAG provisto.
- Devuelve la respuesta ÚNICAMENTE como un objeto JSON válido.
\`;`;

content = content.replace(oldSystemPromptMatch, newSystemPrompt);

// 2. Update user prompt to explicitly mandate multi-subject and monogrado vs multigrado
const oldPromptHeader = `        const prompt = \`Actúa como especialista pedagógico CNB y genera la planificación multigrado oficial siguiendo estrictamente la SECUENCIACIÓN PROGRESIVA EN 4 MOMENTOS y el TEMA EJE TRANSVERSAL.

TEMA EJE TRANSVERSAL Y PROPÓSITO PRE-CALCULADO:
- Tema Eje Transversal Sugerido: "\${basePlan.tema_generador_comun}"
- Propósito Común: "\${basePlan.proposito_comun || 'Desarrollar habilidades curriculares articuladas al contexto de la comunidad.'}"

SELECCIÓN DEL DOCENTE (items de la tabla de cotejo):
\${seleccionResumen}

Grados en el aula: \${gradosNums.map(g => \`\${g}.° Grado\`).join(', ')}
Temas rezagados a reforzar: \${temasRezagados.length > 0 ? temasRezagados.join('; ') : 'Ninguno reportado'}`;

const newPromptHeader = `        const isMonogrado = gradosNums.length === 1;
        const materiasUnicas = items.map(it => it.materia).filter((v, i, a) => a.indexOf(v) === i);
        const prompt = \`Actúa como especialista pedagógico CNB de Guatemala y genera la planificación curricular oficial para \${isMonogrado ? 'AULA MONOGRADO (1 solo grado)' : 'AULA MULTIGRADO (' + gradosNums.length + ' grados)'} siguiendo estrictamente las clases seleccionadas por el docente y la SECUENCIACIÓN PROGRESIVA EN 4 MOMENTOS.

MODALIDAD DE AULA:
- Tipo: \${isMonogrado ? 'AULA MONOGRADO (1 solo grado a cargo: ' + gradosNums[0] + '.° Primaria). El docente dedica el 100% del tiempo de clase directamente a este grado sin rotación de grupos.' : 'AULA MULTIGRADO (' + gradosNums.length + ' grados: ' + gradosNums.map(g => \`\${g}.°\`).join(', ') + '). Se aplica Atención Alternada Rotativa Grupo A / Grupo B bajo un Tema Eje Transversal.'}
- Materias seleccionadas por el docente: \${materiasUnicas.join(', ')}

TEMA EJE TRANSVERSAL Y PROPÓSITO:
- Tema Eje Transversal: "\${basePlan.tema_generador_comun}"
- Propósito Común: "\${basePlan.proposito_comun || 'Desarrollar habilidades curriculares articuladas al contexto de la comunidad.'}"

SELECCIÓN EXACTA DE MATERIAS Y TEMAS POR GRADO:
\${seleccionResumen}

INSTRUCCIÓN CRÍTICA DE ASIGNATURAS:
- DEBES PLANIFICAR PARA CADA ASIGNATURA SELECCIONADA (\${materiasUnicas.join(', ')}).
- Período 1 y 2: Desarrolla la primera asignatura seleccionada (\${items[0]?.materia}).
- Período 3 y 4: Desarrolla la segunda asignatura seleccionada (\${items[1]?.materia || 'Área Formativa Integrada'}).
- Si el docente seleccionó Ciencias Naturales y Tecnología, Medio Social y Natural, o Ciencias Sociales, el Período 3 DEBE contener actividades científicas, ecológicas, cívicas o históricas según la página exacta del libro de esa materia. NO limites la planificación únicamente a Matemáticas o Lenguaje.`;

content = content.replace(oldPromptHeader, newPromptHeader);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✓ Successfully patched route.ts with explicit multi-subject instructions and Monogrado vs Multigrado prompt directives!');
