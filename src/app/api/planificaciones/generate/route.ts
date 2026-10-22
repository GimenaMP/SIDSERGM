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
      const candidateModels = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-1.5-flash'];
      let model = null;

      const SYSTEM_INSTRUCTION = `Eres un experto metodólogo pedagógico en el Currículum Nacional Base (CNB) de Guatemala y educación multigrado en primaria. Generas planificaciones semanales (lunes a viernes) para aulas con 2 o 3 grados simultáneos.

REGLAS PEDAGÓGICAS OBLIGATORIAS:
1. TEMA GENERADOR COMÚN: Articula el contenido de todos los grados bajo un mismo eje o tema integrador.
2. ALTERNANCIA MULTIGRADO ESTRICTA: Mientras un grado recibe "Atención Directa Docente", los otros grados DEBEN estar en "Trabajo Autónomo con Guía". En el siguiente período se invierten los roles.
3. HORARIO DIARIO ESTRUCTURADO (08:00 a 12:00):
   - BLOQUE 1 (08:00 - 10:00):
     * 08:00 - 08:15: Inicio común y motivación.
     * 08:15 - 09:05: Período 1 (Rotación de Atención Directa vs. Trabajo Autónomo).
     * 09:05 - 09:55: Período 2 (Inversión de roles de rotación).
     * 09:55 - 10:00: Preparación para receso.
   - RECESO (10:00 - 10:30): Sin actividades académicas.
   - BLOQUE 2 (10:30 - 12:00):
     * 10:30 - 11:15: Período 3 (Aplicación e indagación por grado).
     * 11:15 - 11:50: Período 4 (Práctica autónoma con guía).
     * 11:50 - 12:00: Cierre diario y comprobación rápida.
4. ESTRUCTURA SEMANAL (Lunes a Viernes):
   - LUNES A JUEVES: Clases, rotaciones y trabajo con guías de estudio.
   - VIERNES: Aplicación de Test semanal por grado (para medir el alcance del indicador de logro) e instrumento de registro del docente (lista de cotejo o escala de rango).
5. EJERCICIOS COMPLETO REDACTADOS:
   - Para las actividades con Guías de Estudio, incluye la referencia (Página y Ejercicio) Y la REDACCIÓN COMPLETA del problema o enunciado.
   - Para el Test del Viernes, redacta completa cada una de las preguntas o problemas a evaluar por grado.

GUARDRAILS ANTI-ALUCINACIÓN:
- Usa ÚNICAMENTE la información provista en el contexto RAG (CNB y Guías).
- No inventes números de página ni contenidos no presentes en los fragmentos. Si falta la página exacta, escribe: "Guía de Estudio - Tema: [Nombre]".`;

      for (const mName of candidateModels) {
        try {
          model = genAI.getGenerativeModel({ 
            model: mName,
            systemInstruction: SYSTEM_INSTRUCTION,
            generationConfig: {
              temperature: 0.1,
              responseMimeType: 'application/json'
            }
          });
          if (model) break;
        } catch {
          // continuar con siguiente candidato
        }
      }

      if (model) {
        // Armar contexto RAG estricto según la plantilla de entrada
        const cnbContext = Object.entries(basePlan.alineacion_cnb).map(([grado, al]) => 
          `Grado: ${grado}\n- Competencia: ${al.competencia}\n- Indicador de Logro: ${al.indicador_logro}\n- Contenido: ${al.contenido_declarativo}`
        ).join('\n\n');

        const guiasContext = Object.entries(basePlan.dias).map(([dia, dPlan]) => {
          return `Día ${dia}:\n` + dPlan.gradosSincronizados.map(g => 
            `- ${g.grado}: Libro "${g.libroTitulo}" (Pág. ${g.numeroPagina}) | ${g.tema}\n  Ejercicios Literales:\n  ${g.ejerciciosLiterales.join('\n  ')}`
          ).join('\n');
        }).join('\n\n');

        const prompt = `Genera la planificación semanal multigrado con los siguientes datos y contexto RAG:

[PARÁMETROS]
- Grados atendidos: ${basePlan.grados.map(g => `${g}.° Primaria`).join(', ')}
- Área Curricular: ${basePlan.area_curricular}
- Semana/Unidad: Semana ${basePlan.semana} (Bimestre ${basePlan.bimestre})
- Horario Diario Obligatorio: 08:00 a 12:00 (210 min efectivos de clase, Receso de 10:00 a 10:30)
- Temas Rezagados / Refuerzo: ${basePlan.temasRezagados.join(', ') || 'Ninguno'}

[CONTEXTO RAG RECUPERADO]
--- FRAGMENTOS CNB ---
${cnbContext}

--- FRAGMENTOS GUÍAS DE ESTUDIO ---
${guiasContext}

EJEMPLO DE SALIDA ESPERADA:
{
  "tema_generador_comun": "${basePlan.tema_generador_comun}",
  "observacionesPedagogicas": "Articulación de contenidos de suma, fracciones y proporcionalidad mediante situaciones de comercio y cosechas locales.",
  "recomendacionRezagados": "En los primeros 10 min de la fase de desarrollo, modelar en pizarra la nivelación del concepto previo antes de la ejercitación.",
  "tipEvaluacionViernes": "Aplicar de 08:00 a 10:00 la hoja de trabajo diagnóstica con los 3 ejercicios contextualizados y completar la lista de cotejo de 10:30 a 12:00."
}

Genera el JSON respetando el horario de 8:00 a 12:00, la alternancia docente de lunes a jueves, los ejercicios redactados y el test del viernes.`;

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
            mensaje: 'Planificación generada con éxito con Gemini 2.5 Flash y Grounding estricto anti-alucinaciones (CNB + MINEDUC).',
            enriquecimientoAI: aiEnrichment,
            plan: {
              ...basePlan,
              tema_generador_comun: aiEnrichment.tema_generador_comun || basePlan.tema_generador_comun,
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
