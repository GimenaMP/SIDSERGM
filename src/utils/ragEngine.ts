import cnbRaw from '../../data/cnb_processed.json';
import mineducRaw from '../../data/mineduc_ejercicios.json';

export type DiaSemana = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves';

export interface TimeAllocation {
  rango: string;
  rolDocente: 'atencion_directa' | 'trabajo_autonomo';
  descripcion: string;
}

export interface GradeSchedule {
  grado: string;
  gradoNumero?: number;
  bloque: string;
  duracionTotal: string;
  materia: string;
  tema: string;
  modalidad: 'Atención Directa Docente' | 'Trabajo Autónomo con Guía' | 'Trabajo Cooperativo / Práctica';
  actividadDocente?: string;
  actividadEstudiante?: string;
  cnbCompetencia: string;
  cnbIndicador: string;
  libroTitulo: string;
  numeroPagina: number;
  seccionLibro: string;
  tiemposReferencia: TimeAllocation[];
  ejerciciosLiterales: string[];
  tareaCasa: string;
  completado: boolean;
  esTemaRezagado?: boolean;
}

export interface DayPlan {
  dia: DiaSemana;
  enfoqueDidactico: string;
  horarioBloque: string;
  duracionMinutos: number;
  fase_inicio_comun: string;
  fase_cierre_comun: string;
  gradosSincronizados: GradeSchedule[];
}

export interface AlineacionCNBGrado {
  grado: string;
  competencia: string;
  indicador_logro: string;
  contenido_declarativo: string;
}

export interface EvaluacionGradoViernes {
  grado: string;
  gradoNumero: number;
  indicador_a_evaluar: string;
  descripcion_test: string;
  instrumento_evaluacion: string;
  criterios_lista_cotejo: string[];
  hoja_trabajo_ejercicios: string[];
}

export interface UnifiedWeeklyPlan {
  ciclo: 'segundo_ciclo' | 'primer_ciclo';
  grados: number[];
  bimestre: number;
  semana: number;
  area_curricular: string;
  tema_generador_comun: string;
  descripcion_eje_integrador: string;
  alineacion_cnb: Record<string, AlineacionCNBGrado>;
  paginasConfiguradas: Record<number, number>;
  temasRezagados: string[];
  fuenteGeneracion: 'gemini_rag_grounded' | 'rag_vectorial_local';
  fechaGeneracion: string;
  dias: Record<DiaSemana, DayPlan>;
  evaluacion_viernes: Record<string, EvaluacionGradoViernes>;
}

export interface RAGRequestParams {
  ciclo?: 'segundo_ciclo' | 'primer_ciclo';
  grados?: number[];
  bimestre?: number;
  semana?: number;
  paginasPorGrado?: Record<number, number>;
  temasRezagados?: string[];
  diaSeleccionado?: DiaSemana;
}

interface CNBItem {
  grado: number;
  ciclo: string;
  area_materia: string;
  bloque_bimestre: number;
  semana_sugerida: number;
  competencia_numero: number;
  competencia_descripcion: string;
  indicador_numero: string;
  indicador_descripcion: string;
  temas_declarativos: string[];
  criterios_evaluacion: string;
}

interface MineducItem {
  libro_titulo: string;
  libro_url?: string;
  grado_especifico: number;
  grados_aplicables?: number[];
  ciclo: string;
  materia: string;
  numero_pagina: number;
  seccion_unidad: string;
  tipo_recurso: string;
  enunciado_ejercicio: string;
  instrucciones_docente: string;
}

const cnbDatabase: CNBItem[] = cnbRaw as CNBItem[];
const mineducDatabase: MineducItem[] = mineducRaw as MineducItem[];

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

// Búsqueda curricular en el CNB (DIGECUR)
export function searchCNBCorresponding(
  grado: number, 
  semana: number, 
  bimestre: number, 
  temaRezagado?: string
): CNBItem {
  const gradoItems = cnbDatabase.filter(c => c.grado === grado);

  if (gradoItems.length === 0) {
    return {
      grado,
      ciclo: grado <= 3 ? 'primer_ciclo' : 'segundo_ciclo',
      area_materia: 'Matemáticas',
      bloque_bimestre: bimestre,
      semana_sugerida: semana,
      competencia_numero: grado,
      competencia_descripcion: `Aplica conocimientos y habilidades matemáticas en la resolución de problemas de su entorno comunitario (Grado ${grado}°).`,
      indicador_numero: `${grado}.1.1`,
      indicador_descripcion: `Opera y aplica conceptos matemáticos con precisión según lineamientos del CNB para ${grado}° Primaria.`,
      temas_declarativos: ['Operaciones básicas', 'Resolución de problemas contextuales'],
      criterios_evaluacion: 'Resuelve problemas cotidianos con exactitud.'
    };
  }

  if (temaRezagado && temaRezagado.trim().length > 0) {
    let bestMatch = gradoItems[0];
    let maxSim = -1;
    for (const item of gradoItems) {
      const combined = `${item.competencia_descripcion} ${item.indicador_descripcion} ${item.temas_declarativos.join(' ')}`;
      const sim = calculateTextSimilarity(temaRezagado, combined);
      if (sim > maxSim) {
        maxSim = sim;
        bestMatch = item;
      }
    }
    if (maxSim > 0.1) return bestMatch;
  }

  const exactWeek = gradoItems.find(c => c.semana_sugerida === semana && c.bloque_bimestre === bimestre);
  if (exactWeek) return exactWeek;

  const exactBloque = gradoItems.find(c => c.bloque_bimestre === bimestre);
  if (exactBloque) return exactBloque;

  return gradoItems[0];
}

// Búsqueda de ejercicios oficiales MINEDUC por número de página
export function searchMineducExercises(
  grado: number, 
  paginaDeseada: number, 
  temaQuery?: string
): { item: MineducItem; paginaEfectiva: number } {
  const gradoItems = mineducDatabase.filter(m => m.grado_especifico === grado);

  if (gradoItems.length === 0) {
    return {
      item: {
        libro_titulo: `Matemáticas ${grado}G — MINEDUC (Edición Oficial)`,
        grado_especifico: grado,
        ciclo: grado <= 3 ? 'primer_ciclo' : 'segundo_ciclo',
        materia: 'Matemáticas',
        numero_pagina: paginaDeseada || 30,
        seccion_unidad: `Unidad de Aprendizaje — Grado ${grado}°`,
        tipo_recurso: 'ejercicio_estudiante',
        enunciado_ejercicio: `Resolver los ejercicios de ejercitación comunitaria y cálculo de la página ${paginaDeseada || 30}.`,
        instrucciones_docente: 'El docente orienta el procedimiento y verifica el resultado en el cuaderno.'
      },
      paginaEfectiva: paginaDeseada || 30
    };
  }

  const exactPage = gradoItems.find(m => m.numero_pagina === paginaDeseada);
  if (exactPage) {
    return { item: exactPage, paginaEfectiva: exactPage.numero_pagina };
  }

  if (temaQuery && temaQuery.trim().length > 0) {
    let best = gradoItems[0];
    let maxSim = -1;
    for (const m of gradoItems) {
      const text = `${m.seccion_unidad} ${m.enunciado_ejercicio}`;
      const sim = calculateTextSimilarity(temaQuery, text);
      if (sim > maxSim) {
        maxSim = sim;
        best = m;
      }
    }
    if (maxSim > 0.15) {
      return { item: best, paginaEfectiva: best.numero_pagina };
    }
  }

  if (paginaDeseada > 0) {
    let closest = gradoItems[0];
    let minDiff = Math.abs(closest.numero_pagina - paginaDeseada);
    for (const m of gradoItems) {
      const diff = Math.abs(m.numero_pagina - paginaDeseada);
      if (diff < minDiff) {
        minDiff = diff;
        closest = m;
      }
    }
    return { item: closest, paginaEfectiva: closest.numero_pagina };
  }

  return { item: gradoItems[0], paginaEfectiva: gradoItems[0].numero_pagina };
}

// Estructurar enunciados literales del libro MINEDUC
function formatLiteralExercises(enunciado: string, instrucciones: string, pagina: number, grado: number): string[] {
  const lines: string[] = [];
  lines.push(`1. Ejercicio principal del libro oficial (Pág. ${pagina}):`);
  lines.push(`   ${enunciado}`);
  lines.push(`2. Orientación pedagógica contextual MINEDUC:`);
  lines.push(`   ${instrucciones}`);
  lines.push(`3. Ejercitación en cuaderno de trabajo:`);
  if (grado === 4) {
    lines.push(`   • Ubicar en tabla de posiciones (CM, DM, UM, C, D, U).`);
    lines.push(`   • Escribir la lectura formal en letras de las cosechas en el cuaderno.`);
  } else if (grado === 5) {
    lines.push(`   • Operar paso a paso verificando el común denominador.`);
    lines.push(`   • Simplificar la fracción resultante a su mínima expresión.`);
  } else if (grado === 6) {
    lines.push(`   • Plantear la proporción de regla de tres directa: (a / b = c / x).`);
    lines.push(`   • Redactar la conclusión económica contextualizada en quetzales.`);
  } else if (grado === 1) {
    lines.push(`   • Contar con apoyo de tapitas o semillas de frijol.`);
    lines.push(`   • Trazar los numerales del 1 al 10 en cuadrícula.`);
  } else if (grado === 2) {
    lines.push(`   • Descomponer en decenas y unidades con tarjetas de colores.`);
    lines.push(`   • Resolver la suma vertical de naranjas sin reagrupación.`);
  } else {
    lines.push(`   • Graficar con regla los arreglos rectangulares de multiplicación.`);
    lines.push(`   • Colorear las partes fraccionarias indicadas en la guía.`);
  }
  return lines;
}

// Alternancia rotativa de 45 minutos (Atención Directa vs Autónomo vs Cooperativo)
function buildRotationalTimeline(
  dia: DiaSemana, 
  grados: number[], 
  gradoPrincipal: number
): { tiempos: TimeAllocation[]; modalidad: 'Atención Directa Docente' | 'Trabajo Autónomo con Guía' | 'Trabajo Cooperativo / Práctica'; actividadDocente: string; actividadEstudiante: string } {
  const gIndex = grados.indexOf(gradoPrincipal);

  if (dia === 'Lunes') {
    if (gIndex === 0) {
      return {
        modalidad: 'Atención Directa Docente',
        actividadDocente: 'Explicación magistral en el pizarrón: Modelado de lectura posicional y tabla de valores.',
        actividadEstudiante: 'Toma de notas guiada y participación en el pizarrón respondiendo preguntas del docente.',
        tiempos: [
          { rango: '00 - 15 min', rolDocente: 'atencion_directa', descripcion: 'Explicación del maestro en pizarra: Introducción del concepto con tabla de valores.' },
          { rango: '15 - 35 min', rolDocente: 'trabajo_autonomo', descripcion: 'Trabajo individual en cuaderno: Resolución de incisos a, b y c de la guía.' },
          { rango: '35 - 45 min', rolDocente: 'trabajo_autonomo', descripcion: 'Revisión en parejas: Comparación de respuestas y anotación de dudas.' },
        ]
      };
    } else if (gIndex === 1) {
      return {
        modalidad: 'Trabajo Autónomo con Guía',
        actividadDocente: 'Monitoreo a distancia y entrega de material concreto (tiras de papel / granos).',
        actividadEstudiante: 'Lectura silenciosa guiada en el libro de texto y planteamiento de ejercicios preliminares.',
        tiempos: [
          { rango: '00 - 15 min', rolDocente: 'trabajo_autonomo', descripcion: 'Lectura silenciosa guiada: Observar diagramas e ilustraciones de apertura en libro.' },
          { rango: '15 - 30 min', rolDocente: 'atencion_directa', descripcion: 'Atención directa del maestro: Demostración en pizarra de fracciones homogéneas.' },
          { rango: '30 - 45 min', rolDocente: 'trabajo_autonomo', descripcion: 'Resolución autónoma: Resolver los problemas de suma de fracciones en cuaderno.' },
        ]
      };
    } else {
      return {
        modalidad: 'Trabajo Cooperativo / Práctica',
        actividadDocente: 'Aclaración de dudas avanzadas sobre despeje de incógnitas.',
        actividadEstudiante: 'Discusión en parejas: Formular la tabla de magnitudes (quintales vs quetzales) con datos de la guía.',
        tiempos: [
          { rango: '00 - 25 min', rolDocente: 'trabajo_autonomo', descripcion: 'Trabajo en parejas: Planteamiento de datos y elaboración de tabla comparativa.' },
          { rango: '25 - 40 min', rolDocente: 'atencion_directa', descripcion: 'Atención directa del maestro: Despeje y resolución de incógnita x en regla de tres.' },
          { rango: '40 - 45 min', rolDocente: 'trabajo_autonomo', descripcion: 'Cierre individual: Anotar el algoritmo resumen y verificar respuestas.' },
        ]
      };
    }
  } else if (dia === 'Martes') {
    if (gIndex === 1) {
      return {
        modalidad: 'Atención Directa Docente',
        actividadDocente: 'Atención directa en pizarra: Modelado de suma de fracciones y simplificación.',
        actividadEstudiante: 'Resolución activa en cuaderno con supervisión directa del docente.',
        tiempos: [
          { rango: '00 - 15 min', rolDocente: 'atencion_directa', descripcion: 'Atención directa del maestro: Aclaración de dudas y modelado de suma de fracciones.' },
          { rango: '15 - 35 min', rolDocente: 'trabajo_autonomo', descripcion: 'Trabajo en parejas: Resolver situaciones problemáticas con medidas tradicionales.' },
          { rango: '35 - 45 min', rolDocente: 'trabajo_autonomo', descripcion: 'Consolidación en cuaderno: Copiar tabla de resultados y justificaciones.' },
        ]
      };
    } else if (gIndex === 0) {
      return {
        modalidad: 'Trabajo Autónomo con Guía',
        actividadDocente: 'Verificación visual periódica de cuadernos.',
        actividadEstudiante: 'Resolución individual de los ejercicios contextualizados en la guía oficial.',
        tiempos: [
          { rango: '00 - 15 min', rolDocente: 'trabajo_autonomo', descripcion: 'Repaso rápido en cuaderno: Completar los ejercicios pendientes de ayer.' },
          { rango: '15 - 30 min', rolDocente: 'trabajo_autonomo', descripcion: 'Ejercitación autónoma: Resolver el problema contextual de la comunidad en libro.' },
          { rango: '30 - 45 min', rolDocente: 'atencion_directa', descripcion: 'Atención directa del maestro: Calificación en pizarra y resolución de casos difíciles.' },
        ]
      };
    } else {
      return {
        modalidad: 'Trabajo Cooperativo / Práctica',
        actividadDocente: 'Supervisión de planteamientos de regla de tres.',
        actividadEstudiante: 'Resolución en equipo de situaciones comerciales de compra y venta de café.',
        tiempos: [
          { rango: '00 - 20 min', rolDocente: 'trabajo_autonomo', descripcion: 'Cálculo individual: Desarrollar los ejercicios de regla de tres en libro.' },
          { rango: '20 - 35 min', rolDocente: 'atencion_directa', descripcion: 'Atención directa del maestro: Verificación de planteamiento de variables.' },
          { rango: '35 - 45 min', rolDocente: 'trabajo_autonomo', descripcion: 'Puesta en común: Dos alumnos exponen su solución en el pizarrón secundario.' },
        ]
      };
    }
  } else if (dia === 'Miércoles') {
    if (gIndex === 2) {
      return {
        modalidad: 'Atención Directa Docente',
        actividadDocente: 'Atención directa al grado superior: Despeje y formulación de proporciones compuestas.',
        actividadEstudiante: 'Construcción del modelo matemático y validación de la solución comunitaria.',
        tiempos: [
          { rango: '00 - 15 min', rolDocente: 'trabajo_autonomo', descripcion: 'Lectura comprensiva de la situación económica comunitaria planteada en libro.' },
          { rango: '15 - 30 min', rolDocente: 'trabajo_autonomo', descripcion: 'Cálculo de porcentajes y márgenes de ganancia con datos del cuaderno.' },
          { rango: '30 - 45 min', rolDocente: 'atencion_directa', descripcion: 'Atención directa del maestro: Cierre metodológico y preparación para la síntesis de jueves.' },
        ]
      };
    } else if (gIndex === 0) {
      return {
        modalidad: 'Trabajo Cooperativo / Práctica',
        actividadDocente: 'Paseo guiado entre mesas observando el trabajo en equipo.',
        actividadEstudiante: 'Comparación comunitaria de registros de cosecha y elaboración de cartelito en parejas.',
        tiempos: [
          { rango: '00 - 15 min', rolDocente: 'atencion_directa', descripcion: 'Atención directa: Presentación del problema de cooperativa agrícola.' },
          { rango: '15 - 35 min', rolDocente: 'trabajo_autonomo', descripcion: 'Trabajo colaborativo: Resolución en grupos pequeños con intercambio de roles.' },
          { rango: '35 - 45 min', rolDocente: 'trabajo_autonomo', descripcion: 'Elaboración de cartelito o dibujo explicativo en el cuaderno.' },
        ]
      };
    } else {
      return {
        modalidad: 'Trabajo Autónomo con Guía',
        actividadDocente: 'Atención intermedia para dudas puntuales.',
        actividadEstudiante: 'Resolución de problemas de reparto de granos en medidas tradicionales de la región.',
        tiempos: [
          { rango: '00 - 20 min', rolDocente: 'trabajo_autonomo', descripcion: 'Trabajo cooperativo: Formular dos problemas usando precios del mercado comunal.' },
          { rango: '20 - 35 min', rolDocente: 'atencion_directa', descripcion: 'Atención directa del maestro: Supervisión de cálculos de fracciones.' },
          { rango: '35 - 45 min', rolDocente: 'trabajo_autonomo', descripcion: 'Intercambio de cuadernos para coevaluación constructiva entre compañeros.' },
        ]
      };
    }
  } else {
    // Jueves: Síntesis semanal, checklist y preparación para la prueba de viernes
    return {
      modalidad: 'Atención Directa Docente',
      actividadDocente: 'Revisión general y plenario de consolidación semanal antes de la prueba diagnóstica de mañana.',
      actividadEstudiante: 'Autoevaluación con apoyo de la lista de cotejo y resolución de dudas en plenaria.',
      tiempos: [
        { rango: '00 - 15 min', rolDocente: 'atencion_directa', descripcion: 'Revisión general en plenario: Repaso de los conceptos clave para la prueba de mañana.' },
        { rango: '15 - 35 min', rolDocente: 'trabajo_autonomo', descripcion: 'Resolución del simulador de prueba en cuaderno: Ítems tipo diagnóstico MINEDUC.' },
        { rango: '35 - 45 min', rolDocente: 'atencion_directa', descripcion: 'Checklist de Jueves: El docente confirma los aprendizajes alcanzados y sella cuadernos.' },
      ]
    };
  }
}

// Generador de la Guía Pedagógica Unificada con Eje Integrador (Lunes a Jueves + Evaluación de Viernes)
export function generateUnifiedRAGPlan(params: RAGRequestParams): UnifiedWeeklyPlan {
  const ciclo = params.ciclo || 'segundo_ciclo';
  const grados = params.grados || (ciclo === 'segundo_ciclo' ? [4, 5, 6] : [1, 2, 3]);
  const bimestre = params.bimestre || 2;
  const semana = params.semana || 14;
  const paginasPorGrado = params.paginasPorGrado || (ciclo === 'segundo_ciclo' ? { 4: 38, 5: 44, 6: 115 } : { 1: 14, 2: 32, 3: 54 });
  const temasRezagados = params.temasRezagados || [];

  const temaGenerador = ciclo === 'segundo_ciclo'
    ? 'Resolución de problemas con operaciones aritméticas, fracciones y proporcionalidad en la economía comunitaria'
    : 'Nociones espaciales, conteo con material concreto y adición en situaciones de la vida diaria';

  const descripcionEje = ciclo === 'segundo_ciclo'
    ? 'Eje Integrador Multigrado: Los tres grados abordan situaciones de comercio, cosecha agrícola y cooperativas locales, graduando desde la descomposición posicional (4.°), sumas de fracciones de granos (5.°) hasta regla de tres simple para presupuestos (6.°).'
    : 'Eje Integrador Multigrado: Los tres grados interactúan con objetos y alimentos del entorno (elotes, naranjas, pupitres) graduando desde relaciones espaciales (1.°), decenas y adición (2.°) hasta multiplicación con arreglos rectangulares (3.°).';

  // 1. Alineación CNB (DIGECUR)
  const alineacionCNB: Record<string, AlineacionCNBGrado> = {};
  for (const g of grados) {
    const cnb = searchCNBCorresponding(g, semana, bimestre);
    alineacionCNB[`${g}.° Primaria`] = {
      grado: `${g}.° Primaria`,
      competencia: `Competencia ${cnb.competencia_numero}: ${cnb.competencia_descripcion}`,
      indicador_logro: `Indicador ${cnb.indicador_numero}: ${cnb.indicador_descripcion}`,
      contenido_declarativo: cnb.temas_declarativos.join(', ')
    };
  }

  // 2. Planificación Diaria de Lunes a Jueves con las 3 fases
  const diasSemana: DiaSemana[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves'];
  const diasPlan: Record<DiaSemana, DayPlan> = {} as Record<DiaSemana, DayPlan>;

  const dinámicasInicio: Record<DiaSemana, string> = {
    'Lunes': 'Dinámica Grupal (10-15 min - Común): "La Tienda de la Aldea". Todos los grados juegan a comprar y vender con monedas didácticas para activar conocimientos de numeración y cálculo.',
    'Martes': 'Activación Grupal (10-15 min - Común): "El Número Secreto del Día". Un estudiante da pistas de un número y todos calculan mentalmente el doble, la mitad o su posición.',
    'Miércoles': 'Contextualización Comunitaria (10-15 min - Común): "La Cosecha de Amatitlán". Conversatorio sobre el pesaje de granos y precios actuales en el mercado municipal.',
    'Jueves': 'Calentamiento de Síntesis (10-15 min - Común): "El Desafío Relámpago". Tres preguntas rápidas en pizarra, una para cada grado, para repasar antes del cierre semanal.'
  };

  const plenariasCierre: Record<DiaSemana, string> = {
    'Lunes': 'Plenaria de Cierre (10 min - Común): Puesta en común de estrategias. Un representante de cada grado explica en qué página física trabajó y qué aprendió.',
    'Martes': 'Plenaria de Cierre (10 min - Común): Coevaluación guiada y resolución de dos dudas recurrentes encontradas en los cuadernos de trabajo.',
    'Miércoles': 'Plenaria de Cierre (10 min - Común): Socialización de problemas inventados por los estudiantes sobre la compra y venta de cosechas.',
    'Jueves': 'Plenaria de Cierre y Checklist (10 min - Común): Revisión de los 3 indicadores clave de la semana. Los alumnos marcan su lista de cotejo y llevan tarea de repaso para la prueba del viernes.'
  };

  const enfoques: Record<DiaSemana, string> = {
    'Lunes': 'Apertura Semanal: Introducción conceptual y modelado en pizarra bajo el tema generador común.',
    'Martes': 'Profundización Didáctica: Ejercitación guiada en libros de texto oficiales MINEDUC y trabajo en parejas.',
    'Miércoles': 'Aplicación Comunal: Resolución de situaciones reales de cooperativas agrícolas y comercio local.',
    'Jueves': 'Consolidación y Checklist: Síntesis semanal de logros y preparación para la prueba diagnóstica del viernes.'
  };

  for (const dia of diasSemana) {
    const gradosSincronizados: GradeSchedule[] = [];

    for (const g of grados) {
      const pagBase = paginasPorGrado[g] || 30;
      const offsetPagina = dia === 'Lunes' ? 0 : dia === 'Martes' ? 1 : dia === 'Miércoles' ? 2 : 3;
      const pagCalculada = pagBase + offsetPagina;

      const rezagadoMatch = temasRezagados.find(t => 
        t.toLowerCase().includes(`${g}°`) || 
        t.toLowerCase().includes(`${g}to`) || 
        t.toLowerCase().includes(`${g}mo`) ||
        temasRezagados.length === 1
      );

      const cnbInfo = searchCNBCorresponding(g, semana, bimestre, rezagadoMatch);
      const mineducInfo = searchMineducExercises(g, pagCalculada, rezagadoMatch || cnbInfo.temas_declarativos[0]);

      const rotacion = buildRotationalTimeline(dia, grados, g);

      const ejercicios = formatLiteralExercises(
        mineducInfo.item.enunciado_ejercicio,
        mineducInfo.item.instrucciones_docente,
        mineducInfo.paginaEfectiva,
        g
      );

      let tareaCasa = '';
      if (dia === 'Lunes') {
        tareaCasa = `Pág. ${mineducInfo.paginaEfectiva + 1}: Leer la sección de autoaprendizaje y resolver los ejercicios 1 y 2 en familia.`;
      } else if (dia === 'Martes') {
        tareaCasa = `Pág. ${mineducInfo.paginaEfectiva + 1}: Resolver la situación de la vida diaria aplicando medidas tradicionales.`;
      } else if (dia === 'Miércoles') {
        tareaCasa = `Cuaderno: Plantear a un familiar el problema de cosecha/comercio resuelto hoy y anotar su firma.`;
      } else {
        tareaCasa = `Preparación para la Prueba de Viernes: Repasar las páginas ${pagBase} a ${mineducInfo.paginaEfectiva} trabajadas durante la semana.`;
      }

      gradosSincronizados.push({
        grado: `${g}.° Primaria`,
        gradoNumero: g,
        bloque: `Bloque ${dia} (08:00 - 08:45 hrs)`,
        duracionTotal: '45 min',
        materia: mineducInfo.item.materia || 'Matemáticas',
        tema: rezagadoMatch ? `[Refuerzo Rezagado] ${mineducInfo.item.seccion_unidad}` : mineducInfo.item.seccion_unidad,
        modalidad: rotacion.modalidad,
        actividadDocente: rotacion.actividadDocente,
        actividadEstudiante: rotacion.actividadEstudiante,
        cnbCompetencia: `Competencia ${cnbInfo.competencia_numero}: ${cnbInfo.competencia_descripcion}`,
        cnbIndicador: `Indicador ${cnbInfo.indicador_numero}: ${cnbInfo.indicador_descripcion}`,
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

    diasPlan[dia] = {
      dia,
      enfoqueDidactico: enfoques[dia],
      horarioBloque: '08:00 - 08:45 hrs',
      duracionMinutos: 45,
      fase_inicio_comun: dinámicasInicio[dia],
      fase_cierre_comun: plenariasCierre[dia],
      gradosSincronizados
    };
  }

  // 3. Evaluación de Viernes con Test Individual e Instrumento de Registro (Lista de Cotejo)
  const evaluacionViernes: Record<string, EvaluacionGradoViernes> = {};
  for (const g of grados) {
    const cnb = searchCNBCorresponding(g, semana, bimestre);
    const pag = paginasPorGrado[g] || 30;

    let testDesc = '';
    let criterios: string[] = [];
    let ejerciciosTest: string[] = [];

    if (g === 4) {
      testDesc = 'Hoja de Trabajo Diagnóstica Individual (3 ítems de descomposición posicional y valor relativo en situaciones de cosecha).';
      criterios = [
        'Criterio 1: Descompone aditivamente números de hasta 6 cifras según su valor posicional.',
        'Criterio 2: Escribe correctamente en letras y números cantidades monetarias y de peso.',
        'Criterio 3: Resuelve con precisión el problema contextual de producción agrícola.'
      ];
      ejerciciosTest = [
        'Ítem 1: Escribe la descomposición aditiva de 584,320.',
        'Ítem 2: Ubica en la tabla posicional (CM, DM, UM, C, D, U) la cantidad 709,405.',
        'Ítem 3: Si Don Pedro cosechó trescientos cuarenta mil doscientos quintales de café, escribe la cantidad en números.'
      ];
    } else if (g === 5) {
      testDesc = 'Hoja de Evaluación Formativa Individual (3 problemas de adición de fracciones homogéneas en comercio de granos).';
      criterios = [
        'Criterio 1: Identifica que los denominadores iguales se conservan en la adición.',
        'Criterio 2: Suma correctamente los numeradores y simplifica la fracción a su mínima expresión.',
        'Criterio 3: Interpreta la respuesta como parte del quintal de frijol o maíz vendido.'
      ];
      ejerciciosTest = [
        'Ítem 1: Calcula 3/10 + 4/10 y simplifica si es posible.',
        'Ítem 2: Una familia consumió 2/8 de quintal de maíz el lunes y 3/8 el martes. ¿Cuánto consumió en total?',
        'Ítem 3: ¿Qué fracción de quintal le falta consumir a la familia para llegar a 8/8 (1 quintal completo)?'
      ];
    } else if (g === 6) {
      testDesc = 'Prueba Cuantitativa Individual de Regla de Tres Simple Directa y Proporciones en Cooperativas.';
      criterios = [
        'Criterio 1: Plantea correctamente la proporción formal (a / b = c / x) identificando magnitudes.',
        'Criterio 2: Ejecuta el despeje y cálculo del algoritmo aritmético sin errores de cálculo.',
        'Criterio 3: Redacta la conclusión económica indicando la cantidad exacta en Quetzales (Q).'
      ];
      ejerciciosTest = [
        'Ítem 1: Si 2 quintales de abono orgánico cuestan Q 450.00, ¿cuánto costarán 6 quintales?',
        'Ítem 2: En la cooperativa se empacan 120 libras de café en 3 sacos iguales. ¿Cuántos sacos se necesitan para 400 libras?',
        'Ítem 3: Plantea y resuelve el valor de x en: 5 / 250 = 8 / x.'
      ];
    } else if (g === 1) {
      testDesc = 'Lista de Observación Directa y Hoja de Trazo (Conteo y correspondencia cantidad-numeral 1 al 10).';
      criterios = [
        'Criterio 1: Cuenta objetos del 1 al 10 con correspondencia uno a uno usando semillas.',
        'Criterio 2: Identifica nociones espaciales (arriba, abajo, cerca, lejos).',
        'Criterio 3: Traza el numeral correspondiente a la cantidad observada.'
      ];
      ejerciciosTest = [
        'Ítem 1: Dibuja 7 elotes y escribe el número 7 a la par.',
        'Ítem 2: Encierra en un círculo el canasto que tiene MÁS de 5 frutas.',
        'Ítem 3: Une con una línea el número 9 con la cantidad de tapitas que le corresponde.'
      ];
    } else if (g === 2) {
      testDesc = 'Hoja de Evaluación de Decenas y Sumas sin Reagrupación.';
      criterios = [
        'Criterio 1: Descompone números hasta 99 en decenas y unidades.',
        'Criterio 2: Plantea la suma vertical alineando correctamente decenas y unidades.',
        'Criterio 3: Resuelve el problema contextual de Don Rosa calculando el total de naranjas.'
      ];
      ejerciciosTest = [
        'Ítem 1: Escribe cuántas decenas y unidades tiene el número 68.',
        'Ítem 2: Suma vertical: 42 + 25 = ______.',
        'Ítem 3: Si recogieron 34 naranjas en la mañana y 23 en la tarde, ¿cuántas naranjas tienen en total?'
      ];
    } else {
      testDesc = 'Hoja de Evaluación de Multiplicación con Arreglos Rectangulares y Fracciones Básicas.';
      criterios = [
        'Criterio 1: Modela multiplicaciones como suma repetida y arreglos rectangulares.',
        'Criterio 2: Identifica fracciones de medios (1/2) y cuartos (1/4) en figuras geométricas.',
        'Criterio 3: Resuelve problemas de reparto equitativo en la comunidad.'
      ];
      ejerciciosTest = [
        'Ítem 1: Calcula 4 x 6 dibujando un arreglo de filas y columnas.',
        'Ítem 2: Colorea 1/4 del círculo dividido en 4 partes iguales.',
        'Ítem 3: Reparte 18 cuadernos entre 3 alumnos de manera igual. ¿Cuántos recibe cada uno?'
      ];
    }

    evaluacionViernes[`${g}.° Primaria`] = {
      grado: `${g}.° Primaria`,
      gradoNumero: g,
      indicador_a_evaluar: `Indicador ${cnb.indicador_numero}: ${cnb.indicador_descripcion}`,
      descripcion_test: testDesc,
      instrumento_evaluacion: 'Lista de Cotejo (3 Criterios de Evaluación Formativa)',
      criterios_lista_cotejo: criterios,
      hoja_trabajo_ejercicios: ejerciciosTest
    };
  }

  return {
    ciclo,
    grados,
    bimestre,
    semana,
    area_curricular: 'Matemáticas',
    tema_generador_comun: temaGenerador,
    descripcion_eje_integrador: descripcionEje,
    alineacion_cnb: alineacionCNB,
    paginasConfiguradas: paginasPorGrado,
    temasRezagados,
    fuenteGeneracion: 'rag_vectorial_local',
    fechaGeneracion: new Date().toISOString(),
    dias: diasPlan,
    evaluacion_viernes: evaluacionViernes
  };
}
