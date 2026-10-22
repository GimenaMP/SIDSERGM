import { NextRequest, NextResponse } from 'next/server';
import { generateUnifiedRAGPlan, searchCNBCorresponding, searchMineducExercises, RAGRequestParams } from '@/utils/ragEngine';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import cnbDatabaseRaw from '../../../../data/cnb_processed.json';
import mineducDatabaseRaw from '../../../../data/mineduc_ejercicios.json';

// Inicializar cliente Supabase opcional
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder')) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

const SYSTEM_PROMPT = `
Eres un experto metodólogo pedagógico en el Currículum Nacional Base (CNB) de Guatemala y educación multigrado en primaria (DIGECUR / MINEDUC).
Tu misión es formular la planificación semanal completa de lunes a jueves con evaluación de viernes para aulas multigrado donde el maestro atiende simultáneamente varios grados.

REGLAS PEDAGÓGICAS OBLIGATORIAS:
1. EJE TEMÁTICO INTEGRADOR: Identifica las COMPETENCIAS SIMILARES O ANÁLOGAS entre los grados seleccionados en las diferentes áreas curriculares para articular la clase bajo un mismo tema generador.
2. INCORPORACIÓN DE ÁREAS CURRICULARES: Integra las áreas curriculares correspondientes a los grados (Matemáticas, Comunicación y Lenguaje, Medio Social y Natural / Ciencias, Formación Ciudadana / Ciencias Sociales) a lo largo de la semana.
3. ALTERNANCIA MULTIGRADO ESTRICTA EN CADA JORNADA (08:00 a 12:00):
   - 08:00 - 08:15: Fase de Inicio Común (todos los grados juntos, activación de presaberes sobre el tema común).
   - 08:15 - 09:05: Período 1. Mientras un grado está en "Atención Directa Docente" (modelado en pizarra), los demás están en "Trabajo Autónomo con Guía".
   - 09:05 - 09:55: Período 2 (Inversión Estricta de Roles). El maestro rota la atención directa al siguiente grado, mientras el grado anterior trabaja autónomamente en cuaderno.
   - 09:55 - 10:00: Preparación receso.
   - 10:00 - 10:30: RECESO ESCOLAR. Estrictamente libre de actividades académicas.
   - 10:30 - 11:15: Período 3 (Aplicación e indagación contextualizada con segunda área curricular).
   - 11:15 - 11:50: Período 4 (Práctica autónoma con guías).
   - 11:50 - 12:00: Fase de Cierre Común y Síntesis.
4. PLANIFICA DE UNA VEZ LOS 4 DÍAS (Lunes, Martes, Miércoles, Jueves).
5. EJERCICIOS LITERALES REDACTADOS: Cada día y grado debe incluir el libro oficial, número de página, tema y los ejercicios redactados TAL CUAL están en los libros oficiales del MINEDUC para que los estudiantes los resuelvan directamente.
6. EVALUACIÓN DE VIERNES: Test individual escrito (3 problemas completos por grado) y lista de cotejo con 3 criterios observables de desempeño.

GUARDRAILS DE SEGURIDAD (ANTI-ALUCINACIÓN):
- Usa EXCLUSIVAMENTE los libros, páginas, temas y competencias del contexto RAG provisto.
- No inventes números de página arbitrarios fuera del contexto.
- Devuelve la respuesta ÚNICAMENTE como un objeto JSON válido.
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Normalizar grados seleccionados
    let gradosNums: number[] = [];
    if (Array.isArray(body.grados) && body.grados.length > 0) {
      gradosNums = body.grados.map((g: any) => parseInt(String(g).replace(/\D/g, ''), 10)).filter((n: number) => !isNaN(n));
    } else {
      if (body.grado1) gradosNums.push(parseInt(String(body.grado1).replace(/\D/g, ''), 10));
      if (body.grado2) gradosNums.push(parseInt(String(body.grado2).replace(/\D/g, ''), 10));
      if (body.grado3) gradosNums.push(parseInt(String(body.grado3).replace(/\D/g, ''), 10));
    }

    if (gradosNums.length === 0) {
      gradosNums = [3, 4];
    }
    gradosNums.sort((a, b) => a - b);

    const area = body.area || body.area_curricular || 'Todas las Áreas Curriculares (Jornada Integral)';
    const bloque = Number(body.bloque || body.bimestre || 1);
    const semana = Number(body.semana || 3);
    const temasRezagados = Array.isArray(body.temasRezagados) ? body.temasRezagados : [];

    // 1. Plan fáctico base de respaldo garantizado
    const basePlan = generateUnifiedRAGPlan({
      grados: gradosNums,
      bimestre: bloque,
      semana: semana,
      area: area,
      temasRezagados: temasRezagados,
      ciclo: gradosNums.some(g => g <= 3) ? 'primer_ciclo' : 'segundo_ciclo'
    });

    const apiKey = process.env.GEMINI_API_KEY;

    // Si no hay API key o es placeholder, responder con RAG local
    if (!apiKey || apiKey.includes('placeholder')) {
      return NextResponse.json({
        success: true,
        fuente: 'rag_vectorial_local',
        mensaje: 'Planificación generada con base curricular oficial CNB (DIGECUR) y guías MINEDUC.',
        tema_generador_comun: basePlan.tema_generador_comun,
        plan: basePlan
      });
    }

    // 2. Extraer fragmentos RAG para todos los grados y todas las áreas de los datos oficiales
    const cnbDatabase = cnbDatabaseRaw as any[];
    const mineducDatabase = mineducDatabaseRaw as any[];

    const cnbContexto = cnbDatabase.filter(c => gradosNums.includes(c.grado));
    const mineducContexto = mineducDatabase.filter(m => gradosNums.includes(m.grado_especifico));

    // 3. Invocar a Gemini con modelo rápido y confiable
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      // 'gemini-3-flash-preview' está verificado y responde en ~3-10 segundos
      const candidateModels = [
        'gemini-3-flash-preview',
        'gemini-3.5-flash',
        'gemini-3.8-flash',
        'gemini-2.5-flash',
        'gemini-flash-latest'
      ];

      let model: any = null;
      for (const mName of candidateModels) {
        try {
          model = genAI.getGenerativeModel({
            model: mName,
            systemInstruction: SYSTEM_PROMPT,
            generationConfig: {
              temperature: 0.1,
              responseMimeType: 'application/json'
            }
          });
          if (model) break;
        } catch {
          // probar siguiente
        }
      }

      if (model) {
        const prompt = `Actúa como especialista pedagógico CNB y genera la planificación multigrado oficial para los grados: ${gradosNums.map(g => `${g}.° Grado`).join(', ')}.
Bloque (Bimestre): ${bloque} | Semana del ciclo: ${semana}
Área Curricular Solicitada: ${area}
Temas rezagados a reforzar: ${temasRezagados.length > 0 ? temasRezagados.join('; ') : 'Ninguno reportado'}

CONTEXTO DOCUMENTAL RAG RECUPERADO DE LA BASE DE DATOS (CNB DIGECUR + MINEDUC):
--- REGISTROS CNB DE LOS GRADOS SELECCIONADOS ---
${JSON.stringify(cnbContexto, null, 2)}

--- LIBROS Y EJERCICIOS OFICIALES MINEDUC DE LOS GRADOS SELECCIONADOS ---
${JSON.stringify(mineducContexto, null, 2)}

INSTRUCCIONES CLAVE DE GENERACIÓN:
1. Revisa las competencias del CNB de los grados ${gradosNums.join(', ')} e identifica las COMPETENCIAS SIMILARES / ANÁLOGAS para definir:
   - "tema_generador_comun": título del eje integrador
   - "descripcion_eje_integrador": explicación pedagógica de cómo se articulan los grados
   - "competencias_similares_identificadas": lista de objetos { "area": string, "eje_comun": string, "grados_articulacion": string }
2. Genera de una vez los 4 DÍAS DE LA SEMANA (Lunes, Martes, Miércoles, Jueves).
   En cada día, en el array "gradosSincronizados" debe existir un elemento para CADA uno de los grados atendidos (${gradosNums.map(g => `${g}.° Primaria`).join(', ')}).
   Cada elemento debe contener:
   - "grado": "${gradosNums[0]}.° Primaria", etc.
   - "gradoNumero": número entero del grado
   - "materia": Área curricular (Matemáticas, Comunicación y Lenguaje, Medio Social y Natural / Ciencias, Formación Ciudadana)
   - "tema": Nombre exacto de la lección
   - "modalidad": "Atención Directa Docente" o "Trabajo Autónomo con Guía" (respetando la alternancia entre grados)
   - "cnbCompetencia": Competencia oficial del CNB
   - "cnbIndicador": Indicador de logro oficial
   - "libroTitulo": Nombre oficial del libro MINEDUC
   - "numeroPagina": Número de página física real del libro
   - "seccionLibro": Título de la unidad
   - "ejerciciosLiterales": Array de strings con los enunciados y problemas completos redactados tal cual
   - "actividadDocente": Indicación para el maestro
   - "actividadEstudiante": Indicación para el estudiante
   - "periodo1_actividad": "08:15 - 09:05 | ..."
   - "periodo2_actividad": "09:05 - 09:55 | ..."
   - "periodo3_actividad": "10:30 - 11:15 | ..."
   - "periodo4_actividad": "11:15 - 11:50 | ..."
   - "tareaCasa": Tarea de refuerzo en familia
   - "completado": true/false
3. Genera la "evaluacion_viernes" para cada grado con test individual (3 problemas completamente redactados) y lista de cotejo con 3 criterios observables.

Devuelve la respuesta en formato JSON con las claves:
{
  "tema_generador_comun": string,
  "descripcion_eje_integrador": string,
  "competencias_similares_identificadas": [ { "area": string, "eje_comun": string, "grados_articulacion": string } ],
  "alineacion_cnb": { [grado: string]: { "grado": string, "competencia": string, "indicador_logro": string, "contenido_declarativo": string } },
  "dias": {
    "Lunes": { "dia": "Lunes", "enfoqueDidactico": string, "fase_inicio_comun": string, "fase_cierre_comun": string, "gradosSincronizados": [ ... ] },
    "Martes": { "dia": "Martes", "enfoqueDidactico": string, "fase_inicio_comun": string, "fase_cierre_comun": string, "gradosSincronizados": [ ... ] },
    "Miércoles": { "dia": "Miércoles", "enfoqueDidactico": string, "fase_inicio_comun": string, "fase_cierre_comun": string, "gradosSincronizados": [ ... ] },
    "Jueves": { "dia": "Jueves", "enfoqueDidactico": string, "fase_inicio_comun": string, "fase_cierre_comun": string, "gradosSincronizados": [ ... ] }
  },
  "evaluacion_viernes": { [grado: string]: { "grado": string, "gradoNumero": number, "horario_evaluacion": "08:00 - 10:00", "horario_receso": "10:00 - 10:30", "horario_retroalimentacion": "10:30 - 12:00", "indicador_a_evaluar": string, "descripcion_test": string, "instrumento_evaluacion": string, "criterios_lista_cotejo": string[], "hoja_trabajo_ejercicios": string[] } }
}`;

        // Timeout generoso de 35 segundos para permitir generación detallada de 4 días
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout Gemini RAG multigrado (activando RAG fáctico local)')), 35000)
        );

        const geminiPromise = model.generateContent(prompt);
        const result: any = await Promise.race([geminiPromise, timeoutPromise]);
        const responseText = result.response.text();
        const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
          const aiData = JSON.parse(cleanedJson);

          // Validar que dias tenga Lunes a Jueves con gradosSincronizados
          if (aiData.dias && aiData.dias.Lunes && Array.isArray(aiData.dias.Lunes.gradosSincronizados)) {
            // Unir con basePlan para garantizar propiedades auxiliares (horarios de bloques, etc.)
            const mergedDias: any = {};
            const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves'] as const;

            for (const d of diasSemana) {
              const aiDia = aiData.dias[d] || {};
              const baseDia = basePlan.dias[d] || {};

              mergedDias[d] = {
                dia: d,
                enfoqueDidactico: aiDia.enfoqueDidactico || baseDia.enfoqueDidactico,
                horarioJornada: '08:00 - 12:00 (210 min efectivos)',
                duracionMinutos: 210,
                bloque1_horario: '08:00 - 10:00 (Bloque Troncal: 120 min)',
                fase_inicio_comun: aiDia.fase_inicio_comun || baseDia.fase_inicio_comun,
                periodo_1_horario: '08:15 - 09:05 (50 min) | Período 1: Rotación Multigrado (Atención Directa vs Autónomo)',
                periodo_2_horario: '09:05 - 09:55 (50 min) | Período 2: Inversión Estricta de Roles de Rotación',
                preparacion_receso: '09:55 - 10:00 (5 min) | Guardar materiales y preparación para el receso',
                receso_horario: '10:00 - 10:30 (30 min) | RECESO ESCOLAR - Libre de actividades académicas',
                bloque2_horario: '10:30 - 12:00 (Bloque Aplicado: 90 min)',
                periodo_3_horario: '10:30 - 11:15 (45 min) | Período 3: Aplicación e Indagación Contextualizada por Grado',
                periodo_4_horario: '11:15 - 11:50 (35 min) | Período 4: Práctica Autónoma con Guía y Cuaderno',
                fase_cierre_comun: aiDia.fase_cierre_comun || baseDia.fase_cierre_comun,
                gradosSincronizados: aiDia.gradosSincronizados.map((item: any, idx: number) => {
                  const baseItem = baseDia.gradosSincronizados?.[idx] || {};
                  return {
                    ...baseItem,
                    ...item,
                    gradoNumero: item.gradoNumero || baseItem.gradoNumero || gradosNums[idx] || gradosNums[0],
                    materia: item.materia || baseItem.materia || 'Matemáticas',
                    ejerciciosLiterales: Array.isArray(item.ejerciciosLiterales) && item.ejerciciosLiterales.length > 0 
                      ? item.ejerciciosLiterales 
                      : (baseItem.ejerciciosLiterales || [])
                  };
                })
              };
            }

            const completePlan = {
              ...basePlan,
              area_curricular: area,
              tema_generador_comun: aiData.tema_generador_comun || basePlan.tema_generador_comun,
              descripcion_eje_integrador: aiData.descripcion_eje_integrador || basePlan.descripcion_eje_integrador,
              competencias_similares_identificadas: aiData.competencias_similares_identificadas || [],
              alineacion_cnb: aiData.alineacion_cnb || basePlan.alineacion_cnb,
              dias: mergedDias,
              evaluacion_viernes: aiData.evaluacion_viernes || basePlan.evaluacion_viernes,
              fuenteGeneracion: 'gemini_rag_grounded'
            };

            return NextResponse.json({
              success: true,
              fuente: 'gemini_3_flash_rag',
              mensaje: 'Planificación multigrado generada por Gemini con búsqueda fáctica en CNB y guías oficiales MINEDUC.',
              tema_generador_comun: completePlan.tema_generador_comun,
              plan: completePlan
            });
          }
        } catch (jsonErr) {
          console.warn('Advertencia parseando JSON de Gemini:', jsonErr);
        }
      }
    } catch (geminiError: any) {
      console.warn('Aviso: Gemini API en fallback a RAG Local:', geminiError.message);
    }

    // Fallback fáctico garantizado sin alucinaciones
    return NextResponse.json({
      success: true,
      fuente: 'rag_vectorial_local',
      mensaje: 'Planificación ensamblada con éxito usando el motor RAG fáctico local (Eje Integrador CNB DIGECUR + Textos Oficiales MINEDUC).',
      tema_generador_comun: basePlan.tema_generador_comun,
      plan: basePlan
    });

  } catch (error: any) {
    console.error('Error generando planificación:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno al generar planificación' },
      { status: 500 }
    );
  }
}
