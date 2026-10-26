const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/utils/ragEngine.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Añadir SelectedItemParam y actualizar GradeSchedule
const oldInterfaceGradeSchedule = `export interface GradeSchedule {
  grado: string;
  gradoNumero?: number;
  bloque: string;
  duracionTotal: string;
  materia: string;
  tema: string;
  modalidad?: 'Atención Directa Docente' | 'Trabajo Autónomo con Guía' | 'Trabajo Cooperativo / Práctica';
  actividadDocente?: string;
  actividadEstudiante?: string;
  periodo1_actividad?: string; // 08:15 - 09:05
  periodo2_actividad?: string; // 09:05 - 09:55 (Inversión de roles)
  periodo3_actividad?: string; // 10:30 - 11:15 (Aplicación/indagación)
  periodo4_actividad?: string; // 11:15 - 11:50 (Práctica autónoma)
  cnbCompetencia: string;
  cnbIndicador: string;
  libroTitulo: string;
  numeroPagina: number;
  seccionLibro: string;
  tiemposReferencia: TimeAllocation[];
  ejerciciosLiterales: string[];
  tareaCasa: string;
  completado: boolean;
  esTemaRezagado?: boolean;
}`;

const newInterfaceGradeSchedule = `export interface SelectedItemParam {
  grado: number;
  materia: string;
  materiaId?: string;
  materiaBase?: string;
  libroTitulo: string;
  unidad: number;
  unidadTitulo: string;
  tema: string;
  temaNumero: number;
  todosLosTemasNumeros?: number[];
  paginaInicio: number;
  paginaFin: number;
  competencias?: string[];
  indicadores?: string[];
  periodosSemanales?: number;
  pesoPorcentaje?: number;
}

export interface MateriaSeleccionadaDetalle {
  materia: string;
  tema: string;
  libroTitulo: string;
  unidad: number;
  paginaInicio: number;
  paginaFin: number;
  competencias: string[];
  indicadores: string[];
  ejerciciosLiterales: string[];
}

export interface GradeSchedule {
  grado: string;
  gradoNumero?: number;
  bloque: string;
  duracionTotal: string;
  materia: string;
  tema: string;
  modalidad?: 'Atención Directa Docente' | 'Trabajo Autónomo con Guía' | 'Trabajo Cooperativo / Práctica';
  actividadDocente?: string;
  actividadEstudiante?: string;
  periodo1_actividad?: string; // 08:15 - 09:05
  periodo2_actividad?: string; // 09:05 - 09:55 (Inversión de roles)
  periodo3_actividad?: string; // 10:30 - 11:15 (Aplicación/indagación)
  periodo4_actividad?: string; // 11:15 - 11:50 (Práctica autónoma)
  cnbCompetencia: string;
  cnbIndicador: string;
  libroTitulo: string;
  numeroPagina: number;
  paginaFin?: number;
  seccionLibro: string;
  tiemposReferencia: TimeAllocation[];
  ejerciciosLiterales: string[];
  tareaCasa: string;
  completado: boolean;
  esTemaRezagado?: boolean;
  materiasSeleccionadas?: MateriaSeleccionadaDetalle[];
}`;

content = content.replace(oldInterfaceGradeSchedule, newInterfaceGradeSchedule);

// 2. Actualizar RAGRequestParams para incluir items?: SelectedItemParam[];
content = content.replace(
  '  diaSeleccionado?: DiaSemana;\n}',
  '  diaSeleccionado?: DiaSemana;\n  items?: SelectedItemParam[];\n}'
);

// 3. Añadir función findExercisesInMineduc
const findExercisesCode = `
// Búsqueda de ejercicios literales fácticos en la base de datos de libros MINEDUC
export function findExercisesInMineduc(
  grado: number,
  materia: string,
  pagInicio: number,
  pagFin: number,
  tema?: string
): string[] {
  const matLower = materia.toLowerCase();
  const matches = mineducDatabase.filter(m => {
    const gMatch = m.grado_especifico === grado;
    const pMatch = m.numero_pagina >= pagInicio && m.numero_pagina <= pagFin;
    if (!gMatch || !pMatch) return false;
    const itemMat = (m.materia || '').toLowerCase();
    if (matLower.includes('ciencia') || matLower.includes('natural')) {
      return itemMat.includes('ciencia') || itemMat.includes('natural') || itemMat.includes('medio');
    }
    if (matLower.includes('social')) {
      return itemMat.includes('social') || itemMat.includes('ciudad');
    }
    if (matLower.includes('lengua') || matLower.includes('comunic')) {
      return itemMat.includes('lengua') || itemMat.includes('comunic');
    }
    if (matLower.includes('mate')) {
      return itemMat.includes('mate');
    }
    return true;
  });

  if (matches.length > 0) {
    const list: string[] = [];
    for (const m of matches) {
      if (m.enunciado_ejercicio && m.enunciado_ejercicio.trim().length > 15) {
        const clean = m.enunciado_ejercicio.replace(/\\s+/g, ' ').trim();
        list.push(\`Pág. \${m.numero_pagina}: \${clean.slice(0, 300)}\`);
      }
    }
    if (list.length > 0) return list;
  }

  return [
    \`Pág. \${pagInicio}: Realizar la lectura y análisis conceptual de "\${tema || materia}" en el libro de texto oficial.\`,
    \`Págs. \${pagInicio}-\${pagFin}: Resolver los ejercicios, actividades de aplicación y esquemas en el cuaderno de trabajo según las orientaciones del MINEDUC.\`
  ];
}
`;

content = content.replace(
  '// Estructurar enunciados literales del libro MINEDUC',
  `${findExercisesCode}\n// Estructurar enunciados literales del libro MINEDUC`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Part 1 applied successfully!');
