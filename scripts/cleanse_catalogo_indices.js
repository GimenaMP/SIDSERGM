const fs = require('fs');

// Cargar catálogo original
const raw = fs.readFileSync('./data/catalogo_indices_extraidos.json', 'utf-8');
const cat = JSON.parse(raw);

// Mapeo de títulos conocidos para sesiones que no tenían nombre explícito o tenían cabeceras raspadas
const KNOWN_SESSION_TITLES = {
  // Grado 1 Matemáticas
  'G1_matematicas_U1_P8': '¡Nos ubicamos!',
  'G1_matematicas_U1_P18': 'Práctica de líneas y figuras',
  'G1_matematicas_U1_P19': 'Ejercitación y repaso de ubicación',
  'G1_matematicas_U1_P20': 'Números hasta 10 (Introducción)',
  'G1_matematicas_U2_P54': 'Lectura y escritura de números hasta 10',
  'G1_matematicas_U2_P64': 'Resta con números hasta 10 (Concepto)',
  'G1_matematicas_U2_P76': 'Gráfica y pictogramas',
  'G1_matematicas_U2_P79': 'Suma y resta con tres números',
  'G1_matematicas_U2_P86': 'Números hasta 20 (Concepto)',
  'G1_matematicas_U2_P92': 'Práctica de números hasta 20',
  'G1_matematicas_U3_P99': 'Suma hasta 20',
  'G1_matematicas_U3_P111': 'Resta hasta 20',
  'G1_matematicas_U3_P123': 'Conteo hasta 100 de 10 en 10',
  'G1_matematicas_U3_P136': 'Longitud y comparación directa',
  'G1_matematicas_U4_P144': 'Suma y resta con dos dígitos',
  'G1_matematicas_U4_P169': 'Monedas y números mayas',
  
  // Grado 4 Matemáticas
  'G4_matematicas_U1_P9': 'Números hasta 999,999 (Concepto)',
  'G4_matematicas_U2_P70': 'Multiplicación por decenas y centenas',
  'G4_matematicas_U2_P72': 'Propiedades de la multiplicación',

  // Grado 5 Matemáticas
  'G5_matematicas_U1_P13': 'Números hasta 999,999 (Repaso)'
};

// Cargar las unidades limpias oficiales de CATALOGO_MATERIAS_GRADO para G6 Matemáticas
const G6_MATEMATICAS_OFICIAL = [
  {
    unidad: 1,
    titulo: 'Conjuntos, Operaciones Combinadas y Potenciación',
    paginaInicio: 6,
    paginaFin: 48,
    competencias: ['Aplica operaciones entre conjuntos, jerarquía operacional y radicación/potenciación.'],
    indicadoresLogro: ['Opera unión, intersección y diferencia.', 'Resuelve operaciones combinadas.', 'Calcula potencias y raíces.'],
    temas: [
      { numero: 1, titulo: 'Conjuntos: operaciones y diagramas de Venn', paginaInicio: 6, paginaFin: 20 },
      { numero: 2, titulo: 'Jerarquía de operaciones combinadas con paréntesis', paginaInicio: 21, paginaFin: 34 },
      { numero: 3, titulo: 'Potenciación y radicación básica', paginaInicio: 35, paginaFin: 48 }
    ]
  },
  {
    unidad: 2,
    titulo: 'Fracciones, Razones, Proporciones y Porcentajes',
    paginaInicio: 50,
    paginaFin: 98,
    competencias: ['Resuelve problemas de proporcionalidad directa e inversa y cálculo de porcentajes.'],
    indicadoresLogro: ['Multiplica y divide fracciones mixtas.', 'Aplica regla de tres simple.', 'Calcula descuentos e IVA.'],
    temas: [
      { numero: 1, titulo: 'Multiplicación y división de fracciones', paginaInicio: 50, paginaFin: 66 },
      { numero: 2, titulo: 'Razones y proporciones directas e inversas', paginaInicio: 67, paginaFin: 82 },
      { numero: 3, titulo: 'Cálculo de tanto por ciento (%) en compras familiares', paginaInicio: 83, paginaFin: 98 }
    ]
  },
  {
    unidad: 3,
    titulo: 'Ecuaciones de Primer Grado, Círculo y Cuerpos Geométricos',
    paginaInicio: 100,
    paginaFin: 144,
    competencias: ['Calcula áreas circulares, áreas laterales y volumen de prismas y cilindros.'],
    indicadoresLogro: ['Despeja incógnitas básicas.', 'Calcula perímetro y área del círculo.', 'Calcula volumen en cm³ y m³.'],
    temas: [
      { numero: 1, titulo: 'Ecuaciones sencillas de suma y multiplicación', paginaInicio: 100, paginaFin: 114 },
      { numero: 2, titulo: 'Longitud de circunferencia y área del círculo', paginaInicio: 115, paginaFin: 128 },
      { numero: 3, titulo: 'Cuerpos geométricos y volumen', paginaInicio: 129, paginaFin: 144 }
    ]
  },
  {
    unidad: 4,
    titulo: 'Sistema Maya hasta 4.ª Posición y Estadística Avanzada',
    paginaInicio: 146,
    paginaFin: 186,
    competencias: ['Escribe números mayas hasta 159,999 e interpreta gráficos circulares.'],
    indicadoresLogro: ['Multiplica en el sistema vigesimal maya.', 'Interpreta gráficas circulares e histogramas.'],
    temas: [
      { numero: 1, titulo: 'Numeración maya hasta 4.ª posición (valores de 1, 20, 400, 8,000)', paginaInicio: 146, paginaFin: 162 },
      { numero: 2, titulo: 'Suma y resta de números mayas con fichas y puntos', paginaInicio: 163, paginaFin: 174 },
      { numero: 3, titulo: 'Gráficos de sectores circulares e interpretación', paginaInicio: 175, paginaFin: 186 }
    ]
  }
];

function isNonCurricularOrNoise(tit) {
  const t = tit.trim();

  // Evaluaciones, proyectos, actividades de cierre
  if (/^(actividad de cierre|actividades adicionales|evaluaci[oó]n|autoevaluaci[oó]n|proyecto\s+[a-z]+|proyectos\s+[a-z]+)/i.test(t)) {
    return true;
  }

  // Instrucciones o ejercicios aislados
  if (/^(\d+\.\s*(observo|sumo|resto|escribo|agrupo|pinto|formo|compro|cuatro|resuelvo|calculo|leo|uno|copio|dibujo|completo|multiplico|divido|estimo|trazo|encuentre|marco|ordeno|doble|hallar|veo|contesto))/i.test(t)) {
    return true;
  }

  // Fragmentos matemáticos raspados (ej: 0.73 = 0 + 0, 5.4 ÷ 9, etc.)
  if (/^(\d+\.?\d*\s*[x÷\+\=\:\-]|0\.\d+|1\.\d+|2\.\d+|3\.\d+|4\.\d+|5\.\d+|7\.\d+|8\.\d+|9\.\d+|13\.\d+|14\.\d+|19\.\d+|20\.\d+|32\.\d+|50\.\d+|90\.\d+)/i.test(t)) {
    return true;
  }

  // Preguntas o ejercicios de libro de texto en el título
  if (/^\d+\.\s*(¿qu[eé]|si\s+hay|si\s+utiliza|cuando\s+se|entonces|coloque|multiplicar|represente)/i.test(t)) {
    return true;
  }

  // Títulos vacíos o de muy pocos caracteres sin significado
  if (t.replace(/\(p[aá]g\.?\s*\d+\)/i, '').trim().length < 4) {
    return true;
  }

  return false;
}

function cleanTitle(rawTit, g, mat, uNum, pag) {
  let tit = rawTit.trim();

  const key = `G${g}_${mat}_U${uNum}_P${pag}`;
  if (KNOWN_SESSION_TITLES[key]) {
    return KNOWN_SESSION_TITLES[key];
  }

  // Quitar sufijo de página "(Pág. 10)" o "(Págs. 10-12)"
  tit = tit.replace(/\s*\(\s*p[aá]gs?\.?\s*\d+(?:-\d+)?\s*\)\s*$/i, '').trim();

  // Quitar cabeceras raspadas entre paréntesis
  tit = tit.replace(/\s*\(\s*\d+\s+unidad\s+\d+[^)]*\)/gi, '').trim();
  tit = tit.replace(/\s*\(\s*\d+\s+n[uú]meros\s+hasta[^)]*\)/gi, '').trim();
  tit = tit.replace(/\s*\(\s*•\s*leemos\s+el\s+n[uú]mero\s+de\s+la\s+tarjeta\s*\)/gi, '').trim();

  // Si tiene prefijo de sesión, limpiarlo dejando el nombre del tema
  const sessionMatch = tit.match(/^(?:unidad\s*\d+\s*•\s*)?tema\s*\d+\s*•\s*sesi[oó]n\s*\d+\s*(.*)$/i);
  if (sessionMatch) {
    const rest = sessionMatch[1].trim();
    if (rest.length >= 3) {
      tit = rest.replace(/^[-–—:•\s]+/, '').trim();
    }
  }

  // Mayúscula inicial
  if (tit.length > 0) {
    tit = tit.charAt(0).toUpperCase() + tit.slice(1);
  }

  return tit;
}

const sanitizedCatalog = {};

for (const g of Object.keys(cat)) {
  sanitizedCatalog[g] = {};
  for (const mat of Object.keys(cat[g])) {
    // Si es Grado 6 Matemáticas, usamos la versión oficial limpia
    if (g === '6' && mat === 'matematicas') {
      sanitizedCatalog[g][mat] = G6_MATEMATICAS_OFICIAL;
      continue;
    }

    sanitizedCatalog[g][mat] = [];
    const units = cat[g][mat];

    units.forEach((u, uIdx) => {
      const uNum = uIdx + 1;
      const cleanTemas = [];
      let lastValidTema = null;

      u.temas.forEach((t) => {
        const rawTit = (t.titulo || '').trim();

        if (isNonCurricularOrNoise(rawTit)) {
          if (lastValidTema) {
            lastValidTema.paginaFin = Math.max(lastValidTema.paginaFin || 0, t.paginaFin || t.paginaInicio || 0);
          }
        } else {
          const cleanedTitle = cleanTitle(rawTit, g, mat, uNum, t.paginaInicio);

          let finalTitle = cleanedTitle;
          if (finalTitle.length < 4 || /^(tema|unidad)/i.test(finalTitle)) {
            finalTitle = `${u.titulo || 'Contenido curricular'} - Parte ${cleanTemas.length + 1}`;
          }

          const temaObj = {
            numero: cleanTemas.length + 1,
            titulo: finalTitle,
            paginaInicio: t.paginaInicio,
            paginaFin: t.paginaFin || t.paginaInicio
          };

          cleanTemas.push(temaObj);
          lastValidTema = temaObj;
        }
      });

      if (cleanTemas.length === 0) {
        cleanTemas.push({
          numero: 1,
          titulo: u.titulo || 'Contenidos curriculares de la unidad',
          paginaInicio: u.paginaInicio || 1,
          paginaFin: u.paginaFin || 10
        });
      }

      cleanTemas.forEach((ct, idx) => {
        ct.numero = idx + 1;
      });

      sanitizedCatalog[g][mat].push({
        ...u,
        temas: cleanTemas
      });
    });
  }
}

// Sobrescribir data/catalogo_indices_extraidos.json con los datos limpios
fs.writeFileSync('./data/catalogo_indices_extraidos.json', JSON.stringify(sanitizedCatalog, null, 2), 'utf-8');
console.log('✅ Catálogo oficial sobrescrito y blindado en ./data/catalogo_indices_extraidos.json');
