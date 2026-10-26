const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/profesor/PlanificadorOficialMineduc.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Añadir helper getColumnasEstructuradas dentro de PlanificadorOficialMineduc
const searchHookPos = `  const [activeTab, setActiveTab] = useState<'plan_semanal' | 'evaluacion_viernes' | 'asignaturas_cnb'>('plan_semanal');`;

const helperColumnsCode = `  // Generador de las 5 columnas dinámicas oficiales estructuradas al estilo Guía del Docente MINEDUC
  const getColumnasEstructuradas = () => {
    const matSelectedObjs = todasLasMaterias.filter(m => selectedMateriaIds.includes(m.idBase));
    const mat1 = matSelectedObjs[0];
    const mat2 = matSelectedObjs[1];
    const mat3 = matSelectedObjs[2];

    const gradosText = selectedGrados.map(g => \`\${g}.°\`).join(' y ');

    // Extraer temas reales de la primera materia
    const temasMat1 = selectedGrados.flatMap(g => {
      const cfg = getConfig(g, mat1?.idBase || 'mate');
      const matObj = getMateriaForGradoAndBase(g, mat1?.idBase || 'mate');
      const uni = matObj?.unidades.find(u => u.unidad === cfg.unidadNum) || matObj?.unidades[0];
      return uni?.temas.filter(t => cfg.selectedTemaNums.includes(t.numero)) || [];
    });
    const temaTituloMat1 = temasMat1[0]?.titulo.split(' (Pág.')[0] || (mat1?.nombre || 'Matemáticas');
    const temaSubtitulo1 = temasMat1[1]?.titulo.split(' (Pág.')[0] || 'Cálculo, Algoritmo y Ejercitación';

    // Extraer temas de la segunda materia si existe
    let temaTituloMat2 = 'Ciencias y Entorno Natural';
    let temaSubtitulo2 = 'Indagación y Método Científico';
    if (mat2) {
      const temasMat2 = selectedGrados.flatMap(g => {
        const cfg = getConfig(g, mat2.idBase);
        const matObj = getMateriaForGradoAndBase(g, mat2.idBase);
        const uni = matObj?.unidades.find(u => u.unidad === cfg.unidadNum) || matObj?.unidades[0];
        return uni?.temas.filter(t => cfg.selectedTemaNums.includes(t.numero)) || [];
      });
      temaTituloMat2 = \`\${mat2.nombre}: \${temasMat2[0]?.titulo.split(' (Pág.')[0] || ''}\`;
      temaSubtitulo2 = temasMat2[1]?.titulo.split(' (Pág.')[0] || 'Observación y Esquemas en Cuaderno';
    } else if (mat3) {
      temaTituloMat2 = \`\${mat3.nombre}\`;
    }

    return [
      {
        id: 'col_1',
        habilidadHeader: \`\${mat1?.nombre || 'Matemáticas'}: \${temaTituloMat1}\`,
        habilidadSub: 'Modelado Conceptual Inicial',
        tiempo: 'Aprox. 50 minutos',
        grupoHeader: \`TODOS GRUPO A (\${gradosText} Primaria)\`,
        materiaBase: mat1?.idBase || 'mate'
      },
      {
        id: 'col_2',
        habilidadHeader: temaSubtitulo1,
        habilidadSub: 'Práctica y Algoritmo Guiado',
        tiempo: 'Aprox. 45 minutos',
        grupoHeader: 'CADA GRADO (Trabajo Autónomo con Guía)',
        materiaBase: mat1?.idBase || 'mate'
      },
      {
        id: 'col_3',
        habilidadHeader: temaTituloMat2,
        habilidadSub: temaSubtitulo2,
        tiempo: 'Aprox. 45 minutos',
        grupoHeader: mat2 ? \`TODOS GRUPO B (\${gradosText}) · \${mat2.nombre}\` : \`TODOS (\${gradosText}) · Bloque Integrado\`,
        materiaBase: mat2?.idBase || 'ciencias'
      },
      {
        id: 'col_4',
        habilidadHeader: 'Rincones de Aprendizaje / Experimentos',
        habilidadSub: 'Tutoría entre Pares y Trabajo Cooperativo',
        tiempo: 'Aprox. 40 minutos',
        grupoHeader: 'CADA GRUPO (Manipulación Concreta)',
        materiaBase: 'rincones'
      },
      {
        id: 'col_5',
        habilidadHeader: 'Ejercicios del Libro Oficial y Tarea en Casa',
        habilidadSub: 'Consolidación en Cuaderno y Autoaprendizaje',
        tiempo: 'Aprox. 30 minutos',
        grupoHeader: 'CADA GRADO (Libro Oficial MINEDUC)',
        materiaBase: 'fijacion'
      }
    ];
  };
`;

content = content.replace(searchHookPos, `${helperColumnsCode}\n  ${searchHookPos}`);

// 2. Reemplazar la sección de la tabla de plan_semanal por la nueva tabla estilo Guía MINEDUC
const oldTableBlockStart = `{activeTab === 'plan_semanal' && (
            <div className="p-4 sm:p-6 space-y-4">
              <div className="overflow-x-auto rounded-2xl border border-sky-300 shadow-sm">
                <table className="w-full text-xs text-left border-collapse">`;

const oldTableBlockEnd = `{/* NOTAS METODOLÓGICAS */}
              <div className="bg-sky-50/60 rounded-2xl p-4 border border-sky-200 text-slate-700 text-[11px] space-y-1.5">`;

const startIdx = content.indexOf(oldTableBlockStart);
const endIdx = content.indexOf(oldTableBlockEnd);

if (startIdx === -1 || endIdx === -1) {
  console.error('Table block markers not found!');
  process.exit(1);
}

const newCleanTableSection = `{activeTab === 'plan_semanal' && (
            <div className="p-4 sm:p-6 space-y-5">
              
              {/* BANNER RESERVA CNB */}
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-200 text-amber-900 font-black px-2 py-0.5 rounded text-[10px] uppercase">
                    Reserva CNB (Sin Libro)
                  </span>
                  <span className="text-amber-950 font-bold">
                    {asignaturasComplementarias.map(a => \`\${a.nombre} (\${a.periodosSemanales} per.)\`).join(' · ')}
                  </span>
                </div>
                <span className="text-[11px] text-amber-900 font-semibold">
                  Bloques diarios sugeridos: 11:15 - 12:00 h
                </span>
              </div>

              {/* TABLA OFICIAL ESTRUCTURADA MINEDUC (3 FILAS DE CABECERA + DÍAS) */}
              {(() => {
                const cols = getColumnasEstructuradas();

                return (
                  <div className="overflow-x-auto rounded-2xl border-2 border-[#0099D8] shadow-md bg-white">
                    <table className="w-full text-xs border-collapse">
                      
                      {/* ENCABEZADOS DE 3 NIVELES */}
                      <thead>
                        
                        {/* NIVEL 1: MATERIALES / HABILIDADES (TEMAS Y SUBTEMAS SELECCIONADOS) */}
                        <tr className="bg-[#0099D8] text-white text-center font-bold">
                          <th className="p-3 border border-sky-300 w-28 uppercase text-[11px] font-black tracking-wider leading-tight">
                            Materiales /<br />Habilidades
                          </th>
                          {cols.map((col) => (
                            <th key={col.id} className="p-3 border border-sky-300 text-center align-middle font-bold text-xs">
                              <div className="font-black text-white leading-tight">
                                {col.habilidadHeader}
                              </div>
                              <div className="text-[10px] text-sky-100 font-normal mt-0.5 leading-tight">
                                {col.habilidadSub}
                              </div>
                            </th>
                          ))}
                        </tr>

                        {/* NIVEL 2: TIEMPO ESTIMADO POR LECCIÓN */}
                        <tr className="bg-[#72D3F7] text-[#004F7A] text-center font-black text-[11px]">
                          <th className="p-2 border border-sky-300 uppercase tracking-wide">
                            Tiempo
                          </th>
                          {cols.map((col) => (
                            <th key={col.id} className="p-2 border border-sky-300 text-center font-black">
                              {col.tiempo}
                            </th>
                          ))}
                        </tr>

                        {/* NIVEL 3: DÍA / GRUPO / MATERIA */}
                        <tr className="bg-[#DDF4FE] text-[#004F7A] text-center font-black text-[10px] tracking-wider uppercase">
                          <th className="p-2 border border-sky-300">
                            Día / Grupo
                          </th>
                          {cols.map((col) => (
                            <th key={col.id} className="p-2 border border-sky-300 text-center">
                              {col.grupoHeader}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      {/* CUERPO: LUNES A JUEVES CON FORMATO LIMPIO, VIÑETAS Y FLECHAS */}
                      <tbody className="divide-y divide-[#72D3F7] bg-white">
                        {diasSemana.map((dia) => {
                          const diaData = plan.dias[dia];

                          return (
                            <tr key={dia} className="hover:bg-sky-50/20 transition-colors">
                              
                              {/* COLUMNA DÍA */}
                              <td className="p-3 font-black text-sm text-[#005B94] text-center align-middle border border-sky-300 bg-sky-50/40 whitespace-nowrap">
                                <div className="text-base font-black text-[#005B94]">{dia}</div>
                              </td>

                              {/* COLUMNA 1: TEMA PRINCIPAL / MODELADO CONCEPTUAL */}
                              <td className="p-3.5 border border-sky-300 align-top text-slate-800 text-[11px] leading-relaxed bg-white space-y-2">
                                {selectedGrados.map((g, idx) => {
                                  const gData = diaData?.gradosSincronizados?.find((gs: any) => gs.gradoNumero === g) || diaData?.gradosSincronizados?.[idx];
                                  const isDirecta = (dia === 'Lunes' && idx === 0) || (dia === 'Martes' && idx === 1) || (dia === 'Miércoles' && idx === 0) || (dia === 'Jueves' && idx === 0);

                                  return (
                                    <div key={g} className="space-y-0.5">
                                      <div className="font-extrabold text-[#005B94] flex items-center justify-between">
                                        <span>• {g}.° Primaria ({gData?.numeroPagina ? \`Pág. \${gData.numeroPagina}\` : ''}):</span>
                                        <span className={\`text-[9px] px-1.5 py-0.2 rounded font-black \${
                                          isDirecta ? 'bg-rose-100 text-rose-800' : 'bg-teal-100 text-teal-800'
                                        }\`}>
                                          {isDirecta ? 'Atención Directa' : 'Trabajo Autónomo'}
                                        </span>
                                      </div>
                                      <p className="text-slate-700 text-[11px] pl-2 leading-snug">
                                        {gData?.periodo1_actividad?.replace(/^08:15\\s*-\\s*09:05\\s*\\|\\s*/i, '') || gData?.actividadDocente}
                                      </p>
                                    </div>
                                  );
                                })}
                              </td>

                              {/* COLUMNA 2: EJERCITACIÓN Y ALGORITMOS / INVERSIÓN DE ROLES */}
                              <td className="p-3.5 border border-sky-300 align-top text-slate-800 text-[11px] leading-relaxed bg-white space-y-2">
                                {selectedGrados.map((g, idx) => {
                                  const gData = diaData?.gradosSincronizados?.find((gs: any) => gs.gradoNumero === g) || diaData?.gradosSincronizados?.[idx];
                                  const isDirectaP2 = (dia === 'Lunes' && idx === 1) || (dia === 'Martes' && idx === 0) || (dia === 'Miércoles' && idx === 1) || (dia === 'Jueves' && idx === 1);

                                  return (
                                    <div key={g} className="space-y-0.5">
                                      <div className="font-extrabold text-[#005B94] flex items-center justify-between">
                                        <span>• {g}.° Primaria:</span>
                                        <span className={\`text-[9px] px-1.5 py-0.2 rounded font-black \${
                                          isDirectaP2 ? 'bg-rose-100 text-rose-800' : 'bg-teal-100 text-teal-800'
                                        }\`}>
                                          {isDirectaP2 ? 'Atención Directa (Rotación)' : 'Trabajo Autónomo'}
                                        </span>
                                      </div>
                                      <p className="text-slate-700 text-[11px] pl-2 leading-snug">
                                        {gData?.periodo2_actividad?.replace(/^09:05\\s*-\\s*09:55\\s*\\|\\s*/i, '') || gData?.actividadEstudiante}
                                      </p>
                                    </div>
                                  );
                                })}
                              </td>

                              {/* COLUMNA 3: SEGUNDA ASIGNATURA / BLOQUE INTEGRADO */}
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
                                  const ej = gData?.ejerciciosLiterales?.[0] || \`Pág. \${gData?.numeroPagina}: Resolver incisos de la lección.\`;

                                  return (
                                    <div key={g} className="space-y-0.5 border-b border-sky-100 pb-1 last:border-none">
                                      <div className="font-extrabold text-[#005B94]">
                                        • {g}.° Primaria ({gData?.paginaFin && gData.paginaFin !== gData.numeroPagina ? \`Págs. \${gData.numeroPagina}-\${gData.paginaFin}\` : \`Pág. \${gData?.numeroPagina}\`}):
                                      </div>
                                      <p className="text-slate-600 text-[11px] pl-2 leading-snug line-clamp-3">
                                        {ej}
                                      </p>
                                    </div>
                                  );
                                })}
                                {diaData?.gradosSincronizados?.[0]?.tareaCasa && (
                                  <div className="text-[10px] text-emerald-900 bg-emerald-50 p-1.5 rounded-lg border border-emerald-200 mt-1 leading-tight">
                                    <strong className="text-emerald-950">Tarea en casa:</strong> {diaData.gradosSincronizados[0].tareaCasa}
                                  </div>
                                )}
                              </td>

                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
`;

content = content.slice(0, startIdx) + newCleanTableSection + content.slice(endIdx);
fs.writeFileSync(filePath, content, 'utf8');
console.log('src/components/profesor/PlanificadorOficialMineduc.tsx updated with clean 3-tier matrix table matching user image!');
