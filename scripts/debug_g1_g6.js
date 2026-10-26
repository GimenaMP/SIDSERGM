const { generateUnifiedRAGPlan } = require('../src/utils/ragEngine');

const testItems = [
  {
    grado: 1,
    materia: 'Matemáticas',
    materiaId: 'matematicas_1',
    materiaBase: 'matematicas',
    libroTitulo: 'Matemáticas 1.er Grado (MINEDUC)',
    unidad: 1,
    unidadTitulo: 'Me ubico y Números hasta 10',
    tema: 'Me ubico',
    temaNumero: 1,
    todosLosTemasNumeros: [1],
    paginaInicio: 6,
    paginaFin: 17,
    competencias: ['Establece relaciones espaciales'],
    indicadores: ['Ubica objetos en el espacio']
  },
  {
    grado: 6,
    materia: 'Matemáticas',
    materiaId: 'matematicas_6',
    materiaBase: 'matematicas',
    libroTitulo: 'Matemáticas 6.° Grado (MINEDUC)',
    unidad: 1,
    unidadTitulo: 'Teoría de Conjuntos',
    tema: 'Conjuntos: operaciones y diagramas de Venn',
    temaNumero: 1,
    todosLosTemasNumeros: [1],
    paginaInicio: 6,
    paginaFin: 20,
    competencias: ['Maneja operaciones de conjuntos'],
    indicadores: ['Aplica unión e intersección']
  }
];

const plan = generateUnifiedRAGPlan({
  grados: [1, 6],
  items: testItems
});

console.log('Lunes G1:');
const g1 = plan.dias.Lunes.gradosSincronizados.find(g => g.gradoNumero === 1);
console.log('G1 tema:', g1.tema);
console.log('G1 P1:', g1.periodo1_actividad);
console.log('G1 P2:', g1.periodo2_actividad);

console.log('Lunes G6:');
const g6 = plan.dias.Lunes.gradosSincronizados.find(g => g.gradoNumero === 6);
console.log('G6 tema:', g6.tema);
console.log('G6 P1:', g6.periodo1_actividad);
console.log('G6 P2:', g6.periodo2_actividad);
