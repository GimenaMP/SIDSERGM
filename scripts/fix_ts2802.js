const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/utils/ragEngine.ts');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  `  const allMaterias = hasItems \n    ? [...new Set(items.map(it => it.materia))]\n    : [params.area_curricular || params.area || 'Matemáticas'];`,
  `  const allMaterias = hasItems \n    ? items.map(it => it.materia).filter((v, i, a) => a.indexOf(v) === i)\n    : [params.area_curricular || params.area || 'Matemáticas'];`
);

content = content.replace(
  `  if (hasItems) {\n    const distinctTemas = [...new Set(items.map(it => it.tema.split(',')[0].replace(/\\(Pág\\..*?\\)/g, '').trim()))];`,
  `  if (hasItems) {\n    const rawTemas = items.map(it => it.tema.split(',')[0].replace(/\\(Pág\\..*?\\)/g, '').trim());\n    const distinctTemas = rawTemas.filter((v, i, a) => a.indexOf(v) === i);`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed TS2802 downlevel iteration!');
