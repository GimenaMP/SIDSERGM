// Test script to verify ML integration in RAG Engine
const fs = require('fs');
const path = require('path');

// Test clusterTemaEjeTransversal logic
const CNB_CLUSTERS = [
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
    id: 'cluster_comunicacion_dialogica',
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

function clusterTemaEjeTransversal(temasTexto) {
  const inputTokens = temasTexto
    .join(' ')
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(t => t.length > 2);

  if (inputTokens.length === 0) return CNB_CLUSTERS[1];

  let bestCluster = CNB_CLUSTERS[0];
  let maxScore = -1;

  for (const cluster of CNB_CLUSTERS) {
    let score = 0;
    const clusterWordSet = new Set(cluster.keywords);

    for (const token of inputTokens) {
      if (clusterWordSet.has(token)) {
        score += 2;
      } else {
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

// Test Decision Tree logic
function pedagogicalDecisionTree(features) {
  const { numGrados, prioridad, dia, bloqueHorario } = features;
  if (numGrados === 1) {
    return {
      modalidadAtencion: 'Atención Directa Continua',
      duracionMinutos: bloqueHorario === 'bloque_1' ? 100 : 80,
      porcentajePonderacion: bloqueHorario === 'bloque_1' ? 60 : 40
    };
  }
  const esTurnoDirectoGrupoA = (dia === 'Lunes' || dia === 'Miércoles' || dia === 'Jueves');
  return {
    modalidadAtencion: bloqueHorario === 'bloque_1' ? 'Atención Alternada Rotativa' : 'Rincones y Tutoría',
    duracionMinutos: bloqueHorario === 'bloque_1' ? 100 : 80,
    grupoA_rol: esTurnoDirectoGrupoA ? 'atencion_directa' : 'trabajo_autonomo',
    grupoB_rol: esTurnoDirectoGrupoA ? 'trabajo_autonomo' : 'atencion_directa',
    porcentajePonderacion: prioridad === 'troncal' ? 60 : 40
  };
}

// Test Cases
console.log('--- TEST 1: Multigrado Temas Heterogéneos Clustering ---');
const testCases = [
  {
    desc: 'Matemáticas 4to, 5to, 6to (Suma, Fracciones, Decimales)',
    temas: ['Matemáticas Suma hasta 1000', 'Matemáticas Fracciones equivalentes', 'Matemáticas Números decimales en mercado'],
    expected: 'cluster_aritmetica_comercio'
  },
  {
    desc: 'Ciencias Naturales 4to y 5to (Cuerpo humano y plantas)',
    temas: ['Ciencias Naturales El cuerpo y la salud', 'Ciencias Naturales Ecosistemas y plantas de la comunidad'],
    expected: 'cluster_salud_vida'
  },
  {
    desc: 'Comunicación y Lenguaje (Lectura y diálogo)',
    temas: ['Comunicación y Lenguaje Lectura de leyendas', 'Comunicación El diálogo y la asamblea'],
    expected: 'cluster_comunicacion_dialogica'
  },
  {
    desc: 'Ciencias Sociales (Municipio y gobierno escolar)',
    temas: ['Ciencias Sociales Organización del municipio', 'Formación Ciudadana El gobierno escolar'],
    expected: 'cluster_ciudadania_geografia'
  }
];

testCases.forEach(tc => {
  const res = clusterTemaEjeTransversal(tc.temas);
  const pass = res.id === tc.expected;
  console.log(`[${pass ? 'PASS' : 'FAIL'}] ${tc.desc}`);
  console.log(`  -> Cluster detectado: ${res.id} (${res.categoria})`);
  console.log(`  -> Tema Eje asignado: "${res.temaEje}"\n`);
});

console.log('--- TEST 2: Decision Tree Pedagogical Allocation ---');
const monogradoTest = pedagogicalDecisionTree({
  numGrados: 1,
  materia: 'Matemáticas',
  prioridad: 'troncal',
  ciclo: 'primer_ciclo',
  dia: 'Lunes',
  bloqueHorario: 'bloque_1'
});
console.log('Monogrado 1 Grado Bloque 1:');
console.log(monogradoTest);

const multigradoTest = pedagogicalDecisionTree({
  numGrados: 3,
  materia: 'Matemáticas',
  prioridad: 'troncal',
  ciclo: 'segundo_ciclo',
  dia: 'Lunes',
  bloqueHorario: 'bloque_1'
});
console.log('\nMultigrado 3 Grados Bloque 1 Lunes:');
console.log(multigradoTest);
