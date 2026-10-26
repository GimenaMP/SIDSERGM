const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/components/profesor/PlanificadorOficialMineduc.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Agregar selectedUnidadGlobal, calculateTemaQuota y applyIntelligentAutoSelection
const oldStateBlock = `  // ── 3. Matriz de configuración: [grado][materiaId] => { unidadNum, selectedTemaNums: [] } ──
  const [configMatrix, setConfigMatrix] = useState<Record<number, Record<string, MateriaConfig>>>({});`;

const newStateBlock = `  // ── 3. Matriz de configuración: [grado][materiaId] => { unidadNum, selectedTemaNums: [] } ──
  const [configMatrix, setConfigMatrix] = useState<Record<number, Record<string, MateriaConfig>>>({});

  // ── 4. Unidad Global Seleccionada (1-4) para cálculo inteligente de cuota semanal CNB ──
  const [selectedUnidadGlobal, setSelectedUnidadGlobal] = useState<number>(1);

  // Cálculo inteligente de cuota semanal según ponderación horaria oficial del CNB (RF-02: 60/40)
  const calculateTemaQuota = (materiaNombre: string, periodosSemanales: number): number => {
    const matLower = materiaNombre.toLowerCase();
    if (matLower.includes('mate')) {
      return 2; // 5 períodos semanales (35%) -> 2 temas principales por semana
    } else if (matLower.includes('comunic') || matLower.includes('lengua')) {
      return 2; // 4 períodos semanales (25%) -> 2 temas principales por semana
    } else if (matLower.includes('medio') || matLower.includes('natural') || matLower.includes('social')) {
      return 1; // 3 períodos semanales (20%) -> 1 tema principal por semana
    }
    return 1;
  };

  // Función que calcula y autoselecciona los temas óptimos por unidad y grado
  const applyIntelligentAutoSelection = (
    unidadTarget: number,
    gradosList: number[],
    materiaIdsList: string[]
  ) => {
    setConfigMatrix(prev => {
      const nextMatrix: Record<number, Record<string, MateriaConfig>> = { ...prev };
      gradosList.forEach(g => {
        const mats = getMateriasPorGrado(g);
        if (!nextMatrix[g]) nextMatrix[g] = {};

        mats.forEach(mat => {
          const idBase = mat.id.replace(/_\\d+$/, '');
          if (!materiaIdsList.includes(idBase)) return;

          const uni = mat.unidades.find(u => u.unidad === unidadTarget) || mat.unidades[0];
          const quota = calculateTemaQuota(mat.nombre, mat.periodosSemanales);
          const autoTemaNums = uni.temas.slice(0, quota).map(t => t.numero);

          nextMatrix[g][idBase] = {
            unidadNum: unidadTarget,
            selectedTemaNums: autoTemaNums.length > 0 ? autoTemaNums : [uni.temas[0]?.numero || 1]
          };
        });
      });
      return nextMatrix;
    });
  };

  const handleSelectUnidadGlobal = (uNum: number) => {
    setSelectedUnidadGlobal(uNum);
    applyIntelligentAutoSelection(uNum, selectedGrados, selectedMateriaIds);
  };`;

content = content.replace(oldStateBlock, newStateBlock);

// 2. Actualizar getColumnasEstructuradas para que no mezcle temas de diferentes grados en los headers
const oldGetCols = `  // Generador de las 5 columnas dinámicas oficiales estructuradas al estilo Guía del Docente MINEDUC
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
  };`;

const newGetCols = `  // Generador de las 5 columnas dinámicas oficiales estructuradas al estilo Guía del Docente MINEDUC
  const getColumnasEstructuradas = () => {
    const matSelectedObjs = todasLasMaterias.filter(m => selectedMateriaIds.includes(m.idBase));
    const mat1 = matSelectedObjs[0];
    const mat2 = matSelectedObjs[1];
    const mat1Nombre = mat1?.nombre || 'Matemáticas';
    const mat2Nombre = mat2?.nombre || 'Ciencias y Entorno Integrado';
    const gradosText = selectedGrados.map(g => \`\${g}.°\`).join(' y ');

    return [
      {
        id: 'col_1',
        habilidadHeader: \`\${mat1Nombre}: Modelado Conceptual Inicial\`,
        habilidadSub: 'Atención Directa Docente y Activación CNB',
        tiempo: 'Aprox. 50 minutos',
        grupoHeader: \`TODOS GRUPO A (\${gradosText}) · \${mat1Nombre}\`,
        materiaBase: mat1?.idBase || 'mate'
      },
      {
        id: 'col_2',
        habilidadHeader: \`\${mat1Nombre}: Práctica y Algoritmo Guiado\`,
        habilidadSub: 'Inversión de Roles y Trabajo Autónomo en Cuaderno',
        tiempo: 'Aprox. 45 minutos',
        grupoHeader: 'CADA GRADO (Trabajo Autónomo y Rotación)',
        materiaBase: mat1?.idBase || 'mate'
      },
      {
        id: 'col_3',
        habilidadHeader: \`\${mat2Nombre}: Indagación y Aplicación Contextual\`,
        habilidadSub: 'Observación, Esquemas y Diálogo Comunitario',
        tiempo: 'Aprox. 45 minutos',
        grupoHeader: \`TODOS GRUPO B (\${gradosText}) · \${mat2Nombre}\`,
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
        habilidadHeader: 'Libros Oficiales MINEDUC y Consolidación',
        habilidadSub: 'Ejercicios Fácticos por Grado y Tarea en Casa',
        tiempo: 'Aprox. 30 minutos',
        grupoHeader: 'CADA GRADO (Páginas Oficiales MINEDUC)',
        materiaBase: 'fijacion'
      }
    ];
  };`;

content = content.replace(oldGetCols, newGetCols);

// 3. Modificar toggleGrado y toggleMateria para que activen applyIntelligentAutoSelection
const oldToggles = `  // Toggle grados
  const toggleGrado = (g: number) => {
    setSelectedGrados(prev => {
      if (prev.includes(g)) {
        return prev.filter(x => x !== g).sort();
      } else {
        return [...prev, g].sort();
      }
    });
  };

  // Toggle materia simultánea
  const toggleMateria = (idBase: string) => {
    setSelectedMateriaIds(prev => {
      if (prev.includes(idBase)) {
        if (prev.length === 1) return prev;
        return prev.filter(x => x !== idBase);
      } else {
        return [...prev, idBase];
      }
    });
  };`;

const newToggles = `  // Toggle grados con dosificación inteligente automática
  const toggleGrado = (g: number) => {
    setSelectedGrados(prev => {
      const next = prev.includes(g)
        ? prev.filter(x => x !== g).sort()
        : [...prev, g].sort();
      applyIntelligentAutoSelection(selectedUnidadGlobal, next, selectedMateriaIds);
      return next;
    });
  };

  // Toggle materia simultánea con dosificación inteligente automática
  const toggleMateria = (idBase: string) => {
    setSelectedMateriaIds(prev => {
      const next = prev.includes(idBase)
        ? (prev.length === 1 ? prev : prev.filter(x => x !== idBase))
        : [...prev, idBase];
      applyIntelligentAutoSelection(selectedUnidadGlobal, selectedGrados, next);
      return next;
    });
  };`;

content = content.replace(oldToggles, newToggles);

// 4. Modificar setUnidad para que cuando cambie unidad de una materia específica, autoseleccione la cuota
const oldSetUnidad = `  // Cambiar de Unidad (resetea los temas a los primeros)
  const setUnidad = (grado: number, idBase: string, unidadNum: number) => {
    setConfigMatrix(prev => {
      const gradoConfig = prev[grado] || {};
      const mat = getMateriaForGradoAndBase(grado, idBase);
      const uni = mat?.unidades.find(u => u.unidad === unidadNum);
      const firstTema = uni?.temas[0]?.numero || 1;

      return {
        ...prev,
        [grado]: {
          ...gradoConfig,
          [idBase]: {
            unidadNum,
            selectedTemaNums: [firstTema]
          }
        }
      };
    });
  };`;

const newSetUnidad = `  // Cambiar de Unidad para una materia específica (aplica cuota inteligente para esa unidad)
  const setUnidad = (grado: number, idBase: string, unidadNum: number) => {
    setConfigMatrix(prev => {
      const gradoConfig = prev[grado] || {};
      const mat = getMateriaForGradoAndBase(grado, idBase);
      const uni = mat?.unidades.find(u => u.unidad === unidadNum);
      const quota = mat ? calculateTemaQuota(mat.nombre, mat.periodosSemanales) : 1;
      const autoTemaNums = uni ? uni.temas.slice(0, quota).map(t => t.numero) : [1];

      return {
        ...prev,
        [grado]: {
          ...gradoConfig,
          [idBase]: {
            unidadNum,
            selectedTemaNums: autoTemaNums.length > 0 ? autoTemaNums : [1]
          }
        }
      };
    });
  };`;

content = content.replace(oldSetUnidad, newSetUnidad);

// 5. Agregar el Selector de Unidad Global en el JSX (entre Grados y Asignaturas)
const oldGradosJsx = `        {/* GRADOS DEL AULA */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-[#00A3E0]" />
            <span>1. Grados del Aula Multigrado (Selecciona uno o más)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6].map((g) => {
              const isSelected = selectedGrados.includes(g);
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleGrado(g)}
                  className={\`w-11 h-11 rounded-xl text-sm font-black transition-all flex items-center justify-center border shadow-sm \${
                    isSelected
                      ? 'bg-[#005B94] text-white border-[#005B94] scale-105 ring-2 ring-[#00A3E0]/30'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }\`}
                >
                  {g}.°
                </button>
              );
            })}
          </div>
          {selectedGrados.length > 0 && (
            <p className="text-[11px] text-slate-500 font-semibold">
              Aula: <span className="text-[#005B94] font-bold">{selectedGrados.map(g => \`\${g}.°\`).join(' y ')} Primaria</span>
            </p>
          )}
        </div>`;

const newGradosJsx = `        {/* 1. GRADOS DEL AULA */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-[#00A3E0]" />
            <span>1. Grados del Aula Multigrado (Selecciona uno o más)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6].map((g) => {
              const isSelected = selectedGrados.includes(g);
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleGrado(g)}
                  className={\`w-11 h-11 rounded-xl text-sm font-black transition-all flex items-center justify-center border shadow-sm \${
                    isSelected
                      ? 'bg-[#005B94] text-white border-[#005B94] scale-105 ring-2 ring-[#00A3E0]/30'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }\`}
                >
                  {g}.°
                </button>
              );
            })}
          </div>
          {selectedGrados.length > 0 && (
            <p className="text-[11px] text-slate-500 font-semibold">
              Aula: <span className="text-[#005B94] font-bold">{selectedGrados.map(g => \`\${g}.°\`).join(' y ')} Primaria</span>
            </p>
          )}
        </div>

        {/* 2. UNIDAD GLOBAL Y DOSIFICACIÓN INTELIGENTE AUTOMÁTICA */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-[11px] font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>2. Unidad Bimestral de Avance (Cálculo Automático de Temas por Prioridad CNB)</span>
            </label>
            <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
              ⚡ Dosificación Inteligente Activa
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[1, 2, 3, 4].map((u) => {
              const isSelected = selectedUnidadGlobal === u;
              return (
                <button
                  key={u}
                  type="button"
                  onClick={() => handleSelectUnidadGlobal(u)}
                  className={\`px-4 py-2 rounded-xl text-xs font-black transition-all border flex items-center gap-1.5 shadow-sm \${
                    isSelected
                      ? 'bg-[#005B94] text-white border-[#005B94] shadow-md scale-105 ring-2 ring-[#00A3E0]/30'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }\`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Unidad {u}</span>
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-600 bg-sky-50/70 p-2.5 rounded-xl border border-sky-100 leading-snug">
            <strong>Regla CNB 60/40 aplicada:</strong> Al seleccionar la Unidad {selectedUnidadGlobal}, SIDSER autoselecciona automáticamente la cuota semanal recomendada según los períodos oficiales: <strong>Matemáticas</strong> (2 temas / 5 per.), <strong>Comunicación</strong> (2 temas / 4 per.), <strong>Ciencias y Sociales</strong> (1 tema / 3 per.). Puedes personalizar los temas en la tabla de cotejo abajo.
          </p>
        </div>`;

content = content.replace(oldGradosJsx, newGradosJsx);

// 6. Cambiar el número de sección de Asignaturas a "3" y Tabla a "4"
content = content.replace(
  '<span>2. Asignaturas a Incluir Simultáneamente (Marca las que deseas planificar)</span>',
  '<span>3. Asignaturas a Incluir Simultáneamente (Marca las que deseas planificar)</span>'
);
content = content.replace(
  '<span>3. Tabla de Cotejo: Selección Simultánea de Unidad, Temas y Subtemas por Asignatura</span>',
  '<span>4. Tabla de Cotejo: Temas y Subtemas Seleccionados (Ajuste Personalizado de Checkboxes)</span>'
);

// 7. Actualizar el renderizado del cuerpo de la tabla semanal para mostrar explícitamente el grado y tema
const oldCol1Cell = `<td className="p-3.5 border border-sky-300 align-top text-slate-800 text-[11px] leading-relaxed bg-white space-y-2">
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
                                })}`;

const newCol1Cell = `<td className="p-3.5 border border-sky-300 align-top text-slate-800 text-[11px] leading-relaxed bg-white space-y-2">
                                {selectedGrados.map((g, idx) => {
                                  const gData = diaData?.gradosSincronizados?.find((gs: any) => gs.gradoNumero === g) || diaData?.gradosSincronizados?.[idx];
                                  const isDirecta = (dia === 'Lunes' && idx === 0) || (dia === 'Martes' && idx === 1) || (dia === 'Miércoles' && idx === 0) || (dia === 'Jueves' && idx === 0);
                                  const temaCorto = gData?.tema ? \` — \${gData.tema.split(',')[0].slice(0, 32)}\` : '';

                                  return (
                                    <div key={g} className="space-y-0.5 border-b border-sky-100 pb-1.5 last:border-none">
                                      <div className="font-extrabold text-[#005B94] flex items-center justify-between">
                                        <span>• {g}.° Primaria ({gData?.numeroPagina ? \`Pág. \${gData.numeroPagina}\` : ''}{temaCorto}):</span>
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
                                })}`;

content = content.replace(oldCol1Cell, newCol1Cell);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('✅ PlanificadorOficialMineduc.tsx actualizado exitosamente con Dosificación Inteligente y Separación Estricta!');
