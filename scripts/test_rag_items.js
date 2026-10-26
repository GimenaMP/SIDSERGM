const { generateUnifiedRAGPlan } = require('../src/utils/ragEngine');

const testItems = [
  {
    grado: 5,
    materia: 'Ciencias Naturales y Tecnología',
    materiaId: 'ciencias_5',
    libroTitulo: 'Ciencias Naturales y Tecnología 5.° Grado — MINEDUC',
    unidad: 1,
    unidadTitulo: 'Los seres vivos y su entorno',
    tema: 'La célula, Reproducción celular',
    temaNumero: 1,
    paginaInicio: 13,
    paginaFin: 15,
    competencias: ['Competencia 1: Describe la estructura y función celular'],
    indicadores: ['1.1 Identifica los tipos de células y organelos']
  },
  {
    grado: 6,
    materia: 'Ciencias Naturales y Tecnología',
    materiaId: 'ciencias_6',
    libroTitulo: 'Ciencias Naturales y Tecnología 6.° Grado — MINEDUC',
    unidad: 1,
    unidadTitulo: 'Reproducción y vida saludable',
    tema: 'Características sexuales, Sistema reproductor',
    temaNumero: 1,
    paginaInicio: 61,
    paginaFin: 65,
    competencias: ['Competencia 1: Explica el funcionamiento de los sistemas del cuerpo humano'],
    indicadores: ['1.1 Describe las características del sistema reproductor']
  }
];

const plan = generateUnifiedRAGPlan({
  grados: [5, 6],
  items: testItems
});

console.log('Generated plan tema generador:', plan.tema_generador_comun);
console.log('Lunes gradosSincronizados:', plan.dias.Lunes.gradosSincronizados.map(g => ({
  grado: g.grado,
  materia: g.materia,
  tema: g.tema,
  pagina: g.numeroPagina,
  libro: g.libroTitulo,
  ejerciciosCount: g.ejerciciosLiterales?.length
})));
