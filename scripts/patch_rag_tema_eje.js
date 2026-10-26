const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/utils/ragEngine.ts');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Agregar determineTemaEjeTransversal y actualizar UnifiedWeeklyPlan
const findUnifiedInterface = `export interface UnifiedWeeklyPlan {
  ciclo: 'segundo_ciclo' | 'primer_ciclo';
  grados: number[];
  bimestre: number;
  semana: number;
  area_curricular: string;
  tema_generador_comun: string;
  descripcion_eje_integrador: string;`;

const replaceUnifiedInterface = `export interface UnifiedWeeklyPlan {
  ciclo: 'segundo_ciclo' | 'primer_ciclo';
  grados: number[];
  bimestre: number;
  semana: number;
  area_curricular: string;
  tema_generador_comun: string;
  categoria_conceptual?: string;
  proposito_comun?: string;
  descripcion_eje_integrador: string;
  actividades_lenguaje?: {
    expresion_oral: string;
    escritura: string;
    lectura: string;
  };
  materiales_didacticos?: string[];`;

content = content.replace(findUnifiedInterface, replaceUnifiedInterface);

// 2. Agregar determineTemaEjeTransversal function
const determineFunctionCode = `
// ============================================================================
// ALGORITMO RAG PARA ENCONTRAR EL "TEMA EJE TRANSVERSAL" Y PROPÓSITO COMÚN
// ============================================================================
export function determineTemaEjeTransversal(
  items: SelectedItemParam[],
  grados: number[],
  areaCurricular: string,
  ciclo: string
) {
  const allMaterias = items.length > 0
    ? items.map(it => it.materia).filter((v, i, a) => a.indexOf(v) === i)
    : [areaCurricular || 'Matemáticas'];

  const allTemasStr = items.map(it => (it.tema || '')).join(' ').toLowerCase();
  const gradosLabel = grados.map(g => \`\${g}.°\`).join(' y ');

  const hasMate = allMaterias.some(m => /mate/i.test(m));
  const hasLenguaje = allMaterias.some(m => /lengua|comunic/i.test(m));
  const hasCiencias = allMaterias.some(m => /ciencia|medio|natural/i.test(m));
  const hasSociales = allMaterias.some(m => /social|ciudad/i.test(m));

  let temaGenerador = '';
  let categoriaConceptual = '';
  let propositoComun = '';
  let descripcionEje = '';

  if (hasCiencias && /salud|higiene|cuerpo|enfermedad|organismo|celula|vida/i.test(allTemasStr)) {
    categoriaConceptual = 'Salud, Higiene y Prevención de Enfermedades';
    temaGenerador = 'Salud e higiene comunitaria: Las enfermedades y el cuidado del cuerpo';
    propositoComun = 'Identificar las principales enfermedades de la comunidad y las formas de atenderlas y aplicar las medidas preventivas que estén a su alcance en su vida personal.';
    descripcionEje = \`Eje Temático Transversal: Los grados \${gradosLabel} abordan la preservación de la salud y prevención de enfermedades, graduando desde la higiene personal y esquema corporal en grados iniciales hasta la estructura biológica y hábitos comunitarios en grados avanzados.\`;
  } else if (hasMate && /posicional|numer|suma|resta|multiplic|fraccion|proporc|conjunto|decimal|calculo/i.test(allTemasStr)) {
    categoriaConceptual = 'Aritmética, Numeración y Razonamiento Lógico';
    temaGenerador = 'El razonamiento numérico, las operaciones y el cálculo en las actividades cotidianas de la comunidad';
    propositoComun = 'Desarrollar la agilidad de cálculo mental, la comprensión del valor posicional de los números y la resolución de situaciones comerciales y cotidianas de la aldea.';
    descripcionEje = \`Eje Temático Transversal: Articulación del razonamiento aritmético para \${gradosLabel} Primaria, conectando el valor relativo de los dígitos y las operaciones matemáticas con el mercado local, cosechas y presupuestos familiares.\`;
  } else if (hasLenguaje && /dialogo|conversacion|oral|comunic|gesto|palabra|lectura/i.test(allTemasStr)) {
    categoriaConceptual = 'Comunicación Dialógica y Tradición Oral';
    temaGenerador = 'La comunicación dialógica, las formas de expresión y el valor de la palabra en la comunidad';
    propositoComun = 'Fortalecer la expresión oral, el respeto en la conversación y la capacidad de comunicar acuerdos en la familia y la escuela.';
    descripcionEje = \`Eje Temático Transversal: Los grados \${gradosLabel} desarrollan habilidades comunicativas a través de diálogos, relatos orales y normas de participación en asambleas de aula.\`;
  } else if (hasSociales) {
    categoriaConceptual = 'Identidad Comunitaria y Convivencia Social';
    temaGenerador = 'Identidad comunitaria, organización social, geografía y convivencia armónica en el aula multigrado';
    propositoComun = 'Reconocer las raíces culturales, el espacio geográfico y las normas de convivencia democrática a través del diálogo.';
    descripcionEje = \`Eje Temático Transversal: Articulación de los saberes cívicos y geográficos para \${gradosLabel} Primaria, contextualizados en las vivencias y necesidades de la aldea.\`;
  } else {
    categoriaConceptual = 'Saberes Integrados y Razonamiento Comunitario';
    temaGenerador = 'Saberes comunitarios, razonamiento lógico y expresión en nuestra escuela multigrado';
    propositoComun = 'Integrar de manera interdisciplinaria el cálculo, la expresión comunicativa y el cuidado del entorno local en proyectos articulados para el aula multigrado.';
    descripcionEje = \`Eje Temático Transversal: Articulación interdisciplinaria de las áreas de estudio para \${gradosLabel} Primaria, contextualizadas en las vivencias locales.\`;
  }

  return {
    temaGenerador,
    categoriaConceptual,
    propositoComun,
    descripcionEje,
    actividadesLenguaje: {
      expresionOral: 'Diálogo de saberes comunitarios matutino, exposición de argumentos y socialización en plenaria.',
      escritura: 'Resolución de incisos y registro de algoritmos, resúmenes y cuadros comparativos en el cuaderno de trabajo.',
      lectura: 'Lectura comprensiva individual y guiada en los libros oficiales del MINEDUC.'
    },
    materialesDidacticos: [
      'Libros de texto oficiales del MINEDUC por grado',
      'Cuadernos de trabajo (cuadriculado y de líneas)',
      'Material concreto: semillas, tapitas, ábacos y billetes didácticos',
      'Papelógrafos, marcadores y tarjetas de autoaprendizaje'
    ]
  };
}
`;

// Insertar determineTemaEjeTransversal antes de generateUnifiedRAGPlan
const genPlanAnchor = `export function generateUnifiedRAGPlan(params: RAGRequestParams): UnifiedWeeklyPlan {`;
content = content.replace(genPlanAnchor, `${determineFunctionCode}\n${genPlanAnchor}`);

// 3. Modificar generateUnifiedRAGPlan para usar determineTemaEjeTransversal
const oldTemaBlock = `  let temaGenerador = '';
  let descripcionEje = '';

  if (hasItems) {
    const rawTemas = items.map(it => it.tema.split(',')[0].replace(/\\(Pág\\..*?\\)/g, '').trim());
    const distinctTemas = rawTemas.filter((v, i, a) => a.indexOf(v) === i);
    temaGenerador = \`Articulación Curricular Multigrado: \${distinctTemas.slice(0, 3).join(' · ')}\`;
    descripcionEje = \`Eje Integrador Multigrado: Articulación didáctica simultánea de \${allMaterias.join(', ')} para los grados \${grados.map(g => \`\${g}.°\`).join(' y ')} Primaria, aplicando las lecciones oficiales y páginas físicas del MINEDUC contextualizadas a la vida comunitaria.\`;
  } else {
    const areaLower = areaCurricular.toLowerCase();
    const isMultiArea = areaLower.includes('todas') || areaLower.includes('integral');
    if (isMultiArea) {
      temaGenerador = 'Saberes comunitarios, razonamiento lógico y expresión en nuestra escuela multigrado';
      descripcionEje = 'Eje Integrador Multigrado: Articulación interdisciplinaria de todas las áreas curriculares (Matemáticas, Comunicación y Lenguaje, Ciencias Naturales / Medio Social y Formación Ciudadana), vinculando las situaciones de la comunidad con los libros oficiales del MINEDUC.';
    } else if (areaLower.includes('social') || areaLower.includes('ciencia')) {
      temaGenerador = 'Ecosistemas comunitarios, conservación de recursos naturales y vida saludable';
      descripcionEje = 'Eje Integrador Multigrado: Los grados exploran los seres vivos y recursos de la comunidad, graduando desde la observación sensorial del entorno (1.°/2.°), ciclos de vida y plantas medicinales (3.°/4.°), hasta relaciones ecológicas y sostenibilidad comunitaria (5.°/6.°).';
    } else if (areaLower.includes('lengua') || areaLower.includes('comunic')) {
      temaGenerador = 'Comprensión lectora, narración comunitaria y producción de textos';
      descripcionEje = 'Eje Integrador Multigrado: Se articulan lecturas sobre historias y saberes de la aldea, graduando desde la expresión oral y descripción (1.°/2.°), estructura de oraciones y párrafos narrativos (3.°/4.°), hasta ensayos breves y argumentación (5.°/6.°).';
    } else {
      temaGenerador = ciclo === 'segundo_ciclo'
        ? 'Resolución de problemas con operaciones aritméticas, fracciones y proporcionalidad en la economía comunitaria'
        : 'Nociones espaciales, conteo con material concreto y adición en situaciones de la vida diaria';
      descripcionEje = ciclo === 'segundo_ciclo'
        ? 'Eje Integrador Multigrado: Los grados abordan situaciones de comercio, cosecha agrícola y cooperativas locales, graduando desde la descomposición posicional (4.°), sumas de fracciones de granos (5.°) hasta regla de tres simple para presupuestos (6.°).'
        : 'Eje Integrador Multigrado: Los grados interactúan con objetos y alimentos del entorno (elotes, naranjas, pupitres) graduando desde relaciones espaciales (1.°), decenas y adición (2.°) hasta multiplicación con arreglos rectangulares (3.°).';
    }
  }`;

const newTemaBlock = `  const ejeResult = determineTemaEjeTransversal(items, grados, areaCurricular, ciclo);
  const temaGenerador = ejeResult.temaGenerador;
  const descripcionEje = ejeResult.descripcionEje;
  const categoriaConceptual = ejeResult.categoriaConceptual;
  const propositoComun = ejeResult.propositoComun;
  const actividadesLenguaje = ejeResult.actividadesLenguaje;
  const materialesDidacticos = ejeResult.materialesDidacticos;`;

content = content.replace(oldTemaBlock, newTemaBlock);

// 4. Actualizar el retorno final de generateUnifiedRAGPlan para incluir los campos del Tema Eje
const oldReturnObj = `  return {
    ciclo,
    grados,
    bimestre,
    semana,
    area_curricular: areaCurricular,
    tema_generador_comun: temaGenerador,
    descripcion_eje_integrador: descripcionEje,
    pilares_multigrado_cnb: diasPlan['Lunes']?.componentes_multigrado,`;

const newReturnObj = `  return {
    ciclo,
    grados,
    bimestre,
    semana,
    area_curricular: areaCurricular,
    tema_generador_comun: temaGenerador,
    categoria_conceptual: categoriaConceptual,
    proposito_comun: propositoComun,
    descripcion_eje_integrador: descripcionEje,
    actividades_lenguaje: actividadesLenguaje,
    materiales_didacticos: materialesDidacticos,
    pilares_multigrado_cnb: diasPlan['Lunes']?.componentes_multigrado,`;

content = content.replace(oldReturnObj, newReturnObj);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('✅ ragEngine.ts actualizado con el algoritmo de Tema Eje Transversal y Propósito Común!');
