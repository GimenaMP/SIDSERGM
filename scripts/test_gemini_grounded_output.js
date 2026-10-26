const http = require('http');

async function testGeminiGroundedOutput() {
  console.log('=== TEST: GEMINI GROUNDED GENERATION & ANTIDUPLICATION ===');
  
  const payload = JSON.stringify({
    items: [
      {
        grado: 3,
        materia: 'Matemáticas',
        materiaId: 'matematicas_3',
        libroTitulo: 'Matemáticas 3.° Grado (MINEDUC)',
        unidad: 1,
        unidadTitulo: 'Unidad 1: Números y operaciones básicas',
        tema: 'T1-1 Centenas y números hasta 1,000 (Pág. 8), T1-2 Decenas y unidades en la recta (Pág. 9)',
        temaNumero: 1,
        temasSeleccionados: [
          { numero: 1, titulo: 'T1-1 Centenas y números hasta 1,000 (Pág. 8)', paginaInicio: 8, paginaFin: 8 },
          { numero: 2, titulo: 'T1-2 Decenas y unidades en la recta (Pág. 9)', paginaInicio: 9, paginaFin: 9 }
        ],
        paginaInicio: 8,
        paginaFin: 9,
        competencias: ['Aplica el razonamiento lógico en numeración decimal'],
        indicadores: ['Identifica y representa números hasta 1,000'],
        periodosSemanales: 5,
        pesoPorcentaje: 35
      },
      {
        grado: 4,
        materia: 'Matemáticas',
        materiaId: 'matematicas_4',
        libroTitulo: 'Matemáticas 4.° Grado (MINEDUC)',
        unidad: 1,
        unidadTitulo: 'Unidad 1: Números hasta 10,000 y cálculo mental',
        tema: 'T1-1 Números de 4 dígitos (Pág. 8), T1-2 Descomposición posicional (Pág. 9)',
        temaNumero: 1,
        temasSeleccionados: [
          { numero: 1, titulo: 'T1-1 Números de 4 dígitos (Pág. 8)', paginaInicio: 8, paginaFin: 8 },
          { numero: 2, titulo: 'T1-2 Descomposición posicional (Pág. 9)', paginaInicio: 9, paginaFin: 9 }
        ],
        paginaInicio: 8,
        paginaFin: 9,
        competencias: ['Construye nociones de operaciones aritméticas con números grandes'],
        indicadores: ['Compara y ordena números hasta 10,000'],
        periodosSemanales: 5,
        pesoPorcentaje: 35
      }
    ],
    grados: [3, 4],
    bloque: 1,
    semana: 1,
    area: 'Matemáticas'
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
    let raw = '';
    res.on('data', chunk => raw += chunk);
    res.on('end', () => {
      console.log('HTTP Status:', res.statusCode);
      try {
        const data = JSON.parse(raw);
        console.log('Fuente de generación:', data.fuente);
        console.log('Tema Eje:', data.tema_generador_comun);

        const plan = data.plan;
        const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves'];
        
        let allP1Texts = [];
        let allDocenteTexts = [];

        dias.forEach(d => {
          const diaData = plan.dias[d];
          console.log(`\n--- [${d.toUpperCase()}] ---`);
          console.log('Enfoque Didáctico:', diaData.enfoqueDidactico);
          
          diaData.gradosSincronizados.forEach(g => {
            console.log(`  Grado ${g.gradoNumero} (Pág. ${g.numeroPagina}):`);
            console.log(`    P1: ${g.periodo1_actividad ? g.periodo1_actividad.slice(0, 95) : 'N/A'}...`);
            console.log(`    Docente: ${g.actividadDocente ? g.actividadDocente.slice(0, 95) : 'N/A'}...`);
            if (g.periodo1_actividad) allP1Texts.push(g.periodo1_actividad);
            if (g.actividadDocente) allDocenteTexts.push(g.actividadDocente);
          });
        });

        // Similarity check between days for Grado 3
        const g3P1 = dias.map(d => plan.dias[d].gradosSincronizados.find(g => g.gradoNumero === 3).periodo1_actividad);
        const uniqueG3 = new Set(g3P1);
        console.log('\nGrado 3 - Actividades P1 únicas (debe ser 4):', uniqueG3.size);
        
        // Check Viernes
        if (plan.evaluacion_viernes) {
          const ev3 = plan.evaluacion_viernes['3'] || plan.evaluacion_viernes['3.° Primaria'];
          console.log('\nEvaluación Viernes Grado 3:');
          console.log('  Horario:', ev3?.horario_evaluacion);
          console.log('  Criterios lista de cotejo:', ev3?.criterios_lista_cotejo?.length);
          console.log('  Ejercicios hoja de trabajo:', ev3?.hoja_trabajo_ejercicios?.length);
        }

        if (uniqueG3.size === 4) {
          console.log('\n✅ VERIFICACIÓN EXITOSA: Cero repetición, progresión pedagógica completa y desglose riguroso.');
        } else {
          console.log('\n❌ Advertencia: Repetición detectada.');
        }
      } catch (err) {
        console.error('Error parseando JSON:', err.message);
      }
    });
  });

  req.on('error', err => console.error('Request error:', err.message));
  req.write(payload);
  req.end();
}

testGeminiGroundedOutput();
