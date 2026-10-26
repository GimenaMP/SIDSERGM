function determineTemaEjeTransversal(items, grados) {
  const allMaterias = Array.from(new Set(items.map(it => it.materia || '')));
  const allTemasStr = items.map(it => (it.tema || '')).join(' ').toLowerCase();

  const minGrado = Math.min(...grados);
  const gradosLabel = grados.map(g => `${g}.°`).join(' y ');

  let temaGenerador = '';
  let categoriaConceptual = '';
  let propositoComun = '';
  let descripcionEje = '';

  const hasMate = allMaterias.some(m => /mate/i.test(m));
  const hasLenguaje = allMaterias.some(m => /lengua|comunic/i.test(m));
  const hasCiencias = allMaterias.some(m => /ciencia|medio|natural/i.test(m));
  const hasSociales = allMaterias.some(m => /social|ciudad/i.test(m));

  if (hasCiencias && /salud|higiene|cuerpo|enfermedad|organismo/i.test(allTemasStr)) {
    categoriaConceptual = 'Salud, Higiene y Prevención de Enfermedades';
    temaGenerador = 'Salud e higiene comunitaria: Las enfermedades y el cuidado del cuerpo';
    propositoComun = 'Identificar las principales enfermedades de la comunidad y las formas de atenderlas y aplicar las medidas preventivas que estén a su alcance en su vida personal.';
    descripcionEje = `Eje Temático Transversal: Los grados ${gradosLabel} abordan la preservación de la salud y prevención de enfermedades, graduando desde la higiene personal y esquema corporal en grados iniciales hasta la estructura biológica y hábitos comunitarios en grados avanzados.`;
  } else if (hasMate && /posicional|numer|suma|resta|multiplic|fraccion|proporc|conjunto/i.test(allTemasStr)) {
    categoriaConceptual = 'Aritmética, Numeración y Razonamiento Lógico';
    temaGenerador = 'El razonamiento numérico, las operaciones y el cálculo en las actividades cotidianas de la comunidad';
    propositoComun = 'Desarrollar la agilidad de cálculo mental, la comprensión del valor de los números y la resolución de situaciones comerciales y cotidianas de la aldea.';
    descripcionEje = `Eje Temático Transversal: Articulación del razonamiento aritmético para ${gradosLabel} Primaria, conectando el valor relativo de los dígitos y las operaciones matemáticas con el mercado local, cosechas y presupuestos familiares.`;
  } else if (hasLenguaje && /dialogo|conversacion|oral|comunic/i.test(allTemasStr)) {
    categoriaConceptual = 'Comunicación Dialógica y Tradición Oral';
    temaGenerador = 'La comunicación dialógica, las formas de expresión y el valor de la palabra en la comunidad';
    propositoComun = 'Fortalecer la expresión oral, el respeto en la conversación y la capacidad de comunicar acuerdos en la familia y la escuela.';
    descripcionEje = `Eje Temático Transversal: Los grados ${gradosLabel} desarrollan habilidades comunicativas a través de diálogos, relatos orales y normas de participación en asambleas de aula.`;
  } else {
    categoriaConceptual = 'Saberes Integrados y Convivencia Comunitaria';
    temaGenerador = 'Saberes comunitarios, razonamiento lógico y expresión en nuestra escuela multigrado';
    propositoComun = 'Integrar de manera interdisciplinaria el cálculo, la expresión comunicativa y el cuidado del entorno local en proyectos articulados para el aula multigrado.';
    descripcionEje = `Eje Temático Transversal: Articulación de los saberes curriculares oficiales para ${gradosLabel} Primaria, contextualizados en las vivencias y necesidades de la aldea.`;
  }

  return {
    temaGenerador,
    categoriaConceptual,
    propositoComun,
    descripcionEje,
    actividadesLenguaje: {
      expresionOral: 'Diálogo de saberes comunitarios matutino, exposición de argumentos y socialización en plenaria.',
      escritura: 'Resolución de incisos y registro de algoritmos, resúmenes y cuadros comparativos en el cuaderno de trabajo.',
      lectura: 'Lectura comprensiva individual y guiada en los libros oficiales del MINEDUC.'
    },
    materialesDidacticos: [
      'Libros de texto oficiales del MINEDUC por grado',
      'Cuadernos de trabajo (cuadriculado y de líneas)',
      'Material concreto: semillas, tapitas, ábacos y billetes didácticos',
      'Papelógrafos, marcadores y tarjetas de autoaprendizaje'
    ]
  };
}

// Probar con el caso 4.° y 5.° de la imagen del usuario
const itemsTest = [
  { grado: 4, materia: 'Matemáticas', tema: 'Valor posicional hasta centenas de millar' },
  { grado: 4, materia: 'Comunicación y Lenguaje', tema: 'Muchas formas para comunicarnos Expresión oral El diálogo' },
  { grado: 5, materia: 'Matemáticas', tema: 'Valor posicional y lectura hasta 1,000,000' },
  { grado: 5, materia: 'Comunicación y Lenguaje', tema: 'Compartamos nuestras experiencias Expresión oral La conversación' }
];

console.log(determineTemaEjeTransversal(itemsTest, [4, 5]));
