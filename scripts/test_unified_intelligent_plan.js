const { generateUnifiedRAGPlan } = require('../src/utils/ragEngine');

// Simular la selección inteligente de Unidad 1 para 1.° y 6.° Grado
const items = [
  {
    grado: 1,
    materia: 'Matemáticas',
    materiaId: 'mate_1',
    materiaBase: 'matematicas',
    libroTitulo: 'Matemáticas 1.° Grado — MINEDUC',
    unidad: 1,
    unidadTitulo: 'Unidad 1',
    tema: 'Me ubico, Números hasta 10',
    temaNumero: 1,
    todosLosTemasNumeros: [1, 2],
    paginaInicio: 8,
    paginaFin: 50,
    competencias: ['Establece relaciones entre personas, objetos y figuras geométricas'],
    indicadores: ['Identifica posiciones relativas en el espacio'],
    periodosSemanales: 5,
    pesoPorcentaje: 35
  },
  {
    grado: 1,
    materia: 'Medio Social y Natural',
    materiaId: 'medio_1',
    materiaBase: 'medio_social',
    libroTitulo: 'Medio Social y Natural 1.° Grado — MINEDUC',
    unidad: 1,
    unidadTitulo: 'Unidad 1',
    tema: 'Partes del cuerpo humano y sentidos',
    temaNumero: 1,
    todosLosTemasNumeros: [1],
    paginaInicio: 8,
    paginaFin: 24,
    competencias: ['Describe las partes principales del cuerpo humano'],
    indicadores: ['Reconoce los cinco sentidos y sus órganos'],
    periodosSemanales: 4,
    pesoPorcentaje: 20
  },
  {
    grado: 6,
    materia: 'Matemáticas',
    materiaId: 'mate_6',
    materiaBase: 'matematicas',
    libroTitulo: 'Matemáticas 6.° Grado — MINEDUC',
    unidad: 1,
    unidadTitulo: 'Unidad 1',
    tema: 'Conjuntos: operaciones y diagramas de Venn, Jerarquía de operaciones combinadas con paréntesis',
    temaNumero: 1,
    todosLosTemasNumeros: [1, 2],
    paginaInicio: 8,
    paginaFin: 34,
    competencias: ['Aplica operaciones aritméticas y lógica de conjuntos'],
    indicadores: ['Resuelve operaciones combinadas respetando la jerarquía'],
    periodosSemanales: 5,
    pesoPorcentaje: 35
  },
  {
    grado: 6,
    materia: 'Ciencias Naturales y Tecnología',
    materiaId: 'ciencias_6',
    materiaBase: 'ciencias_naturales',
    libroTitulo: 'Ciencias Naturales y Tecnología 6.° Grado — MINEDUC',
    unidad: 1,
    unidadTitulo: 'Unidad 1',
    tema: 'La célula, Organización celular',
    temaNumero: 1,
    todosLosTemasNumeros: [1],
    paginaInicio: 13,
    paginaFin: 15,
    competencias: ['Explica la estructura y niveles de organización celular'],
    indicadores: ['Distingue organelos celulares y tipos de tejidos'],
    periodosSemanales: 3,
    pesoPorcentaje: 20
  }
];

const plan = generateUnifiedRAGPlan({
  grados: [1, 6],
  items: items
});

console.log('=== TEST DE NO REPETICIÓN ENTRE DÍAS Y GRADOS ===');
const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves'];

const allTextsSeen = new Set();
let duplicatesFound = 0;

dias.forEach(d => {
  console.log(`\n========================================`);
  console.log(`DÍA: ${d.toUpperCase()}`);
  console.log(`========================================`);
  const diaPlan = plan.dias[d];

  diaPlan.gradosSincronizados.forEach(gSchedule => {
    console.log(`\n  --- GRADO: ${gSchedule.grado} (${gSchedule.materia}) ---`);
    console.log(`  Tema: ${gSchedule.tema}`);
    console.log(`  Páginas: ${gSchedule.numeroPagina}-${gSchedule.paginaFin}`);
    console.log(`  Modalidad: ${gSchedule.modalidad}`);
    console.log(`  P1: ${gSchedule.periodo1_actividad}`);
    console.log(`  P2: ${gSchedule.periodo2_actividad}`);
    console.log(`  P3: ${gSchedule.periodo3_actividad}`);
    console.log(`  P4: ${gSchedule.periodo4_actividad}`);
    console.log(`  Tarea: ${gSchedule.tareaCasa}`);
    console.log(`  Ejercicios del libro (${gSchedule.ejerciciosLiterales.length}):`);
    gSchedule.ejerciciosLiterales.slice(0, 2).forEach(ej => console.log(`    - ${ej}`));

    // Validar que no haya texto de 'Estimado estudiante' ni índices
    gSchedule.ejerciciosLiterales.forEach(ej => {
      if (/estimado|índice|autoridades/i.test(ej)) {
        console.error(`  ❌ ERROR: Ejercicio contiene portada/índice: ${ej}`);
        duplicatesFound++;
      }
    });

    // Validar unicidad de actividades por período
    const pTexts = [
      gSchedule.periodo1_actividad,
      gSchedule.periodo2_actividad,
      gSchedule.periodo3_actividad,
      gSchedule.periodo4_actividad,
      gSchedule.tareaCasa
    ];

    pTexts.forEach(txt => {
      if (allTextsSeen.has(txt)) {
        console.error(`  ❌ ERROR DUPLICADO DETECTADO: "${txt}" ya apareció antes!`);
        duplicatesFound++;
      } else {
        allTextsSeen.add(txt);
      }
    });
  });
});

console.log(`\n========================================`);
console.log(`RESULTADO DE LA AUDITORÍA DE UNICIDAD Y FACTICIDAD`);
console.log(`Total de textos únicos registrados: ${allTextsSeen.size}`);
console.log(`Total de duplicados o anomalías: ${duplicatesFound}`);
if (duplicatesFound === 0) {
  console.log(`✅ ¡ÉXITO TOTAL! No hay textos repetidos entre días ni entre grados.`);
} else {
  console.error(`❌ FALLÓ LA AUDITORÍA: Se detectaron repeticiones.`);
  process.exit(1);
}
