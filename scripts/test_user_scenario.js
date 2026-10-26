const http = require('http');

const payload = {
  grados: [5, 6],
  grado1: '5',
  grado2: '6',
  bloque: 1,
  semana: 1,
  area: 'Matemáticas, Comunicación y Lenguaje, Ciencias Naturales y Tecnología, Ciencias Sociales',
  items: [
    {
      grado: 5,
      materia: 'Matemáticas',
      materiaId: 'matematicas_5',
      materiaBase: 'matematicas',
      libroTitulo: 'Matemáticas 5.° Grado (MINEDUC)',
      unidad: 1,
      unidadTitulo: 'Unidad 1',
      tema: 'Múltiplos y MCM',
      temaNumero: 1,
      paginaInicio: 10,
      paginaFin: 13,
      competencias: ['Aplica el pensamiento lógico'],
      indicadores: ['Calcula múltiplos']
    },
    {
      grado: 6,
      materia: 'Matemáticas',
      materiaId: 'matematicas_6',
      materiaBase: 'matematicas',
      libroTitulo: 'Matemáticas 6.° Grado (MINEDUC)',
      unidad: 1,
      unidadTitulo: 'Unidad 1',
      tema: 'Múltiplos, Divisores y MCD',
      temaNumero: 1,
      paginaInicio: 10,
      paginaFin: 13,
      competencias: ['Aplica el razonamiento matemático'],
      indicadores: ['Calcula múltiplos y divisores']
    },
    {
      grado: 5,
      materia: 'Comunicación y Lenguaje',
      materiaId: 'comunicacion_5',
      materiaBase: 'comunicacion',
      libroTitulo: 'Comunicación y Lenguaje 5.° Grado (MINEDUC)',
      unidad: 1,
      unidadTitulo: 'Unidad 1',
      tema: 'La Fábula y el Lenguaje Figurado',
      temaNumero: 1,
      paginaInicio: 14,
      paginaFin: 17,
      competencias: ['Comprende textos narrativos'],
      indicadores: ['Identifica la moraleja']
    },
    {
      grado: 6,
      materia: 'Comunicación y Lenguaje',
      materiaId: 'comunicacion_6',
      materiaBase: 'comunicacion',
      libroTitulo: 'Comunicación y Lenguaje 6.° Grado (MINEDUC)',
      unidad: 1,
      unidadTitulo: 'Unidad 1',
      tema: 'El Ensayo Argumentativo',
      temaNumero: 1,
      paginaInicio: 14,
      paginaFin: 17,
      competencias: ['Redacta textos con coherencia'],
      indicadores: ['Argumenta opiniones']
    },
    {
      grado: 5,
      materia: 'Ciencias Naturales y Tecnología',
      materiaId: 'ciencias_naturales_5',
      materiaBase: 'ciencias_naturales',
      libroTitulo: 'Ciencias Naturales y Tecnología 5.° Grado (MINEDUC)',
      unidad: 1,
      unidadTitulo: 'Unidad 1',
      tema: 'La célula, organelos y mitocondrias',
      temaNumero: 1,
      paginaInicio: 18,
      paginaFin: 21,
      competencias: ['Identifica la célula'],
      indicadores: ['Describe organelos']
    },
    {
      grado: 6,
      materia: 'Ciencias Naturales y Tecnología',
      materiaId: 'ciencias_naturales_6',
      materiaBase: 'ciencias_naturales',
      libroTitulo: 'Ciencias Naturales y Tecnología 6.° Grado (MINEDUC)',
      unidad: 1,
      unidadTitulo: 'Unidad 1',
      tema: 'Reproducción celular y mitosis',
      temaNumero: 1,
      paginaInicio: 22,
      paginaFin: 25,
      competencias: ['Explica la división celular'],
      indicadores: ['Distingue mitosis y meiosis']
    },
    {
      grado: 5,
      materia: 'Ciencias Sociales',
      materiaId: 'ciencias_sociales_5',
      materiaBase: 'ciencias_sociales',
      libroTitulo: 'Ciencias Sociales 5.° Grado (MINEDUC)',
      unidad: 1,
      unidadTitulo: 'Unidad 1',
      tema: 'Sociedades prehistóricas de América',
      temaNumero: 1,
      paginaInicio: 16,
      paginaFin: 19,
      competencias: ['Describe el poblamiento de América'],
      indicadores: ['Identifica pueblos originarios']
    },
    {
      grado: 6,
      materia: 'Ciencias Sociales',
      materiaId: 'ciencias_sociales_6',
      materiaBase: 'ciencias_sociales',
      libroTitulo: 'Ciencias Sociales 6.° Grado (MINEDUC)',
      unidad: 1,
      unidadTitulo: 'Unidad 1',
      tema: 'El Paleolítico y los primeros pobladores',
      temaNumero: 1,
      paginaInicio: 16,
      paginaFin: 19,
      competencias: ['Explica los periodos históricos'],
      indicadores: ['Caracteriza el paleolítico']
    }
  ]
};

const postData = JSON.stringify(payload);
const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/planificacion',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
}, (res) => {
  let raw = '';
  res.on('data', c => raw += c);
  res.on('end', () => {
    try {
      const json = JSON.parse(raw);
      const plan = json.plan;
      console.log('Status: 200, Fuente:', json.fuente);

      ['Lunes', 'Jueves'].forEach(dia => {
        console.log('\n================ ' + dia.toUpperCase() + ' ================');
        const dData = plan.dias[dia];
        console.log('Tema Eje P3 del día:', dData.temaEjePeriodo3);
        dData.gradosSincronizados.forEach(gs => {
          console.log('\n--- ' + gs.grado + ' ---');
          console.log('P1 (Matemáticas):', gs.periodo1_actividad ? gs.periodo1_actividad.slice(0, 100) : 'N/A');
          console.log('P2 (Comunicación):', gs.periodo2_actividad ? gs.periodo2_actividad.slice(0, 100) : 'N/A');
          console.log('P3 (Ciencias):', gs.periodo3_actividad ? gs.periodo3_actividad.slice(0, 100) : 'N/A');
          console.log('P4 (Complementaria):', gs.periodo4_actividad ? gs.periodo4_actividad.slice(0, 100) : 'N/A');
        });
      });
    } catch (e) {
      console.error('Error parseando respuesta:', e.message, raw.slice(0, 300));
    }
  });
});

req.on('error', e => console.error(e));
req.write(postData);
req.end();
