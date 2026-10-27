const fs = require('fs');

const cat = JSON.parse(fs.readFileSync('./data/catalogo_indices_extraidos.json', 'utf-8'));

console.log('=== VERIFICACIÓN DE UNIDADES Y COBERTURA ===');

let issues = 0;
const grades = [1, 2, 3, 4, 5, 6];

for (const g of grades) {
  const gKey = String(g);
  const mats = cat[gKey];
  if (!mats) {
    console.warn(`⚠️ FALTA GRADO ${g}!`);
    issues++;
    continue;
  }

  for (const matKey of Object.keys(mats)) {
    const units = mats[matKey];
    if (!units || units.length === 0) {
      console.warn(`⚠️ Materia vacía: Grado ${g} · ${matKey}`);
      issues++;
      continue;
    }

    // Comprobar que existan unidades 1 a 4
    for (let uNum = 1; uNum <= 4; uNum++) {
      const u = units.find(uni => uni.unidad === uNum);
      if (!u) {
        console.warn(`⚠️ FALTA UNIDAD ${uNum} en Grado ${g} · ${matKey}!`);
        issues++;
      } else if (!u.temas || u.temas.length === 0) {
        console.warn(`⚠️ Unidad ${uNum} sin temas en Grado ${g} · ${matKey}!`);
        issues++;
      } else {
        // Verificar que los números de temas sean secuenciales
        u.temas.forEach((t, idx) => {
          if (t.numero !== idx + 1) {
            console.warn(`⚠️ Tema no secuencial en Grado ${g} · ${matKey} · U${uNum}: esperado ${idx + 1}, obtenido ${t.numero}`);
            issues++;
          }
          if (typeof t.paginaInicio !== 'number' || typeof t.paginaFin !== 'number') {
            console.warn(`⚠️ Páginas faltantes en Grado ${g} · ${matKey} · U${uNum} · T${t.numero}`);
            issues++;
          }
        });
      }
    }
  }
}

console.log(`\nVerificación concluida. Total de problemas encontrados: ${issues}`);
