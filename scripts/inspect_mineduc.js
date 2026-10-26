const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./data/mineduc_ejercicios.json', 'utf8'));
console.log('Total mineduc entries:', data.length);
console.log('Sample:', JSON.stringify(data.slice(0, 2), null, 2));

// Check what materias and grados exist
const grados = [...new Set(data.map(d => d.grado_especifico))];
console.log('Grados in mineduc:', grados);
const materias = [...new Set(data.map(d => d.materia))];
console.log('Materias in mineduc:', materias);
