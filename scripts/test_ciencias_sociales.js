const { generateUnifiedRAGPlan } = require('../src/utils/ragEngine');

// Simular llamada con Grado 6 y 4 materias: Matemáticas, Comunicación, Ciencias Naturales, Ciencias Sociales
const items = [
  {
    grado: 6,
    materia: 'Matemáticas',
    libroTitulo: 'Matemáticas 6.° Primaria',
    unidad: 1,
    unidadTitulo: 'Números y Operaciones',
    tema: 'Operaciones combinadas',
    temaNumero: 1,
    temasSeleccionados: [
      { numero: 1, titulo: 'Operaciones combinadas (Pág. 14)', paginaInicio: 14, paginaFin: 14 },
      { numero: 2, titulo: 'Jerarquía de operaciones (Pág. 15)', paginaInicio: 15, paginaFin: 15 },
      { numero: 3, titulo: 'Propiedades numéricas (Pág. 16)', paginaInicio: 16, paginaFin: 16 },
      { numero: 4, titulo: 'Resolución de problemas (Pág. 17)', paginaInicio: 17, paginaFin: 17 }
    ],
    paginaInicio: 14,
    paginaFin: 17,
    competencias: ['Aplica operaciones combinadas'],
    indicadores: ['Resuelve ejercicios']
  },
  {
    grado: 6,
    materia: 'Comunicación y Lenguaje',
    libroTitulo: 'Comunicación y Lenguaje 6.° Primaria',
    unidad: 1,
    unidadTitulo: 'Lectura y Redacción',
    tema: 'La comunicación asertiva',
    temaNumero: 1,
    temasSeleccionados: [
      { numero: 1, titulo: 'Elementos de la comunicación (Pág. 10)', paginaInicio: 10, paginaFin: 10 },
      { numero: 2, titulo: 'Funciones del lenguaje (Pág. 11)', paginaInicio: 11, paginaFin: 11 },
      { numero: 3, titulo: 'Signos de puntuación (Pág. 12)', paginaInicio: 12, paginaFin: 12 },
      { numero: 4, titulo: 'Redacción de párrafos (Pág. 13)', paginaInicio: 13, paginaFin: 13 }
    ],
    paginaInicio: 10,
    paginaFin: 13,
    competencias: ['Comunica asertivamente'],
    indicadores: ['Redacta párrafos']
  },
  {
    grado: 6,
    materia: 'Ciencias Naturales y Tecnología',
    libroTitulo: 'Ciencias Naturales 6.° Primaria',
    unidad: 1,
    unidadTitulo: 'Ecosistemas y Vida',
    tema: 'La célula y los tejidos',
    temaNumero: 1,
    temasSeleccionados: [
      { numero: 1, titulo: 'Estructura celular (Pág. 18)', paginaInicio: 18, paginaFin: 18 },
      { numero: 2, titulo: 'Organelos celulares (Pág. 19)', paginaInicio: 19, paginaFin: 19 },
      { numero: 3, titulo: 'Tejidos vegetales (Pág. 20)', paginaInicio: 20, paginaFin: 20 },
      { numero: 4, titulo: 'Tejidos animales (Pág. 21)', paginaInicio: 21, paginaFin: 21 }
    ],
    paginaInicio: 18,
    paginaFin: 21,
    competencias: ['Explica la estructura celular'],
    indicadores: ['Distingue organelos']
  },
  {
    grado: 6,
    materia: 'Ciencias Sociales',
    libroTitulo: 'Ciencias Sociales 6.° Primaria',
    unidad: 1,
    unidadTitulo: 'La Prehistoria y Civilizaciones Antiguas',
    tema: 'La Prehistoria',
    temaNumero: 1,
    temasSeleccionados: [
      { numero: 1, titulo: 'La Prehistoria (Pág. 13)', paginaInicio: 13, paginaFin: 13 },
      { numero: 2, titulo: 'Paleolítico (Pág. 13)', paginaInicio: 13, paginaFin: 13 },
      { numero: 3, titulo: 'Neolítico y la sedentarización (Pág. 14)', paginaInicio: 14, paginaFin: 14 },
      { numero: 4, titulo: 'Edad de los metales (Pág. 14)', paginaInicio: 14, paginaFin: 14 }
    ],
    paginaInicio: 13,
    paginaFin: 14,
    competencias: ['Explica los orígenes de la humanidad'],
    indicadores: ['Identifica etapas de la prehistoria']
  }
];

const plan = generateUnifiedRAGPlan({
  grados: [6],
  bimestre: 1,
  bloque: 1,
  items: items
});

console.log('=== TEST RESULT FOR CIENCIAS SOCIALES (PERIODO 4) ===');
['Lunes', 'Martes', 'Miércoles', 'Jueves'].forEach(dia => {
  const gSchedule = plan.dias[dia].gradosSincronizados[0];
  console.log(`\n📅 ${dia}:`);
  console.log('Periodo 4 Actividad:', gSchedule.periodo4_actividad);
  const csDetail = gSchedule.materiasSeleccionadas?.[3];
  console.log('Materia 4 Detalle:', csDetail?.materia, '| Tema:', csDetail?.tema, '| Pág:', csDetail?.paginaInicio);
  console.log('Ejercicios Mineduc:', csDetail?.ejerciciosLiterales?.[0]);
});
