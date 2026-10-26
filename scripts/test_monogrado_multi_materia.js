const http = require('http');

const payload = JSON.stringify({
  grados: [3],
  items: [
    { grado: 3, materia: 'Matemáticas', unidad: 1, tema: 'Multiplicación Básica', temaNumero: 1, paginaInicio: 8, paginaFin: 12 },
    { grado: 3, materia: 'Comunicación y Lenguaje', unidad: 1, tema: 'Fábulas y Moralejas', temaNumero: 1, paginaInicio: 10, paginaFin: 14 },
    { grado: 3, materia: 'Medio Social y Natural', unidad: 1, tema: 'Las Plantas Medicinales', temaNumero: 1, paginaInicio: 15, paginaFin: 18 },
    { grado: 3, materia: 'Formación Ciudadana', unidad: 1, tema: 'Normas del Aula', temaNumero: 1, paginaInicio: 20, paginaFin: 24 }
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
      const lunesG3 = json.plan?.dias?.Lunes?.gradosSincronizados?.[0];
      console.log('\n--- MONOGRADO 3ER GRADO LUNES ---');
      console.log('Materias seleccionadas:', lunesG3?.materiasSeleccionadas?.map(m => m.materia));
      console.log('P1:', lunesG3?.periodo1_actividad);
      console.log('P2:', lunesG3?.periodo2_actividad);
      console.log('P3:', lunesG3?.periodo3_actividad);
      console.log('P4:', lunesG3?.periodo4_actividad);
    } catch (err) {
      console.error('Error:', err);
    }
  });
});

req.write(payload);
req.end();
