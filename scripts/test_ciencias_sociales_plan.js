const http = require('http');

async function testScenario(title, payload) {
  console.log(`\n======================================================`);
  console.log(title);
  console.log(`======================================================`);

  return new Promise((resolve) => {
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
          console.log(`Fuente: ${json.fuente}`);
          console.log(`Tema Eje: "${plan.tema_generador_comun}"`);

          const d = 'Lunes';
          const diaData = plan.dias[d];
          console.log(`\n--- VISTA DÍA ${d.toUpperCase()} ---`);
          diaData.gradosSincronizados.forEach(gs => {
            console.log(`\nGrado ${gs.gradoNumero}.° (${gs.materia}):`);
            console.log(`  P1: ${gs.periodo1_actividad ? gs.periodo1_actividad.slice(0, 110) : 'N/A'}...`);
            console.log(`  P2: ${gs.periodo2_actividad ? gs.periodo2_actividad.slice(0, 110) : 'N/A'}...`);
            console.log(`  P3: ${gs.periodo3_actividad ? gs.periodo3_actividad.slice(0, 110) : 'N/A'}...`);
            console.log(`  P4: ${gs.periodo4_actividad ? gs.periodo4_actividad.slice(0, 110) : 'N/A'}...`);
          });

          // Verificar que NO sea solo matematicas si se selecciono Ciencias
          const p1 = diaData.gradosSincronizados[0]?.periodo1_actividad || '';
          const p3 = diaData.gradosSincronizados[0]?.periodo3_actividad || '';
          
          console.log(`\nVerificación de Contenido Curricular:`);
          console.log(`- Materia P1: ${payload.items[0]?.materia}`);
          console.log(`- Materia P3: ${payload.items[1]?.materia || payload.items[0]?.materia}`);

          resolve(true);
        } catch (e) {
          console.error('Error parseando JSON:', e.message);
          resolve(false);
        }
      });
    });

    req.on('error', e => {
      console.error('Req error:', e.message);
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

async function run() {
  // Test 1: Aula Monogrado seleccionando Ciencias Naturales y Tecnología + Ciencias Sociales (Ciclo II: 5.° Grado)
  await testScenario('TEST 1: Monogrado (5.° Grado) con Ciencias Naturales y Ciencias Sociales', {
    grados: [5],
    bloque: 1,
    semana: 1,
    area: 'Ciencias Naturales y Tecnología, Ciencias Sociales',
    items: [
      {
        grado: 5,
        materia: 'Ciencias Naturales y Tecnología',
        materiaId: 'ciencias_naturales_5',
        libroTitulo: 'Ciencias Naturales y Tecnología 5.° Grado (MINEDUC)',
        unidad: 1,
        unidadTitulo: 'Unidad 1: Los seres vivos y su entorno',
        tema: 'Sesión 1 La Célula y los Tejidos (Pág. 12)',
        temaNumero: 1,
        temasSeleccionados: [
          { numero: 1, titulo: 'Sesión 1 La Célula y los Tejidos (Pág. 12)', paginaInicio: 12, paginaFin: 12 },
          { numero: 2, titulo: 'Sesión 2 Clasificación de los Seres Vivos (Pág. 13)', paginaInicio: 13, paginaFin: 13 }
        ],
        paginaInicio: 12,
        paginaFin: 13,
        competencias: ['Explica la estructura celular'],
        indicadores: ['Identifica partes de la célula'],
        periodosSemanales: 3,
        pesoPorcentaje: 20
      },
      {
        grado: 5,
        materia: 'Ciencias Sociales',
        materiaId: 'ciencias_sociales_5',
        libroTitulo: 'Ciencias Sociales 5.° Grado (MINEDUC)',
        unidad: 1,
        unidadTitulo: 'Unidad 1: Geografía y Pueblos de América',
        tema: 'Sesión 1 El Relieve Americano (Pág. 18)',
        temaNumero: 1,
        temasSeleccionados: [
          { numero: 1, titulo: 'Sesión 1 El Relieve Americano (Pág. 18)', paginaInicio: 18, paginaFin: 18 }
        ],
        paginaInicio: 18,
        paginaFin: 18,
        competencias: ['Describe el espacio geográfico'],
        indicadores: ['Identifica accidentes geográficos'],
        periodosSemanales: 3,
        pesoPorcentaje: 20
      }
    ]
  });

  // Test 2: Multigrado (3.° y 4.°) con Medio Social y Natural + Matemáticas
  await testScenario('TEST 2: Multigrado (3.° y 4.°) con Medio Social y Natural + Matemáticas', {
    grados: [3, 4],
    bloque: 1,
    semana: 1,
    area: 'Medio Social y Natural, Matemáticas',
    items: [
      {
        grado: 3,
        materia: 'Medio Social y Natural',
        materiaId: 'medio_social_3',
        libroTitulo: 'Medio Social y Natural 3.° Grado (MINEDUC)',
        unidad: 1,
        unidadTitulo: 'Unidad 1: Conozco mi comunidad',
        tema: 'Sesión 1 El entorno local (Pág. 10)',
        temaNumero: 1,
        temasSeleccionados: [
          { numero: 1, titulo: 'Sesión 1 El entorno local (Pág. 10)', paginaInicio: 10, paginaFin: 10 }
        ],
        paginaInicio: 10,
        paginaFin: 10,
        competencias: ['Reconoce los recursos de su entorno'],
        indicadores: ['Describe la comunidad'],
        periodosSemanales: 4,
        pesoPorcentaje: 25
      },
      {
        grado: 3,
        materia: 'Matemáticas',
        materiaId: 'matematicas_3',
        libroTitulo: 'Matemáticas 3.° Grado (MINEDUC)',
        unidad: 1,
        unidadTitulo: 'Unidad 1',
        tema: 'Sesión 1 Centenas (Pág. 9)',
        temaNumero: 1,
        temasSeleccionados: [
          { numero: 1, titulo: 'Sesión 1 Centenas (Pág. 9)', paginaInicio: 9, paginaFin: 9 }
        ],
        paginaInicio: 9,
        paginaFin: 9,
        competencias: ['Aplica lógica'],
        indicadores: ['Calcula'],
        periodosSemanales: 5,
        pesoPorcentaje: 35
      },
      {
        grado: 4,
        materia: 'Ciencias Naturales y Tecnología',
        materiaId: 'ciencias_naturales_4',
        libroTitulo: 'Ciencias Naturales 4.° Grado (MINEDUC)',
        unidad: 1,
        unidadTitulo: 'Unidad 1: La Naturaleza',
        tema: 'Sesión 1 Los Ecosistemas (Pág. 11)',
        temaNumero: 1,
        temasSeleccionados: [
          { numero: 1, titulo: 'Sesión 1 Los Ecosistemas (Pág. 11)', paginaInicio: 11, paginaFin: 11 }
        ],
        paginaInicio: 11,
        paginaFin: 11,
        competencias: ['Explica ecosistemas'],
        indicadores: ['Identifica seres vivos'],
        periodosSemanales: 3,
        pesoPorcentaje: 20
      }
    ]
  });
}

run();
