const fs = require('fs');
const mineduc = JSON.parse(fs.readFileSync('./data/mineduc_ejercicios.json', 'utf8'));

console.log('--- 1ER GRADO MATEMÁTICAS PÁGINAS 6-15 ---');
const g1Mate = mineduc.filter(m => m.grado_especifico === 1 && m.materia.toLowerCase().includes('mate'));
console.log('Total g1 mate entries:', g1Mate.length);
g1Mate.filter(m => m.numero_pagina >= 6 && m.numero_pagina <= 16).forEach(m => {
  console.log(`Pág. ${m.numero_pagina}: ${m.enunciado_ejercicio.replace(/\s+/g, ' ').slice(0, 120)}...`);
});

console.log('\n--- 6TO GRADO MATEMÁTICAS PÁGINAS 6-15 ---');
const g6Mate = mineduc.filter(m => m.grado_especifico === 6 && m.materia.toLowerCase().includes('mate'));
console.log('Total g6 mate entries:', g6Mate.length);
g6Mate.filter(m => m.numero_pagina >= 6 && m.numero_pagina <= 16).forEach(m => {
  console.log(`Pág. ${m.numero_pagina}: ${m.enunciado_ejercicio.replace(/\s+/g, ' ').slice(0, 120)}...`);
});
