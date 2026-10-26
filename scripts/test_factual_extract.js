const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/mineduc_ejercicios.json', 'utf8'));

function extractFactualExercises(raw, numPag, materia) {
  let text = (raw || '').replace(/\s+/g, ' ').trim();
  // Limpiar encabezados repetitivos
  text = text.replace(/^(?:\d+\s+)?(?:Ciencias|Matemáticas|Comunicación|Medio|Formación|Vivamos)[^.]*?\.\s*/i, '');
  text = text.replace(/Autoridades Ministeriales[\s\S]*/i, '');
  text = text.replace(/^(?:¿Cómo es mi libro\?|Competencias y estándares)[^.]*?\.\s*/i, '');

  // 1. Preguntas directas del libro (¿...?)
  const questions = text.match(/¿[^?]{10,250}\?/g);
  if (questions && questions.length > 0) {
    return `Pág. ${numPag} (Preguntas del libro oficial): ${questions.slice(0, 2).join(' ')}`;
  }

  // 2. Viñetas con actividades o conceptos (• ...)
  const bullets = text.match(/•\s*[^•\n]{15,250}/g);
  if (bullets && bullets.length > 0) {
    return `Pág. ${numPag} (Actividades del libro): ${bullets.slice(0, 2).map(b => b.trim()).join(' | ')}`;
  }

  // 3. Ejercicios numerados (1. ... 2. ...)
  const numbered = text.match(/\b\d+\.\s*[^0-9\n]{15,250}/g);
  if (numbered && numbered.length > 0) {
    return `Pág. ${numPag} (Ejercicios del libro): ${numbered.slice(0, 2).map(n => n.trim()).join(' | ')}`;
  }

  // 4. Párrafo conceptual literal
  if (text.length > 30) {
    return `Pág. ${numPag} (Contenido oficial): "${text.slice(0, 200).trim()}..."`;
  }
  return null;
}

const tests = [
  { g: 5, m: 'Ciencias Naturales y Tecnología', p: 12 },
  { g: 5, m: 'Ciencias Naturales y Tecnología', p: 14 },
  { g: 6, m: 'Ciencias Naturales y Tecnología', p: 14 },
  { g: 6, m: 'Ciencias Naturales y Tecnología', p: 15 },
  { g: 6, m: 'Ciencias Naturales y Tecnología', p: 16 },
  { g: 5, m: 'Ciencias Sociales y Ciudadana', p: 14 },
  { g: 5, m: 'Ciencias Sociales y Ciudadana', p: 16 },
  { g: 6, m: 'Ciencias Sociales y Ciudadana', p: 14 },
  { g: 6, m: 'Ciencias Sociales y Ciudadana', p: 16 }
];

tests.forEach(t => {
  const match = data.find(d => d.grado_especifico === t.g && d.materia === t.m && d.numero_pagina === t.p);
  if (match) {
    console.log(`[Grado ${t.g} Pág ${t.p} ${t.m}]:\n  -> ${extractFactualExercises(match.enunciado_ejercicio, t.p, t.m)}\n`);
  } else {
    console.log('No match for', t);
  }
});
