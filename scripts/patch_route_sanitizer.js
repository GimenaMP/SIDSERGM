const fs = require('fs');

const routePath = 'src/app/api/planificacion/route.ts';
let code = fs.readFileSync(routePath, 'utf8');

// Replace sanitizeActivity and mergedDias
const targetBlock = `            const sanitizeActivity = (text: any, fallback: string, gradoNum: number): string => {
              if (typeof text !== 'string') return fallback;
              const clean = text.trim();
              if (clean.length < 25) return fallback;

              const history = acceptedActivitiesByGrade[gradoNum] || [];
              for (const pastText of history) {
                const sim = calculateTextSimilarity(clean, pastText);
                if (sim > 0.55) {
                  // Duplicado o plantilla detectada por similitud de tokens > 55%
                  return fallback;
                }
              }

              history.push(clean);
              return clean;
            };

            for (const d of diasSemana) {
              const aiDia: any = aiData.dias[d] || {};
              const baseDia: any = basePlan.dias[d] || {};

              mergedDias[d] = {
                dia: d,
                enfoqueDidactico: aiDia.enfoqueDidactico || baseDia.enfoqueDidactico,
                horarioJornada: '08:00 - 12:00 (210 min efectivos)',
                duracionMinutos: 210,
                bloque1_horario: '08:00 - 10:00 (Bloque Troncal: 120 min)',
                fase_inicio_comun: aiDia.fase_inicio_comun || baseDia.fase_inicio_comun,
                periodo_1_horario: '08:15 - 09:05 (50 min) | Período 1',
                periodo_2_horario: '09:05 - 09:55 (50 min) | Período 2',
                preparacion_receso: '09:55 - 10:00 (5 min)',
                receso_horario: '10:00 - 10:30 (30 min) | RECESO ESCOLAR',
                bloque2_horario: '10:30 - 12:00 (Bloque Aplicado: 90 min)',
                periodo_3_horario: '10:30 - 11:15 (45 min) | Período 3',
                periodo_4_horario: '11:15 - 11:50 (35 min) | Período 4',
                fase_cierre_comun: aiDia.fase_cierre_comun || baseDia.fase_cierre_comun,
                componentes_multigrado: aiDia.componentes_multigrado || baseDia.componentes_multigrado,
                gradosSincronizados: (baseDia.gradosSincronizados || []).map((baseItem: any, idx: number) => {
                  // Buscar el item correspondiente de Gemini estrictamente por número de grado
                  const aiItem = (aiDia.gradosSincronizados || []).find((it: any) =>
                    it.gradoNumero === baseItem.gradoNumero ||
                    String(it.grado || '').includes(String(baseItem.gradoNumero))
                  ) || aiDia.gradosSincronizados?.[idx] || {};

                  return {
                    ...baseItem,
                    gradoNumero: baseItem.gradoNumero,
                    grado: baseItem.grado,
                    materia: baseItem.materia,
                    tema: baseItem.tema,
                    libroTitulo: baseItem.libroTitulo,
                    numeroPagina: baseItem.numeroPagina,
                    paginaFin: baseItem.paginaFin,
                    seccionLibro: baseItem.seccionLibro,
                    materiasSeleccionadas: baseItem.materiasSeleccionadas,
                    modalidad: aiItem.modalidad || baseItem.modalidad,
                    periodo1_actividad: sanitizeActivity(aiItem.periodo1_actividad, baseItem.periodo1_actividad, baseItem.gradoNumero),
                    periodo2_actividad: sanitizeActivity(aiItem.periodo2_actividad, baseItem.periodo2_actividad, baseItem.gradoNumero),
                    periodo3_actividad: sanitizeActivity(aiItem.periodo3_actividad, baseItem.periodo3_actividad, baseItem.gradoNumero),
                    periodo4_actividad: sanitizeActivity(aiItem.periodo4_actividad, baseItem.periodo4_actividad, baseItem.gradoNumero),
                    actividadDocente: sanitizeActivity(aiItem.actividadDocente, baseItem.actividadDocente, baseItem.gradoNumero),
                    actividadEstudiante: sanitizeActivity(aiItem.actividadEstudiante, baseItem.actividadEstudiante, baseItem.gradoNumero),
                    tareaCasa: sanitizeActivity(aiItem.tareaCasa, baseItem.tareaCasa, baseItem.gradoNumero),
                    ejerciciosLiterales: Array.isArray(baseItem.ejerciciosLiterales) && baseItem.ejerciciosLiterales.length > 0
                      ? baseItem.ejerciciosLiterales
                      : (Array.isArray(aiItem.ejerciciosLiterales) && aiItem.ejerciciosLiterales.length > 0 ? aiItem.ejerciciosLiterales : [])
                  };
                })
              };
            }`;

const replacementBlock = `            const sanitizeActivity = (
              text: any,
              fallback: string,
              gradoNum: number,
              periodo: number,
              dia: string
            ): string => {
              if (typeof text !== 'string') return fallback;
              const clean = text.trim();
              if (clean.length < 25) return fallback;

              // 1. BLINDAJE DE MATERIAS POR PERÍODO (Evita alucinaciones intermateria)
              // Período 2 es Comunicación y Lenguaje: PROHIBIDO incluir matemáticas o múltiplos
              if (periodo === 2) {
                if (/m[uú]ltiplo|divisor|fracci[oó]n|algoritmo aritm|c[aá]lculo mental|mcm|mcd|descomposici[oó]n en factores/i.test(clean)) {
                  return fallback;
                }
              }

              // Período 3 en Martes y Jueves es Ciencias Sociales: PROHIBIDO biología o células
              if (periodo === 3 && (dia === 'Martes' || dia === 'Jueves')) {
                if (/c[eé]lula|mitocondria|mitosis|meiosis|tejido muscular|tejido epitelial|respiraci[oó]n celular/i.test(clean)) {
                  return fallback;
                }
              }

              // Período 3 en Lunes y Miércoles es Ciencias Naturales: PROHIBIDO prehistoria o paleolítico
              if (periodo === 3 && (dia === 'Lunes' || dia === 'Miércoles')) {
                if (/paleol[ií]tico|prehist[oó]ri|cazadores recolectores|pobladores de am[eé]rica/i.test(clean)) {
                  return fallback;
                }
              }

              // 2. Control de similitud contra el historial del grado para evitar duplicados repetitivos
              const history = acceptedActivitiesByGrade[gradoNum] || [];
              for (const pastText of history) {
                const sim = calculateTextSimilarity(clean, pastText);
                if (sim > 0.55) {
                  return fallback;
                }
              }

              history.push(clean);
              return clean;
            };

            for (const d of diasSemana) {
              const aiDia: any = aiData.dias[d] || {};
              const baseDia: any = basePlan.dias[d] || {};

              mergedDias[d] = {
                dia: d,
                enfoqueDidactico: aiDia.enfoqueDidactico || baseDia.enfoqueDidactico,
                horarioJornada: '08:00 - 12:00 (210 min efectivos)',
                duracionMinutos: 210,
                bloque1_horario: '08:00 - 10:00 (Bloque Troncal: 120 min)',
                fase_inicio_comun: aiDia.fase_inicio_comun || baseDia.fase_inicio_comun,
                periodo_1_horario: '08:15 - 09:05 (50 min) | Período 1',
                periodo_2_horario: '09:05 - 09:55 (50 min) | Período 2',
                preparacion_receso: '09:55 - 10:00 (5 min)',
                receso_horario: '10:00 - 10:30 (30 min) | RECESO ESCOLAR',
                bloque2_horario: '10:30 - 12:00 (Bloque Aplicado: 90 min)',
                periodo_3_horario: '10:30 - 11:15 (45 min) | Período 3',
                periodo_4_horario: '11:15 - 11:50 (35 min) | Período 4',
                fase_cierre_comun: aiDia.fase_cierre_comun || baseDia.fase_cierre_comun,
                componentes_multigrado: aiDia.componentes_multigrado || baseDia.componentes_multigrado,
                temaEjePeriodo1: baseDia.temaEjePeriodo1,
                temaEjePeriodo2: baseDia.temaEjePeriodo2,
                temaEjePeriodo3: baseDia.temaEjePeriodo3 || ((d === 'Martes' || d === 'Jueves') ? 'Sociedades Prehistóricas, Poblamiento y Primeros Asentamientos de América' : 'La Célula como Unidad de Vida: Estructura, Mitocondria y Reproducción Celular'),
                temaEjePeriodo4: baseDia.temaEjePeriodo4,
                gradosSincronizados: (baseDia.gradosSincronizados || []).map((baseItem: any, idx: number) => {
                  const aiItem = (aiDia.gradosSincronizados || []).find((it: any) =>
                    it.gradoNumero === baseItem.gradoNumero ||
                    String(it.grado || '').includes(String(baseItem.gradoNumero))
                  ) || aiDia.gradosSincronizados?.[idx] || {};

                  return {
                    ...baseItem,
                    gradoNumero: baseItem.gradoNumero,
                    grado: baseItem.grado,
                    materia: baseItem.materia,
                    tema: baseItem.tema,
                    libroTitulo: baseItem.libroTitulo,
                    numeroPagina: baseItem.numeroPagina,
                    paginaFin: baseItem.paginaFin,
                    seccionLibro: baseItem.seccionLibro,
                    materiasSeleccionadas: baseItem.materiasSeleccionadas,
                    modalidad: aiItem.modalidad || baseItem.modalidad,
                    periodo1_actividad: sanitizeActivity(aiItem.periodo1_actividad, baseItem.periodo1_actividad, baseItem.gradoNumero, 1, d),
                    periodo2_actividad: sanitizeActivity(aiItem.periodo2_actividad, baseItem.periodo2_actividad, baseItem.gradoNumero, 2, d),
                    periodo3_actividad: sanitizeActivity(aiItem.periodo3_actividad, baseItem.periodo3_actividad, baseItem.gradoNumero, 3, d),
                    periodo4_actividad: sanitizeActivity(aiItem.periodo4_actividad, baseItem.periodo4_actividad, baseItem.gradoNumero, 4, d),
                    actividadDocente: sanitizeActivity(aiItem.actividadDocente, baseItem.actividadDocente, baseItem.gradoNumero, 0, d),
                    actividadEstudiante: sanitizeActivity(aiItem.actividadEstudiante, baseItem.actividadEstudiante, baseItem.gradoNumero, 0, d),
                    tareaCasa: sanitizeActivity(aiItem.tareaCasa, baseItem.tareaCasa, baseItem.gradoNumero, 0, d),
                    ejerciciosLiterales: Array.isArray(baseItem.ejerciciosLiterales) && baseItem.ejerciciosLiterales.length > 0
                      ? baseItem.ejerciciosLiterales
                      : (Array.isArray(aiItem.ejerciciosLiterales) && aiItem.ejerciciosLiterales.length > 0 ? aiItem.ejerciciosLiterales : [])
                  };
                })
              };
            }`;

if (code.includes(targetBlock)) {
  code = code.replace(targetBlock, replacementBlock);
  fs.writeFileSync(routePath, code, 'utf8');
  console.log('src/app/api/planificacion/route.ts updated with period and subject sanitization!');
} else {
  console.error('Target block not found in route.ts!');
}
