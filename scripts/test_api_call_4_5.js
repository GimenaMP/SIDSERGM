const http = require('http');

const payload = JSON.stringify({
  grados: [4, 5],
  grado1: '4',
  grado2: '5',
  bloque: 1,
  semana: 1,
  area: 'Matemáticas, Comunicación y Lenguaje, Ciencias Naturales y Tecnología, Ciencias Sociales',
  items: [
    {
      grado: 4,
      materia: 'Matemáticas',
      materiaId: 'mate_4',
      materiaBase: 'matematicas',
      libroTitulo: 'Matemáticas 4.° Grado — MINEDUC',
      unidad: 1,
      unidadTitulo: 'Unidad 1',
      tema: 'Valor posicional hasta centenas de millar',
      temaNumero: 1,
      todosLosTemasNumeros: [1],
      paginaInicio: 8,
      paginaFin: 25,
      competencias: ['Aplica el valor posicional hasta centenas de millar'],
      indicadores: ['Identifica y descompone cantidades'],
      periodosSemanales: 5,
      pesoPorcentaje: 35
    },
    {
      grado: 4,
      materia: 'Comunicación y Lenguaje',
      materiaId: 'comunicacion_4',
      materiaBase: 'comunicacion',
      libroTitulo: 'Comunicación y Lenguaje 4.° Grado — MINEDUC',
      unidad: 1,
      unidadTitulo: 'Unidad 1',
      tema: 'Muchas formas para comunicarnos Expresión oral El diálogo',
      temaNumero: 1,
      todosLosTemasNumeros: [1],
      paginaInicio: 13,
      paginaFin: 14,
      competencias: ['Participa en diálogos respetando normas comunicativas'],
      indicadores: ['Expresa opiniones con claridad'],
      periodosSemanales: 5,
      pesoPorcentaje: 25
    },
    {
      grado: 5,
      materia: 'Matemáticas',
      materiaId: 'mate_5',
      materiaBase: 'matematicas',
      libroTitulo: 'Matemáticas 5.° Grado — MINEDUC',
      unidad: 1,
      unidadTitulo: 'Unidad 1',
      tema: 'Valor posicional y lectura hasta 1,000,000',
      temaNumero: 1,
      todosLosTemasNumeros: [1],
      paginaInicio: 8,
      paginaFin: 36,
      competencias: ['Utiliza el sistema de numeración decimal hasta millones'],
      indicadores: ['Lee y escribe números hasta 1,000,000'],
      periodosSemanales: 5,
      pesoPorcentaje: 35
    },
    {
      grado: 5,
      materia: 'Comunicación y Lenguaje',
      materiaId: 'comunicacion_5',
      materiaBase: 'comunicacion',
      libroTitulo: 'Comunicación y Lenguaje 5.° Grado — MINEDUC',
      unidad: 1,
      unidadTitulo: 'Unidad 1',
      tema: 'Compartamos nuestras experiencias Expresión oral La conversación',
      temaNumero: 1,
      todosLosTemasNumeros: [1],
      paginaInicio: 13,
      paginaFin: 14,
      competencias: ['Comunica ideas mediante conversaciones estructuradas'],
      indicadores: ['Aplica normas de escucha activa y respeto'],
      periodosSemanales: 5,
      pesoPorcentaje: 25
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
      console.log('Tema Eje Transversal:', json.plan?.tema_generador_comun);
      console.log('Propósito Común:', json.plan?.proposito_comun);

      const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves'];
      dias.forEach(d => {
        const diaData = json.plan?.dias?.[d];
        console.log(`\n================== ${d.toUpperCase()} ==================`);
        console.log(`Enfoque: ${diaData?.enfoqueDidactico}`);
        (diaData?.gradosSincronizados || []).forEach(g => {
          console.log(`\n  Grado: ${g.gradoNumero}° Primaria (${g.materia})`);
          console.log(`  Modalidad: ${g.modalidad}`);
          console.log(`  P1: ${g.periodo1_actividad}`);
          console.log(`  P2: ${g.periodo2_actividad}`);
          console.log(`  P3: ${g.periodo3_actividad}`);
          console.log(`  P4: ${g.periodo4_actividad}`);
          console.log(`  Ejercicios (${g.ejerciciosLiterales.length}):`);
          g.ejerciciosLiterales.slice(0, 2).forEach(ej => console.log(`    - ${ej}`));
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
