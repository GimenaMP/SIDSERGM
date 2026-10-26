const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/app/api/planificacion/route.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Mejorar las instrucciones del prompt para exigir diferenciación por día y división por períodos
const oldInstructions = `3. Genera de una vez los 4 DÍAS DE LA SEMANA (Lunes, Martes, Miércoles, Jueves).
   En cada día, en el array "gradosSincronizados" debe existir un elemento para CADA uno de los grados atendidos (\${gradosNums.map(g => \`\${g}.° Primaria\`).join(', ')}).
   Cada elemento debe contener:
   - "grado": "\${gradosNums[0]}.° Primaria", etc.
   - "gradoNumero": número entero del grado
   - "materia": Área curricular según la selección del docente para ese grado
   - "tema": Nombre exacto de la lección SELECCIONADA por el docente
   - "modalidad": "Atención Directa Docente" o "Trabajo Autónomo con Guía" (respetando la alternancia entre grados)
   - "cnbCompetencia": Competencia oficial del CNB
   - "cnbIndicador": Indicador de logro oficial
   - "libroTitulo": Nombre oficial del libro MINEDUC
   - "numeroPagina": Número de página física real del libro (DEBE estar dentro del rango seleccionado)
   - "seccionLibro": Título de la unidad
   - "ejerciciosLiterales": Array de strings con los enunciados y problemas completos
   - "actividadDocente": Indicación para el maestro
   - "actividadEstudiante": Indicación para el estudiante
   - "tareaCasa": Tarea de refuerzo en familia
   - "completado": true/false`;

const newInstructions = `3. REGLA ESTRICTA DE DIFERENCIACIÓN PEDAGÓGICA Y NO REPETICIÓN:
   ESTÁ ESTRICTAMENTE PROHIBIDO REPETIR EL MISMO TEXTO O ACTIVIDADES EN DÍAS DISTINTOS.
   Cada día debe reflejar una fase secuencial única del proceso de enseñanza-aprendizaje:
   - LUNES: Fase de Apertura y Modelado Inicial (introducción, vocabulario clave, modelado paso a paso en pizarra).
   - MARTES: Fase de Profundización y Ejercitación Guiada (análisis de errores comunes, resolución guiada de problemas complejos).
   - MIÉRCOLES: Fase de Aplicación Contextual y Tutoría entre Pares (situaciones de la comunidad, mercado local, cooperación entre grados).
   - JUEVES: Fase de Síntesis y Preparación para Evaluación (resolución de retos tipo prueba, auto-revisión y lista de cotejo).

4. DIVISIÓN ESTRICTA POR PERÍODOS EN CADA DÍA:
   En cada uno de los 4 días (Lunes, Martes, Miércoles, Jueves), en el array "gradosSincronizados" debe existir un elemento para CADA grado atendido (\${gradosNums.map(g => \`\${g}.° Primaria\`).join(', ')}).
   Cada elemento DEBE incluir OBLIGATORIAMENTE la división por períodos:
   - "grado": "\${gradosNums[0]}.° Primaria", etc.
   - "gradoNumero": número entero del grado
   - "materia": Área curricular según la selección del docente
   - "tema": Nombre exacto de la lección seleccionada
   - "modalidad": "Atención Directa Docente" o "Trabajo Autónomo con Guía"
   - "periodo1_actividad": "08:15 - 09:05 | Período 1: [Atención Directa / Trabajo Autónomo] [Texto didáctico específico y no repetido del día]"
   - "periodo2_actividad": "09:05 - 09:55 | Período 2: [Inversión de Roles] [Texto didáctico específico y no repetido del día]"
   - "periodo3_actividad": "10:30 - 11:15 | Período 3: [Bloque Integrado / Rincones] [Texto didáctico específico y no repetido del día]"
   - "periodo4_actividad": "11:15 - 11:50 | Período 4: [Práctica Autónoma en Cuaderno] [Texto didáctico específico y no repetido del día]"
   - "actividadDocente": "Acción específica y diferenciada del maestro para este día"
   - "actividadEstudiante": "Acción específica y diferenciada del estudiante para este día"
   - "cnbCompetencia": Competencia oficial del CNB
   - "cnbIndicador": Indicador de logro oficial
   - "libroTitulo": Nombre oficial del libro MINEDUC
   - "numeroPagina": Número de página física real seleccionada
   - "seccionLibro": Título de la unidad
   - "ejerciciosLiterales": Array con los ejercicios literales del libro MINEDUC
   - "tareaCasa": Tarea de refuerzo específica para este día
   - "completado": true/false`;

content = content.replace(oldInstructions, newInstructions);

// 2. Proteger la fusión de períodos en gradosSincronizados
const oldMergeBlock = `                gradosSincronizados: (aiDia.gradosSincronizados || []).map((item: any, idx: number) => {
                  const baseItem = baseDia.gradosSincronizados?.[idx] || {};
                  return {
                    ...baseItem,
                    ...item,
                    gradoNumero: item.gradoNumero || baseItem.gradoNumero || gradosNums[idx] || gradosNums[0],
                    materia: baseItem.materia || item.materia || 'Matemáticas',
                    tema: baseItem.tema || item.tema,
                    libroTitulo: baseItem.libroTitulo || item.libroTitulo,
                    numeroPagina: baseItem.numeroPagina || item.numeroPagina,
                    paginaFin: baseItem.paginaFin || item.paginaFin,
                    seccionLibro: baseItem.seccionLibro || item.seccionLibro,
                    materiasSeleccionadas: baseItem.materiasSeleccionadas || item.materiasSeleccionadas,
                    ejerciciosLiterales: Array.isArray(baseItem.ejerciciosLiterales) && baseItem.ejerciciosLiterales.length > 0
                      ? baseItem.ejerciciosLiterales
                      : (Array.isArray(item.ejerciciosLiterales) && item.ejerciciosLiterales.length > 0 ? item.ejerciciosLiterales : [])
                  };
                })`;

const newMergeBlock = `                gradosSincronizados: (aiDia.gradosSincronizados || []).map((item: any, idx: number) => {
                  const baseItem = baseDia.gradosSincronizados?.[idx] || {};
                  return {
                    ...baseItem,
                    ...item,
                    gradoNumero: item.gradoNumero || baseItem.gradoNumero || gradosNums[idx] || gradosNums[0],
                    materia: baseItem.materia || item.materia || 'Matemáticas',
                    tema: baseItem.tema || item.tema,
                    libroTitulo: baseItem.libroTitulo || item.libroTitulo,
                    numeroPagina: baseItem.numeroPagina || item.numeroPagina,
                    paginaFin: baseItem.paginaFin || item.paginaFin,
                    seccionLibro: baseItem.seccionLibro || item.seccionLibro,
                    materiasSeleccionadas: baseItem.materiasSeleccionadas || item.materiasSeleccionadas,
                    periodo1_actividad: item.periodo1_actividad || baseItem.periodo1_actividad,
                    periodo2_actividad: item.periodo2_actividad || baseItem.periodo2_actividad,
                    periodo3_actividad: item.periodo3_actividad || baseItem.periodo3_actividad,
                    periodo4_actividad: item.periodo4_actividad || baseItem.periodo4_actividad,
                    actividadDocente: item.actividadDocente || baseItem.actividadDocente,
                    actividadEstudiante: item.actividadEstudiante || baseItem.actividadEstudiante,
                    tareaCasa: item.tareaCasa || baseItem.tareaCasa,
                    ejerciciosLiterales: Array.isArray(baseItem.ejerciciosLiterales) && baseItem.ejerciciosLiterales.length > 0
                      ? baseItem.ejerciciosLiterales
                      : (Array.isArray(item.ejerciciosLiterales) && item.ejerciciosLiterales.length > 0 ? item.ejerciciosLiterales : [])
                  };
                })`;

content = content.replace(oldMergeBlock, newMergeBlock);

fs.writeFileSync(filePath, content, 'utf8');
console.log('src/app/api/planificacion/route.ts updated with strict period prompts and merge fields!');
