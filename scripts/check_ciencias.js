const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./data/mineduc_ejercicios.json', 'utf8'));

const p13 = data.find(d => d.grado_especifico === 5 && d.materia.includes('Ciencia') && d.numero_pagina === 13);
console.log('P13 Ciencias 5:', p13 ? p13.enunciado_ejercicio.slice(0, 300) : 'Not found');

const p61 = data.find(d => d.grado_especifico === 6 && d.materia.includes('Ciencia') && d.numero_pagina === 61);
console.log('P61 Ciencias 6:', p61 ? p61.enunciado_ejercicio.slice(0, 300) : 'Not found');
