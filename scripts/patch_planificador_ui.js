const fs = require('fs');
let code = fs.readFileSync('src/components/profesor/PlanificadorOficialMineduc.tsx', 'utf8');

// 1. Update getColumnasEstructuradas
const oldColsTarget = `    return [
      {
        id: 'col_1',
        habilidadHeader: \`\${mat1Nombre}: Modelado Conceptual Inicial\`,
        habilidadSub: 'Atención Directa Docente y Activación CNB',
        tiempo: 'Aprox. 50 minutos',
        grupoHeader: \`TODOS GRUPO A (\${gradosText}) · \${mat1Nombre}\`,
        materiaBase: mat1?.idBase || 'mate'
      },
      {
        id: 'col_2',
        habilidadHeader: \`\${mat1Nombre}: Práctica y Algoritmo Guiado\`,
        habilidadSub: 'Inversión de Roles y Trabajo Autónomo en Cuaderno',
        tiempo: 'Aprox. 45 minutos',
        grupoHeader: 'CADA GRADO (Trabajo Autónomo y Rotación)',
        materiaBase: mat1?.idBase || 'mate'
      },
      {
        id: 'col_3',
        habilidadHeader: \`\${mat2Nombre}: Indagación y Aplicación Contextual\`,
        habilidadSub: 'Observación, Esquemas y Diálogo Comunitario',
        tiempo: 'Aprox. 45 minutos',
        grupoHeader: \`TODOS GRUPO B (\${gradosText}) · \${mat2Nombre}\`,
        materiaBase: mat2?.idBase || 'ciencias'
      },
      {
        id: 'col_4',
        habilidadHeader: 'Rincones de Aprendizaje / Experimentos',
        habilidadSub: 'Tutoría entre Pares y Trabajo Cooperativo',
        tiempo: 'Aprox. 40 minutos',
        grupoHeader: 'CADA GRUPO (Manipulación Concreta)',
        materiaBase: 'rincones'
      },
      {
        id: 'col_5',
        habilidadHeader: 'Libros Oficiales MINEDUC y Consolidación',
        habilidadSub: 'Ejercicios Fácticos por Grado y Tarea en Casa',
        tiempo: 'Aprox. 30 minutos',
        grupoHeader: 'CADA GRADO (Páginas Oficiales MINEDUC)',
        materiaBase: 'fijacion'
      }
    ];`;

const newColsReplacement = `    return [
      {
        id: 'col_1',
        habilidadHeader: \`Bloque Fundamental (60%): \${mat1Nombre}\`,
        habilidadSub: '08:15 - 09:05 h (50 min) · Modelado en Pizarra y Atención Directa',
        tiempo: '08:15 – 09:05 h',
        grupoHeader: \`GRUPO A (\${gradosText}) · ATENCIÓN DIRECTA\`,
        materiaBase: mat1?.idBase || 'mate'
      },
      {
        id: 'col_2',
        habilidadHeader: \`Bloque Fundamental (60%): Inversión y Práctica\`,
        habilidadSub: '09:05 - 09:55 h (50 min) · Rotación a Grupo B / Trabajo Autónomo',
        tiempo: '09:05 – 09:55 h',
        grupoHeader: \`GRUPO B (\${gradosText}) · ROTACIÓN Y LIBRO\`,
        materiaBase: mat1?.idBase || 'mate'
      },
      {
        id: 'col_3',
        habilidadHeader: \`Bloque Formativo (40%): \${mat2Nombre}\`,
        habilidadSub: '10:30 - 11:15 h (45 min) · Indagación y Aplicación Contextual',
        tiempo: '10:30 – 11:15 h',
        grupoHeader: \`TODOS LOS GRADOS · TEMA EJE TRANSVERSAL\`,
        materiaBase: mat2?.idBase || 'ciencias'
      },
      {
        id: 'col_4',
        habilidadHeader: 'Rincones de Aprendizaje / Experimentos',
        habilidadSub: '11:15 - 11:50 h (35 min) · Tutoría entre Pares y Cuaderno',
        tiempo: '11:15 – 11:50 h',
        grupoHeader: 'GRUPOS MIXTOS (Manipulación Concreta)',
        materiaBase: 'rincones'
      },
      {
        id: 'col_5',
        habilidadHeader: 'Libro Oficial MINEDUC (1 Pág/Día) y Tarea',
        habilidadSub: '1 Sesión Diaria por Página Física y Ejercicios Literales',
        tiempo: 'Sesión Diaria',
        grupoHeader: 'CADA GRADO (Página Física Exacta)',
        materiaBase: 'fijacion'
      }
    ];`;

if (code.includes(oldColsTarget)) {
  code = code.replace(oldColsTarget, newColsReplacement);
  console.log('Updated getColumnasEstructuradas');
} else {
  console.log('Warning: could not find oldColsTarget');
}

// 2. Add visual schedule banner above the table
const bannerTarget = `{/* BANNER RESERVA CNB */}`;
const scheduleBanner = `{/* FRANJA NORMATIVA HORARIA MINEDUC (60/40) */}
              <div className="bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border-2 border-sky-300 rounded-2xl p-3.5 shadow-sm text-xs">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-[#005B94] text-white font-black px-2.5 py-0.5 rounded-lg text-[10px] uppercase tracking-wide">
                      Jornada Matutina Oficial (08:00 - 12:00 h)
                    </span>
                    <span className="font-extrabold text-[#004F7A]">
                      Ponderación Curricular CNB: 60% Áreas Fundamentales · 40% Áreas Formativas / Integradas
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-sky-200 shadow-2xs">
                    210 min efectivos de clase
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mt-2.5 pt-2 border-t border-sky-200 text-[10px]">
                  <div className="bg-white p-2 rounded-lg border border-sky-100 shadow-2xs">
                    <span className="font-black text-[#005B94] block">08:00 - 08:15 (15 min)</span>
                    <span className="text-slate-600 font-medium">Diálogo de Saberes Comunitario (Inicio Común)</span>
                  </div>
                  <div className="bg-sky-100/80 p-2 rounded-lg border border-sky-300 shadow-2xs">
                    <span className="font-black text-sky-950 block">08:15 - 09:55 (100 min · 60%)</span>
                    <span className="text-sky-900 font-bold">Bloque Fundamental: Matemáticas / Lenguaje L1 (Atención Alternada)</span>
                  </div>
                  <div className="bg-amber-100 p-2 rounded-lg border border-amber-300 shadow-2xs">
                    <span className="font-black text-amber-950 block">10:00 - 10:30 (30 min)</span>
                    <span className="text-amber-900 font-black">🔔 RECESO ESCOLAR LIBRE</span>
                  </div>
                  <div className="bg-indigo-50 p-2 rounded-lg border border-indigo-200 shadow-2xs">
                    <span className="font-black text-indigo-950 block">10:30 - 11:50 (80 min · 40%)</span>
                    <span className="text-indigo-900 font-bold">Bloque Formativo / Aplicado: Ciencias y Entorno</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-sky-100 shadow-2xs">
                    <span className="font-black text-[#005B94] block">11:50 - 12:00 (10 min)</span>
                    <span className="text-slate-600 font-medium">Cierre Común y Gobierno Escolar</span>
                  </div>
                </div>
              </div>

              {/* BANNER RESERVA CNB */}`;

if (code.includes(bannerTarget)) {
  code = code.replace(bannerTarget, scheduleBanner);
  console.log('Added scheduleBanner');
} else {
  console.log('Warning: could not find bannerTarget');
}

fs.writeFileSync('src/components/profesor/PlanificadorOficialMineduc.tsx', code, 'utf8');
console.log('Successfully saved PlanificadorOficialMineduc.tsx!');
