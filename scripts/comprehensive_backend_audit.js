const fs = require('fs');
const http = require('http');
const path = require('path');

// ==============================================================================
// 1. AUDITORÍA DE DATOS VECTORIALES, MINEDUC Y CNB
// ==============================================================================
function auditarBasesDeDatos() {
  console.log('\n======================================================');
  console.log('📊 1. AUDITORÍA DE BASES DE DATOS (MINEDUC + CNB + VECTORES)');
  console.log('======================================================');

  // A. mineduc_ejercicios.json
  const mineducPath = path.join(__dirname, '..', 'data', 'mineduc_ejercicios.json');
  const mineduc = JSON.parse(fs.readFileSync(mineducPath, 'utf8'));
  console.log(`- Total registros MINEDUC literales: ${mineduc.length}`);

  const gradosMap = {};
  const materiasMap = {};
  mineduc.forEach(item => {
    gradosMap[item.grado_especifico] = (gradosMap[item.grado_especifico] || 0) + 1;
    materiasMap[item.materia] = (materiasMap[item.materia] || 0) + 1;
  });

  console.log('  * Cobertura por Grado:', gradosMap);
  console.log('  * Materias registradas:', Object.keys(materiasMap));

  const allGradosCovered = [1, 2, 3, 4, 5, 6].every(g => (gradosMap[g] || 0) > 100);
  console.log('  * ¿Todos los grados (1.° a 6.°) tienen cobertura sustancial?:', allGradosCovered ? '✅ SÍ' : '❌ NO');

  // B. mineduc_ejercicios_vectorizados_768.json
  const vectPath = path.join(__dirname, '..', 'data', 'mineduc_ejercicios_vectorizados_768.json');
  const vect = JSON.parse(fs.readFileSync(vectPath, 'utf8'));
  console.log(`- Total registros vectorizados: ${vect.length}`);
  const sampleDim = vect[0]?.embedding?.length;
  console.log(`  * Dimensión de los embeddings vectoriales: ${sampleDim} dimensiones`);
  const vectorDimOk = sampleDim === 768 && vect.length === mineduc.length;
  console.log('  * ¿Embeddings de 768d alineados 1:1 con base MINEDUC?:', vectorDimOk ? '✅ SÍ' : '❌ NO');

  // C. cnb_processed.json
  const cnbPath = path.join(__dirname, '..', 'data', 'cnb_processed.json');
  const cnb = JSON.parse(fs.readFileSync(cnbPath, 'utf8'));
  console.log(`- Total registros oficiales del CNB DIGECUR: ${cnb.length}`);
  const cnbGrados = new Set(cnb.map(c => c.grado));
  console.log(`  * Grados CNB procesados: ${Array.from(cnbGrados).sort((a,b)=>a-b).join(', ')}`);
  const cnbOk = cnb.length >= 800 && [1,2,3,4,5,6].every(g => cnbGrados.has(g));
  console.log('  * ¿Alineación curricular CNB completa?:', cnbOk ? '✅ SÍ' : '❌ NO');

  return allGradosCovered && vectorDimOk && cnbOk;
}

// ==============================================================================
// 2. AUDITORÍA DEL MOTOR RAG Y ANÁLISIS INTELIGENTE
// ==============================================================================
async function auditarMotorRAG() {
  console.log('\n======================================================');
  console.log('🧠 2. AUDITORÍA DEL MOTOR RAG Y DIAGNÓSTICO FÁCTICO');
  console.log('======================================================');

  // En Next.js / TypeScript compilado, probamos el endpoint /api/planificacion o el comportamiento del motor
  // Probaremos el endpoint enviando consultas precisas para evaluar el diagnóstico del RAG
  const tests = [
    {
      nombre: 'Pág. 13 de 5.° Grado CNYT (Debe detectar Organizamos + Experimento Huevo)',
      grado: 5,
      materia: 'Ciencias Naturales y Tecnología',
      materiaId: 'ciencias_naturales',
      pag: 13,
      esperaActividad: true,
      validador: (lunes) => {
        const str = JSON.stringify(lunes);
        const hasOrganizamos = str.toLowerCase().includes('organizamos') || str.toLowerCase().includes('huevo');
        const hasNoDesastres = !str.toLowerCase().includes('deterioro ambiental');
        return hasOrganizamos && hasNoDesastres;
      }
    },
    {
      nombre: 'Pág. 13 de 4.° Grado CNYT (Debe detectar Relaciono + Diagrama de Venn)',
      grado: 4,
      materia: 'Ciencias Naturales y Tecnología',
      materiaId: 'ciencias_naturales',
      pag: 13,
      esperaActividad: true,
      validador: (lunes) => {
        const str = JSON.stringify(lunes);
        const hasRelaciono = str.toLowerCase().includes('relaciono') || str.toLowerCase().includes('diagrama de venn');
        return hasRelaciono;
      }
    },
    {
      nombre: 'Pág. 13 de 6.° Grado CNYT (Página Conceptual -> Sugerencia Inteligente IA)',
      grado: 6,
      materia: 'Ciencias Naturales y Tecnología',
      materiaId: 'ciencias_naturales',
      pag: 13,
      esperaActividad: false,
      validador: (lunes) => {
        const str = JSON.stringify(lunes);
        const hasSugerida = str.includes('Actividad Pedagógica Sugerida') || str.includes('💡');
        const hasCell = str.toLowerCase().includes('célula');
        return hasSugerida && hasCell;
      }
    }
  ];

  let ragExitosos = 0;
  for (const t of tests) {
    console.log(`\nProbando: ${t.nombre}...`);
    try {
      const res = await callPlanificacionApi({
        grados: [t.grado],
        items: [
          {
            grado: t.grado,
            materia: t.materia,
            materiaId: t.materiaId,
            libroTitulo: `${t.materia} ${t.grado}`,
            unidad: 1,
            unidadTitulo: 'Conocimiento científico y seres vivos',
            tema: 'La célula',
            temaNumero: 1,
            paginaInicio: t.pag,
            paginaFin: t.pag,
            competencias: ['Describe la estructura celular.'],
            indicadores: ['Identifica partes de la célula.'],
            periodosSemanales: 3,
            pesoPorcentaje: 10
          }
        ]
      });

      const lunes = res.plan?.dias?.Lunes?.gradosSincronizados?.[0];
      const pasa = lunes && t.validador(lunes);
      if (pasa) {
        console.log(`  ✅ SUPERADO:`, lunes?.ejerciciosLiterales?.[0]?.slice(0, 140) + '...');
        ragExitosos++;
      } else {
        console.log(`  ❌ FALLÓ Validación. Obtenido:`, lunes?.ejerciciosLiterales);
      }
    } catch (e) {
      console.log(`  ❌ Error de llamada:`, e.message);
    }
  }

  return ragExitosos === tests.length;
}

// ==============================================================================
// 3. AUDITORÍA END-TO-END DE LA API DE GEMINI EN AULA MULTIGRADO CON REZAGADOS
// ==============================================================================
async function auditarGeminiMultigrado() {
  console.log('\n======================================================');
  console.log('🤖 3. AUDITORÍA DE GENERACIÓN PROFESIONAL CON GEMINI API');
  console.log('======================================================');

  console.log('Generando planificación multigrado real (5.° y 6.° Primaria) con tema rezagado...');
  
  const payload = {
    grados: [5, 6],
    temasRezagados: [
      '6.° Primaria · Ciencias Naturales y Tecnología: La célula (Pág. 13)'
    ],
    items: [
      {
        grado: 5,
        materia: 'Matemáticas',
        materiaId: 'matematicas',
        materiaBase: 'matematicas',
        libroTitulo: 'Matemáticas 5.° Primaria - MINEDUC',
        unidad: 1,
        unidadTitulo: 'Números y Operaciones',
        tema: 'Series numéricas',
        temaNumero: 1,
        paginaInicio: 9,
        paginaFin: 9,
        competencias: ['Aplica el pensamiento lógico en la resolución de problemas numéricos.'],
        indicadores: ['Identifica patrones en series numéricas crecientes y decrecientes.'],
        periodosSemanales: 5,
        pesoPorcentaje: 25
      },
      {
        grado: 5,
        materia: 'Ciencias Naturales y Tecnología',
        materiaId: 'ciencias_naturales',
        materiaBase: 'ciencias_naturales',
        libroTitulo: 'Ciencias Naturales y Tecnología 5.° Primaria',
        unidad: 1,
        unidadTitulo: 'Conocimiento científico',
        tema: 'La célula',
        temaNumero: 1,
        paginaInicio: 13,
        paginaFin: 13,
        competencias: ['Describe la estructura y funciones de la célula.'],
        indicadores: ['Identifica los organelos celulares en células animales y vegetales.'],
        periodosSemanales: 3,
        pesoPorcentaje: 10
      },
      {
        grado: 6,
        materia: 'Matemáticas',
        materiaId: 'matematicas',
        materiaBase: 'matematicas',
        libroTitulo: 'Matemáticas 6.° Primaria - MINEDUC',
        unidad: 1,
        unidadTitulo: 'Conjuntos y Operaciones',
        tema: 'Conjuntos: operaciones y diagramas de Venn',
        temaNumero: 1,
        paginaInicio: 6,
        paginaFin: 6,
        competencias: ['Utiliza el lenguaje lógico matemático para resolver operaciones con conjuntos.'],
        indicadores: ['Opera unión e intersección de conjuntos y los representa gráficamente.'],
        periodosSemanales: 5,
        pesoPorcentaje: 25
      },
      {
        grado: 6,
        materia: 'Ciencias Naturales y Tecnología',
        materiaId: 'ciencias_naturales',
        materiaBase: 'ciencias_naturales',
        libroTitulo: 'Ciencias Naturales y Tecnología 6.° Primaria',
        unidad: 1,
        unidadTitulo: 'Conocimiento científico',
        tema: 'La célula',
        temaNumero: 1,
        paginaInicio: 13,
        paginaFin: 15,
        competencias: ['Relaciona la estructura celular con los seres vivos.'],
        indicadores: ['Distingue la célula animal de la vegetal y sus organelos.'],
        periodosSemanales: 3,
        pesoPorcentaje: 10
      }
    ]
  };

  const res = await callPlanificacionApi(payload);
  const plan = res.plan;

  if (!plan) {
    console.log('❌ No se recibió objeto plan');
    return false;
  }

  console.log(`\n✅ HTTP Status: ${res.status || 200}`);
  console.log(`📌 Tema Generador Común: "${plan.tema_generador_comun}"`);
  console.log(`📌 Descripción del Eje Integrador: "${plan.descripcion_eje_integrador?.slice(0, 160)}..."`);

  // Verificaciones de calidad
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves'];
  const diasOk = dias.every(d => plan.dias?.[d]);
  console.log(`  * ¿Contiene los 4 días hábiles de planificación?:`, diasOk ? '✅ SÍ' : '❌ NO');

  // Verificar división horaria por períodos
  const lunesG5 = plan.dias?.Lunes?.gradosSincronizados?.find(g => g.gradoNumero === 5 || g.grado.includes('5'));
  const lunesG6 = plan.dias?.Lunes?.gradosSincronizados?.find(g => g.gradoNumero === 6 || g.grado.includes('6'));

  const periodosOk = Boolean(
    lunesG5?.periodo1_actividad &&
    lunesG5?.periodo2_actividad &&
    lunesG5?.periodo3_actividad &&
    lunesG5?.periodo4_actividad
  );
  console.log(`  * ¿Estructura horaria estricta en 4 períodos (08:15 a 11:50 h)?:`, periodosOk ? '✅ SÍ' : '❌ NO');

  // Verificar tratamiento de tema rezagado en Lunes o Martes
  const strLunes = JSON.stringify(plan.dias?.Lunes);
  const strMartes = JSON.stringify(plan.dias?.Martes);
  const rezagadoAtendido = (strLunes + strMartes).includes('NIVELACIÓN') || (strLunes + strMartes).includes('rezagado') || (strLunes + strMartes).includes('pendiente');
  console.log(`  * ¿Priorización de temas rezagados en Lunes/Martes (Nivelación)?:`, rezagadoAtendido ? '✅ SÍ' : '❌ NO');

  // Verificar Viernes de evaluación
  const evalViernes = plan.evaluacion_viernes;
  const tieneEvaluacion = evalViernes && Object.keys(evalViernes).length > 0;
  console.log(`  * ¿Viernes de Evaluación formativa con criterios observables?:`, tieneEvaluacion ? '✅ SÍ' : '❌ NO');

  // Cero alucinación de desastres ambientales
  const strTotal = JSON.stringify(plan).toLowerCase();
  const sinAlucinacion = !strTotal.includes('desastres') && !strTotal.includes('deterioro ambiental');
  console.log(`  * ¿Fidelidad factual (Cero alucinaciones de desastres en la célula)?:`, sinAlucinacion ? '✅ SÍ' : '❌ NO');

  return diasOk && periodosOk && tieneEvaluacion && sinAlucinacion;
}

// Helper HTTP
function callPlanificacionApi(body) {
  return new Promise((resolve, reject) => {
    const dataStr = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/planificacion',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(dataStr)
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(d);
          json.status = res.statusCode;
          resolve(json);
        } catch (e) {
          reject(new Error(`Respuesta no es JSON (HTTP ${res.statusCode}): ${d.slice(0, 200)}`));
        }
      });
    });
    req.on('error', reject);
    req.write(dataStr);
    req.end();
  });
}

async function main() {
  console.log('🚀 INICIANDO AUDITORÍA INTEGRAL DE BACKEND, RAG, VECTORES Y GEMINI');
  
  const bdOk = auditarBasesDeDatos();
  const ragOk = await auditarMotorRAG();
  const geminiOk = await auditarGeminiMultigrado();

  console.log('\n======================================================');
  console.log('🏁 RESULTADO GENERAL DE LA AUDITORÍA DE BACKEND');
  console.log('======================================================');
  console.log(`1. Base de Datos Fáctica y Vectores 768d: ${bdOk ? '✅ APROBADO' : '❌ REPROBADO'}`);
  console.log(`2. Motor RAG e Inteligencia de Contenido:  ${ragOk ? '✅ APROBADO' : '❌ REPROBADO'}`);
  console.log(`3. Calidad y Profesionalismo de Gemini API: ${geminiOk ? '✅ APROBADO' : '❌ REPROBADO'}`);

  if (bdOk && ragOk && geminiOk) {
    console.log('\n🎉 ¡TODOS LOS SUBSISTEMAS DEL BACKEND OPERAN CON RIGOR FÁCTICO E INTELIGENCIA!');
  } else {
    console.log('\n⚠️ Se detectaron inconsistencias que requieren ajuste.');
  }
}

main().catch(console.error);
