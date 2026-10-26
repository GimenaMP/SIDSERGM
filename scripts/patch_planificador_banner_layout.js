const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/components/profesor/PlanificadorOficialMineduc.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Reemplazar la franja resumen del Eje Temático Integrador
const oldBanner = `          {/* FRANJA RESUMEN DE LAS MATERIAS PLANIFICADAS */}
          <div className="bg-sky-50/80 border-b border-sky-200 px-6 py-3 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[#005B94] uppercase tracking-wide">
                Eje Temático Integrador: <span className="text-slate-900">{plan.tema_generador_comun}</span>
              </span>
              <span className="text-[10px] bg-sky-200/70 text-[#005B94] font-bold px-2 py-0.5 rounded">
                Asignaturas Simultáneas: {selectedMateriaIds.length}
              </span>
            </div>`;

const newBanner = `          {/* FRANJA RESUMEN DEL TEMA EJE TRANSVERSAL Y PROPÓSITO COMÚN */}
          <div className="bg-sky-50/90 border-b border-sky-200 px-6 py-3 space-y-2 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#005B94] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase shadow-2xs">
                    Eje Temático Transversal
                  </span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    {plan.tema_generador_comun}
                  </span>
                </div>
                {plan.proposito_comun && (
                  <p className="text-[11px] text-slate-700 leading-snug">
                    <strong className="text-[#005B94]">Propósito Común:</strong> {plan.proposito_comun}
                  </p>
                )}
              </div>
              <span className="text-[10px] bg-sky-200/80 text-[#005B94] font-bold px-2.5 py-1 rounded-lg shrink-0 self-start sm:self-auto shadow-2xs">
                Asignaturas: {selectedMateriaIds.length}
              </span>
            </div>`;

content = content.replace(oldBanner, newBanner);

// 2. Limpiar el renderizado de Column 1 para evitar cortes de texto raros
const oldCol1Cell = `                                  const gData = diaData?.gradosSincronizados?.find((gs: any) => gs.gradoNumero === g) || diaData?.gradosSincronizados?.[idx];
                                  const isDirecta = (dia === 'Lunes' && idx === 0) || (dia === 'Martes' && idx === 1) || (dia === 'Miércoles' && idx === 0) || (dia === 'Jueves' && idx === 0);
                                  const temaCorto = gData?.tema ? \` — \${gData.tema.split(',')[0].slice(0, 32)}\` : '';

                                  return (
                                    <div key={g} className="space-y-0.5 border-b border-sky-100 pb-1.5 last:border-none">
                                      <div className="font-extrabold text-[#005B94] flex items-center justify-between">
                                        <span>• {g}.° Primaria ({gData?.numeroPagina ? \`Pág. \${gData.numeroPagina}\` : ''}{temaCorto}):</span>`;

const newCol1Cell = `                                  const gData = diaData?.gradosSincronizados?.find((gs: any) => gs.gradoNumero === g) || diaData?.gradosSincronizados?.[idx];
                                  const isDirecta = (dia === 'Lunes' && idx === 0) || (dia === 'Martes' && idx === 1) || (dia === 'Miércoles' && idx === 0) || (dia === 'Jueves' && idx === 0);
                                  const temaLimpio = (gData?.tema || '').split(',')[0].replace(/\\(Pág\\..*?\\)/g, '').trim();
                                  const temaCorto = temaLimpio ? \` · \${temaLimpio.slice(0, 32)}\` : '';

                                  return (
                                    <div key={g} className="space-y-0.5 border-b border-sky-100 pb-1.5 last:border-none">
                                      <div className="font-extrabold text-[#005B94] flex items-center justify-between">
                                        <span>• {g}.° Primaria ({gData?.numeroPagina ? \`Pág. \${gData.numeroPagina}\` : ''}{temaCorto}):</span>`;

content = content.replace(oldCol1Cell, newCol1Cell);

// 3. Renderizar Columna 5 con ejercicios literales detallados
const oldCol5Cell = `                                {selectedGrados.map((g, idx) => {
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
                                })}`;

const newCol5Cell = `                                {selectedGrados.map((g, idx) => {
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
                                })}`;

content = content.replace(oldCol5Cell, newCol5Cell);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('✅ PlanificadorOficialMineduc.tsx actualizado con franja de Tema Eje Transversal y ejercicios detallados!');
