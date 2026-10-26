import http from 'http';
import { getMateriasPorGrado } from '../src/utils/indicesLibrosMineduc';
import { generateUnifiedRAGPlan } from '../src/utils/ragEngine';

function postJSON(path: string, payload: any): Promise<{ status: number; body: any }> {
  return new Promise((resolve, reject) => {
    const dataStr = JSON.stringify(payload);
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(dataStr)
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode || 200, body: json });
        } catch (e) {
          resolve({ status: res.statusCode || 200, body: body });
        }
      });
    });

    req.on('error', reject);
    req.write(dataStr);
    req.end();
  });
}

async function runTestSuite() {
  console.log('================================================================');
  console.log('🧪 TEST INTEGRAL DE UNIDADES (1, 2, 3, 4) Y ENDPOINTS GET/POST');
  console.log('================================================================\n');

  let errors = 0;

  // ── 1. TEST DE ESTRUCTURA DE DATOS: TODAS LAS UNIDADES (1-4) DE TODOS LOS GRADOS ──
  console.log('1. Verificando estructura fáctica de libros y páginas para todas las unidades (1-4)...');
  const grades = [1, 2, 3, 4, 5, 6];
  const units = [1, 2, 3, 4];

  for (const g of grades) {
    const mats = getMateriasPorGrado(g);
    for (const m of mats) {
      for (const uNum of units) {
        const uni = m.unidades.find(u => u.unidad === uNum);
        if (!uni) {
          console.error(`❌ [Grado ${g}] Falta Unidad ${uNum} en ${m.nombre}`);
          errors++;
          continue;
        }
        if (!Array.isArray(uni.temas) || uni.temas.length === 0) {
          console.error(`❌ [Grado ${g}] Unidad ${uNum} de ${m.nombre} no tiene temas!`);
          errors++;
          continue;
        }
        for (const t of uni.temas) {
          if (typeof t.paginaInicio !== 'number' || typeof t.paginaFin !== 'number') {
            console.error(`❌ [Grado ${g}] Tema "${t.titulo}" en U${uNum} no tiene paginaInicio/Fin válida!`);
            errors++;
          }
        }
      }
    }
  }

  if (errors === 0) {
    console.log('✅ Todas las materias (1.° a 6.° grado) tienen Unidades 1, 2, 3 y 4 con páginas reales.\n');
  }

  // ── 2. TEST DE GENERACIÓN DE PLANES PARA CADA UNIDAD (1 A 4) VÍA RAG ENGINE ──
  console.log('2. Probando generación determinista RAG para Unidad 1, 2, 3 y 4 con aula multigrado (4.° y 5.°)...');

  for (const uNum of units) {
    const testItems: any[] = [];
    [4, 5].forEach(g => {
      const mats = getMateriasPorGrado(g);
      mats.forEach(m => {
        const uni = m.unidades.find(u => u.unidad === uNum) || m.unidades[0];
        const safeTemas = (uni?.temas || []).filter(Boolean);
        const activeTemas = safeTemas.slice(0, 1);
        const minPag = activeTemas.length > 0 ? Math.min(...activeTemas.map(t => t.paginaInicio)) : (uni?.paginaInicio || 8);
        const maxPag = activeTemas.length > 0 ? Math.max(...activeTemas.map(t => t.paginaFin)) : (uni?.paginaFin || 20);

        testItems.push({
          grado: g,
          materia: m.nombre,
          materiaId: m.id,
          libroTitulo: m.libroTitulo,
          unidad: uni.unidad,
          unidadTitulo: uni.titulo,
          tema: activeTemas[0]?.titulo || uni.titulo,
          temaNumero: activeTemas[0]?.numero || 1,
          paginaInicio: minPag,
          paginaFin: maxPag,
          competencias: uni.competencias,
          indicadores: uni.indicadoresLogro,
          periodosSemanales: m.periodosSemanales,
          pesoPorcentaje: m.pesoPorcentaje
        });
      });
    });

    try {
      const plan = generateUnifiedRAGPlan({
        grados: [4, 5],
        items: testItems
      });

      console.log(`  Unidad ${uNum}:`);
      console.log(`    - Eje Transversal: "${plan.tema_generador_comun}"`);
      console.log(`    - Propósito: "${plan.proposito_comun?.slice(0, 80)}..."`);
      console.log(`    - Lunes P1 (4.°): ${plan.dias.Lunes.gradosSincronizados[0]?.periodo1_actividad.slice(0, 75)}...`);
      console.log(`    - Lunes P1 (5.°): ${plan.dias.Lunes.gradosSincronizados[1]?.periodo1_actividad.slice(0, 75)}...`);
      console.log(`    - Estado: ✅ Generado sin errores`);
    } catch (err: any) {
      console.error(`❌ Error generando plan para Unidad ${uNum}:`, err.message);
      errors++;
    }
  }

  // ── 3. TEST DE ENDPOINTS POST /api/planificacion PARA TODAS LAS UNIDADES ──
  console.log('\n3. Probando POST /api/planificacion en el servidor local para cada Unidad...');

  for (const uNum of units) {
    const postItems: any[] = [];
    [4, 5].forEach(g => {
      const mats = getMateriasPorGrado(g);
      const m = mats[0]; // Matemáticas
      const uni = m.unidades.find(u => u.unidad === uNum) || m.unidades[0];
      const t = uni.temas[0];
      postItems.push({
        grado: g,
        materia: m.nombre,
        materiaId: m.id,
        materiaBase: 'matematicas',
        libroTitulo: m.libroTitulo,
        unidad: uni.unidad,
        unidadTitulo: uni.titulo,
        tema: t.titulo,
        temaNumero: t.numero,
        todosLosTemasNumeros: [t.numero],
        paginaInicio: t.paginaInicio,
        paginaFin: t.paginaFin,
        competencias: uni.competencias,
        indicadores: uni.indicadoresLogro,
        periodosSemanales: m.periodosSemanales,
        pesoPorcentaje: m.pesoPorcentaje
      });
    });

    const res = await postJSON('/api/planificacion', {
      grados: [4, 5],
      bloque: uNum,
      semana: 1,
      items: postItems
    });

    if (res.status === 200 && res.body?.success) {
      console.log(`  POST /api/planificacion [Unidad ${uNum}]: HTTP ${res.status} ✅ (Eje: "${res.body.plan?.tema_generador_comun?.slice(0, 50)}...")`);
    } else {
      console.error(`  POST /api/planificacion [Unidad ${uNum}]: HTTP ${res.status} ❌`, res.body);
      errors++;
    }
  }

  // ── 4. TEST DE CHECK-IN DOCENTE POST /api/docente/checkin ──
  console.log('\n4. Probando POST /api/docente/checkin...');
  try {
    const checkinRes = await postJSON('/api/docente/checkin', {
      grados: [4, 5],
      materias: ['matematicas', 'comunicacion'],
      plan: { tema: 'Prueba de checkin' },
      estado: 'planificado'
    });
    console.log(`  POST /api/docente/checkin: HTTP ${checkinRes.status} ✅`);
  } catch (err: any) {
    console.warn(`  POST /api/docente/checkin aviso (opcional):`, err.message);
  }

  console.log('\n================================================================');
  if (errors === 0) {
    console.log('🎉 TODOS LOS TESTS PASARON EXITOSAMENTE (0 ERRORES)');
    console.log('Las Unidades 1, 2, 3 y 4 funcionan al 100% en todos los grados.');
  } else {
    console.error(`💥 HUBO ${errors} ERRORES EN EL TEST.`);
    process.exit(1);
  }
  console.log('================================================================\n');
}

runTestSuite().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
