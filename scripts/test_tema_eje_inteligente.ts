import { analizarRelacionTemasMismaMateria } from '../src/utils/machineLearningPlanning';
import { generateUnifiedRAGPlan } from '../src/utils/ragEngine';

console.log('='.repeat(75));
console.log('PRUEBA DE ANÁLISIS DE RELACIÓN Y TEMA EJE POR ASIGNATURA');
console.log('='.repeat(75));

// Caso 1: Ciencias Naturales CON relación directa (5.° Célula vs 6.° Célula/Mitocondria)
const caso1 = analizarRelacionTemasMismaMateria('ciencias_naturales', 'Ciencias Naturales y Tecnología', [
  {
    grado: 5,
    temas: [{ titulo: 'La célula animal y vegetal, organelos y funciones' }]
  },
  {
    grado: 6,
    temas: [{ titulo: 'Reproducción celular, mitocondria y respiración' }]
  }
]);

console.log('\n--- CASO 1: Ciencias Naturales (Célula vs Mitocondria) ---');
console.log('Tiene relación:', caso1.tieneRelacion);
console.log('Tema Eje:', caso1.temaEjeTrazado);
console.log('Palabras clave:', caso1.palabrasClaveComunes);
if (!caso1.tieneRelacion || !caso1.temaEjeTrazado?.includes('Celular')) {
  throw new Error('FALLO Caso 1: Debió detectar relación en biología celular');
}

// Caso 2: Ciencias Naturales SIN relación directa (5.° Célula vs 6.° Sistema Solar)
const caso2 = analizarRelacionTemasMismaMateria('ciencias_naturales', 'Ciencias Naturales y Tecnología', [
  {
    grado: 5,
    temas: [{ titulo: 'La célula, organelos y tejidos' }]
  },
  {
    grado: 6,
    temas: [{ titulo: 'El Sistema Solar, los planetas y la órbita terrestre' }]
  }
]);

console.log('\n--- CASO 2: Ciencias Naturales (Célula vs Sistema Solar) ---');
console.log('Tiene relación:', caso2.tieneRelacion);
console.log('Tema Eje (debe ser null):', caso2.temaEjeTrazado);
console.log('Estrategia:', caso2.estrategiaDidactica);
if (caso2.tieneRelacion || caso2.temaEjeTrazado !== null) {
  throw new Error('FALLO Caso 2: No debió forzar tema eje para temas disjuntos');
}

// Caso 3: Matemáticas CON relación (4.° Múltiplos vs 5.° Múltiplos y Divisores)
const caso3 = analizarRelacionTemasMismaMateria('matematicas', 'Matemáticas', [
  {
    grado: 4,
    temas: [{ titulo: 'Múltiplos de un número natural' }]
  },
  {
    grado: 5,
    temas: [{ titulo: 'Múltiplos, divisores y factores' }]
  }
]);

console.log('\n--- CASO 3: Matemáticas (Múltiplos vs Divisores) ---');
console.log('Tiene relación:', caso3.tieneRelacion);
console.log('Tema Eje:', caso3.temaEjeTrazado);
console.log('Palabras clave:', caso3.palabrasClaveComunes);
if (!caso3.tieneRelacion) {
  throw new Error('FALLO Caso 3: Debió detectar múltiplos/divisores');
}

// Caso 4: Matemáticas SIN relación (4.° Fracciones vs 5.° Geometría)
const caso4 = analizarRelacionTemasMismaMateria('matematicas', 'Matemáticas', [
  {
    grado: 4,
    temas: [{ titulo: 'Fracciones equivalentes y números mixtos' }]
  },
  {
    grado: 5,
    temas: [{ titulo: 'Cuerpos geométricos, prismas y pirámides' }]
  }
]);

console.log('\n--- CASO 4: Matemáticas (Fracciones vs Geometría) ---');
console.log('Tiene relación:', caso4.tieneRelacion);
console.log('Tema Eje (debe ser null):', caso4.temaEjeTrazado);
if (caso4.tieneRelacion || caso4.temaEjeTrazado !== null) {
  throw new Error('FALLO Caso 4: No debió forzar tema eje entre fracciones y geometría');
}

// Caso 5: Ciencias Sociales CON relación (5.° Cazadores vs 6.° Paleolítico)
const caso5 = analizarRelacionTemasMismaMateria('ciencias_sociales', 'Ciencias Sociales', [
  {
    grado: 5,
    temas: [{ titulo: 'Primeros pobladores de América y cazadores' }]
  },
  {
    grado: 6,
    temas: [{ titulo: 'El Paleolítico y los primeros asentamientos humanos' }]
  }
]);

console.log('\n--- CASO 5: Ciencias Sociales (Pobladores vs Paleolítico) ---');
console.log('Tiene relación:', caso5.tieneRelacion);
console.log('Tema Eje:', caso5.temaEjeTrazado);
if (!caso5.tieneRelacion) {
  throw new Error('FALLO Caso 5: Debió detectar prehistoria y poblamiento');
}

// Caso 6: Aula Monogrado (1 solo grado)
const caso6 = analizarRelacionTemasMismaMateria('ciencias_naturales', 'Ciencias Naturales', [
  {
    grado: 5,
    temas: [{ titulo: 'La célula y sus funciones' }]
  }
]);

console.log('\n--- CASO 6: Monogrado (1 solo grado) ---');
console.log('Tiene relación:', caso6.tieneRelacion);
console.log('Tema Eje (debe ser null):', caso6.temaEjeTrazado);
if (caso6.tieneRelacion || caso6.temaEjeTrazado !== null) {
  throw new Error('FALLO Caso 6: Monogrado no debe tener tema eje multigrado');
}

// Prueba E2E con generateUnifiedRAGPlan
console.log('\n--- PRUEBA E2E: generateUnifiedRAGPlan con temas disjuntos ---');
const planDisjunto = generateUnifiedRAGPlan({
  grados: [5, 6],
  bimestre: 1,
  semana: 1,
  items: [
    {
      grado: 5,
      materia: 'Ciencias Naturales',
      materiaBase: 'ciencias_naturales',
      libroTitulo: 'Ciencias Naturales 5',
      unidad: 1,
      unidadTitulo: 'La vida',
      tema: 'La célula y sus partes',
      temaNumero: 1,
      paginaInicio: 10,
      paginaFin: 12
    },
    {
      grado: 6,
      materia: 'Ciencias Naturales',
      materiaBase: 'ciencias_naturales',
      libroTitulo: 'Ciencias Naturales 6',
      unidad: 3,
      unidadTitulo: 'El Universo',
      tema: 'El Sistema Solar y los planetas',
      temaNumero: 1,
      paginaInicio: 60,
      paginaFin: 62
    }
  ]
});

console.log('Plan Disjunto tema_generador_comun:', planDisjunto.tema_generador_comun);
if (planDisjunto.tema_generador_comun.includes('La Célula como Unidad')) {
  throw new Error('FALLO E2E: El plan forzó "La Célula" a pesar de que 6.° está en el Sistema Solar!');
}
console.log('✅ Plan Disjunto usó correctamente:', planDisjunto.tema_generador_comun);

console.log('\n--- PRUEBA E2E: generateUnifiedRAGPlan con temas relacionados ---');
const planRelacionado = generateUnifiedRAGPlan({
  grados: [5, 6],
  bimestre: 1,
  semana: 1,
  items: [
    {
      grado: 5,
      materia: 'Ciencias Naturales',
      materiaBase: 'ciencias_naturales',
      libroTitulo: 'Ciencias Naturales 5',
      unidad: 1,
      unidadTitulo: 'La vida celular',
      tema: 'La célula y organelos celulares',
      temaNumero: 1,
      paginaInicio: 10,
      paginaFin: 12
    },
    {
      grado: 6,
      materia: 'Ciencias Naturales',
      materiaBase: 'ciencias_naturales',
      libroTitulo: 'Ciencias Naturales 6',
      unidad: 1,
      unidadTitulo: 'Mundo microscópico',
      tema: 'Reproducción celular y la mitocondria',
      temaNumero: 1,
      paginaInicio: 14,
      paginaFin: 16
    }
  ]
});

console.log('Plan Relacionado tema_generador_comun:', planRelacionado.tema_generador_comun);
if (!planRelacionado.tema_generador_comun.includes('Celular')) {
  throw new Error('FALLO E2E: El plan debió usar el eje Biología Celular');
}
console.log('✅ Plan Relacionado trazó con éxito:', planRelacionado.tema_generador_comun);

console.log('\n🎉 ¡TODAS LAS PRUEBAS DE TEMA EJE POR ASIGNATURA PASARON SATISFACTORIAMENTE!');
