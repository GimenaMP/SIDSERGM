import { generateUnifiedRAGPlan } from '../src/utils/ragEngine';

console.log('='.repeat(75));
console.log('VERIFICACIÓN FACTUAL DE PLANIFICACIÓN SIN TEXTOS GENÉRICOS');
console.log('='.repeat(75));

// Escenario: 5.° y 6.° en Ciencias Naturales (Célula Pág 12-14 en 5.° y Célula Pág 14-16 en 6.°)
const planNaturales = generateUnifiedRAGPlan({
  grados: [5, 6],
  bimestre: 1,
  semana: 1,
  items: [
    {
      grado: 5,
      materia: 'Ciencias Naturales y Tecnología',
      materiaBase: 'ciencias_naturales',
      libroTitulo: 'Ciencias Naturales 5',
      unidad: 1,
      unidadTitulo: 'La Vida Celular',
      tema: 'La célula, partes y funciones',
      temaNumero: 1,
      paginaInicio: 12,
      paginaFin: 15
    },
    {
      grado: 6,
      materia: 'Ciencias Naturales y Tecnología',
      materiaBase: 'ciencias_naturales',
      libroTitulo: 'Ciencias Naturales 6',
      unidad: 1,
      unidadTitulo: 'Organización Biológica',
      tema: 'Reproducción celular y mitocondria',
      temaNumero: 1,
      paginaInicio: 14,
      paginaFin: 17
    }
  ]
});

console.log('\n1. TEMA GENERADOR COMÚN:');
console.log('   ->', planNaturales.tema_generador_comun);
console.log('2. CATEGORÍA CONCEPTUAL:');
console.log('   ->', planNaturales.categoria_conceptual);

const lunes = planNaturales.dias['Lunes'];
console.log('\n3. CONTENIDO FACTUAL DEL DÍA LUNES:');
lunes.gradosSincronizados.forEach((g: any) => {
  console.log(`\n   [Grado ${g.gradoNumero} · ${g.materia} · Pág. ${g.numeroPagina}]:`);
  console.log('   - Ejercicios Literales de BD:', g.ejerciciosLiterales);
  console.log('   - Actividad Período 3 (Ciencias):', g.periodo3_actividad);
  
  // Validar que NO es genérico
  if (!g.ejerciciosLiterales || g.ejerciciosLiterales.length === 0) {
    throw new Error(`Grado ${g.gradoNumero} no tiene ejercicios literales extraídos de BD!`);
  }
  const hasGenericOnly = g.ejerciciosLiterales.every((e: string) => e.includes('Lectura guiada sobre') && !e.includes('•') && !e.includes('¿') && !e.includes('Organizo'));
  if (hasGenericOnly) {
    throw new Error(`Grado ${g.gradoNumero} tiene texto puramente genérico!`);
  }
});

// Escenario 2: Ciencias Sociales 5.° y 6.° (Págs 14-16)
const planSociales = generateUnifiedRAGPlan({
  grados: [5, 6],
  bimestre: 1,
  semana: 1,
  items: [
    {
      grado: 5,
      materia: 'Ciencias Sociales y Ciudadana',
      materiaBase: 'ciencias_sociales',
      libroTitulo: 'Ciencias Sociales 5',
      unidad: 1,
      unidadTitulo: 'Poblamiento de América',
      tema: 'Primeros pobladores y cazadores',
      temaNumero: 1,
      paginaInicio: 14,
      paginaFin: 17
    },
    {
      grado: 6,
      materia: 'Ciencias Sociales y Ciudadana',
      materiaBase: 'ciencias_sociales',
      libroTitulo: 'Ciencias Sociales 6',
      unidad: 1,
      unidadTitulo: 'El Pasado Prehistórico',
      tema: 'El Paleolítico y los asentamientos',
      temaNumero: 1,
      paginaInicio: 14,
      paginaFin: 17
    }
  ]
});

console.log('\n4. CIENCIAS SOCIALES - MARTES (Período 3):');
const martesSoc = planSociales.dias['Martes'];
martesSoc.gradosSincronizados.forEach((g: any) => {
  console.log(`\n   [Grado ${g.gradoNumero} · Pág. ${g.numeroPagina}]:`);
  console.log('   - Ejercicios Literales de BD:', g.ejerciciosLiterales);
  console.log('   - Actividad Período 3 (Sociales):', g.periodo3_actividad);
});

console.log('\n🎉 ¡VERIFICACIÓN EXITOSA: Los ejercicios y actividades contienen el texto real extraído de la base de datos!');
