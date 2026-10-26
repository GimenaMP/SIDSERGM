const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/profesor/PlanificadorOficialMineduc.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update getColumnasEstructuradas headers to not hardcode math
const oldCols = `    if (isMonogrado) {
      return [
        {
          id: 'col_1',
          habilidadHeader: \`Bloque Fundamental (60%): \${mat1Nombre}\`,
          habilidadSub: '08:15 - 09:05 h (50 min) · Explicación y Modelado en Pizarra',
          tiempo: '08:15 – 09:05 h',
          grupoHeader: \`\${gradoUnico}.° PRIMARIA · ATENCIÓN DIRECTA Y MODELADO\`,
          materiaBase: mat1?.idBase || 'mate'
        },
        {
          id: 'col_2',
          habilidadHeader: \`Bloque Fundamental (60%): Ejercitación Guiada\`,
          habilidadSub: '09:05 - 09:55 h (50 min) · Práctica en Cuaderno y Libro Oficial',
          tiempo: '09:05 – 09:55 h',
          grupoHeader: \`\${gradoUnico}.° PRIMARIA · EJERCITACIÓN EN CUADERNO\`,
          materiaBase: mat1?.idBase || 'mate'
        },
        {
          id: 'col_3',
          habilidadHeader: \`Bloque Formativo (40%): \${mat2Nombre}\`,
          habilidadSub: '10:30 - 11:15 h (45 min) · Indagación y Aplicación Contextual',
          tiempo: '10:30 – 11:15 h',
          grupoHeader: \`\${gradoUnico}.° PRIMARIA · APLICACIÓN COMUNITARIA\`,
          materiaBase: mat2?.idBase || 'ciencias'
        },
        {
          id: 'col_4',
          habilidadHeader: 'Rincones de Aprendizaje / Experimentos',
          habilidadSub: '11:15 - 11:50 h (35 min) · Manipulación Concreta y Cuaderno',
          tiempo: '11:15 – 11:50 h',
          grupoHeader: \`\${gradoUnico}.° PRIMARIA · RINCONES Y REFLEXIÓN\`,
          materiaBase: 'rincones'
        },
        {
          id: 'col_5',
          habilidadHeader: 'Libro Oficial MINEDUC (1 Pág/Día) y Tarea',
          habilidadSub: '1 Sesión Diaria por Página Física y Ejercicios Literales',
          tiempo: 'Sesión Diaria',
          grupoHeader: \`\${gradoUnico}.° PRIMARIA (Página Física Exacta)\`,
          materiaBase: 'fijacion'
        }
      ];
    }

    const grupoAText = \`\${selectedGrados[0]}.° Grado\`;
    const grupoBText = selectedGrados.slice(1).map(g => \`\${g}.°\`).join(' y ') + ' Grado';

    return [
      {
        id: 'col_1',
        habilidadHeader: \`Bloque Fundamental (60%): \${mat1Nombre}\`,
        habilidadSub: '08:15 - 09:05 h (50 min) · Modelado en Pizarra y Atención Directa',
        tiempo: '08:15 – 09:05 h',
        grupoHeader: \`GRUPO A (\${grupoAText}) · ATENCIÓN DIRECTA\`,
        materiaBase: mat1?.idBase || 'mate'
      },
      {
        id: 'col_2',
        habilidadHeader: \`Bloque Fundamental (60%): Inversión y Práctica\`,
        habilidadSub: '09:05 - 09:55 h (50 min) · Rotación a Grupo B / Trabajo Autónomo',
        tiempo: '09:05 – 09:55 h',
        grupoHeader: \`GRUPO B (\${grupoBText}) · ROTACIÓN Y LIBRO\`,
        materiaBase: mat1?.idBase || 'mate'
      },
      {
        id: 'col_3',
        habilidadHeader: \`Bloque Formativo (40%): \${mat2Nombre}\`,
        habilidadSub: '10:30 - 11:15 h (45 min) · Indagación y Aplicación Contextual',
        tiempo: '10:30 – 11:15 h',
        grupoHeader: \`TODOS LOS GRADOS (\${gradosText}) · TEMA EJE TRANSVERSAL\`,
        materiaBase: mat2?.idBase || 'ciencias'
      },
      {
        id: 'col_4',
        habilidadHeader: 'Rincones de Aprendizaje / Experimentos',
        habilidadSub: '11:15 - 11:50 h (35 min) · Tutoría entre Pares y Cuaderno',
        tiempo: '11:15 – 11:50 h',
        grupoHeader: 'GRUPOS MIXTOS (Tutoría entre Pares)',
        materiaBase: 'rincones'
      },
      {
        id: 'col_5',
        habilidadHeader: 'Libro Oficial MINEDUC (1 Pág/Día) y Tarea',
        habilidadSub: '1 Sesión Diaria por Página Física y Ejercicios Literales',
        tiempo: 'Sesión Diaria',
        grupoHeader: 'CADA GRADO (Página Física Exacta)',
        materiaBase: 'fijacion'
      }
    ];`;

const newCols = `    if (isMonogrado) {
      return [
        {
          id: 'col_1',
          habilidadHeader: \`Período 1: \${mat1Nombre}\`,
          habilidadSub: '08:15 - 09:05 h (50 min) · Explicación y Modelado en Pizarra',
          tiempo: '08:15 – 09:05 h',
          grupoHeader: \`\${gradoUnico}.° PRIMARIA · ATENCIÓN DIRECTA Y MODELADO\`,
          materiaBase: mat1?.idBase || 'materia1'
        },
        {
          id: 'col_2',
          habilidadHeader: \`Período 2: \${mat1Nombre} (Ejercitación)\`,
          habilidadSub: '09:05 - 09:55 h (50 min) · Práctica en Cuaderno y Libro Oficial',
          tiempo: '09:05 – 09:55 h',
          grupoHeader: \`\${gradoUnico}.° PRIMARIA · TRABAJO EN CUADERNO Y LIBRO\`,
          materiaBase: mat1?.idBase || 'materia1'
        },
        {
          id: 'col_3',
          habilidadHeader: \`Período 3: \${mat2Nombre}\`,
          habilidadSub: '10:30 - 11:15 h (45 min) · Indagación y Desarrollo de Lección',
          tiempo: '10:30 – 11:15 h',
          grupoHeader: \`\${gradoUnico}.° PRIMARIA · \${mat2 ? 'SEGUNDA ASIGNATURA' : 'APLICACIÓN COMUNITARIA'}\`,
          materiaBase: mat2?.idBase || 'materia2'
        },
        {
          id: 'col_4',
          habilidadHeader: 'Período 4: Rincones y Fijación',
          habilidadSub: '11:15 - 11:50 h (35 min) · Manipulación Concreta y Síntesis',
          tiempo: '11:15 – 11:50 h',
          grupoHeader: \`\${gradoUnico}.° PRIMARIA · RINCONES Y REFLEXIÓN\`,
          materiaBase: 'rincones'
        },
        {
          id: 'col_5',
          habilidadHeader: 'Libro Oficial MINEDUC y Tareas',
          habilidadSub: '1 Sesión Diaria por Página Física y Ejercicios Literales',
          tiempo: 'Sesión Diaria',
          grupoHeader: \`\${gradoUnico}.° PRIMARIA (Páginas Físicas Exactas)\`,
          materiaBase: 'fijacion'
        }
      ];
    }

    const grupoAText = \`\${selectedGrados[0]}.° Grado\`;
    const grupoBText = selectedGrados.slice(1).map(g => \`\${g}.°\`).join(' y ') + ' Grado';

    return [
      {
        id: 'col_1',
        habilidadHeader: \`Período 1: \${mat1Nombre} (Atención Directa)\`,
        habilidadSub: '08:15 - 09:05 h (50 min) · Modelado en Pizarra para Grupo A',
        tiempo: '08:15 – 09:05 h',
        grupoHeader: \`GRUPO A (\${grupoAText}) · ATENCIÓN DIRECTA\`,
        materiaBase: mat1?.idBase || 'materia1'
      },
      {
        id: 'col_2',
        habilidadHeader: \`Período 2: \${mat1Nombre} (Inversión de Roles)\`,
        habilidadSub: '09:05 - 09:55 h (50 min) · Rotación a Grupo B / Trabajo Autónomo',
        tiempo: '09:05 – 09:55 h',
        grupoHeader: \`GRUPO B (\${grupoBText}) · ROTACIÓN Y LIBRO\`,
        materiaBase: mat1?.idBase || 'materia1'
      },
      {
        id: 'col_3',
        habilidadHeader: \`Período 3: \${mat2Nombre}\`,
        habilidadSub: '10:30 - 11:15 h (45 min) · Indagación / Bloque Integrado',
        tiempo: '10:30 – 11:15 h',
        grupoHeader: \`TODOS LOS GRADOS (\${gradosText}) · TEMA EJE\`,
        materiaBase: mat2?.idBase || 'materia2'
      },
      {
        id: 'col_4',
        habilidadHeader: 'Período 4: Rincones y Tutoría',
        habilidadSub: '11:15 - 11:50 h (35 min) · Tutoría entre Pares y Cuaderno',
        tiempo: '11:15 – 11:50 h',
        grupoHeader: 'GRUPOS MIXTOS (Tutoría entre Pares)',
        materiaBase: 'rincones'
      },
      {
        id: 'col_5',
        habilidadHeader: 'Libro Oficial MINEDUC y Tareas',
        habilidadSub: '1 Sesión Diaria por Página Física y Ejercicios Literales',
        tiempo: 'Sesión Diaria',
        grupoHeader: 'CADA GRADO (Páginas Físicas Exactas)',
        materiaBase: 'fijacion'
      }
    ];`;

if (!content.includes(oldCols)) {
  console.error('oldCols not found!');
  process.exit(1);
}

content = content.replace(oldCols, newCols);

// 2. Update Columna 3 and Columna 4 and Columna 5 in Table Body
const oldTableBodyCols = `                              {/* COLUMNA 3: SEGUNDA ASIGNATURA / BLOQUE INTEGRADO */}
                              <td className="p-3.5 border border-sky-300 align-top text-slate-800 text-[11px] leading-relaxed bg-white space-y-2">
                                {selectedGrados.map((g, idx) => {
                                  const gData = diaData?.gradosSincronizados?.find((gs: any) => gs.gradoNumero === g) || diaData?.gradosSincronizados?.[idx];
                                  const mat2 = gData?.materiasSeleccionadas?.[1];

                                  if (mat2) {
                                    return (
                                      <div key={g} className="space-y-0.5">
                                        <div className="font-extrabold text-[#005B94]">
                                          • {g}.° Primaria ({mat2.materia} · Pág. {mat2.paginaInicio}):
                                        </div>
                                        <p className="text-slate-700 text-[11px] pl-2 leading-snug">
                                          Unidad {mat2.unidad}: {mat2.tema}
                                        </p>
                                      </div>
                                    );
                                  }

                                  return (
                                    <div key={g} className="space-y-0.5">
                                      <div className="font-extrabold text-[#005B94]">
                                        • {g}.° Primaria (Bloque Integrado):
                                      </div>
                                      <p className="text-slate-700 text-[11px] pl-2 leading-snug">
                                        {gData?.periodo3_actividad?.replace(/^10:30\\s*-\\s*11:15\\s*\\|\\s*/i, '') || 'Indagación y aplicación práctica en cuaderno.'}
                                      </p>
                                    </div>
                                  );
                                })}
                              </td>

                              {/* COLUMNA 4: RINCONES DE APRENDIZAJE Y TUTORÍA ENTRE PARES */}
                              <td className="p-3.5 border border-sky-300 align-top text-slate-800 text-[11px] leading-relaxed bg-white space-y-1.5">
                                <div className="font-extrabold text-[#005B94]">
                                  • Dinámica de Rincones:
                                </div>
                                <p className="text-slate-700 text-[11px] pl-2 leading-snug">
                                  {diaData?.componentes_multigrado?.rincones_aprendizaje || 'Manipulación de material concreto, tablas y esquemas en parejas.'}
                                </p>
                                <div className="font-extrabold text-[#005B94] pt-1 border-t border-sky-100">
                                  • Tutoría entre Pares:
                                </div>
                                <p className="text-slate-700 text-[11px] pl-2 leading-snug">
                                  {diaData?.componentes_multigrado?.tutoria_entre_pares || 'Estudiantes avanzados orientan a los de menor grado en la comprobación.'}
                                </p>
                              </td>

                              {/* COLUMNA 5: LIBRO OFICIAL Y TAREA EN CASA */}
                              <td className="p-3.5 border border-sky-300 align-top text-slate-800 text-[11px] leading-relaxed bg-white space-y-2">
                                {selectedGrados.map((g, idx) => {
                                  const gData = diaData?.gradosSincronizados?.find((gs: any) => gs.gradoNumero === g) || diaData?.gradosSincronizados?.[idx];
                                  const ejs = Array.isArray(gData?.ejerciciosLiterales) && gData.ejerciciosLiterales.length > 0
                                    ? gData.ejerciciosLiterales
                                    : [\`Pág. \${gData?.numeroPagina || 8}, Ejercicio 1 (incisos a, b y c): Resolver incisos en el cuaderno.\`];

                                  return (
                                    <div key={g} className="space-y-1 border-b border-sky-100 pb-2 last:border-none">
                                      <div className="font-extrabold text-[#005B94]">
                                        • {g}.° Primaria ({gData?.paginaFin && gData.paginaFin !== gData.numeroPagina ? \`Págs. \${gData.numeroPagina}-\${gData.paginaFin}\` : \`Pág. \${gData?.numeroPagina}\`}):
                                      </div>
                                      <div className="space-y-0.5 pl-2">
                                        {ejs.slice(0, 2).map((ejText: string, ejIdx: number) => (
                                          <p key={ejIdx} className="text-slate-600 text-[11px] leading-snug">
                                            {ejText}
                                          </p>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                })}
                                {diaData?.gradosSincronizados?.[0]?.tareaCasa && (
                                  <div className="text-[10px] text-emerald-900 bg-emerald-50 p-1.5 rounded-lg border border-emerald-200 mt-1 leading-tight">
                                    <strong className="text-emerald-950">Tarea en casa:</strong> {diaData.gradosSincronizados[0].tareaCasa}
                                  </div>
                                )}`;

const newTableBodyCols = `                              {/* COLUMNA 3: SEGUNDA ASIGNATURA / BLOQUE INTEGRADO */}
                              <td className="p-3.5 border border-sky-300 align-top text-slate-800 text-[11px] leading-relaxed bg-white space-y-2">
                                {selectedGrados.map((g, idx) => {
                                  const gData = diaData?.gradosSincronizados?.find((gs: any) => gs.gradoNumero === g) || diaData?.gradosSincronizados?.[idx];
                                  const mat2 = gData?.materiasSeleccionadas?.[1];

                                  return (
                                    <div key={g} className="space-y-1 border-b border-sky-100 pb-1.5 last:border-none">
                                      <div className="font-extrabold text-[#005B94] flex items-center justify-between">
                                        <span>• {g}.° Primaria ({mat2 ? \`\${mat2.materia} · Pág. \${mat2.paginaInicio}\` : 'Bloque Integrado'}):</span>
                                        {mat2 && (
                                          <span className="text-[9px] px-1.5 py-0.2 rounded font-black bg-indigo-100 text-indigo-800 truncate max-w-[150px]">
                                            {mat2.tema?.slice(0, 32)}
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-slate-700 text-[11px] pl-2 leading-snug">
                                        {gData?.periodo3_actividad?.replace(/^10:30\\s*-\\s*11:15\\s*\\|\\s*/i, '') || 'Indagación y aplicación práctica en cuaderno.'}
                                      </p>
                                    </div>
                                  );
                                })}
                              </td>

                              {/* COLUMNA 4: RINCONES DE APRENDIZAJE Y TUTORÍA ENTRE PARES */}
                              <td className="p-3.5 border border-sky-300 align-top text-slate-800 text-[11px] leading-relaxed bg-white space-y-1.5">
                                {selectedGrados.map((g, idx) => {
                                  const gData = diaData?.gradosSincronizados?.find((gs: any) => gs.gradoNumero === g) || diaData?.gradosSincronizados?.[idx];
                                  return (
                                    <div key={g} className="space-y-0.5 border-b border-sky-100 pb-1.5 last:border-none">
                                      <div className="font-extrabold text-[#005B94]">
                                        • {g}.° Primaria (Fijación y Rincones):
                                      </div>
                                      <p className="text-slate-700 text-[11px] pl-2 leading-snug">
                                        {gData?.periodo4_actividad?.replace(/^11:15\\s*-\\s*11:50\\s*\\|\\s*/i, '') || diaData?.componentes_multigrado?.rincones_aprendizaje || 'Manipulación de material concreto y tutoría.'}
                                      </p>
                                    </div>
                                  );
                                })}
                              </td>

                              {/* COLUMNA 5: LIBRO OFICIAL Y TAREA EN CASA */}
                              <td className="p-3.5 border border-sky-300 align-top text-slate-800 text-[11px] leading-relaxed bg-white space-y-2">
                                {selectedGrados.map((g, idx) => {
                                  const gData = diaData?.gradosSincronizados?.find((gs: any) => gs.gradoNumero === g) || diaData?.gradosSincronizados?.[idx];
                                  const mat1 = gData?.materiasSeleccionadas?.[0];
                                  const mat2 = gData?.materiasSeleccionadas?.[1];
                                  const ejs = Array.isArray(gData?.ejerciciosLiterales) && gData.ejerciciosLiterales.length > 0
                                    ? gData.ejerciciosLiterales
                                    : [\`Pág. \${gData?.numeroPagina || 8}, Ejercicio 1 (incisos a, b y c): Resolver incisos en el cuaderno.\`];

                                  return (
                                    <div key={g} className="space-y-1.5 border-b border-sky-100 pb-2 last:border-none">
                                      <div className="font-extrabold text-[#005B94]">
                                        • {g}.° Primaria:
                                      </div>
                                      <div className="pl-2 space-y-1">
                                        <div className="text-[10px] font-bold text-slate-700">
                                          📖 {mat1?.materia || gData?.materia} (Pág. {gData?.numeroPagina}):
                                        </div>
                                        {ejs.slice(0, 2).map((ejText: string, ejIdx: number) => (
                                          <p key={ejIdx} className="text-slate-600 text-[11px] leading-snug pl-2">
                                            {ejText}
                                          </p>
                                        ))}
                                        {mat2 && (
                                          <div className="text-[10px] font-bold text-indigo-900 pt-0.5">
                                            📘 {mat2.materia} (Pág. {mat2.paginaInicio}): <span className="font-normal text-slate-600">{mat2.tema}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                                {diaData?.gradosSincronizados?.[0]?.tareaCasa && (
                                  <div className="text-[10px] text-emerald-900 bg-emerald-50 p-1.5 rounded-lg border border-emerald-200 mt-1 leading-tight">
                                    <strong className="text-emerald-950">Tarea en casa:</strong> {diaData.gradosSincronizados[0].tareaCasa}
                                  </div>
                                )}`;

if (!content.includes(oldTableBodyCols)) {
  console.error('oldTableBodyCols not found!');
  process.exit(1);
}

content = content.replace(oldTableBodyCols, newTableBodyCols);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✓ Successfully patched PlanificadorOficialMineduc.tsx with dynamic subject headers and full period activities!');
