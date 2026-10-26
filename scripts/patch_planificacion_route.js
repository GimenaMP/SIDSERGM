const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/app/api/planificacion/route.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Pasar items a generateUnifiedRAGPlan
const oldBasePlanCall = `    // 1. Plan fáctico base de respaldo garantizado
    const basePlan = generateUnifiedRAGPlan({
      grados: gradosNums,
      bimestre: bloque,
      semana: semana,
      area: area,
      temasRezagados: temasRezagados,
      ciclo: gradosNums.some(g => g <= 3) ? 'primer_ciclo' : 'segundo_ciclo'
    });`;

const newBasePlanCall = `    // 1. Plan fáctico base de respaldo garantizado (Grounded en items seleccionados)
    const basePlan = generateUnifiedRAGPlan({
      grados: gradosNums,
      bimestre: bloque,
      semana: semana,
      area: area,
      temasRezagados: temasRezagados,
      ciclo: gradosNums.some(g => g <= 3) ? 'primer_ciclo' : 'segundo_ciclo',
      items: items
    });`;

content = content.replace(oldBasePlanCall, newBasePlanCall);

// 2. Proteger la fusión de gradosSincronizados para preservar fielmente los items de basePlan
const oldMergeMap = `                gradosSincronizados: (aiDia.gradosSincronizados || []).map((item: any, idx: number) => {
                  const baseItem = baseDia.gradosSincronizados?.[idx] || {};
                  return {
                    ...baseItem,
                    ...item,
                    gradoNumero: item.gradoNumero || baseItem.gradoNumero || gradosNums[idx] || gradosNums[0],
                    materia: item.materia || baseItem.materia || 'Matemáticas',
                    ejerciciosLiterales: Array.isArray(item.ejerciciosLiterales) && item.ejerciciosLiterales.length > 0 
                      ? item.ejerciciosLiterales 
                      : (baseItem.ejerciciosLiterales || [])
                  };
                })`;

const newMergeMap = `                gradosSincronizados: (aiDia.gradosSincronizados || []).map((item: any, idx: number) => {
                  const baseItem = baseDia.gradosSincronizados?.[idx] || {};
                  return {
                    ...baseItem,
                    ...item,
                    gradoNumero: item.gradoNumero || baseItem.gradoNumero || gradosNums[idx] || gradosNums[0],
                    materia: baseItem.materia || item.materia || 'Matemáticas',
                    tema: baseItem.tema || item.tema,
                    libroTitulo: baseItem.libroTitulo || item.libroTitulo,
                    numeroPagina: baseItem.numeroPagina || item.numeroPagina,
                    paginaFin: baseItem.paginaFin || item.paginaFin,
                    seccionLibro: baseItem.seccionLibro || item.seccionLibro,
                    materiasSeleccionadas: baseItem.materiasSeleccionadas || item.materiasSeleccionadas,
                    ejerciciosLiterales: Array.isArray(baseItem.ejerciciosLiterales) && baseItem.ejerciciosLiterales.length > 0
                      ? baseItem.ejerciciosLiterales
                      : (Array.isArray(item.ejerciciosLiterales) && item.ejerciciosLiterales.length > 0 ? item.ejerciciosLiterales : [])
                  };
                })`;

content = content.replace(oldMergeMap, newMergeMap);

fs.writeFileSync(filePath, content, 'utf8');
console.log('src/app/api/planificacion/route.ts patched successfully!');
