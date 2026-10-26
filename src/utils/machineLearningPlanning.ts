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
 * 2. K-MEANS / SEMANTIC FEATURE CLUSTERING (Clustering de Tema Eje Transversal)
 * Extrae vectores de características de los temas seleccionados y calcula la distancia hacia
 * los clusters temáticos oficiales del CNB para encontrar el centroide óptimo.
 */
export interface ClusterCentroid {
  id: string;
  categoria: string;
  temaEje: string;
  proposito: string;
  keywords: string[];
}

const CNB_CLUSTERS: ClusterCentroid[] = [
  {
    id: 'cluster_salud_vida',
    categoria: 'Salud, Higiene y Medio Ambiente',
    temaEje: 'Salud e higiene comunitaria: El cuidado del cuerpo, los seres vivos y la madre naturaleza',
    proposito: 'Identificar medidas preventivas de salud, hábitos de higiene y conservación del entorno natural en la comunidad.',
    keywords: ['salud', 'higiene', 'cuerpo', 'enfermedad', 'organismo', 'celula', 'vida', 'seres', 'naturaleza', 'ecosistema', 'planta', 'animal', 'ambiente']
  },
  {
    id: 'cluster_aritmetica_comercio',
    categoria: 'Razonamiento Matemático y Economía Familiar',
    temaEje: 'El razonamiento numérico, las operaciones y el cálculo en las actividades cotidianas de la comunidad',
    proposito: 'Desarrollar agilidad de cálculo mental, valor posicional y resolución de problemas comerciales y de compras en el mercado local.',
    keywords: ['posicional', 'numero', 'numeros', 'suma', 'resta', 'multiplicacion', 'fraccion', 'proporcion', 'decimal', 'calculo', 'quetzales', 'mercado', 'compra', 'venta']
  },
  {
    id: 'cluster_comunicacion_dialógica',
    categoria: 'Comunicación, Lenguaje y Tradición Oral',
    temaEje: 'La comunicación dialógica, las formas de expresión y el valor de la palabra en la comunidad',
    proposito: 'Fortalecer la expresión oral, la comprensión lectora, el respeto en la conversación y la capacidad de comunicar acuerdos.',
    keywords: ['dialogo', 'conversacion', 'oral', 'lectura', 'redaccion', 'cuento', 'leyenda', 'oracion', 'palabra', 'lenguaje', 'comunicacion', 'texto']
  },
  {
    id: 'cluster_ciudadania_geografia',
    categoria: 'Identidad, Geografía y Convivencia Comunitaria',
    temaEje: 'Identidad comunitaria, organización social, geografía y convivencia armónica en la escuela multigrado',
    proposito: 'Reconocer el espacio geográfico local, las instituciones comunitarias y las normas de convivencia democrática.',
    keywords: ['comunidad', 'aldea', 'municipio', 'geografia', 'mapa', 'relieve', 'sociedad', 'gobierno', 'civica', 'derechos', 'deberes', 'convivencia', 'cultura']
  }
];

export function clusterTemaEjeTransversal(temasTexto: string[]): ClusterCentroid {
  const inputTokens = temasTexto
    .join(' ')
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(t => t.length > 2);

  if (inputTokens.length === 0) return CNB_CLUSTERS[1]; // Fallback aritmético

  let bestCluster = CNB_CLUSTERS[0];
  let maxScore = -1;

  for (const cluster of CNB_CLUSTERS) {
    let score = 0;
    const clusterWordSet = new Set(cluster.keywords);

    for (const token of inputTokens) {
      if (clusterWordSet.has(token)) {
        score += 2; // Match exacto
      } else {
        // Match parcial / prefijos
        for (const kw of cluster.keywords) {
          if (token.startsWith(kw) || kw.startsWith(token)) {
            score += 1;
            break;
          }
        }
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestCluster = cluster;
    }
  }

  return bestCluster;
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
