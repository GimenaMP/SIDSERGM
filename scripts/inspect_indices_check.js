const { getMateriasPorGrado } = require('../src/utils/indicesLibrosMineduc');

console.log("Grado 1:", getMateriasPorGrado(1).map(m => ({ id: m.id, nombre: m.nombre, u1Temas: m.unidades[0]?.temas.slice(0, 3) })));
console.log("Grado 6:", getMateriasPorGrado(6).map(m => ({ id: m.id, nombre: m.nombre, u1Temas: m.unidades[0]?.temas.slice(0, 3) })));
