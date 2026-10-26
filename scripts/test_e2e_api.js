const http = require('http');

const payload = JSON.stringify({
  grados: [5, 6],
  items: [
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
      indicadores: ['1.1 Identifica los tipos de células y organelos'],
      periodosSemanales: 3,
      pesoPorcentaje: 10
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
      indicadores: ['1.1 Describe las características del sistema reproductor'],
      periodosSemanales: 3,
      pesoPorcentaje: 10
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
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('HTTP Status:', res.statusCode);
    try {
      const data = JSON.parse(body);
      console.log('Success:', data.success);
      console.log('Fuente:', data.fuente);
      console.log('Tema Generador:', data.tema_generador_comun);
      if (data.plan && data.plan.dias && data.plan.dias.Lunes) {
        console.log('Lunes Grados Sincronizados:');
        data.plan.dias.Lunes.gradosSincronizados.forEach(g => {
          console.log(`- ${g.grado}: ${g.materia} | ${g.tema} | Pág. ${g.numeroPagina}-${g.paginaFin} | Ejercicios: ${g.ejerciciosLiterales?.length}`);
        });
      }
    } catch (e) {
      console.error('Error parsing JSON:', e, body.slice(0, 500));
    }
  });
});

req.on('error', err => {
  console.error('Request error:', err.message);
});

req.write(payload);
req.end();
