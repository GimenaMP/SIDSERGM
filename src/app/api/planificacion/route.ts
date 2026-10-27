import { NextRequest, NextResponse } from 'next/server';
import { 
  generateUnifiedRAGPlan, 
  searchCNBCorresponding, 
  searchMineducExercises, 
  RAGRequestParams, 
  getSubtemaForDay, 
  findExercisesInMineduc,
  diagnosticarPaginaMineduc
} from '@/utils/ragEngine';
import { getMineducPageForGrade } from '@/utils/cnbDosificacionCompleta';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import cnbDatabaseRaw from '../../../../data/cnb_processed.json';
import mineducDatabaseRaw from '../../../../data/mineduc_ejercicios.json';


function calculateTextSimilarity(query: string, targetText: string): number {
  if (!query || !targetText) return 0;
  const qTokens = query.toLowerCase().split(/\W+/).filter(w => w.length > 2);
  const tTokens = new Set(targetText.toLowerCase().split(/\W+/).filter(w => w.length > 2));
  if (qTokens.length === 0 || tTokens.size === 0) return 0;
  let matches = 0;
  for (const token of qTokens) {
    if (tTokens.has(token)) matches++;
  }
  return matches / Math.sqrt(qTokens.length * tTokens.size);
}

// Inicializar cliente Supabase opcional
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder')) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

const SYSTEM_PROMPT = `
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

5. MODALIDADES DE TRABAJO E ICONOGRAFÍA DEL MINEDUC:
   - Debes asignar explícitamente a cada actividad estudiantil una de las tres modalidades oficiales del MINEDUC:
     * "Trabaja individualmente": Para resolución de ejercicios en cuaderno, cálculo mental y redacción individual.
     * "Trabaja en pareja": Para revisión cruzada de respuestas, coevaluación y lectura dialogada.
     * "Trabaja en equipo": Para apartados de "Organizamos", debates, proyectos científicos o círculos de indagación.
   - ESTRUCTURA OBLIGATORIA DE MATEMÁTICAS (GUATEMÁTICA / MINEDUC):
     Cada página física es 1 sesión con 4 momentos didácticos:
     * (P) Situación / Problema: leo, pienso y propongo ideas para resolver.
     * (S) Solución: comparto la solución con compañeros y maestro.
     * (C) Conclusión: registro la regla, algoritmo o concepto clave.
     * (E) Ejercitación en cuaderno: resuelvo los incisos exactos del libro (Trabaja individualmente).
     * Autoevaluación 🙂🙂: pintar 2 caritas si todo correcto, 1 carita si aciertos parciales.
     * (T) Tarea: actividades complementarias en casa.
   - TRATAMIENTO INTELIGENTE DE PÁGINAS CONCEPTUALES EN CIENCIAS SOCIALES Y NATURALES:
     * Si la página contiene apartado explícito ("Organizamos", "Trabajamos", preguntas): CÍTALA TEXTUALMENTE (ej: 'Organizamos (Trabaja en equipo): Dialogamos acerca de...').
     * Si la página es CONCEPTUAL/INFORMATIVA (sin ejercicios en el libro oficial, ej: Pág. 13 de Ciencias Naturales sobre "La célula" y sus organelos):
       ESTÁ ESTRICTAMENTE PROHIBIDO inventar enunciados de temas ajenos (como desastres naturales o deterioro ambiental) o inventar ejercicios ficticios en el libro.
       Actúa con inteligencia pedagógica y sugiere al docente la actividad de aula y tarea basada en el tema real:
       - Sesión 1: Apertura reflexiva y modelado docente del tema real; en equipos analizan las ilustraciones del libro y elaboran en sus cuadernos un cuadro comparativo, diagrama de Venn o dibujo rotulado de organelos (núcleo, membrana celular, citoplasma, mitocondrias, cloroplastos, vacuolas) (Trabaja en equipo).
       - Sesión 2: Lectura analítica del glosario científico del texto oficial; en parejas extraen las funciones clave y redactan conclusiones en el cuaderno (Trabaja en pareja).
       - En "ejerciciosLiterales" incluye explícitamente: '💡 Actividad Pedagógica Sugerida por la IA (Lectura conceptual del libro oficial)' y '💡 Tarea para Casa Sugerida'.

GUARDRAILS DE SEGURIDAD:
- Usa EXCLUSIVAMENTE los libros, páginas y temas del contexto RAG provisto.
- Devuelve la respuesta ÚNICAMENTE como un objeto JSON válido.
`;

interface PlanItem {
  grado: number;
  materia: string;
  materiaId: string;
  libroTitulo: string;
  unidad: number;
  unidadTitulo: string;
  tema: string;
  temaNumero: number;
  paginaInicio: number;
  paginaFin: number;
  competencias: string[];
  indicadores: string[];
  periodosSemanales: number;
  pesoPorcentaje: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ── Extraer items de la matriz de selección ──
    const items: PlanItem[] = Array.isArray(body.items) ? body.items : [];

    // Normalizar grados seleccionados
    let gradosNums: number[] = [];
    if (items.length > 0) {
      const gList = items.map(it => it.grado);
      gradosNums = gList.filter((val, idx) => gList.indexOf(val) === idx).sort((a, b) => a - b);
    } else if (Array.isArray(body.grados) && body.grados.length > 0) {
      gradosNums = body.grados.map((g: any) => parseInt(String(g).replace(/\D/g, ''), 10)).filter((n: number) => !isNaN(n));
    } else {
      if (body.grado1) gradosNums.push(parseInt(String(body.grado1).replace(/\D/g, ''), 10));
      if (body.grado2) gradosNums.push(parseInt(String(body.grado2).replace(/\D/g, ''), 10));
      if (body.grado3) gradosNums.push(parseInt(String(body.grado3).replace(/\D/g, ''), 10));
    }

    if (gradosNums.length === 0) {
      gradosNums = [3, 4];
    }
    gradosNums.sort((a, b) => a - b);

    const area = items[0]?.materia || body.area || body.area_curricular || 'Todas las Áreas Curriculares';
    const bloque = items[0]?.unidad || Number(body.bloque || body.bimestre || 1);
    const semana = items[0]?.temaNumero || Number(body.semana || 1);
    const temasRezagados = Array.isArray(body.temasRezagados) ? body.temasRezagados : [];

    // 1. Plan fáctico base de respaldo garantizado (Grounded en items seleccionados)
    const basePlan = generateUnifiedRAGPlan({
      grados: gradosNums,
      bimestre: bloque,
      semana: semana,
      area: area,
      temasRezagados: temasRezagados,
      ciclo: gradosNums.some(g => g <= 3) ? 'primer_ciclo' : 'segundo_ciclo',
      items: items
    });

    const apiKey = process.env.GEMINI_API_KEY;

    // Si no hay API key o es placeholder, responder con RAG local
    if (!apiKey || apiKey.includes('placeholder')) {
      return NextResponse.json({
        success: true,
        fuente: 'rag_vectorial_local',
        mensaje: 'Planificación generada con base curricular oficial CNB (DIGECUR) y guías MINEDUC.',
        tema_generador_comun: basePlan.tema_generador_comun,
        plan: basePlan
      });
    }

    // 2. Extraer fragmentos RAG con alta precisión para CADA item de la selección
    const cnbDatabase = cnbDatabaseRaw as any[];
    const mineducDatabase = mineducDatabaseRaw as any[];

    const allCnbContexto: any[] = [];
    const allMineducContexto: any[] = [];

    for (const item of items) {
      const g = item.grado;
      const pagInicio = item.paginaInicio;
      const pagFin = item.paginaFin;
      const materiaFiltro = item.materia || '';

      // CNB filtrado por grado, bloque y semana
      const cnbItems = cnbDatabase.filter(c =>
        c.grado === g &&
        c.bloque_bimestre === item.unidad &&
        c.semana_sugerida === item.temaNumero
      );
      allCnbContexto.push(...cnbItems);

      // Ejercicios MINEDUC filtrados por las páginas físicas exactas del tema (RF-06)
      const mineducItems = mineducDatabase.filter(m => {
        const matchGrado = m.grado_especifico === g;
        const matchPagina = m.numero_pagina >= pagInicio && m.numero_pagina <= pagFin;
        if (!matchGrado || !matchPagina) return false;
        if (materiaFiltro && materiaFiltro.length > 3) {
          const matLower = materiaFiltro.toLowerCase();
          const itemMat = (m.materia || '').toLowerCase();
          if (matLower.includes('mate') && itemMat.includes('mate')) return true;
          if ((matLower.includes('lengua') || matLower.includes('comunic')) && (itemMat.includes('lengua') || itemMat.includes('comunic'))) return true;
          if (matLower.includes('medio') && itemMat.includes('medio')) return true;
          if (matLower.includes('ciencia') && itemMat.includes('ciencia')) return true;
          if (matLower.includes('social') && itemMat.includes('social')) return true;
        }
        return true;
      });

      if (mineducItems.length > 0) {
        allMineducContexto.push(...mineducItems.map(it => ({
          libro_titulo: it.libro_titulo,
          grado: it.grado_especifico,
          materia: it.materia,
          numero_pagina: it.numero_pagina,
          seccion_unidad: it.seccion_unidad,
          enunciado_ejercicio: it.enunciado_ejercicio ? String(it.enunciado_ejercicio).slice(0, 350) : '',
          instrucciones_docente: it.instrucciones_docente,
          // Tag con contexto de la selección
          _seleccion: `${g}.° Grado · ${item.materia} · Unidad ${item.unidad} · ${item.tema} · Págs. ${pagInicio}-${pagFin}`
        })));
      } else {
        // Fallback: buscar los más cercanos en páginas
        const closest = mineducDatabase
          .filter(m => m.grado_especifico === g)
          .sort((a, b) => Math.abs(a.numero_pagina - pagInicio) - Math.abs(b.numero_pagina - pagInicio))
          .slice(0, 3)
          .map(it => ({
            libro_titulo: it.libro_titulo,
            grado: it.grado_especifico,
            materia: it.materia,
            numero_pagina: it.numero_pagina,
            seccion_unidad: it.seccion_unidad,
            enunciado_ejercicio: it.enunciado_ejercicio ? String(it.enunciado_ejercicio).slice(0, 350) : '',
            instrucciones_docente: it.instrucciones_docente,
            _seleccion: `${g}.° Grado · ${item.materia} · Unidad ${item.unidad} · ${item.tema} · Págs. ${pagInicio}-${pagFin} (FALLBACK)`
          }));
        allMineducContexto.push(...closest);
      }
    }

    
    // 2.1 Construir desglose RAG por sesión y día (1 Página = 1 Día de clase)
    const diasSemanaConst = ['Lunes', 'Martes', 'Miércoles', 'Jueves'] as const;
    const fasesDidacticasPorDia: Record<string, string> = {
      'Lunes': 'Fase 1: Saberes previos, exploración del Tema Eje y modelado inicial en pizarra.',
      'Martes': 'Fase 2: Comprensión, explicación formal del algoritmo matemático/lingüístico y ejercitación guiada.',
      'Miércoles': 'Fase 3: Práctica autónoma intensiva con ejercicios del libro MINEDUC y aplicación comunitaria.',
      'Jueves': 'Fase 4: Consolidación, verificación cruzada en parejas, sección "Pongo a prueba mis conocimientos" y síntesis.'
    };

    const ragDesglosadoPorDia: Record<string, any> = {};

    for (const d of diasSemanaConst) {
      ragDesglosadoPorDia[d] = {
        dia: d,
        faseDidactica: fasesDidacticasPorDia[d],
        grados: items.map(item => {
          const sub = getSubtemaForDay(d, item as any);
          const pagBuscada = sub.pagina;
          const diag = diagnosticarPaginaMineduc(
            item.grado,
            item.materia,
            pagBuscada,
            item.paginaInicio,
            item.paginaFin,
            sub.titulo,
            d as any
          );
          const instruccionDocente = `Explicar el contenido de ${item.materia} (Pág. ${pagBuscada}), modelar los conceptos de "${sub.titulo}" y orientar el trabajo en modalidad "${diag.modalidadTrabajoOficial}".`;

          return {
            grado: item.grado,
            materia: item.materia,
            subtemaExclusivoDelDia: sub.titulo,
            paginaFisicaExclusivaDelDia: pagBuscada,
            rangoPaginasDelTema: diag.rangoPaginasTema,
            esInicioDeTema: diag.esInicioDeTema,
            tieneActividadExplicitaEnLibro: diag.tieneActividadExplicitaEnLibro,
            tipoContenido: diag.tipoContenido,
            modalidadTrabajoOficialMINEDUC: diag.modalidadTrabajoOficial,
            ejerciciosRealesOActividadSugerida: diag.ejerciciosLiteralesOActividades,
            textoConceptualDelLibro: diag.textoConceptualDelLibro || null,
            sugerenciaInteligenteSiNoTieneActividad: diag.sugerenciaInteligente || null,
            instruccionGuiaDocente: instruccionDocente.slice(0, 300)
          };
        })
      };
    }

    // 3. Construir el contexto de selección textual para el prompt
    const seleccionResumen = items.map(it =>
      `- ${it.grado}.° Grado: ${it.materia} → Unidad ${it.unidad} "${it.unidadTitulo || ''}" → Tema ${it.temaNumero || 1} "${it.tema || ''}" (Págs. ${it.paginaInicio}-${it.paginaFin})\n  Competencias: ${(it.competencias || []).join('; ')}\n  Indicadores: ${(it.indicadores || []).join('; ')}`
    ).join('\n');

    // 4. Invocar a Gemini con conmutación por error (Failover) de modelos disponibles
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const candidateModels = [
        'gemini-3.5-flash-lite',
        'gemini-flash-lite-latest',
        'gemini-3-flash-preview',
        'gemini-3.8-flash'
      ];

      const isMonogrado = gradosNums.length === 1;
      const materiasUnicas = items.map(it => it.materia).filter((v, i, a) => a.indexOf(v) === i);
      const matP1 = materiasUnicas[0] || 'Matemáticas';
      const matP2 = materiasUnicas[1] || materiasUnicas[0] || 'Comunicación y Lenguaje L1';
      const matP3 = materiasUnicas[2] || (materiasUnicas.length === 2 ? materiasUnicas[1] : materiasUnicas[0]);

      const prompt = `Actúa como especialista pedagógico CNB de Guatemala y genera la planificación curricular oficial para ${isMonogrado ? 'AULA MONOGRADO (1 solo grado)' : 'AULA MULTIGRADO (' + gradosNums.length + ' grados)'} siguiendo estrictamente las clases seleccionadas por el docente y la SECUENCIACIÓN PROGRESIVA EN 4 MOMENTOS.

MODALIDAD DE AULA:
- Tipo: ${isMonogrado ? 'AULA MONOGRADO (1 solo grado a cargo: ' + gradosNums[0] + '.° Primaria). El docente dedica el 100% del tiempo de clase directamente a este grado sin rotación de grupos.' : 'AULA MULTIGRADO (' + gradosNums.length + ' grados: ' + gradosNums.map(g => `${g}.°`).join(', ') + '). Se aplica Atención Alternada Rotativa Grupo A / Grupo B bajo un Tema Eje Transversal.'}
- Materias seleccionadas por el docente: ${materiasUnicas.join(', ')}

TEMA EJE TRANSVERSAL Y PROPÓSITO:
- Tema Eje Transversal: "${basePlan.tema_generador_comun}"
- Propósito Común: "${basePlan.proposito_comun || 'Desarrollar habilidades curriculares articuladas al contexto de la comunidad.'}"

SELECCIÓN EXACTA DE MATERIAS Y TEMAS POR GRADO:
${seleccionResumen}
${temasRezagados.length > 0 ? `
ATENCIÓN ESPECIAL - TEMAS REZAGADOS / PENDIENTES DE LA SEMANA ANTERIOR:
El docente indicó que en la planificación previa NO se lograron abarcar los siguientes contenidos:
${temasRezagados.map(tr => `- ${tr}`).join('\n')}
INSTRUCCIÓN OBLIGATORIA: Debes priorizar la nivelación de estos temas rezagados durante los primeros días (Lunes y Martes) antes de avanzar con contenidos nuevos, indicando claramente en las actividades la nivelación y fijación de estos aprendizajes.
` : ''}

INSTRUCCIÓN CRÍTICA DE ASIGNATURAS POR PERÍODO SEGÚN LA SELECCIÓN DEL DOCENTE:
- Materias seleccionadas por el docente para impartir: ${materiasUnicas.join(', ')}
${materiasUnicas.length === 1 ? `
- ATENCIÓN: El docente seleccionó EXCLUSIVAMENTE "${materiasUnicas[0]}".
  * Período 1 (08:15 - 09:05): Apertura reflexiva, activación de presaberes y modelado docente en pizarra sobre "${materiasUnicas[0]}".
  * Período 2 (09:05 - 09:55): Ejercitación guiada, lectura analítica y resolución en libro oficial de "${materiasUnicas[0]}".
  * Período 3 (10:30 - 11:15): Aplicación práctica, trabajo en cuaderno y resolución de ejercicios de "${materiasUnicas[0]}".
  * Período 4 (11:15 - 11:50): Rincones de aprendizaje, síntesis y fijación de "${materiasUnicas[0]}".
  ESTÁ ESTRICTAMENTE PROHIBIDO incluir asignaturas no seleccionadas en los períodos.
` : materiasUnicas.length === 2 ? `
- ATENCIÓN: El docente seleccionó 2 materias: "${materiasUnicas[0]}" y "${materiasUnicas[1]}".
  * Período 1 (08:15 - 09:05): Primera materia: "${materiasUnicas[0]}" (utilizar su libro, página y ejercicios).
  * Período 2 (09:05 - 09:55): Segunda materia: "${materiasUnicas[1]}" (utilizar su libro, página y ejercicios).
  * Período 3 (10:30 - 11:15): Profundización integrada de "${materiasUnicas[1]}" vinculada a "${materiasUnicas[0]}".
  * Período 4 (11:15 - 11:50): Rincones de aprendizaje y tutoría entre pares.
` : `
- Período 1 (08:15 - 09:05): ${matP1} (desarrollar su contenido oficial del libro y ejercitación).
- Período 2 (09:05 - 09:55): ${matP2} (desarrollar su contenido oficial del libro y ejercitación).
- Período 3 (10:30 - 11:15): ${matP3} (desarrollar su contenido oficial del libro y ejercitación).
- Período 4 (11:15 - 11:50): Rincones de aprendizaje, síntesis curricular y tutoría cooperativa.
`}
- 10:00 - 10:30: Receso Escolar y Refacción.
- En cada período debes generar las actividades específicas ("periodo1_actividad", "periodo2_actividad", "periodo3_actividad", "periodo4_actividad") correspondientes a la materia de ese período para ese día, utilizando las páginas físicas y ejercicios del libro oficial MINEDUC.

CONTEXTO DOCUMENTAL RAG RECUPERADO DE LA BASE DE DATOS (CNB DIGECUR + MINEDUC):
--- REGISTROS CNB DE LOS GRADOS SELECCIONADOS ---
${JSON.stringify(allCnbContexto, null, 2)}

--- CONTEXTO DIDÁCTICO RAG DESGLOSADO DÍA POR DÍA (1 PÁGINA = 1 DÍA) ---
${JSON.stringify(ragDesglosadoPorDia, null, 2)}

--- REGISTRO GENERAL MINEDUC CONTEXTUAL ---
${JSON.stringify(allMineducContexto.slice(0, 20), null, 2)}

INSTRUCCIÓN RIGUROSA SOBRE ACTIVIDADES Y EJERCICIOS DEL LIBRO OFICIAL:
- NADA DEBE SER GENÉRICO. DEBES BASARTE EN EL TEXTO REAL RECUPERADO DE LA PÁGINA EN "ragDesglosadoPorDia":
  1. SI "tieneActividadExplicitaEnLibro" ES TRUE:
     Cita literalmente los ejercicios del libro oficial en "ejerciciosLiterales" y desarróllalos en las actividades de los alumnos.
     En Matemáticas: aplica la secuencia (P) Problema, (S) Solución, (C) Conclusión, (E) Ejercitación en cuaderno (Trabaja individualmente), autoevaluación 🙂🙂 y (T) Tarea.
     En Comunicación: cita las consignas reales del texto (trazo, sonido fonético, sílabas o incisos numerados).
     En Ciencias: cita textualmente "Organizamos", "Relaciono" o las actividades impresas.
  2. SI "tieneActividadExplicitaEnLibro" ES FALSE (PÁGINA CONCEPTUAL / SIN EJERCICIOS IMPRESOS):
     ESTÁ PROHIBIDO inventar que el libro tiene ejercicios falsos o usar plantillas vacías.
     DEBES LEER el "textoConceptualDelLibro" y el "subtemaExclusivoDelDia", y REDACTAR con alta inteligencia pedagógica la actividad para los estudiantes y la tarea domiciliaria:
     - En "ejerciciosLiterales" incluye OBLIGATORIAMENTE:
       1) "💡 Actividad Pedagógica redactada por la IA (Pág. X · Lectura conceptual del texto oficial): [instrucción pedagógica paso a paso para el cuaderno basada en los conceptos reales del texto]"
       2) "💡 Tarea para Casa redactada por la IA: [tarea domiciliaria de fijación de los conceptos aprendidos]"
     - Las actividades de los períodos deben orientar a los estudiantes a trabajar sobre ese contenido conceptual en sus cuadernos.

INSTRUCCIONES CLAVE DE GENERACIÓN Y PRIORIZACIÓN CNB (RF-01 AL RF-09):
1. TEMA EJE TRANSVERSAL Y ANÁLISIS DE RELACIÓN POR ASIGNATURA:
   - Los temas eje DEBEN basarse en el análisis de los temas de la MISMA asignatura entre los diferentes grados:
     * SI LOS TEMAS TIENEN RELACIÓN CONCEPTUAL DIRECTA (ej: la célula y mitocondria en Ciencias Naturales, múltiplos y divisores en Matemáticas, poblamiento prehistórico en Ciencias Sociales):
       Propón como "tema_generador_comun" un Tema Eje específico y enriquecido con los conceptos comunes, y en "descripcion_eje_integrador" la estrategia para explicarlo conjuntamente en pizarra antes del trabajo diferenciado en cada libro de texto.
     * SI LOS TEMAS NO TIENEN RELACIÓN DIRECTA (o pertenecen a unidades/ramas pedagógicas distintas):
       ESTÁ ESTRICTAMENTE PROHIBIDO INVENTAR O FORZAR UN TEMA EJE GENÉRICO.
       En ese caso, establece exactamente "tema_generador_comun": "Dosificación Curricular Regular Diferenciada por Grado", "categoria_conceptual": "Dosificación Regular CNB (Temas Independientes)", y desarrolla la planificación con la dosificación normal de cada libro oficial por grado.

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
   - "actividadEstudiante": Acciones autónomas del alumno en su cuaderno con incisos específicos.
0. PONDERACIÓN E INTENSIDAD HORARIA OFICIAL (RF-02):
   - Matemáticas: 5 horas semanales (Alta Prioridad / Área Fundamental).
   - Comunicación y Lenguaje L1: 4 horas semanales (Alta Prioridad / Área Fundamental).
   - Medio Social y Natural: 4 horas semanales (Ciclo I: 1.°-3.°).
   - Ciencias Naturales y Tecnología: 3 horas semanales (Ciclo II: 4.°-6.°).
   - Ciencias Sociales: 3 horas semanales (Ciclo II: 4.°-6.°).
   - Asignaturas sin libro (RF-03): Expresión Artística, Educación Física, Formación Ciudadana y Productividad y Desarrollo no tienen libros de texto; reserva sus bloques de horario escolar (11:15 a 12:00 h / viernes) para que el maestro las imparta.

1. IMPORTANTE: Usa EXCLUSIVAMENTE los números de página, temas, unidades, competencias e indicadores de la selección del docente arriba indicada. NO inventes otros temas ni otros números de página.

2. Para cada grado en el aula, los ejercicios y las actividades DEBEN corresponder al tema y páginas que el docente seleccionó. La selección puede ser diferente para cada grado.

3. REGLA ESTRICTA DE DIFERENCIACIÓN PEDAGÓGICA Y NO REPETICIÓN:
   ESTÁ ESTRICTAMENTE PROHIBIDO REPETIR EL MISMO TEXTO O ACTIVIDADES EN DÍAS DISTINTOS.
   Cada día debe reflejar una fase secuencial única del proceso de enseñanza-aprendizaje:
   - LUNES: Fase de Apertura y Modelado Inicial (introducción, vocabulario clave, modelado paso a paso en pizarra).
   - MARTES: Fase de Profundización y Ejercitación Guiada (análisis de errores comunes, resolución guiada de problemas complejos).
   - MIÉRCOLES: Fase de Aplicación Contextual y Tutoría entre Pares (situaciones de la comunidad, mercado local, cooperación entre grados).
   - JUEVES: Fase de Síntesis y Preparación para Evaluación (resolución de retos tipo prueba, auto-revisión y lista de cotejo).

4. DIVISIÓN ESTRICTA POR PERÍODOS EN CADA DÍA:
   En cada uno de los 4 días (Lunes, Martes, Miércoles, Jueves), en el array "gradosSincronizados" debe existir un elemento para CADA grado atendido (${gradosNums.map(g => `${g}.° Primaria`).join(', ')}).
   Cada elemento DEBE incluir OBLIGATORIAMENTE la división por períodos:
   - "grado": "${gradosNums[0]}.° Primaria", etc.
   - "gradoNumero": número entero del grado
   - "materia": Área curricular según la selección del docente
   - "tema": Nombre exacto de la lección seleccionada
   - "modalidad": "Atención Directa Docente" o "Trabajo Autónomo con Guía"
   - "periodo1_actividad": "08:15 - 09:05 | Período 1: [Atención Directa / Trabajo Autónomo] [Texto didáctico específico y no repetido del día]"
   - "periodo2_actividad": "09:05 - 09:55 | Período 2: [Inversión de Roles] [Texto didáctico específico y no repetido del día]"
   - "periodo3_actividad": "10:30 - 11:15 | Período 3: [Bloque Integrado / Rincones] [Texto didáctico específico y no repetido del día]"
   - "periodo4_actividad": "11:15 - 11:50 | Período 4: [Práctica Autónoma en Cuaderno] [Texto didáctico específico y no repetido del día]"
   - "actividadDocente": "Acción específica y diferenciada del maestro para este día"
   - "actividadEstudiante": "Acción específica y diferenciada del estudiante para este día"
   - "cnbCompetencia": Competencia oficial del CNB
   - "cnbIndicador": Indicador de logro oficial
   - "libroTitulo": Nombre oficial del libro MINEDUC
   - "numeroPagina": Número de página física real seleccionada
   - "seccionLibro": Título de la unidad
   - "ejerciciosLiterales": Array con los ejercicios literales del libro MINEDUC
   - "tareaCasa": Tarea de refuerzo específica para este día
   - "completado": true/false

4. Genera la "evaluacion_viernes" para cada grado con test individual (3 problemas redactados) y lista de cotejo con 3 criterios observables.

Devuelve la respuesta en formato JSON con las claves:
{
  "tema_generador_comun": string,
  "descripcion_eje_integrador": string,
  "pilares_multigrado_cnb": {
    "dialogo_saberes": string,
    "gobierno_escolar": string,
    "rincones_aprendizaje": string,
    "tutoria_entre_pares": string,
    "biblioteca_escolar": string
  },
  "competencias_similares_identificadas": [ { "area": string, "eje_comun": string, "grados_articulacion": string } ],
  "alineacion_cnb": { [grado: string]: { "grado": string, "competencia": string, "indicador_logro": string, "contenido_declarativo": string } },
  "dias": {
    "Lunes": { "dia": "Lunes", "enfoqueDidactico": string, "fase_inicio_comun": string, "fase_cierre_comun": string, "componentes_multigrado": { "dialogo_saberes": string, "gobierno_escolar": string, "rincones_aprendizaje": string, "tutoria_entre_pares": string, "biblioteca_escolar": string }, "gradosSincronizados": [ ... ] },
    "Martes": { ... },
    "Miércoles": { ... },
    "Jueves": { ... }
  },
  "evaluacion_viernes": { [grado: string]: { "grado": string, "gradoNumero": number, "horario_evaluacion": "08:00 - 10:00", "horario_receso": "10:00 - 10:30", "horario_retroalimentacion": "10:30 - 12:00", "indicador_a_evaluar": string, "descripcion_test": string, "instrumento_evaluacion": string, "criterios_lista_cotejo": string[], "hoja_trabajo_ejercicios": string[] } }
}`;

        // Conmutación automática entre modelos candidatos de Gemini (Failover resiliente)
        let result: any = null;
        let successfulModel = '';

        for (const mName of candidateModels) {
          try {
            const m = genAI.getGenerativeModel({
              model: mName,
              systemInstruction: SYSTEM_PROMPT,
              generationConfig: {
                temperature: 0.1,
                responseMimeType: 'application/json'
              }
            });
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error(`Timeout Gemini en ${mName}`)), 40000)
            );
            const geminiPromise = m.generateContent(prompt);
            result = await Promise.race([geminiPromise, timeoutPromise]);
            if (result && result.response) {
              successfulModel = mName;
              break;
            }
          } catch (mErr: any) {
            console.warn(`Aviso modelo ${mName} no disponible (${mErr.message?.slice(0, 80)}), probando siguiente...`);
          }
        }

        if (!result || !result.response) {
          throw new Error('Todos los modelos de Gemini fallaron o excedieron cuota (activando RAG local)');
        }

        const responseText = result.response.text();
        const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
          const aiData = JSON.parse(cleanedJson);

          // Validar que dias tenga Lunes a Jueves con gradosSincronizados
          if (aiData.dias && aiData.dias.Lunes && Array.isArray(aiData.dias.Lunes.gradosSincronizados)) {
            const mergedDias: any = {};
            const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves'] as const;
            
            // Historial de textos aceptados por grado para evitar similitud mayor al 55%
            const acceptedActivitiesByGrade: Record<number, string[]> = {};
            gradosNums.forEach(g => { acceptedActivitiesByGrade[g] = []; });

            const sanitizeActivity = (
              text: any,
              fallback: string,
              gradoNum: number,
              periodo: number,
              dia: string
            ): string => {
              if (typeof text !== 'string') return fallback;
              const clean = text.trim();
              if (clean.length < 25) return fallback;

              // 1. BLINDAJE DE MATERIAS POR PERÍODO (Evita alucinaciones intermateria)
              // Período 2 es Comunicación y Lenguaje: PROHIBIDO incluir matemáticas o múltiplos
              if (periodo === 2) {
                if (/m[uú]ltiplo|divisor|fracci[oó]n|algoritmo aritm|c[aá]lculo mental|mcm|mcd|descomposici[oó]n en factores/i.test(clean)) {
                  return fallback;
                }
              }

              // Período 3 en Martes y Jueves es Ciencias Sociales: PROHIBIDO biología o células
              if (periodo === 3 && (dia === 'Martes' || dia === 'Jueves')) {
                if (/c[eé]lula|mitocondria|mitosis|meiosis|tejido muscular|tejido epitelial|respiraci[oó]n celular/i.test(clean)) {
                  return fallback;
                }
              }

              // Período 3 en Lunes y Miércoles es Ciencias Naturales: PROHIBIDO prehistoria o paleolítico
              if (periodo === 3 && (dia === 'Lunes' || dia === 'Miércoles')) {
                if (/paleol[ií]tico|prehist[oó]ri|cazadores recolectores|pobladores de am[eé]rica/i.test(clean)) {
                  return fallback;
                }
              }

              // 2. Control de similitud contra el historial del grado para evitar duplicados repetitivos
              const history = acceptedActivitiesByGrade[gradoNum] || [];
              for (const pastText of history) {
                const sim = calculateTextSimilarity(clean, pastText);
                if (sim > 0.80) {
                  return fallback;
                }
              }

              history.push(clean);
              return clean;
            };

            for (const d of diasSemana) {
              const aiDia: any = aiData.dias[d] || {};
              const baseDia: any = basePlan.dias[d] || {};

              mergedDias[d] = {
                dia: d,
                enfoqueDidactico: aiDia.enfoqueDidactico || baseDia.enfoqueDidactico,
                horarioJornada: '08:00 - 12:00 (210 min efectivos)',
                duracionMinutos: 210,
                bloque1_horario: '08:00 - 10:00 (Bloque Troncal: 120 min)',
                fase_inicio_comun: aiDia.fase_inicio_comun || baseDia.fase_inicio_comun,
                periodo_1_horario: '08:15 - 09:05 (50 min) | Período 1',
                periodo_2_horario: '09:05 - 09:55 (50 min) | Período 2',
                preparacion_receso: '09:55 - 10:00 (5 min)',
                receso_horario: '10:00 - 10:30 (30 min) | RECESO ESCOLAR',
                bloque2_horario: '10:30 - 12:00 (Bloque Aplicado: 90 min)',
                periodo_3_horario: '10:30 - 11:15 (45 min) | Período 3',
                periodo_4_horario: '11:15 - 11:50 (35 min) | Período 4',
                fase_cierre_comun: aiDia.fase_cierre_comun || baseDia.fase_cierre_comun,
                componentes_multigrado: aiDia.componentes_multigrado || baseDia.componentes_multigrado,
                temaEjePeriodo1: baseDia.temaEjePeriodo1,
                temaEjePeriodo2: baseDia.temaEjePeriodo2,
                temaEjePeriodo3: baseDia.temaEjePeriodo3 || undefined,
                temaEjePeriodo4: baseDia.temaEjePeriodo4,
                gradosSincronizados: (baseDia.gradosSincronizados || []).map((baseItem: any, idx: number) => {
                  const aiItem = (aiDia.gradosSincronizados || []).find((it: any) =>
                    it.gradoNumero === baseItem.gradoNumero ||
                    String(it.grado || '').includes(String(baseItem.gradoNumero))
                  ) || aiDia.gradosSincronizados?.[idx] || {};

                  const docActivity = sanitizeActivity(aiItem.actividadDocente, baseItem.actividadDocente, baseItem.gradoNumero, 0, d);
                  const isRezagado = Boolean(baseItem.esTemaRezagado);

                  const aiExercises = (Array.isArray(aiItem.ejerciciosLiterales) && aiItem.ejerciciosLiterales.length > 0)
                    ? aiItem.ejerciciosLiterales
                    : [];
                  const aiHasPedagogicalDraft = aiExercises.some((e: string) => typeof e === 'string' && (e.includes('💡') || e.includes('Actividad Pedagógica') || e.includes('Tarea para Casa')));

                  const baseExercises = Array.isArray(baseItem.ejerciciosLiterales) && baseItem.ejerciciosLiterales.length > 0
                    ? baseItem.ejerciciosLiterales
                    : [];

                  const finalExercises = (aiHasPedagogicalDraft && (baseExercises.length === 0 || baseExercises[0]?.includes('💡')))
                    ? aiExercises
                    : (baseExercises.length > 0 ? baseExercises : (aiExercises.length > 0 ? aiExercises : []));

                  // Actualizar también materiasSeleccionadas para que cada materia en la tabla refleje los ejercicios reales o redactados
                  const updatedMateriasSeleccionadas = (baseItem.materiasSeleccionadas || []).map((mSel: any) => {
                    const mExercises = Array.isArray(mSel.ejerciciosLiterales) && mSel.ejerciciosLiterales.length > 0
                      ? mSel.ejerciciosLiterales
                      : [];
                    const effectiveMExercises = (aiHasPedagogicalDraft && (mExercises.length === 0 || mExercises[0]?.includes('💡')))
                      ? aiExercises
                      : (mExercises.length > 0 ? mExercises : finalExercises);

                    return {
                      ...mSel,
                      ejerciciosLiterales: effectiveMExercises
                    };
                  });

                  return {
                    ...baseItem,
                    gradoNumero: baseItem.gradoNumero,
                    grado: baseItem.grado,
                    materia: baseItem.materia,
                    tema: isRezagado && !baseItem.tema.includes('[NIVELACIÓN PRIORITARIA]')
                      ? `${baseItem.tema} [NIVELACIÓN PRIORITARIA]`
                      : baseItem.tema,
                    libroTitulo: baseItem.libroTitulo,
                    numeroPagina: baseItem.numeroPagina,
                    paginaFin: baseItem.paginaFin,
                    seccionLibro: baseItem.seccionLibro,
                    materiasSeleccionadas: updatedMateriasSeleccionadas,
                    modalidad: aiItem.modalidad || baseItem.modalidad,
                    periodo1_actividad: sanitizeActivity(aiItem.periodo1_actividad, baseItem.periodo1_actividad, baseItem.gradoNumero, 1, d),
                    periodo2_actividad: sanitizeActivity(aiItem.periodo2_actividad, baseItem.periodo2_actividad, baseItem.gradoNumero, 2, d),
                    periodo3_actividad: sanitizeActivity(aiItem.periodo3_actividad, baseItem.periodo3_actividad, baseItem.gradoNumero, 3, d),
                    periodo4_actividad: sanitizeActivity(aiItem.periodo4_actividad, baseItem.periodo4_actividad, baseItem.gradoNumero, 4, d),
                    actividadDocente: isRezagado && !docActivity.includes('NIVELACIÓN')
                      ? `[NIVELACIÓN PRIORITARIA] ${docActivity}`
                      : docActivity,
                    actividadEstudiante: sanitizeActivity(aiItem.actividadEstudiante, baseItem.actividadEstudiante, baseItem.gradoNumero, 0, d),
                    tareaCasa: sanitizeActivity(aiItem.tareaCasa, baseItem.tareaCasa, baseItem.gradoNumero, 0, d),
                    ejerciciosLiterales: finalExercises
                  };
                })
              };
            }

            const completePlan = {
              ...basePlan,
              area_curricular: area,
              tema_generador_comun: aiData.tema_generador_comun || basePlan.tema_generador_comun,
              categoria_conceptual: aiData.categoria_conceptual || basePlan.categoria_conceptual,
              proposito_comun: aiData.proposito_comun || basePlan.proposito_comun,
              descripcion_eje_integrador: aiData.descripcion_eje_integrador || basePlan.descripcion_eje_integrador,
              actividades_lenguaje: aiData.actividades_lenguaje || basePlan.actividades_lenguaje,
              materiales_didacticos: aiData.materiales_didacticos || basePlan.materiales_didacticos,
              pilares_multigrado_cnb: aiData.pilares_multigrado_cnb || basePlan.pilares_multigrado_cnb,
              competencias_similares_identificadas: aiData.competencias_similares_identificadas || [],
              alineacion_cnb: aiData.alineacion_cnb || basePlan.alineacion_cnb,
              dias: mergedDias,
              evaluacion_viernes: aiData.evaluacion_viernes || basePlan.evaluacion_viernes,
              fuenteGeneracion: 'gemini_rag_grounded'
            };

            return NextResponse.json({
              success: true,
              fuente: 'gemini_3_flash_rag',
              mensaje: 'Planificación multigrado generada por Gemini con búsqueda fáctica en CNB y guías oficiales MINEDUC.',
              tema_generador_comun: completePlan.tema_generador_comun,
              plan: completePlan
            });
          }
        } catch (jsonErr) {
          console.warn('Advertencia parseando JSON de Gemini:', jsonErr);
        }
    } catch (geminiError: any) {
      console.warn('Aviso: Gemini API en fallback a RAG Local:', geminiError.message);
    }

    // Fallback fáctico garantizado sin alucinaciones
    return NextResponse.json({
      success: true,
      fuente: 'rag_vectorial_local',
      mensaje: 'Planificación ensamblada con éxito usando el motor RAG fáctico local (Eje Integrador CNB DIGECUR + Textos Oficiales MINEDUC).',
      tema_generador_comun: basePlan.tema_generador_comun,
      plan: basePlan
    });

  } catch (error: any) {
    console.error('Error generando planificación:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno al generar planificación' },
      { status: 500 }
    );
  }
}
