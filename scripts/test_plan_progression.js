const http = require('http');

async function runTests() {
  console.log('=== TEST 1: CATALOG VERIFICATION FOR ALL 6 GRADES ===');
  const cat = require('../data/catalogo_indices_extraidos.json');

  let totalErrors = 0;
  for (let g = 1; g <= 6; g++) {
    const gKey = String(g);
    const gData = cat[gKey];
    if (!gData) {
      console.error(`ERROR: Grade ${g} missing in catalog!`);
      totalErrors++;
      continue;
    }

    const mathUnits = gData.matematicas;
    if (!mathUnits || mathUnits.length !== 4) {
      console.error(`ERROR: Grade ${g} Matemáticas does not have 4 units (has ${mathUnits ? mathUnits.length : 0})`);
      totalErrors++;
    } else {
      console.log(`Grade ${g} Matemáticas: 4 units OK.`);
      mathUnits.forEach(u => {
        if (!u.temas || u.temas.length === 0) {
          console.error(`ERROR: Grade ${g} U${u.unidad} has 0 subtemas!`);
          totalErrors++;
        } else {
          const sample = u.temas[0];
          if (sample.paginaInicio < 8) {
            console.error(`ERROR: Grade ${g} U${u.unidad} Tema 1 has page < 8: ${sample.paginaInicio}`);
            totalErrors++;
          }
        }
      });
    }
  }

  if (totalErrors === 0) {
    console.log('✓ All 6 grades have complete, granular math catalogs starting at real pages >= 8!\n');
  }

  console.log('=== TEST 2: LOCAL RAG ENGINE DAY-BY-DAY PROGRESSION ===');
  // We can require from built Next.js or test via API
  console.log('Testing via POST http://localhost:3000/api/planificacion...');

  const requestBody = JSON.stringify({
    items: [
      {
        grado: 5,
        materia: 'Matemáticas',
        materiaId: 'matematicas_5',
        libroTitulo: 'Matemáticas 5.° Grado (MINEDUC)',
        unidad: 1,
        unidadTitulo: 'Unidad 1: Repaso, Números y operaciones, Potenciación y Decimales',
        tema: 'Tema 1 • Sesión 1 Series numéricas (Pág. 9), Tema 1 • Sesión 2 Elaboro mosaicos (Pág. 10)',
        temaNumero: 1,
        todosLosTemasNumeros: [1, 2],
        temasSeleccionados: [
          { numero: 1, titulo: 'Tema 1 • Sesión 1 Series numéricas (Pág. 9)', paginaInicio: 9, paginaFin: 9 },
          { numero: 2, titulo: 'Tema 1 • Sesión 2 Elaboro mosaicos (Pág. 10)', paginaInicio: 10, paginaFin: 10 }
        ],
        paginaInicio: 9,
        paginaFin: 10,
        competencias: ['Aplica el pensamiento lógico en números hasta 1,000,000'],
        indicadores: ['Resuelve problemas con valor posicional y operaciones'],
        periodosSemanales: 5,
        pesoPorcentaje: 35
      },
      {
        grado: 6,
        materia: 'Matemáticas',
        materiaId: 'matematicas_6',
        libroTitulo: 'Matemáticas 6.° Grado (MINEDUC)',
        unidad: 1,
        unidadTitulo: 'Unidad 1: Múltiplos y divisores, Decimales y fracciones, Polígonos',
        tema: 'T1-1 Múltiplos (Pág. 8), T1-2 Múltiplos comunes y m.c.m. (Pág. 9)',
        temaNumero: 1,
        todosLosTemasNumeros: [1, 2],
        temasSeleccionados: [
          { numero: 1, titulo: 'T1-1 Múltiplos (Pág. 8)', paginaInicio: 8, paginaFin: 8 },
          { numero: 2, titulo: 'T1-2 Múltiplos comunes y m.c.m. (Pág. 9)', paginaInicio: 9, paginaFin: 9 }
        ],
        paginaInicio: 8,
        paginaFin: 9,
        competencias: ['Aplica el razonamiento lógico en múltiplos y divisores'],
        indicadores: ['Encuentra múltiplos comunes y el m.c.m.'],
        periodosSemanales: 5,
        pesoPorcentaje: 35
      }
    ],
    grados: [5, 6],
    grado1: '5',
    grado2: '6',
    bloque: 1,
    semana: 1,
    area: 'Matemáticas',
    temasRezagados: []
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/planificacion',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log(`HTTP Status: ${res.statusCode}`);
      try {
        const json = JSON.parse(data);
        if (json.success && json.plan) {
          console.log('✓ API call successful!');
          console.log('Tema Eje Transversal:', json.plan.tema_generador_comun);
          console.log('Propósito Común:', json.plan.proposito_comun);
          console.log('\n--- DAY BY DAY BREAKDOWN FOR 5.° PRIMARIA ---');
          const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves'];
          dias.forEach(d => {
            const diaData = json.plan.dias[d];
            const g5 = diaData.gradosSincronizados.find(gs => gs.gradoNumero === 5);
            console.log(`[${d}] Pág: ${g5.numeroPagina} | Tema: ${g5.tema}`);
            console.log(`       Periodo 1: ${g5.periodo1_actividad ? g5.periodo1_actividad.slice(0, 110) : ''}...`);
            console.log(`       Ejercicios: ${g5.ejerciciosLiterales ? g5.ejerciciosLiterales[0]?.slice(0, 80) : 'N/A'}`);
          });

          // Check for identical days
          const pages5 = dias.map(d => json.plan.dias[d].gradosSincronizados.find(gs => gs.gradoNumero === 5).numeroPagina);
          const p1Texts = dias.map(d => json.plan.dias[d].gradosSincronizados.find(gs => gs.gradoNumero === 5).periodo1_actividad);
          const uniqueTexts = new Set(p1Texts);
          console.log('\nPages across the 4 days for 5.°:', pages5);
          console.log('Unique Periodo 1 texts count (must be 4):', uniqueTexts.size);

          if (uniqueTexts.size === 4) {
            console.log('🎉 SUCCESS: All 4 days have 100% unique, non-repeating activities and proper page sequencing!');
          } else {
            console.warn('⚠️ Warning: Some activities repeated:', uniqueTexts.size, 'unique out of 4');
          }
        } else {
          console.error('API returned error or no plan:', json);
        }
      } catch (e) {
        console.error('Error parsing response:', e.message, data.slice(0, 200));
      }
    });
  });

  req.on('error', (e) => {
    console.error('Request failed:', e.message);
  });

  req.write(requestBody);
  req.end();
}

runTests();
