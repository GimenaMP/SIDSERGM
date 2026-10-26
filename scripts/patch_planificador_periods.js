const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/profesor/PlanificadorOficialMineduc.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Buscamos el inicio del mapeo de grados en la tabla
const oldTbodyStart = `                  {/* CUERPO LUNES A JUEVES */}
                  <tbody className="divide-y divide-sky-200 bg-white">
                    {diasSemana.map((dia) => {
                      const diaData = plan.dias[dia];

                      return (
                        <tr key={dia} className="hover:bg-sky-50/40 transition-colors">
                          {/* Día */}
                          <td className="p-3 font-extrabold text-[#005B94] bg-sky-50/80 border border-sky-200 text-center align-top whitespace-nowrap">
                            <div className="text-sm font-black">{dia}</div>
                            <div className="text-[10px] text-slate-500 font-normal mt-0.5">08:00 - 12:00 h</div>
                          </td>`;

const oldTbodyEnd = `                          {/* Lenguaje */}
                          <td className="p-3 border border-sky-200 align-top text-slate-700 leading-relaxed text-[11px]">
                            <div className="font-bold text-slate-900 mb-1">Comprensión y Fluidez:</div>
                            <p>• Lectura y extracción de ideas clave en texto narrativo.</p>
                            <p className="mt-1">• Producción escrita y ortografía en el cuaderno de trabajo.</p>
                            <p className="mt-1 text-slate-500 italic">45 min después del receso escolar.</p>
                          </td>

                          {/* Ciencias */}
                          <td className="p-3 border border-sky-200 align-top text-slate-700 leading-relaxed text-[11px]">
                            <div className="font-bold text-slate-900 mb-1">Rincones de Aprendizaje:</div>
                            <p>Indagación del tema: <em>{plan.tema_generador_comun}</em>.</p>
                            <p className="mt-1 text-slate-600">
                              Tutoría entre pares: alumnos mayores orientan a los menores en el registro de observaciones.
                            </p>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>`;

const startIndex = content.indexOf(oldTbodyStart);
const endIndex = content.indexOf(oldTbodyEnd);

if (startIndex === -1 || endIndex === -1) {
  console.error('Tbody markers not found!');
  process.exit(1);
}

const newTbody = `                  {/* CUERPO LUNES A JUEVES CON DIVISIÓN CRONOLÓGICA POR PERÍODOS */}
                  <tbody className="divide-y divide-sky-200 bg-white">
                    {diasSemana.map((dia) => {
                      const diaData = plan.dias[dia];

                      // Progresión didáctica diferenciada para las columnas de apoyo
                      const lenguajeProg: Record<DiaSemana, { titulo: string; desc: string }> = {
                        'Lunes': {
                          titulo: 'Apertura y Modelado Léxico',
                          desc: 'Lectura guiada en voz alta, subrayado de términos desconocidos y extracción de ideas centrales.'
                        },
                        'Martes': {
                          titulo: 'Profundización y Redacción',
                          desc: 'Taller de producción escrita en parejas, concordancia gramatical y ortografía en cuaderno.'
                        },
                        'Miércoles': {
                          titulo: 'Círculo de Saberes Orales',
                          desc: 'Narración de anécdotas y relatos de la comunidad con entonación y fluidez compartida.'
                        },
                        'Jueves': {
                          titulo: 'Síntesis y Auto-revisión',
                          desc: 'Revisión colectiva de la producción escrita y verificación con la lista de cotejo.'
                        }
                      };

                      const cienciasProg: Record<DiaSemana, { titulo: string; desc: string }> = {
                        'Lunes': {
                          titulo: 'Exploración y Preguntas',
                          desc: 'Observación del entorno natural y formulación de preguntas generadoras sobre el eje común.'
                        },
                        'Martes': {
                          titulo: 'Experimentación y Rincón',
                          desc: 'Manipulación de muestras en el Rincón de Aprendizaje y elaboración de tablas comparativas.'
                        },
                        'Miércoles': {
                          titulo: 'Proyecto y Conservación',
                          desc: 'Propuesta de acciones de protección ambiental y salud preventiva en la comunidad.'
                        },
                        'Jueves': {
                          titulo: 'Mural y Socialización',
                          desc: 'Exposición de conclusiones grupales y preparación para la evaluación formativa.'
                        }
                      };

                      return (
                        <tr key={dia} className="hover:bg-sky-50/20 transition-colors">
                          {/* Día y Enfoque Didáctico */}
                          <td className="p-3 font-extrabold text-[#005B94] bg-sky-50/90 border border-sky-200 text-center align-top whitespace-nowrap space-y-1.5">
                            <div className="text-base font-black text-[#005B94]">{dia}</div>
                            <div className="text-[10px] bg-white text-slate-600 font-bold px-2 py-0.5 rounded-full border border-sky-200 shadow-2xs">
                              08:00 - 12:00 h
                            </div>
                            <div className="text-[9px] text-sky-800 font-semibold max-w-[110px] mx-auto text-center leading-tight whitespace-normal pt-1">
                              {diaData?.enfoqueDidactico || 'Jornada Pedagógica CNB'}
                            </div>
                          </td>

                          {/* Grados con División Estricta por Períodos */}
                          {selectedGrados.map((g, idx) => {
                            const gData = diaData?.gradosSincronizados?.find((gs: any) => gs.gradoNumero === g) || diaData?.gradosSincronizados?.[idx];

                            if (!gData) {
                              return (
                                <td key={g} className="p-3 border border-sky-200 align-top text-center text-slate-400">
                                  Sin datos para {g}.° Grado
                                </td>
                              );
                            }

                            return (
                              <td key={g} className="p-3 border border-sky-200 align-top space-y-2.5 leading-relaxed min-w-[270px]">
                                
                                {/* Ficha de Cabecera: Asignatura, Tema y Página Real */}
                                <div className="bg-sky-50/90 p-2.5 rounded-xl border border-sky-200 shadow-2xs space-y-1">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="font-black text-[#005B94] text-xs">
                                      {gData.materia}
                                    </span>
                                    <span className="text-[10px] bg-white text-[#005B94] font-black px-2 py-0.5 rounded-md border border-sky-200 shadow-2xs">
                                      {gData.paginaFin && gData.paginaFin !== gData.numeroPagina ? \`Págs. \${gData.numeroPagina} - \${gData.paginaFin}\` : \`Pág. \${gData.numeroPagina || 'Índice'}\`}
                                    </span>
                                  </div>
                                  <div className="text-[11px] font-black text-slate-900 leading-tight">
                                    {gData.tema}
                                  </div>
                                  <div className="text-[10px] text-slate-600">
                                    <strong className="text-slate-800">Libro:</strong> {gData.libroTitulo}
                                  </div>
                                </div>

                                {/* CRONOGRAMA OFICIAL DIVIDIDO POR PERÍODOS */}
                                <div className="space-y-1.5 pt-0.5">
                                  
                                  {/* Período 1: 08:15 - 09:05 */}
                                  <div className="bg-white p-2 rounded-xl border border-slate-200 text-[11px] space-y-1 shadow-2xs">
                                    <div className="flex items-center justify-between text-[10px] font-black">
                                      <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                                        Período 1 (08:15 - 09:05 h)
                                      </span>
                                      <span className={idx === 0 ? 'text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded font-bold' : 'text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded font-bold'}>
                                        {idx === 0 ? 'Atención Directa' : 'Trabajo Autónomo'}
                                      </span>
                                    </div>
                                    <p className="text-slate-700 text-[11px] leading-snug">
                                      {gData.periodo1_actividad?.replace(/^08:15\s*-\s*09:05\s*\|\s*/i, '') || gData.actividadDocente}
                                    </p>
                                  </div>

                                  {/* Período 2: 09:05 - 09:55 (Inversión Estricta de Roles) */}
                                  <div className="bg-white p-2 rounded-xl border border-slate-200 text-[11px] space-y-1 shadow-2xs">
                                    <div className="flex items-center justify-between text-[10px] font-black">
                                      <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                                        Período 2 (09:05 - 09:55 h)
                                      </span>
                                      <span className={idx === 0 ? 'text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded font-bold' : 'text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded font-bold'}>
                                        {idx === 0 ? 'Trabajo Autónomo' : 'Atención Directa (Rotación)'}
                                      </span>
                                    </div>
                                    <p className="text-slate-700 text-[11px] leading-snug">
                                      {gData.periodo2_actividad?.replace(/^09:05\s*-\s*09:55\s*\|\s*/i, '') || gData.actividadEstudiante}
                                    </p>
                                  </div>

                                  {/* Receso Escolar Libre */}
                                  <div className="bg-amber-50 border border-amber-200 text-[10px] text-amber-900 px-2 py-0.5 rounded-lg text-center font-bold">
                                    🔔 10:00 - 10:30 h: Receso Escolar Libre (Sin clases)
                                  </div>

                                  {/* Período 3: 10:30 - 11:15 (Bloque Integrado / Rincones) */}
                                  <div className="bg-white p-2 rounded-xl border border-slate-200 text-[11px] space-y-1 shadow-2xs">
                                    <div className="text-[10px] font-black text-sky-900 bg-sky-100 px-1.5 py-0.5 rounded inline-block">
                                      Período 3 (10:30 - 11:15 h) · Bloque Integrado / Rincón
                                    </div>
                                    <p className="text-slate-700 text-[11px] leading-snug">
                                      {gData.periodo3_actividad?.replace(/^10:30\s*-\s*11:15\s*\|\s*/i, '') || 'Aplicación contextual e indagación en Rincones de Aprendizaje.'}
                                    </p>
                                  </div>

                                  {/* Período 4: 11:15 - 11:50 (Consolidación en Cuaderno) */}
                                  <div className="bg-white p-2 rounded-xl border border-slate-200 text-[11px] space-y-1 shadow-2xs">
                                    <div className="text-[10px] font-black text-indigo-900 bg-indigo-100 px-1.5 py-0.5 rounded inline-block">
                                      Período 4 (11:15 - 11:50 h) · Consolidación y Cuaderno
                                    </div>
                                    <p className="text-slate-700 text-[11px] leading-snug">
                                      {gData.periodo4_actividad?.replace(/^11:15\s*-\s*11:50\s*\|\s*/i, '') || 'Práctica autónoma y resolución de incisos en cuaderno.'}
                                    </p>
                                  </div>
                                </div>

                                {/* Ejercicios Literales del Libro Oficial */}
                                {gData.ejerciciosLiterales && gData.ejerciciosLiterales.length > 0 && (
                                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-[10px] text-slate-700 space-y-1">
                                    <strong className="text-[#005B94] block">Ejercicios del libro oficial:</strong>
                                    {gData.ejerciciosLiterales.slice(0, 2).map((ej: string, eIdx: number) => (
                                      <p key={eIdx} className="line-clamp-2 text-slate-600">• {ej}</p>
                                    ))}
                                  </div>
                                )}

                                {/* Tarea en Casa */}
                                {gData.tareaCasa && (
                                  <div className="text-[10px] text-emerald-900 bg-emerald-50 p-2 rounded-xl border border-emerald-200 leading-tight">
                                    <strong className="text-emerald-950">Tarea en casa:</strong> {gData.tareaCasa}
                                  </div>
                                )}
                              </td>
                            );
                          })}

                          {/* Columna Lenguaje L1 - Progresión por Día */}
                          <td className="p-3 border border-sky-200 align-top text-slate-700 leading-relaxed text-[11px] space-y-2">
                            <div className="bg-sky-50/70 p-2 rounded-lg border border-sky-200">
                              <span className="font-black text-[#005B94] text-[11px] block">
                                {lenguajeProg[dia]?.titulo}
                              </span>
                              <p className="text-[10px] text-slate-600 mt-0.5">
                                {lenguajeProg[dia]?.desc}
                              </p>
                            </div>
                            <div className="text-[10px] text-slate-500 italic">
                              Franja: 10:30 - 11:15 h (Lectoescritura)
                            </div>
                          </td>

                          {/* Columna Ciencias / Integrada - Progresión por Día */}
                          <td className="p-3 border border-sky-200 align-top text-slate-700 leading-relaxed text-[11px] space-y-2">
                            <div className="bg-sky-50/70 p-2 rounded-lg border border-sky-200">
                              <span className="font-black text-[#005B94] text-[11px] block">
                                {cienciasProg[dia]?.titulo}
                              </span>
                              <p className="text-[10px] text-slate-600 mt-0.5">
                                {cienciasProg[dia]?.desc}
                              </p>
                            </div>
                            <div className="text-[10px] text-slate-500 italic">
                              Franja: 11:15 - 11:50 h (Indagación)
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>`;

const fullReplacement = content.slice(0, startIndex) + newTbody + content.slice(endIndex + oldTbodyEnd.length);
fs.writeFileSync(filePath, fullReplacement, 'utf8');
console.log('PlanificadorOficialMineduc.tsx updated with explicit chronological period breakdown!');
