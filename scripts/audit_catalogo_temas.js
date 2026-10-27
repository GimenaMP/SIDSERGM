const fs = require('fs');

const cat = JSON.parse(fs.readFileSync('./data/catalogo_indices_extraidos.json', 'utf-8'));

const bad = [];
let totalTemas = 0;

for (const g of Object.keys(cat)) {
  for (const mat of Object.keys(cat[g])) {
    const units = cat[g][mat];
    units.forEach((u, uIdx) => {
      u.temas.forEach((t) => {
        totalTemas++;
        const tit = (t.titulo || '').trim();
        let motivo = '';

        if (/^(\d+\.\s*(observo|sumo|resto|escribo|agrupo|pinto|formo|compro|cuatro|resuelvo|calculo|leo|uno|copio|dibujo|completo|multiplico|divido|estimo|trazo|encuentre|marco|ordeno|doble|hallar))/i.test(tit)) {
          motivo = 'Es una instrucción o ejercicio aislado (1. Sumo, 1. Observo, etc.)';
        } else if (/^(\d+\.?\d*\s*[x÷\+\=\:\-]|0\.\d+|1\.\d+|2\.\d+|3\.\d+|4\.\d+|5\.\d+|7\.\d+|8\.\d+|9\.\d+|13\.\d+|14\.\d+|19\.\d+|20\.\d+|32\.\d+|50\.\d+|90\.\d+)/i.test(tit)) {
          motivo = 'Fragmento matemático o cálculo raspado';
        } else if (/^(tema\s*\d+\s*•\s*sesi[oó]n\s*\d+\s*\(p[aá]g|unidad\s*\d+\s*•\s*tema\s*\d+\s*•\s*sesi[oó]n\s*\d+\s*\(p[aá]g)/i.test(tit)) {
          motivo = 'Falta el nombre del tema (solo dice Unidad/Tema/Sesión)';
        } else if (/\([0-9]+\s*unidad/i.test(tit) || /\([0-9]+\s*números/i.test(tit)) {
          motivo = 'Contiene texto de cabecera raspado por error entre paréntesis';
        } else if (/^(actividad de cierre|actividades adicionales|evaluación diagnóstica|evaluación|evaluación de proyecto|evaluación del proyecto|autoevaluación|proyecto\s+[a-z]+|proyectos\s+[a-z]+)/i.test(tit)) {
          motivo = 'Es una actividad de cierre o proyecto editorial, no un tema de contenido';
        } else if (tit.length < 4) {
          motivo = 'Título demasiado corto o vacío';
        } else if (/\(p[aá]gs?\.?\s*\d+/i.test(tit)) {
          motivo = 'Conserva número de página redundante en el título';
        }

        if (motivo) {
          bad.push({ g, mat, u: uIdx + 1, num: t.numero, pag: t.paginaInicio, tit, motivo });
        }
      });
    });
  }
}

console.log(`======================================================================`);
console.log(`AUDITORÍA FINAL DEL CATÁLOGO DE TEMAS DE SELECCIÓN (MINEDUC)`);
console.log(`Total temas analizados en catálogo: ${totalTemas}`);
console.log(`Total anomalías / no-temas detectados: ${bad.length}`);
console.log(`======================================================================`);

if (bad.length > 0) {
  const porMotivo = {};
  bad.forEach(b => { porMotivo[b.motivo] = (porMotivo[b.motivo] || 0) + 1; });
  console.table(porMotivo);
  console.log('\nMuestra de anomalías detectadas:');
  bad.slice(0, 30).forEach(b => {
    console.log(`[G${b.g} · ${b.mat.toUpperCase()} · U${b.u} · Pág. ${b.pag}] "${b.tit}" -> ${b.motivo}`);
  });
} else {
  console.log('🎉 AUDITORÍA APROBADA: 0 anomalías encontradas. Todos los temas son temas curriculares reales.');
}
