const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/utils/ragEngine.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Replace getSubtemaForDay
const oldSubtemaFunc = /export function getSubtemaForDay\([\s\S]*?return \{ titulo: mainItem\.tema, pagina: pDia \};\s*\}/;

const newSubtemaFunc = `export function getSubtemaForDay(
  dia: DiaSemana,
  mainItem: SelectedItemParam
): { titulo: string; pagina: number } {
  const pInicio = mainItem.paginaInicio || 8;

  if (mainItem.temasSeleccionados && mainItem.temasSeleccionados.length > 0) {
    const list = mainItem.temasSeleccionados;
    
    // CASO 1: 4 o más subtemas (1 subtema y 1 página física real exclusiva para cada día)
    if (list.length >= 4) {
      const idx = dia === 'Lunes' ? 0 : dia === 'Martes' ? 1 : dia === 'Miércoles' ? 2 : 3;
      const item = list[idx] || list[list.length - 1];
      return { titulo: item.titulo, pagina: item.paginaInicio };
    }

    // CASO 2: 3 subtemas (Lunes, Martes, Miércoles con subtema propio; Jueves con página consecutiva de síntesis)
    if (list.length === 3) {
      if (dia === 'Lunes') return { titulo: list[0].titulo, pagina: list[0].paginaInicio };
      if (dia === 'Martes') return { titulo: list[1].titulo, pagina: list[1].paginaInicio };
      if (dia === 'Miércoles') return { titulo: list[2].titulo, pagina: list[2].paginaInicio };
      const pagJueves = list[2].paginaFin > list[2].paginaInicio ? list[2].paginaFin : (list[2].paginaInicio + 1);
      return { titulo: \`\${list[2].titulo} (Consolidación y Síntesis)\`, pagina: pagJueves };
    }

    // CASO 3: 2 subtemas (Subtema 1 en Lunes/Martes con páginas consecutivas; Subtema 2 en Miércoles/Jueves con páginas consecutivas)
    if (list.length === 2) {
      if (dia === 'Lunes') {
        return { titulo: \`\${list[0].titulo} (Saberes Previos y Modelado)\`, pagina: list[0].paginaInicio };
      }
      if (dia === 'Martes') {
        const pagM = list[0].paginaFin > list[0].paginaInicio ? list[0].paginaFin : (list[0].paginaInicio + 1);
        return { titulo: \`\${list[0].titulo} (Comprensión y Algoritmo)\`, pagina: pagM };
      }
      if (dia === 'Miércoles') {
        return { titulo: \`\${list[1].titulo} (Práctica Autónoma)\`, pagina: list[1].paginaInicio };
      }
      if (dia === 'Jueves') {
        const pagJ = list[1].paginaFin > list[1].paginaInicio ? list[1].paginaFin : (list[1].paginaInicio + 1);
        return { titulo: \`\${list[1].titulo} (Consolidación y Repaso)\`, pagina: pagJ };
      }
    }

    // CASO 4: 1 subtema seleccionado (Desglose en 4 páginas físicas consecutivas de Lunes a Jueves)
    const t = list[0];
    const baseP = t.paginaInicio || pInicio;
    const offset = dia === 'Lunes' ? 0 : dia === 'Martes' ? 1 : dia === 'Miércoles' ? 2 : 3;
    const pagFinal = baseP + offset;
    const fases: Record<DiaSemana, string> = {
      'Lunes': 'Sesión 1: Exploración y Saberes Previos',
      'Martes': 'Sesión 2: Modelado y Algoritmo',
      'Miércoles': 'Sesión 3: Práctica Autónoma Intensiva',
      'Jueves': 'Sesión 4: Consolidación y Síntesis'
    };
    return {
      titulo: \`\${t.titulo.replace(/\\s*\\(Pág\\..*?\\)/i, '')} · \${fases[dia]} (Pág. \${pagFinal})\`,
      pagina: pagFinal
    };
  }

  // Fallback si no hay array de temasSeleccionados
  const offset = dia === 'Lunes' ? 0 : dia === 'Martes' ? 1 : dia === 'Miércoles' ? 2 : 3;
  const pag = pInicio + offset;
  const fases: Record<DiaSemana, string> = {
    'Lunes': 'Sesión 1: Exploración y Modelado',
    'Martes': 'Sesión 2: Comprensión y Algoritmo',
    'Miércoles': 'Sesión 3: Práctica en Cuaderno',
    'Jueves': 'Sesión 4: Consolidación y Síntesis'
  };
  return {
    titulo: \`\${mainItem.tema || 'Contenido Curricular'} · \${fases[dia]} (Pág. \${pag})\`,
    pagina: pag
  };
}`;

if (!oldSubtemaFunc.test(content)) {
  console.error('Regex oldSubtemaFunc did not match!');
  process.exit(1);
}

content = content.replace(oldSubtemaFunc, newSubtemaFunc);

// 2. Replace matSeleccionadasDetalle to compute subtema and page dynamically by day
const oldMatDetalleBlock = `        const matSeleccionadasDetalle: MateriaSeleccionadaDetalle[] = itemsG.map(it => {
          const matEjercicios = findExercisesInMineduc(g, it.materia, it.paginaInicio, it.paginaFin, it.tema);
          return {
            materia: it.materia,
            tema: it.tema,
            libroTitulo: it.libroTitulo,
            unidad: it.unidad,
            paginaInicio: it.paginaInicio,
            paginaFin: it.paginaFin,
            competencias: it.competencias || [],
            indicadores: it.indicadores || [],
            ejerciciosLiterales: matEjercicios
          };
        });`;

const newMatDetalleBlock = `        const matSeleccionadasDetalle: MateriaSeleccionadaDetalle[] = itemsG.map(it => {
          const subDia = getSubtemaForDay(dia, it);
          const matEjercicios = findExercisesInMineduc(g, it.materia, subDia.pagina, subDia.pagina, subDia.titulo);
          return {
            materia: it.materia,
            tema: subDia.titulo,
            libroTitulo: it.libroTitulo,
            unidad: it.unidad,
            paginaInicio: subDia.pagina,
            paginaFin: subDia.pagina,
            competencias: it.competencias || [],
            indicadores: it.indicadores || [],
            ejerciciosLiterales: matEjercicios
          };
        });`;

if (!content.includes(oldMatDetalleBlock)) {
  console.error('oldMatDetalleBlock not found!');
  process.exit(1);
}

content = content.replace(oldMatDetalleBlock, newMatDetalleBlock);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✓ Successfully patched ragEngine.ts with consecutive daily pages for all subjects!');
