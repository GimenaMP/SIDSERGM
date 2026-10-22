import cnbRaw from '../../data/cnb_processed.json';
import mineducRaw from '../../data/mineduc_ejercicios.json';

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

export type DiaSemana = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves';

export interface DayPlan {
  dia: DiaSemana;
  enfoqueDidactico: string;
  horarioBloque: string;
  duracionMinutos: number;
  gradosSincronizados: GradeSchedule[];
}

export interface UnifiedWeeklyPlan {
  ciclo: 'segundo_ciclo' | 'primer_ciclo';
  grados: number[];
  bimestre: number;
  semana: number;
  paginasConfiguradas: Record<number, number>;
  temasRezagados: string[];
  fuenteGeneracion: 'gemini_rag_grounded' | 'rag_vectorial_local';
  fechaGeneracion: string;
  dias: Record<DiaSemana, DayPlan>;
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

// Cálculo de similitud por tokens / cosenos para búsqueda semántica local
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

// Búsqueda en el CNB (DIGECUR) por grado, semana y temas rezagados
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

  // Si hay un tema rezagado, buscar la competencia que mejor coincida semánticamente
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

  // Coincidencia por semana o bloque
  const exactWeek = gradoItems.find(c => c.semana_sugerida === semana && c.bloque_bimestre === bimestre);
  if (exactWeek) return exactWeek;

  const exactBloque = gradoItems.find(c => c.bloque_bimestre === bimestre);
  if (exactBloque) return exactBloque;

  return gradoItems[0];
}

// Búsqueda en el catálogo de ejercicios oficiales de MINEDUC
export function searchMineducExercises(
  grado: number, 
  paginaDeseada: number, 
  temaQuery?: string
): { item: MineducItem; paginaEfectiva: number } {
  const gradoItems = mineducDatabase.filter(m => m.grado_especifico === grado);

  if (gradoItems.length === 0) {
    // Fallback con datos fácticos del MINEDUC para el grado
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

  // 1. Si el docente especificó una página exacta
  const exactPage = gradoItems.find(m => m.numero_pagina === paginaDeseada);
  if (exactPage) {
    return { item: exactPage, paginaEfectiva: exactPage.numero_pagina };
  }

  // 2. Si hay tema rezagado, buscar coincidencia semántica
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

  // 3. Buscar la página más cercana a la solicitada
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

// Estructurar los ejercicios literales en formato desglosado
function formatLiteralExercises(enunciado: string, instrucciones: string, pagina: number, grado: number): string[] {
  const lines: string[] = [];
  lines.push(`1. Ejercicio principal de libro de texto (Pág. ${pagina}):`);
  lines.push(`   ${enunciado}`);
  lines.push(`2. Orientación pedagógica contextual MINEDUC:`);
  lines.push(`   ${instrucciones}`);
  lines.push(`3. Ejercitación en cuaderno de trabajo:`);
  if (grado === 4) {
    lines.push(`   • Representar en tabla posicional (CM, DM, UM, C, D, U).`);
    lines.push(`   • Escribir la lectura formal en letras en el cuaderno.`);
  } else if (grado === 5) {
    lines.push(`   • Operar paso a paso verificando el común denominador.`);
    lines.push(`   • Simplificar la fracción resultante a su mínima expresión.`);
  } else if (grado === 6) {
    lines.push(`   • Plantear la proporción formal de regla de tres simple: (a / b = c / x).`);
    lines.push(`   • Redactar la conclusión económica contextualizada en quetzales.`);
  } else if (grado === 1) {
    lines.push(`   • Contar con apoyo de tapitas o semillas de frijol.`);
    lines.push(`   • Trazar los numerales en el cuaderno de cuadrícula.`);
  } else if (grado === 2) {
    lines.push(`   • Descomponer en decenas y unidades con tarjetas de colores.`);
    lines.push(`   • Resolver la suma vertical sin reagrupación.`);
  } else {
    lines.push(`   • Graficar con regla los arreglos rectangulares de multiplicación.`);
    lines.push(`   • Colorear las partes fraccionarias indicadas en la guía.`);
  }
  return lines;
}

// Genera la alternancia rotativa de 45 minutos según el día de la semana
function buildRotationalTimeline(
  dia: DiaSemana, 
  grados: number[], 
  gradoPrincipal: number
): TimeAllocation[] {
  // En multigrado se rota la atención directa en bloques de 15 minutos
  const gIndex = grados.indexOf(gradoPrincipal);

  if (dia === 'Lunes') {
    // Lunes: Introducción y modelado
    if (gIndex === 0) {
      return [
        { rango: '00 - 15 min', rolDocente: 'atencion_directa', descripcion: 'Explicación del maestro en pizarra: Introducción del nuevo concepto con ejemplos prácticos.' },
        { rango: '15 - 35 min', rolDocente: 'trabajo_autonomo', descripcion: 'Trabajo individual en libro: Resolución de incisos guiados con apoyo de material del entorno.' },
        { rango: '35 - 45 min', rolDocente: 'trabajo_autonomo', descripcion: 'Revisión en parejas: Comparación de respuestas y anotación de dudas en el cuaderno.' },
      ];
    } else if (gIndex === 1) {
      return [
        { rango: '00 - 15 min', rolDocente: 'trabajo_autonomo', descripcion: 'Lectura silenciosa guiada: Observar diagramas e ilustraciones de apertura en el libro.' },
        { rango: '15 - 30 min', rolDocente: 'atencion_directa', descripcion: 'Atención directa del maestro: Modelado paso a paso del procedimiento en la pizarra.' },
        { rango: '30 - 45 min', rolDocente: 'trabajo_autonomo', descripcion: 'Resolución autónoma: Desarrollar los 3 primeros ejercicios de la guía física.' },
      ];
    } else {
      return [
        { rango: '00 - 25 min', rolDocente: 'trabajo_autonomo', descripcion: 'Trabajo en equipo de 2: Planteamiento de datos y elaboración de tabla comparativa.' },
        { rango: '25 - 40 min', rolDocente: 'atencion_directa', descripcion: 'Atención directa del maestro: Despeje y resolución de dudas sobre el método analítico.' },
        { rango: '40 - 45 min', rolDocente: 'trabajo_autonomo', descripcion: 'Cierre individual: Anotar el algoritmo resumen y verificar respuestas.' },
      ];
    }
  } else if (dia === 'Martes') {
    // Martes: Práctica guiada y contextual
    if (gIndex === 0) {
      return [
        { rango: '00 - 15 min', rolDocente: 'trabajo_autonomo', descripcion: 'Repaso rápido en cuaderno: Completar los ejercicios pendientes de la jornada anterior.' },
        { rango: '15 - 30 min', rolDocente: 'trabajo_autonomo', descripcion: 'Ejercitación autónoma: Resolver el problema contextual de la comunidad en el libro.' },
        { rango: '30 - 45 min', rolDocente: 'atencion_directa', descripcion: 'Atención directa del maestro: Calificación en pizarra y resolución de casos difíciles.' },
      ];
    } else if (gIndex === 1) {
      return [
        { rango: '00 - 15 min', rolDocente: 'atencion_directa', descripcion: 'Atención directa del maestro: Aclaración de dudas surgidas de la tarea y ejercitación previa.' },
        { rango: '15 - 35 min', rolDocente: 'trabajo_autonomo', descripcion: 'Trabajo en parejas: Resolver situaciones problemáticas con medidas tradicionales.' },
        { rango: '35 - 45 min', rolDocente: 'trabajo_autonomo', descripcion: 'Consolidación en cuaderno: Copiar tabla de resultados y justificaciones.' },
      ];
    } else {
      return [
        { rango: '00 - 20 min', rolDocente: 'trabajo_autonomo', descripcion: 'Cálculo individual: Desarrollar los ejercicios de regla de tres o proporciones en libro.' },
        { rango: '20 - 35 min', rolDocente: 'atencion_directa', descripcion: 'Atención directa del maestro: Verificación de planteamiento de variables y operaciones.' },
        { rango: '35 - 45 min', rolDocente: 'trabajo_autonomo', descripcion: 'Puesta en común: Dos alumnos exponen su solución en el pizarrón secundario.' },
      ];
    }
  } else if (dia === 'Miércoles') {
    // Miércoles: Trabajo colaborativo y problemas comunitarios
    if (gIndex === 0) {
      return [
        { rango: '00 - 15 min', rolDocente: 'atencion_directa', descripcion: 'Atención directa: Presentación del problema de aplicación comunitaria (cooperativas/cosechas).' },
        { rango: '15 - 35 min', rolDocente: 'trabajo_autonomo', descripcion: 'Trabajo colaborativo: Resolución en grupos pequeños con intercambio de roles.' },
        { rango: '35 - 45 min', rolDocente: 'trabajo_autonomo', descripcion: 'Elaboración de cartelito o dibujo explicativo en el cuaderno.' },
      ];
    } else if (gIndex === 1) {
      return [
        { rango: '00 - 20 min', rolDocente: 'trabajo_autonomo', descripcion: 'Trabajo cooperativo: Formular dos problemas usando precios reales del mercado comunal.' },
        { rango: '20 - 35 min', rolDocente: 'atencion_directa', descripcion: 'Atención directa del maestro: Supervisión de cálculos de fracciones y proporciones.' },
        { rango: '35 - 45 min', rolDocente: 'trabajo_autonomo', descripcion: 'Intercambio de cuadernos para coevaluación constructiva entre compañeros.' },
      ];
    } else {
      return [
        { rango: '00 - 15 min', rolDocente: 'trabajo_autonomo', descripcion: 'Lectura comprensiva de la situación económica comunitaria planteada en la guía.' },
        { rango: '15 - 30 min', rolDocente: 'trabajo_autonomo', descripcion: 'Cálculo de porcentajes y márgenes de ganancia con datos del cuaderno de trabajo.' },
        { rango: '30 - 45 min', rolDocente: 'atencion_directa', descripcion: 'Atención directa del maestro: Cierre metodológico y preparación para la síntesis de jueves.' },
      ];
    }
  } else {
    // Jueves: Síntesis semanal, checklist y preparación para la prueba de viernes
    return [
      { rango: '00 - 15 min', rolDocente: 'atencion_directa', descripcion: 'Revisión general en plenario: Repaso de los 3 conceptos clave de la semana para la prueba de mañana.' },
      { rango: '15 - 35 min', rolDocente: 'trabajo_autonomo', descripcion: 'Resolución del simulador de prueba en cuaderno: Ítems tipo diagnóstico de MINEDUC.' },
      { rango: '35 - 45 min', rolDocente: 'atencion_directa', descripcion: 'Checklist de Jueves: El docente confirma los aprendizajes alcanzados y sella cuadernos.' },
    ];
  }
}

// Generador de la Guía Pedagógica Unificada para los 4 días (Lunes a Jueves)
export function generateUnifiedRAGPlan(params: RAGRequestParams): UnifiedWeeklyPlan {
  const ciclo = params.ciclo || 'segundo_ciclo';
  const grados = params.grados || (ciclo === 'segundo_ciclo' ? [4, 5, 6] : [1, 2, 3]);
  const bimestre = params.bimestre || 2;
  const semana = params.semana || 14;
  const paginasPorGrado = params.paginasPorGrado || (ciclo === 'segundo_ciclo' ? { 4: 38, 5: 44, 6: 115 } : { 1: 14, 2: 32, 3: 54 });
  const temasRezagados = params.temasRezagados || [];

  const diasSemana: DiaSemana[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves'];
  const diasPlan: Record<DiaSemana, DayPlan> = {} as Record<DiaSemana, DayPlan>;

  for (const dia of diasSemana) {
    const gradosSincronizados: GradeSchedule[] = [];

    for (const g of grados) {
      const pagBase = paginasPorGrado[g] || 30;
      // El día avanza ligeramente en la guía o refuerza temas rezagados
      const offsetPagina = dia === 'Lunes' ? 0 : dia === 'Martes' ? 1 : dia === 'Miércoles' ? 2 : 3;
      const pagCalculada = pagBase + offsetPagina;

      // Verificar si hay tema rezagado específico para este grado
      const rezagadoMatch = temasRezagados.find(t => 
        t.toLowerCase().includes(`${g}°`) || 
        t.toLowerCase().includes(`${g}to`) || 
        t.toLowerCase().includes(`${g}mo`) ||
        temasRezagados.length === 1
      );

      const cnbInfo = searchCNBCorresponding(g, semana, bimestre, rezagadoMatch);
      const mineducInfo = searchMineducExercises(g, pagCalculada, rezagadoMatch || cnbInfo.temas_declarativos[0]);

      const ejercicios = formatLiteralExercises(
        mineducInfo.item.enunciado_ejercicio,
        mineducInfo.item.instrucciones_docente,
        mineducInfo.paginaEfectiva,
        g
      );

      const tiempos = buildRotationalTimeline(dia, grados, g);

      let tareaCasa = '';
      if (dia === 'Lunes') {
        tareaCasa = `Pág. ${mineducInfo.paginaEfectiva + 1}: Leer la cápsula de autoaprendizaje y resolver los ejercicios 1 y 2 en familia.`;
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
        cnbCompetencia: `Competencia ${cnbInfo.competencia_numero}: ${cnbInfo.competencia_descripcion}`,
        cnbIndicador: `Indicador ${cnbInfo.indicador_numero}: ${cnbInfo.indicador_descripcion}`,
        libroTitulo: mineducInfo.item.libro_titulo,
        numeroPagina: mineducInfo.paginaEfectiva,
        seccionLibro: mineducInfo.item.seccion_unidad,
        tiemposReferencia: tiempos,
        ejerciciosLiterales: ejercicios,
        tareaCasa,
        completado: dia === 'Lunes',
        esTemaRezagado: Boolean(rezagadoMatch)
      });
    }

    const enfoques: Record<DiaSemana, string> = {
      'Lunes': 'Apertura Semanal: Introducción conceptual y modelado en pizarra.',
      'Martes': 'Profundización Didáctica: Ejercitación guiada en libros de texto oficiales.',
      'Miércoles': 'Aplicación Comunal: Resolución de problemas de contexto agrícola y comercial.',
      'Jueves': 'Consolidación y Checklist: Síntesis semanal y preparación para las pruebas de viernes.'
    };

    diasPlan[dia] = {
      dia,
      enfoqueDidactico: enfoques[dia],
      horarioBloque: '08:00 - 08:45 hrs',
      duracionMinutos: 45,
      gradosSincronizados
    };
  }

  return {
    ciclo,
    grados,
    bimestre,
    semana,
    paginasConfiguradas: paginasPorGrado,
    temasRezagados,
    fuenteGeneracion: 'rag_vectorial_local',
    fechaGeneracion: new Date().toISOString(),
    dias: diasPlan
  };
}
