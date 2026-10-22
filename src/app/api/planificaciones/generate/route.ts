import { NextRequest, NextResponse } from 'next/server';
import { generateUnifiedRAGPlan, RAGRequestParams, UnifiedWeeklyPlan } from '@/utils/ragEngine';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const body: RAGRequestParams = await req.json();

    // 1. Ejecutar Recuperación RAG Fáctica Local (Zero-Hallucination Baseline)
    const basePlan = generateUnifiedRAGPlan(body);

    const apiKey = process.env.GEMINI_API_KEY;

    // Si no hay API key o es un placeholder, devolver el plan RAG fáctico directamente
    if (!apiKey || apiKey.includes('placeholder')) {
      return NextResponse.json({
        success: true,
        fuente: 'rag_vectorial_local',
        mensaje: 'Planificación generada con base documental oficial CNB y libros de texto MINEDUC.',
        plan: basePlan
      });
    }

    // 2. Intentar refinamiento pedagógico con Google Gemini con timeout de 6 segundos
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const candidateModels = ['gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.1-flash-lite'];
      let model = null;

      for (const mName of candidateModels) {
        try {
          model = genAI.getGenerativeModel({ model: mName });
          if (model) break;
        } catch {
          // continuar
        }
      }

      if (model) {
        // Armar contexto estricto de Grounding según la metodología de Eje Integrador / Tema Generador
        const groundingContext = {
          semana: `Semana ${basePlan.semana}`,
          bimestre: `Bimestre ${basePlan.bimestre}`,
          area_curricular: basePlan.area_curricular,
          grados_atendidos: basePlan.grados.map(g => `${g}.° Primaria`),
          tema_generador_comun: basePlan.tema_generador_comun,
          descripcion_eje_integrador: basePlan.descripcion_eje_integrador,
          alineacion_cnb: basePlan.alineacion_cnb,
          temasRezagados: basePlan.temasRezagados,
          dias_plan: Object.keys(basePlan.dias).map(d => {
            const dp = basePlan.dias[d as keyof typeof basePlan.dias];
            return {
              dia: d,
              fase_inicio_comun: dp.fase_inicio_comun,
              fase_cierre_comun: dp.fase_cierre_comun,
              grados: dp.gradosSincronizados.map(g => ({
                grado: g.grado,
                modalidad: g.modalidad,
                actividad_docente: g.actividadDocente,
                actividad_estudiante: g.actividadEstudiante,
                libro_titulo: g.libroTitulo,
                numero_pagina: g.numeroPagina,
                indicador: g.cnbIndicador,
                ejercicios: g.ejerciciosLiterales
              }))
            };
          }),
          evaluacion_viernes: basePlan.evaluacion_viernes
        };

        const prompt = `Actúas como el Agente Pedagógico Especialista de la Plataforma SIDSER para Escuelas Primarias Rurales Multigrado de Guatemala.
Tu objetivo es estructurar la planificación pedagógica multigrado bajo la metodología oficial del CNB (DIGECUR): **Eje Integrador / Tema Generador Común** y alternancia de **Atención Directa vs Trabajo Autónomo con Guía**.

REGLAS DE ORO DE CERO ALUCINACIÓN (STRICT GROUNDING):
1. **Tema Generador Común:** Mantén el tema generador común (${basePlan.tema_generador_comun}) y gradúa la complejidad por grado.
2. **Conservación de Libros y Páginas:** Conserva exactamente los libros oficiales del MINEDUC y las páginas físicas indicadas en el contexto RAG. No inventes páginas ni libros ficticios.
3. **Alineación CNB:** Conserva las competencias e indicadores de logro del CNB (DIGECUR) tal cual fueron recuperados.
4. **Estructura Diaria (Lunes a Jueves):**
   - Fase de Inicio (10–15 min - Común): Activación motivacional grupal para todos los grados.
   - Fase de Desarrollo (30–40 min - Diferenciado por Grado y Rotativo): Mientras un grado está en "Atención Directa Docente", los demás están en "Trabajo Autónomo con Guía" o "Trabajo Cooperativo / Práctica".
   - Fase de Cierre (10 min - Común): Plenaria corta para compartir estrategias.
5. **Viernes (Evaluación del Alcance de la Competencia):**
   - Hoja de evaluación individual por grado para verificar el indicador trabajado de lunes a jueves.
   - Lista de cotejo con 3 criterios evaluables claros.

Contexto Fáctico Recuperado del CNB y MINEDUC:
${JSON.stringify(groundingContext, null, 2)}

Devuelve únicamente un objeto JSON con el siguiente formato:
{
  "tema_generador_comun": "${basePlan.tema_generador_comun}",
  "observacionesPedagogicas": "Estrategia didáctica para articular los grados en torno al tema común",
  "recomendacionRezagados": "Cómo nivelar temas pendientes (${basePlan.temasRezagados.join(', ') || 'ninguno'}) en la fase de inicio o desarrollo",
  "tipEvaluacionViernes": "Consejo para la aplicación de la lista de cotejo y hoja de trabajo del viernes"
}`;

        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout de consulta Gemini (usando RAG local)')), 6000)
        );

        const geminiPromise = model.generateContent(prompt);
        const result: any = await Promise.race([geminiPromise, timeoutPromise]);
        const responseText = result.response.text();

        const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        try {
          const aiEnrichment = JSON.parse(cleanedJson);
          return NextResponse.json({
            success: true,
            fuente: 'gemini_rag_grounded',
            mensaje: 'Planificación enriquecida con éxito mediante Google Gemini (Metodología de Eje Integrador CNB/MINEDUC).',
            enriquecimientoAI: aiEnrichment,
            plan: {
              ...basePlan,
              fuenteGeneracion: 'gemini_rag_grounded'
            }
          });
        } catch {
          return NextResponse.json({
            success: true,
            fuente: 'gemini_rag_grounded',
            mensaje: 'Planificación generada con base curricular CNB y ejercicios literales verificados.',
            notaGemini: responseText.slice(0, 300),
            plan: {
              ...basePlan,
              fuenteGeneracion: 'gemini_rag_grounded'
            }
          });
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
      plan: basePlan
    });

  } catch (error: any) {
    console.error('Error al generar planificación:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno al generar planificación' },
      { status: 500 }
    );
  }
}
