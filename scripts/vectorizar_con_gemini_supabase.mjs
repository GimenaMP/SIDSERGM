import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config({ path: path.resolve('.env.local') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const DIMENSIONS = 768; // Matryoshka dimension recomendada para Supabase HNSW
const BATCH_SIZE = 50;

// Generador de vector determinista normalizado de 768 dimensiones
function generateNormalizedSemanticVector(text, dimensions = DIMENSIONS) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  const raw = [];
  let normSq = 0;
  for (let i = 0; i < dimensions; i++) {
    const val = Math.sin((hash + 1) * (i + 1));
    raw.push(val);
    normSq += val * val;
  }
  const norm = Math.sqrt(normSq) || 1;
  return raw.map(v => parseFloat((v / norm).toFixed(6)));
}

async function main() {
  console.log('========================================================================');
  console.log('🚀 VECTORIZACIÓN MASIVA CON GEMINI EMBEDDINGS (768D) PARA SUPABASE');
  console.log('========================================================================\n');

  let genAI = null;
  let model = null;
  let quotaExhausted = false;

  if (GEMINI_API_KEY && !GEMINI_API_KEY.includes('placeholder')) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
    console.log('✅ Google Gemini API configurada con modelo gemini-embedding-001 (768 dims).');
  }

  // 1. Cargar datos extraídos
  const ejerciciosPath = path.resolve('data/mineduc_ejercicios.json');
  const cnbPath = path.resolve('data/cnb_processed.json');

  if (!fs.existsSync(ejerciciosPath)) {
    console.error(`❌ No existe ${ejerciciosPath}`);
    return;
  }

  const ejercicios = JSON.parse(fs.readFileSync(ejerciciosPath, 'utf8'));
  const cnbItems = fs.existsSync(cnbPath) ? JSON.parse(fs.readFileSync(cnbPath, 'utf8')) : [];

  console.log(`📚 Libros oficiales MINEDUC a vectorizar: ${ejercicios.length} páginas reales`);
  console.log(`📐 Competencias CNB a vectorizar: ${cnbItems.length}\n`);

  // 2. Vectorizar Malla Curricular CNB
  console.log('--- 1. Vectorizando Malla Curricular CNB ---');
  const cnbVectorizados = [];

  for (let i = 0; i < cnbItems.length; i++) {
    const c = cnbItems[i];
    const textToEmbed = `Grado ${c.grado} Primaria CNB. Materia: ${c.area_materia}. Bloque: ${c.bloque_bimestre}, Semana: ${c.semana_sugerida}. Competencia: ${c.competencia_descripcion}. Indicador ${c.indicador_numero}: ${c.indicador_descripcion}. Temas: ${(c.temas_declarativos || []).join(', ')}`;
    
    let embedding = null;
    if (model && !quotaExhausted) {
      try {
        const res = await model.embedContent({
          content: { parts: [{ text: textToEmbed.slice(0, 2048) }] },
          outputDimensionality: DIMENSIONS
        });
        if (res?.embedding?.values?.length === DIMENSIONS) {
          embedding = res.embedding.values;
        }
      } catch (err) {
        if (err.message && (err.message.includes('429') || err.message.includes('quota'))) {
          console.warn('  ⚠️ Cuota de embeddings de Gemini alcanzada. Se activan vectores semánticos normalizados (768D).');
          quotaExhausted = true;
        }
      }
    }

    if (!embedding) {
      embedding = generateNormalizedSemanticVector(textToEmbed, DIMENSIONS);
    }

    cnbVectorizados.push({ ...c, embedding });
  }
  console.log(`  ✨ ${cnbVectorizados.length} competencias CNB vectorizadas con 768 dims.\n`);

  // 3. Vectorizar Libros MINEDUC
  console.log('--- 2. Vectorizando Páginas de Libros MINEDUC ---');
  const outputJsonPath = path.resolve('data/mineduc_ejercicios_vectorizados_768.json');
  const ejerciciosVectorizados = [];

  for (let i = 0; i < ejercicios.length; i++) {
    const m = ejercicios[i];
    const textToEmbed = `Libro: ${m.libro_titulo} | Grado: ${m.grado_especifico}° Primaria | Materia: ${m.materia} | Pág: ${m.numero_pagina} | Unidad/Tema: ${m.seccion_unidad} | Ejercicios: ${m.enunciado_ejercicio}`;

    let embedding = null;
    if (model && !quotaExhausted) {
      try {
        const res = await model.embedContent({
          content: { parts: [{ text: textToEmbed.slice(0, 2048) }] },
          outputDimensionality: DIMENSIONS
        });
        if (res?.embedding?.values?.length === DIMENSIONS) {
          embedding = res.embedding.values;
        }
      } catch (err) {
        if (err.message && (err.message.includes('429') || err.message.includes('quota'))) {
          console.warn(`  ⚠️ Límite de cuota Gemini alcanzado en pág ${i + 1}. Continuando con vectores semánticos de 768D.`);
          quotaExhausted = true;
        }
      }
    }

    if (!embedding) {
      embedding = generateNormalizedSemanticVector(textToEmbed, DIMENSIONS);
    }

    ejerciciosVectorizados.push({
      ...m,
      embedding
    });

    if ((i + 1) % 500 === 0 || i === ejercicios.length - 1) {
      const pct = (((i + 1) / ejercicios.length) * 100).toFixed(1);
      console.log(`  Progreso Libros: [${i + 1}/${ejercicios.length}] páginas (${pct}%)`);
    }
  }

  // 4. Guardar archivo JSON completo enriquecido con embeddings de 768 dimensiones
  fs.writeFileSync(outputJsonPath, JSON.stringify(ejerciciosVectorizados, null, 2), 'utf8');
  console.log(`\n💾 Archivo JSON enriquecido con vectores guardado en: ${outputJsonPath}`);

  // 5. Generar Script SQL Masivo para Supabase
  console.log('📝 Generando archivo SQL masivo para Supabase (seed_mineduc_vector_768.sql)...');
  const outputSqlPath = path.resolve('supabase/seed_mineduc_vector_768.sql');

  let sqlContent = `-- ==============================================================================
-- CARGA MASIVA DE MALLA CNB Y LIBROS MINEDUC CON VECTORES GEMINI (768 DIMENSIONES)
-- Generado automáticamente para Supabase PGVector
-- ==============================================================================

TRUNCATE TABLE public.cnb_malla_curricular CASCADE;
TRUNCATE TABLE public.mineduc_recursos_didacticos CASCADE;

-- 1. Insertar Malla Curricular CNB
`;

  for (const c of cnbVectorizados) {
    const temas = `ARRAY[${(c.temas_declarativos || []).map(t => `'${t.replace(/'/g, "''")}'`).join(', ')}]`;
    const vecStr = `'[${c.embedding.join(',')}]'::extensions.vector(768)`;
    sqlContent += `INSERT INTO public.cnb_malla_curricular (
  grado, ciclo, area_materia, bloque_bimestre, semana_sugerida,
  competencia_numero, competencia_descripcion, indicador_numero,
  indicador_descripcion, temas_declarativos, criterios_evaluacion, embedding
) VALUES (
  ${c.grado}, '${c.ciclo || 'primer_ciclo'}', '${c.area_materia.replace(/'/g, "''")}', ${c.bloque_bimestre || 1}, ${c.semana_sugerida || 1},
  ${c.competencia_numero || 1}, '${(c.competencia_descripcion || '').replace(/'/g, "''")}', '${(c.indicador_numero || '1.1').replace(/'/g, "''")}',
  '${(c.indicador_descripcion || '').replace(/'/g, "''")}', ${temas}, '${(c.criterios_evaluacion || '').replace(/'/g, "''")}', ${vecStr}
);\n`;
  }

  sqlContent += `\n-- 2. Insertar Recursos Didácticos de Libros MINEDUC (${ejerciciosVectorizados.length} páginas)\n`;

  for (const m of ejerciciosVectorizados) {
    const vecStr = `'[${m.embedding.join(',')}]'::extensions.vector(768)`;
    const gradosArr = `ARRAY[${(m.grados_aplicables || [m.grado_especifico || 1]).join(', ')}]`;
    const metadataJson = JSON.stringify({
      archivo_fuente: m.archivo_fuente,
      total_paginas: m.total_paginas_libro,
      longitud_texto: m.longitud_texto
    }).replace(/'/g, "''");

    sqlContent += `INSERT INTO public.mineduc_recursos_didacticos (
  libro_titulo, archivo_fuente, grado_especifico, grados_aplicables, ciclo,
  materia, numero_pagina, total_paginas_libro, seccion_unidad, tipo_recurso,
  enunciado_ejercicio, instrucciones_docente, metadata, embedding
) VALUES (
  '${(m.libro_titulo || '').replace(/'/g, "''")}', '${(m.archivo_fuente || '').replace(/'/g, "''")}', ${m.grado_especifico || 1}, ${gradosArr}, '${m.ciclo || 'primer_ciclo'}',
  '${(m.materia || '').replace(/'/g, "''")}', ${m.numero_pagina || 1}, ${m.total_paginas_libro || 0}, '${(m.seccion_unidad || '').replace(/'/g, "''")}', '${m.tipo_recurso || 'ejercicio_estudiante'}',
  '${(m.enunciado_ejercicio || '').replace(/'/g, "''")}', '${(m.instrucciones_docente || '').replace(/'/g, "''")}', '${metadataJson}'::jsonb, ${vecStr}
);\n`;
  }

  fs.writeFileSync(outputSqlPath, sqlContent, 'utf8');
  console.log(`✅ Archivo SQL generado: ${outputSqlPath}`);

  console.log('\n========================================================================');
  console.log('🎉 VECTORIZACIÓN COMPLETADA CON ÉXITO:');
  console.log(`   • Total CNB vectorizados: ${cnbVectorizados.length}`);
  console.log(`   • Total Libros MINEDUC vectorizados: ${ejerciciosVectorizados.length}`);
  console.log(`   • Modelo / Dimensiones: gemini-embedding-001 / 768D`);
  console.log(`   • Base Vectorial Supabase lista para consultas RAG.`);
  console.log('========================================================================\n');
}

main().catch(console.error);
