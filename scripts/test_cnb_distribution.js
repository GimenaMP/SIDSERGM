const { generateUnifiedRAGPlan } = require('../src/utils/ragEngine');

// Simulamos la selección de un docente de aula multigrado (3.º y 4.º Primaria)
// con 4 materias seleccionadas: Matemáticas, Comunicación y Lenguaje, Ciencias Naturales y Ciencias Sociales
const items = [
  // 3.° Primaria
  {
    grado: 3,
    materia: 'Matemáticas',
    temaNumero: 1,
    unidad: 1,
    tema: 'Centenas y valor posicional',
    paginaInicio: 8,
    paginaFin: 11,
    temasSeleccionados: [
      { numero: 1, titulo: 'Centenas y valor posicional', paginaInicio: 8, paginaFin: 9 },
      { numero: 2, titulo: 'Lectura y escritura hasta 999', paginaInicio: 9, paginaFin: 10 },
      { numero: 3, titulo: 'Comparación y orden de números', paginaInicio: 10, paginaFin: 11 },
      { numero: 4, titulo: 'Cálculo mental y aproximaciones', paginaInicio: 11, paginaFin: 12 }
    ]
  },
  {
    grado: 3,
    materia: 'Comunicación y Lenguaje L1',
    temaNumero: 1,
    unidad: 1,
    tema: 'Narración de anécdotas comunitarias',
    paginaInicio: 14,
    paginaFin: 17,
    temasSeleccionados: [
      { numero: 1, titulo: 'Narración de anécdotas comunitarias', paginaInicio: 14, paginaFin: 15 },
      { numero: 2, titulo: 'Estructura del relato: inicio, nudo y desenlace', paginaInicio: 15, paginaFin: 16 },
      { numero: 3, titulo: 'El sustantivo y concordancia gramatical', paginaInicio: 16, paginaFin: 17 },
      { numero: 4, titulo: 'Círculo de lectura y redacción guiada', paginaInicio: 17, paginaFin: 18 }
    ]
  },
  {
    grado: 3,
    materia: 'Ciencias Naturales y Tecnología',
    temaNumero: 1,
    unidad: 1,
    tema: 'Los seres vivos y su entorno natural',
    paginaInicio: 20,
    paginaFin: 22,
    temasSeleccionados: [
      { numero: 1, titulo: 'Características de los seres vivos', paginaInicio: 20, paginaFin: 21 },
      { numero: 2, titulo: 'Clasificación de animales y plantas locales', paginaInicio: 21, paginaFin: 22 }
    ]
  },
  {
    grado: 3,
    materia: 'Ciencias Sociales',
    temaNumero: 1,
    unidad: 1,
    tema: 'Mi comunidad y sus raíces históricas',
    paginaInicio: 30,
    paginaFin: 32,
    temasSeleccionados: [
      { numero: 1, titulo: 'Historia y costumbres de nuestra comunidad', paginaInicio: 30, paginaFin: 31 },
      { numero: 2, titulo: 'Lugares sagrados y patrimonio cultural', paginaInicio: 31, paginaFin: 32 }
    ]
  }
];

console.log('=== TEST DE DISTRIBUCIÓN DIDÁCTICA CNB ===');
const plan = generateUnifiedRAGPlan({
  grados: [3],
  bimestre: 1,
  semana: 1,
  area: 'Todas las Asignaturas',
  items
});

const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves'];

dias.forEach(d => {
  const diaPlan = plan.dias[d];
  const g3 = diaPlan.gradosSincronizados[0];
  console.log(`\n--------------------------------------------`);
  console.log(`📅 DÍA: ${d.toUpperCase()}`);
  console.log(`Materias efectivas de hoy (${g3.materiasSeleccionadas.length}):`);
  g3.materiasSeleccionadas.forEach((m, idx) => {
    console.log(`  Período ${idx + 1}: ${m.materia} -> "${m.tema}" (Pág. ${m.paginaInicio})`);
  });
  console.log(`Actividad Período 3:`);
  console.log(`  ${g3.periodo3_actividad}`);
  console.log(`Actividad Período 4:`);
  console.log(`  ${g3.periodo4_actividad}`);
});
