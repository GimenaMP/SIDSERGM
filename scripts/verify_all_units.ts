import { getMateriasPorGrado } from '../src/utils/indicesLibrosMineduc';

console.log('=== AUDITORÍA COMPLETA DE UNIDADES (1 A 4) EN TODOS LOS GRADOS ===');

const grades = [1, 2, 3, 4, 5, 6];
const units = [1, 2, 3, 4];

let issues = 0;

for (const g of grades) {
  const mats = getMateriasPorGrado(g);
  console.log(`\n--- GRADO ${g}.° PRIMARIA (${mats.length} materias) ---`);

  for (const mat of mats) {
    console.log(`  Materia: ${mat.nombre} (ID: ${mat.id}) - Unidades disponibles: ${mat.unidades.length}`);
    for (const uNum of units) {
      const u = mat.unidades.find(uni => uni.unidad === uNum);
      if (!u) {
        console.warn(`    ⚠️ FALTA UNIDAD ${uNum} en ${mat.nombre} (${g}.° Grado)!`);
        issues++;
      } else {
        const temasCount = (u.temas || []).length;
        if (temasCount === 0) {
          console.warn(`    ⚠️ UNIDAD ${uNum} de ${mat.nombre} (${g}.° Grado) tiene 0 TEMAS!`);
          issues++;
        } else {
          // Chequear si algún tema no tiene paginaInicio
          const missingPag = u.temas.filter(t => t.paginaInicio === undefined || t.paginaFin === undefined);
          if (missingPag.length > 0) {
            console.warn(`    ⚠️ UNIDAD ${uNum} de ${mat.nombre} tiene temas sin paginaInicio/Fin!`);
            issues++;
          }
        }
      }
    }
  }
}

console.log(`\nTotal de problemas encontrados: ${issues}`);
