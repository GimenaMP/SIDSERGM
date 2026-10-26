const fs = require('fs');

const ragPath = 'src/utils/ragEngine.ts';
let rag = fs.readFileSync(ragPath, 'utf8');

const funcDef = `
// ============================================================================
// ALGORITMO PARA DETERMINAR EL TEMA EJE TRANSVERSAL POR ASIGNATURA Y PERÍODO
// ============================================================================
export function determineTemaEjePorAsignatura(
  materia: string,
  items: SelectedItemParam[],
  grados: number[]
): { temaEje: string; categoria: string; proposito: string } {
  const matLower = (materia || '').toLowerCase();
  const itemsMat = items.filter(it => {
    const itMat = (it.materia || '').toLowerCase();
    if (matLower.includes('social') && (itMat.includes('social') || itMat.includes('historia') || itMat.includes('ciudad'))) return true;
    if ((matLower.includes('natural') || matLower.includes('ciencia')) && (itMat.includes('natural') || itMat.includes('ciencia')) && !itMat.includes('social')) return true;
    if (matLower.includes('mate') && itMat.includes('mate')) return true;
    if ((matLower.includes('lengua') || matLower.includes('comunic')) && (itMat.includes('lengua') || itMat.includes('comunic'))) return true;
    if (matLower.includes('medio') && itMat.includes('medio')) return true;
    return itMat === matLower;
  });

  const allText = itemsMat.map(it => String(it.tema || '') + ' ' + String(it.unidadTitulo || '') + ' ' + (it.competencias || []).join(' ') + ' ' + (it.indicadores || []).join(' ')).join(' ').toLowerCase();

  if (matLower.includes('social')) {
    if (/paleol[ií]tico|prehist[oó]ri|pobla|primeros pobladores|origen|cazadores|asentamiento/i.test(allText)) {
      return {
        temaEje: 'Sociedades Prehistóricas, Poblamiento y Primeros Asentamientos de América',
        categoria: 'Historia y Sociedades Prehistóricas',
        proposito: 'Identificar las teorías de poblamiento de América, las características de las bandas de cazadores recolectores y el desarrollo de los primeros asentamientos en el continente.'
      };
    }
    if (/maya|ind[ií]gena|pueblos|ancestral|colonia|conquista/i.test(allText)) {
      return {
        temaEje: 'Evolución Histórica, Pueblos Originarios y Memoria Cultural de Guatemala',
        categoria: 'Historia y Raíces Culturales',
        proposito: 'Valorar la cosmovisión, historia y legado de los pueblos originarios de Guatemala.'
      };
    }
    if (/geograf|mapa|relieve|clima|continente|territorio/i.test(allText)) {
      return {
        temaEje: 'El Espacio Geográfico de América, Recursos Naturales y Organización Territorial',
        categoria: 'Geografía y Espacio Americano',
        proposito: 'Reconocer la diversidad de paisajes, zonas climáticas y recursos naturales en el continente americano.'
      };
    }
    return {
      temaEje: 'Identidad, Geografía y Organización Social de Nuestra Comunidad y América',
      categoria: 'Ciencias Sociales e Identidad',
      proposito: 'Comprender la interacción de las sociedades humanas con su espacio físico y social.'
    };
  }

  if (matLower.includes('natural') || matLower.includes('ciencia')) {
    if (/c[eé]lula|mitocondria|reproducci[oó]n|mitosis|meiosis|organelo|tejido|gen[eé]tica/i.test(allText)) {
      return {
        temaEje: 'La Célula como Unidad de Vida: Estructura, Mitocondria y Reproducción Celular',
        categoria: 'Biología Celular y Continuidad de la Vida',
        proposito: 'Comprender la organización celular, el papel de la mitocondria en la obtención de energía y los procesos de división y reproducción celular.'
      };
    }
    if (/ecosistema|biodiversidad|planta|animal|flora|fauna|cadena/i.test(allText)) {
      return {
        temaEje: 'Los Ecosistemas, la Biodiversidad y el Equilibrio Ambiental en Nuestra Región',
        categoria: 'Ecología y Medio Ambiente',
        proposito: 'Reconocer la interdependencia de los seres vivos y la importancia de proteger los ecosistemas naturales.'
      };
    }
    if (/salud|higiene|cuerpo|enfermedad|nutrici[oó]n|sistema/i.test(allText)) {
      return {
        temaEje: 'Salud Comunitaria, Sistemas del Cuerpo Humano y Prevención de Enfermedades',
        categoria: 'Salud y Anatomía Humana',
        proposito: 'Promover hábitos de vida saludable y comprender el funcionamiento armónico del cuerpo humano.'
      };
    }
    return {
      temaEje: 'Sistemas Vivos, Organización Biológica y Cuidado del Entorno Natural',
      categoria: 'Ciencias Naturales y Vida',
      proposito: 'Desarrollar la indagación científica y el respeto por los seres vivos del entorno.'
    };
  }

  if (matLower.includes('mate')) {
    if (/m[uú]ltiplo|divisor|mcm|mcd|primo|factor/i.test(allText)) {
      return {
        temaEje: 'Razonamiento Numérico y Divisibilidad: Múltiplos, Divisores y Proporciones',
        categoria: 'Aritmética y Divisibilidad',
        proposito: 'Desarrollar habilidades de divisibilidad, múltiplos y proporcionalidad para resolver problemas cotidianos.'
      };
    }
    if (/fracci[oó]n|decimal|porcentaje|proporci[oó]n|raz[oó]n/i.test(allText)) {
      return {
        temaEje: 'Operaciones con Fracciones, Razones y Proporciones en el Comercio Comunitario',
        categoria: 'Aritmética Fraccionaria y Comercial',
        proposito: 'Aplicar fracciones y proporciones en intercambios comerciales y actividades productivas.'
      };
    }
    return {
      temaEje: 'El Razonamiento Numérico, Operaciones y Cálculo en las Actividades Cotidianas',
      categoria: 'Razonamiento Matemático Lógico',
      proposito: 'Fortalecer el cálculo mental y la resolución de situaciones problemáticas del entorno.'
    };
  }

  if (matLower.includes('lengua') || matLower.includes('comunic')) {
    if (/f[aá]bula|ensayo|narrat|moraleja|argument|cuento|leyenda/i.test(allText)) {
      return {
        temaEje: 'Comprensión Lectora, Tipologías Textuales (Fábula y Ensayo) y Expresión Escrita',
        categoria: 'Comprensión Lectora y Tipología Textual',
        proposito: 'Distinguir propósitos comunicativos en textos narrativos y argumentativos, expresando opiniones con sustento.'
      };
    }
    return {
      temaEje: 'La Comunicación Dialógica, Expresión Oral y Producción Escrita en la Escuela',
      categoria: 'Comunicación y Lenguaje L1',
      proposito: 'Fomentar la escucha activa, la expresión clara de ideas y la redacción coherente de textos.'
    };
  }

  return {
    temaEje: 'Desarrollo Formativo Integral, Creatividad y Vinculación Comunitaria',
    categoria: 'Áreas Formativas CNB',
    proposito: 'Promover la convivencia armónica, el arte y el trabajo cooperativo en el aula multigrado.'
  };
}
`;

if (!rag.includes('export function determineTemaEjePorAsignatura')) {
  rag = rag.replace(
    'export function determineTemaEjeTransversal(',
    funcDef + '\nexport function determineTemaEjeTransversal('
  );
}

// In buildRotationalTimeline:
const targetMatEfectivas = 'const materiasEfectivasDelDia: MateriaSeleccionadaDetalle[] = [matP1, matP2, matP3, matP4];';
const replaceMatEfectivas = `// Asignación de Tema Eje Transversal específico por materia y grado
  matP1.temaEje = determineTemaEjePorAsignatura(matP1.materia, items, [gradoBase, gradoSecundario]).temaEje;
  matP2.temaEje = determineTemaEjePorAsignatura(matP2.materia, items, [gradoBase, gradoSecundario]).temaEje;
  matP3.temaEje = determineTemaEjePorAsignatura(matP3.materia, items, [gradoBase, gradoSecundario]).temaEje;
  matP4.temaEje = determineTemaEjePorAsignatura(matP4.materia, items, [gradoBase, gradoSecundario]).temaEje;

  const materiasEfectivasDelDia: MateriaSeleccionadaDetalle[] = [matP1, matP2, matP3, matP4];`;

if (rag.includes(targetMatEfectivas) && !rag.includes('matP1.temaEje =')) {
  rag = rag.replace(targetMatEfectivas, replaceMatEfectivas);
}

// In p3Text:
rag = rag.replace(
  'El docente modela el concepto nuclear del Tema Eje Transversal para ambos grados a la vez',
  'El docente modela el concepto nuclear del Tema Eje de ' + '${matP3.materia} ("${matP3.temaEje}")' + ' para ambos grados a la vez'
);

// In buildRotationalTimeline return:
rag = rag.replace(
  'materiasEfectivasDelDia,\n    tiempos\n  };',
  `materiasEfectivasDelDia,
    temaEjePeriodo1: matP1.temaEje,
    temaEjePeriodo2: matP2.temaEje,
    temaEjePeriodo3: matP3.temaEje,
    temaEjePeriodo4: matP4.temaEje,
    tiempos
  };`
);

// In diasPlan[dia]:
rag = rag.replace(
  'componentes_multigrado: componentesDia,\n      gradosSincronizados',
  `componentes_multigrado: componentesDia,
      temaEjePeriodo1: rotacion.temaEjePeriodo1 || matSeleccionadasDetalle[0]?.temaEje,
      temaEjePeriodo2: rotacion.temaEjePeriodo2 || matSeleccionadasDetalle[1]?.temaEje,
      temaEjePeriodo3: rotacion.temaEjePeriodo3 || matSeleccionadasDetalle[2]?.temaEje,
      temaEjePeriodo4: rotacion.temaEjePeriodo4 || matSeleccionadasDetalle[3]?.temaEje,
      gradosSincronizados`
);

fs.writeFileSync(ragPath, rag, 'utf8');
console.log('src/utils/ragEngine.ts patched successfully!');
