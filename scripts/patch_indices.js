const fs = require('fs');
let file = fs.readFileSync('src/utils/indicesLibrosMineduc.ts', 'utf8');

const target = 'const INDICES_REALES = indicesExtraidosRaw';
const idx = file.indexOf(target);
if (idx === -1) {
  console.log('Target not found!');
  process.exit(1);
}

const endFunc = file.indexOf('export function getAsignaturasComplementarias', idx);
const newBlock = `const INDICES_REALES = indicesExtraidosRaw as Record<string, { 
  matematicas?: UnidadIndice[], 
  cnyt?: UnidadIndice[], 
  csyc?: UnidadIndice[], 
  cyl?: UnidadIndice[], 
  medio_social?: UnidadIndice[] 
}>;

export function getMateriasPorGrado(grado: number): MateriaPlanificable[] {
  const baseMaterias = CATALOGO_MATERIAS_GRADO[grado] || CATALOGO_MATERIAS_GRADO[1];
  const gradoKey = String(grado);
  const extra = INDICES_REALES[gradoKey];
  if (!extra) return baseMaterias;

  return baseMaterias.map(m => {
    if (m.id.startsWith('matematicas_') && extra.matematicas && extra.matematicas.length > 0) {
      return { ...m, unidades: extra.matematicas };
    }
    if (m.id.startsWith('ciencias_naturales_') && extra.cnyt && extra.cnyt.length > 0) {
      return { ...m, unidades: extra.cnyt };
    }
    if (m.id.startsWith('ciencias_sociales_') && extra.csyc && extra.csyc.length > 0) {
      return { ...m, unidades: extra.csyc };
    }
    if (m.id.startsWith('comunicacion_') && extra.cyl && extra.cyl.length > 0) {
      return { ...m, unidades: extra.cyl };
    }
    if (m.id.startsWith('medio_social_') && extra.medio_social && extra.medio_social.length > 0) {
      return { ...m, unidades: extra.medio_social };
    }
    return m;
  });
}

`;

file = file.slice(0, idx) + newBlock + file.slice(endFunc);
fs.writeFileSync('src/utils/indicesLibrosMineduc.ts', file, 'utf8');
console.log('Successfully updated indicesLibrosMineduc.ts!');
