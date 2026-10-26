const { generateUnifiedRAGPlan } = require('../src/utils/ragEngine');

const testItems = [
  {
    grado: 5,
    materia: 'Matemáticas',
    materiaId: 'mate_5',
    libroTitulo: 'Matemáticas 5.° Grado — MINEDUC',
    unidad: 1,
    unidadTitulo: 'Operaciones con números naturales',
    tema: 'Suma y resta de fracciones homogéneas',
    temaNumero: 2,
    paginaInicio: 20,
    paginaFin: 24,
    competencias: ['Competencia 1: Aplica las operaciones aritméticas con fracciones'],
    indicadores: ['1.1 Resuelve adiciones de fracciones con igual denominador'],
    periodosSemanales: 5,
    pesoPorcentaje: 20
  },
  {
    grado: 6,
    materia: 'Matemáticas',
    materiaId: 'mate_6',
    libroTitulo: 'Matemáticas 6.° Grado — MINEDUC',
    unidad: 1,
    unidadTitulo: 'Razonamiento proporcional',
    tema: 'Regla de tres simple directa en compras y ventas',
    temaNumero: 2,
    paginaInicio: 30,
    paginaFin: 34,
    competencias: ['Competencia 1: Utiliza la proporcionalidad para resolver situaciones de la vida diaria'],
    indicadores: ['1.1 Plantea y resuelve proporciones directas'],
    periodosSemanales: 5,
    pesoPorcentaje: 20
  }
];

const plan = generateUnifiedRAGPlan({
  grados: [5, 6],
  items: testItems
});

console.log('=== TEST DE NO REPETICIÓN Y DIVISIÓN POR PERÍODOS ===');
const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves'];

// Comprobar cada grado
[5, 6].forEach(gradoNum => {
  console.log(`\n--- VERIFICACIÓN GRADO ${gradoNum}.° PRIMARIA ---`);
  const actividadesDocente = [];
  const actividadesEstudiante = [];
  const p1List = [];
  const p2List = [];
  const p3List = [];
  const p4List = [];
  const tareas = [];

  dias.forEach(d => {
    const diaPlan = plan.dias[d];
    const gSchedule = diaPlan.gradosSincronizados.find(g => g.gradoNumero === gradoNum);

    console.log(`\n[${d}] Grado ${gradoNum}:`);
    console.log(`  Modalidad: ${gSchedule.modalidad}`);
    console.log(`  P1 (08:15 - 09:05): ${gSchedule.periodo1_actividad.slice(0, 85)}...`);
    console.log(`  P2 (09:05 - 09:55): ${gSchedule.periodo2_actividad.slice(0, 85)}...`);
    console.log(`  P3 (10:30 - 11:15): ${gSchedule.periodo3_actividad.slice(0, 85)}...`);
    console.log(`  P4 (11:15 - 11:50): ${gSchedule.periodo4_actividad.slice(0, 85)}...`);
    console.log(`  Tarea en casa: ${gSchedule.tareaCasa}`);

    actividadesDocente.push(gSchedule.actividadDocente);
    actividadesEstudiante.push(gSchedule.actividadEstudiante);
    p1List.push(gSchedule.periodo1_actividad);
    p2List.push(gSchedule.periodo2_actividad);
    p3List.push(gSchedule.periodo3_actividad);
    p4List.push(gSchedule.periodo4_actividad);
    tareas.push(gSchedule.tareaCasa);
  });

  // Validar unicidad (sin duplicados entre días)
  const setDoc = new Set(actividadesDocente);
  const setP1 = new Set(p1List);
  const setP2 = new Set(p2List);
  const setP3 = new Set(p3List);
  const setP4 = new Set(p4List);
  const setTareas = new Set(tareas);

  console.log(`\nResultados Grado ${gradoNum}:`);
  console.log(`- Actividades Docente únicas: ${setDoc.size} / 4 ${setDoc.size === 4 ? '✅ PASÓ' : '❌ REPETIDO'}`);
  console.log(`- Período 1 únicos: ${setP1.size} / 4 ${setP1.size === 4 ? '✅ PASÓ' : '❌ REPETIDO'}`);
  console.log(`- Período 2 únicos: ${setP2.size} / 4 ${setP2.size === 4 ? '✅ PASÓ' : '❌ REPETIDO'}`);
  console.log(`- Período 3 únicos: ${setP3.size} / 4 ${setP3.size === 4 ? '✅ PASÓ' : '❌ REPETIDO'}`);
  console.log(`- Período 4 únicos: ${setP4.size} / 4 ${setP4.size === 4 ? '✅ PASÓ' : '❌ REPETIDO'}`);
  console.log(`- Tareas en casa únicas: ${setTareas.size} / 4 ${setTareas.size === 4 ? '✅ PASÓ' : '❌ REPETIDO'}`);

  if (setP1.size !== 4 || setP2.size !== 4 || setP3.size !== 4 || setP4.size !== 4) {
    console.error('ERROR: Hay textos repetidos entre los días!');
    process.exit(1);
  }
});

console.log('\n✅ ¡TODOS LOS DÍAS TIENEN TEXTOS Y PROGRESIONES COMPLETAMENTE DIFERENTES Y DIVIDIDOS POR PERÍODOS!');
