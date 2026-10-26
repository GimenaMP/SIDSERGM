const path = require('path');
const { getMateriasPorGrado } = require('../src/utils/indicesLibrosMineduc');

function calculateQuota(materiaNombre, periodosSemanales) {
  const matLower = materiaNombre.toLowerCase();
  if (matLower.includes('mate')) {
    return 2; // 5 periodos semanales -> 2 temas
  } else if (matLower.includes('comunic') || matLower.includes('lengua')) {
    return 2; // 4 periodos semanales -> 2 temas
  } else if (matLower.includes('medio') || matLower.includes('natural') || matLower.includes('social')) {
    return 1; // 3 periodos semanales -> 1 tema
  }
  return 1;
}

[1, 5, 6].forEach(g => {
  console.log(`\n================ GRADO ${g}.° PRIMARIA ================`);
  const mats = getMateriasPorGrado(g);
  mats.forEach(m => {
    const quota = calculateQuota(m.nombre, m.periodosSemanales);
    const u1 = m.unidades[0];
    const selectedTemas = u1 ? u1.temas.slice(0, quota) : [];
    const minPag = selectedTemas.length > 0 ? Math.min(...selectedTemas.map(t => t.paginaInicio)) : 0;
    const maxPag = selectedTemas.length > 0 ? Math.max(...selectedTemas.map(t => t.paginaFin)) : 0;
    console.log(`[${m.nombre}] Cuota: ${quota} tema(s) / sem. | Seleccionados: ${selectedTemas.map(t => t.titulo).join(' + ')} | Págs: ${minPag}-${maxPag}`);
  });
});
