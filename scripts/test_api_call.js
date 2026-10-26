const http = require('http');

const payload = JSON.stringify({
  grados: [1, 6],
  grado1: '1',
  grado2: '6',
  bloque: 1,
  semana: 1,
  area: 'Matemáticas, Medio Social y Natural, Ciencias Naturales y Tecnología',
  items: [
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
      competencias: ['Establece relaciones espaciales'],
      indicadores: ['Identifica posiciones'],
      periodosSemanales: 5,
      pesoPorcentaje: 35
    },
    {
      grado: 6,
      materia: 'Matemáticas',
      materiaId: 'mate_6',
      materiaBase: 'matematicas',
      libroTitulo: 'Matemáticas 6.° Grado — MINEDUC',
      unidad: 1,
      unidadTitulo: 'Unidad 1',
      tema: 'Conjuntos: operaciones y diagramas de Venn',
      temaNumero: 1,
      todosLosTemasNumeros: [1, 2],
      paginaInicio: 8,
      paginaFin: 34,
      competencias: ['Aplica lógica de conjuntos'],
      indicadores: ['Opera conjuntos'],
      periodosSemanales: 5,
      pesoPorcentaje: 35
    }
  ]
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/planificacion',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
}, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('HTTP Status:', res.statusCode);
      console.log('Success:', json.success);
      console.log('Fuente:', json.fuente || 'gemini_grounded');
      console.log('Tema Generador Común:', json.plan?.tema_generador_comun);

      const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves'];
      dias.forEach(d => {
        const diaData = json.plan?.dias?.[d];
        console.log(`\n--- ${d} ---`);
        (diaData?.gradosSincronizados || []).forEach(g => {
          console.log(`Grado: ${g.gradoNumero}° | P1: ${g.periodo1_actividad.slice(0, 80)}... | Pag: ${g.numeroPagina}-${g.paginaFin}`);
        });
      });
    } catch (e) {
      console.error('Error parsing response:', e, data.slice(0, 300));
    }
  });
});

req.on('error', e => console.error('Req error:', e));
req.write(payload);
req.end();
