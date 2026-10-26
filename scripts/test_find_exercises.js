const fs = require('fs');
const mineducDatabase = JSON.parse(fs.readFileSync('./data/mineduc_ejercicios.json', 'utf8'));

function findExercisesInMineduc(grado, materia, pagInicio, pagFin, tema) {
  const matLower = materia.toLowerCase();
  const matches = mineducDatabase.filter(m => {
    const gMatch = m.grado_especifico === grado;
    const pMatch = m.numero_pagina >= pagInicio && m.numero_pagina <= pagFin;
    if (!gMatch || !pMatch) return false;
    const itemMat = (m.materia || '').toLowerCase();
    if (matLower.includes('ciencia') || matLower.includes('natural')) {
      return itemMat.includes('ciencia') || itemMat.includes('natural') || itemMat.includes('medio');
    }
    if (matLower.includes('social')) {
      return itemMat.includes('social') || itemMat.includes('ciudad');
    }
    if (matLower.includes('lengua') || matLower.includes('comunic')) {
      return itemMat.includes('lengua') || itemMat.includes('comunic');
    }
    if (matLower.includes('mate')) {
      return itemMat.includes('mate');
    }
    return true;
  });

  if (matches.length > 0) {
    const list = [];
    for (const m of matches) {
      if (m.enunciado_ejercicio && m.enunciado_ejercicio.trim().length > 15) {
        const clean = m.enunciado_ejercicio.replace(/\s+/g, ' ').trim();
        list.push(`Pág. ${m.numero_pagina}: ${clean.slice(0, 300)}`);
      }
    }
    if (list.length > 0) return list;
  }

  return [
    `Pág. ${pagInicio}: Realizar la lectura y análisis conceptual de "${tema || materia}" en el libro de texto oficial.`,
    `Págs. ${pagInicio}-${pagFin}: Resolver los ejercicios, actividades de aplicación y esquemas en el cuaderno de trabajo según las orientaciones del MINEDUC.`
  ];
}

console.log('5.° Grado Ciencias (Págs 13-15):');
console.log(findExercisesInMineduc(5, 'Ciencias Naturales y Tecnología', 13, 15, 'La célula'));

console.log('6.° Grado Ciencias (Págs 61-63):');
console.log(findExercisesInMineduc(6, 'Ciencias Naturales y Tecnología', 61, 63, 'Características sexuales'));

console.log('4.° Grado Matemáticas (Págs 10-12):');
console.log(findExercisesInMineduc(4, 'Matemáticas', 10, 12, 'Lectura y escritura de números'));
