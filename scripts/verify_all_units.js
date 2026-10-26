const fs = require('fs');

const extra = JSON.parse(fs.readFileSync('C:/Users/gimen/.gemini/antigravity/scratch/Plataforma_SIDSER/data/catalogo_indices_extraidos.json', 'utf8'));

// Comprobar que todos los grados tienen sus 4 unidades
for (const g of [4, 5, 6]) {
  console.log(`Grado ${g}:`);
  console.log('  CNyT unidades:', extra[g].cnyt.length, 'Total temas:', extra[g].cnyt.reduce((acc, u) => acc + u.temas.length, 0));
  console.log('  CSyC unidades:', extra[g].csyc.length, 'Total temas:', extra[g].csyc.reduce((acc, u) => acc + u.temas.length, 0));
  console.log('  CyL unidades:', extra[g].cyl.length, 'Total temas:', extra[g].cyl.reduce((acc, u) => acc + u.temas.length, 0));
}
