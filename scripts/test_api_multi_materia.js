const http = require('http');

const payload = JSON.stringify({
  grados: [4, 5],
  items: [
    { grado: 4, materia: 'Matemáticas', unidad: 1, tema: 'Números hasta 100,000', temaNumero: 1, paginaInicio: 8, paginaFin: 12 },
    { grado: 4, materia: 'Comunicación y Lenguaje', unidad: 1, tema: 'La Narración y el Cuento', temaNumero: 1, paginaInicio: 10, paginaFin: 14 },
    { grado: 4, materia: 'Ciencias Naturales y Tecnología', unidad: 1, tema: 'El Cuerpo Humano y la Célula', temaNumero: 1, paginaInicio: 15, paginaFin: 18 },
    { grado: 4, materia: 'Ciencias Sociales', unidad: 1, tema: 'El Municipio y la Comunidad', temaNumero: 1, paginaInicio: 20, paginaFin: 24 },
    { grado: 5, materia: 'Matemáticas', unidad: 1, tema: 'Números hasta 1,000,000', temaNumero: 1, paginaInicio: 8, paginaFin: 12 },
    { grado: 5, materia: 'Comunicación y Lenguaje', unidad: 1, tema: 'Textos Informativos', temaNumero: 1, paginaInicio: 10, paginaFin: 14 },
    { grado: 5, materia: 'Ciencias Naturales y Tecnología', unidad: 1, tema: 'Los Ecosistemas', temaNumero: 1, paginaInicio: 15, paginaFin: 18 },
    { grado: 5, materia: 'Ciencias Sociales', unidad: 1, tema: 'Geografía de Guatemala', temaNumero: 1, paginaInicio: 20, paginaFin: 24 }
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
}, (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('HTTP Status:', res.statusCode);
      console.log('Success:', json.success);
      console.log('Tema Generador Común:', json.plan?.tema_generador_comun);

      const lunes = json.plan?.dias?.Lunes;
      if (lunes && lunes.gradosSincronizados) {
        console.log('\n--- LUNES GRADO 4 ---');
        const g4 = lunes.gradosSincronizados[0];
        console.log('Materias seleccionadas en detalle:', g4.materiasSeleccionadas?.map(m => `${m.materia} (Pág. ${m.paginaInicio})`));
        console.log('\nPeriodo 1:', g4.periodo1_actividad);
        console.log('\nPeriodo 2:', g4.periodo2_actividad);
        console.log('\nPeriodo 3:', g4.periodo3_actividad);
        console.log('\nPeriodo 4:', g4.periodo4_actividad);

        console.log('\n--- LUNES GRADO 5 ---');
        const g5 = lunes.gradosSincronizados[1];
        console.log('Periodo 1:', g5.periodo1_actividad);
        console.log('Periodo 2:', g5.periodo2_actividad);
        console.log('Periodo 3:', g5.periodo3_actividad);
        console.log('Periodo 4:', g5.periodo4_actividad);
      } else {
        console.log('No lunes data found:', data.slice(0, 300));
      }
    } catch (err) {
      console.error('Error parsing JSON:', err, data.slice(0, 300));
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e);
});

req.write(payload);
req.end();
