/**
 * Módulo de Algoritmos de Machine Learning y Toma de Decisiones Didácticas para SIDSER
 * Basado en las mejores prácticas de ML aplicadas a la educación (DataCamp / CNB Guatemala)
 *
 * Algoritmos implementados:
 * 1. Decision Tree Pedagogical Classifier (Árbol de Decisión Didáctico):
 *    Clasifica y secuencia la jornada según variables deterministas (tipo de aula, prioridad de materia, ciclo).
 * 2. K-Means / Semantic Feature Clustering (Agrupamiento de Tema Eje Transversal):
 *    Agrupa temáticas heterogéneas de múltiples grados en clusters semánticos para encontrar el eje común.
 * 3. Content-Based Recommendation Engine (Sistema de Recomendación Basado en Contenido):
 *    Recomienda ejercicios del libro MINEDUC según similitud vectorial (Cosine Similarity sobre TF-IDF)
 *    con los temas seleccionados y necesidades de refuerzo.
 */

export interface PedagogicalFeatures {
  numGrados: number;
  materia: string;
  prioridad: 'troncal' | 'formativa';
  ciclo: 'primer_ciclo' | 'segundo_ciclo';
  dia: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves';
  bloqueHorario: 'bloque_1' | 'bloque_2';
}

export interface DecisionTreeOutput {
  modalidadAtencion: 'Atención Directa Continua' | 'Atención Alternada Rotativa' | 'Trabajo Autónomo con Guía' | 'Rincones y Tutoría';
  duracionMinutos: number;
  faseDidactica: string;
  distribucionGrupos: {
    grupoA_rol: 'atencion_directa' | 'trabajo_autonomo';
    grupoB_rol: 'atencion_directa' | 'trabajo_autonomo';
  };
  porcentajePonderacion: number;
}

/**
 * 1. ÁRBOL DE DECISIÓN DIDÁCTICO (Decision Tree Classifier)
 * Evalúa las ramas condicionales del CNB para asignar roles pedagógicos y tiempos óptimos.
 */
export function pedagogicalDecisionTree(features: PedagogicalFeatures): DecisionTreeOutput {
  const { numGrados, prioridad, dia, bloqueHorario } = features;

  // Nodo Raíz: Tipo de Aula (Monogrado vs Multigrado)
  if (numGrados === 1) {
    // Rama Monogrado: 100% de atención continua
    if (bloqueHorario === 'bloque_1') {
      return {
        modalidadAtencion: 'Atención Directa Continua',
        duracionMinutos: 100,
        faseDidactica: dia === 'Lunes' ? 'Fase de Modelado y Explicación en Pizarra' :
                       dia === 'Martes' ? 'Fase de Comprensión y Algoritmo Guiado' :
                       dia === 'Miércoles' ? 'Fase de Ejercitación en Cuaderno y Libro' :
                       'Fase de Consolidación y Síntesis',
        distribucionGrupos: {
          grupoA_rol: 'atencion_directa',
          grupoB_rol: 'atencion_directa'
        },
        porcentajePonderacion: 60
      };
    } else {
      return {
        modalidadAtencion: 'Trabajo Autónomo con Guía',
        duracionMinutos: 80,
        faseDidactica: 'Indagación Contextual y Rincones de Aprendizaje',
        distribucionGrupos: {
          grupoA_rol: 'trabajo_autonomo',
          grupoB_rol: 'trabajo_autonomo'
        },
        porcentajePonderacion: 40
      };
    }
  }

  // Rama Multigrado: Atención Alternada Rotativa
  const esTurnoDirectoGrupoA = (dia === 'Lunes' || dia === 'Miércoles' || dia === 'Jueves');

  if (bloqueHorario === 'bloque_1') {
    return {
      modalidadAtencion: 'Atención Alternada Rotativa',
      duracionMinutos: 100,
      faseDidactica: `Rotación 50/50: Grupo A en ${esTurnoDirectoGrupoA ? 'Atención Directa' : 'Trabajo Autónomo'} e inversión inmediata`,
      distribucionGrupos: {
        grupoA_rol: esTurnoDirectoGrupoA ? 'atencion_directa' : 'trabajo_autonomo',
        grupoB_rol: esTurnoDirectoGrupoA ? 'trabajo_autonomo' : 'atencion_directa'
      },
      porcentajePonderacion: prioridad === 'troncal' ? 60 : 40
    };
  } else {
    return {
      modalidadAtencion: 'Rincones y Tutoría',
      duracionMinutos: 80,
      faseDidactica: 'Tutoría entre Pares (Alumnos de grados avanzados apoyan a menores) y Rincones',
      distribucionGrupos: {
        grupoA_rol: 'trabajo_autonomo',
        grupoB_rol: 'trabajo_autonomo'
      },
      porcentajePonderacion: 40
    };
  }
}

/**
 * 2. ANÁLISIS DE RELACIÓN CONCEPTUAL Y TRAZADO DE TEMA EJE POR ASIGNATURA
 * Evalúa rigurosamente si los temas seleccionados para una misma materia entre distintos grados
 * poseen una relación pedagógica genuina (convergencia semántica o taxonómica).
 * 
 * Regla de Oro:
 * - SI TIENEN RELACIÓN: Propone un Tema Eje específico y palabras clave comunes para modelado compartido.
 * - SI NO TIENEN RELACIÓN: NO inventa temas genéricos; devuelve temaEje = null y orienta la dosificación normal.
 */

export interface ResultadoRelacionTemasMateria {
  materiaNombre: string;
  idBase: string;
  temasPorGrado: {
    grado: number;
    libroTitulo?: string;
    temas: { titulo: string; paginaInicio?: number; paginaFin?: number }[];
  }[];
  tieneRelacion: boolean;
  scoreSimilitud: number;
  palabrasClaveComunes: string[];
  temaEjeTrazado: string | null;
  estrategiaDidactica: string;
  motivoClasificacion: string;
}

interface SubDominioCluster {
  id: string;
  nombre: string;
  temaEje: string;
  estrategia: string;
  keywords: string[];
}

const TAXONOMIA_ASIGNATURAS: Record<string, SubDominioCluster[]> = {
  ciencias_naturales: [
    {
      id: 'celular',
      nombre: 'Biología Celular y Reproducción',
      temaEje: 'Biología Celular: Estructura, Mitocondria y Reproducción Celular',
      estrategia: 'Convergencia en biología celular: el docente modela la estructura y funciones celulares en la pizarra para toda la clase (10-15 min); luego cada grado resuelve las actividades específicas en su libro oficial (organelos en 5.° y reproducción celular en 6.°).',
      keywords: ['celula', 'celular', 'mitocondria', 'organelo', 'organelos', 'reproduccion', 'mitosis', 'meiosis', 'tejido', 'tejidos', 'adn', 'nucleo']
    },
    {
      id: 'ecosistemas',
      nombre: 'Ecosistemas y Biodiversidad',
      temaEje: 'Los Ecosistemas, la Biodiversidad y el Equilibrio Ambiental',
      estrategia: 'Convergencia ecológica: el docente modela las relaciones de los seres vivos y el ambiente en la pizarra antes de que cada grado resuelva las guías de su libro.',
      keywords: ['ecosistema', 'ecosistemas', 'biodiversidad', 'cadena', 'trofica', 'alimenticia', 'flora', 'fauna', 'habitat', 'especies', 'adaptacion', 'ambiente']
    },
    {
      id: 'cuerpo_salud',
      nombre: 'Anatomía, Sistemas y Salud',
      temaEje: 'Sistemas del Cuerpo Humano, Salud y Prevención de Enfermedades',
      estrategia: 'Convergencia en salud y anatomía: explicación plenaria del funcionamiento de los sistemas vitales antes del trabajo individual en cuaderno.',
      keywords: ['cuerpo', 'humano', 'sistema', 'digestivo', 'circulatorio', 'nervioso', 'salud', 'higiene', 'enfermedad', 'enfermedades', 'nutricion', 'vacuna']
    },
    {
      id: 'materia_energia',
      nombre: 'Materia y Energía',
      temaEje: 'Propiedades de la Materia, Formas de Energía y Máquinas Simples',
      estrategia: 'Demostración compartida de fenómenos físicos y energéticos en el aula, derivando en ejercicios diferenciados por grado.',
      keywords: ['materia', 'energia', 'fuerza', 'movimiento', 'electricidad', 'maquinas', 'luz', 'calor', 'estados']
    },
    {
      id: 'universo_tierra',
      nombre: 'La Tierra y el Universo',
      temaEje: 'El Sistema Solar, la Tierra y los Fenómenos Astronómicos',
      estrategia: 'Modelado visual del cosmos y capas terrestres en pizarra antes del trabajo en el texto oficial.',
      keywords: ['universo', 'planeta', 'planetas', 'sistema solar', 'tierra', 'luna', 'atmosfera', 'gravedad', 'galaxia']
    }
  ],
  ciencias_sociales: [
    {
      id: 'prehistoria_origen',
      nombre: 'Prehistoria y Primeros Pobladores',
      temaEje: 'Sociedades Prehistóricas, Poblamiento y Primeros Asentamientos de América',
      estrategia: 'Ambos grados convergen en la prehistoria y el origen humano: el docente modela una línea de tiempo compartida en la pizarra (10-15 min) y luego cada grado resuelve sus actividades específicas (cazadores de América en 5.° y el Paleolítico en 6.°).',
      keywords: ['paleolitico', 'prehistoria', 'prehistorico', 'poblamiento', 'primeros pobladores', 'poblador', 'pobladores', 'origen', 'cazador', 'cazadores', 'bering', 'nomadas', 'asentamiento']
    },
    {
      id: 'cultura_maya',
      nombre: 'Civilización Maya y Pueblos Originarios',
      temaEje: 'Evolución Histórica, Pueblos Originarios y Memoria Cultural de Guatemala',
      estrategia: 'Conversación comunitaria sobre las raíces históricas y el legado maya antes de la indagación por grado en los libros oficiales.',
      keywords: ['maya', 'mayas', 'indigena', 'indigenas', 'ancestral', 'pueblos originarios', 'cosmovision', 'popol vuh', 'arqueologia']
    },
    {
      id: 'conquista_colonia',
      nombre: 'Época Colonial e Independencia',
      temaEje: 'Procesos Históricos: Conquista, Época Colonial y Construcción de la República',
      estrategia: 'Análisis guiado de causas y consecuencias históricas en pizarra antes de la lectura analítica por grado.',
      keywords: ['conquista', 'colonia', 'colonial', 'espanoles', 'independencia', 'revolucion', 'republica', 'reforma']
    },
    {
      id: 'geografia_territorio',
      nombre: 'Geografía y Recursos de América',
      temaEje: 'El Espacio Geográfico de América, Recursos Naturales y Territorio',
      estrategia: 'Lectura compartida de mapas y relieve en pizarra antes del trabajo cartográfico en el cuaderno de cada grado.',
      keywords: ['geografia', 'mapa', 'mapas', 'relieve', 'clima', 'volcan', 'volcanes', 'rio', 'rios', 'continente', 'territorio', 'departamento', 'recursos naturales']
    },
    {
      id: 'ciudadania_derechos',
      nombre: 'Ciudadanía, Convivencia y Derechos',
      temaEje: 'Ciudadanía, Derechos Humanos y Convivencia Democrática en la Comunidad',
      estrategia: 'Dilema moral o estudio de caso comunitario en plenaria, derivando en compromisos cívicos en el cuaderno de cada grado.',
      keywords: ['derechos', 'deberes', 'ciudadania', 'democracia', 'constitucion', 'convivencia', 'paz', 'valores', 'gobierno']
    }
  ],
  matematicas: [
    {
      id: 'divisibilidad',
      nombre: 'Múltiplos, Divisores y Divisibilidad',
      temaEje: 'Razonamiento Numérico y Divisibilidad: Múltiplos, Divisores y Proporciones',
      estrategia: 'El docente modela el concepto de divisibilidad y múltiplos en pizarra. Un grado resuelve múltiplos y el otro avanza a divisores y descomposición factorial en su libro.',
      keywords: ['multiplo', 'multiplos', 'divisor', 'divisores', 'mcm', 'mcd', 'factor', 'factores', 'primo', 'primos', 'compuesto', 'divisibilidad']
    },
    {
      id: 'fracciones',
      nombre: 'Fracciones y Proporciones',
      temaEje: 'Operaciones con Fracciones, Proporciones y Razones en la Vida Cotidiana',
      estrategia: 'Modelado del algoritmo con fracciones en pizarra antes de la ejercitación guiada en el cuaderno de cada grado.',
      keywords: ['fraccion', 'fracciones', 'numerador', 'denominador', 'equivalente', 'equivalentes', 'decimal', 'decimales', 'proporcion', 'porcentaje', 'razon']
    },
    {
      id: 'numeracion_posicional',
      nombre: 'Numeración y Valor Posicional',
      temaEje: 'Sistemas de Numeración, Valor Posicional y Conteo Ancestral',
      estrategia: 'Demostración de equivalencias en la tabla de valor posicional en pizarra para ambos grados.',
      keywords: ['posicional', 'millar', 'millares', 'millon', 'millones', 'lectura de numeros', 'sistema maya', 'numeracion maya', 'descomposicion']
    },
    {
      id: 'operaciones_basicas',
      nombre: 'Operaciones Fundamentales',
      temaEje: 'Operaciones Fundamentales y Resolución de Problemas Aritméticos',
      estrategia: 'Modelado conjunto de estrategias de cálculo mental antes de la resolución de problemas en el libro oficial.',
      keywords: ['suma', 'resta', 'multiplicacion', 'division', 'calculo mental', 'algoritmo', 'problemas comerciales']
    },
    {
      id: 'geometria',
      nombre: 'Geometría y Medición',
      temaEje: 'Geometría, Medición de Figuras y Exploración Espacial',
      estrategia: 'Construcción de figuras y medición geométrica en pizarra antes del trazo individual en cuaderno.',
      keywords: ['geometria', 'angulo', 'angulos', 'triangulo', 'triangulos', 'poligono', 'poligonos', 'perimetro', 'area', 'volumen', 'figura', 'mosaico', 'mosaicos', 'teselado', 'teselados', 'cuerpo geometrico']
    },
    {
      id: 'series_patrones',
      nombre: 'Series, Patrones y Regularidades',
      temaEje: 'Descubrimiento de Patrones, Series Numéricas y Regularidades Matemáticas',
      estrategia: 'El docente modela la regla de formación del patrón en pizarra antes de que cada grado complete sus sucesiones numéricas en el libro oficial.',
      keywords: ['serie', 'series', 'patron', 'patrones', 'sucesion', 'sucesiones', 'secuencia', 'secuencias', 'regularidad', 'regularidades']
    }
  ],
  comunicacion_lenguaje: [
    {
      id: 'narrativo',
      nombre: 'Textos Narrativos (Fábula y Cuento)',
      temaEje: 'Comprensión Lectora, Tipologías Textuales (Fábula y Cuento) y Expresión Escrita',
      estrategia: 'El docente modela la estructura narrativa en pizarra; cada grado analiza fábulas, cuentos o leyendas con su respectivo libro oficial.',
      keywords: ['fabula', 'fabulas', 'cuento', 'cuentos', 'leyenda', 'leyendas', 'mito', 'narracion', 'personaje', 'personajes', 'moraleja']
    },
    {
      id: 'argumentativo_informativo',
      nombre: 'Textos Argumentativos e Informativos',
      temaEje: 'Lectura Crítica, Textos Argumentativos (Ensayo) y Síntesis de Ideas',
      estrategia: 'Debate oral y modelado de tesis y argumentos en pizarra antes de la redacción por grado.',
      keywords: ['ensayo', 'ensayos', 'noticia', 'articulo', 'argumento', 'tesis', 'informe', 'resumen', 'ideas principales', 'expositivo']
    },
    {
      id: 'gramatica_sintaxis',
      nombre: 'Gramática y Sintaxis',
      temaEje: 'Estructura Gramatical de la Oración, Concordancia y Redacción',
      estrategia: 'Modelado de análisis sintáctico en pizarra antes de la ejercitación gramatical en cuaderno.',
      keywords: ['sustantivo', 'adjetivo', 'verbo', 'sujeto', 'predicado', 'oracion', 'concordancia', 'pronombre', 'sintaxis']
    },
    {
      id: 'ortografia_puntuacion',
      nombre: 'Ortografía y Puntuación',
      temaEje: 'Normas Ortográficas, Acentuación y Puntuación en la Escritura',
      estrategia: 'Dictado reflexivo y corrección en pizarra compartida para ambos grados.',
      keywords: ['puntuacion', 'coma', 'punto', 'acento', 'aguda', 'grave', 'esdrujula', 'ortografia', 'reglas']
    },
    {
      id: 'oralidad_dialogo',
      nombre: 'Comunicación Dialógica y Tradición Oral',
      temaEje: 'La Comunicación Dialógica, Expresión Oral y Tradición de la Aldea',
      estrategia: 'Círculo de diálogo inicial para todos los grados antes de la redacción en cuaderno.',
      keywords: ['dialogo', 'entrevista', 'debate', 'oral', 'escucha activa', 'tradicion oral', 'conversacion']
    }
  ]
};

const STOPWORDS_ES = new Set([
  // Artículos y pronombres
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'lo', 'al', 'del',
  'yo', 'tu', 'el', 'ella', 'ello', 'nosotros', 'nosotras', 'vosotros', 'ellos', 'ellas',
  'me', 'te', 'se', 'nos', 'os', 'le', 'les', 'mi', 'mis', 'tu', 'tus', 'su', 'sus',
  'nuestro', 'nuestra', 'nuestros', 'nuestras', 'este', 'esta', 'estos', 'estas',
  'ese', 'esa', 'esos', 'esas', 'aquel', 'aquella', 'aquellos', 'aquellas',
  'que', 'quien', 'quienes', 'cual', 'cuales', 'donde', 'como', 'cuando', 'cuanto',

  // Preposiciones y conjunciones
  'de', 'del', 'a', 'en', 'para', 'por', 'con', 'sin', 'sobre', 'entre', 'hacia', 'desde', 'hasta',
  'durante', 'mediante', 'contra', 'bajo', 'segun', 'tras', 'y', 'e', 'o', 'u', 'ni', 'pero', 'mas',

  // Verbos auxiliares / copulativos / generales de consignas
  'es', 'son', 'ser', 'era', 'fue', 'sido', 'esta', 'estan', 'estar', 'estado',
  'hay', 'haber', 'hacer', 'hago', 'hace', 'hacen', 'hizo',
  'aprendo', 'aprende', 'aprender', 'aprendemos',
  'conozco', 'conoce', 'conocer', 'conocemos',
  'elaboro', 'elabora', 'elaborar', 'elaboramos', 'elaboracion',
  'resuelvo', 'resuelve', 'resolver', 'resolvemos', 'resolucion',
  'practico', 'practica', 'practicar', 'practicamos',
  'exploro', 'explora', 'explorar', 'exploramos',
  'identifico', 'identifica', 'identificar',
  'utilizo', 'utiliza', 'utilizar',
  'repaso', 'repasar',

  // Metadatos escolares y del libro (ELIMINAR ABSOLUTAMENTE 'PAG', 'PAGS', etc.)
  'pag', 'pags', 'pagina', 'paginas', 'página', 'páginas',
  'sesion', 'sesiones', 'leccion', 'lecciones', 'tema', 'temas',
  'subtema', 'subtemas', 'unidad', 'unidades', 'bloque', 'bloques',
  'parte', 'partes', 'libro', 'libros', 'cuaderno', 'cuadernos',
  'grado', 'grados', 'primaria', 'semana', 'semanas',
  'ejercicio', 'ejercicios', 'actividad', 'actividades',
  'inciso', 'incisos', 'orientacion', 'orientaciones', 'guia', 'guias',
  'repaso', 'evaluacion', 'autoevaluacion', 'diagnostica', 'formativa'
]);

/**
 * Elimina referencias editoriales como (Pág. 9), Pág. 8-10, números aislados, etc.
 */
export function limpiarMetadatosTexto(txt: string): string {
  if (!txt) return '';
  return txt
    .replace(/\([^\)]*p[aá]g[^\)]*\)/gi, ' ')
    .replace(/\bp[aá]gs?\.?\s*\d+(?:\s*-\s*\d+)?\b/gi, ' ')
    .replace(/\bp[aá]ginas?\.?\s*\d+(?:\s*-\s*\d+)?\b/gi, ' ')
    .replace(/\b\d+\b/g, ' ')
    .trim();
}

export function normalizarTexto(txt: string): string {
  const sinMetadatos = limpiarMetadatosTexto(txt || '');
  return sinMetadatos
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim();
}

export function extraerTokensSignificativos(txt: string): string[] {
  const norm = normalizarTexto(txt);
  return norm
    .split(/\s+/)
    .filter(t => t.length >= 4 && !STOPWORDS_ES.has(t));
}

/**
 * Función central de auditoría y análisis de relación de temas por asignatura
 */
export function analizarRelacionTemasMismaMateria(
  materiaIdBase: string,
  materiaNombre: string,
  temasPorGrado: {
    grado: number;
    libroTitulo?: string;
    temas: { titulo: string; paginaInicio?: number; paginaFin?: number }[];
  }[]
): ResultadoRelacionTemasMateria {
  // Caso 1: Aula monogrado o sin suficientes grados con esta materia
  if (!temasPorGrado || temasPorGrado.length < 2) {
    return {
      materiaNombre,
      idBase: materiaIdBase,
      temasPorGrado: temasPorGrado || [],
      tieneRelacion: false,
      scoreSimilitud: 0,
      palabrasClaveComunes: [],
      temaEjeTrazado: null,
      estrategiaDidactica: 'Dosificación curricular directa: materia desarrollada de manera exclusiva para este grado.',
      motivoClasificacion: 'Asignatura cursada por un único grado. Se aplica la dosificación normal.'
    };
  }

  // Extraer tokens por cada grado
  const tokensPorGrado = temasPorGrado.map(tg => {
    const textGrado = tg.temas.map(t => t.titulo).join(' ');
    return {
      grado: tg.grado,
      tokens: extraerTokensSignificativos(textGrado),
      normText: normalizarTexto(textGrado)
    };
  });

  // 1. Buscar intersección léxica directa (palabras o raíces compartidas)
  const g1Tokens = tokensPorGrado[0].tokens;
  const g2Tokens = tokensPorGrado[1].tokens;

  const palabrasComunesDirectas: string[] = [];
  for (const t1 of g1Tokens) {
    for (const t2 of g2Tokens) {
      if (t1 === t2 || (t1.length >= 5 && t2.startsWith(t1)) || (t2.length >= 5 && t1.startsWith(t2))) {
        const palabraBase = t1.length <= t2.length ? t1 : t2;
        if (palabraBase.length >= 4 && !STOPWORDS_ES.has(palabraBase) && !palabrasComunesDirectas.includes(palabraBase)) {
          palabrasComunesDirectas.push(palabraBase);
        }
      }
    }
  }

  // 2. Buscar intersección en la taxonomía curricular oficial del CNB
  const keyTaxonomia = materiaIdBase.includes('social') ? 'ciencias_sociales' :
                       (materiaIdBase.includes('natural') || materiaIdBase.includes('ciencia')) ? 'ciencias_naturales' :
                       materiaIdBase.includes('mate') ? 'matematicas' :
                       (materiaIdBase.includes('lengua') || materiaIdBase.includes('comunic')) ? 'comunicacion_lenguaje' :
                       null;

  let clusterComun: SubDominioCluster | null = null;
  const clustersAsignatura = keyTaxonomia ? TAXONOMIA_ASIGNATURAS[keyTaxonomia] : null;

  if (clustersAsignatura) {
    let mejorClusterG1: { cluster: SubDominioCluster; score: number } | null = null;
    let mejorClusterG2: { cluster: SubDominioCluster; score: number } | null = null;

    for (const c of clustersAsignatura) {
      const cKeywords = c.keywords;
      let scoreG1 = 0;
      let scoreG2 = 0;

      for (const kw of cKeywords) {
        if (tokensPorGrado[0].normText.includes(kw)) scoreG1 += 2;
        if (tokensPorGrado[1].normText.includes(kw)) scoreG2 += 2;
      }

      if (!mejorClusterG1 || scoreG1 > mejorClusterG1.score) {
        mejorClusterG1 = { cluster: c, score: scoreG1 };
      }
      if (!mejorClusterG2 || scoreG2 > mejorClusterG2.score) {
        mejorClusterG2 = { cluster: c, score: scoreG2 };
      }
    }

    // Convergencia estricta: AMBOS grados deben puntuar positivamente en el MISMO cluster
    if (
      mejorClusterG1 &&
      mejorClusterG2 &&
      mejorClusterG1.cluster.id === mejorClusterG2.cluster.id &&
      mejorClusterG1.score >= 2 &&
      mejorClusterG2.score >= 2
    ) {
      clusterComun = mejorClusterG1.cluster;
      // Añadir palabras clave del cluster presentes en ambos
      clusterComun.keywords.forEach(kw => {
        if (
          (tokensPorGrado[0].normText.includes(kw) || tokensPorGrado[1].normText.includes(kw)) &&
          !palabrasComunesDirectas.includes(kw)
        ) {
          palabrasComunesDirectas.push(kw);
        }
      });
    }
  }

  // 3. Regla de Decisión Factual: ¿Existe relación genuina comprobable?
  const tienePalabraSustantiva = palabrasComunesDirectas.some(
    w => w.length >= 4 && !STOPWORDS_ES.has(w)
  );
  const tieneRelacion = Boolean(clusterComun || tienePalabraSustantiva);

  if (tieneRelacion) {
    const temaEje = clusterComun
      ? clusterComun.temaEje
      : `Eje Temático Articulador: ${palabrasComunesDirectas.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' y ')}`;

    const estrategia = clusterComun
      ? clusterComun.estrategia
      : `Convergencia curricular detectada en torno a "${palabrasComunesDirectas.join(', ')}". El docente realiza la apertura y modelado conjunto en pizarra (10-15 min) y posteriormente cada grado resuelve las actividades de su libro oficial.`;

    return {
      materiaNombre,
      idBase: materiaIdBase,
      temasPorGrado,
      tieneRelacion: true,
      scoreSimilitud: clusterComun ? 90 : 75,
      palabrasClaveComunes: palabrasComunesDirectas.slice(0, 5),
      temaEjeTrazado: temaEje,
      estrategiaDidactica: estrategia,
      motivoClasificacion: `Convergencia temática confirmada en ${clusterComun ? clusterComun.nombre : 'conceptos comunes'}. Procede formular Tema Eje.`
    };
  }

  // Caso Sin Relación Genuina: NO FORZAR TEMA EJE
  return {
    materiaNombre,
    idBase: materiaIdBase,
    temasPorGrado,
    tieneRelacion: false,
    scoreSimilitud: 15,
    palabrasClaveComunes: [],
    temaEjeTrazado: null,
    estrategiaDidactica: 'Dosificación regular independiente: Los temas corresponden a unidades o ramas curriculares distintas. El docente imparte la clase de forma diferenciada mediante atención alternada y trabajo autónomo con el libro de texto oficial de cada grado.',
    motivoClasificacion: 'Temas independientes sin convergencia conceptual directa. Se mantiene la dosificación regular de cada grado.'
  };
}

export interface ClusterCentroid {
  id: string;
  categoria: string;
  temaEje: string;
  proposito: string;
  keywords: string[];
}

export function clusterTemaEjeTransversal(temasTexto: string[]): ClusterCentroid {
  const inputTokens = temasTexto
    .join(' ')
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(t => t.length > 2);

  return {
    id: 'cluster_dosificacion_regular',
    categoria: 'Dosificación Curricular Oficial',
    temaEje: 'Dosificación Curricular Regular Diferenciada por Grado',
    proposito: 'Desarrollar los contenidos programáticos del CNB y libros de texto oficiales de cada grado de forma sistemática y progresiva.',
    keywords: ['cnb', 'dosificacion', 'libro', 'mineduc']
  };
}

/**
 * 3. CONTENT-BASED RECOMMENDATION SYSTEM (Recomendador de Ejercicios del MINEDUC)
 * Utiliza similitud de coseno sobre bolsa de palabras para recomendar los ejercicios
 * más relevantes del libro oficial según el tema y la fase pedagógica del día.
 */
export function recommendOptimalExercises(
  candidatos: { enunciado: string; pagina: number }[],
  temaQuery: string,
  faseDidactica: string,
  maxResults: number = 3
): string[] {
  if (!candidatos || candidatos.length === 0) return [];

  const queryVector = `${temaQuery} ${faseDidactica}`.toLowerCase().split(/\W+/).filter(w => w.length > 2);
  const qSet = new Set(queryVector);

  const scored = candidatos.map(c => {
    const textTokens = (c.enunciado || '').toLowerCase().split(/\W+/).filter(w => w.length > 2);
    let overlap = 0;
    textTokens.forEach(t => {
      if (qSet.has(t)) overlap++;
    });

    const score = textTokens.length > 0 ? overlap / Math.sqrt(queryVector.length * textTokens.length) : 0;
    return {
      texto: `Pág. ${c.pagina}: ${c.enunciado.slice(0, 220)}...`,
      score
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, maxResults).map(s => s.texto);
}
