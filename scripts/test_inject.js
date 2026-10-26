const fs = require('fs');

const extra = JSON.parse(fs.readFileSync('C:/Users/gimen/.gemini/antigravity/scratch/Plataforma_SIDSER/data/catalogo_indices_extraidos.json', 'utf8'));
const filePath = 'C:/Users/gimen/.gemini/antigravity/scratch/Plataforma_SIDSER/src/utils/indicesLibrosMineduc.ts';
let code = fs.readFileSync(filePath, 'utf8');

// Añadir una función de enriquecimiento dinámico al final de indicesLibrosMineduc.ts
// O inyectar el catálogo extraído para que getMateriasPorGrado devuelva los índices exactos del libro
const injection = `
// ============================================================================
// RF-INDICES: ÍNDICES FÁCTICOS EXTRAÍDOS DE LOS LIBROS OFICIALES MINEDUC (4.°, 5.°, 6.°)
// ============================================================================
import indicesExtraidosRaw from '../../../data/catalogo_indices_extraidos.json';

const INDICES_REALES = indicesExtraidosRaw as Record<string, { cnyt: UnidadIndice[], csyc: UnidadIndice[], cyl: UnidadIndice[] }>;

export function getMateriasPorGradoEnriquecidas(grado: number): MateriaPlanificable[] {
  const baseMaterias = CATALOGO_MATERIAS_GRADO[grado] || CATALOGO_MATERIAS_GRADO[1];
  const gradoKey = String(grado);
  const extra = INDICES_REALES[gradoKey];
  if (!extra) return baseMaterias;

  return baseMaterias.map(m => {
    // Si es Ciencias Naturales
    if (m.id.startsWith('ciencias_naturales_') && extra.cnyt) {
      return { ...m, unidades: extra.cnyt };
    }
    // Si es Ciencias Sociales
    if (m.id.startsWith('ciencias_sociales_') && extra.csyc) {
      return { ...m, unidades: extra.csyc };
    }
    // Si es Comunicación y Lenguaje de 4, 5 o 6
    if (m.id.startsWith('comunicacion_') && extra.cyl) {
      return { ...m, unidades: extra.cyl };
    }
    return m;
  });
}
`;

console.log('Estrategia de enriquecimiento lista.');
