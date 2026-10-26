import cnbRaw from '../../data/cnb_processed.json';
import mineducRaw from '../../data/mineduc_ejercicios.json';
import { getCNBCorrespondingEntry, getMineducPageForGrade } from './cnbDosificacionCompleta';
import { 
  clusterTemaEjeTransversal, 
  pedagogicalDecisionTree, 
  recommendOptimalExercises,
  analizarRelacionTemasMismaMateria,
  ResultadoRelacionTemasMateria
} from './machineLearningPlanning';

export type DiaSemana = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves';

export interface TimeAllocation {
  rango: string;
  rolDocente: 'atencion_directa' | 'trabajo_autonomo';
  descripcion: string;
}

export interface SelectedItemParam {
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
}

export interface MateriaSeleccionadaDetalle {
  materia: string;
  tema: string;
  libroTitulo: string;
  unidad: number;
  paginaInicio: number;
  paginaFin: number;
  competencias: string[];
  indicadores: string[];
  ejerciciosLiterales: string[];
  temaEje?: string;
}

export interface GradeSchedule {
  grado: string;
  gradoNumero?: number;
  bloque: string;
  duracionTotal: string;
  materia: string;
  tema: string;
  modalidad?: 'Atención Directa Docente' | 'Trabajo Autónomo con Guía' | 'Trabajo Cooperativo / Práctica';
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
  paginaFin?: number;
  seccionLibro: string;
  tiemposReferencia: TimeAllocation[];
  ejerciciosLiterales: string[];
  tareaCasa: string;
  completado: boolean;
  esTemaRezagado?: boolean;
  materiasSeleccionadas?: MateriaSeleccionadaDetalle[];
}

export interface ComponentesAulaMultigrado {
  dialogo_saberes: string; // Activación contextualizada de presaberes con vivencias de la comunidad
  gobierno_escolar: string; // Rol de comisiones estudiantiles en autogestión y orden del aula
  rincones_aprendizaje: string; // Espacio físico y materiales didácticos concretos utilizados
  tutoria_entre_pares: string; // Interacción cooperativa donde estudiantes avanzados apoyan a menores
  biblioteca_escolar: string; // Uso de textos y lecturas de autoaprendizaje para indagación
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
  componentes_multigrado?: ComponentesAulaMultigrado;
  temaEjePeriodo1?: string;
  temaEjePeriodo2?: string;
  temaEjePeriodo3?: string;
  temaEjePeriodo4?: string;
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

export interface SimilarCompetency {
  area: string;
  eje_comun: string;
  grados_articulacion?: string;
  gradoA_enfoque?: string;
  gradoB_enfoque?: string;
}

export interface CurricularOverviewItem {
  grado: number;
  gradoLabel: string;
  materia: string;
  competenciaNumero: number;
  competenciaTexto: string;
  indicadorNumero: string;
  indicadorTexto: string;
  temas: string[];
  libroReferencia: string;
  paginaReferencia: number;
}

export interface UnifiedWeeklyPlan {
  ciclo: 'segundo_ciclo' | 'primer_ciclo';
  grados: number[];
  bimestre: number;
  semana: number;
  area_curricular: string;
  tema_generador_comun: string;
  categoria_conceptual?: string;
  proposito_comun?: string;
  descripcion_eje_integrador: string;
  actividades_lenguaje?: {
    expresion_oral: string;
    escritura: string;
    lectura: string;
  };
  materiales_didacticos?: string[];
  pilares_multigrado_cnb?: ComponentesAulaMultigrado;
  competencias_similares_identificadas?: SimilarCompetency[];
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
  bloque?: number;
  semana?: number;
  area?: string;
  area_curricular?: string;
  paginasPorGrado?: Record<number, number>;
  temasRezagados?: string[];
  diaSeleccionado?: DiaSemana;
  items?: SelectedItemParam[];
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

// Calculo automatico y continuo de pagina oficial del libro MINEDUC segun Bloque (1-4) y Semana (1-9)
export function getDefaultPageForGrade(grado: number, bimestre: number, semana: number, materia?: string): number {
  return getMineducPageForGrade(grado, bimestre, semana, materia);
}

// Búsqueda curricular en el CNB (DIGECUR) con soporte de Área Curricular 100% dosificada por semana y bloque
export function searchCNBCorresponding(
  grado: number, 
  semana: number, 
  bimestre: number, 
  temaRezagado?: string,
  areaMateria?: string
): CNBItem {
  const b = Math.min(Math.max(bimestre || 1, 1), 4);
  const s = Math.min(Math.max(semana || 1, 1), 9);
  const entry = getCNBCorrespondingEntry(grado, b, s, areaMateria || 'Matemáticas');

  return {
    grado: entry.grado,
    ciclo: entry.ciclo,
    area_materia: entry.area_materia,
    bloque_bimestre: entry.bloque_bimestre,
    semana_sugerida: entry.semana_sugerida,
    competencia_numero: entry.competencia_numero,
    competencia_descripcion: entry.competencia_descripcion,
    indicador_numero: entry.indicador_numero,
    indicador_descripcion: entry.indicador_descripcion,
    temas_declarativos: entry.temas_declarativos,
    criterios_evaluacion: entry.criterios_evaluacion
  };
}

// Función Oficial para obtener la carga de temas y competencias del CNB para la semana seleccionada
// correspondiente a los grados que el docente seleccionó (1 solo grado, varios, o todos)
export function getWeeklyCurricularOverview(
  grados: number[],
  bloque: number,
  semana: number,
  areaFiltro?: string
): CurricularOverviewItem[] {
  const gradosFiltrados = (grados && grados.length > 0) ? [...grados].sort((a, b) => a - b) : [1, 2, 3, 4, 5, 6];
  const items: CurricularOverviewItem[] = [];

  const todasMaterias = [
    'Matemáticas',
    'Comunicación y Lenguaje',
    'Medio Social y Natural', // o Ciencias Naturales
    'Formación Ciudadana' // o Ciencias Sociales
  ];

  for (const g of gradosFiltrados) {
    const materiasGrado = todasMaterias.map(m => {
      if (m === 'Medio Social y Natural' && g >= 4) return 'Ciencias Naturales y Tecnología';
      if (m === 'Formación Ciudadana' && g >= 4) return 'Ciencias Sociales y Formación Ciudadana';
      return m;
    });

    const materiasToProcess = (areaFiltro && !areaFiltro.toLowerCase().includes('todas') && !areaFiltro.toLowerCase().includes('integral'))
      ? materiasGrado.filter(m => m.toLowerCase().includes(areaFiltro.toLowerCase()) || areaFiltro.toLowerCase().includes(m.toLowerCase()))
      : materiasGrado;

    for (const mat of materiasToProcess) {
      const cnbInfo = searchCNBCorresponding(g, semana, bloque, undefined, mat);
      const pag = getDefaultPageForGrade(g, bloque, semana);
      const mineduc = searchMineducExercises(g, pag, cnbInfo.temas_declarativos[0], mat);

      items.push({
        grado: g,
        gradoLabel: `${g}.° Primaria`,
        materia: mat,
        competenciaNumero: cnbInfo.competencia_numero,
        competenciaTexto: cnbInfo.competencia_descripcion,
        indicadorNumero: cnbInfo.indicador_numero,
        indicadorTexto: cnbInfo.indicador_descripcion,
        temas: cnbInfo.temas_declarativos,
        libroReferencia: mineduc.item.libro_titulo,
        paginaReferencia: mineduc.paginaEfectiva
      });
    }
  }

  return items;
}

// Búsqueda de ejercicios oficiales MINEDUC por materia y número de página
export function searchMineducExercises(
  grado: number, 
  paginaDeseada: number, 
  temaQuery?: string,
  materia?: string
): { item: MineducItem; paginaEfectiva: number } {
  let gradoItems = mineducDatabase.filter(m => m.grado_especifico === grado);

  if (materia && materia.trim().length > 0) {
    const matLower = materia.toLowerCase();
    const filtered = gradoItems.filter(m => {
      const itemMat = m.materia.toLowerCase();
      if (matLower.includes('social') || matLower.includes('ciudad')) {
        return itemMat.includes('social') || itemMat.includes('ciudad');
      }
      if (matLower.includes('ciencia') || matLower.includes('medio') || matLower.includes('natural')) {
        return itemMat.includes('ciencia') || itemMat.includes('medio') || itemMat.includes('natural');
      }
      if (matLower.includes('lengua') || matLower.includes('comunic')) {
        return itemMat.includes('lengua') || itemMat.includes('comunic');
      }
      if (matLower.includes('mate')) {
        return itemMat.includes('mate');
      }
      return itemMat.includes(matLower);
    });
    if (filtered.length > 0) {
      gradoItems = filtered;
    }
  }

  if (gradoItems.length === 0) {
    return {
      item: {
        libro_titulo: `${materia || 'Matemáticas'} ${grado}G — MINEDUC (Edición Oficial)`,
        grado_especifico: grado,
        ciclo: grado <= 3 ? 'primer_ciclo' : 'segundo_ciclo',
        materia: materia || 'Matemáticas',
        numero_pagina: paginaDeseada || 30,
        seccion_unidad: `Unidad de Aprendizaje — Grado ${grado}°`,
        tipo_recurso: 'ejercicio_estudiante',
        enunciado_ejercicio: `Resolver los ejercicios de ejercitación y cálculo de la página ${paginaDeseada || 30}.`,
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


// Búsqueda y extracción inteligente de ejercicios e instrucciones literales en libros MINEDUC
export function findExercisesInMineduc(
  grado: number,
  materia: string,
  pagInicio: number,
  pagFin: number,
  tema?: string,
  dia?: DiaSemana
): string[] {
  const matLower = materia.toLowerCase();
  const isSoc = matLower.includes('social') || matLower.includes('ciudad') || matLower.includes('historia') || matLower.includes('geograf');
  const isNat = (matLower.includes('ciencia') || matLower.includes('natural') || matLower.includes('medio')) && !isSoc;
  const isMate = matLower.includes('mate');
  const isLeng = matLower.includes('lengua') || matLower.includes('comunic');

  const matches = mineducDatabase.filter(m => {
    const gMatch = m.grado_especifico === grado;
    const pMatch = m.numero_pagina >= pagInicio && m.numero_pagina <= pagFin;
    if (!gMatch || !pMatch) return false;
    const itemMat = (m.materia || '').toLowerCase();
    if (isSoc) return itemMat.includes('social') || itemMat.includes('ciudad') || itemMat.includes('historia') || itemMat.includes('cs');
    if (isNat) return (itemMat.includes('ciencia') || itemMat.includes('natural') || itemMat.includes('medio')) && !itemMat.includes('social');
    if (isLeng) return itemMat.includes('lengua') || itemMat.includes('comunic');
    if (isMate) return itemMat.includes('mate');
    return true;
  });

  const list: string[] = [];

  if (matches.length > 0) {
    for (const m of matches) {
      if (!m.enunciado_ejercicio || m.enunciado_ejercicio.trim().length <= 15) continue;
      const raw = m.enunciado_ejercicio.replace(/\s+/g, ' ').trim();

      // Filtrar mensajes institucionales
      if (/estimado|autoridad|editorial|ministr|índice|tabla de contenido|carta al docente|presentación|créditos|himno|guatemala feliz/i.test(raw)) {
        continue;
      }
      if (m.numero_pagina < 8 && /bienvenido|saludo|guatemala|cuadernillo|gratuita/i.test(raw)) {
        continue;
      }

      let cleanText = raw;
      cleanText = cleanText.replace(/^(?:\d+\s+)?(?:Ciencias|Matemáticas|Comunicación|Medio|Formación|Vivamos)[^.]*?\.\s*/i, '');
      cleanText = cleanText.replace(/Autoridades Ministeriales[\s\S]*/i, '');
      cleanText = cleanText.replace(/^(?:¿Cómo es mi libro\?|Competencias y estándares)[^.]*?\.\s*/i, '');

      // 1. Detección de sección "Organizo" / "Nos organizamos" / "Organizamos"
      const organizoMatch = cleanText.match(/(?:Organizo|Organizamos|Nos organizamos)\s*[:\.]?\s*([^%\n]{15,350})/i);
      if (organizoMatch) {
        list.push(`Pág. ${m.numero_pagina} (Organizo): ${organizoMatch[1].trim()}`);
        continue;
      }

      // 2. Detección de sección "Instrucciones" / "Actividades" / "Aplico" / "En mi cuaderno"
      const instrucMatch = cleanText.match(/(?:Instrucciones|Instrucción|Actividades|Aplico lo aprendido|En mi cuaderno|Copiamos en el cuaderno)\s*[:\.]?\s*([^%\n]{15,350})/i);
      if (instrucMatch) {
        list.push(`Pág. ${m.numero_pagina} (Instrucciones): ${instrucMatch[0].trim()}`);
        continue;
      }

      // 3. Detección de preguntas problematizadoras directas del libro (¿...?)
      const questions = cleanText.match(/¿[^?]{10,250}\?/g);
      if (questions && questions.length > 0) {
        list.push(`Pág. ${m.numero_pagina} (Preguntas del libro oficial): ${questions.slice(0, 2).join(' ')}`);
        continue;
      }

      // 4. Detección de viñetas con tareas o contenidos (• ...)
      const bullets = cleanText.match(/•\s*[^•\n]{15,250}/g);
      if (bullets && bullets.length > 0) {
        list.push(`Pág. ${m.numero_pagina} (Actividades del libro): ${bullets.slice(0, 2).map(b => b.trim()).join(' | ')}`);
        continue;
      }

      // 5. Detección de ejercicios numerados (1. ... 2. ...)
      const numbered = cleanText.match(/\b\d+\.\s*[^0-9\n]{15,250}/g);
      if (numbered && numbered.length > 0) {
        list.push(`Pág. ${m.numero_pagina} (Ejercicios del libro): ${numbered.slice(0, 2).map(n => n.trim()).join(' | ')}`);
        continue;
      }

      // 6. Si la página es conceptual: Extraer el contenido literal exacto del libro oficial
      if (cleanText.length > 25) {
        const excerpt = cleanText.slice(0, 200).trim();
        const esSesion1 = (isNat && (dia === 'Lunes' || !dia)) || 
                          (isSoc && (dia === 'Martes' || !dia)) || 
                          (!isNat && !isSoc && (dia === 'Lunes' || dia === 'Martes' || !dia));

        if (esSesion1) {
          list.push(`Pág. ${m.numero_pagina} (Contenido oficial MINEDUC): "${excerpt}...". El docente modela estos conceptos en pizarra con preguntas generadoras.`);
        } else {
          list.push(`Pág. ${m.numero_pagina} (Aplicación en cuaderno): "${excerpt}...". Los estudiantes leen el libro oficial y elaboran un organizador gráfico en su cuaderno.`);
        }
        continue;
      }
    }

    if (list.length > 0) return list;
  }

  // Fallback didáctico riguroso si no se encontraron páginas físicas en BD
  const pInicioEfectiva = pagInicio < 8 ? 8 : pagInicio;
  const esSesion1 = (isNat && (dia === 'Lunes' || !dia)) || (isSoc && (dia === 'Martes' || !dia));
  if (esSesion1) {
    return [
      `Pág. ${pInicioEfectiva}: Sesión 1 (Explicación Docente): Modelado y explicación de conceptos clave en la pizarra sobre "${tema || materia}".`,
      `Pág. ${pInicioEfectiva}: Lectura compartida en el libro oficial MINEDUC y resolución de preguntas exploratorias.`
    ];
  } else {
    return [
      `Pág. ${pInicioEfectiva}: Sesión 2 (Aplicación en Cuaderno): Lectura analítica individual de "${tema || materia}".`,
      `Pág. ${pInicioEfectiva}: Extracción de las 3 ideas principales en el cuaderno y elaboración de un organizador gráfico (mapa conceptual o cuadro comparativo).`
    ];
  }
}

// Estructurar enunciados literales del libro MINEDUC
function formatLiteralExercises(
  enunciado: string, 
  instrucciones: string, 
  pagina: number, 
  grado: number,
  materia?: string,
  tema?: string
): string[] {
  const lines: string[] = [];
  lines.push(`1. Ejercicio principal del libro oficial (Pág. ${pagina}):`);
  lines.push(`   ${enunciado}`);
  lines.push(`2. Orientación pedagógica contextual MINEDUC:`);
  lines.push(`   ${instrucciones}`);
  lines.push(`3. Ejercitación guiada en cuaderno de trabajo:`);

  const matLower = (materia || '').toLowerCase();
  if (matLower.includes('lengua') || matLower.includes('comunic')) {
    lines.push(`   • Realizar la lectura atenta de la página ${pagina} y subrayar las ideas clave.`);
    lines.push(`   • Redactar la actividad en el cuaderno cuidando concordancia, ortografía y signos de puntuación.`);
  } else if (matLower.includes('social') || matLower.includes('ciudad')) {
    lines.push(`   • Analizar el mapa, hecho histórico o situación de convivencia comunitaria.`);
    lines.push(`   • Registrar los compromisos cívicos y conclusiones en el cuaderno.`);
  } else if (matLower.includes('ciencia') || matLower.includes('medio')) {
    lines.push(`   • Dibujar el esquema o registrar las observaciones del entorno en el cuaderno.`);
    lines.push(`   • Redactar una breve explicación sobre la conservación de recursos y la salud.`);
  } else {
    // Matemáticas
    if (grado === 4) {
      lines.push(`   • Descomponer los números o cantidades del problema según la tabla posicional (CM, DM, UM, C, D, U).`);
      lines.push(`   • Escribir con letra y número las cantidades en el cuaderno.`);
    } else if (grado === 5) {
      lines.push(`   • Operar paso a paso verificando el procedimiento matemático formal.`);
      lines.push(`   • Simplificar o justificar el resultado obtenido.`);
    } else if (grado === 6) {
      lines.push(`   • Plantear la relación proporcional o fórmula correspondiente al problema.`);
      lines.push(`   • Redactar la conclusión y respuesta final contextualizada en Quetzales o unidades de medida.`);
    } else if (grado === 1) {
      lines.push(`   • Contar con apoyo de tapitas, botones o semillas de frijol.`);
      lines.push(`   • Trazar los numerales y colorear los elementos en cuadrícula.`);
    } else if (grado === 2) {
      lines.push(`   • Descomponer en decenas y unidades con tarjetas o material didáctico.`);
      lines.push(`   • Resolver las operaciones de forma ordenada en el cuaderno.`);
    } else {
      lines.push(`   • Graficar con regla los arreglos o planteamientos de la lección.`);
      lines.push(`   • Resolver los incisos y comprobar el cálculo.`);
    }
  }
  return lines;
}

// Alternancia rotativa estructurada (Jornada 08:00 a 12:00 - 210 min efectivos)

// ============================================================================
// HELPER PARA OBTENER EL SUBTEMA Y PÁGINA ESPECÍFICA POR DÍA DE LA SEMANA
// ============================================================================
export function getSubtemaForDay(
  dia: DiaSemana,
  mainItem: SelectedItemParam
): { titulo: string; pagina: number } {
  const pInicio = mainItem.paginaInicio || 8;

  if (mainItem.temasSeleccionados && mainItem.temasSeleccionados.length > 0) {
    const list = mainItem.temasSeleccionados;
    const mLower = (mainItem.materia || '').toLowerCase();
    const isCienciasSociales = mLower.includes('social') || mLower.includes('ciudad') || mLower.includes('historia');
    const isCienciasNaturales = (mLower.includes('natural') || mLower.includes('ciencia')) && !isCienciasSociales;
    
    // CASO 1: 4 o más subtemas (1 subtema y 1 página física real exclusiva para cada día)
    if (list.length >= 4) {
      const idx = dia === 'Lunes' ? 0 : dia === 'Martes' ? 1 : dia === 'Miércoles' ? 2 : 3;
      const item = list[idx] || list[list.length - 1];
      return { titulo: item.titulo, pagina: item.paginaInicio };
    }

    // CASO 2: 3 subtemas (Lunes, Martes, Miércoles con subtema propio; Jueves con página consecutiva de síntesis)
    if (list.length === 3) {
      if (dia === 'Lunes') return { titulo: list[0].titulo, pagina: list[0].paginaInicio };
      if (dia === 'Martes') return { titulo: list[1].titulo, pagina: list[1].paginaInicio };
      if (dia === 'Miércoles') return { titulo: list[2].titulo, pagina: list[2].paginaInicio };
      const pagJueves = list[2].paginaFin > list[2].paginaInicio ? list[2].paginaFin : (list[2].paginaInicio + 1);
      return { titulo: `${list[2].titulo} (Consolidación y Síntesis)`, pagina: pagJueves };
    }

    // CASO 3: 2 subtemas (Cuota oficial CNB para Ciencias Naturales y Ciencias Sociales)
    if (list.length === 2) {
      if (isCienciasSociales) {
        // Ciencias Sociales se imparte los Martes (Sesión 1) y Jueves (Sesión 2)
        if (dia === 'Lunes' || dia === 'Martes') {
          return { titulo: `${list[0].titulo} · Sesión 1: Análisis y Fuentes`, pagina: list[0].paginaInicio };
        } else {
          return { titulo: `${list[1].titulo} · Sesión 2: Síntesis y Cuaderno`, pagina: list[1].paginaInicio };
        }
      }

      if (isCienciasNaturales) {
        // Ciencias Naturales se imparte los Lunes (Sesión 1) y Miércoles (Sesión 2)
        if (dia === 'Lunes' || dia === 'Martes') {
          return { titulo: `${list[0].titulo} · Sesión 1: Exploración y Observación`, pagina: list[0].paginaInicio };
        } else {
          return { titulo: `${list[1].titulo} · Sesión 2: Experimentación y Cuaderno`, pagina: list[1].paginaInicio };
        }
      }

      // Caso general para 2 subtemas
      if (dia === 'Lunes') {
        return { titulo: `${list[0].titulo} (Saberes Previos y Modelado)`, pagina: list[0].paginaInicio };
      }
      if (dia === 'Martes') {
        const pagM = list[0].paginaFin > list[0].paginaInicio ? list[0].paginaFin : (list[0].paginaInicio + 1);
        return { titulo: `${list[0].titulo} (Comprensión y Algoritmo)`, pagina: pagM };
      }
      if (dia === 'Miércoles') {
        return { titulo: `${list[1].titulo} (Práctica Autónoma)`, pagina: list[1].paginaInicio };
      }
      if (dia === 'Jueves') {
        const pagJ = list[1].paginaFin > list[1].paginaInicio ? list[1].paginaFin : (list[1].paginaInicio + 1);
        return { titulo: `${list[1].titulo} (Consolidación y Repaso)`, pagina: pagJ };
      }
    }

    // CASO 4: 1 subtema seleccionado
    const t = list[0];
    const baseP = t.paginaInicio || pInicio;

    if (isCienciasSociales) {
      if (dia === 'Lunes' || dia === 'Martes') {
        return { titulo: `${t.titulo} · Sesión 1: Análisis y Fuentes`, pagina: baseP };
      } else {
        const pag2 = t.paginaFin > baseP ? t.paginaFin : (baseP + 1);
        return { titulo: `${t.titulo} · Sesión 2: Síntesis y Cuaderno`, pagina: pag2 };
      }
    }

    if (isCienciasNaturales) {
      if (dia === 'Lunes' || dia === 'Martes') {
        return { titulo: `${t.titulo} · Sesión 1: Exploración y Observación`, pagina: baseP };
      } else {
        const pag2 = t.paginaFin > baseP ? t.paginaFin : (baseP + 1);
        return { titulo: `${t.titulo} · Sesión 2: Experimentación y Cuaderno`, pagina: pag2 };
      }
    }

    const offset = dia === 'Lunes' ? 0 : dia === 'Martes' ? 1 : dia === 'Miércoles' ? 2 : 3;
    const pagFinal = baseP + offset;
    const fases: Record<DiaSemana, string> = {
      'Lunes': 'Sesión 1: Exploración y Saberes Previos',
      'Martes': 'Sesión 2: Modelado y Algoritmo',
      'Miércoles': 'Sesión 3: Práctica Autónoma Intensiva',
      'Jueves': 'Sesión 4: Consolidación y Síntesis'
    };
    return {
      titulo: `${t.titulo.replace(/\s*\(Pág\..*?\)/i, '')} · ${fases[dia]} (Pág. ${pagFinal})`,
      pagina: pagFinal
    };
  }

  // Fallback si no hay array de temasSeleccionados
  const offset = dia === 'Lunes' ? 0 : dia === 'Martes' ? 1 : dia === 'Miércoles' ? 2 : 3;
  const pag = pInicio + offset;
  const fases: Record<DiaSemana, string> = {
    'Lunes': 'Sesión 1: Exploración y Modelado',
    'Martes': 'Sesión 2: Comprensión y Algoritmo',
    'Miércoles': 'Sesión 3: Práctica en Cuaderno',
    'Jueves': 'Sesión 4: Consolidación y Síntesis'
  };
  return {
    titulo: `${mainItem.tema || 'Contenido Curricular'} · ${fases[dia]} (Pág. ${pag})`,
    pagina: pag
  };
}


function getTemaEjeParaMateria(matItem: MateriaSeleccionadaDetalle): string | undefined {
  if (matItem.temaEje && matItem.temaEje.length > 3) {
    return matItem.temaEje;
  }
  return undefined;
}

export function buildRotationalTimeline(
  dia: DiaSemana, 
  grados: number[], 
  gradoPrincipal: number,
  materia: string = 'Matemáticas',
  tema: string = 'Contenido CNB',
  paginaDia: number = 8,
  ejerciciosDia: string[] = [],
  materiaSecundaria?: string,
  temaSecundario?: string,
  paginaDiaSecundaria?: number,
  ejerciciosDiaSecundarios?: string[],
  todasLasMateriasG?: MateriaSeleccionadaDetalle[]
): { 
  tiempos: TimeAllocation[]; 
  modalidad: 'Atención Directa Docente' | 'Trabajo Autónomo con Guía' | 'Trabajo Cooperativo / Práctica'; 
  actividadDocente: string; 
  actividadEstudiante: string;
  periodo1_actividad: string;
  periodo2_actividad: string;
  periodo3_actividad: string;
  periodo4_actividad: string;
  materiasEfectivasDelDia: MateriaSeleccionadaDetalle[];
  temaEjePeriodo1?: string;
  temaEjePeriodo2?: string;
  temaEjePeriodo3?: string;
  temaEjePeriodo4?: string;
} {
  const gIndex = grados.indexOf(gradoPrincipal);
  const isMonogrado = (grados.length === 1);

  // Normalizar lista completa de materias seleccionadas para este grado
  const matList: MateriaSeleccionadaDetalle[] = (todasLasMateriasG && todasLasMateriasG.length > 0)
    ? todasLasMateriasG
    : [
        {
          materia,
          tema,
          libroTitulo: 'Libro Oficial MINEDUC',
          unidad: 1,
          paginaInicio: paginaDia,
          paginaFin: paginaDia,
          competencias: [],
          indicadores: [],
          ejerciciosLiterales: ejerciciosDia
        },
        ...(materiaSecundaria ? [{
          materia: materiaSecundaria,
          tema: temaSecundario || 'Tema Integrado',
          libroTitulo: 'Libro Oficial MINEDUC',
          unidad: 1,
          paginaInicio: paginaDiaSecundaria || paginaDia,
          paginaFin: paginaDiaSecundaria || paginaDia,
          competencias: [],
          indicadores: [],
          ejerciciosLiterales: ejerciciosDiaSecundarios || []
        }] : [])
      ];

  // Identificación curricular de asignaturas según estructura y peso del CNB
  const matMate = matList.find(m => m.materia.toLowerCase().includes('matemát'));
  const matLeng = matList.find(m => m.materia.toLowerCase().includes('comunic') || m.materia.toLowerCase().includes('lengua'));
  const matNat = matList.find(m => (m.materia.toLowerCase().includes('natural') || m.materia.toLowerCase().includes('ciencia')) && !m.materia.toLowerCase().includes('social'));
  const matSoc = matList.find(m => m.materia.toLowerCase().includes('social') || m.materia.toLowerCase().includes('ciudad') || m.materia.toLowerCase().includes('historia'));
  const matMedio = matList.find(m => m.materia.toLowerCase().includes('medio'));

  // 1. Asignación pedagógica oficial de los 4 períodos de clase
  // Período 1 (08:15 - 09:05): Troncal Matemáticas (5 períodos semanales = diaria)
  const matP1: MateriaSeleccionadaDetalle = matMate || matList[0];

  // Período 2 (09:05 - 09:55): Troncal Comunicación y Lenguaje L1 (5 períodos semanales = diaria)
  const matP2: MateriaSeleccionadaDetalle = matLeng || (matList.length > 1 ? matList[1] : matList[0]);

  // Período 3 (10:30 - 11:15 · 45 min): Bloque Formativo Integrado
  // CNB: Ciencias Naturales y Ciencias Sociales tienen 2-3 períodos semanales cada una.
  // Distribución lógica oficial:
  // - Lunes y Miércoles -> Ciencias Naturales y Tecnología (Sesión 1 y Sesión 2)
  // - Martes y Jueves -> Ciencias Sociales (Sesión 1 y Sesión 2)
  let matP3: MateriaSeleccionadaDetalle;
  if (matNat && matSoc) {
    matP3 = (dia === 'Lunes' || dia === 'Miércoles') ? matNat : matSoc;
  } else if (matNat) {
    matP3 = matNat;
  } else if (matSoc) {
    matP3 = matSoc;
  } else if (matMedio) {
    matP3 = matMedio;
  } else {
    matP3 = matList[2] || matList[0];
  }

  // Período 4 (11:15 - 11:50 · 35 min): Áreas Complementarias del CNB / Rincones de Aprendizaje / Tutoría
  // Bloque formativo de 35 minutos según dosificación oficial del CNB
  const compAreaNombre = dia === 'Lunes' ? 'Expresión Artística' :
                         dia === 'Martes' ? 'Productividad y Desarrollo' :
                         dia === 'Miércoles' ? 'Expresión Artística y Visual' :
                         'Formación Ciudadana y Tutoría';
  const compTemaNombre = dia === 'Lunes' ? 'Educación Musical y Artes Visuales' :
                         dia === 'Martes' ? 'Huerto Escolar y Hábitos Productivos' :
                         dia === 'Miércoles' ? 'Artes Plásticas y Rincones Creativos' :
                         'Cultura de Paz y Tutoría entre Pares';
  const compPagina = 10 + (dia === 'Lunes' ? 1 : dia === 'Martes' ? 2 : dia === 'Miércoles' ? 3 : 4);

  const matCompUsuario = matList.find(m => 
    m !== matP1 && m !== matP2 && m !== matP3 &&
    (m.materia.toLowerCase().includes('artíst') || 
     m.materia.toLowerCase().includes('productiv') || 
     m.materia.toLowerCase().includes('física') ||
     m.materia.toLowerCase().includes('ciudad'))
  );

  const matP4: MateriaSeleccionadaDetalle = matCompUsuario || {
    materia: compAreaNombre,
    tema: compTemaNombre,
    libroTitulo: 'Guía Curricular CNB · DIGECUR',
    unidad: 1,
    paginaInicio: compPagina,
    paginaFin: compPagina,
    competencias: ['Aplica principios creativos y formativos del CNB'],
    indicadores: ['Desarrolla habilidades motrices, estéticas y comunitarias'],
    ejerciciosLiterales: [`Taller práctico de ${compAreaNombre}: Trabajo en rincones de aprendizaje y cuaderno.`]
  };

  // Asignación de Tema Eje Transversal específico por materia y grado
  matP1.temaEje = getTemaEjeParaMateria(matP1);
  matP2.temaEje = getTemaEjeParaMateria(matP2);
  matP3.temaEje = getTemaEjeParaMateria(matP3);
  matP4.temaEje = getTemaEjeParaMateria(matP4);

  const materiasEfectivasDelDia: MateriaSeleccionadaDetalle[] = [matP1, matP2, matP3, matP4];

  // Helper para generar descripción didáctica por materia, fase y rol
  const getAct = (
    matItem: MateriaSeleccionadaDetalle,
    fase: 'apertura' | 'ejercitacion' | 'indagacion' | 'consolidacion',
    esDirecta: boolean
  ) => {
    const mLower = matItem.materia.toLowerCase();
    const pag = matItem.paginaInicio;
    const t = matItem.tema.replace(/\(Pág\..*?\)/g, '').trim();
    const ej = (matItem.ejerciciosLiterales && matItem.ejerciciosLiterales[0])
      ? matItem.ejerciciosLiterales[0].slice(0, 180)
      : '';

    if (mLower.includes('lengua') || mLower.includes('comunic')) {
      if (fase === 'apertura') {
        return esDirecta
          ? `Modelado comprensivo en pizarra (Pág. ${pag} · ${t}): El docente guía la lectura en voz alta ${ej ? `[${ej}]` : ''}, modela la pronunciación y activa preguntas generadoras.`
          : `Trabajo Autónomo en Cuaderno (Pág. ${pag} · ${t}): ${ej ? `Lectura atenta y resolución de: ${ej}.` : 'Lectura silenciosa del texto oficial MINEDUC y subrayado de ideas centrales en el cuaderno.'}`;
      } else if (fase === 'ejercitacion') {
        return esDirecta
          ? `Taller lingüístico y redacción en pizarra (Pág. ${pag} · ${t}): Modelado sintáctico y de vocabulario a partir de ${ej ? `[${ej}]` : 'la lección del libro oficial'}.`
          : `Ejercitación en cuaderno (Pág. ${pag} · ${t}): ${ej ? `Resolución de: ${ej}.` : 'Resolución de ejercicios gramaticales del libro MINEDUC y producción de oraciones en cuaderno.'}`;
      } else if (fase === 'indagacion') {
        return esDirecta
          ? `Comunicación dialógica y tradición oral (Pág. ${pag} · ${t}): Análisis colectivo de relatos comunitarios relacionados con ${ej || t}.`
          : `Círculo de lectura creativa (Pág. ${pag}): ${ej ? `Aplicación de: ${ej}.` : 'Redacción de relatos breves en parejas para fortalecer la fluidez lectora.'}`;
      } else {
        return esDirecta
          ? `Consolidación lingüística (Pág. ${pag} · ${t}): Verificación de respuestas en pizarra sobre ${ej || t} y aclaración de dudas.`
          : `Comprobación en cuaderno (Pág. ${pag}): ${ej ? `Síntesis final de: ${ej}.` : 'Autoevaluación en el libro oficial MINEDUC y fijación de reglas ortográficas en cuaderno.'}`;
      }
    } else if (mLower.includes('social') || mLower.includes('ciudad') || mLower.includes('historia') || mLower.includes('geograf')) {
      if (fase === 'apertura') {
        return esDirecta
          ? `Introducción y análisis histórico-geográfico (Pág. ${pag} · "${t}"): El docente activa conocimientos previos, explica en la pizarra ${ej ? `[${ej}]` : `el tema "${t}"`} y guía la observación de fuentes e ilustraciones del texto oficial.`
          : `Lectura analítica en cuaderno (Pág. ${pag} · "${t}"): ${ej ? `Lectura del texto oficial y respuesta a: ${ej}.` : 'Lectura silenciosa del texto oficial MINEDUC e identificación de conceptos clave en el cuaderno.'}`;
      } else if (fase === 'ejercitacion') {
        return esDirecta
          ? `Análisis guiado de causas y consecuencias (Pág. ${pag} · "${t}"): Explicación de hechos históricos o geográficos en pizarra a partir de ${ej ? `[${ej}]` : `la lección`} y discusión grupal.`
          : `Trabajo en cuaderno y libro oficial (Pág. ${pag} · "${t}"): ${ej ? `Resolución guiada de: ${ej}.` : 'Resolución de incisos de análisis del libro MINEDUC y redacción de conclusiones en el cuaderno.'}`;
      } else if (fase === 'indagacion') {
        return esDirecta
          ? `Estudio de casos y aplicación comunitaria (Pág. ${pag} · "${t}"): Vinculación de ${ej || t} con la historia y convivencia comunitaria de Guatemala.`
          : `Taller de investigación cívica (Pág. ${pag} · "${t}"): ${ej ? `Trabajo en parejas resolviendo: ${ej}.` : 'Resolución de preguntas problematizadoras del texto oficial en el cuaderno.'}`;
      } else {
        return esDirecta
          ? `Síntesis cívico-social y debate formativo (Pág. ${pag} · "${t}"): Plenaria de conclusiones semanales sobre ${ej || t} y verificación de aprendizajes clave.`
          : `Comprobación y síntesis (Pág. ${pag} · "${t}"): ${ej ? `Resolución final de: ${ej}.` : 'Resolución de actividades de síntesis del libro oficial MINEDUC en cuaderno.'}`;
      }
    } else if (mLower.includes('ciencia') || mLower.includes('medio') || mLower.includes('natural')) {
      if (fase === 'apertura') {
        return esDirecta
          ? `Modelado científico en pizarra (Pág. ${pag} · ${t}): El docente explica los conceptos del libro oficial ${ej ? `[${ej}]` : ''} mediante esquemas y preguntas generadoras.`
          : `Trabajo Autónomo en Cuaderno (Pág. ${pag} · ${t}): Lectura comprensiva del libro oficial MINEDUC. ${ej ? `Desarrollo de: ${ej}.` : 'Identificación de conceptos y dibujo del esquema en cuaderno.'}`;
      } else if (fase === 'ejercitacion') {
        return esDirecta
          ? `Profundización de procesos científicos (Pág. ${pag} · ${t}): Análisis de relaciones causa-efecto basado en el libro oficial ${ej ? `(${ej})` : ''} y modelado de respuestas en pizarra.`
          : `Resolución en cuaderno (Pág. ${pag} · ${t}): ${ej ? `Los estudiantes resuelven: ${ej}.` : 'Resolución de cuestionarios analíticos y tablas comparativas del libro oficial MINEDUC.'}`;
      } else if (fase === 'indagacion') {
        return esDirecta
          ? `Aplicación ecológica y comunitaria (Pág. ${pag} · ${t}): Vinculación de ${ej || t} con el entorno local y la salud de la comunidad.`
          : `Rincón de Ciencias (Pág. ${pag}): ${ej ? `Aplicación de: ${ej}.` : 'Elaboración de compromisos ambientales y registro de observaciones.'}`;
      } else {
        return esDirecta
          ? `Consolidación científica (Pág. ${pag} · ${t}): Síntesis en pizarra de los aprendizajes clave de ${ej || t} y autoevaluación formativa.`
          : `Comprobación en cuaderno (Pág. ${pag}): ${ej ? `Resolución de: ${ej}.` : 'Resolución de la sección evaluativa de ciencias del libro MINEDUC.'}`;
      }
    } else if (mLower.includes('artíst') || mLower.includes('arte') || mLower.includes('músic') || mLower.includes('plástic')) {
      return esDirecta
        ? `Taller de Expresión Artística (35 min · Pág. ${pag} · ${t}): El docente orienta técnicas plásticas locales, ritmo musical y desarrollo de la creatividad cultural del CNB.`
        : `Trabajo de Expresión Artística (35 min · Pág. ${pag} · ${t}): Elaboración de dibujos con colores locales, canto coral o modelado con materiales del entorno escolar.`;
    } else if (mLower.includes('productiv') || mLower.includes('desarrollo')) {
      return esDirecta
        ? `Taller de Productividad y Desarrollo (35 min · Pág. ${pag} · ${t}): El maestro explica técnicas de trabajo en el huerto escolar, elaboración de manualidades y hábitos productivos.`
        : `Trabajo de Productividad (35 min · Pág. ${pag} · ${t}): Registro de actividades de siembra comunitaria, manualidades escolares y proyectos familiares.`;
    } else if (mLower.includes('física') || mLower.includes('deporte')) {
      return esDirecta
        ? `Educación Física y Salud Motriz (35 min · Pág. ${pag}): Coordinación motriz, posturas corporales, ejercicios de respiración y hábitos de higiene física.`
        : `Circuitos y Juegos Tradicionales (35 min): Circuitos de agilidad motriz, equilibrio y juegos tradicionales guatemaltecos en el patio escolar.`;
    } else {
      // Matemáticas u otras
      if (fase === 'apertura') {
        return esDirecta
          ? `Modelado del algoritmo matemático (Pág. ${pag} · ${t}): El maestro explica en la pizarra el procedimiento paso a paso a partir de ${ej ? `[${ej}]` : 'los ejercicios del libro'} y resuelve dudas.`
          : `Trabajo Autónomo en Cuaderno (Pág. ${pag} · ${t}): ${ej ? `Resolución individual en cuaderno de: ${ej}.` : 'Resolución individual de los primeros incisos de cálculo del libro oficial MINEDUC.'}`;
      } else if (fase === 'ejercitacion') {
        return esDirecta
          ? `Ejercitación guiada y análisis de cálculo (Pág. ${pag} · ${t}): Modelado de operaciones y resolución en pizarra de ${ej ? `[${ej}]` : 'los problemas del libro'}.`
          : `Trabajo Autónomo (Pág. ${pag} · ${t}): ${ej ? `Práctica formal en cuaderno: ${ej}.` : 'Práctica intensiva en cuaderno resolviendo los problemas y operaciones de la página oficial MINEDUC.'}`;
      } else if (fase === 'indagacion') {
        return esDirecta
          ? `Aplicación contextualizada (Pág. ${pag} · ${t}): Formulación de situaciones matemáticas del mercado local, compras y cosechas basadas en ${ej || t}.`
          : `Rincón de Matemáticas (Pág. ${pag}): ${ej ? `Desafíos con material concreto de: ${ej}.` : 'Resolución en parejas de desafíos de cálculo con semillas o ábacos.'}`;
      } else {
        return esDirecta
          ? `Consolidación de cálculo y agilidad mental (Pág. ${pag} · ${t}): Repaso de propiedades numéricas y retos en pizarra sobre ${ej || t}.`
          : `Resolución individual (Pág. ${pag}): ${ej ? `Revisión final y entrega de: ${ej}.` : 'Resolución individual en silencio de la sección de repaso del libro oficial MINEDUC en cuaderno.'}`;
      }
    }
  };

  // Asignación de roles rotativos para aulas multigrado
  let tieneDirectaP1 = false;
  let tieneDirectaP2 = false;
  let tieneDirectaP3 = false;

  if (isMonogrado) {
    tieneDirectaP1 = true;
    tieneDirectaP2 = true;
    tieneDirectaP3 = true;
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
    isMonogrado 
      ? 'Atención Directa Docente' 
      : (tieneDirectaP1 ? 'Atención Directa Docente' : (tieneDirectaP2 ? 'Trabajo Autónomo con Guía' : 'Trabajo Cooperativo / Práctica'));

  // Fases didácticas progresivas por día de la semana (Lunes a Jueves = 4 sesiones progresivas)
  const fasePorDia: Record<DiaSemana, { p1: 'apertura' | 'ejercitacion' | 'indagacion' | 'consolidacion', p2: 'apertura' | 'ejercitacion' | 'indagacion' | 'consolidacion', p3: 'apertura' | 'ejercitacion' | 'indagacion' | 'consolidacion', p4: 'apertura' | 'ejercitacion' | 'indagacion' | 'consolidacion' }> = {
    'Lunes': { p1: 'apertura', p2: 'apertura', p3: 'apertura', p4: 'apertura' },
    'Martes': { p1: 'ejercitacion', p2: 'ejercitacion', p3: 'ejercitacion', p4: 'ejercitacion' },
    'Miércoles': { p1: 'indagacion', p2: 'indagacion', p3: 'indagacion', p4: 'indagacion' },
    'Jueves': { p1: 'consolidacion', p2: 'consolidacion', p3: 'consolidacion', p4: 'consolidacion' }
  };
  const fases = fasePorDia[dia] || { p1: 'apertura', p2: 'ejercitacion', p3: 'indagacion', p4: 'consolidacion' };

  // Construcción de los textos metodológicos diferenciados para cada período
  const actP1 = getAct(matP1, fases.p1, tieneDirectaP1);
  const actP2 = getAct(matP2, matList.length <= 2 ? (fases.p2 === 'apertura' ? 'ejercitacion' : fases.p2) : fases.p2, tieneDirectaP2);
  const actP3 = getAct(matP3, fases.p3, tieneDirectaP3);
  const actP4 = getAct(matP4, fases.p4, false);

  const rolP4 = dia === 'Lunes' ? 'Apertura y Lectura Guiada' :
                dia === 'Martes' ? 'Análisis y Cuaderno' :
                dia === 'Miércoles' ? 'Indagación y Práctica' : 'Consolidación y Portafolio';

  let p1Text = '';
  let p2Text = '';
  let p3Text = '';
  let p4Text = '';

  if (isMonogrado) {
    p1Text = `08:15 - 09:05 | ${matP1.materia} (Atención Directa y Modelado · Pág. ${matP1.paginaInicio}): ${actP1}`;
    p2Text = `09:05 - 09:55 | ${matP2.materia} (Ejercitación y Práctica en Libro · Pág. ${matP2.paginaInicio}): ${actP2}`;
    p3Text = `10:30 - 11:15 | ${matP3.materia} (Indagación y Desarrollo · Pág. ${matP3.paginaInicio}): ${actP3}`;
    p4Text = `11:15 - 11:50 | ${matP4.materia} (${rolP4} · Pág. ${matP4.paginaInicio}): ${actP4}`;
  } else {
    p1Text = tieneDirectaP1
      ? `08:15 - 09:05 | ${matP1.materia} (Atención Directa Docente · Pág. ${matP1.paginaInicio}): ${actP1}`
      : `08:15 - 09:05 | ${matP1.materia} (Trabajo Autónomo con Libro · Pág. ${matP1.paginaInicio}): ${actP1}`;

    p2Text = tieneDirectaP2
      ? `09:05 - 09:55 | ${matP2.materia} (Atención Directa Docente - Rotación · Pág. ${matP2.paginaInicio}): ${actP2}`
      : `09:05 - 09:55 | ${matP2.materia} (Trabajo Autónomo con Libro · Pág. ${matP2.paginaInicio}): ${actP2}`;

    p3Text = matP3.temaEje
      ? `10:30 - 11:15 | ${matP3.materia} (Apertura Plenaria en Pizarra + Práctica en Libro · Pág. ${matP3.paginaInicio}): [Explicación Conjunta en Pizarra (15 min): El docente modela el concepto nuclear del Tema Eje de ${matP3.materia} ("${matP3.temaEje}") para ambos grados a la vez] + [Trabajo Autónomo en Libro y Cuaderno (30 min)]: ${actP3}`
      : `10:30 - 11:15 | ${matP3.materia} (Dosificación Regular por Grado · Pág. ${matP3.paginaInicio}): ${actP3}`;
    p4Text = `11:15 - 11:50 | ${matP4.materia} (${rolP4} · Pág. ${matP4.paginaInicio}): ${actP4}`;
  }

  const tiempos: TimeAllocation[] = [
    {
      rango: '08:15 - 09:05',
      rolDocente: tieneDirectaP1 ? 'atencion_directa' : 'trabajo_autonomo',
      descripcion: p1Text
    },
    {
      rango: '09:05 - 09:55',
      rolDocente: tieneDirectaP2 ? 'atencion_directa' : 'trabajo_autonomo',
      descripcion: p2Text
    },
    {
      rango: '10:30 - 11:15',
      rolDocente: isMonogrado ? (tieneDirectaP3 ? 'atencion_directa' : 'trabajo_autonomo') : 'atencion_directa',
      descripcion: p3Text
    },
    {
      rango: '11:15 - 11:50',
      rolDocente: 'trabajo_autonomo',
      descripcion: p4Text
    }
  ];

  return {
    modalidad,
    actividadDocente: tieneDirectaP1 ? actP1 : actP2,
    actividadEstudiante: tieneDirectaP1 ? actP2 : actP1,
    periodo1_actividad: p1Text,
    periodo2_actividad: p2Text,
    periodo3_actividad: p3Text,
    periodo4_actividad: p4Text,
    materiasEfectivasDelDia,
    temaEjePeriodo1: matP1.temaEje,
    temaEjePeriodo2: matP2.temaEje,
    temaEjePeriodo3: matP3.temaEje,
    temaEjePeriodo4: matP4.temaEje,
    tiempos
  };
}
// Generador de la Guía Pedagógica Unificada con Eje Integrador (Lunes a Jueves + Evaluación de Viernes)

// ============================================================================
// ALGORITMO RAG PARA ENCONTRAR EL "TEMA EJE TRANSVERSAL" Y PROPÓSITO COMÚN
// ============================================================================

// ============================================================================
// ALGORITMO PARA DETERMINAR EL TEMA EJE TRANSVERSAL POR ASIGNATURA Y PERÍODO
// ============================================================================
export function determineTemaEjePorAsignatura(
  materia: string,
  items: SelectedItemParam[],
  grados: number[]
): { temaEje: string; categoria: string; proposito: string } {
  const matLower = (materia || '').toLowerCase();
  const itemsMat = items.filter(it => {
    const itMat = (it.materia || '').toLowerCase();
    if (matLower.includes('social') && (itMat.includes('social') || itMat.includes('historia') || itMat.includes('ciudad'))) return true;
    if ((matLower.includes('natural') || matLower.includes('ciencia')) && (itMat.includes('natural') || itMat.includes('ciencia')) && !itMat.includes('social')) return true;
    if (matLower.includes('mate') && itMat.includes('mate')) return true;
    if ((matLower.includes('lengua') || matLower.includes('comunic')) && (itMat.includes('lengua') || itMat.includes('comunic'))) return true;
    if (matLower.includes('medio') && itMat.includes('medio')) return true;
    return itMat === matLower;
  });

  const allText = itemsMat.map(it => String(it.tema || '') + ' ' + String(it.unidadTitulo || '') + ' ' + (it.competencias || []).join(' ') + ' ' + (it.indicadores || []).join(' ')).join(' ').toLowerCase();

  if (matLower.includes('social')) {
    if (/paleol[ií]tico|prehist[oó]ri|pobla|primeros pobladores|origen|cazadores|asentamiento/i.test(allText)) {
      return {
        temaEje: 'Sociedades Prehistóricas, Poblamiento y Primeros Asentamientos de América',
        categoria: 'Historia y Sociedades Prehistóricas',
        proposito: 'Identificar las teorías de poblamiento de América, las características de las bandas de cazadores recolectores y el desarrollo de los primeros asentamientos en el continente.'
      };
    }
    if (/maya|ind[ií]gena|pueblos|ancestral|colonia|conquista/i.test(allText)) {
      return {
        temaEje: 'Evolución Histórica, Pueblos Originarios y Memoria Cultural de Guatemala',
        categoria: 'Historia y Raíces Culturales',
        proposito: 'Valorar la cosmovisión, historia y legado de los pueblos originarios de Guatemala.'
      };
    }
    if (/geograf|mapa|relieve|clima|continente|territorio/i.test(allText)) {
      return {
        temaEje: 'El Espacio Geográfico de América, Recursos Naturales y Organización Territorial',
        categoria: 'Geografía y Espacio Americano',
        proposito: 'Reconocer la diversidad de paisajes, zonas climáticas y recursos naturales en el continente americano.'
      };
    }
    return {
      temaEje: 'Identidad, Geografía y Organización Social de Nuestra Comunidad y América',
      categoria: 'Ciencias Sociales e Identidad',
      proposito: 'Comprender la interacción de las sociedades humanas con su espacio físico y social.'
    };
  }

  if (matLower.includes('natural') || matLower.includes('ciencia')) {
    if (/c[eé]lula|mitocondria|reproducci[oó]n|mitosis|meiosis|organelo|tejido|gen[eé]tica/i.test(allText)) {
      return {
        temaEje: 'La Célula como Unidad de Vida: Estructura, Mitocondria y Reproducción Celular',
        categoria: 'Biología Celular y Continuidad de la Vida',
        proposito: 'Comprender la organización celular, el papel de la mitocondria en la obtención de energía y los procesos de división y reproducción celular.'
      };
    }
    if (/ecosistema|biodiversidad|planta|animal|flora|fauna|cadena/i.test(allText)) {
      return {
        temaEje: 'Los Ecosistemas, la Biodiversidad y el Equilibrio Ambiental en Nuestra Región',
        categoria: 'Ecología y Medio Ambiente',
        proposito: 'Reconocer la interdependencia de los seres vivos y la importancia de proteger los ecosistemas naturales.'
      };
    }
    if (/salud|higiene|cuerpo|enfermedad|nutrici[oó]n|sistema/i.test(allText)) {
      return {
        temaEje: 'Salud Comunitaria, Sistemas del Cuerpo Humano y Prevención de Enfermedades',
        categoria: 'Salud y Anatomía Humana',
        proposito: 'Promover hábitos de vida saludable y comprender el funcionamiento armónico del cuerpo humano.'
      };
    }
    return {
      temaEje: 'Sistemas Vivos, Organización Biológica y Cuidado del Entorno Natural',
      categoria: 'Ciencias Naturales y Vida',
      proposito: 'Desarrollar la indagación científica y el respeto por los seres vivos del entorno.'
    };
  }

  if (matLower.includes('mate')) {
    if (/m[uú]ltiplo|divisor|mcm|mcd|primo|factor/i.test(allText)) {
      return {
        temaEje: 'Razonamiento Numérico y Divisibilidad: Múltiplos, Divisores y Proporciones',
        categoria: 'Aritmética y Divisibilidad',
        proposito: 'Desarrollar habilidades de divisibilidad, múltiplos y proporcionalidad para resolver problemas cotidianos.'
      };
    }
    if (/fracci[oó]n|decimal|porcentaje|proporci[oó]n|raz[oó]n/i.test(allText)) {
      return {
        temaEje: 'Operaciones con Fracciones, Razones y Proporciones en el Comercio Comunitario',
        categoria: 'Aritmética Fraccionaria y Comercial',
        proposito: 'Aplicar fracciones y proporciones en intercambios comerciales y actividades productivas.'
      };
    }
    return {
      temaEje: 'El Razonamiento Numérico, Operaciones y Cálculo en las Actividades Cotidianas',
      categoria: 'Razonamiento Matemático Lógico',
      proposito: 'Fortalecer el cálculo mental y la resolución de situaciones problemáticas del entorno.'
    };
  }

  if (matLower.includes('lengua') || matLower.includes('comunic')) {
    if (/f[aá]bula|ensayo|narrat|moraleja|argument|cuento|leyenda/i.test(allText)) {
      return {
        temaEje: 'Comprensión Lectora, Tipologías Textuales (Fábula y Ensayo) y Expresión Escrita',
        categoria: 'Comprensión Lectora y Tipología Textual',
        proposito: 'Distinguir propósitos comunicativos en textos narrativos y argumentativos, expresando opiniones con sustento.'
      };
    }
    return {
      temaEje: 'La Comunicación Dialógica, Expresión Oral y Producción Escrita en la Escuela',
      categoria: 'Comunicación y Lenguaje L1',
      proposito: 'Fomentar la escucha activa, la expresión clara de ideas y la redacción coherente de textos.'
    };
  }

  return {
    temaEje: 'Desarrollo Formativo Integral, Creatividad y Vinculación Comunitaria',
    categoria: 'Áreas Formativas CNB',
    proposito: 'Promover la convivencia armónica, el arte y el trabajo cooperativo en el aula multigrado.'
  };
}

export function determineTemaEjeTransversal(
  items: SelectedItemParam[],
  grados: number[],
  areaCurricular: string,
  ciclo: string
) {
  const allMaterias = items.length > 0
    ? items.map(it => it.materia).filter((v, i, a) => a.indexOf(v) === i)
    : [areaCurricular || 'Matemáticas'];

  const gradosLabel = grados.map(g => `${g}.°`).join(' y ');

  // Agrupamiento de items por materia para análisis riguroso de relación entre grados
  const itemsPorMateria: Record<string, typeof items> = {};
  items.forEach(it => {
    const mKey = it.materiaBase || it.materia.toLowerCase().trim();
    if (!itemsPorMateria[mKey]) itemsPorMateria[mKey] = [];
    itemsPorMateria[mKey].push(it);
  });

  // Ejecución de análisis de convergencia por asignatura (RF-04 / RF-05)
  const analisisResultados: ResultadoRelacionTemasMateria[] = Object.entries(itemsPorMateria).map(([mKey, mItems]) => {
    const temasPorGrado = mItems.map(it => ({
      grado: it.grado,
      libroTitulo: it.libroTitulo,
      temas: it.temasSeleccionados && it.temasSeleccionados.length > 0
        ? it.temasSeleccionados
        : [{ titulo: it.tema, paginaInicio: it.paginaInicio, paginaFin: it.paginaFin }]
    }));
    const matNombre = mItems[0]?.materia || mKey;
    return analizarRelacionTemasMismaMateria(mKey, matNombre, temasPorGrado);
  });

  const ejeConvergente = analisisResultados.find(r => r.tieneRelacion && r.temaEjeTrazado);

  let temaGenerador: string;
  let categoriaConceptual: string;
  let propositoComun: string;
  let descripcionEje: string;

  if (ejeConvergente && ejeConvergente.temaEjeTrazado) {
    temaGenerador = ejeConvergente.temaEjeTrazado;
    categoriaConceptual = `${ejeConvergente.materiaNombre} (Eje Temático Común)`;
    propositoComun = ejeConvergente.estrategiaDidactica;
    descripcionEje = `Eje Temático Transversal (${ejeConvergente.materiaNombre}): Articulación didáctica para los grados ${gradosLabel} Primaria. ${ejeConvergente.estrategiaDidactica}`;
  } else {
    // Si no tienen relación conceptual comprobable o es aula monogrado: DOSIFICACIÓN REGULAR NORMAL (Sin inventar temas genéricos)
    temaGenerador = 'Dosificación Curricular Regular Diferenciada por Grado';
    categoriaConceptual = 'Dosificación Regular CNB (Temas Independientes)';
    propositoComun = 'Desarrollar sistemáticamente los contenidos programáticos del libro de texto oficial correspondiente a cada grado, sin forzar ejes temáticos transversales artificiales.';
    descripcionEje = `Los temas seleccionados para los grados ${gradosLabel} Primaria corresponden a unidades temáticas independientes. Se aplica la dosificación regular mediante atención alternada y rotación guiada con el libro oficial de cada grado.`;
  }

  return {
    temaGenerador,
    categoriaConceptual,
    propositoComun,
    descripcionEje,
    analisisResultados,
    actividadesLenguaje: {
      expresion_oral: 'Diálogo de saberes comunitarios matutino, exposición de argumentos y socialización en plenaria.',
      escritura: 'Resolución de incisos y registro de algoritmos, resúmenes y cuadros comparativos en el cuaderno de trabajo.',
      lectura: 'Lectura comprensiva individual y guiada en los libros oficiales del MINEDUC.'
    },
    materialesDidacticos: [
      'Libros de texto oficiales del MINEDUC por grado',
      'Cuadernos de trabajo (cuadriculado y de líneas)',
      'Material concreto: semillas, tapitas, ábacos y billetes didácticos',
      'Papelógrafos, marcadores y tarjetas de autoaprendizaje'
    ]
  };
}

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
    ? items.map(it => it.materia).filter((v, i, a) => a.indexOf(v) === i)
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

  const ejeResult = determineTemaEjeTransversal(items, grados, areaCurricular, ciclo);
  const temaGenerador = ejeResult.temaGenerador;
  const descripcionEje = ejeResult.descripcionEje;
  const categoriaConceptual = ejeResult.categoriaConceptual;
  const propositoComun = ejeResult.propositoComun;
  const actividadesLenguaje = ejeResult.actividadesLenguaje;
  const materialesDidacticos = ejeResult.materialesDidacticos;
  const analisisResultados = (ejeResult as any).analisisResultados || [];

  // Competencias similares identificadas para articulación multigrado
  const competenciasSimilares: SimilarCompetency[] = [
    {
      area: allMaterias[0] || 'Área Principal',
      eje_comun: temaGenerador,
      grados_articulacion: `Articulación progresiva de contenidos en los grados ${grados.map(g => `${g}.°`).join(', ')} con base en libros oficiales MINEDUC.`,
      gradoA_enfoque: `Enfoque formativo y conceptual para grado ${grados[0] || 4}.°.`,
      gradoB_enfoque: `Profundización y resolución autónoma para grado ${grados[1] || 5}.°.`
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
      alineacionCNB[`${g}.° Primaria`] = {
        grado: `${g}.° Primaria`,
        competencia: comp.startsWith('Competencia') ? comp : `Competencia: ${comp}`,
        indicador_logro: ind.startsWith('Indicador') ? ind : `Indicador: ${ind}`,
        contenido_declarativo: itemsG.map(i => `${i.materia} (${i.tema})`).join('; ')
      };
    } else {
      const cnb = searchCNBCorresponding(g, semana, bimestre, undefined, areaCurricular);
      alineacionCNB[`${g}.° Primaria`] = {
        grado: `${g}.° Primaria`,
        competencia: `Competencia ${cnb.competencia_numero}: ${cnb.competencia_descripcion}`,
        indicador_logro: `Indicador ${cnb.indicador_numero}: ${cnb.indicador_descripcion}`,
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
          const subDia = getSubtemaForDay(dia, it);
          const matEjercicios = findExercisesInMineduc(g, it.materia, subDia.pagina, subDia.pagina, subDia.titulo, dia);
          const mKey = it.materiaBase || it.materia.toLowerCase().trim();
          const rAnalisis = analisisResultados.find(r => r.idBase === mKey || r.materiaNombre.toLowerCase().includes(mKey));
          const temaEjeAsignatura = (rAnalisis && rAnalisis.tieneRelacion) ? rAnalisis.temaEjeTrazado || undefined : undefined;

          return {
            materia: it.materia,
            tema: subDia.titulo,
            libroTitulo: it.libroTitulo,
            unidad: it.unidad,
            paginaInicio: subDia.pagina,
            paginaFin: subDia.pagina,
            competencias: it.competencias || [],
            indicadores: it.indicadores || [],
            ejerciciosLiterales: matEjercicios,
            temaEje: temaEjeAsignatura
          };
        });

        const mainItem = itemsG[0];
        const secondItem = itemsG[1] || null;
        const subtemaDia = getSubtemaForDay(dia, mainItem);
        const subtemaDia2 = secondItem ? getSubtemaForDay(dia, secondItem) : null;
        const ejerciciosDia = findExercisesInMineduc(g, mainItem.materia, subtemaDia.pagina, subtemaDia.pagina, subtemaDia.titulo, dia);
        const ejerciciosDia2 = secondItem ? findExercisesInMineduc(g, secondItem.materia, subtemaDia2.pagina, subtemaDia2.pagina, subtemaDia2.titulo, dia) : [];

        const rotacion = buildRotationalTimeline(
          dia, 
          grados, 
          g, 
          mainItem.materia, 
          subtemaDia.titulo, 
          subtemaDia.pagina, 
          ejerciciosDia,
          secondItem ? secondItem.materia : undefined,
          subtemaDia2 ? subtemaDia2.titulo : undefined,
          subtemaDia2 ? subtemaDia2.pagina : undefined,
          ejerciciosDia2,
          matSeleccionadasDetalle
        );
        const materiasDia = rotacion.materiasEfectivasDelDia || matSeleccionadasDetalle;
        const todosEjercicios = ejerciciosDia.length > 0 ? ejerciciosDia : materiasDia.flatMap(m => m.ejerciciosLiterales);

        let tarea = '';
        if (dia === 'Lunes') {
          tarea = `Pág. ${subtemaDia.pagina} (${g}.° Grado): Resolver los ejercicios de aplicación de "${subtemaDia.titulo}" en el cuaderno y practicar en familia.`;
        } else if (dia === 'Martes') {
          tarea = `Pág. ${subtemaDia.pagina} (${g}.° Grado): Ejercitación guiada en el cuaderno y fijación de conceptos vistos hoy en clase.`;
        } else if (dia === 'Miércoles') {
          tarea = `Pág. ${subtemaDia.pagina} (${g}.° Grado): Aplicar lo aprendido en situaciones cotidianas del hogar o la comunidad.`;
        } else {
          tarea = `Preparación para el Test de Viernes (${g}.° Grado): Repasar los temas y ejercicios vistos durante la semana (Págs. ${mainItem.paginaInicio}-${mainItem.paginaFin}) con apoyo de la lista de cotejo.`;
        }

        gradosSincronizados.push({
          grado: `${g}.° Primaria`,
          gradoNumero: g,
          bloque: `Jornada Diaria (08:00 - 12:00 hrs | 210 min efectivos)`,
          duracionTotal: '210 min',
          materia: materiasDia.map(i => i.materia).join(' + '),
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
          seccionLibro: mainItem.unidadTitulo ? `Unidad ${mainItem.unidad}: ${mainItem.unidadTitulo}` : `Unidad ${mainItem.unidad}`,
          tiemposReferencia: rotacion.tiempos,
          ejerciciosLiterales: todosEjercicios,
          tareaCasa: tarea,
          completado: dia === 'Lunes',
          esTemaRezagado: false,
          materiasSeleccionadas: materiasDia
        });

      } else {
        // Fallback genérico sin selección de items
        const pagBase = paginasPorGrado[g] || 30;
        const offsetPagina = dia === 'Lunes' ? 0 : dia === 'Martes' ? 1 : dia === 'Miércoles' ? 2 : 3;
        const pagCalculada = pagBase + offsetPagina;

        const rezagadoMatch = temasRezagados.find(t => 
          t.toLowerCase().includes(`${g}°`) || 
          t.toLowerCase().includes(`${g}to`) || 
          t.toLowerCase().includes(`${g}mo`) ||
          temasRezagados.length === 1
        );

        const diaMateria = areaCurricular;
        const cnbInfo = searchCNBCorresponding(g, semana, bimestre, rezagadoMatch, diaMateria);
        const mineducInfo = searchMineducExercises(g, pagCalculada, rezagadoMatch || cnbInfo.temas_declarativos[0], diaMateria);
        const rotacion = buildRotationalTimeline(dia, grados, g, diaMateria, mineducInfo.item.seccion_unidad);
        const materiasDia = rotacion.materiasEfectivasDelDia || [];

        const ejercicios = formatLiteralExercises(
          mineducInfo.item.enunciado_ejercicio,
          mineducInfo.item.instrucciones_docente,
          mineducInfo.paginaEfectiva,
          g,
          diaMateria,
          mineducInfo.item.seccion_unidad
        );

        let tareaCasa = `Pág. ${mineducInfo.paginaEfectiva}: Repasar los ejercicios y firmar en el cuaderno.`;

        gradosSincronizados.push({
          grado: `${g}.° Primaria`,
          gradoNumero: g,
          bloque: `Jornada Diaria (08:00 - 12:00 hrs | 210 min efectivos)`,
          duracionTotal: '210 min',
          materia: mineducInfo.item.materia || diaMateria,
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
          esTemaRezagado: Boolean(rezagadoMatch),
          materiasSeleccionadas: materiasDia
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
      tutoria_entre_pares: `Tutoría entre Pares: Estudiantes de ${Math.max(...grados)}.° Grado que concluyen su trabajo autónomo orientan a compañeros de menor grado.`,
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
      temaEjePeriodo1: (gradosSincronizados[0]?.materiasSeleccionadas?.[0])?.temaEje,
      temaEjePeriodo2: (gradosSincronizados[0]?.materiasSeleccionadas?.[1])?.temaEje,
      temaEjePeriodo3: (gradosSincronizados[0]?.materiasSeleccionadas?.[2])?.temaEje || ((dia === "Martes" || dia === "Jueves") ? "Sociedades Prehistóricas, Poblamiento y Primeros Asentamientos de América" : "La Célula como Unidad de Vida: Estructura, Mitocondria y Reproducción Celular"),
      temaEjePeriodo4: (gradosSincronizados[0]?.materiasSeleccionadas?.[3])?.temaEje,
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
        `Criterio 1: Demuestra dominio conceptual de los temas trabajados (${matTemas}) en las páginas ${mainIt.paginaInicio}-${mainIt.paginaFin}.`,
        `Criterio 2: Aplica los procedimientos y algoritmos oficiales del MINEDUC con orden y precisión en el cuaderno.`,
        `Criterio 3: Vincula los saberes con situaciones contextuales de su entorno y comunidad.`
      ];

      const testItems = [
        `Ítem 1 (Comprensión y Procedimiento): Explicar o resolver el ejercicio fundamental de la página ${mainIt.paginaInicio} de ${mainIt.libroTitulo} sobre "${mainIt.tema}".`,
        `Ítem 2 (Aplicación Práctica): Resolver la actividad de aplicación de la página ${mainIt.paginaFin} registrando paso a paso la solución en la hoja de evaluación.`,
        `Ítem 3 (Transferencia Contextual): Redactar una conclusión o resolver una situación cotidiana comunitaria aplicando los aprendizajes de ${matName}.`
      ];

      evaluacionViernes[`${g}.° Primaria`] = {
        grado: `${g}.° Primaria`,
        gradoNumero: g,
        horario_evaluacion: '08:00 - 10:00 (120 min) | Aplicación del Test Individual',
        horario_receso: '10:00 - 10:30 (30 min) | RECESO ESCOLAR',
        horario_retroalimentacion: '10:30 - 12:00 (90 min) | Retroalimentación y Registro en Lista de Cotejo',
        indicador_a_evaluar: mainIt.indicadores?.[0] || 'Indicador de logro oficial del CNB',
        descripcion_test: `Evaluación Formativa Semanal Individual (${matName}: ${matTemas})`,
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
  }

  return {
    ciclo,
    grados,
    bimestre,
    semana,
    area_curricular: areaCurricular,
    tema_generador_comun: temaGenerador,
    categoria_conceptual: categoriaConceptual,
    proposito_comun: propositoComun,
    descripcion_eje_integrador: descripcionEje,
    actividades_lenguaje: actividadesLenguaje,
    materiales_didacticos: materialesDidacticos,
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
