const fs = require('fs');

// ============================================================================
// 1. PATCH PlanificadorOficialMineduc.tsx
// ============================================================================
const uiPath = 'src/components/profesor/PlanificadorOficialMineduc.tsx';
let ui = fs.readFileSync(uiPath, 'utf8');

const targetBanner = `{/* En Aulas Multigrado: Explicación Inicial Conjunta en Pizarra sobre el Tema Eje Transversal */}
                                    {selectedGrados.length > 1 && (
                                      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-2.5 mb-2 shadow-2xs">
                                        <div className="flex flex-wrap items-center justify-between gap-1 text-xs font-black text-indigo-950 mb-1">
                                          <span className="flex items-center gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0"></span>
                                            <span>Apertura Plenaria Simultánea en Pizarra (10-15 min) · Tema Eje Transversal</span>
                                          </span>
                                          <span className="bg-indigo-600 text-white text-[9px] px-2 py-0.5 rounded font-black tracking-wide">
                                            Explicación Conjunta a Todos los Grados
                                          </span>
                                        </div>
                                        <p className="text-slate-700 text-xs leading-relaxed">
                                          <strong>Docente en Pizarra:</strong> El maestro reúne la atención de todos los grados ({selectedGrados.map(g => \`\${g}.°\`).join(' y ')} Primaria) y explica el concepto integrador común (<strong>{plan.tema_generador_comun}</strong>). Modela el esquema central en la pizarra, formula preguntas generadoras y vincula los conocimientos previos antes de que cada grado pase a resolver individualmente en su libro oficial.
                                        </p>
                                      </div>
                                    )}`;

const newBanner = `{/* En Aulas Multigrado: Explicación Inicial Conjunta en Pizarra sobre el Tema Eje Transversal de la Asignatura */}
                                    {selectedGrados.length > 1 && (() => {
                                      const esSocialesP3 = mat3Nombre.toLowerCase().includes('social');
                                      const esNaturalesP3 = mat3Nombre.toLowerCase().includes('natural') || mat3Nombre.toLowerCase().includes('ciencia');
                                      const temaEjeActivoP3 = (diaData as any)?.temaEjePeriodo3 ||
                                        mats0[2]?.temaEje ||
                                        (esSocialesP3
                                          ? 'Sociedades Prehistóricas, Poblamiento y Primeros Asentamientos de América'
                                          : esNaturalesP3
                                          ? 'La Célula como Unidad de Vida: Estructura, Mitocondria y Reproducción Celular'
                                          : plan.tema_generador_comun);

                                      return (
                                        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-2.5 mb-2 shadow-2xs">
                                          <div className="flex flex-wrap items-center justify-between gap-1 text-xs font-black text-indigo-950 mb-1">
                                            <span className="flex items-center gap-1.5">
                                              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0"></span>
                                              <span>Apertura Plenaria Simultánea en Pizarra (10-15 min) · Tema Eje de {mat3Nombre}</span>
                                            </span>
                                            <span className="bg-indigo-600 text-white text-[9px] px-2 py-0.5 rounded font-black tracking-wide">
                                              Explicación Conjunta a Todos los Grados
                                            </span>
                                          </div>
                                          <p className="text-slate-700 text-xs leading-relaxed">
                                            <strong>Docente en Pizarra:</strong> El maestro reúne la atención de todos los grados ({selectedGrados.map(g => \`\${g}.°\`).join(' y ')} Primaria) y explica el concepto integrador común de <strong>{mat3Nombre}</strong> (<strong>{temaEjeActivoP3}</strong>). Modela el esquema central en la pizarra, formula preguntas generadoras y vincula los conocimientos previos antes de que cada grado pase a resolver individualmente en su libro oficial.
                                          </p>
                                        </div>
                                      );
                                    })()}`;

if (ui.includes(targetBanner)) {
  ui = ui.replace(targetBanner, newBanner);
  fs.writeFileSync(uiPath, ui, 'utf8');
  console.log('PlanificadorOficialMineduc.tsx updated with subject-specific Tema Eje in Período 3!');
} else {
  console.log('Target banner not found in PlanificadorOficialMineduc.tsx, checking fallback replacement...');
  ui = ui.replace(
    '<span>Apertura Plenaria Simultánea en Pizarra (10-15 min) · Tema Eje Transversal</span>',
    '<span>Apertura Plenaria Simultánea en Pizarra (10-15 min) · Tema Eje de {mat3Nombre}</span>'
  );
  ui = ui.replace(
    'explica el concepto integrador común (<strong>{plan.tema_generador_comun}</strong>)',
    'explica el concepto integrador común de <strong>{mat3Nombre}</strong> (<strong>{(diaData as any)?.temaEjePeriodo3 || mats0[2]?.temaEje || (mat3Nombre.toLowerCase().includes("social") ? "Sociedades Prehistóricas, Poblamiento y Primeros Asentamientos de América" : "La Célula como Unidad de Vida: Estructura, Mitocondria y Reproducción Celular")}</strong>)'
  );
  fs.writeFileSync(uiPath, ui, 'utf8');
  console.log('PlanificadorOficialMineduc.tsx patched via fallback!');
}

// ============================================================================
// 2. PATCH src/app/api/planificacion/route.ts
// ============================================================================
const routePath = 'src/app/api/planificacion/route.ts';
let routeCode = fs.readFileSync(routePath, 'utf8');

// Add subject isolation to prompt and sanitize Gemini output
const oldPromptInstruction = `INSTRUCCIÓN CRÍTICA DE DISTRIBUCIÓN HORARIA Y ASIGNATURAS SEGÚN EL CNB:
- DEBES APLICAR LA DISTRIBUCIÓN HORARIA OFICIAL SEGÚN EL PESO Y PERIODOS DEL CNB:
  * Período 1 (08:15 - 09:05 · 50 min): Matemáticas (Troncal diaria obligatoria de Lunes a Jueves).
  * Período 2 (09:05 - 09:55 · 50 min): Comunicación y Lenguaje L1 (Troncal diaria obligatoria de Lunes a Jueves).
  * 10:00 - 10:30: Receso Escolar y Refacción.
  * Período 3 (10:30 - 11:15 · 45 min · Bloque Formativo Integrado):
    - Ciencias Naturales y Tecnología y Ciencias Sociales NO se imparten todos los días (tienen 2-3 períodos semanales). Se alternan inteligentemente:
      • Lunes y Miércoles: Ciencias Naturales y Tecnología (Sesión 1 el Lunes y Sesión 2 el Miércoles).
      • Martes y Jueves: Ciencias Sociales (Sesión 1 el Martes y Sesión 2 el Jueves).
      • (Si es Ciclo I con Medio Social y Natural: se imparte en este período).
  * Período 4 (11:15 - 11:50 · 35 min · Bloque Complementario CNB / Rincones de Aprendizaje):
    - Lunes: Expresión Artística (Educación Musical y Artes Visuales).
    - Martes: Productividad y Desarrollo / Educación Física (Huerto Escolar y Motricidad).
    - Miércoles: Expresión Artística y Visual (Plástica y Rincones Creativos).
    - Jueves: Formación Ciudadana y Cultura de Paz / Tutoría entre Pares.`;

const newPromptInstruction = `INSTRUCCIÓN CRÍTICA DE DISTRIBUCIÓN HORARIA Y ASIGNATURAS SEGÚN EL CNB:
- DEBES APLICAR LA DISTRIBUCIÓN HORARIA OFICIAL SEGÚN EL PESO Y PERIODOS DEL CNB:
  * Período 1 (08:15 - 09:05 · 50 min): MATEMÁTICAS (Troncal diaria obligatoria de Lunes a Jueves).
    - PROHIBIDO hablar aquí de lenguaje, fábulas, comprensión lectora, células o historia.
  * Período 2 (09:05 - 09:55 · 50 min): COMUNICACIÓN Y LENGUAJE L1 (Troncal diaria obligatoria de Lunes a Jueves).
    - ESTRICTAMENTE PROHIBIDO TOTALMENTE INCLUIR AQUÍ OPERACIONES MATEMÁTICAS, MÚLTIPLOS, DIVISORES, FRACCIONES, NÚMEROS O ALGORITMOS ARITMÉTICOS. Debe ser 100% comprensión lectora, redacción, análisis textual o gramática.
  * 10:00 - 10:30: Receso Escolar y Refacción.
  * Período 3 (10:30 - 11:15 · 45 min · Bloque Formativo Integrado):
    - Lunes y Miércoles: CIENCIAS NATURALES Y TECNOLOGÍA (Sesión 1 el Lunes y Sesión 2 el Miércoles).
      • PROHIBIDO hablar de historia, geografía o paleolítico en lunes y miércoles.
    - Martes y Jueves: CIENCIAS SOCIALES (Sesión 1 el Martes y Sesión 2 el Jueves).
      • PROHIBIDO hablar de células, mitocondrias, tejidos o biología en martes y jueves.
  * Período 4 (11:15 - 11:50 · 35 min · Bloque Complementario CNB / Rincones de Aprendizaje):
    - Lunes: Expresión Artística (Educación Musical y Artes Visuales).
    - Martes: Productividad y Desarrollo / Educación Física (Huerto Escolar y Motricidad).
    - Miércoles: Expresión Artística y Visual (Plástica y Rincones Creativos).
    - Jueves: Formación Ciudadana y Cultura de Paz / Tutoría entre Pares.`;

if (routeCode.includes(oldPromptInstruction)) {
  routeCode = routeCode.replace(oldPromptInstruction, newPromptInstruction);
}

// In the response processing block: sanitize Gemini hallucinations
const targetSanitize = `const validatedPlan = parsed;
          return NextResponse.json({
            fuente: \`gemini_\${modelName.replace(/-/g, '_')}_rag\`,
            plan: validatedPlan
          });`;

const replaceSanitize = `const validatedPlan = parsed;

          // Sanitización pedagógica estricta de asignaturas por período y día
          if (validatedPlan.dias) {
            for (const dia of ['Lunes', 'Martes', 'Miércoles', 'Jueves']) {
              const dData = validatedPlan.dias[dia];
              const baseDia = basePlan.dias[dia];
              if (!dData || !dData.gradosSincronizados) continue;

              // Asignar el Tema Eje de Período 3 oficial
              dData.temaEjePeriodo3 = baseDia?.temaEjePeriodo3 || 
                ((dia === 'Martes' || dia === 'Jueves')
                  ? 'Sociedades Prehistóricas, Poblamiento y Primeros Asentamientos de América'
                  : 'La Célula como Unidad de Vida: Estructura, Mitocondria y Reproducción Celular');

              dData.gradosSincronizados.forEach((gs: any, idx: number) => {
                const baseGs = baseDia?.gradosSincronizados?.[idx];

                // 1. Período 2 es Comunicación y Lenguaje: PROHIBIDO múltiplos/divisores/matemáticas
                if (gs.periodo2_actividad && /m[uú]ltiplo|divisor|fracci[oó]n|algoritmo aritm|c[aá]lculo mental|mcm|mcd/i.test(gs.periodo2_actividad)) {
                  if (baseGs?.periodo2_actividad) {
                    gs.periodo2_actividad = baseGs.periodo2_actividad;
                  }
                }

                // 2. Período 3 en Martes y Jueves es Ciencias Sociales: PROHIBIDO célula/mitocondria
                if ((dia === 'Martes' || dia === 'Jueves') && gs.periodo3_actividad && /c[eé]lula|mitocondria|mitosis|meiosis|tejido muscular|tejido epitelial/i.test(gs.periodo3_actividad)) {
                  if (baseGs?.periodo3_actividad) {
                    gs.periodo3_actividad = baseGs.periodo3_actividad;
                  }
                }

                // 3. Período 3 en Lunes y Miércoles es Ciencias Naturales: PROHIBIDO paleolítico/prehistoria
                if ((dia === 'Lunes' || dia === 'Miércoles') && gs.periodo3_actividad && /paleol[ií]tico|prehist[oó]ri|cazadores recolectores/i.test(gs.periodo3_actividad)) {
                  if (baseGs?.periodo3_actividad) {
                    gs.periodo3_actividad = baseGs.periodo3_actividad;
                  }
                }
              });
            }
          }

          return NextResponse.json({
            fuente: \`gemini_\${modelName.replace(/-/g, '_')}_rag\`,
            plan: validatedPlan
          });`;

if (routeCode.includes(targetSanitize)) {
  routeCode = routeCode.replace(targetSanitize, replaceSanitize);
  fs.writeFileSync(routePath, routeCode, 'utf8');
  console.log('src/app/api/planificacion/route.ts patched successfully with sanitization!');
} else {
  console.log('Target sanitize block not matched exactly, checking alternative...');
  routeCode = routeCode.replace(
    'return NextResponse.json({\n            fuente: `gemini_${modelName.replace(/-/g, \'_\')}_rag`,\n            plan: validatedPlan\n          });',
    replaceSanitize
  );
  fs.writeFileSync(routePath, routeCode, 'utf8');
  console.log('src/app/api/planificacion/route.ts patched via alternative!');
}
