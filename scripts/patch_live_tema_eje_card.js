const fs = require('fs');

const uiPath = 'src/components/profesor/PlanificadorOficialMineduc.tsx';
let ui = fs.readFileSync(uiPath, 'utf8');

// 1. Add temasEjeEnComunDetectados useMemo hook
const hookDef = `
  // ==========================================================================
  // DETECCIÓN EN VIVO DE TEMAS EN COMÚN ENTRE GRADOS Y TRAZADO DE TEMAS EJE
  // ==========================================================================
  const temasEjeEnComunDetectados = useMemo(() => {
    if (selectedGrados.length < 2 || selectedMateriaIds.length === 0) return [];

    return selectedMateriaIds.map(idBase => {
      const mMeta = todasLasMaterias.find(m => m.idBase === idBase);
      if (!mMeta) return null;

      const temasPorGrado = selectedGrados.map(g => {
        const mat = getMateriaForGradoAndBase(g, idBase);
        if (!mat) return { grado: g, temas: [] };
        const cfg = getConfig(g, idBase);
        const uni = mat.unidades.find(u => u.unidad === cfg.unidadNum) || mat.unidades[0];
        const safeTemas = (uni?.temas || []).filter(Boolean);
        const selectedTemas = safeTemas.filter(t => cfg.selectedTemaNums.includes(t.numero));
        const activeTemas = selectedTemas.length > 0 ? selectedTemas : (safeTemas.length > 0 ? [safeTemas[0]] : []);
        return {
          grado: g,
          libroTitulo: mat.libroTitulo,
          unidadNum: uni?.unidad,
          unidadTitulo: uni?.titulo,
          temas: activeTemas.map(t => ({
            titulo: t.titulo,
            paginaInicio: t.paginaInicio,
            paginaFin: t.paginaFin
          }))
        };
      });

      const todosTextos = temasPorGrado.flatMap(tg => tg.temas.map(t => t.titulo)).join(' ');
      const normText = todosTextos.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toLowerCase();

      let temaEjeTrazado = '';
      let palabrasClaveComunes: string[] = [];
      let estrategiaDidactica = '';

      if (idBase.includes('social')) {
        if (/paleolit|prehistor|pobla|primeros poblador|origen|cazador/.test(normText)) {
          temaEjeTrazado = 'Sociedades Prehistóricas, Poblamiento y Primeros Asentamientos de América';
          palabrasClaveComunes = ['prehistoria', 'paleolítico', 'primeros pobladores', 'cazadores', 'América'];
          estrategiaDidactica = 'Ambos grados convergen en la prehistoria y origen humano: el docente modela una línea de tiempo compartida en la pizarra (10-15 min) y luego 5.° resuelve sobre cazadores de América y 6.° sobre el Paleolítico.';
        } else if (/maya|indigena|ancestral|colonia|conquista/.test(normText)) {
          temaEjeTrazado = 'Evolución Histórica, Pueblos Originarios y Memoria Cultural de Guatemala';
          palabrasClaveComunes = ['cultura maya', 'pueblos originarios', 'historia', 'ancestralidad'];
          estrategiaDidactica = 'El docente inicia con una conversación plenaria sobre las raíces históricas y la memoria cultural antes de la indagación por grado.';
        } else {
          temaEjeTrazado = 'Sociedades, Geografía y Convivencia en América y la Comunidad';
          palabrasClaveComunes = ['sociedad', 'territorio', 'comunidad', 'geografía'];
          estrategiaDidactica = 'Explicación plenaria del espacio geográfico y social en pizarra, seguida de lectura en el texto oficial.';
        }
      } else if (idBase.includes('natural') || idBase.includes('ciencia')) {
        if (/celul|mitocondri|organel|reproducc|mitos|meios|tejid/.test(normText)) {
          temaEjeTrazado = 'La Célula como Unidad de Vida: Estructura, Mitocondria y Reproducción Celular';
          palabrasClaveComunes = ['célula', 'mitocondria', 'organelos', 'reproducción celular', 'tejidos'];
          estrategiaDidactica = 'Conexión biológica directa: 5.° aprende las partes y organelos celulares y 6.° la reproducción por mitosis. El docente modela la estructura celular en pizarra para ambos grados a la vez.';
        } else if (/ecosistem|biodivers|planta|animal|cadena/.test(normText)) {
          temaEjeTrazado = 'Los Ecosistemas, la Biodiversidad y el Equilibrio Ambiental';
          palabrasClaveComunes = ['ecosistemas', 'biodiversidad', 'seres vivos', 'equilibrio ambiental'];
          estrategiaDidactica = 'El docente modela las relaciones ecológicas en pizarra para toda la clase antes del trabajo diferenciado.';
        } else {
          temaEjeTrazado = 'Sistemas Vivos, Organización Biológica y Cuidado del Entorno';
          palabrasClaveComunes = ['seres vivos', 'salud', 'naturaleza', 'organismos'];
          estrategiaDidactica = 'Activación de presaberes sobre los seres vivos antes del trabajo en el texto oficial.';
        }
      } else if (idBase.includes('mate')) {
        if (/multipl|divisor|mcm|mcd|factor|primo/.test(normText)) {
          temaEjeTrazado = 'Razonamiento Numérico y Divisibilidad: Múltiplos, Divisores y Proporciones';
          palabrasClaveComunes = ['múltiplos', 'divisores', 'MCM', 'MCD', 'divisibilidad'];
          estrategiaDidactica = 'El docente modela el concepto de divisibilidad y múltiplos en pizarra. 5.° resuelve múltiplos y 6.° avanza a divisores y descomposición.';
        } else if (/fracci|decimal|proporci|porcentaj/.test(normText)) {
          temaEjeTrazado = 'Operaciones con Fracciones, Proporciones y Resolución de Problemas';
          palabrasClaveComunes = ['fracciones', 'proporciones', 'cálculo', 'operaciones'];
          estrategiaDidactica = 'Modelado del algoritmo con fracciones en pizarra antes de la ejercitación en cuaderno.';
        } else {
          temaEjeTrazado = 'Razonamiento Numérico y Operaciones en la Vida Cotidiana';
          palabrasClaveComunes = ['números', 'operaciones', 'cálculo mental', 'problemas'];
          estrategiaDidactica = 'Modelado conjunto del razonamiento aritmético para agilizar el cálculo en ambos grados.';
        }
      } else if (idBase.includes('lengua') || idBase.includes('comunic')) {
        if (/fabul|ensay|narrat|moraleja|argument|cuent/.test(normText)) {
          temaEjeTrazado = 'Comprensión Lectora, Tipologías Textuales (Fábula y Ensayo) y Expresión Escrita';
          palabrasClaveComunes = ['tipologías textuales', 'comprensión lectora', 'fábula', 'ensayo', 'redacción'];
          estrategiaDidactica = 'El docente explica la estructura de los textos en pizarra. 5.° analiza textos narrativos (fábula) y 6.° textos argumentativos (ensayo).';
        } else {
          temaEjeTrazado = 'Comunicación Dialógica, Tipologías Textuales y Expresión Escrita';
          palabrasClaveComunes = ['lenguaje', 'lectura', 'expresión oral', 'diálogo'];
          estrategiaDidactica = 'Lectura modelada y activación del vocabulario para ambos grados.';
        }
      } else {
        temaEjeTrazado = 'Desarrollo Formativo Integral y Vinculación Comunitaria';
        palabrasClaveComunes = ['creatividad', 'práctica formativa', 'convivencia'];
        estrategiaDidactica = 'Taller práctico simultáneo para todos los grados.';
      }

      return {
        materiaNombre: mMeta.nombre,
        idBase,
        temasPorGrado,
        temaEjeTrazado,
        palabrasClaveComunes,
        estrategiaDidactica
      };
    }).filter(Boolean);
  }, [selectedGrados, selectedMateriaIds, configMatrix]);
`;

if (!ui.includes('temasEjeEnComunDetectados = useMemo')) {
  ui = ui.replace(
    '  // Generar Planificación: procesa TODAS las combinaciones de grado x materia x temas seleccionados',
    hookDef + '\n  // Generar Planificación: procesa TODAS las combinaciones de grado x materia x temas seleccionados'
  );
}

// 2. Add visual section in the JSX right before the "BOTÓN GENERAR PLANIFICACIÓN"
const visualCardJSX = `
        {/* =================================================================== */}
        {/* 5. ANÁLISIS EN VIVO: TEMAS EN COMÚN Y EJES TRANSVERSALES TRAZADOS   */}
        {/* =================================================================== */}
        {selectedGrados.length > 1 && (temasEjeEnComunDetectados as any[]).length > 0 && (
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-[11px] font-black uppercase text-indigo-900 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>5. Detección Inteligente de Temas Eje en Común (Trazado Automático Multigrado)</span>
              </label>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                {selectedGrados.map(g => \`\${g}.°\`).join(' y ')} Primaria · Similitud Curricular Activa
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(temasEjeEnComunDetectados as any[]).map((eje) => (
                <div
                  key={eje.idBase}
                  className="rounded-2xl border-2 border-indigo-200 bg-linear-to-br from-indigo-50/70 via-white to-sky-50/50 p-3.5 shadow-2xs space-y-2.5 transition-all hover:border-indigo-300"
                >
                  {/* Encabezado Asignatura */}
                  <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                    <span className="font-black text-indigo-950 text-xs flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0"></span>
                      <span>{eje.materiaNombre}</span>
                    </span>
                    <span className="text-[9px] bg-indigo-600 text-white font-black px-2 py-0.5 rounded shadow-2xs">
                      Tema Eje Trazado
                    </span>
                  </div>

                  {/* Temas seleccionados por grado */}
                  <div className="space-y-1 text-[11px] bg-white/80 p-2 rounded-xl border border-indigo-100">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Temas Seleccionados en los Libros Oficiales:
                    </div>
                    {eje.temasPorGrado.map((tg: any) => (
                      <div key={tg.grado} className="text-slate-800 flex items-start gap-1.5">
                        <strong className="text-indigo-900 shrink-0">{tg.grado}.° Primaria:</strong>
                        <span className="truncate text-slate-700">
                          {tg.temas.map((t: any) => t.titulo).join(', ')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Palabras y Conceptos en Común */}
                  {eje.palabrasClaveComunes && eje.palabrasClaveComunes.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-indigo-900">
                        Conceptos y Palabras Clave en Común Detectados:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {eje.palabrasClaveComunes.map((kw: string) => (
                          <span
                            key={kw}
                            className="bg-indigo-100/90 text-indigo-900 border border-indigo-200 text-[10px] font-black px-2 py-0.5 rounded-md"
                          >
                            ✓ {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TEMA EJE FINAL TRAZADO */}
                  <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-xs space-y-1">
                    <div className="text-[9px] font-black uppercase tracking-wider text-indigo-200">
                      🎯 Tema Eje Unificador para Explicación en Pizarra:
                    </div>
                    <div className="text-xs font-black leading-snug">
                      {eje.temaEjeTrazado}
                    </div>
                  </div>

                  {/* Estrategia Pedagógica para el Docente */}
                  <p className="text-[11px] text-slate-700 leading-relaxed bg-white/60 p-2 rounded-lg border border-slate-200">
                    <strong className="text-indigo-900">Orientación Didáctica:</strong> {eje.estrategiaDidactica}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
`;

if (!ui.includes('5. Detección Inteligente de Temas Eje en Común')) {
  ui = ui.replace(
    '        {/* BOTÓN GENERAR PLANIFICACIÓN */}',
    visualCardJSX + '\n        {/* BOTÓN GENERAR PLANIFICACIÓN */}'
  );
}

fs.writeFileSync(uiPath, ui, 'utf8');
console.log('PlanificadorOficialMineduc.tsx updated with live Tema Eje detection card!');
