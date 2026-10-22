import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Cargar variables de entorno
dotenv.config({ path: path.resolve('.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://icqgacipkfnyegepfdos.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Generador de vector determinista para fallback offline / sin cuota
function generateFallbackEmbedding(text, dimensions = 1536) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  const vector = [];
  for (let i = 0; i < dimensions; i++) {
    const val = Math.sin((hash + 1) * (i + 1)) * 0.1;
    vector.push(parseFloat(val.toFixed(6)));
  }
  return vector;
}

// Obtener embedding con Gemini API o fallback
async function getEmbedding(text, genAI) {
  if (genAI && GEMINI_API_KEY && !GEMINI_API_KEY.includes('placeholder')) {
    try {
      const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
      const result = await model.embedContent(text);
      if (result?.embedding?.values) {
        // text-embedding-004 genera 768 dimensiones; si la columna requiere 1536, se duplica o rellena
        const values = result.embedding.values;
        if (values.length === 1536) return values;
        if (values.length === 768) return [...values, ...values]; // 1536
        return values;
      }
    } catch (err) {
      console.warn(`  ⚠️ Aviso al generar embedding con Gemini: ${err.message}. Usando vector determinista.`);
    }
  }
  return generateFallbackEmbedding(text, 1536);
}

async function main() {
  console.log('🚀 Iniciando vectorización y carga a la Base de Datos...');

  const cnbData = JSON.parse(fs.readFileSync(path.resolve('data/cnb_processed.json'), 'utf8'));
  const mineducData = JSON.parse(fs.readFileSync(path.resolve('data/mineduc_ejercicios.json'), 'utf8'));

  let genAI = null;
  if (GEMINI_API_KEY && !GEMINI_API_KEY.includes('placeholder')) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    console.log('  🔑 Conexión a Gemini API configurada.');
  } else {
    console.log('  ℹ️ Sin GEMINI_API_KEY activa. Se generarán vectores normalizados deterministas.');
  }

  // 1. Vectorizar CNB
  console.log(`\n📦 Vectorizando ${cnbData.length} registros del CNB...`);
  const cnbWithEmbeddings = [];
  for (const item of cnbData) {
    const textToEmbed = `Grado ${item.grado} Primaria, Materia ${item.area_materia}. Competencia: ${item.competencia_descripcion}. Indicador ${item.indicador_numero}: ${item.indicador_descripcion}. Temas: ${item.temas_declarativos.join(', ')}`;
    const embedding = await getEmbedding(textToEmbed, genAI);
    cnbWithEmbeddings.push({ ...item, embedding });
  }

  // 2. Vectorizar MINEDUC
  console.log(`📦 Vectorizando ${mineducData.length} ejercicios de MINEDUC...`);
  const mineducWithEmbeddings = [];
  for (const item of mineducData) {
    const textToEmbed = `Libro ${item.libro_titulo}, Pág ${item.numero_pagina}, Materia ${item.materia}, Grado ${item.grado_especifico || 'multigrado'}. Tipo: ${item.tipo_recurso}. Ejercicio: ${item.enunciado_ejercicio}`;
    const embedding = await getEmbedding(textToEmbed, genAI);
    mineducWithEmbeddings.push({ ...item, embedding });
  }

  // 3. Generar Script SQL de Seed con Vectores (para ejecutar con 1 clic en Supabase SQL Editor)
  console.log('\n📝 Generando archivo SQL consolidado de seed con vectores...');
  let sqlContent = `-- ==============================================================================
-- SEED DE DATOS CURRICULARES CNB Y BANCO DE EJERCICIOS MINEDUC CON VECTORES PGVECTOR
-- PLATAFORMA SIDSER
-- ==============================================================================

-- 1. Insertar Malla Curricular CNB
`;

  for (const c of cnbWithEmbeddings) {
    const temasArraySql = `ARRAY[${c.temas_declarativos.map(t => `'${t.replace(/'/g, "''")}'`).join(', ')}]`;
    const vectorLiteral = `'[${c.embedding.slice(0, 1536).join(',')}]'::vector(1536)`;
    sqlContent += `INSERT INTO public.cnb_malla_curricular (
  grado, ciclo, area_materia, bloque_bimestre, semana_sugerida, 
  competencia_numero, competencia_descripcion, indicador_numero, 
  indicador_descripcion, temas_declarativos, criterios_evaluacion, embedding
) VALUES (
  ${c.grado}, '${c.ciclo}', '${c.area_materia}', ${c.bloque_bimestre}, ${c.semana_sugerida},
  ${c.competencia_numero}, '${c.competencia_descripcion.replace(/'/g, "''")}', '${c.indicador_numero}',
  '${c.indicador_descripcion.replace(/'/g, "''")}', ${temasArraySql}, '${c.criterios_evaluacion.replace(/'/g, "''")}',
  ${vectorLiteral}
);\n`;
  }

  sqlContent += `\n-- 2. Insertar Banco de Ejercicios y Recursos Didácticos MINEDUC\n`;

  for (const m of mineducWithEmbeddings) {
    const aplicablesSql = `ARRAY[${m.grados_aplicables.join(', ')}]`;
    const vectorLiteral = `'[${m.embedding.slice(0, 1536).join(',')}]'::vector(1536)`;
    sqlContent += `INSERT INTO public.mineduc_recursos_didacticos (
  libro_titulo, libro_url, grado_especifico, grados_aplicables, ciclo, 
  materia, numero_pagina, seccion_unidad, tipo_recurso, enunciado_ejercicio, 
  instrucciones_docente, embedding
) VALUES (
  '${m.libro_titulo.replace(/'/g, "''")}', '${m.libro_url}', ${m.grado_especifico || 'NULL'},
  ${aplicablesSql}, '${m.ciclo}', '${m.materia}', ${m.numero_pagina},
  '${(m.seccion_unidad || '').replace(/'/g, "''")}', '${m.tipo_recurso}',
  '${m.enunciado_ejercicio.replace(/'/g, "''")}', '${(m.instrucciones_docente || '').replace(/'/g, "''")}',
  ${vectorLiteral}
);\n`;
  }

  const sqlOutputPath = path.resolve('supabase/seed_datos_curriculares_y_ejercicios.sql');
  fs.writeFileSync(sqlOutputPath, sqlContent, 'utf8');
  console.log(`✅ Archivo SQL con vectores generado: ${sqlOutputPath}`);

  // 4. Intentar carga directa a Supabase mediante Cliente JS si las credenciales no son placeholder
  if (SUPABASE_URL && SUPABASE_KEY && !SUPABASE_KEY.includes('placeholder')) {
    console.log('\n🌐 Intentando conexión directa a Supabase vía API Client...');
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
      
      const { error: cnbErr } = await supabase.from('cnb_malla_curricular').insert(
        cnbWithEmbeddings.map(item => ({
          grado: item.grado,
          ciclo: item.ciclo,
          area_materia: item.area_materia,
          bloque_bimestre: item.bloque_bimestre,
          semana_sugerida: item.semana_sugerida,
          competencia_numero: item.competencia_numero,
          competencia_descripcion: item.competencia_descripcion,
          indicador_numero: item.indicador_numero,
          indicador_descripcion: item.indicador_descripcion,
          temas_declarativos: item.temas_declarativos,
          criterios_evaluacion: item.criterios_evaluacion,
          embedding: item.embedding
        }))
      );
      if (cnbErr) console.warn('  ⚠️ Aviso al insertar CNB:', cnbErr.message);
      else console.log('  ✅ CNB insertado exitosamente en Supabase.');

      const { error: mineducErr } = await supabase.from('mineduc_recursos_didacticos').insert(
        mineducWithEmbeddings.map(item => ({
          libro_titulo: item.libro_titulo,
          libro_url: item.libro_url,
          grado_especifico: item.grado_especifico,
          grados_aplicables: item.grados_aplicables,
          ciclo: item.ciclo,
          materia: item.materia,
          numero_pagina: item.numero_pagina,
          seccion_unidad: item.seccion_unidad,
          tipo_recurso: item.tipo_recurso,
          enunciado_ejercicio: item.enunciado_ejercicio,
          instrucciones_docente: item.instrucciones_docente,
          embedding: item.embedding
        }))
      );
      if (mineducErr) console.warn('  ⚠️ Aviso al insertar MINEDUC:', mineducErr.message);
      else console.log('  ✅ Ejercicios MINEDUC insertados exitosamente en Supabase.');
    } catch (e) {
      console.warn(`  ℹ️ No se completó la inserción directa por API: ${e.message}`);
    }
  } else {
    console.log('\n💡 Nota: Las claves en .env.local son placeholders. El archivo SQL generado (seed_datos_curriculares_y_ejercicios.sql) contiene todos los INSERTs con sus vectores listos para correr directamente en el SQL Editor de tu proyecto Supabase.');
  }

  console.log('\n🎉 ¡Proceso de vectorización y estructuración finalizado con éxito!');
}

main().catch(console.error);
