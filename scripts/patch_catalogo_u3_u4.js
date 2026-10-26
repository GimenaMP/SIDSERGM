const fs = require('fs');
const path = require('path');

const catalogoPath = path.join(__dirname, '../data/catalogo_indices_extraidos.json');
const catalogo = JSON.parse(fs.readFileSync(catalogoPath, 'utf8'));

// Grado 4 Comunicación U3 y U4
catalogo['4'].cyl[2] = {
  unidad: 3,
  titulo: 'Diálogo Teatral y Figuras Retóricas',
  paginaInicio: 92,
  paginaFin: 134,
  competencias: ['Interpreta textos teatrales identificando recursos poéticos.'],
  indicadoresLogro: ['Diferencia símil y metáfora.', 'Escribe diálogos con guiones largos.'],
  temas: [
    { numero: 1, titulo: 'El símil y la metáfora en textos literarios (Pág. 92)', paginaInicio: 92, paginaFin: 112 },
    { numero: 2, titulo: 'Redacción de guiones teatrales escolares (Pág. 113)', paginaInicio: 113, paginaFin: 134 }
  ]
};
catalogo['4'].cyl[3] = {
  unidad: 4,
  titulo: 'El Periódico Escolar y el Debate Grupal',
  paginaInicio: 136,
  paginaFin: 178,
  competencias: ['Redacta artículos de opinión y noticias objetivas.'],
  indicadoresLogro: ['Distingue las secciones del periódico.', 'Participa con orden en debates.'],
  temas: [
    { numero: 1, titulo: 'Secciones del periódico y la noticia escolar (Pág. 136)', paginaInicio: 136, paginaFin: 156 },
    { numero: 2, titulo: 'Preparación y ejecución de un debate grupal (Pág. 157)', paginaInicio: 157, paginaFin: 178 }
  ]
};

// Grado 5 Comunicación U3 y U4
catalogo['5'].cyl[2] = {
  unidad: 3,
  titulo: 'Poesía, Figuras Literarias y Teatro Escolar',
  paginaInicio: 94,
  paginaFin: 138,
  competencias: ['Interpreta poemas reconociendo metáforas y recursos expresivos.'],
  indicadoresLogro: ['Declamación poética y lectura dramatizada.', 'Uso correcto de signos de puntuación.'],
  temas: [
    { numero: 1, titulo: 'Rima, verso y estrofa en la poesía nacional (Pág. 94)', paginaInicio: 94, paginaFin: 114 },
    { numero: 2, titulo: 'Guion teatral y signos de interrogación/admiración (Pág. 115)', paginaInicio: 115, paginaFin: 138 }
  ]
};
catalogo['5'].cyl[3] = {
  unidad: 4,
  titulo: 'Textos Argumentativos, Ensayos y Tradición Oral',
  paginaInicio: 140,
  paginaFin: 182,
  competencias: ['Participa en mesas redondas sustentando sus ideas con argumentos.'],
  indicadoresLogro: ['Distingue argumentos basados en hechos.', 'Recopila relatos de la tradición oral.'],
  temas: [
    { numero: 1, titulo: 'La mesa redonda y el panel de discusión (Pág. 140)', paginaInicio: 140, paginaFin: 160 },
    { numero: 2, titulo: 'Recopilación de leyendas y relatos orales comunitarios (Pág. 161)', paginaInicio: 161, paginaFin: 182 }
  ]
};

// Grado 6 Comunicación U3 y U4
catalogo['6'].cyl[2] = {
  unidad: 3,
  titulo: 'Literatura Guatemalteca, Leyendas y Teatro Clásico',
  paginaInicio: 94,
  paginaFin: 138,
  competencias: ['Analiza obras de autores guatemaltecos y produce obras teatrales.'],
  indicadoresLogro: ['Identifica pasajes de leyendas tradicionales y Popol Vuh.', 'Montaje de sociodramas comunitarios.'],
  temas: [
    { numero: 1, titulo: 'Lectura de fragmentos del Popol Vuh y literatura nacional (Pág. 94)', paginaInicio: 94, paginaFin: 116 },
    { numero: 2, titulo: 'Elementos de la puesta en escena teatral (Pág. 117)', paginaInicio: 117, paginaFin: 138 }
  ]
};
catalogo['6'].cyl[3] = {
  unidad: 4,
  titulo: 'Medios de Comunicación, Investigación y Citas',
  paginaInicio: 140,
  paginaFin: 182,
  competencias: ['Diseña periódicos murales y cita fuentes bibliográficas correctamente.'],
  indicadoresLogro: ['Distingue fuentes primarias y secundarias.', 'Aplica normas básicas de citación.'],
  temas: [
    { numero: 1, titulo: 'El reportaje periodístico y la infografía escolar (Pág. 140)', paginaInicio: 140, paginaFin: 160 },
    { numero: 2, titulo: 'Fichas bibliográficas y resumen de investigación (Pág. 161)', paginaInicio: 161, paginaFin: 182 }
  ]
};

fs.writeFileSync(catalogoPath, JSON.stringify(catalogo, null, 2), 'utf8');
console.log('✅ catalogo_indices_extraidos.json actualizado con temas en U3 y U4 para Comunicación y Lenguaje 4.°, 5.° y 6.°!');
