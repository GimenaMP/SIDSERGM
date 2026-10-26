const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/components/profesor/PlanificadorOficialMineduc.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Safe temas en handleGenerarPlan (línea ~345)
const oldHandleGen = `        // Obtener todos los temas seleccionados simultáneamente
        const selectedTemasObj = uni.temas.filter(t => cfg.selectedTemaNums.includes(t.numero));
        const activeTemas = selectedTemasObj.length > 0 ? selectedTemasObj : [uni.temas[0]];

        const minPag = Math.min(...activeTemas.map(t => t.paginaInicio));
        const maxPag = Math.max(...activeTemas.map(t => t.paginaFin));
        const titulosTemas = activeTemas.map(t => t.titulo).join(', ');`;

const newHandleGen = `        // Obtener todos los temas seleccionados simultáneamente con fallback seguro
        const safeTemas = (uni?.temas || []).filter(Boolean);
        const selectedTemasObj = safeTemas.filter(t => cfg.selectedTemaNums.includes(t.numero));
        const activeTemas = selectedTemasObj.length > 0 
          ? selectedTemasObj 
          : (safeTemas.length > 0 
              ? [safeTemas[0]] 
              : [{ numero: 1, titulo: uni?.titulo || 'Tema 1', paginaInicio: uni?.paginaInicio || 8, paginaFin: uni?.paginaFin || 20 }]);

        const minPag = activeTemas.length > 0 ? Math.min(...activeTemas.map(t => t.paginaInicio)) : (uni?.paginaInicio || 8);
        const maxPag = activeTemas.length > 0 ? Math.max(...activeTemas.map(t => t.paginaFin)) : (uni?.paginaFin || 20);
        const titulosTemas = activeTemas.map(t => t.titulo).join(', ');`;

content = content.replace(oldHandleGen, newHandleGen);

// 2. Safe temas en render de la tabla de cotejo (línea ~570)
const oldTableCotejo = `                        const selectedTemasObj = uni.temas.filter(t => cfg.selectedTemaNums.includes(t.numero));
                        const activeTemas = selectedTemasObj.length > 0 ? selectedTemasObj : [uni.temas[0]];
                        const minPag = Math.min(...activeTemas.map(t => t.paginaInicio));
                        const maxPag = Math.max(...activeTemas.map(t => t.paginaFin));
                        const allSelected = uni.temas.every(t => cfg.selectedTemaNums.includes(t.numero));`;

const newTableCotejo = `                        const safeTemas = (uni?.temas || []).filter(Boolean);
                        const selectedTemasObj = safeTemas.filter(t => cfg.selectedTemaNums.includes(t.numero));
                        const activeTemas = selectedTemasObj.length > 0 
                          ? selectedTemasObj 
                          : (safeTemas.length > 0 
                              ? [safeTemas[0]] 
                              : [{ numero: 1, titulo: uni?.titulo || 'Tema 1', paginaInicio: uni?.paginaInicio || 8, paginaFin: uni?.paginaFin || 20 }]);
                        const minPag = activeTemas.length > 0 ? Math.min(...activeTemas.map(t => t.paginaInicio)) : (uni?.paginaInicio || 8);
                        const maxPag = activeTemas.length > 0 ? Math.max(...activeTemas.map(t => t.paginaFin)) : (uni?.paginaFin || 20);
                        const allSelected = safeTemas.length > 0 && safeTemas.every(t => cfg.selectedTemaNums.includes(t.numero));`;

content = content.replace(oldTableCotejo, newTableCotejo);

// 3. Safe temas en resumen de materias planificadas (línea ~865)
const oldResumen = `                        const activeTemas = uni.temas.filter(t => cfg.selectedTemaNums.includes(t.numero));
                        const temasStr = activeTemas.map(t => t.titulo.split(' (Pág.')[0]).join(', ');
                        const minPag = Math.min(...activeTemas.map(t => t.paginaInicio));
                        const maxPag = Math.max(...activeTemas.map(t => t.paginaFin));`;

const newResumen = `                        const safeTemas = (uni?.temas || []).filter(Boolean);
                        const activeTemas = safeTemas.filter(t => cfg.selectedTemaNums.includes(t.numero));
                        const safeActive = activeTemas.length > 0 ? activeTemas : safeTemas.slice(0, 1);
                        const temasStr = safeActive.map(t => t.titulo.split(' (Pág.')[0]).join(', ');
                        const minPag = safeActive.length > 0 ? Math.min(...safeActive.map(t => t.paginaInicio)) : (uni?.paginaInicio || 8);
                        const maxPag = safeActive.length > 0 ? Math.max(...safeActive.map(t => t.paginaFin)) : (uni?.paginaFin || 20);`;

content = content.replace(oldResumen, newResumen);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('✅ PlanificadorOficialMineduc.tsx protegido contra undefined en todas las unidades y temas!');
