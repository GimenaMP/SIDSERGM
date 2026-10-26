const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/profesor/PlanificadorOficialMineduc.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Replace calculateTemaQuota and applyIntelligentAutoSelection
const oldQuotaBlock = `  // Cálculo inteligente de cuota semanal según ponderación horaria oficial del CNB (RF-02: 60/40)
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
  };`;

const newQuotaBlock = `  // Cálculo inteligente de cuota semanal según número de grados y ponderación oficial del CNB (RF-02)
  const calculateTemaQuota = (
    materiaNombre: string, 
    periodosSemanales: number, 
    numGrados: number = 1
  ): number => {
    const matLower = materiaNombre.toLowerCase();
    const isTroncal = matLower.includes('mate') || matLower.includes('comunic') || matLower.includes('lengua');

    if (numGrados === 1) {
      // Aula Monogrado: Cobertura de la semana completa (Lunes a Jueves = 4 sesiones físicas)
      // Matemáticas (5 horas semanales) y Comunicación L1 (4-5 horas) = 4 sesiones diarias
      if (isTroncal) return 4;
      return 2; // Formativas (Medio Social / Ciencias: 3-4 horas) = 2 sesiones
    } else {
      // Aula Multigrado (2 o más grados): 4 sesiones progresivas de Lunes a Jueves
      if (isTroncal) return 4;
      return 2;
    }
  };

  // Función que calcula y autoselecciona los temas óptimos por unidad y grado
  const applyIntelligentAutoSelection = (
    unidadTarget: number,
    gradosList: number[],
    materiaIdsList: string[]
  ) => {
    const numGrados = Math.max(gradosList.length, 1);
    setConfigMatrix(prev => {
      const nextMatrix: Record<number, Record<string, MateriaConfig>> = { ...prev };
      gradosList.forEach(g => {
        const mats = getMateriasPorGrado(g);
        if (!nextMatrix[g]) nextMatrix[g] = {};

        mats.forEach(mat => {
          const idBase = mat.id.replace(/_\\d+$/, '');
          if (!materiaIdsList.includes(idBase)) return;

          const uni = mat.unidades.find(u => u.unidad === unidadTarget) || mat.unidades[0];
          const safeTemas = (uni?.temas || []).filter(Boolean);
          const quota = calculateTemaQuota(mat.nombre, mat.periodosSemanales, numGrados);
          const autoTemaNums = safeTemas.slice(0, quota).map(t => t.numero);

          nextMatrix[g][idBase] = {
            unidadNum: unidadTarget,
            selectedTemaNums: autoTemaNums.length > 0 ? autoTemaNums : [safeTemas[0]?.numero || 1]
          };
        });
      });
      return nextMatrix;
    });
  };`;

if (!content.includes(oldQuotaBlock)) {
  console.error('oldQuotaBlock not found in PlanificadorOficialMineduc.tsx!');
  process.exit(1);
}

content = content.replace(oldQuotaBlock, newQuotaBlock);

// 2. Update getConfig and setUnidad
const oldGetConfig = `  // Helper para obtener la configuración (unidad, temas seleccionados)
  const getConfig = (grado: number, idBase: string): MateriaConfig => {
    const mat = getMateriaForGradoAndBase(grado, idBase);
    const defaultUnidad = mat?.unidades[0]?.unidad || 1;
    const defaultTema = mat?.unidades[0]?.temas[0]?.numero || 1;

    if (!configMatrix[grado] || !configMatrix[grado][idBase]) {
      return { unidadNum: defaultUnidad, selectedTemaNums: [defaultTema] };
    }
    return configMatrix[grado][idBase];
  };

  // Cambiar de Unidad para una materia específica (aplica cuota inteligente para esa unidad)
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

const newGetConfig = `  // Helper para obtener la configuración (unidad, temas seleccionados)
  const getConfig = (grado: number, idBase: string): MateriaConfig => {
    const mat = getMateriaForGradoAndBase(grado, idBase);
    const defaultUnidad = mat?.unidades[0]?.unidad || 1;
    const uni = mat?.unidades.find(u => u.unidad === defaultUnidad) || mat?.unidades[0];
    const safeTemas = (uni?.temas || []).filter(Boolean);
    const numGrados = Math.max(selectedGrados.length, 1);
    const quota = mat ? calculateTemaQuota(mat.nombre, mat.periodosSemanales, numGrados) : 4;
    const defaultTemas = safeTemas.slice(0, quota).map(t => t.numero);

    if (!configMatrix[grado] || !configMatrix[grado][idBase]) {
      return { 
        unidadNum: defaultUnidad, 
        selectedTemaNums: defaultTemas.length > 0 ? defaultTemas : [1] 
      };
    }
    return configMatrix[grado][idBase];
  };

  // Cambiar de Unidad para una materia específica (aplica cuota inteligente para esa unidad)
  const setUnidad = (grado: number, idBase: string, unidadNum: number) => {
    setConfigMatrix(prev => {
      const gradoConfig = prev[grado] || {};
      const mat = getMateriaForGradoAndBase(grado, idBase);
      const uni = mat?.unidades.find(u => u.unidad === unidadNum);
      const safeTemas = (uni?.temas || []).filter(Boolean);
      const numGrados = Math.max(selectedGrados.length, 1);
      const quota = mat ? calculateTemaQuota(mat.nombre, mat.periodosSemanales, numGrados) : 4;
      const autoTemaNums = safeTemas.slice(0, quota).map(t => t.numero);

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

if (!content.includes(oldGetConfig)) {
  console.error('oldGetConfig not found in PlanificadorOficialMineduc.tsx!');
  process.exit(1);
}

content = content.replace(oldGetConfig, newGetConfig);

// 3. Add useEffect on mount to initialize auto selection
if (!content.includes('// Inicializar autoselección inteligente en el montaje inicial')) {
  const mountEffect = `
  // Inicializar autoselección inteligente en el montaje inicial
  React.useEffect(() => {
    applyIntelligentAutoSelection(selectedUnidadGlobal, selectedGrados, selectedMateriaIds);
  }, []);
`;
  content = content.replace('const handleSelectUnidadGlobal = (uNum: number) => {', mountEffect + '\n  const handleSelectUnidadGlobal = (uNum: number) => {');
}

// 4. Update getColumnasEstructuradas for Monogrado vs Multigrado
const oldGetColumnas = `  // Generador de las 5 columnas dinámicas oficiales estructuradas al estilo Guía del Docente MINEDUC
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
        habilidadHeader: \`Bloque Fundamental (60%): \${mat1Nombre}\`,
        habilidadSub: '08:15 - 09:05 h (50 min) · Modelado en Pizarra y Atención Directa',
        tiempo: '08:15 – 09:05 h',
        grupoHeader: \`GRUPO A (\${gradosText}) · ATENCIÓN DIRECTA\`,
        materiaBase: mat1?.idBase || 'mate'
      },
      {
        id: 'col_2',
        habilidadHeader: \`Bloque Fundamental (60%): Inversión y Práctica\`,
        habilidadSub: '09:05 - 09:55 h (50 min) · Rotación a Grupo B / Trabajo Autónomo',
        tiempo: '09:05 – 09:55 h',
        grupoHeader: \`GRUPO B (\${gradosText}) · ROTACIÓN Y LIBRO\`,
        materiaBase: mat1?.idBase || 'mate'
      },
      {
        id: 'col_3',
        habilidadHeader: \`Bloque Formativo (40%): \${mat2Nombre}\`,
        habilidadSub: '10:30 - 11:15 h (45 min) · Indagación y Aplicación Contextual',
        tiempo: '10:30 – 11:15 h',
        grupoHeader: \`TODOS LOS GRADOS · TEMA EJE TRANSVERSAL\`,
        materiaBase: mat2?.idBase || 'ciencias'
      },
      {
        id: 'col_4',
        habilidadHeader: 'Rincones de Aprendizaje / Experimentos',
        habilidadSub: '11:15 - 11:50 h (35 min) · Tutoría entre Pares y Cuaderno',
        tiempo: '11:15 – 11:50 h',
        grupoHeader: 'GRUPOS MIXTOS (Manipulación Concreta)',
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
    ];
  };`;

const newGetColumnas = `  // Generador de las 5 columnas dinámicas oficiales estructuradas al estilo Guía del Docente MINEDUC
  const getColumnasEstructuradas = () => {
    const matSelectedObjs = todasLasMaterias.filter(m => selectedMateriaIds.includes(m.idBase));
    const mat1 = matSelectedObjs[0];
    const mat2 = matSelectedObjs[1];
    const mat1Nombre = mat1?.nombre || 'Matemáticas';
    const mat2Nombre = mat2?.nombre || 'Ciencias y Entorno Integrado';
    const isMonogrado = selectedGrados.length === 1;
    const gradoUnico = selectedGrados[0] || 3;
    const gradosText = selectedGrados.map(g => \`\${g}.°\`).join(' y ');

    if (isMonogrado) {
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
    ];
  };`;

if (!content.includes(oldGetColumnas)) {
  console.error('oldGetColumnas not found in PlanificadorOficialMineduc.tsx!');
  process.exit(1);
}

content = content.replace(oldGetColumnas, newGetColumnas);

// 5. Update banner text explaining the calculation
const oldBannerDesc = `<p className="text-[11px] text-slate-600 bg-sky-50/70 p-2.5 rounded-xl border border-sky-100 leading-snug">
            <strong>Regla CNB 60/40 aplicada:</strong> Al seleccionar la Unidad {selectedUnidadGlobal}, SIDSER autoselecciona automáticamente la cuota semanal recomendada según los períodos oficiales: <strong>Matemáticas</strong> (2 temas / 5 per.), <strong>Comunicación</strong> (2 temas / 4 per.), <strong>Ciencias y Sociales</strong> (1 tema / 3 per.). Puedes personalizar los temas en la tabla de cotejo abajo.
          </p>`;

const newBannerDesc = `<div className="text-[11px] text-slate-700 bg-sky-50/80 p-3 rounded-xl border border-sky-200 leading-snug space-y-1">
            <div className="font-extrabold text-[#005B94] flex items-center justify-between">
              <span>Dosificación Inteligente CNB (1 Página Física = 1 Sesión Diaria):</span>
              <span className="text-[10px] bg-[#005B94] text-white px-2 py-0.5 rounded font-black">
                {selectedGrados.length === 1 ? 'Aula Monogrado' : \`Aula Multigrado (\${selectedGrados.length} Grados)\`}
              </span>
            </div>
            <p>
              {selectedGrados.length === 1 ? (
                <>Al atender <strong>1 solo grado</strong>, el docente dedica el 100% del tiempo de clase. Se autoseleccionan <strong>4 sesiones consecutivas de Lunes a Jueves</strong> (1 página por día) para cubrir la carga oficial del CNB: <strong>Matemáticas</strong> (5 horas semanales) y <strong>Comunicación L1</strong> (4-5 horas semanales), más 2 sesiones para áreas integradas. El viernes se reserva para la evaluación diagnóstica.</>
              ) : (
                <>En <strong>aula multigrado ({selectedGrados.map(g => \`\${g}.°\`).join(' y ')})</strong> se aplica <strong>Atención Alternada Rotativa</strong> (Grupo A Modelado Directo / Grupo B Trabajo Autónomo). Cada grado avanza de forma paralela <strong>1 página física real por día</strong> (4 sesiones de Lunes a Jueves) bajo el mismo <strong>Tema Eje Transversal</strong> unificador.</>
              )}
            </p>
          </div>`;

if (!content.includes(oldBannerDesc)) {
  console.error('oldBannerDesc not found!');
  process.exit(1);
}

content = content.replace(oldBannerDesc, newBannerDesc);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✓ Successfully patched PlanificadorOficialMineduc.tsx with intelligent quota, monogrado/multigrado support, and dynamic banners!');
