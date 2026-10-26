const { getMateriasPorGrado } = require('../src/utils/indicesLibrosMineduc');

const m1 = getMateriasPorGrado(1).find(m => m.id.startsWith('matematicas'));
console.log('Matematicas 1:', JSON.stringify(m1, null, 2));

const m6 = getMateriasPorGrado(6).find(m => m.id.startsWith('matematicas'));
console.log('Matematicas 6:', JSON.stringify(m6, null, 2));
