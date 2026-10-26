const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/utils/ragEngine.ts');
let content = fs.readFileSync(filePath, 'utf8');

const markerStart = '// Generador de la Guía Pedagógica Unificada con Eje Integrador (Lunes a Jueves + Evaluación de Viernes)';
const startIndex = content.indexOf(markerStart);
if (startIndex === -1) {
  console.error('Marker start not found!');
  process.exit(1);
}

const newFunction = `// Generador de la Guía Pedagógica Unificada con Eje Integrador (Lunes a Jueves + Evaluación de Viernes)
export function generateUnifiedRAGPlan(params: RAGRequestParams): UnifiedWeeklyPlan {
  const hasItems = Array.isArray(params.items) && params.items.length > 0;
  const items = params.items || [];

  const ciclo = params.ciclo || (
    (hasItems ? items.some(it => it.grado <= 3) : params.grados?.some(g => g <= 3)) 
      ? 'primer_ciclo' 
      : 'segundo_ciclo'
  );

  let rawGrados: number[] = [];
  if (hasItems) {
    const gList = items.map(it => it.grado);
    rawGrados = gList.filter((v, idx) => gList.indexOf(v) === idx).sort((a, b) => a - b);
  } else if (params.grados && params.grados.length > 0) {
    rawGrados = [...params.grados].sort((a, b) => a - b);
  } else {
    rawGrados = ciclo === 'segundo_ciclo' ? [4, 5, 6] : [1, 2, 3];
  }
  const grados = rawGrados;

  const bimestre = hasItems ? items[0].unidad : Number(params.bimestre || params.bloque || 1);
  const semana = hasItems ? items[0].temaNumero : Number(params.semana || 3);
  
  const allMaterias = hasItems 
    ? [...new Set(items.map(it => it.materia))]
    : [params.area_curricular || params.area || 'Matemáticas'];
  const areaCurricular = allMaterias.join(' + ');

  const temasRezagados = params.temasRezagados || [];

  // Deducción y mapeo fáctico de páginas oficiales
  const paginasPorGrado: Record<number, number> = {};
  for (const g of grados) {
    const itemsG = items.filter(it => it.grado === g);
    if (itemsG.length > 0) {
      paginasPorGrado[g] = itemsG[0].paginaInicio;
    } else {
      paginasPorGrado[g] = params.paginasPorGrado?.[g] || getDefaultPageForGrade(g, bimestre, semana);
    }
  }

  let temaGenerador = '';
  let descripcionEje = '';

  if (hasItems) {
    const distinctTemas = [...new Set(items.map(it => it.tema.split(',')[0].replace(/\\(Pág\\..*?\\)/g, '').trim()))];
    temaGenerador = \`Articulación Curricular Multigrado: \${distinctTemas.slice(0, 3).join(' · ')}\`;
    descripcionEje = \`Eje Integrador Multigrado: Articulación didáctica simultánea de \${allMaterias.join(', ')} para los grados \${grados.map(g => \`\${g}.°\`).join(' y ')} Primaria, aplicando las lecciones oficiales y páginas físicas del MINEDUC contextualizadas a la vida comunitaria.\`;
  } else {
    const areaLower = areaCurricular.toLowerCase();
    const isMultiArea = areaLower.includes('todas') || areaLower.includes('integral');
    if (isMultiArea) {
      temaGenerador = 'Saberes comunitarios, razonamiento lógico y expresión en nuestra escuela multigrado';
      descripcionEje = 'Eje Integrador Multigrado: Articulación interdisciplinaria de todas las áreas curriculares (Matemáticas, Comunicación y Lenguaje, Ciencias Naturales / Medio Social y Formación Ciudadana), vinculando las situaciones de la comunidad con los libros oficiales del MINEDUC.';
    } else if (areaLower.includes('social') || areaLower.includes('ciencia')) {
      temaGenerador = 'Ecosistemas comunitarios, conservación de recursos naturales y vida saludable';
      descripcionEje = 'Eje Integrador Multigrado: Los grados exploran los seres vivos y recursos de la comunidad, graduando desde la observación sensorial del entorno (1.°/2.°), ciclos de vida y plantas medicinales (3.°/4.°), hasta relaciones ecológicas y sostenibilidad comunitaria (5.°/6.°).';
    } else if (areaLower.includes('lengua') || areaLower.includes('comunic')) {
      temaGenerador = 'Comprensión lectora, narración comunitaria y producción de textos';
      descripcionEje = 'Eje Integrador Multigrado: Se articulan lecturas sobre historias y saberes de la aldea, graduando desde la expresión oral y descripción (1.°/2.°), estructura de oraciones y párrafos narrativos (3.°/4.°), hasta ensayos breves y argumentación (5.°/6.°).';
    } else {
      temaGenerador = ciclo === 'segundo_ciclo'
        ? 'Resolución de problemas con operaciones aritméticas, fracciones y proporcionalidad en la economía comunitaria'
        : 'Nociones espaciales, conteo con material concreto y adición en situaciones de la vida diaria';
      descripcionEje = ciclo === 'segundo_ciclo'
        ? 'Eje Integrador Multigrado: Los grados abordan situaciones de comercio, cosecha agrícola y cooperativas locales, graduando desde la descomposición posicional (4.°), sumas de fracciones de granos (5.°) hasta regla de tres simple para presupuestos (6.°).'
        : 'Eje Integrador Multigrado: Los grados interactúan con objetos y alimentos del entorno (elotes, naranjas, pupitres) graduando desde relaciones espaciales (1.°), decenas y adición (2.°) hasta multiplicación con arreglos rectangulares (3.°).';
    }
  }

  // Competencias similares identificadas para articulación multigrado
  const competenciasSimilares: SimilarCompetency[] = [
    {
      area: allMaterias[0] || 'Área Principal',
      eje_comun: temaGenerador,
      grados_articulacion: \`Articulación progresiva de contenidos en los grados \${grados.map(g => \`\${g}.°\`).join(', ')} con base en libros oficiales MINEDUC.\`,
      gradoA_enfoque: \`Enfoque formativo y conceptual para grado \${grados[0] || 4}.°.\`,
      gradoB_enfoque: \`Profundización y resolución autónoma para grado \${grados[1] || 5}.°.\`
    }
  ];

  // 1. Alineación CNB (DIGECUR)
  const alineacionCNB: Record<string, AlineacionCNBGrado> = {};
  for (const g of grados) {
    const itemsG = items.filter(it => it.grado === g);
    if (itemsG.length > 0) {
      const it = itemsG[0];
      const comp = it.competencias?.[0] || 'Competencia oficial del CNB';
      const ind = it.indicadores?.[0] || 'Indicador de logro oficial';
      alineacionCNB[\`\${g}.° Primaria\`] = {
        grado: \`\${g}.° Primaria\`,
        competencia: comp.startsWith('Competencia') ? comp : \`Competencia: \${comp}\`,
        indicador_logro: ind.startsWith('Indicador') ? ind : \`Indicador: \${ind}\`,
        contenido_declarativo: itemsG.map(i => \`\${i.materia} (\${i.tema})\`).join('; ')
      };
    } else {
      const cnb = searchCNBCorresponding(g, semana, bimestre, undefined, areaCurricular);
      alineacionCNB[\`\${g}.° Primaria\`] = {
        grado: \`\${g}.° Primaria\`,
        competencia: \`Competencia \${cnb.competencia_numero}: \${cnb.competencia_descripcion}\`,
        indicador_logro: \`Indicador \${cnb.indicador_numero}: \${cnb.indicador_descripcion}\`,
        contenido_declarativo: cnb.temas_declarativos.join(', ')
      };
    }
  }

  // 2. Planificación Diaria de Lunes a Jueves con las franjas horarias exactas (08:00 a 12:00)
  const diasSemana: DiaSemana[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves'];
  const diasPlan: Record<DiaSemana, DayPlan> = {} as Record<DiaSemana, DayPlan>;

  const dinámicasInicio: Record<DiaSemana, string> = {
    'Lunes': '08:00 - 08:15 | Dinámica Grupal Común: "La Tienda de la Aldea". Todos los grados juegan a comprar y vender con monedas didácticas para activar conocimientos de numeración y cálculo.',
    'Martes': '08:00 - 08:15 | Activación Grupal Común: "El Círculo de Cuentos". Lectura guiada comunitaria para identificar personajes e ideas principales entre todos.',
    'Miércoles': '08:00 - 08:15 | Contextualización Ambiental: "Los Guardianes del Agua". Conversatorio guiado sobre las fuentes de agua y la naturaleza en nuestra aldea.',
    'Jueves': '08:00 - 08:15 | Calentamiento Cívico y Síntesis: "Nuestra Aldea Democrática". Dinámica sobre acuerdos del aula y cómo resolver diferencias con diálogo.'
  };

  const plenariasCierre: Record<DiaSemana, string> = {
    'Lunes': '11:50 - 12:00 | Plenaria de Cierre Común: Puesta en común de estrategias. Un representante de cada grado explica en qué página física trabajó y qué aprendió.',
    'Martes': '11:50 - 12:00 | Plenaria de Cierre Común: Coevaluación guiada y lectura en voz alta de los párrafos y oraciones redactadas en sus cuadernos.',
    'Miércoles': '11:50 - 12:00 | Plenaria de Cierre Común: Socialización de dibujos ecológicos y problemas resueltos sobre la protección de la naturaleza.',
    'Jueves': '11:50 - 12:00 | Plenaria de Cierre y Checklist: Revisión de los 3 indicadores clave de la semana. Los alumnos marcan su lista de cotejo y llevan tarea de repaso para el test del viernes.'
  };

  const enfoques: Record<DiaSemana, string> = {
    'Lunes': 'Apertura Semanal: Activación de conceptos, modelado en pizarra y ejercitación en guías oficiales.',
    'Martes': 'Profundización y Comprensión: Análisis textual, resolución guiada y aplicación práctica.',
    'Miércoles': 'Indagación del Entorno y Experimentación: Trabajo cooperativo en Rincones de Aprendizaje.',
    'Jueves': 'Integración y Síntesis: Consolidación de aprendizajes, comprobación en cuaderno y preparación para el test del viernes.'
  };

  for (const dia of diasSemana) {
    const gradosSincronizados: GradeSchedule[] = [];

    for (const g of grados) {
      const itemsG = items.filter(it => it.grado === g);

      if (itemsG.length > 0) {
        // Modo Fáctico con Items del Docente Seleccionados Simultáneamente
        const matSeleccionadasDetalle: MateriaSeleccionadaDetalle[] = itemsG.map(it => {
          const matEjercicios = findExercisesInMineduc(g, it.materia, it.paginaInicio, it.paginaFin, it.tema);
          return {
            materia: it.materia,
            tema: it.tema,
            libroTitulo: it.libroTitulo,
            unidad: it.unidad,
            paginaInicio: it.paginaInicio,
            paginaFin: it.paginaFin,
            competencias: it.competencias || [],
            indicadores: it.indicadores || [],
            ejerciciosLiterales: matEjercicios
          };
        });

        const mainItem = itemsG[0];
        const rotacion = buildRotationalTimeline(dia, grados, g, mainItem.materia, mainItem.tema);
        const todosEjercicios = matSeleccionadasDetalle.flatMap(m => m.ejerciciosLiterales);

        let tarea = '';
        if (dia === 'Lunes') {
          tarea = \`Pág. \${mainItem.paginaInicio}: Resolver las actividades complementarias de "\${mainItem.tema}" en familia.\`;
        } else if (dia === 'Martes') {
          tarea = \`Pág. \${mainItem.paginaInicio + 1}: Lectura y fijación de conceptos en el cuaderno de trabajo.\`;
        } else if (dia === 'Miércoles') {
          tarea = \`Cuaderno: Socializar con la familia las aplicaciones prácticas de \${mainItem.materia}.\`;
        } else {
          tarea = \`Preparación para el Test de Viernes: Repasar las páginas \${mainItem.paginaInicio}-\${mainItem.paginaFin} vistas durante la semana.\`;
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
        });

      } else {
        // Fallback genérico sin selección de items
        const pagBase = paginasPorGrado[g] || 30;
        const offsetPagina = dia === 'Lunes' ? 0 : dia === 'Martes' ? 1 : dia === 'Miércoles' ? 2 : 3;
        const pagCalculada = pagBase + offsetPagina;

        const rezagadoMatch = temasRezagados.find(t => 
          t.toLowerCase().includes(\`\${g}°\`) || 
          t.toLowerCase().includes(\`\${g}to\`) || 
          t.toLowerCase().includes(\`\${g}mo\`) ||
          temasRezagados.length === 1
        );

        const diaMateria = areaCurricular;
        const cnbInfo = searchCNBCorresponding(g, semana, bimestre, rezagadoMatch, diaMateria);
        const mineducInfo = searchMineducExercises(g, pagCalculada, rezagadoMatch || cnbInfo.temas_declarativos[0], diaMateria);
        const rotacion = buildRotationalTimeline(dia, grados, g, diaMateria, mineducInfo.item.seccion_unidad);

        const ejercicios = formatLiteralExercises(
          mineducInfo.item.enunciado_ejercicio,
          mineducInfo.item.instrucciones_docente,
          mineducInfo.paginaEfectiva,
          g,
          diaMateria,
          mineducInfo.item.seccion_unidad
        );

        let tareaCasa = \`Pág. \${mineducInfo.paginaEfectiva}: Repasar los ejercicios y firmar en el cuaderno.\`;

        gradosSincronizados.push({
          grado: \`\${g}.° Primaria\`,
          gradoNumero: g,
          bloque: \`Jornada Diaria (08:00 - 12:00 hrs | 210 min efectivos)\`,
          duracionTotal: '210 min',
          materia: mineducInfo.item.materia || diaMateria,
          tema: rezagadoMatch ? \`[Refuerzo Rezagado] \${mineducInfo.item.seccion_unidad}\` : mineducInfo.item.seccion_unidad,
          modalidad: rotacion.modalidad,
          actividadDocente: rotacion.actividadDocente,
          actividadEstudiante: rotacion.actividadEstudiante,
          periodo1_actividad: rotacion.periodo1_actividad,
          periodo2_actividad: rotacion.periodo2_actividad,
          periodo3_actividad: rotacion.periodo3_actividad,
          periodo4_actividad: rotacion.periodo4_actividad,
          cnbCompetencia: \`Competencia \${cnbInfo.competencia_numero}: \${cnbInfo.competencia_descripcion}\`,
          cnbIndicador: \`Indicador \${cnbInfo.indicador_numero}: \${cnbInfo.indicador_descripcion}\`,
          libroTitulo: mineducInfo.item.libro_titulo,
          numeroPagina: mineducInfo.paginaEfectiva,
          seccionLibro: mineducInfo.item.seccion_unidad,
          tiemposReferencia: rotacion.tiempos,
          ejerciciosLiterales: ejercicios,
          tareaCasa,
          completado: dia === 'Lunes',
          esTemaRezagado: Boolean(rezagadoMatch)
        });
      }
    }

    const componentesDia: ComponentesAulaMultigrado = {
      dialogo_saberes: dia === 'Lunes' 
        ? 'Diálogo de Saberes Comunitario: Activación de saberes previos y vivencias de los estudiantes articuladas con las actividades del día.'
        : dia === 'Martes'
        ? 'Diálogo de Saberes Lingüístico y Comprensivo: Recuperación de relatos orales y vivencias de la comunidad para motivar la lectura.'
        : dia === 'Miércoles'
        ? 'Diálogo de Saberes Ambiental: Conversatorio sobre el entorno natural y las situaciones comunitarias locales.'
        : 'Diálogo de Saberes Ciudadano: Diálogo vivencial sobre acuerdos comunitarios y valores de convivencia escolar.',
      gobierno_escolar: 'Gobierno Escolar en Acción: Comisiones estudiantiles en autogestión, distribución de libros MINEDUC y orden del aula.',
      rincones_aprendizaje: 'Rincón de Aprendizaje: Espacio organizado con materiales concretos y libros de texto para experimentación e indagación autónoma.',
      tutoria_entre_pares: \`Tutoría entre Pares: Estudiantes de \${Math.max(...grados)}.° Grado que concluyen su trabajo autónomo orientan a compañeros de menor grado.\`,
      biblioteca_escolar: 'Biblioteca Escolar de Aula: Consulta e indagación bibliográfica autónoma en guías y textos oficiales.'
    };

    diasPlan[dia] = {
      dia,
      enfoqueDidactico: enfoques[dia],
      horarioJornada: '08:00 - 12:00 (210 min efectivos)',
      duracionMinutos: 210,
      bloque1_horario: '08:00 - 10:00 (Bloque Troncal: 120 min)',
      fase_inicio_comun: dinámicasInicio[dia],
      periodo_1_horario: '08:15 - 09:05 (50 min) | Período 1: Rotación Multigrado (Atención Directa vs Autónomo)',
      periodo_2_horario: '09:05 - 09:55 (50 min) | Período 2: Inversión Estricta de Roles de Rotación',
      preparacion_receso: '09:55 - 10:00 (5 min) | Guardar materiales y preparación para el receso',
      receso_horario: '10:00 - 10:30 (30 min) | RECESO ESCOLAR - Libre de actividades académicas',
      bloque2_horario: '10:30 - 12:00 (Bloque Aplicado: 90 min)',
      periodo_3_horario: '10:30 - 11:15 (45 min) | Período 3: Aplicación e Indagación Contextualizada por Grado',
      periodo_4_horario: '11:15 - 11:50 (35 min) | Período 4: Práctica Autónoma con Guía y Cuaderno',
      fase_cierre_comun: plenariasCierre[dia],
      componentes_multigrado: componentesDia,
      gradosSincronizados
    };
  }

  // 3. Evaluación de Viernes con Test Individual e Instrumento de Registro (Lista de Cotejo)
  const evaluacionViernes: Record<string, EvaluacionGradoViernes> = {};
  for (const g of grados) {
    const itemsG = items.filter(it => it.grado === g);

    if (itemsG.length > 0) {
      const mainIt = itemsG[0];
      const matName = mainIt.materia;
      const matTemas = itemsG.map(i => i.tema).join(' y ');

      const criterios = [
        \`Criterio 1: Demuestra dominio conceptual de los temas trabajados (\${matTemas}) en las páginas \${mainIt.paginaInicio}-\${mainIt.paginaFin}.\`,
        \`Criterio 2: Aplica los procedimientos y algoritmos oficiales del MINEDUC con orden y precisión en el cuaderno.\`,
        \`Criterio 3: Vincula los saberes con situaciones contextuales de su entorno y comunidad.\`
      ];

      const testItems = [
        \`Ítem 1 (Comprensión y Procedimiento): Explicar o resolver el ejercicio fundamental de la página \${mainIt.paginaInicio} de \${mainIt.libroTitulo} sobre "\${mainIt.tema}".\`,
        \`Ítem 2 (Aplicación Práctica): Resolver la actividad de aplicación de la página \${mainIt.paginaFin} registrando paso a paso la solución en la hoja de evaluación.\`,
        \`Ítem 3 (Transferencia Contextual): Redactar una conclusión o resolver una situación cotidiana comunitaria aplicando los aprendizajes de \${matName}.\`
      ];

      evaluacionViernes[\`\${g}.° Primaria\`] = {
        grado: \`\${g}.° Primaria\`,
        gradoNumero: g,
        horario_evaluacion: '08:00 - 10:00 (120 min) | Aplicación del Test Individual',
        horario_receso: '10:00 - 10:30 (30 min) | RECESO ESCOLAR',
        horario_retroalimentacion: '10:30 - 12:00 (90 min) | Retroalimentación y Registro en Lista de Cotejo',
        indicador_a_evaluar: mainIt.indicadores?.[0] || 'Indicador de logro oficial del CNB',
        descripcion_test: \`Evaluación Formativa Semanal Individual (\${matName}: \${matTemas})\`,
        instrumento_evaluacion: 'Lista de Cotejo con 3 Criterios Observables de Desempeño',
        criterios_lista_cotejo: criterios,
        hoja_trabajo_ejercicios: testItems
      };

    } else {
      const cnb = searchCNBCorresponding(g, semana, bimestre);
      const pag = paginasPorGrado[g] || 30;

      let testDesc = '';
      let criterios: string[] = [];
      let ejerciciosTest: string[] = [];

      if (g === 4) {
        testDesc = 'Hoja de Trabajo Diagnóstica Individual (3 problemas completamente redactados de descomposición posicional y valor relativo en situaciones de cosecha).';
        criterios = [
          'Criterio 1: Descompone aditivamente números de hasta 6 cifras según su valor posicional.',
          'Criterio 2: Escribe correctamente en letras y números cantidades monetarias y de peso.',
          'Criterio 3: Resuelve con precisión el problema contextual de producción agrícola.'
        ];
        ejerciciosTest = [
          'Ítem 1: Escribe la descomposición aditiva completa de la cantidad 584,320 según su valor posicional: 584,320 = 500,000 + 80,000 + 4,000 + 300 + 20 + 0.',
          'Ítem 2: Dibuja la tabla posicional (CM, DM, UM, C, D, U) en tu hoja y ubica exactamente cada dígito del número 709,405.',
          'Ítem 3: Problema Contextual: Si Don Pedro cosechó trescientos cuarenta mil doscientos quintales de café en su finca comunitaria, escribe la cantidad en números arábigos y calcula cuántas centenas de mil completas tiene.'
        ];
      } else if (g === 5) {
        testDesc = 'Hoja de Evaluación Formativa Individual (3 problemas completamente redactados de adición de fracciones homogéneas en comercio de granos).';
        criterios = [
          'Criterio 1: Identifica que los denominadores iguales se conservan en la adición.',
          'Criterio 2: Suma correctamente los numeradores y simplifica la fracción a su mínima expresión.',
          'Criterio 3: Interpreta la respuesta como parte del quintal de frijol o maíz vendido.'
        ];
        ejerciciosTest = [
          'Ítem 1: Calcula la siguiente suma de fracciones de igual denominador y simplifica el resultado a su mínima expresión: 3/10 + 4/10 = ______.',
          'Ítem 2: Problema Contextual: Una familia consumió 2/8 de quintal de maíz el lunes y 3/8 de quintal el martes. ¿Qué fracción total del quintal de maíz consumió durante ambos días?',
          'Ítem 3: ¿Qué fracción de quintal le falta consumir a la familia para completar 8/8 (el quintal entero de maíz)? Explica tu procedimiento con un dibujo o cálculo.'
        ];
      } else if (g === 6) {
        testDesc = 'Prueba Cuantitativa Individual (3 problemas completamente redactados de Regla de Tres Simple Directa y Proporciones en Cooperativas).';
        criterios = [
          'Criterio 1: Plantea correctamente la proporción formal (a / b = c / x) identificando magnitudes.',
          'Criterio 2: Ejecuta el despeje y cálculo del algoritmo aritmético sin errores de cálculo.',
          'Criterio 3: Redacta la conclusión económica indicando la cantidad exacta en Quetzales (Q).'
        ];
        ejerciciosTest = [
          'Ítem 1: Problema Comercial: Si 2 quintales de abono orgánico para café cuestan Q 450.00 en la cooperativa, ¿cuánto costarán 6 quintales del mismo abono? Plantea la proporción y resuelve el valor de x.',
          'Ítem 2: En la cooperativa comunitaria se empacan 120 libras de café molido en 3 sacos exactamente iguales. ¿Cuántos sacos de la misma capacidad se necesitan para empacar 400 libras de café?',
          'Ítem 3: Plantea la ecuación de regla de tres simple y encuentra el valor de la incógnita x: 5 / 250 = 8 / x. Escribe la justificación de tu respuesta.'
        ];
      } else {
        testDesc = 'Hoja de Evaluación Formativa Individual (3 problemas redactados).';
        criterios = [
          'Criterio 1: Identifica las nociones y conceptos fundamentales del grado.',
          'Criterio 2: Aplica el procedimiento o cálculo con orden en su cuaderno.',
          'Criterio 3: Resuelve la situación contextual de su comunidad.'
        ];
        ejerciciosTest = [
          'Ítem 1: Resolver el primer ejercicio de aplicación guiada de la lección.',
          'Ítem 2: Realizar el trazo, dibujo o cálculo requerido en la hoja de trabajo.',
          'Ítem 3: Responder la pregunta contextual sobre la vida escolar y comunitaria.'
        ];
      }

      evaluacionViernes[\`\${g}.° Primaria\`] = {
        grado: \`\${g}.° Primaria\`,
        gradoNumero: g,
        horario_evaluacion: '08:00 - 10:00 (120 min) | Aplicación del Test Individual',
        horario_receso: '10:00 - 10:30 (30 min) | RECESO ESCOLAR',
        horario_retroalimentacion: '10:30 - 12:00 (90 min) | Retroalimentación y Registro en Lista de Cotejo',
        indicador_a_evaluar: \`Indicador \${cnb.indicador_numero}: \${cnb.indicador_descripcion}\`,
        descripcion_test: testDesc,
        instrumento_evaluacion: 'Lista de Cotejo con 3 Criterios Observables de Desempeño',
        criterios_lista_cotejo: criterios,
        hoja_trabajo_ejercicios: ejerciciosTest
      };
    }
  }

  return {
    ciclo,
    grados,
    bimestre,
    semana,
    area_curricular: areaCurricular,
    tema_generador_comun: temaGenerador,
    descripcion_eje_integrador: descripcionEje,
    pilares_multigrado_cnb: diasPlan['Lunes']?.componentes_multigrado,
    competencias_similares_identificadas: competenciasSimilares,
    alineacion_cnb: alineacionCNB,
    paginasConfiguradas: paginasPorGrado,
    temasRezagados,
    fuenteGeneracion: 'rag_vectorial_local',
    fechaGeneracion: new Date().toISOString(),
    dias: diasPlan,
    evaluacion_viernes: evaluacionViernes
  };
}
`;

content = content.slice(0, startIndex) + newFunction;
fs.writeFileSync(filePath, content, 'utf8');
console.log('Part 2 applied successfully!');
