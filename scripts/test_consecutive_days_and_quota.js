const http = require('http');

async function testScenario(name, payload) {
  console.log(`\n======================================================`);
  console.log(`TEST: ${name}`);
  console.log(`======================================================`);

  return new Promise((resolve, reject) => {
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
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          const data = JSON.parse(raw);
          if (!data.success || !data.plan) {
            console.error('Error response:', data);
            return resolve(false);
          }
          const plan = data.plan;
          const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves'];

          console.log(`Tema Eje: "${plan.tema_generador_comun}"`);
          console.log(`Propósito Común: "${plan.proposito_comun}"`);

          payload.grados.forEach(g => {
            console.log(`\n--- Progreso Diario Grado ${g}.° ---`);
            const pages = [];
            const subtemas = [];
            const p1Activities = [];

            dias.forEach(d => {
              const diaData = plan.dias[d];
              const gData = diaData.gradosSincronizados.find(gs => gs.gradoNumero === g);
              if (gData) {
                pages.push(gData.numeroPagina);
                subtemas.push(gData.tema);
                p1Activities.push(gData.periodo1_actividad);
                console.log(`  [${d}] Pág. ${gData.numeroPagina} | ${gData.tema.slice(0, 55)}...`);
                console.log(`         P1: ${gData.periodo1_actividad ? gData.periodo1_actividad.slice(0, 85) : 'N/A'}...`);
                if (gData.materiasSeleccionadas && gData.materiasSeleccionadas.length > 1) {
                  const m2 = gData.materiasSeleccionadas[1];
                  console.log(`         Materia 2 (${m2.materia}): Pág. ${m2.paginaInicio} | ${m2.tema.slice(0, 45)}...`);
                }
              }
            });

            console.log(`  Páginas en los 4 días: [ ${pages.join(', ')} ]`);
            const uniquePages = new Set(pages);
            const uniqueActivities = new Set(p1Activities);
            console.log(`  Páginas únicas: ${uniquePages.size} de 4`);
            console.log(`  Actividades P1 únicas: ${uniqueActivities.size} de 4`);

            if (uniquePages.size === 4 && uniqueActivities.size === 4) {
              console.log(`  ✓ ÉXITO para Grado ${g}: 4 páginas consecutivas diferentes y cero repetición.`);
            } else if (uniquePages.size >= 3) {
              console.log(`  ✓ ACEPTABLE para Grado ${g}: Progresión diferenciada (${uniquePages.size} páginas únicas).`);
            } else {
              console.warn(`  ⚠️ ADVERTENCIA: Páginas repetidas detectadas en Grado ${g}.`);
            }
          });

          resolve(true);
        } catch (e) {
          console.error('Error parseando JSON:', e.message);
          resolve(false);
        }
      });
    });

    req.on('error', err => {
      console.error('Request error:', err.message);
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

async function runAll() {
  // Escenario 1: Monogrado (1 solo grado, Grado 3) con Matemáticas y 4 sesiones consecutivas
  await testScenario('1. Aula Monogrado (3.° Primaria) con 4 sesiones de Matemáticas', {
    grados: [3],
    bloque: 1,
    semana: 1,
    area: 'Matemáticas',
    items: [
      {
        grado: 3,
        materia: 'Matemáticas',
        materiaId: 'matematicas_3',
        libroTitulo: 'Matemáticas 3.° Grado (MINEDUC)',
        unidad: 1,
        unidadTitulo: 'Unidad 1: Números y operaciones',
        tema: 'Tema 1-Sesión 1 a 4',
        temaNumero: 1,
        temasSeleccionados: [
          { numero: 1, titulo: 'Tema 1-Sesión 1 (Pág. 9)', paginaInicio: 9, paginaFin: 9 },
          { numero: 2, titulo: 'Tema 1-Sesión 2 (Pág. 10)', paginaInicio: 10, paginaFin: 10 },
          { numero: 3, titulo: 'Tema 1-Sesión 3 (Pág. 11)', paginaInicio: 11, paginaFin: 11 },
          { numero: 4, titulo: 'Tema 1-Sesión 4 (Pág. 12)', paginaInicio: 12, paginaFin: 12 }
        ],
        paginaInicio: 9,
        paginaFin: 12,
        competencias: ['Aplica el pensamiento lógico'],
        indicadores: ['Resuelve operaciones básicas'],
        periodosSemanales: 5,
        pesoPorcentaje: 35
      }
    ]
  });

  // Escenario 2: Aula Multigrado (3.° y 4.° Primaria) con Matemáticas y Medio Social
  await testScenario('2. Aula Multigrado (3.° y 4.° Primaria) con Matemáticas y Ciencias/Medio Social', {
    grados: [3, 4],
    bloque: 1,
    semana: 1,
    area: 'Matemáticas, Medio Social y Natural',
    items: [
      {
        grado: 3,
        materia: 'Matemáticas',
        materiaId: 'matematicas_3',
        libroTitulo: 'Matemáticas 3.° Grado (MINEDUC)',
        unidad: 1,
        unidadTitulo: 'Unidad 1',
        tema: 'Tema 1-Sesión 1 a 4',
        temaNumero: 1,
        temasSeleccionados: [
          { numero: 1, titulo: 'Tema 1-Sesión 1 (Pág. 9)', paginaInicio: 9, paginaFin: 9 },
          { numero: 2, titulo: 'Tema 1-Sesión 2 (Pág. 10)', paginaInicio: 10, paginaFin: 10 },
          { numero: 3, titulo: 'Tema 1-Sesión 3 (Pág. 11)', paginaInicio: 11, paginaFin: 11 },
          { numero: 4, titulo: 'Tema 1-Sesión 4 (Pág. 12)', paginaInicio: 12, paginaFin: 12 }
        ],
        paginaInicio: 9,
        paginaFin: 12,
        competencias: ['Aplica el pensamiento lógico'],
        indicadores: ['Resuelve operaciones básicas'],
        periodosSemanales: 5,
        pesoPorcentaje: 35
      },
      {
        grado: 3,
        materia: 'Medio Social y Natural',
        materiaId: 'medio_social_3',
        libroTitulo: 'Medio Social y Natural 3.° Grado (MINEDUC)',
        unidad: 1,
        unidadTitulo: 'Unidad 1: Mi Comunidad',
        tema: 'Tema 1-Sesión 1 a 4',
        temaNumero: 1,
        temasSeleccionados: [
          { numero: 1, titulo: 'Tema 1-Sesión 1 Mi Comunidad (Pág. 14)', paginaInicio: 14, paginaFin: 14 },
          { numero: 2, titulo: 'Tema 1-Sesión 2 Recursos Naturales (Pág. 15)', paginaInicio: 15, paginaFin: 15 },
          { numero: 3, titulo: 'Tema 1-Sesión 3 El Trabajo Local (Pág. 16)', paginaInicio: 16, paginaFin: 16 },
          { numero: 4, titulo: 'Tema 1-Sesión 4 Cuidado Ambiental (Pág. 17)', paginaInicio: 17, paginaFin: 17 }
        ],
        paginaInicio: 14,
        paginaFin: 17,
        competencias: ['Explica la relación comunitaria'],
        indicadores: ['Describe el entorno local'],
        periodosSemanales: 4,
        pesoPorcentaje: 25
      },
      {
        grado: 4,
        materia: 'Matemáticas',
        materiaId: 'matematicas_4',
        libroTitulo: 'Matemáticas 4.° Grado (MINEDUC)',
        unidad: 1,
        unidadTitulo: 'Unidad 1',
        tema: 'T1-1 Números grandes',
        temaNumero: 1,
        temasSeleccionados: [
          { numero: 1, titulo: 'T1-1 Números de 4 dígitos (Pág. 8)', paginaInicio: 8, paginaFin: 8 },
          { numero: 2, titulo: 'T1-2 Descomposición (Pág. 9)', paginaInicio: 9, paginaFin: 9 },
          { numero: 3, titulo: 'T1-3 Comparación (Pág. 10)', paginaInicio: 10, paginaFin: 10 },
          { numero: 4, titulo: 'T1-4 Ejercicios de aplicación (Pág. 11)', paginaInicio: 11, paginaFin: 11 }
        ],
        paginaInicio: 8,
        paginaFin: 11,
        competencias: ['Aplica operaciones aritméticas'],
        indicadores: ['Compara y ordena números grandes'],
        periodosSemanales: 5,
        pesoPorcentaje: 35
      }
    ]
  });

  // Escenario 3: Tema único con 1 sola página que debe expandirse automáticamente en 4 días
  await testScenario('3. Subtema individual (Pág. 8) que debe expandirse consecutivamente en los 4 días', {
    grados: [5],
    bloque: 1,
    semana: 1,
    area: 'Matemáticas',
    items: [
      {
        grado: 5,
        materia: 'Matemáticas',
        materiaId: 'matematicas_5',
        libroTitulo: 'Matemáticas 5.° Grado (MINEDUC)',
        unidad: 1,
        unidadTitulo: 'Unidad 1',
        tema: 'Tema 1 • Sesión 1 Series numéricas (Pág. 9)',
        temaNumero: 1,
        temasSeleccionados: [
          { numero: 1, titulo: 'Tema 1 • Sesión 1 Series numéricas (Pág. 9)', paginaInicio: 9, paginaFin: 9 }
        ],
        paginaInicio: 9,
        paginaFin: 9,
        competencias: ['Aplica pensamiento lógico'],
        indicadores: ['Identifica patrones'],
        periodosSemanales: 5,
        pesoPorcentaje: 35
      }
    ]
  });

  console.log('\n======================================================');
  console.log('🎉 TODOS LOS ESCENARIOS HAN SIDO PROBADOS.');
  console.log('======================================================');
}

runAll();
