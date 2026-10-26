const http = require('http');

const payload = JSON.stringify({
  grados: [5, 6],
  grado1: "5",
  grado2: "6",
  bloque: 1,
  semana: 1,
  area: "Ciencias Naturales y Tecnología, Ciencias Sociales",
  items: [
    {
      grado: 5,
      materia: "Ciencias Naturales y Tecnología",
      materiaId: "ciencias_naturales_5",
      materiaBase: "ciencias_naturales",
      libroTitulo: "Ciencias Naturales y Tecnología 5.°",
      unidad: 1,
      unidadTitulo: "La vida y los seres vivos",
      tema: "La célula y sus partes: organelos y mitocondrias",
      temaNumero: 1,
      todosLosTemasNumeros: [1, 2],
      temasSeleccionados: [
        { numero: 1, titulo: "La célula y sus organelos: membrana, citoplasma y mitocondrias", paginaInicio: 18, paginaFin: 19 },
        { numero: 2, titulo: "Estructura celular animal y vegetal", paginaInicio: 20, paginaFin: 21 }
      ],
      paginaInicio: 18,
      paginaFin: 21,
      competencias: ["Identifica la estructura de la célula y su funcionamiento"],
      indicadores: ["Describe la célula como unidad estructural de los seres vivos"],
      periodosSemanales: 3,
      pesoPorcentaje: 10
    },
    {
      grado: 6,
      materia: "Ciencias Naturales y Tecnología",
      materiaId: "ciencias_naturales_6",
      materiaBase: "ciencias_naturales",
      libroTitulo: "Ciencias Naturales y Tecnología 6.°",
      unidad: 1,
      unidadTitulo: "Fisiología y reproducción celular",
      tema: "La reproducción celular: mitosis y meiosis",
      temaNumero: 1,
      todosLosTemasNumeros: [1, 2],
      temasSeleccionados: [
        { numero: 1, titulo: "La reproducción celular: ciclo celular y fases de la mitosis", paginaInicio: 24, paginaFin: 25 },
        { numero: 2, titulo: "Meiosis y continuidad genética", paginaInicio: 26, paginaFin: 27 }
      ],
      paginaInicio: 24,
      paginaFin: 27,
      competencias: ["Explica los procesos de reproducción celular y herencia"],
      indicadores: ["Diferencia las etapas de la mitosis y su importancia biológica"],
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
}, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    try {
      const json = JSON.parse(body);
      console.log('Success:', json.success);
      console.log('Fuente:', json.fuente);
      console.log('Tema Generador Común:', json.tema_generador_comun);
      console.log('Descripción Eje Integrador:', json.plan?.descripcion_eje_integrador);
      const lunes = json.plan?.dias?.Lunes;
      console.log('\n--- LUNES ---');
      console.log('Enfoque Didáctico:', lunes?.enfoqueDidactico);
      lunes?.gradosSincronizados?.forEach(g => {
        console.log(`\nGrado: ${g.grado}`);
        console.log(`Período 1: ${g.periodo1_actividad}`);
        console.log(`Período 2: ${g.periodo2_actividad}`);
        console.log(`Período 3: ${g.periodo3_actividad}`);
        console.log(`Período 4: ${g.periodo4_actividad}`);
        console.log(`Libro: ${g.libroTitulo} (Pág. ${g.numeroPagina})`);
        console.log(`Ejercicios:`, g.ejerciciosLiterales);
      });
    } catch (e) {
      console.log('Body:', body.slice(0, 500));
    }
  });
});

req.on('error', e => console.error(e));
req.write(payload);
req.end();
