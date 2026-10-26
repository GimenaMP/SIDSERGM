const fs = require('fs');

const ragPath = 'src/utils/ragEngine.ts';
let rag = fs.readFileSync(ragPath, 'utf8');

// 1. Ensure buildRotationalTimeline return type has temaEjePeriodo1..4
const oldReturnSig = `): { 
  tiempos: TimeAllocation[]; 
  modalidad: 'Atención Directa Docente' | 'Trabajo Autónomo con Guía' | 'Trabajo Cooperativo / Práctica'; 
  actividadDocente: string; 
  actividadEstudiante: string;
  periodo1_actividad: string;
  periodo2_actividad: string;
  periodo3_actividad: string;
  periodo4_actividad: string;
  materiasEfectivasDelDia: MateriaSeleccionadaDetalle[];
}`;

const newReturnSig = `): { 
  tiempos: TimeAllocation[]; 
  modalidad: 'Atención Directa Docente' | 'Trabajo Autónomo con Guía' | 'Trabajo Cooperativo / Práctica'; 
  actividadDocente: string; 
  actividadEstudiante: string;
  periodo1_actividad: string;
  periodo2_actividad: string;
  periodo3_actividad: string;
  periodo4_actividad: string;
  materiasEfectivasDelDia: MateriaSeleccionadaDetalle[];
  temaEjePeriodo1?: string;
  temaEjePeriodo2?: string;
  temaEjePeriodo3?: string;
  temaEjePeriodo4?: string;
}`;

if (rag.includes(oldReturnSig)) {
  rag = rag.replace(oldReturnSig, newReturnSig);
}

// 2. Fix lines where temaEje is assigned inside buildRotationalTimeline
// We can use helper getTemaEjeParaMateria
const helperFunc = `
function getTemaEjeParaMateria(matItem: MateriaSeleccionadaDetalle): string {
  const mLower = matItem.materia.toLowerCase();
  const text = (matItem.tema + ' ' + (matItem.competencias || []).join(' ') + ' ' + (matItem.indicadores || []).join(' ')).toLowerCase();

  if (mLower.includes('social')) {
    if (/paleol[ií]tico|prehist[oó]ri|pobla|primeros pobladores|origen|cazadores|asentamiento/i.test(text)) {
      return 'Sociedades Prehistóricas, Poblamiento y Primeros Asentamientos de América';
    }
    if (/maya|ind[ií]gena|pueblos|ancestral|colonia|conquista/i.test(text)) {
      return 'Evolución Histórica, Pueblos Originarios y Memoria Cultural de Guatemala';
    }
    if (/geograf|mapa|relieve|clima|continente|territorio/i.test(text)) {
      return 'El Espacio Geográfico de América, Recursos Naturales y Organización Territorial';
    }
    return 'Sociedades Prehistóricas, Organización Social y Geografía de América';
  }

  if (mLower.includes('natural') || mLower.includes('ciencia')) {
    if (/c[eé]lula|mitocondria|reproducci[oó]n|mitosis|meiosis|organelo|tejido|gen[eé]tica/i.test(text)) {
      return 'La Célula como Unidad de Vida: Estructura, Mitocondria y Reproducción Celular';
    }
    if (/ecosistema|biodiversidad|planta|animal|flora|fauna|cadena/i.test(text)) {
      return 'Los Ecosistemas, la Biodiversidad y el Equilibrio Ambiental en Nuestra Región';
    }
    if (/salud|higiene|cuerpo|enfermedad|nutrici[oó]n|sistema/i.test(text)) {
      return 'Salud Comunitaria, Sistemas del Cuerpo Humano y Prevención de Enfermedades';
    }
    return 'La Célula como Unidad de Vida y Organización Biológica de los Seres Vivos';
  }

  if (mLower.includes('mate')) {
    if (/m[uú]ltiplo|divisor|mcm|mcd|primo|factor/i.test(text)) {
      return 'Razonamiento Numérico y Divisibilidad: Múltiplos, Divisores y Proporciones';
    }
    if (/fracci[oó]n|decimal|porcentaje|proporci[oó]n|raz[oó]n/i.test(text)) {
      return 'Operaciones con Fracciones, Razones y Proporciones en el Comercio Comunitario';
    }
    return 'El Razonamiento Numérico, Operaciones y Cálculo en las Actividades Cotidianas';
  }

  if (mLower.includes('lengua') || mLower.includes('comunic')) {
    if (/f[aá]bula|ensayo|narrat|moraleja|argument|cuento|leyenda/i.test(text)) {
      return 'Comprensión Lectora, Tipologías Textuales (Fábula y Ensayo) y Expresión Escrita';
    }
    return 'La Comunicación Dialógica, Expresión Oral y Producción Escrita en la Escuela';
  }

  return 'Desarrollo Formativo Integral, Creatividad y Vinculación Comunitaria';
}
`;

if (!rag.includes('function getTemaEjeParaMateria')) {
  rag = rag.replace(
    'export function buildRotationalTimeline(',
    helperFunc + '\nexport function buildRotationalTimeline('
  );
}

// Fix assignment inside buildRotationalTimeline
rag = rag.replace(
  /matP1\.temaEje\s*=\s*determineTemaEjePorAsignatura\([^;]+;/g,
  'matP1.temaEje = getTemaEjeParaMateria(matP1);'
);
rag = rag.replace(
  /matP2\.temaEje\s*=\s*determineTemaEjePorAsignatura\([^;]+;/g,
  'matP2.temaEje = getTemaEjeParaMateria(matP2);'
);
rag = rag.replace(
  /matP3\.temaEje\s*=\s*determineTemaEjePorAsignatura\([^;]+;/g,
  'matP3.temaEje = getTemaEjeParaMateria(matP3);'
);
rag = rag.replace(
  /matP4\.temaEje\s*=\s*determineTemaEjePorAsignatura\([^;]+;/g,
  'matP4.temaEje = getTemaEjeParaMateria(matP4);'
);

// Fix diasPlan[dia] properties
rag = rag.replace(
  /temaEjePeriodo1:\s*rotacion\.temaEjePeriodo1\s*\|\|\s*matSeleccionadasDetalle\[0\]\?\.temaEje,/g,
  'temaEjePeriodo1: (gradosSincronizados[0]?.materiasSeleccionadas?.[0])?.temaEje,'
);
rag = rag.replace(
  /temaEjePeriodo2:\s*rotacion\.temaEjePeriodo2\s*\|\|\s*matSeleccionadasDetalle\[1\]\?\.temaEje,/g,
  'temaEjePeriodo2: (gradosSincronizados[0]?.materiasSeleccionadas?.[1])?.temaEje,'
);
rag = rag.replace(
  /temaEjePeriodo3:\s*rotacion\.temaEjePeriodo3\s*\|\|\s*matSeleccionadasDetalle\[2\]\?\.temaEje,/g,
  'temaEjePeriodo3: (gradosSincronizados[0]?.materiasSeleccionadas?.[2])?.temaEje || ((dia === "Martes" || dia === "Jueves") ? "Sociedades Prehistóricas, Poblamiento y Primeros Asentamientos de América" : "La Célula como Unidad de Vida: Estructura, Mitocondria y Reproducción Celular"),'
);
rag = rag.replace(
  /temaEjePeriodo4:\s*rotacion\.temaEjePeriodo4\s*\|\|\s*matSeleccionadasDetalle\[3\]\?\.temaEje,/g,
  'temaEjePeriodo4: (gradosSincronizados[0]?.materiasSeleccionadas?.[3])?.temaEje,'
);

fs.writeFileSync(ragPath, rag, 'utf8');
console.log('src/utils/ragEngine.ts fixed!');
