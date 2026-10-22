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
  periodo1_actividad?: string; // 08:15 - 09:05
  periodo2_actividad?: string; // 09:05 - 09:55 (Inversión de roles)
  periodo3_actividad?: string; // 10:30 - 11:15 (Aplicación/indagación)
  periodo4_actividad?: string; // 11:15 - 11:50 (Práctica autónoma)
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
  horarioJornada: string; // 08:00 - 12:00 (210 min efectivos)
  duracionMinutos: number;
  bloque1_horario: string; // 08:00 - 10:00 (120 min)
  fase_inicio_comun: string; // 08:00 - 08:15
  periodo_1_horario: string; // 08:15 - 09:05 (50 min)
  periodo_2_horario: string; // 09:05 - 09:55 (50 min)
  preparacion_receso: string; // 09:55 - 10:00 (5 min)
  receso_horario: string; // 10:00 - 10:30 (30 min - Libre de clases)
  bloque2_horario: string; // 10:30 - 12:00 (90 min)
  periodo_3_horario: string; // 10:30 - 11:15 (45 min)
  periodo_4_horario: string; // 11:15 - 11:50 (35 min)
  fase_cierre_comun: string; // 11:50 - 12:00 (10 min)
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
  horario_evaluacion: string; // 08:00 - 10:00
  horario_receso: string; // 10:00 - 10:30
  horario_retroalimentacion: string; // 10:30 - 12:00
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

// Calculo automatico de pagina oficial del libro MINEDUC segun Bloque (1-4) y Semana (1-9)
export function getDefaultPageForGrade(grado: number, bimestre: number, semana: number): number {
  const b = Math.min(Math.max(bimestre || 1, 1), 4);
  const s = Math.min(Math.max(semana || 1, 1), 9);
  const isSecondHalf = s > 4;

  switch (grado) {
    case 1:
      if (b === 1) return isSecondHalf ? 28 : 14;
      if (b === 2) return isSecondHalf ? 56 : 42;
      if (b === 3) return isSecondHalf ? 88 : 70;
      return isSecondHalf ? 120 : 102;
    case 2:
      if (b === 1) return isSecondHalf ? 32 : 18;
      if (b === 2) return isSecondHalf ? 64 : 48;
      if (b === 3) return isSecondHalf ? 98 : 80;
      return isSecondHalf ? 130 : 112;
    case 3:
      if (b === 1) return isSecondHalf ? 24 : 12;
      if (b === 2) return isSecondHalf ? 54 : 36;
      if (b === 3) return isSecondHalf ? 86 : 68;
      return isSecondHalf ? 128 : 104;
    case 4:
      if (b === 1) return isSecondHalf ? 26 : 16;
      if (b === 2) return isSecondHalf ? 52 : 38;
      if (b === 3) return isSecondHalf ? 90 : 72;
      return isSecondHalf ? 134 : 110;
    case 5:
      if (b === 1) return isSecondHalf ? 36 : 20;
      if (b === 2) return isSecondHalf ? 64 : 44;
      if (b === 3) return isSecondHalf ? 102 : 82;
      return isSecondHalf ? 148 : 122;
    case 6:
      if (b === 1) return isSecondHalf ? 40 : 22;
      if (b === 2) return isSecondHalf ? 115 : 58;
      if (b === 3) return isSecondHalf ? 156 : 132;
      return isSecondHalf ? 194 : 170;
    default:
      return 30 + ((b - 1) * 20) + (s * 2);
  }
}

// Búsqueda curricular en el CNB (DIGECUR) con soporte de Área Curricular
export function searchCNBCorresponding(
  grado: number, 
  semana: number, 
  bimestre: number, 
  temaRezagado?: string,
  areaMateria?: string
): CNBItem {
  let gradoItems = cnbDatabase.filter(c => c.grado === grado);

  if (areaMateria && areaMateria.trim().length > 0) {
    const areaLower = areaMateria.toLowerCase();
    const areaFiltered = gradoItems.filter(c => 
      c.area_materia.toLowerCase().includes(areaLower) ||
      (areaLower.includes('social') && c.area_materia.toLowerCase().includes('social')) ||
      (areaLower.includes('ciencia') && c.area_materia.toLowerCase().includes('ciencia')) ||
      (areaLower.includes('lengua') && c.area_materia.toLowerCase().includes('lengua')) ||
      (areaLower.includes('mate') && c.area_materia.toLowerCase().includes('mate'))
    );
    if (areaFiltered.length > 0) {
      gradoItems = areaFiltered;
    }
  }

  if (gradoItems.length === 0) {
    return {
      grado,
      ciclo: grado <= 3 ? 'primer_ciclo' : 'segundo_ciclo',
      area_materia: areaMateria || 'Matemáticas',
      bloque_bimestre: bimestre,
      semana_sugerida: semana,
      competencia_numero: grado,
      competencia_descripcion: `Aplica conocimientos y habilidades en situaciones de su entorno comunitario (Grado ${grado}°).`,
      indicador_numero: `${grado}.1.1`,
      indicador_descripcion: `Opera y aplica conceptos con precisión según lineamientos del CNB para ${grado}° Primaria.`,
      temas_declarativos: ['Aprendizajes fundamentales', 'Resolución de problemas contextuales'],
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

// Alternancia rotativa estructurada (Jornada 08:00 a 12:00 - 210 min efectivos)
function buildRotationalTimeline(
  dia: DiaSemana, 
  grados: number[], 
  gradoPrincipal: number
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

  // Período 1 (08:15 - 09:05) vs Período 2 (09:05 - 09:55): INVERSIÓN ESTRICTA DE ROLES
  if (dia === 'Lunes') {
    if (gIndex === 0) {
      return {
        modalidad: 'Atención Directa Docente',
        actividadDocente: 'Explicación magistral en el pizarrón: Modelado de lectura posicional y tabla de valores.',
        actividadEstudiante: 'Toma de notas guiada y participación en el pizarrón respondiendo preguntas del docente.',
        periodo1_actividad: '08:15 - 09:05 | Atención Directa Docente: Explicación en pizarra de la tabla posicional, modelado paso a paso con preguntas dirigidas.',
        periodo2_actividad: '09:05 - 09:55 | Trabajo Autónomo con Guía: Resolución individual en cuaderno de los incisos a, b y c del libro de texto.',
        periodo3_actividad: '10:30 - 11:15 | Aplicación e Indagación: Trabajo en parejas resolviendo la situación contextual del mercado comunal.',
        periodo4_actividad: '11:15 - 11:50 | Práctica Autónoma con Guía: Ejercitación complementaria en cuaderno y preparación del resumen.',
        tiempos: [
          { rango: '08:15 - 09:05', rolDocente: 'atencion_directa', descripcion: 'Atención directa del maestro: Modelado paso a paso en pizarra de la descomposición posicional.' },
          { rango: '09:05 - 09:55', rolDocente: 'trabajo_autonomo', descripcion: 'Trabajo individual con guía: Resolución autónoma de ejercicios en el cuaderno de trabajo.' },
          { rango: '10:30 - 11:15', rolDocente: 'trabajo_autonomo', descripcion: 'Aplicación contextual: Trabajo colaborativo en parejas con datos de la comunidad.' },
          { rango: '11:15 - 11:50', rolDocente: 'trabajo_autonomo', descripcion: 'Práctica con guía: Consolidación y ejercitación de cierre de la jornada.' },
        ]
      };
    } else if (gIndex === 1) {
      return {
        modalidad: 'Trabajo Autónomo con Guía',
        actividadDocente: 'Supervisión intermedia y modelado en pizarra durante el Período 2.',
        actividadEstudiante: 'Lectura comprensiva de la guía y resolución autónoma durante el Período 1.',
        periodo1_actividad: '08:15 - 09:05 | Trabajo Autónomo con Guía: Lectura silenciosa guiada, observación de ilustraciones de reparto y planteamiento inicial en cuaderno.',
        periodo2_actividad: '09:05 - 09:55 | Atención Directa Docente: El docente rota a este grado. Demostración en pizarra de fracciones homogéneas y aclaración de dudas.',
        periodo3_actividad: '10:30 - 11:15 | Aplicación e Indagación: Ejercicios prácticos con tiras de papel y medidas tradicionales de granos.',
        periodo4_actividad: '11:15 - 11:50 | Práctica Autónoma con Guía: Resolución de problemas de suma de fracciones en cuaderno de estudio.',
        tiempos: [
          { rango: '08:15 - 09:05', rolDocente: 'trabajo_autonomo', descripcion: 'Trabajo autónomo con guía: Lectura reflexiva y planteamiento de ejercicios preliminares.' },
          { rango: '09:05 - 09:55', rolDocente: 'atencion_directa', descripcion: 'Atención directa del maestro: Explicación en pizarra de fracciones y simplificación de términos.' },
          { rango: '10:30 - 11:15', rolDocente: 'trabajo_autonomo', descripcion: 'Aplicación e indagación: Manipulación de material concreto y fracciones de granos.' },
          { rango: '11:15 - 11:50', rolDocente: 'trabajo_autonomo', descripcion: 'Práctica individual con guía: Consolidación de respuestas en cuaderno.' },
        ]
      };
    } else {
      return {
        modalidad: 'Trabajo Cooperativo / Práctica',
        actividadDocente: 'Aclaración de dudas avanzadas sobre proporciones y despeje de regla de tres.',
        actividadEstudiante: 'Discusión en parejas: Formular la tabla de magnitudes con datos de la guía oficial.',
        periodo1_actividad: '08:15 - 09:05 | Trabajo Cooperativo / Práctica: Planteamiento en parejas de la tabla de magnitudes (quintales vs quetzales).',
        periodo2_actividad: '09:05 - 09:55 | Trabajo Autónomo con Guía: Avance en los problemas de regla de tres del libro de texto.',
        periodo3_actividad: '10:30 - 11:15 | Atención Directa Docente: El maestro profundiza el despeje formal del algoritmo y la regla de tres simple.',
        periodo4_actividad: '11:15 - 11:50 | Práctica Autónoma con Guía: Redacción de conclusiones económicas en cuaderno.',
        tiempos: [
          { rango: '08:15 - 09:05', rolDocente: 'trabajo_autonomo', descripcion: 'Trabajo cooperativo en parejas: Organización de datos en tabla proporcional.' },
          { rango: '09:05 - 09:55', rolDocente: 'trabajo_autonomo', descripcion: 'Trabajo autónomo con guía: Resolución de situaciones comerciales del libro.' },
          { rango: '10:30 - 11:15', rolDocente: 'atencion_directa', descripcion: 'Atención directa del maestro: Despeje y resolución de incógnita x en proporciones.' },
          { rango: '11:15 - 11:50', rolDocente: 'trabajo_autonomo', descripcion: 'Práctica individual de cierre: Redacción de justificaciones en cuaderno.' },
        ]
      };
    }
  } else if (dia === 'Martes') {
    if (gIndex === 1) {
      return {
        modalidad: 'Atención Directa Docente',
        actividadDocente: 'Atención directa en pizarra: Modelado de suma de fracciones y simplificación.',
        actividadEstudiante: 'Resolución activa en cuaderno con supervisión directa del docente.',
        periodo1_actividad: '08:15 - 09:05 | Atención Directa Docente: Explicación en pizarra de adición de fracciones homogéneas y simplificación.',
        periodo2_actividad: '09:05 - 09:55 | Trabajo Autónomo con Guía: Resolución independiente de situaciones de comercio en la guía.',
        periodo3_actividad: '10:30 - 11:15 | Aplicación e Indagación: Trabajo en parejas midiendo fracciones con medidas locales.',
        periodo4_actividad: '11:15 - 11:50 | Práctica Autónoma con Guía: Verificación de ejercicios en cuaderno y autocorrección.',
        tiempos: [
          { rango: '08:15 - 09:05', rolDocente: 'atencion_directa', descripcion: 'Atención directa del maestro: Modelado del algoritmo de suma de fracciones.' },
          { rango: '09:05 - 09:55', rolDocente: 'trabajo_autonomo', descripcion: 'Trabajo autónomo con guía: Resolución de situaciones de reparto en cuaderno.' },
          { rango: '10:30 - 11:15', rolDocente: 'trabajo_autonomo', descripcion: 'Aplicación e indagación: Comparación de respuestas en parejas.' },
          { rango: '11:15 - 11:50', rolDocente: 'trabajo_autonomo', descripcion: 'Práctica de consolidación: Copiar síntesis en cuaderno.' },
        ]
      };
    } else if (gIndex === 0) {
      return {
        modalidad: 'Trabajo Autónomo con Guía',
        actividadDocente: 'Atención directa en Período 2 para revisión de cuadernos.',
        actividadEstudiante: 'Resolución individual de ejercicios contextualizados durante el Período 1.',
        periodo1_actividad: '08:15 - 09:05 | Trabajo Autónomo con Guía: Repaso en cuaderno y resolución de ejercicios contextuales de la guía.',
        periodo2_actividad: '09:05 - 09:55 | Atención Directa Docente: El docente modela en pizarra la resolución de casos difíciles y sella avances.',
        periodo3_actividad: '10:30 - 11:15 | Aplicación e Indagación: Elaboración de tabla comparativa con datos del entorno.',
        periodo4_actividad: '11:15 - 11:50 | Práctica Autónoma con Guía: Ejercitación complementaria en cuaderno.',
        tiempos: [
          { rango: '08:15 - 09:05', rolDocente: 'trabajo_autonomo', descripcion: 'Trabajo autónomo con guía: Resolución de problemas de conteo y valor relativo.' },
          { rango: '09:05 - 09:55', rolDocente: 'atencion_directa', descripcion: 'Atención directa del maestro: Explicación de dudas recurrentes en el pizarrón.' },
          { rango: '10:30 - 11:15', rolDocente: 'trabajo_autonomo', descripcion: 'Aplicación práctica: Ejercicios de aplicación en cuaderno.' },
          { rango: '11:15 - 11:50', rolDocente: 'trabajo_autonomo', descripcion: 'Práctica de cierre: Completar ejercicios de autoaprendizaje.' },
        ]
      };
    } else {
      return {
        modalidad: 'Trabajo Cooperativo / Práctica',
        actividadDocente: 'Supervisión de planteamientos de regla de tres.',
        actividadEstudiante: 'Resolución en equipo de situaciones comerciales de compra y venta de café.',
        periodo1_actividad: '08:15 - 09:05 | Trabajo Autónomo con Guía: Resolución individual de problemas comerciales en el libro.',
        periodo2_actividad: '09:05 - 09:55 | Trabajo Cooperativo / Práctica: Discusión en parejas y comprobación cruzada de resultados.',
        periodo3_actividad: '10:30 - 11:15 | Atención Directa Docente: El docente valida modelos matemáticos en pizarra.',
        periodo4_actividad: '11:15 - 11:50 | Práctica Autónoma con Guía: Registro de conclusiones en cuaderno.',
        tiempos: [
          { rango: '08:15 - 09:05', rolDocente: 'trabajo_autonomo', descripcion: 'Trabajo autónomo: Cálculo individual en cuaderno de trabajo.' },
          { rango: '09:05 - 09:55', rolDocente: 'trabajo_autonomo', descripcion: 'Trabajo cooperativo: Discusión y verificación de variables en parejas.' },
          { rango: '10:30 - 11:15', rolDocente: 'atencion_directa', descripcion: 'Atención directa: El maestro retroalimenta el planteamiento formal.' },
          { rango: '11:15 - 11:50', rolDocente: 'trabajo_autonomo', descripcion: 'Práctica con guía: Registro de procedimientos en cuaderno.' },
        ]
      };
    }
  } else if (dia === 'Miércoles') {
    if (gIndex === (grados.length - 1)) {
      return {
        modalidad: 'Atención Directa Docente',
        actividadDocente: 'Atención directa al grado superior: Despeje y formulación de proporciones compuestas.',
        actividadEstudiante: 'Construcción del modelo matemático y validación de la solución comunitaria.',
        periodo1_actividad: '08:15 - 09:05 | Atención Directa Docente: Explicación en pizarra de proporcionalidad directa y cálculo de incógnitas.',
        periodo2_actividad: '09:05 - 09:55 | Trabajo Autónomo con Guía: Resolución de situaciones de costos y cooperativas en el libro.',
        periodo3_actividad: '10:30 - 11:15 | Aplicación e Indagación: Modelado de presupuestos familiares en parejas.',
        periodo4_actividad: '11:15 - 11:50 | Práctica Autónoma con Guía: Consolidación de ejercicios en cuaderno.',
        tiempos: [
          { rango: '08:15 - 09:05', rolDocente: 'atencion_directa', descripcion: 'Atención directa del maestro: Modelado en pizarra del algoritmo de regla de tres.' },
          { rango: '09:05 - 09:55', rolDocente: 'trabajo_autonomo', descripcion: 'Trabajo autónomo con guía: Ejercicios de aplicación en cuaderno.' },
          { rango: '10:30 - 11:15', rolDocente: 'trabajo_autonomo', descripcion: 'Aplicación e indagación: Elaboración de presupuestos en equipo.' },
          { rango: '11:15 - 11:50', rolDocente: 'trabajo_autonomo', descripcion: 'Práctica con guía: Verificación de resultados finales.' },
        ]
      };
    } else if (gIndex === 0) {
      return {
        modalidad: 'Trabajo Cooperativo / Práctica',
        actividadDocente: 'Paseo guiado entre mesas observando el trabajo en equipo.',
        actividadEstudiante: 'Comparación comunitaria de registros de cosecha y elaboración de cartelito en parejas.',
        periodo1_actividad: '08:15 - 09:05 | Trabajo Autónomo con Guía: Ejercicios de cálculo rápido y valor relativo.',
        periodo2_actividad: '09:05 - 09:55 | Atención Directa Docente: El maestro revisa procedimientos en pizarra y orienta al grupo.',
        periodo3_actividad: '10:30 - 11:15 | Trabajo Cooperativo / Práctica: Creación colaborativa de un problema contextual.',
        periodo4_actividad: '11:15 - 11:50 | Práctica Autónoma con Guía: Registro formal en el cuaderno de trabajo.',
        tiempos: [
          { rango: '08:15 - 09:05', rolDocente: 'trabajo_autonomo', descripcion: 'Trabajo individual con guía: Resolución de incisos en cuaderno.' },
          { rango: '09:05 - 09:55', rolDocente: 'atencion_directa', descripcion: 'Atención directa del maestro: Revisión y retroalimentación en pizarra.' },
          { rango: '10:30 - 11:15', rolDocente: 'trabajo_autonomo', descripcion: 'Trabajo cooperativo: Formulación de problemas en parejas.' },
          { rango: '11:15 - 11:50', rolDocente: 'trabajo_autonomo', descripcion: 'Práctica con guía: Consolidación en cuaderno.' },
        ]
      };
    } else {
      return {
        modalidad: 'Trabajo Autónomo con Guía',
        actividadDocente: 'Atención intermedia para dudas puntuales.',
        actividadEstudiante: 'Resolución de problemas de reparto de granos en medidas tradicionales de la región.',
        periodo1_actividad: '08:15 - 09:05 | Trabajo Autónomo con Guía: Resolución de problemas de suma de fracciones en la guía.',
        periodo2_actividad: '09:05 - 09:55 | Trabajo Cooperativo / Práctica: Intercambio de cuadernos para coevaluación en parejas.',
        periodo3_actividad: '10:30 - 11:15 | Atención Directa Docente: El docente aclara dudas de fracciones mixtas e impropias.',
        periodo4_actividad: '11:15 - 11:50 | Práctica Autónoma con Guía: Ejercitación final en cuaderno.',
        tiempos: [
          { rango: '08:15 - 09:05', rolDocente: 'trabajo_autonomo', descripcion: 'Trabajo individual con guía: Resolución de operaciones en cuaderno.' },
          { rango: '09:05 - 09:55', rolDocente: 'trabajo_autonomo', descripcion: 'Trabajo cooperativo: Coevaluación en parejas.' },
          { rango: '10:30 - 11:15', rolDocente: 'atencion_directa', descripcion: 'Atención directa del maestro: Explicación de dudas complejas.' },
          { rango: '11:15 - 11:50', rolDocente: 'trabajo_autonomo', descripcion: 'Práctica con guía: Ejercicios de autoaprendizaje.' },
        ]
      };
    }
  } else {
    // Jueves: Síntesis semanal, checklist y preparación para la prueba de viernes
    return {
      modalidad: 'Atención Directa Docente',
      actividadDocente: 'Revisión general y plenario de consolidación semanal antes de la prueba diagnóstica de mañana.',
      actividadEstudiante: 'Autoevaluación con apoyo de la lista de cotejo y resolución de dudas en plenaria.',
      periodo1_actividad: '08:15 - 09:05 | Atención Directa Docente: Repaso general en pizarra de los conceptos y algoritmos de la semana.',
      periodo2_actividad: '09:05 - 09:55 | Trabajo Autónomo con Guía: Simulador de prueba individual con ejercicios tipo diagnóstico.',
      periodo3_actividad: '10:30 - 11:15 | Trabajo Cooperativo / Práctica: Revisión cruzada en parejas guiada por la lista de cotejo.',
      periodo4_actividad: '11:15 - 11:50 | Práctica Autónoma con Guía: El docente sella cuadernos y resuelve dudas individuales finales.',
      tiempos: [
        { rango: '08:15 - 09:05', rolDocente: 'atencion_directa', descripcion: 'Atención directa del maestro: Repaso y síntesis de los indicadores de la semana.' },
        { rango: '09:05 - 09:55', rolDocente: 'trabajo_autonomo', descripcion: 'Trabajo autónomo: Resolución individual de simulador de prueba en cuaderno.' },
        { rango: '10:30 - 11:15', rolDocente: 'trabajo_autonomo', descripcion: 'Revisión en parejas: Verificación con la lista de cotejo.' },
        { rango: '11:15 - 11:50', rolDocente: 'atencion_directa', descripcion: 'Cierre y firma docente: Verificación final de cuadernos y entrega de guía de repaso.' },
      ]
    };
  }
}

// Generador de la Guía Pedagógica Unificada con Eje Integrador (Lunes a Jueves + Evaluación de Viernes)
export function generateUnifiedRAGPlan(params: RAGRequestParams): UnifiedWeeklyPlan {
  const ciclo = params.ciclo || (params.grados?.some(g => g <= 3) ? 'primer_ciclo' : 'segundo_ciclo');
  const grados = params.grados || (ciclo === 'segundo_ciclo' ? [4, 5, 6] : [1, 2, 3]);
  const bimestre = Number(params.bimestre || params.bloque || 1);
  const semana = Number(params.semana || 3);
  const areaCurricular = params.area_curricular || params.area || 'Matemáticas';
  const temasRezagados = params.temasRezagados || [];

  // Deducción 100% automática de páginas oficiales MINEDUC sin requerir ingreso manual del docente
  const paginasPorGrado: Record<number, number> = {};
  for (const g of grados) {
    paginasPorGrado[g] = params.paginasPorGrado?.[g] || getDefaultPageForGrade(g, bimestre, semana);
  }

  let temaGenerador = '';
  let descripcionEje = '';

  const areaLower = areaCurricular.toLowerCase();
  if (areaLower.includes('social') || areaLower.includes('ciencia')) {
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

  // 1. Alineación CNB (DIGECUR)
  const alineacionCNB: Record<string, AlineacionCNBGrado> = {};
  for (const g of grados) {
    const cnb = searchCNBCorresponding(g, semana, bimestre, undefined, areaCurricular);
    alineacionCNB[`${g}.° Primaria`] = {
      grado: `${g}.° Primaria`,
      competencia: `Competencia ${cnb.competencia_numero}: ${cnb.competencia_descripcion}`,
      indicador_logro: `Indicador ${cnb.indicador_numero}: ${cnb.indicador_descripcion}`,
      contenido_declarativo: cnb.temas_declarativos.join(', ')
    };
  }

  // 2. Planificación Diaria de Lunes a Jueves con las franjas horarias exactas (08:00 a 12:00)
  const diasSemana: DiaSemana[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves'];
  const diasPlan: Record<DiaSemana, DayPlan> = {} as Record<DiaSemana, DayPlan>;

  const dinámicasInicio: Record<DiaSemana, string> = {
    'Lunes': '08:00 - 08:15 | Dinámica Grupal Común: "La Tienda de la Aldea". Todos los grados juegan a comprar y vender con monedas didácticas para activar conocimientos de numeración y cálculo.',
    'Martes': '08:00 - 08:15 | Activación Grupal Común: "El Número Secreto del Día". Un estudiante da pistas de un número y todos calculan mentalmente el doble, la mitad o su posición.',
    'Miércoles': '08:00 - 08:15 | Contextualización Comunitaria: "La Cosecha de Amatitlán". Conversatorio sobre el pesaje de granos y precios actuales en el mercado municipal.',
    'Jueves': '08:00 - 08:15 | Calentamiento de Síntesis: "El Desafío Relámpago". Tres preguntas rápidas en pizarra, una para cada grado, para repasar antes del cierre semanal.'
  };

  const plenariasCierre: Record<DiaSemana, string> = {
    'Lunes': '11:50 - 12:00 | Plenaria de Cierre Común: Puesta en común de estrategias. Un representante de cada grado explica en qué página física trabajó y qué aprendió.',
    'Martes': '11:50 - 12:00 | Plenaria de Cierre Común: Coevaluación guiada y resolución de dos dudas recurrentes encontradas en los cuadernos de trabajo.',
    'Miércoles': '11:50 - 12:00 | Plenaria de Cierre Común: Socialización de problemas inventados por los estudiantes sobre la compra y venta de cosechas.',
    'Jueves': '11:50 - 12:00 | Plenaria de Cierre y Checklist: Revisión de los 3 indicadores clave de la semana. Los alumnos marcan su lista de cotejo y llevan tarea de repaso para el test del viernes.'
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
        tareaCasa = `Preparación para el Test de Viernes: Repasar las páginas ${pagBase} a ${mineducInfo.paginaEfectiva} trabajadas durante la semana.`;
      }

      gradosSincronizados.push({
        grado: `${g}.° Primaria`,
        gradoNumero: g,
        bloque: `Jornada Diaria (08:00 - 12:00 hrs | 210 min efectivos)`,
        duracionTotal: '210 min',
        materia: mineducInfo.item.materia || 'Matemáticas',
        tema: rezagadoMatch ? `[Refuerzo Rezagado] ${mineducInfo.item.seccion_unidad}` : mineducInfo.item.seccion_unidad,
        modalidad: rotacion.modalidad,
        actividadDocente: rotacion.actividadDocente,
        actividadEstudiante: rotacion.actividadEstudiante,
        periodo1_actividad: rotacion.periodo1_actividad,
        periodo2_actividad: rotacion.periodo2_actividad,
        periodo3_actividad: rotacion.periodo3_actividad,
        periodo4_actividad: rotacion.periodo4_actividad,
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
    } else if (g === 1) {
      testDesc = 'Lista de Observación Directa y Hoja de Trazo (Conteo y correspondencia cantidad-numeral del 1 al 10).';
      criterios = [
        'Criterio 1: Cuenta objetos del 1 al 10 con correspondencia uno a uno usando semillas.',
        'Criterio 2: Identifica nociones espaciales (arriba, abajo, cerca, lejos).',
        'Criterio 3: Traza el numeral correspondiente a la cantidad observada.'
      ];
      ejerciciosTest = [
        'Ítem 1: Dibuja un conjunto de 7 elotes frescos y escribe el numeral 7 en el cuadro correspondiente.',
        'Ítem 2: Encierra en un círculo el canasto de mercado que tiene MÁS de 5 frutas y marca con una X el que tiene MENOS.',
        'Ítem 3: Cuenta las tapitas de la mesa (9 en total) y une con una línea el número 9 con el grupo de tapitas.'
      ];
    } else if (g === 2) {
      testDesc = 'Hoja de Evaluación de Decenas y Sumas sin Reagrupación (3 problemas redactados).';
      criterios = [
        'Criterio 1: Descompone números hasta 99 en decenas y unidades.',
        'Criterio 2: Plantea la suma vertical alineando correctamente decenas y unidades.',
        'Criterio 3: Resuelve el problema contextual de Don Rosa calculando el total de naranjas.'
      ];
      ejerciciosTest = [
        'Ítem 1: Escribe cuántas decenas y cuántas unidades tiene el número 68: _____ Decenas y _____ Unidades.',
        'Ítem 2: Resuelve la siguiente suma vertical en tu hoja alineando columnas: 42 + 25 = ______.',
        'Ítem 3: Problema Contextual: Si Don Rosa recolectó 34 naranjas por la mañana y 23 naranjas por la tarde, ¿cuántas naranjas recolectó en total durante el día?'
      ];
    } else {
      testDesc = 'Hoja de Evaluación de Multiplicación con Arreglos Rectangulares y Fracciones Básicas (3 problemas redactados).';
      criterios = [
        'Criterio 1: Modela multiplicaciones como suma repetida y arreglos rectangulares.',
        'Criterio 2: Identifica fracciones de medios (1/2) y cuartos (1/4) en figuras geométricas.',
        'Criterio 3: Resuelve problemas de reparto equitativo en la comunidad.'
      ];
      ejerciciosTest = [
        'Ítem 1: Dibuja un arreglo rectangular de 4 filas y 6 columnas con semillas y escribe la multiplicación correspondiente: 4 x 6 = ______.',
        'Ítem 2: Dibuja una tortilla redonda dividida en 4 partes iguales y colorea 1/4 de la tortilla. Escribe la fracción a la par.',
        'Ítem 3: Problema Contextual: En la escuela se van a repartir 18 cuadernos de cuadrícula entre 3 estudiantes de forma equitativa. ¿Cuántos cuadernos le tocan a cada estudiante?'
      ];
    }

    evaluacionViernes[`${g}.° Primaria`] = {
      grado: `${g}.° Primaria`,
      gradoNumero: g,
      horario_evaluacion: '08:00 - 10:00 (120 min) | Aplicación del Test Individual',
      horario_receso: '10:00 - 10:30 (30 min) | RECESO ESCOLAR',
      horario_retroalimentacion: '10:30 - 12:00 (90 min) | Retroalimentación y Registro en Lista de Cotejo',
      indicador_a_evaluar: `Indicador ${cnb.indicador_numero}: ${cnb.indicador_descripcion}`,
      descripcion_test: testDesc,
      instrumento_evaluacion: 'Lista de Cotejo con 3 Criterios Observables de Desempeño',
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
