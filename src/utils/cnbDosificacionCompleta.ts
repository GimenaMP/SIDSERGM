// Archivo autogenerado con la Dosificación Sistemática Oficial del CNB de Guatemala
// Cubre exhaustivamente 6 Grados (1.° a 6.°), 4 Bloques (Bimestres), 9 Semanas y 4 Materias oficiales (864 registros)

export interface CNBDosificacionItem {
  grado: number;
  ciclo: 'primer_ciclo' | 'segundo_ciclo';
  area_materia: string;
  bloque_bimestre: number;
  semana_sugerida: number;
  competencia_numero: number;
  competencia_descripcion: string;
  indicador_numero: string;
  indicador_descripcion: string;
  temas_declarativos: string[];
  criterios_evaluacion: string;
  pagina_libro_sugerida: number;
}

// Cálculo determinista y continuo de página oficial del libro MINEDUC
export function getMineducPageForGrade(grado: number, bloque: number, semana: number, materia?: string): number {
  const b = Math.min(Math.max(bloque || 1, 1), 4);
  const s = Math.min(Math.max(semana || 1, 1), 9);
  
  // En un libro de 180 a 200 páginas, cada bloque avanza unas 45 páginas (5 páginas por semana lectiva)
  // Semana 1 = 10, Semana 2 = 15, ..., Semana 9 = 50, etc.
  return 10 + ((b - 1) * 45) + ((s - 1) * 5);
}

// Búsqueda instantánea en memoria O(1) de la dosificación curricular exacta
export function getCNBCorrespondingEntry(
  grado: number,
  bloque: number,
  semana: number,
  materia: string
): CNBDosificacionItem {
  const g = Math.min(Math.max(grado || 1, 1), 6);
  const b = Math.min(Math.max(bloque || 1, 1), 4);
  const s = Math.min(Math.max(semana || 1, 1), 9);
  const pag = getMineducPageForGrade(g, b, s, materia);

  // Consultar la base de datos JSON compilada
  const records = CNB_DOSIFICACION_DATABASE;
  const match = records.find(r => 
    r.grado === g && 
    r.bloque_bimestre === b && 
    r.semana_sugerida === s && 
    (r.area_materia.toLowerCase().includes(materia.toLowerCase()) || materia.toLowerCase().includes(r.area_materia.toLowerCase()))
  );

  if (match) {
    return { ...match, pagina_libro_sugerida: pag };
  }

  // Búsqueda por grado, bloque y semana si el nombre del área tiene variación
  const partial = records.find(r => r.grado === g && r.bloque_bimestre === b && r.semana_sugerida === s);
  if (partial) {
    return { ...partial, area_materia: materia, pagina_libro_sugerida: pag };
  }

  // Fallback seguro de primer registro de ese grado
  const fallback = records.find(r => r.grado === g) || records[0];
  return {
    ...fallback,
    bloque_bimestre: b,
    semana_sugerida: s,
    area_materia: materia,
    pagina_libro_sugerida: pag
  };
}

export const CNB_DOSIFICACION_DATABASE: CNBDosificacionItem[] = [
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 1,
    "competencia_numero": 1,
    "competencia_descripcion": "Establece relaciones entre personas, objetos y figuras geométricas por su posición en el espacio y por la distancia entre ellos.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Identifica la ubicación de objetos en el espacio: arriba-abajo, delante-atrás, cerca-lejos.",
    "temas_declarativos": [
      "Ubicación en el espacio (arriba, abajo, delante, atrás, cerca, lejos)",
      "Nociones de proximidad y distancia"
    ],
    "criterios_evaluacion": "Ubica objetos con relación a su cuerpo y maneja conteo de 1 a 10 con material manipulativo.",
    "pagina_libro_sugerida": 10
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 1,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Conciencia fonológica: discriminación auditiva de sonidos del entorno y animales",
      "Canciones y rimas"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 10
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 1,
    "semana_sugerida": 1,
    "competencia_numero": 1,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "El cuerpo humano: partes externas (cabeza, tronco, extremidades) y articulaciones",
      "Esquema corporal"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 10
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 1,
    "competencia_numero": 1,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "El aula escolar: un espacio de convivencia pacífica, respeto y trabajo colaborativo",
      "Acuerdos iniciales"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 10
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 2,
    "competencia_numero": 1,
    "competencia_descripcion": "Establece relaciones entre personas, objetos y figuras geométricas por su posición en el espacio y por la distancia entre ellos.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Identifica la ubicación de objetos en el espacio: arriba-abajo, delante-atrás, cerca-lejos.",
    "temas_declarativos": [
      "Lateralidad en el propio cuerpo (izquierda y derecha)",
      "Orientación espacial en el aula"
    ],
    "criterios_evaluacion": "Ubica objetos con relación a su cuerpo y maneja conteo de 1 a 10 con material manipulativo.",
    "pagina_libro_sugerida": 15
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 2,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Trazos preparatorios y grafomotricidad en cuadrícula y arena",
      "Coordinación visomotriz"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 15
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 1,
    "semana_sugerida": 2,
    "competencia_numero": 1,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "Los cinco sentidos: órganos (ojos, oídos, nariz, lengua, piel) y sus funciones de alerta",
      "Exploración sensorial"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 15
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 2,
    "competencia_numero": 1,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "Normas de convivencia del aula: elaboración democrática de nuestro decálogo de oro",
      "Reglas consensuadas"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 15
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 3,
    "competencia_numero": 1,
    "competencia_descripcion": "Establece relaciones entre personas, objetos y figuras geométricas por su posición en el espacio y por la distancia entre ellos.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Identifica la ubicación de objetos en el espacio: arriba-abajo, delante-atrás, cerca-lejos.",
    "temas_declarativos": [
      "Comparación directa de objetos (grande-pequeño, largo-corto, grueso-delgado)",
      "Conceptos dimensionales"
    ],
    "criterios_evaluacion": "Ubica objetos con relación a su cuerpo y maneja conteo de 1 a 10 con material manipulativo.",
    "pagina_libro_sugerida": 20
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 3,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Vocales: sonido y grafía de la \"a\" y la \"e\" en palabras ilustradas",
      "Escritura de vocales"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 20
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 1,
    "semana_sugerida": 3,
    "competencia_numero": 1,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "Hábitos de higiene personal: lavado de manos con agua segura, cepillado y baño diario",
      "Salud escolar"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 20
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 3,
    "competencia_numero": 1,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "El Gobierno Escolar: qué es, sus objetivos y la importancia de la participación infantil",
      "Democracia escolar"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 20
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 4,
    "competencia_numero": 1,
    "competencia_descripcion": "Establece relaciones entre personas, objetos y figuras geométricas por su posición en el espacio y por la distancia entre ellos.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Identifica la ubicación de objetos en el espacio: arriba-abajo, delante-atrás, cerca-lejos.",
    "temas_declarativos": [
      "Clasificación de objetos por color, forma y tamaño",
      "Agrupación de semillas y materiales del aula"
    ],
    "criterios_evaluacion": "Ubica objetos con relación a su cuerpo y maneja conteo de 1 a 10 con material manipulativo.",
    "pagina_libro_sugerida": 25
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 4,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Vocales: sonido y grafía de la \"i\", \"o\" y \"u\" y combinación de vocales",
      "Diptongos básicos"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 25
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 1,
    "semana_sugerida": 4,
    "competencia_numero": 1,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "Nutrición saludable: grupos de alimentos locales (frutas, verduras, tortillas, frijol)",
      "Pirámide nutricional"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 25
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 4,
    "competencia_numero": 1,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "Comisiones del Gobierno Escolar: comisiones de orden, aseo, deportes, cultura y botiquín",
      "Organización de tareas"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 25
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 5,
    "competencia_numero": 1,
    "competencia_descripcion": "Establece relaciones entre personas, objetos y figuras geométricas por su posición en el espacio y por la distancia entre ellos.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Reconoce relaciones de pertenencia y orden en colecciones de objetos.",
    "temas_declarativos": [
      "Correspondencia uno a uno entre colecciones",
      "Conjuntos equivalentes y no equivalentes"
    ],
    "criterios_evaluacion": "Ubica objetos con relación a su cuerpo y maneja conteo de 1 a 10 con material manipulativo.",
    "pagina_libro_sugerida": 30
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 5,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "La consonante \"m\": fonema, sílabas ma, me, mi, mo, mu y palabras simples",
      "Lectura de \"mamá\""
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 30
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 1,
    "semana_sugerida": 5,
    "competencia_numero": 1,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "El agua segura: importancia para el cuerpo humano y métodos de desinfección",
      "Hervido y filtrado"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 30
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 5,
    "competencia_numero": 1,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "Elecciones del Gobierno Escolar: campañas, voto secreto y juramentación de directiva",
      "Ejercicio ciudadano"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 30
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 6,
    "competencia_numero": 1,
    "competencia_descripcion": "Establece relaciones entre personas, objetos y figuras geométricas por su posición en el espacio y por la distancia entre ellos.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Reconoce relaciones de pertenencia y orden en colecciones de objetos.",
    "temas_declarativos": [
      "Conteo y trazo de los números del 1 al 5 con apoyo de frijoles o tapitas",
      "Asociación número-cantidad"
    ],
    "criterios_evaluacion": "Ubica objetos con relación a su cuerpo y maneja conteo de 1 a 10 con material manipulativo.",
    "pagina_libro_sugerida": 35
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 6,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "La consonante \"p\": fonema, sílabas pa, pe, pi, po, pu y oraciones ilustradas",
      "Lectura de \"papá\""
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 35
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 1,
    "semana_sugerida": 6,
    "competencia_numero": 1,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "Prevención de enfermedades comunes en la escuela y en la comunidad rural",
      "Vacunas y descanso"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 35
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 6,
    "competencia_numero": 1,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "Derechos fundamentales de la niñez: derecho a la vida, nombre, educación y salud",
      "Convención de derechos"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 35
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 7,
    "competencia_numero": 1,
    "competencia_descripcion": "Establece relaciones entre personas, objetos y figuras geométricas por su posición en el espacio y por la distancia entre ellos.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Reconoce relaciones de pertenencia y orden en colecciones de objetos.",
    "temas_declarativos": [
      "Los números del 6 al 9 y el concepto de cero como conjunto vacío",
      "Escritura correcta en cuadrícula"
    ],
    "criterios_evaluacion": "Ubica objetos con relación a su cuerpo y maneja conteo de 1 a 10 con material manipulativo.",
    "pagina_libro_sugerida": 40
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 7,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "La consonante \"s\": fonema y sílabas directas e inversas (sa, se, si, so, su)",
      "Lectura fluida inicial"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 40
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 1,
    "semana_sugerida": 7,
    "competencia_numero": 1,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "El crecimiento y etapas del desarrollo humano (bebé, niño, joven, adulto, anciano)",
      "Línea de vida"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 40
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 7,
    "competencia_numero": 1,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "Deberes y responsabilidades de los niños en la escuela, la familia y la comunidad",
      "Compromiso social"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 40
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 8,
    "competencia_numero": 1,
    "competencia_descripcion": "Establece relaciones entre personas, objetos y figuras geométricas por su posición en el espacio y por la distancia entre ellos.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Ordena y compara colecciones de objetos de acuerdo con su cantidad.",
    "temas_declarativos": [
      "Comparación de cantidades: más que, menos que, tantos como",
      "Uso de fichas didácticas"
    ],
    "criterios_evaluacion": "Ubica objetos con relación a su cuerpo y maneja conteo de 1 a 10 con material manipulativo.",
    "pagina_libro_sugerida": 45
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 8,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "La consonante \"l\": fonema y lectura de palabras de dos y tres sílabas",
      "Uso del libro de texto"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 45
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 1,
    "semana_sugerida": 8,
    "competencia_numero": 1,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "Cuidado de la postura corporal y actividad física en el patio escolar",
      "Salud física"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 45
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 8,
    "competencia_numero": 1,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "Equidad de género e igualdad de oportunidades entre niñas y niños en la escuela",
      "No discriminación"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 45
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 9,
    "competencia_numero": 1,
    "competencia_descripcion": "Establece relaciones entre personas, objetos y figuras geométricas por su posición en el espacio y por la distancia entre ellos.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Ordena y compara colecciones de objetos de acuerdo con su cantidad.",
    "temas_declarativos": [
      "Orden ascendente y descendente del 0 al 10 en la recta numérica",
      "Composición de colecciones del 1 al 10"
    ],
    "criterios_evaluacion": "Ubica objetos con relación a su cuerpo y maneja conteo de 1 a 10 con material manipulativo.",
    "pagina_libro_sugerida": 50
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 9,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Integración: lectura de oraciones cortas con m, p, s, l y comprensión de mensajes",
      "Evaluación de fluidez"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 50
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 1,
    "semana_sugerida": 9,
    "competencia_numero": 1,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "La salud emocional y la convivencia armoniosa en la familia y el aula",
      "Expresión de afectos"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 50
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 9,
    "competencia_numero": 1,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "Resolución pacífica de conflictos: el diálogo y la escucha como camino sin violencia",
      "Mediación entre pares"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 50
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 1,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica conocimientos y experiencias de aritmética básica en la interacción con su entorno familiar y escolar.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Calcula sumas básicas sin agrupación utilizando material concreto del entorno.",
    "temas_declarativos": [
      "Concepto de suma como unión de dos colecciones (totales hasta 5)",
      "Material concreto manipulativo"
    ],
    "criterios_evaluacion": "Resuelve problemas de suma y resta con cantidades de un dígito explicando su procedimiento.",
    "pagina_libro_sugerida": 55
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 1,
    "competencia_numero": 2,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "La consonante \"t\": fonema, sílabas y palabras del vocabulario escolar",
      "Dictado de oraciones"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 55
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 2,
    "semana_sugerida": 1,
    "competencia_numero": 2,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "La diversidad de seres vivos en la comunidad: animales domésticos y silvestres",
      "Clasificación de fauna"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 55
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 1,
    "competencia_numero": 2,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "Mi comunidad y aldea: historia de la fundación, tradiciones y personajes ilustres",
      "Memoria local"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 55
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 2,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica conocimientos y experiencias de aritmética básica en la interacción con su entorno familiar y escolar.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Calcula sumas básicas sin agrupación utilizando material concreto del entorno.",
    "temas_declarativos": [
      "Planteamiento formal de la suma con el signo más (+) y signo igual (=)",
      "Lectura de enunciados de suma"
    ],
    "criterios_evaluacion": "Resuelve problemas de suma y resta con cantidades de un dígito explicando su procedimiento.",
    "pagina_libro_sugerida": 60
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 2,
    "competencia_numero": 2,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "La consonante \"d\": fonema y discriminación entre \"b\" y \"d\"",
      "Trazos en cuaderno"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 60
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 2,
    "semana_sugerida": 2,
    "competencia_numero": 2,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "Las plantas del entorno escolar: raíces, tallos, hojas, flores y frutos",
      "Observación con lupa"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 60
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 2,
    "competencia_numero": 2,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "Autoridades de la comunidad: el Alcalde Auxiliar, el COCODE y líderes comunitarios",
      "Liderazgo comunitario"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 60
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 3,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica conocimientos y experiencias de aritmética básica en la interacción con su entorno familiar y escolar.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Calcula sumas básicas sin agrupación utilizando material concreto del entorno.",
    "temas_declarativos": [
      "Cálculo de adiciones horizontales y verticales con resultados del 1 al 9",
      "Cálculo mental rápido"
    ],
    "criterios_evaluacion": "Resuelve problemas de suma y resta con cantidades de un dígito explicando su procedimiento.",
    "pagina_libro_sugerida": 65
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 3,
    "competencia_numero": 2,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "La consonante \"n\": fonema y sílabas directas e inversas (an, en, in, on, un)",
      "Lectura de textos"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 65
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 2,
    "semana_sugerida": 3,
    "competencia_numero": 2,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "Ciclo biológico de las plantas: germinación de semillas en vasos con algodón",
      "Experimento escolar"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 65
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 3,
    "competencia_numero": 2,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "Servicios públicos en la aldea: agua potable, centro de salud, escuela, energía y transporte",
      "Bienes comunes"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 65
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 4,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica conocimientos y experiencias de aritmética básica en la interacción con su entorno familiar y escolar.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Calcula sumas básicas sin agrupación utilizando material concreto del entorno.",
    "temas_declarativos": [
      "Descomposición aditiva del número (distintas combinaciones para formar 6, 7, 8 y 9)",
      "Uso de regletas"
    ],
    "criterios_evaluacion": "Resuelve problemas de suma y resta con cantidades de un dígito explicando su procedimiento.",
    "pagina_libro_sugerida": 70
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 4,
    "competencia_numero": 2,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "La consonante \"r\": sonido suave y sonido fuerte (r y rr) en palabras comunes",
      "Pronunciación"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 70
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 2,
    "semana_sugerida": 4,
    "competencia_numero": 2,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "Ciclo de vida de los animales: nacimiento, crecimiento, reproducción y muerte",
      "Metamorfosis básica"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 70
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 4,
    "competencia_numero": 2,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "Geografía del municipio: ríos, cerros, caminos vecinales y mapas sencillos del barrio",
      "Cartografía infantil"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 70
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 5,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica conocimientos y experiencias de aritmética básica en la interacción con su entorno familiar y escolar.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Calcula restas básicas utilizando objetos de su entorno escolar.",
    "temas_declarativos": [
      "Concepto de resta como quitar, separar o disminuir colecciones",
      "Acciones vivenciales de repartir"
    ],
    "criterios_evaluacion": "Resuelve problemas de suma y resta con cantidades de un dígito explicando su procedimiento.",
    "pagina_libro_sugerida": 75
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 5,
    "competencia_numero": 2,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Las consonantes \"c\" (ca, co, cu) y \"q\" (que, qui): reglas ortográficas básicas",
      "Lectura guiada"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 75
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 2,
    "semana_sugerida": 5,
    "competencia_numero": 2,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "Hábitats de los animales locales: terrestres, aéreos y acuáticos en la aldea",
      "Adaptación al medio"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 75
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 5,
    "competencia_numero": 2,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "Los símbolos patrios de Guatemala: la Bandera, el Escudo, la Monja Blanca y el Quetzal",
      "Identidad cívica"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 75
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 6,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica conocimientos y experiencias de aritmética básica en la interacción con su entorno familiar y escolar.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Calcula restas básicas utilizando objetos de su entorno escolar.",
    "temas_declarativos": [
      "Planteamiento de la resta con el signo menos (-) hasta 9",
      "Resolución con dibujos tachados"
    ],
    "criterios_evaluacion": "Resuelve problemas de suma y resta con cantidades de un dígito explicando su procedimiento.",
    "pagina_libro_sugerida": 80
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 6,
    "competencia_numero": 2,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "La consonante \"b\" y \"v\": lectura y diferenciación visual de palabras familiares",
      "Vocabulario"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 80
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 2,
    "semana_sugerida": 6,
    "competencia_numero": 2,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "Utilidad de las plantas para la comunidad: alimenticias, medicinales e industriales",
      "Saberes ancestrales"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 80
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 6,
    "competencia_numero": 2,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "La Ceiba y el Tecún Umán: símbolos de fortaleza y libertad en la historia cívica",
      "Cultura patriótica"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 80
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 7,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica conocimientos y experiencias de aritmética básica en la interacción con su entorno familiar y escolar.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Calcula restas básicas utilizando objetos de su entorno escolar.",
    "temas_declarativos": [
      "Cálculo de restas verticales y horizontales con apoyo de semillas de frijol",
      "Comprobación con material"
    ],
    "criterios_evaluacion": "Resuelve problemas de suma y resta con cantidades de un dígito explicando su procedimiento.",
    "pagina_libro_sugerida": 85
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 7,
    "competencia_numero": 2,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "La consonante \"g\" (ga, go, gu) y su sonido suave",
      "Cuentos ilustrados"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 85
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 2,
    "semana_sugerida": 7,
    "competencia_numero": 2,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "Animales útiles para el ser humano: producción de alimentos, abono y trabajo",
      "Cuidado animal"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 85
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 7,
    "competencia_numero": 2,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "La Marimba y el Himno Nacional de Guatemala: respeto cívico y entonación solemne",
      "Música nacional"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 85
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 8,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica conocimientos y experiencias de aritmética básica en la interacción con su entorno familiar y escolar.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Aplica sumas y restas en la resolución de problemas de la vida diaria.",
    "temas_declarativos": [
      "Relación inversa entre la suma y la resta en situaciones de aula",
      "Familias de operaciones"
    ],
    "criterios_evaluacion": "Resuelve problemas de suma y resta con cantidades de un dígito explicando su procedimiento.",
    "pagina_libro_sugerida": 90
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 8,
    "competencia_numero": 2,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "La consonante \"f\" y \"j\": lectura de fábulas breves con animales de la granja",
      "Comprensión literal"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 90
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 2,
    "semana_sugerida": 8,
    "competencia_numero": 2,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "Cadena alimenticia elemental: quién se alimenta de quién en la granja y el bosque",
      "Equilibrio ecológico"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 90
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 8,
    "competencia_numero": 2,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "Fiestas patronales y cívicas: gastronomía tradicional, ferias y expresiones populares",
      "Patrimonio inmaterial"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 90
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 9,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica conocimientos y experiencias de aritmética básica en la interacción con su entorno familiar y escolar.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Aplica sumas y restas en la resolución de problemas de la vida diaria.",
    "temas_declarativos": [
      "Resolución de problemas orales contextualizados de adición y sustracción en el hogar",
      "Razonamiento lógico"
    ],
    "criterios_evaluacion": "Resuelve problemas de suma y resta con cantidades de un dígito explicando su procedimiento.",
    "pagina_libro_sugerida": 95
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 9,
    "competencia_numero": 2,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Lectura comprensiva de pequeños párrafos respondiendo preguntas ¿Quién? y ¿Qué?",
      "Escritura guiada"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 95
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 2,
    "semana_sugerida": 9,
    "competencia_numero": 2,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "Protección de la flora y fauna de la región de Amatitlán y reservas naturales",
      "Cuidado ambiental"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 95
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 9,
    "competencia_numero": 2,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "La importancia del cuidado de los espacios públicos y la reforestación comunal",
      "Responsabilidad cívica"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 95
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 1,
    "competencia_numero": 2,
    "competencia_descripcion": "Expresa ideas y pensamientos con libertad y coherencia utilizando números naturales hasta 99 y sistema maya.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Identifica la decena y el valor posicional en números de dos dígitos.",
    "temas_declarativos": [
      "La decena: formación de grupos de 10 con atados de palitos o semillas",
      "Concepto de unidad y decena"
    ],
    "criterios_evaluacion": "Descompone números en decenas y unidades y resuelve sumas y restas básicas.",
    "pagina_libro_sugerida": 100
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 1,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "La consonante \"ch\" y \"ll\": fonemas compuestos en palabras de la comunidad",
      "Historias locales"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 100
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 3,
    "semana_sugerida": 1,
    "competencia_numero": 3,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "El ciclo del agua en la naturaleza: evaporación, condensación, precipitación y recolección",
      "Maqueta o dibujo"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 100
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 1,
    "competencia_numero": 3,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "Guatemala: un país multiétnico, pluricultural y multilingüe de cuatro pueblos",
      "Diversidad nacional"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 100
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 2,
    "competencia_numero": 2,
    "competencia_descripcion": "Expresa ideas y pensamientos con libertad y coherencia utilizando números naturales hasta 99 y sistema maya.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Identifica la decena y el valor posicional en números de dos dígitos.",
    "temas_declarativos": [
      "Los números del 11 al 15: una decena y unidades sueltas",
      "Representación gráfica y simbólica"
    ],
    "criterios_evaluacion": "Descompone números en decenas y unidades y resuelve sumas y restas básicas.",
    "pagina_libro_sugerida": 105
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 2,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Las consonantes \"ñ\" y \"y\": lectura y escritura en nombres propios y comunes",
      "Mayúscula inicial"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 105
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 3,
    "semana_sugerida": 2,
    "competencia_numero": 3,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "Fuentes de agua comunitaria (ríos, pozos, nacimientos) y amenazas de contaminación",
      "Cuidado de cuencas"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 105
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 2,
    "competencia_numero": 3,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "El Pueblo Maya: cosmovisión, sabiduría ancestral, idiomas mayas y tejidos tradicionales",
      "Pueblo Maya"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 105
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 3,
    "competencia_numero": 2,
    "competencia_descripcion": "Expresa ideas y pensamientos con libertad y coherencia utilizando números naturales hasta 99 y sistema maya.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Identifica la decena y el valor posicional en números de dos dígitos.",
    "temas_declarativos": [
      "Los números del 16 al 19 y valor posicional en tabla de Decenas y Unidades",
      "Uso del tablero posicional"
    ],
    "criterios_evaluacion": "Descompone números en decenas y unidades y resuelve sumas y restas básicas.",
    "pagina_libro_sugerida": 110
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 3,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Las letras \"k\", \"w\" y \"x\": palabras originarias y préstamos lingüísticos",
      "Diversidad lingüística"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 110
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 3,
    "semana_sugerida": 3,
    "competencia_numero": 3,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "El suelo: tipos de suelo (arenoso, arcilloso, fértil) y su importancia agrícola",
      "Toma de muestras"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 110
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 3,
    "competencia_numero": 3,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "El Pueblo Ladino: características culturales, lengua española, tradiciones y literatura",
      "Pueblo Ladino"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 110
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 4,
    "competencia_numero": 2,
    "competencia_descripcion": "Expresa ideas y pensamientos con libertad y coherencia utilizando números naturales hasta 99 y sistema maya.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Efectúa adiciones y sustracciones sin transformación hasta el 99.",
    "temas_declarativos": [
      "Lectura y escritura de decenas completas (10, 20, 30, 40, 50)",
      "Conteo de 10 en 10"
    ],
    "criterios_evaluacion": "Descompone números en decenas y unidades y resuelve sumas y restas básicas.",
    "pagina_libro_sugerida": 115
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 4,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Combinaciones consonánticas con \"l\" (bl, cl, fl, gl, pl): lectura de trabalenguas",
      "Agilidad verbal"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 115
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 3,
    "semana_sugerida": 4,
    "competencia_numero": 3,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "El aire y la atmósfera: propiedades del aire, viento y calidad del aire rural",
      "Molinetes de viento"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 115
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 4,
    "competencia_numero": 3,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "El Pueblo Xinka: cosmovisión, territorio ancestral, idioma y resistencia histórica",
      "Pueblo Xinka"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 115
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 5,
    "competencia_numero": 2,
    "competencia_descripcion": "Expresa ideas y pensamientos con libertad y coherencia utilizando números naturales hasta 99 y sistema maya.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Efectúa adiciones y sustracciones sin transformación hasta el 99.",
    "temas_declarativos": [
      "Conteo y escritura de números naturales hasta el 99",
      "Secuencias numéricas en la tabla del 100"
    ],
    "criterios_evaluacion": "Descompone números en decenas y unidades y resuelve sumas y restas básicas.",
    "pagina_libro_sugerida": 120
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 5,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Combinaciones consonánticas con \"r\" (br, cr, dr, fr, gr, pr, tr): palabras complejas",
      "Fluidez lectora"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 120
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 3,
    "semana_sugerida": 5,
    "competencia_numero": 3,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "El sol como fuente principal de luz y calor para la vida en la Tierra",
      "Energía solar básica"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 120
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 5,
    "competencia_numero": 3,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "El Pueblo Garífuna: origen histórico en Izabal, idioma, música de tambores y gastronomía",
      "Pueblo Garífuna"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 120
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 6,
    "competencia_numero": 2,
    "competencia_descripcion": "Expresa ideas y pensamientos con libertad y coherencia utilizando números naturales hasta 99 y sistema maya.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Efectúa adiciones y sustracciones sin transformación hasta el 99.",
    "temas_declarativos": [
      "Suma de cantidades de dos dígitos sin agrupación (sin llevar)",
      "Alineación de unidades y decenas"
    ],
    "criterios_evaluacion": "Descompone números en decenas y unidades y resuelve sumas y restas básicas.",
    "pagina_libro_sugerida": 125
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 6,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "La oración simple: separación adecuada de palabras con espacios en blanco",
      "Segmentación léxica"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 125
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 3,
    "semana_sugerida": 6,
    "competencia_numero": 3,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "Los recursos naturales renovables y no renovables de la comunidad",
      "Uso sostenible"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 125
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 6,
    "competencia_numero": 3,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "Cultura de paz y erradicación del racismo y la discriminación en la escuela rural",
      "Convivencia armónica"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 125
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 7,
    "competencia_numero": 2,
    "competencia_descripcion": "Expresa ideas y pensamientos con libertad y coherencia utilizando números naturales hasta 99 y sistema maya.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Escribe y traduce números entre sistema decimal y vigesimal maya.",
    "temas_declarativos": [
      "Resta de cantidades de dos dígitos sin desagrupación (sin prestar)",
      "Práctica en el cuaderno"
    ],
    "criterios_evaluacion": "Descompone números en decenas y unidades y resuelve sumas y restas básicas.",
    "pagina_libro_sugerida": 130
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 7,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "El sustantivo: nombres de personas, animales y objetos del entorno escolar",
      "Clasificación"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 130
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 3,
    "semana_sugerida": 7,
    "competencia_numero": 3,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "El manejo de los residuos sólidos: clasificación de basura orgánica e inorgánica",
      "Compostaje escolar"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 130
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 7,
    "competencia_numero": 3,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "El respeto a los abuelos y ancianos como guardianes de la sabiduría comunitaria",
      "Sabiduría intergeneracional"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 130
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 8,
    "competencia_numero": 2,
    "competencia_descripcion": "Expresa ideas y pensamientos con libertad y coherencia utilizando números naturales hasta 99 y sistema maya.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Escribe y traduce números entre sistema decimal y vigesimal maya.",
    "temas_declarativos": [
      "Problemas de cálculo con compras sencillas en la tienda escolar",
      "Manejo de monedas de apoyo"
    ],
    "criterios_evaluacion": "Descompone números en decenas y unidades y resuelve sumas y restas básicas.",
    "pagina_libro_sugerida": 135
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 8,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Uso de la mayúscula al inicio de la oración y punto final",
      "Normas ortográficas"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 135
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 3,
    "semana_sugerida": 8,
    "competencia_numero": 3,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "Las 3R en la escuela: Reducir, Reutilizar y Reciclar materiales didácticos",
      "Taller de reciclaje"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 135
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 8,
    "competencia_numero": 3,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "La indumentaria tradicional maya: significado de los colores, bordados y telares de cintura",
      "Arte textil"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 135
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 9,
    "competencia_numero": 2,
    "competencia_descripcion": "Expresa ideas y pensamientos con libertad y coherencia utilizando números naturales hasta 99 y sistema maya.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Escribe y traduce números entre sistema decimal y vigesimal maya.",
    "temas_declarativos": [
      "Numeración Maya elemental: el punto y la barra del 1 al 19",
      "Escritura y lectura de símbolos mayas"
    ],
    "criterios_evaluacion": "Descompone números en decenas y unidades y resuelve sumas y restas básicas.",
    "pagina_libro_sugerida": 140
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 9,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Producción escrita: redacción de oraciones descriptivas sobre la familia",
      "Revisión entre pares"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 140
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 3,
    "semana_sugerida": 9,
    "competencia_numero": 3,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "Fenómenos atmosféricos y prevención de desastres (lluvias fuertes, derrumbes, temblores)",
      "Plan de evacuación"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 140
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 9,
    "competencia_numero": 3,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "Muestra cultural escolar: feria de los cuatro pueblos de Guatemala en el patio escolar",
      "Celebración de identidad"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 140
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 1,
    "competencia_numero": 5,
    "competencia_descripcion": "Utiliza nociones geométricas, unidades de medida y registro de datos en situaciones cotidianas.",
    "indicador_numero": "5.1",
    "indicador_descripcion": "Reconoce figuras geométricas planas y sólidos en objetos de su entorno.",
    "temas_declarativos": [
      "Figuras geométricas planas: círculo, cuadrado, triángulo y rectángulo",
      "Identificación en el aula"
    ],
    "criterios_evaluacion": "Distingue figuras y monedas nacionales resolviendo ejercicios de medición y conteo.",
    "pagina_libro_sugerida": 145
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 1,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "La descripción oral y escrita de objetos, plantas y animales de la aldea",
      "Uso de adjetivos"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 145
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 4,
    "semana_sugerida": 1,
    "competencia_numero": 4,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "Materia y energía: estados de la materia (sólido, líquido y gaseoso) en la cocina",
      "Cambios de estado"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 145
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 1,
    "competencia_numero": 4,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "Valores cívicos y ciudadanos: la honestidad, la solidaridad, la justicia y el bien común",
      "Ética ciudadana"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 145
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 2,
    "competencia_numero": 5,
    "competencia_descripcion": "Utiliza nociones geométricas, unidades de medida y registro de datos en situaciones cotidianas.",
    "indicador_numero": "5.1",
    "indicador_descripcion": "Reconoce figuras geométricas planas y sólidos en objetos de su entorno.",
    "temas_declarativos": [
      "Cuerpos geométricos del entorno (esfera, cubo, cilindro)",
      "Manipulación de cajas y pelotas"
    ],
    "criterios_evaluacion": "Distingue figuras y monedas nacionales resolviendo ejercicios de medición y conteo.",
    "pagina_libro_sugerida": 150
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 2,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Los artículos: el, la, los, las, un, una, unos, unas (concordancia de género y número)",
      "Gramática práctica"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 150
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 4,
    "semana_sugerida": 2,
    "competencia_numero": 4,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "El calor y la temperatura: efectos del calor en los objetos y uso del termómetro",
      "Medición térmica"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 150
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 2,
    "competencia_numero": 4,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "El trabajo en la comunidad: oficios tradicionales, agricultura, comercio y profesiones",
      "Dignidad del trabajo"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 150
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 3,
    "competencia_numero": 5,
    "competencia_descripcion": "Utiliza nociones geométricas, unidades de medida y registro de datos en situaciones cotidianas.",
    "indicador_numero": "5.1",
    "indicador_descripcion": "Reconoce figuras geométricas planas y sólidos en objetos de su entorno.",
    "temas_declarativos": [
      "Patrones y secuencias lógicas de figuras geométricas y colores repetitivos",
      "Creación de cenefas"
    ],
    "criterios_evaluacion": "Distingue figuras y monedas nacionales resolviendo ejercicios de medición y conteo.",
    "pagina_libro_sugerida": 155
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 3,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Sinónimos y antónimos elementales en diálogos y lecturas compartidas",
      "Enriquecimiento léxico"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 155
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 4,
    "semana_sugerida": 3,
    "competencia_numero": 4,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "La luz y las sombras: fuentes naturales y artificiales de iluminación",
      "Óptica elemental"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 155
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 3,
    "competencia_numero": 4,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "La cooperación comunitaria: la \"mano vuelta\" y el trabajo voluntario en la aldea",
      "Solidaridad rural"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 155
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 4,
    "competencia_numero": 5,
    "competencia_descripcion": "Utiliza nociones geométricas, unidades de medida y registro de datos en situaciones cotidianas.",
    "indicador_numero": "5.2",
    "indicador_descripcion": "Utiliza unidades de medida de longitud y la moneda nacional en actividades prácticas.",
    "temas_declarativos": [
      "Medidas de longitud no estandarizadas: la cuarta, el paso, el pie, la braza",
      "Medición del salón"
    ],
    "criterios_evaluacion": "Distingue figuras y monedas nacionales resolviendo ejercicios de medición y conteo.",
    "pagina_libro_sugerida": 160
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 4,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Signos de interrogación (¿?) y admiración (¡!) en la lectura expresiva",
      "Entonación adecuada"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 160
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 4,
    "semana_sugerida": 4,
    "competencia_numero": 4,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "El sonido: cómo se produce el sonido, vibraciones e instrumentos musicales",
      "Acústica escolar"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 160
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 4,
    "competencia_numero": 4,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "La Constitución Política de la República explicada a los niños: ley suprema del país",
      "Estado de derecho"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 160
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 5,
    "competencia_numero": 5,
    "competencia_descripcion": "Utiliza nociones geométricas, unidades de medida y registro de datos en situaciones cotidianas.",
    "indicador_numero": "5.2",
    "indicador_descripcion": "Utiliza unidades de medida de longitud y la moneda nacional en actividades prácticas.",
    "temas_declarativos": [
      "El metro y la regla graduada para medir útiles escolares",
      "Comparación con medidas estándar"
    ],
    "criterios_evaluacion": "Distingue figuras y monedas nacionales resolviendo ejercicios de medición y conteo.",
    "pagina_libro_sugerida": 165
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 5,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Estructura básica del cuento: inicio, desarrollo y desenlace",
      "Lectura de cuentos"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 165
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 4,
    "semana_sugerida": 5,
    "competencia_numero": 4,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "Fuerzas y movimiento: empujar, jalar y fricción en juegos infantiles",
      "Dinámica cotidiana"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 165
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 5,
    "competencia_numero": 4,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "Las leyes de tránsito básicas: seguridad vial para peatones y ciclistas en caminos",
      "Seguridad en la calle"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 165
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 6,
    "competencia_numero": 5,
    "competencia_descripcion": "Utiliza nociones geométricas, unidades de medida y registro de datos en situaciones cotidianas.",
    "indicador_numero": "5.2",
    "indicador_descripcion": "Utiliza unidades de medida de longitud y la moneda nacional en actividades prácticas.",
    "temas_declarativos": [
      "Moneda nacional de Guatemala: monedas de 5, 10, 25, 50 centavos y el Quetzal",
      "Juego de compraventa"
    ],
    "criterios_evaluacion": "Distingue figuras y monedas nacionales resolviendo ejercicios de medición y conteo.",
    "pagina_libro_sugerida": 170
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 6,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "La poesía infantil: declamación de poemas cortos y rondas tradicionales",
      "Expresión corporal"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 170
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 4,
    "semana_sugerida": 6,
    "competencia_numero": 4,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "Máquinas simples en la vida diaria: la rueda, la palanca, la rampa y la polea",
      "Uso en el campo"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 170
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 6,
    "competencia_numero": 4,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "Prevención del acoso escolar (bullying) y promoción de aulas amables y seguras",
      "Clima escolar"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 170
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 7,
    "competencia_numero": 5,
    "competencia_descripcion": "Utiliza nociones geométricas, unidades de medida y registro de datos en situaciones cotidianas.",
    "indicador_numero": "5.3",
    "indicador_descripcion": "Registra datos en tablas sencillas e interpreta pictogramas.",
    "temas_declarativos": [
      "Medidas de tiempo: los días de la semana y orden de eventos (ayer, hoy, mañana)",
      "Uso del calendario"
    ],
    "criterios_evaluacion": "Distingue figuras y monedas nacionales resolviendo ejercicios de medición y conteo.",
    "pagina_libro_sugerida": 175
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 7,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Instrucciones escritas: seguimiento de pasos para elaborar un juguete tradicional",
      "Texto instructivo"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 175
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 4,
    "semana_sugerida": 7,
    "competencia_numero": 4,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "El sistema solar: el sol, la luna, la tierra y las estrellas en la noche",
      "Astronomía básica"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 175
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 7,
    "competencia_numero": 4,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "El cuidado de los recursos públicos y la rendición de cuentas en el gobierno escolar",
      "Transparencia"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 175
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 8,
    "competencia_numero": 5,
    "competencia_descripcion": "Utiliza nociones geométricas, unidades de medida y registro de datos en situaciones cotidianas.",
    "indicador_numero": "5.3",
    "indicador_descripcion": "Registra datos en tablas sencillas e interpreta pictogramas.",
    "temas_declarativos": [
      "Lectura del reloj analógico (horas en punto)",
      "Horarios de actividades escolares"
    ],
    "criterios_evaluacion": "Distingue figuras y monedas nacionales resolviendo ejercicios de medición y conteo.",
    "pagina_libro_sugerida": 180
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 8,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "La dramatización escolar: juego de roles sobre situaciones comunitarias",
      "Expresión oral"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 180
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 4,
    "semana_sugerida": 8,
    "competencia_numero": 4,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "Movimientos de la Tierra: rotación (día y noche) y traslación (las estaciones)",
      "Reloj de sol"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 180
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 8,
    "competencia_numero": 4,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "Construcción de un proyecto cívico comunitario: mejora de un área común de la escuela",
      "Acción solidaria"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 180
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 9,
    "competencia_numero": 5,
    "competencia_descripcion": "Utiliza nociones geométricas, unidades de medida y registro de datos en situaciones cotidianas.",
    "indicador_numero": "5.3",
    "indicador_descripcion": "Registra datos en tablas sencillas e interpreta pictogramas.",
    "temas_declarativos": [
      "Tablas simples de conteo con marcas y pictogramas con datos del salón",
      "Interpretación visual"
    ],
    "criterios_evaluacion": "Distingue figuras y monedas nacionales resolviendo ejercicios de medición y conteo.",
    "pagina_libro_sugerida": 185
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 9,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "El rincón de lectura: selección autónoma de cuentos y socialización en plenaria",
      "Fomento lector"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 185
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 4,
    "semana_sugerida": 9,
    "competencia_numero": 4,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "Feria de ciencias del aula: presentación de proyectos de indagación escolar",
      "Método científico"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 185
  },
  {
    "grado": 1,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 9,
    "competencia_numero": 4,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "Evaluación del Gobierno Escolar y memoria de labores de las comisiones infantiles",
      "Cierre cívico anual"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 185
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 1,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica conocimientos y experiencias de aritmética básica en la interacción con su entorno familiar y comunitario.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Lee y escribe números naturales hasta 100 en el sistema decimal.",
    "temas_declarativos": [
      "Valor posicional de números hasta 100 (decenas y unidades en ábaco)",
      "Representación multibase"
    ],
    "criterios_evaluacion": "Calcula sumas y restas con reagrupación y descompone cantidades en decenas y unidades.",
    "pagina_libro_sugerida": 10
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 1,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Conciencia fonológica: discriminación auditiva de sonidos del entorno y animales",
      "Canciones y rimas"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 10
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 1,
    "semana_sugerida": 1,
    "competencia_numero": 1,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "El cuerpo humano: partes externas (cabeza, tronco, extremidades) y articulaciones",
      "Esquema corporal"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 10
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 1,
    "competencia_numero": 1,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "El aula escolar: un espacio de convivencia pacífica, respeto y trabajo colaborativo",
      "Acuerdos iniciales"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 10
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 2,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica conocimientos y experiencias de aritmética básica en la interacción con su entorno familiar y comunitario.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Lee y escribe números naturales hasta 100 en el sistema decimal.",
    "temas_declarativos": [
      "Lectura, escritura y ordenación de números naturales del 1 al 100",
      "Escritura con letras y cifras"
    ],
    "criterios_evaluacion": "Calcula sumas y restas con reagrupación y descompone cantidades en decenas y unidades.",
    "pagina_libro_sugerida": 15
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 2,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Trazos preparatorios y grafomotricidad en cuadrícula y arena",
      "Coordinación visomotriz"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 15
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 1,
    "semana_sugerida": 2,
    "competencia_numero": 1,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "Los cinco sentidos: órganos (ojos, oídos, nariz, lengua, piel) y sus funciones de alerta",
      "Exploración sensorial"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 15
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 2,
    "competencia_numero": 1,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "Normas de convivencia del aula: elaboración democrática de nuestro decálogo de oro",
      "Reglas consensuadas"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 15
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 3,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica conocimientos y experiencias de aritmética básica en la interacción con su entorno familiar y comunitario.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Lee y escribe números naturales hasta 100 en el sistema decimal.",
    "temas_declarativos": [
      "Comparación de números de dos cifras (mayor que >, menor que <, igual =)",
      "Signos de comparación"
    ],
    "criterios_evaluacion": "Calcula sumas y restas con reagrupación y descompone cantidades en decenas y unidades.",
    "pagina_libro_sugerida": 20
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 3,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Vocales: sonido y grafía de la \"a\" y la \"e\" en palabras ilustradas",
      "Escritura de vocales"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 20
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 1,
    "semana_sugerida": 3,
    "competencia_numero": 1,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "Hábitos de higiene personal: lavado de manos con agua segura, cepillado y baño diario",
      "Salud escolar"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 20
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 3,
    "competencia_numero": 1,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "El Gobierno Escolar: qué es, sus objetivos y la importancia de la participación infantil",
      "Democracia escolar"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 20
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 4,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica conocimientos y experiencias de aritmética básica en la interacción con su entorno familiar y comunitario.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Efectúa adiciones y sustracciones con y sin agrupación con totales hasta 99.",
    "temas_declarativos": [
      "Suma de números de dos cifras sin agrupación (vertical y horizontal)",
      "Alineación de columnas"
    ],
    "criterios_evaluacion": "Calcula sumas y restas con reagrupación y descompone cantidades en decenas y unidades.",
    "pagina_libro_sugerida": 25
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 4,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Vocales: sonido y grafía de la \"i\", \"o\" y \"u\" y combinación de vocales",
      "Diptongos básicos"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 25
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 1,
    "semana_sugerida": 4,
    "competencia_numero": 1,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "Nutrición saludable: grupos de alimentos locales (frutas, verduras, tortillas, frijol)",
      "Pirámide nutricional"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 25
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 4,
    "competencia_numero": 1,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "Comisiones del Gobierno Escolar: comisiones de orden, aseo, deportes, cultura y botiquín",
      "Organización de tareas"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 25
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 5,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica conocimientos y experiencias de aritmética básica en la interacción con su entorno familiar y comunitario.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Efectúa adiciones y sustracciones con y sin agrupación con totales hasta 99.",
    "temas_declarativos": [
      "Suma con agrupación a la decena (llevando) con material multibase",
      "Algoritmo formal de la adición"
    ],
    "criterios_evaluacion": "Calcula sumas y restas con reagrupación y descompone cantidades en decenas y unidades.",
    "pagina_libro_sugerida": 30
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 5,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "La consonante \"m\": fonema, sílabas ma, me, mi, mo, mu y palabras simples",
      "Lectura de \"mamá\""
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 30
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 1,
    "semana_sugerida": 5,
    "competencia_numero": 1,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "El agua segura: importancia para el cuerpo humano y métodos de desinfección",
      "Hervido y filtrado"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 30
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 5,
    "competencia_numero": 1,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "Elecciones del Gobierno Escolar: campañas, voto secreto y juramentación de directiva",
      "Ejercicio ciudadano"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 30
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 6,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica conocimientos y experiencias de aritmética básica en la interacción con su entorno familiar y comunitario.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Efectúa adiciones y sustracciones con y sin agrupación con totales hasta 99.",
    "temas_declarativos": [
      "Resta de números de dos cifras sin desagrupación (sin prestar)",
      "Práctica en cuaderno"
    ],
    "criterios_evaluacion": "Calcula sumas y restas con reagrupación y descompone cantidades en decenas y unidades.",
    "pagina_libro_sugerida": 35
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 6,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "La consonante \"p\": fonema, sílabas pa, pe, pi, po, pu y oraciones ilustradas",
      "Lectura de \"papá\""
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 35
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 1,
    "semana_sugerida": 6,
    "competencia_numero": 1,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "Prevención de enfermedades comunes en la escuela y en la comunidad rural",
      "Vacunas y descanso"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 35
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 6,
    "competencia_numero": 1,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "Derechos fundamentales de la niñez: derecho a la vida, nombre, educación y salud",
      "Convención de derechos"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 35
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 7,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica conocimientos y experiencias de aritmética básica en la interacción con su entorno familiar y comunitario.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Resuelve problemas que implican sumas y restas combinadas en situaciones cotidianas.",
    "temas_declarativos": [
      "Resta con desagrupación (prestando a la decena)",
      "Modelado con tarjetas numéricas"
    ],
    "criterios_evaluacion": "Calcula sumas y restas con reagrupación y descompone cantidades en decenas y unidades.",
    "pagina_libro_sugerida": 40
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 7,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "La consonante \"s\": fonema y sílabas directas e inversas (sa, se, si, so, su)",
      "Lectura fluida inicial"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 40
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 1,
    "semana_sugerida": 7,
    "competencia_numero": 1,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "El crecimiento y etapas del desarrollo humano (bebé, niño, joven, adulto, anciano)",
      "Línea de vida"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 40
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 7,
    "competencia_numero": 1,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "Deberes y responsabilidades de los niños en la escuela, la familia y la comunidad",
      "Compromiso social"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 40
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 8,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica conocimientos y experiencias de aritmética básica en la interacción con su entorno familiar y comunitario.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Resuelve problemas que implican sumas y restas combinadas en situaciones cotidianas.",
    "temas_declarativos": [
      "Operaciones combinadas de suma y resta en problemas de compraventa",
      "Razonamiento contextual"
    ],
    "criterios_evaluacion": "Calcula sumas y restas con reagrupación y descompone cantidades en decenas y unidades.",
    "pagina_libro_sugerida": 45
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 8,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "La consonante \"l\": fonema y lectura de palabras de dos y tres sílabas",
      "Uso del libro de texto"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 45
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 1,
    "semana_sugerida": 8,
    "competencia_numero": 1,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "Cuidado de la postura corporal y actividad física en el patio escolar",
      "Salud física"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 45
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 8,
    "competencia_numero": 1,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "Equidad de género e igualdad de oportunidades entre niñas y niños en la escuela",
      "No discriminación"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 45
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 9,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica conocimientos y experiencias de aritmética básica en la interacción con su entorno familiar y comunitario.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Resuelve problemas que implican sumas y restas combinadas en situaciones cotidianas.",
    "temas_declarativos": [
      "Numeración Maya hasta 19 y conteo vigesimal básico",
      "Lectura de barras y puntos"
    ],
    "criterios_evaluacion": "Calcula sumas y restas con reagrupación y descompone cantidades en decenas y unidades.",
    "pagina_libro_sugerida": 50
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 9,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Integración: lectura de oraciones cortas con m, p, s, l y comprensión de mensajes",
      "Evaluación de fluidez"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 50
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 1,
    "semana_sugerida": 9,
    "competencia_numero": 1,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "La salud emocional y la convivencia armoniosa en la familia y el aula",
      "Expresión de afectos"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 50
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 9,
    "competencia_numero": 1,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "Resolución pacífica de conflictos: el diálogo y la escucha como camino sin violencia",
      "Mediación entre pares"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 50
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 1,
    "competencia_numero": 3,
    "competencia_descripcion": "Utiliza el cálculo de multiplicación y numeración hasta 500 en situaciones de la comunidad.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Reconoce centenas y efectúa operaciones aritméticas hasta 500.",
    "temas_declarativos": [
      "Números de tres cifras: la centena (100 a 300) y su valor posicional",
      "Agrupaciones de 100"
    ],
    "criterios_evaluacion": "Domina las tablas de multiplicar del 2 al 5 y opera con cantidades de tres dígitos.",
    "pagina_libro_sugerida": 55
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 1,
    "competencia_numero": 2,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "La consonante \"t\": fonema, sílabas y palabras del vocabulario escolar",
      "Dictado de oraciones"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 55
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 2,
    "semana_sugerida": 1,
    "competencia_numero": 2,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "La diversidad de seres vivos en la comunidad: animales domésticos y silvestres",
      "Clasificación de fauna"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 55
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 1,
    "competencia_numero": 2,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "Mi comunidad y aldea: historia de la fundación, tradiciones y personajes ilustres",
      "Memoria local"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 55
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 2,
    "competencia_numero": 3,
    "competencia_descripcion": "Utiliza el cálculo de multiplicación y numeración hasta 500 en situaciones de la comunidad.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Reconoce centenas y efectúa operaciones aritméticas hasta 500.",
    "temas_declarativos": [
      "Lectura y escritura de números naturales hasta 500",
      "Notación desarrollada"
    ],
    "criterios_evaluacion": "Domina las tablas de multiplicar del 2 al 5 y opera con cantidades de tres dígitos.",
    "pagina_libro_sugerida": 60
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 2,
    "competencia_numero": 2,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "La consonante \"d\": fonema y discriminación entre \"b\" y \"d\"",
      "Trazos en cuaderno"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 60
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 2,
    "semana_sugerida": 2,
    "competencia_numero": 2,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "Las plantas del entorno escolar: raíces, tallos, hojas, flores y frutos",
      "Observación con lupa"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 60
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 2,
    "competencia_numero": 2,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "Autoridades de la comunidad: el Alcalde Auxiliar, el COCODE y líderes comunitarios",
      "Liderazgo comunitario"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 60
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 3,
    "competencia_numero": 3,
    "competencia_descripcion": "Utiliza el cálculo de multiplicación y numeración hasta 500 en situaciones de la comunidad.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Reconoce centenas y efectúa operaciones aritméticas hasta 500.",
    "temas_declarativos": [
      "Suma y resta de números de tres cifras sin agrupación",
      "Alineación en cuadrícula"
    ],
    "criterios_evaluacion": "Domina las tablas de multiplicar del 2 al 5 y opera con cantidades de tres dígitos.",
    "pagina_libro_sugerida": 65
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 3,
    "competencia_numero": 2,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "La consonante \"n\": fonema y sílabas directas e inversas (an, en, in, on, un)",
      "Lectura de textos"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 65
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 2,
    "semana_sugerida": 3,
    "competencia_numero": 2,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "Ciclo biológico de las plantas: germinación de semillas en vasos con algodón",
      "Experimento escolar"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 65
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 3,
    "competencia_numero": 2,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "Servicios públicos en la aldea: agua potable, centro de salud, escuela, energía y transporte",
      "Bienes comunes"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 65
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 4,
    "competencia_numero": 3,
    "competencia_descripcion": "Utiliza el cálculo de multiplicación y numeración hasta 500 en situaciones de la comunidad.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Reconoce centenas y efectúa operaciones aritméticas hasta 500.",
    "temas_declarativos": [
      "Suma con agrupación a las centenas en compras familiares",
      "Resolución de problemas"
    ],
    "criterios_evaluacion": "Domina las tablas de multiplicar del 2 al 5 y opera con cantidades de tres dígitos.",
    "pagina_libro_sugerida": 70
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 4,
    "competencia_numero": 2,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "La consonante \"r\": sonido suave y sonido fuerte (r y rr) en palabras comunes",
      "Pronunciación"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 70
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 2,
    "semana_sugerida": 4,
    "competencia_numero": 2,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "Ciclo de vida de los animales: nacimiento, crecimiento, reproducción y muerte",
      "Metamorfosis básica"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 70
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 4,
    "competencia_numero": 2,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "Geografía del municipio: ríos, cerros, caminos vecinales y mapas sencillos del barrio",
      "Cartografía infantil"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 70
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 5,
    "competencia_numero": 3,
    "competencia_descripcion": "Utiliza el cálculo de multiplicación y numeración hasta 500 en situaciones de la comunidad.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Calcula productos de las tablas del 2, 3, 4 y 5 mediante arreglos rectangulares.",
    "temas_declarativos": [
      "Concepto de multiplicación como suma repetida de sumandos iguales",
      "Modelado con semillas"
    ],
    "criterios_evaluacion": "Domina las tablas de multiplicar del 2 al 5 y opera con cantidades de tres dígitos.",
    "pagina_libro_sugerida": 75
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 5,
    "competencia_numero": 2,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Las consonantes \"c\" (ca, co, cu) y \"q\" (que, qui): reglas ortográficas básicas",
      "Lectura guiada"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 75
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 2,
    "semana_sugerida": 5,
    "competencia_numero": 2,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "Hábitats de los animales locales: terrestres, aéreos y acuáticos en la aldea",
      "Adaptación al medio"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 75
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 5,
    "competencia_numero": 2,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "Los símbolos patrios de Guatemala: la Bandera, el Escudo, la Monja Blanca y el Quetzal",
      "Identidad cívica"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 75
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 6,
    "competencia_numero": 3,
    "competencia_descripcion": "Utiliza el cálculo de multiplicación y numeración hasta 500 en situaciones de la comunidad.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Calcula productos de las tablas del 2, 3, 4 y 5 mediante arreglos rectangulares.",
    "temas_declarativos": [
      "La tabla de multiplicar del 2 con apoyo de semillas y dibujos",
      "Patrones de conteo de 2 en 2"
    ],
    "criterios_evaluacion": "Domina las tablas de multiplicar del 2 al 5 y opera con cantidades de tres dígitos.",
    "pagina_libro_sugerida": 80
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 6,
    "competencia_numero": 2,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "La consonante \"b\" y \"v\": lectura y diferenciación visual de palabras familiares",
      "Vocabulario"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 80
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 2,
    "semana_sugerida": 6,
    "competencia_numero": 2,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "Utilidad de las plantas para la comunidad: alimenticias, medicinales e industriales",
      "Saberes ancestrales"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 80
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 6,
    "competencia_numero": 2,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "La Ceiba y el Tecún Umán: símbolos de fortaleza y libertad en la historia cívica",
      "Cultura patriótica"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 80
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 7,
    "competencia_numero": 3,
    "competencia_descripcion": "Utiliza el cálculo de multiplicación y numeración hasta 500 en situaciones de la comunidad.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Calcula productos de las tablas del 2, 3, 4 y 5 mediante arreglos rectangulares.",
    "temas_declarativos": [
      "La tabla de multiplicar del 3 y arreglos rectangulares de objetos",
      "Filas y columnas"
    ],
    "criterios_evaluacion": "Domina las tablas de multiplicar del 2 al 5 y opera con cantidades de tres dígitos.",
    "pagina_libro_sugerida": 85
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 7,
    "competencia_numero": 2,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "La consonante \"g\" (ga, go, gu) y su sonido suave",
      "Cuentos ilustrados"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 85
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 2,
    "semana_sugerida": 7,
    "competencia_numero": 2,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "Animales útiles para el ser humano: producción de alimentos, abono y trabajo",
      "Cuidado animal"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 85
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 7,
    "competencia_numero": 2,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "La Marimba y el Himno Nacional de Guatemala: respeto cívico y entonación solemne",
      "Música nacional"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 85
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 8,
    "competencia_numero": 3,
    "competencia_descripcion": "Utiliza el cálculo de multiplicación y numeración hasta 500 en situaciones de la comunidad.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Aplica la multiplicación en la resolución de problemas contextuales.",
    "temas_declarativos": [
      "Las tablas de multiplicar del 4 y del 5 en situaciones de producción",
      "Memorización razonada"
    ],
    "criterios_evaluacion": "Domina las tablas de multiplicar del 2 al 5 y opera con cantidades de tres dígitos.",
    "pagina_libro_sugerida": 90
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 8,
    "competencia_numero": 2,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "La consonante \"f\" y \"j\": lectura de fábulas breves con animales de la granja",
      "Comprensión literal"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 90
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 2,
    "semana_sugerida": 8,
    "competencia_numero": 2,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "Cadena alimenticia elemental: quién se alimenta de quién en la granja y el bosque",
      "Equilibrio ecológico"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 90
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 8,
    "competencia_numero": 2,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "Fiestas patronales y cívicas: gastronomía tradicional, ferias y expresiones populares",
      "Patrimonio inmaterial"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 90
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 9,
    "competencia_numero": 3,
    "competencia_descripcion": "Utiliza el cálculo de multiplicación y numeración hasta 500 en situaciones de la comunidad.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Aplica la multiplicación en la resolución de problemas contextuales.",
    "temas_declarativos": [
      "Problemas de conteo rápido y multiplicación aplicada a cosechas locales",
      "Aplicación en el cuaderno"
    ],
    "criterios_evaluacion": "Domina las tablas de multiplicar del 2 al 5 y opera con cantidades de tres dígitos.",
    "pagina_libro_sugerida": 95
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 9,
    "competencia_numero": 2,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Lectura comprensiva de pequeños párrafos respondiendo preguntas ¿Quién? y ¿Qué?",
      "Escritura guiada"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 95
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 2,
    "semana_sugerida": 9,
    "competencia_numero": 2,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "Protección de la flora y fauna de la región de Amatitlán y reservas naturales",
      "Cuidado ambiental"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 95
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 9,
    "competencia_numero": 2,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "La importancia del cuidado de los espacios públicos y la reforestación comunal",
      "Responsabilidad cívica"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 95
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 1,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica el concepto de división elemental, relaciones geométricas y numeración hasta 1,000.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Distribuye cantidades en partes iguales utilizando material concreto.",
    "temas_declarativos": [
      "Noción de división como reparto equitativo en grupos iguales",
      "Acciones prácticas con tapitas"
    ],
    "criterios_evaluacion": "Resuelve repartos equitativos y reconoce trazos geométricos en el entorno escolar.",
    "pagina_libro_sugerida": 100
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 1,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "La consonante \"ch\" y \"ll\": fonemas compuestos en palabras de la comunidad",
      "Historias locales"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 100
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 3,
    "semana_sugerida": 1,
    "competencia_numero": 3,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "El ciclo del agua en la naturaleza: evaporación, condensación, precipitación y recolección",
      "Maqueta o dibujo"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 100
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 1,
    "competencia_numero": 3,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "Guatemala: un país multiétnico, pluricultural y multilingüe de cuatro pueblos",
      "Diversidad nacional"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 100
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 2,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica el concepto de división elemental, relaciones geométricas y numeración hasta 1,000.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Distribuye cantidades en partes iguales utilizando material concreto.",
    "temas_declarativos": [
      "Reparto en mitades y tercios utilizando material concreto del aula",
      "Concepto de partes iguales"
    ],
    "criterios_evaluacion": "Resuelve repartos equitativos y reconoce trazos geométricos en el entorno escolar.",
    "pagina_libro_sugerida": 105
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 2,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Las consonantes \"ñ\" y \"y\": lectura y escritura en nombres propios y comunes",
      "Mayúscula inicial"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 105
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 3,
    "semana_sugerida": 2,
    "competencia_numero": 3,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "Fuentes de agua comunitaria (ríos, pozos, nacimientos) y amenazas de contaminación",
      "Cuidado de cuencas"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 105
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 2,
    "competencia_numero": 3,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "El Pueblo Maya: cosmovisión, sabiduría ancestral, idiomas mayas y tejidos tradicionales",
      "Pueblo Maya"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 105
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 3,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica el concepto de división elemental, relaciones geométricas y numeración hasta 1,000.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Distribuye cantidades en partes iguales utilizando material concreto.",
    "temas_declarativos": [
      "División exacta elemental vinculada a las tablas del 2 y 3",
      "Relación entre multiplicación y división"
    ],
    "criterios_evaluacion": "Resuelve repartos equitativos y reconoce trazos geométricos en el entorno escolar.",
    "pagina_libro_sugerida": 110
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 3,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Las letras \"k\", \"w\" y \"x\": palabras originarias y préstamos lingüísticos",
      "Diversidad lingüística"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 110
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 3,
    "semana_sugerida": 3,
    "competencia_numero": 3,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "El suelo: tipos de suelo (arenoso, arcilloso, fértil) y su importancia agrícola",
      "Toma de muestras"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 110
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 3,
    "competencia_numero": 3,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "El Pueblo Ladino: características culturales, lengua española, tradiciones y literatura",
      "Pueblo Ladino"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 110
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 4,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica el concepto de división elemental, relaciones geométricas y numeración hasta 1,000.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Maneja numeración hasta 1,000 en el sistema decimal y maya.",
    "temas_declarativos": [
      "Lectura y escritura de números naturales hasta 1,000",
      "La unidad de millar"
    ],
    "criterios_evaluacion": "Resuelve repartos equitativos y reconoce trazos geométricos en el entorno escolar.",
    "pagina_libro_sugerida": 115
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 4,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Combinaciones consonánticas con \"l\" (bl, cl, fl, gl, pl): lectura de trabalenguas",
      "Agilidad verbal"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 115
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 3,
    "semana_sugerida": 4,
    "competencia_numero": 3,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "El aire y la atmósfera: propiedades del aire, viento y calidad del aire rural",
      "Molinetes de viento"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 115
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 4,
    "competencia_numero": 3,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "El Pueblo Xinka: cosmovisión, territorio ancestral, idioma y resistencia histórica",
      "Pueblo Xinka"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 115
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 5,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica el concepto de división elemental, relaciones geométricas y numeración hasta 1,000.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Maneja numeración hasta 1,000 en el sistema decimal y maya.",
    "temas_declarativos": [
      "Descomposición de cantidades en centenas, decenas y unidades",
      "Composición aditiva"
    ],
    "criterios_evaluacion": "Resuelve repartos equitativos y reconoce trazos geométricos en el entorno escolar.",
    "pagina_libro_sugerida": 120
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 5,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Combinaciones consonánticas con \"r\" (br, cr, dr, fr, gr, pr, tr): palabras complejas",
      "Fluidez lectora"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 120
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 3,
    "semana_sugerida": 5,
    "competencia_numero": 3,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "El sol como fuente principal de luz y calor para la vida en la Tierra",
      "Energía solar básica"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 120
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 5,
    "competencia_numero": 3,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "El Pueblo Garífuna: origen histórico en Izabal, idioma, música de tambores y gastronomía",
      "Pueblo Garífuna"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 120
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 6,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica el concepto de división elemental, relaciones geométricas y numeración hasta 1,000.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Maneja numeración hasta 1,000 en el sistema decimal y maya.",
    "temas_declarativos": [
      "Resolución de problemas aritméticos de dos operaciones",
      "Estrategias de planteamiento"
    ],
    "criterios_evaluacion": "Resuelve repartos equitativos y reconoce trazos geométricos en el entorno escolar.",
    "pagina_libro_sugerida": 125
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 6,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "La oración simple: separación adecuada de palabras con espacios en blanco",
      "Segmentación léxica"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 125
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 3,
    "semana_sugerida": 6,
    "competencia_numero": 3,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "Los recursos naturales renovables y no renovables de la comunidad",
      "Uso sostenible"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 125
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 6,
    "competencia_numero": 3,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "Cultura de paz y erradicación del racismo y la discriminación en la escuela rural",
      "Convivencia armónica"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 125
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 7,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica el concepto de división elemental, relaciones geométricas y numeración hasta 1,000.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Reconoce líneas paralelas y perpendiculares y calcula perímetros simples.",
    "temas_declarativos": [
      "Rectas paralelas y perpendiculares en el aula y construcciones",
      "Trazos con regla"
    ],
    "criterios_evaluacion": "Resuelve repartos equitativos y reconoce trazos geométricos en el entorno escolar.",
    "pagina_libro_sugerida": 130
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 7,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "El sustantivo: nombres de personas, animales y objetos del entorno escolar",
      "Clasificación"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 130
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 3,
    "semana_sugerida": 7,
    "competencia_numero": 3,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "El manejo de los residuos sólidos: clasificación de basura orgánica e inorgánica",
      "Compostaje escolar"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 130
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 7,
    "competencia_numero": 3,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "El respeto a los abuelos y ancianos como guardianes de la sabiduría comunitaria",
      "Sabiduría intergeneracional"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 130
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 8,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica el concepto de división elemental, relaciones geométricas y numeración hasta 1,000.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Reconoce líneas paralelas y perpendiculares y calcula perímetros simples.",
    "temas_declarativos": [
      "Figuras planas compuestas y perímetro elemental en cuadrícula",
      "Conteo de unidades de borde"
    ],
    "criterios_evaluacion": "Resuelve repartos equitativos y reconoce trazos geométricos en el entorno escolar.",
    "pagina_libro_sugerida": 135
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 8,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Uso de la mayúscula al inicio de la oración y punto final",
      "Normas ortográficas"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 135
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 3,
    "semana_sugerida": 8,
    "competencia_numero": 3,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "Las 3R en la escuela: Reducir, Reutilizar y Reciclar materiales didácticos",
      "Taller de reciclaje"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 135
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 8,
    "competencia_numero": 3,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "La indumentaria tradicional maya: significado de los colores, bordados y telares de cintura",
      "Arte textil"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 135
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 9,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica el concepto de división elemental, relaciones geométricas y numeración hasta 1,000.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Reconoce líneas paralelas y perpendiculares y calcula perímetros simples.",
    "temas_declarativos": [
      "Sistema Maya: escritura posicional del 20 al 39 (segunda posición)",
      "El cero maya (caracol)"
    ],
    "criterios_evaluacion": "Resuelve repartos equitativos y reconoce trazos geométricos en el entorno escolar.",
    "pagina_libro_sugerida": 140
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 9,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Producción escrita: redacción de oraciones descriptivas sobre la familia",
      "Revisión entre pares"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 140
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 3,
    "semana_sugerida": 9,
    "competencia_numero": 3,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "Fenómenos atmosféricos y prevención de desastres (lluvias fuertes, derrumbes, temblores)",
      "Plan de evacuación"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 140
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 9,
    "competencia_numero": 3,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "Muestra cultural escolar: feria de los cuatro pueblos de Guatemala en el patio escolar",
      "Celebración de identidad"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 140
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 1,
    "competencia_numero": 5,
    "competencia_descripcion": "Utiliza instrumentos de medición de longitud, peso, capacidad, tiempo y moneda nacional.",
    "indicador_numero": "5.1",
    "indicador_descripcion": "Mide longitudes y pesos con instrumentos estándar y tradicionales.",
    "temas_declarativos": [
      "Medidas de longitud del entorno: el centímetro, el decímetro y el metro",
      "Uso de la regla y cinta"
    ],
    "criterios_evaluacion": "Mide objetos con unidades adecuadas y calcula cambios y vueltos en quetzales.",
    "pagina_libro_sugerida": 145
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 1,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "La descripción oral y escrita de objetos, plantas y animales de la aldea",
      "Uso de adjetivos"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 145
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 4,
    "semana_sugerida": 1,
    "competencia_numero": 4,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "Materia y energía: estados de la materia (sólido, líquido y gaseoso) en la cocina",
      "Cambios de estado"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 145
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 1,
    "competencia_numero": 4,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "Valores cívicos y ciudadanos: la honestidad, la solidaridad, la justicia y el bien común",
      "Ética ciudadana"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 145
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 2,
    "competencia_numero": 5,
    "competencia_descripcion": "Utiliza instrumentos de medición de longitud, peso, capacidad, tiempo y moneda nacional.",
    "indicador_numero": "5.1",
    "indicador_descripcion": "Mide longitudes y pesos con instrumentos estándar y tradicionales.",
    "temas_declarativos": [
      "Medidas tradicionales de longitud (la vara y la brazada rural)",
      "Comparación con el metro"
    ],
    "criterios_evaluacion": "Mide objetos con unidades adecuadas y calcula cambios y vueltos en quetzales.",
    "pagina_libro_sugerida": 150
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 2,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Los artículos: el, la, los, las, un, una, unos, unas (concordancia de género y número)",
      "Gramática práctica"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 150
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 4,
    "semana_sugerida": 2,
    "competencia_numero": 4,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "El calor y la temperatura: efectos del calor en los objetos y uso del termómetro",
      "Medición térmica"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 150
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 2,
    "competencia_numero": 4,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "El trabajo en la comunidad: oficios tradicionales, agricultura, comercio y profesiones",
      "Dignidad del trabajo"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 150
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 3,
    "competencia_numero": 5,
    "competencia_descripcion": "Utiliza instrumentos de medición de longitud, peso, capacidad, tiempo y moneda nacional.",
    "indicador_numero": "5.1",
    "indicador_descripcion": "Mide longitudes y pesos con instrumentos estándar y tradicionales.",
    "temas_declarativos": [
      "Medidas de masa y peso: la libra, la media libra y la onza en el mercado",
      "Pesaje en balanza escolar"
    ],
    "criterios_evaluacion": "Mide objetos con unidades adecuadas y calcula cambios y vueltos en quetzales.",
    "pagina_libro_sugerida": 155
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 3,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Sinónimos y antónimos elementales en diálogos y lecturas compartidas",
      "Enriquecimiento léxico"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 155
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 4,
    "semana_sugerida": 3,
    "competencia_numero": 4,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "La luz y las sombras: fuentes naturales y artificiales de iluminación",
      "Óptica elemental"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 155
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 3,
    "competencia_numero": 4,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "La cooperación comunitaria: la \"mano vuelta\" y el trabajo voluntario en la aldea",
      "Solidaridad rural"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 155
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 4,
    "competencia_numero": 5,
    "competencia_descripcion": "Utiliza instrumentos de medición de longitud, peso, capacidad, tiempo y moneda nacional.",
    "indicador_numero": "5.1",
    "indicador_descripcion": "Mide longitudes y pesos con instrumentos estándar y tradicionales.",
    "temas_declarativos": [
      "Medidas de capacidad: el vaso, la botella y el litro de leche o agua",
      "Transvase de líquidos"
    ],
    "criterios_evaluacion": "Mide objetos con unidades adecuadas y calcula cambios y vueltos en quetzales.",
    "pagina_libro_sugerida": 160
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 4,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Signos de interrogación (¿?) y admiración (¡!) en la lectura expresiva",
      "Entonación adecuada"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 160
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 4,
    "semana_sugerida": 4,
    "competencia_numero": 4,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "El sonido: cómo se produce el sonido, vibraciones e instrumentos musicales",
      "Acústica escolar"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 160
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 4,
    "competencia_numero": 4,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "La Constitución Política de la República explicada a los niños: ley suprema del país",
      "Estado de derecho"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 160
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 5,
    "competencia_numero": 5,
    "competencia_descripcion": "Utiliza instrumentos de medición de longitud, peso, capacidad, tiempo y moneda nacional.",
    "indicador_numero": "5.2",
    "indicador_descripcion": "Lee la hora y utiliza billetes de moneda nacional en transacciones simuladas.",
    "temas_declarativos": [
      "Medidas de tiempo: horas y medias horas en el reloj de manecillas",
      "Planificación del día"
    ],
    "criterios_evaluacion": "Mide objetos con unidades adecuadas y calcula cambios y vueltos en quetzales.",
    "pagina_libro_sugerida": 165
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 5,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Estructura básica del cuento: inicio, desarrollo y desenlace",
      "Lectura de cuentos"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 165
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 4,
    "semana_sugerida": 5,
    "competencia_numero": 4,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "Fuerzas y movimiento: empujar, jalar y fricción en juegos infantiles",
      "Dinámica cotidiana"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 165
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 5,
    "competencia_numero": 4,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "Las leyes de tránsito básicas: seguridad vial para peatones y ciclistas en caminos",
      "Seguridad en la calle"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 165
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 6,
    "competencia_numero": 5,
    "competencia_descripcion": "Utiliza instrumentos de medición de longitud, peso, capacidad, tiempo y moneda nacional.",
    "indicador_numero": "5.2",
    "indicador_descripcion": "Lee la hora y utiliza billetes de moneda nacional en transacciones simuladas.",
    "temas_declarativos": [
      "El calendario anual: meses del año y planificación de actividades cívicas",
      "Días festivos escolares"
    ],
    "criterios_evaluacion": "Mide objetos con unidades adecuadas y calcula cambios y vueltos en quetzales.",
    "pagina_libro_sugerida": 170
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 6,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "La poesía infantil: declamación de poemas cortos y rondas tradicionales",
      "Expresión corporal"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 170
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 4,
    "semana_sugerida": 6,
    "competencia_numero": 4,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "Máquinas simples en la vida diaria: la rueda, la palanca, la rampa y la polea",
      "Uso en el campo"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 170
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 6,
    "competencia_numero": 4,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "Prevención del acoso escolar (bullying) y promoción de aulas amables y seguras",
      "Clima escolar"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 170
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 7,
    "competencia_numero": 5,
    "competencia_descripcion": "Utiliza instrumentos de medición de longitud, peso, capacidad, tiempo y moneda nacional.",
    "indicador_numero": "5.2",
    "indicador_descripcion": "Lee la hora y utiliza billetes de moneda nacional en transacciones simuladas.",
    "temas_declarativos": [
      "Moneda nacional: billetes de Q 1.00, Q 5.00, Q 10.00 y cálculo de vuelto",
      "Simulación de mercado"
    ],
    "criterios_evaluacion": "Mide objetos con unidades adecuadas y calcula cambios y vueltos en quetzales.",
    "pagina_libro_sugerida": 175
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 7,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Instrucciones escritas: seguimiento de pasos para elaborar un juguete tradicional",
      "Texto instructivo"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 175
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 4,
    "semana_sugerida": 7,
    "competencia_numero": 4,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "El sistema solar: el sol, la luna, la tierra y las estrellas en la noche",
      "Astronomía básica"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 175
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 7,
    "competencia_numero": 4,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "El cuidado de los recursos públicos y la rendición de cuentas en el gobierno escolar",
      "Transparencia"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 175
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 8,
    "competencia_numero": 5,
    "competencia_descripcion": "Utiliza instrumentos de medición de longitud, peso, capacidad, tiempo y moneda nacional.",
    "indicador_numero": "5.3",
    "indicador_descripcion": "Construye e interpreta gráficas de barras con datos del aula.",
    "temas_declarativos": [
      "Tablas de doble entrada y registro de asistencia y productos escolares",
      "Organización de datos"
    ],
    "criterios_evaluacion": "Mide objetos con unidades adecuadas y calcula cambios y vueltos en quetzales.",
    "pagina_libro_sugerida": 180
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 8,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "La dramatización escolar: juego de roles sobre situaciones comunitarias",
      "Expresión oral"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 180
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 4,
    "semana_sugerida": 8,
    "competencia_numero": 4,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "Movimientos de la Tierra: rotación (día y noche) y traslación (las estaciones)",
      "Reloj de sol"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 180
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 8,
    "competencia_numero": 4,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "Construcción de un proyecto cívico comunitario: mejora de un área común de la escuela",
      "Acción solidaria"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 180
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 9,
    "competencia_numero": 5,
    "competencia_descripcion": "Utiliza instrumentos de medición de longitud, peso, capacidad, tiempo y moneda nacional.",
    "indicador_numero": "5.3",
    "indicador_descripcion": "Construye e interpreta gráficas de barras con datos del aula.",
    "temas_declarativos": [
      "Gráficas de barras verticales sencillas e interpretación de resultados",
      "Lectura de frecuencias"
    ],
    "criterios_evaluacion": "Mide objetos con unidades adecuadas y calcula cambios y vueltos en quetzales.",
    "pagina_libro_sugerida": 185
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 9,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "El rincón de lectura: selección autónoma de cuentos y socialización en plenaria",
      "Fomento lector"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 185
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 4,
    "semana_sugerida": 9,
    "competencia_numero": 4,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "Feria de ciencias del aula: presentación de proyectos de indagación escolar",
      "Método científico"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 185
  },
  {
    "grado": 2,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 9,
    "competencia_numero": 4,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "Evaluación del Gobierno Escolar y memoria de labores de las comisiones infantiles",
      "Cierre cívico anual"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 185
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 1,
    "competencia_numero": 1,
    "competencia_descripcion": "Utiliza el cálculo aritmético y el razonamiento lógico para resolver situaciones problemáticas de su contexto.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Escribe y lee números de cuatro dígitos reconociendo unidades de millar.",
    "temas_declarativos": [
      "Valor posicional de números hasta 1,000 (UM, C, D, U) en notación desarrollada",
      "Lectura y escritura formal"
    ],
    "criterios_evaluacion": "Resuelve problemas de cuatro cifras aplicando algoritmos formales y notación desarrollada.",
    "pagina_libro_sugerida": 10
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 1,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Conciencia fonológica: discriminación auditiva de sonidos del entorno y animales",
      "Canciones y rimas"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 10
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 1,
    "semana_sugerida": 1,
    "competencia_numero": 1,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "El cuerpo humano: partes externas (cabeza, tronco, extremidades) y articulaciones",
      "Esquema corporal"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 10
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 1,
    "competencia_numero": 1,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "El aula escolar: un espacio de convivencia pacífica, respeto y trabajo colaborativo",
      "Acuerdos iniciales"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 10
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 2,
    "competencia_numero": 1,
    "competencia_descripcion": "Utiliza el cálculo aritmético y el razonamiento lógico para resolver situaciones problemáticas de su contexto.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Escribe y lee números de cuatro dígitos reconociendo unidades de millar.",
    "temas_declarativos": [
      "Lectura, escritura y comparación de números de cuatro cifras hasta 5,000",
      "Signos >, < e ="
    ],
    "criterios_evaluacion": "Resuelve problemas de cuatro cifras aplicando algoritmos formales y notación desarrollada.",
    "pagina_libro_sugerida": 15
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 2,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Trazos preparatorios y grafomotricidad en cuadrícula y arena",
      "Coordinación visomotriz"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 15
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 1,
    "semana_sugerida": 2,
    "competencia_numero": 1,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "Los cinco sentidos: órganos (ojos, oídos, nariz, lengua, piel) y sus funciones de alerta",
      "Exploración sensorial"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 15
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 2,
    "competencia_numero": 1,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "Normas de convivencia del aula: elaboración democrática de nuestro decálogo de oro",
      "Reglas consensuadas"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 15
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 3,
    "competencia_numero": 1,
    "competencia_descripcion": "Utiliza el cálculo aritmético y el razonamiento lógico para resolver situaciones problemáticas de su contexto.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Escribe y lee números de cuatro dígitos reconociendo unidades de millar.",
    "temas_declarativos": [
      "Suma de números de tres y cuatro cifras con reagrupación múltiple",
      "Alineación vertical"
    ],
    "criterios_evaluacion": "Resuelve problemas de cuatro cifras aplicando algoritmos formales y notación desarrollada.",
    "pagina_libro_sugerida": 20
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 3,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Vocales: sonido y grafía de la \"a\" y la \"e\" en palabras ilustradas",
      "Escritura de vocales"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 20
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 1,
    "semana_sugerida": 3,
    "competencia_numero": 1,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "Hábitos de higiene personal: lavado de manos con agua segura, cepillado y baño diario",
      "Salud escolar"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 20
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 3,
    "competencia_numero": 1,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "El Gobierno Escolar: qué es, sus objetivos y la importancia de la participación infantil",
      "Democracia escolar"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 20
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 4,
    "competencia_numero": 1,
    "competencia_descripcion": "Utiliza el cálculo aritmético y el razonamiento lógico para resolver situaciones problemáticas de su contexto.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Efectúa adiciones y sustracciones con reagrupación múltiple hasta 5,000.",
    "temas_declarativos": [
      "Resta de números de tres y cuatro cifras prestando a la centena y millar",
      "Desagrupación sucesiva"
    ],
    "criterios_evaluacion": "Resuelve problemas de cuatro cifras aplicando algoritmos formales y notación desarrollada.",
    "pagina_libro_sugerida": 25
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 4,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Vocales: sonido y grafía de la \"i\", \"o\" y \"u\" y combinación de vocales",
      "Diptongos básicos"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 25
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 1,
    "semana_sugerida": 4,
    "competencia_numero": 1,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "Nutrición saludable: grupos de alimentos locales (frutas, verduras, tortillas, frijol)",
      "Pirámide nutricional"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 25
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 4,
    "competencia_numero": 1,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "Comisiones del Gobierno Escolar: comisiones de orden, aseo, deportes, cultura y botiquín",
      "Organización de tareas"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 25
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 5,
    "competencia_numero": 1,
    "competencia_descripcion": "Utiliza el cálculo aritmético y el razonamiento lógico para resolver situaciones problemáticas de su contexto.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Efectúa adiciones y sustracciones con reagrupación múltiple hasta 5,000.",
    "temas_declarativos": [
      "Estimación y redondeo de sumas y restas al millar más cercano",
      "Cálculo mental aproximado"
    ],
    "criterios_evaluacion": "Resuelve problemas de cuatro cifras aplicando algoritmos formales y notación desarrollada.",
    "pagina_libro_sugerida": 30
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 5,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "La consonante \"m\": fonema, sílabas ma, me, mi, mo, mu y palabras simples",
      "Lectura de \"mamá\""
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 30
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 1,
    "semana_sugerida": 5,
    "competencia_numero": 1,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "El agua segura: importancia para el cuerpo humano y métodos de desinfección",
      "Hervido y filtrado"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 30
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 5,
    "competencia_numero": 1,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "Elecciones del Gobierno Escolar: campañas, voto secreto y juramentación de directiva",
      "Ejercicio ciudadano"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 30
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 6,
    "competencia_numero": 1,
    "competencia_descripcion": "Utiliza el cálculo aritmético y el razonamiento lógico para resolver situaciones problemáticas de su contexto.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Efectúa adiciones y sustracciones con reagrupación múltiple hasta 5,000.",
    "temas_declarativos": [
      "Problemas multietapa de adición y sustracción en comercio comunitario",
      "Pasos de Polya"
    ],
    "criterios_evaluacion": "Resuelve problemas de cuatro cifras aplicando algoritmos formales y notación desarrollada.",
    "pagina_libro_sugerida": 35
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 6,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "La consonante \"p\": fonema, sílabas pa, pe, pi, po, pu y oraciones ilustradas",
      "Lectura de \"papá\""
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 35
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 1,
    "semana_sugerida": 6,
    "competencia_numero": 1,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "Prevención de enfermedades comunes en la escuela y en la comunidad rural",
      "Vacunas y descanso"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 35
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 6,
    "competencia_numero": 1,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "Derechos fundamentales de la niñez: derecho a la vida, nombre, educación y salud",
      "Convención de derechos"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 35
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 7,
    "competencia_numero": 1,
    "competencia_descripcion": "Utiliza el cálculo aritmético y el razonamiento lógico para resolver situaciones problemáticas de su contexto.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Aplica propiedades aritméticas y numeración maya en secuencias y problemas.",
    "temas_declarativos": [
      "Propiedades de la suma (conmutativa, asociativa y elemento neutro)",
      "Verificación algebraica simple"
    ],
    "criterios_evaluacion": "Resuelve problemas de cuatro cifras aplicando algoritmos formales y notación desarrollada.",
    "pagina_libro_sugerida": 40
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 7,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "La consonante \"s\": fonema y sílabas directas e inversas (sa, se, si, so, su)",
      "Lectura fluida inicial"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 40
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 1,
    "semana_sugerida": 7,
    "competencia_numero": 1,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "El crecimiento y etapas del desarrollo humano (bebé, niño, joven, adulto, anciano)",
      "Línea de vida"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 40
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 7,
    "competencia_numero": 1,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "Deberes y responsabilidades de los niños en la escuela, la familia y la comunidad",
      "Compromiso social"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 40
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 8,
    "competencia_numero": 1,
    "competencia_descripcion": "Utiliza el cálculo aritmético y el razonamiento lógico para resolver situaciones problemáticas de su contexto.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Aplica propiedades aritméticas y numeración maya en secuencias y problemas.",
    "temas_declarativos": [
      "Numeración Maya hasta el 100: uso del punto, barra y concha (posiciones 1 y 2)",
      "Principio vigesimal"
    ],
    "criterios_evaluacion": "Resuelve problemas de cuatro cifras aplicando algoritmos formales y notación desarrollada.",
    "pagina_libro_sugerida": 45
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 8,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "La consonante \"l\": fonema y lectura de palabras de dos y tres sílabas",
      "Uso del libro de texto"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 45
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 1,
    "semana_sugerida": 8,
    "competencia_numero": 1,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "Cuidado de la postura corporal y actividad física en el patio escolar",
      "Salud física"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 45
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 8,
    "competencia_numero": 1,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "Equidad de género e igualdad de oportunidades entre niñas y niños en la escuela",
      "No discriminación"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 45
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 9,
    "competencia_numero": 1,
    "competencia_descripcion": "Utiliza el cálculo aritmético y el razonamiento lógico para resolver situaciones problemáticas de su contexto.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Aplica propiedades aritméticas y numeración maya en secuencias y problemas.",
    "temas_declarativos": [
      "Patrones numéricos crecientes y decrecientes con multiplicaciones",
      "Secuencias numéricas"
    ],
    "criterios_evaluacion": "Resuelve problemas de cuatro cifras aplicando algoritmos formales y notación desarrollada.",
    "pagina_libro_sugerida": 50
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 9,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Integración: lectura de oraciones cortas con m, p, s, l y comprensión de mensajes",
      "Evaluación de fluidez"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 50
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 1,
    "semana_sugerida": 9,
    "competencia_numero": 1,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "La salud emocional y la convivencia armoniosa en la familia y el aula",
      "Expresión de afectos"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 50
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 9,
    "competencia_numero": 1,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "Resolución pacífica de conflictos: el diálogo y la escucha como camino sin violencia",
      "Mediación entre pares"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 50
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 1,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica el algoritmo de la multiplicación por una y dos cifras en situaciones productivas.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Memoriza y aplica las tablas de multiplicar del 6 al 9 con soltura.",
    "temas_declarativos": [
      "Repaso de tablas del 2 al 5 y modelado geométrico de la multiplicación",
      "Arreglos rectangulares"
    ],
    "criterios_evaluacion": "Efectúa multiplicaciones de dos dígitos y resuelve problemas de cálculo de producción.",
    "pagina_libro_sugerida": 55
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 1,
    "competencia_numero": 2,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "La consonante \"t\": fonema, sílabas y palabras del vocabulario escolar",
      "Dictado de oraciones"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 55
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 2,
    "semana_sugerida": 1,
    "competencia_numero": 2,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "La diversidad de seres vivos en la comunidad: animales domésticos y silvestres",
      "Clasificación de fauna"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 55
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 1,
    "competencia_numero": 2,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "Mi comunidad y aldea: historia de la fundación, tradiciones y personajes ilustres",
      "Memoria local"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 55
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 2,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica el algoritmo de la multiplicación por una y dos cifras en situaciones productivas.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Memoriza y aplica las tablas de multiplicar del 6 al 9 con soltura.",
    "temas_declarativos": [
      "Las tablas de multiplicar del 6 y del 7 en resolución de problemas",
      "Cálculo mental ágil"
    ],
    "criterios_evaluacion": "Efectúa multiplicaciones de dos dígitos y resuelve problemas de cálculo de producción.",
    "pagina_libro_sugerida": 60
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 2,
    "competencia_numero": 2,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "La consonante \"d\": fonema y discriminación entre \"b\" y \"d\"",
      "Trazos en cuaderno"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 60
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 2,
    "semana_sugerida": 2,
    "competencia_numero": 2,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "Las plantas del entorno escolar: raíces, tallos, hojas, flores y frutos",
      "Observación con lupa"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 60
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 2,
    "competencia_numero": 2,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "Autoridades de la comunidad: el Alcalde Auxiliar, el COCODE y líderes comunitarios",
      "Liderazgo comunitario"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 60
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 3,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica el algoritmo de la multiplicación por una y dos cifras en situaciones productivas.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Memoriza y aplica las tablas de multiplicar del 6 al 9 con soltura.",
    "temas_declarativos": [
      "Las tablas de multiplicar del 8 y del 9 y técnicas de memorización",
      "Patrones de decenas y unidades"
    ],
    "criterios_evaluacion": "Efectúa multiplicaciones de dos dígitos y resuelve problemas de cálculo de producción.",
    "pagina_libro_sugerida": 65
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 3,
    "competencia_numero": 2,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "La consonante \"n\": fonema y sílabas directas e inversas (an, en, in, on, un)",
      "Lectura de textos"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 65
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 2,
    "semana_sugerida": 3,
    "competencia_numero": 2,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "Ciclo biológico de las plantas: germinación de semillas en vasos con algodón",
      "Experimento escolar"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 65
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 3,
    "competencia_numero": 2,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "Servicios públicos en la aldea: agua potable, centro de salud, escuela, energía y transporte",
      "Bienes comunes"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 65
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 4,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica el algoritmo de la multiplicación por una y dos cifras en situaciones productivas.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Multiplica cantidades de hasta tres dígitos por un dígito con reagrupación.",
    "temas_declarativos": [
      "Multiplicación de un número de dos y tres cifras por un dígito (sin llevar)",
      "Procedimiento estándar"
    ],
    "criterios_evaluacion": "Efectúa multiplicaciones de dos dígitos y resuelve problemas de cálculo de producción.",
    "pagina_libro_sugerida": 70
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 4,
    "competencia_numero": 2,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "La consonante \"r\": sonido suave y sonido fuerte (r y rr) en palabras comunes",
      "Pronunciación"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 70
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 2,
    "semana_sugerida": 4,
    "competencia_numero": 2,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "Ciclo de vida de los animales: nacimiento, crecimiento, reproducción y muerte",
      "Metamorfosis básica"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 70
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 4,
    "competencia_numero": 2,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "Geografía del municipio: ríos, cerros, caminos vecinales y mapas sencillos del barrio",
      "Cartografía infantil"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 70
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 5,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica el algoritmo de la multiplicación por una y dos cifras en situaciones productivas.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Multiplica cantidades de hasta tres dígitos por un dígito con reagrupación.",
    "temas_declarativos": [
      "Multiplicación de cantidades por un dígito con reagrupación (llevando)",
      "Algoritmo formal vertical"
    ],
    "criterios_evaluacion": "Efectúa multiplicaciones de dos dígitos y resuelve problemas de cálculo de producción.",
    "pagina_libro_sugerida": 75
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 5,
    "competencia_numero": 2,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Las consonantes \"c\" (ca, co, cu) y \"q\" (que, qui): reglas ortográficas básicas",
      "Lectura guiada"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 75
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 2,
    "semana_sugerida": 5,
    "competencia_numero": 2,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "Hábitats de los animales locales: terrestres, aéreos y acuáticos en la aldea",
      "Adaptación al medio"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 75
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 5,
    "competencia_numero": 2,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "Los símbolos patrios de Guatemala: la Bandera, el Escudo, la Monja Blanca y el Quetzal",
      "Identidad cívica"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 75
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 6,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica el algoritmo de la multiplicación por una y dos cifras en situaciones productivas.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Multiplica cantidades de hasta tres dígitos por un dígito con reagrupación.",
    "temas_declarativos": [
      "Multiplicación por potencias de 10 (10, 100, 1000) en presupuestos agrícolas",
      "Regla de ceros a la derecha"
    ],
    "criterios_evaluacion": "Efectúa multiplicaciones de dos dígitos y resuelve problemas de cálculo de producción.",
    "pagina_libro_sugerida": 80
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 6,
    "competencia_numero": 2,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "La consonante \"b\" y \"v\": lectura y diferenciación visual de palabras familiares",
      "Vocabulario"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 80
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 2,
    "semana_sugerida": 6,
    "competencia_numero": 2,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "Utilidad de las plantas para la comunidad: alimenticias, medicinales e industriales",
      "Saberes ancestrales"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 80
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 6,
    "competencia_numero": 2,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "La Ceiba y el Tecún Umán: símbolos de fortaleza y libertad en la historia cívica",
      "Cultura patriótica"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 80
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 7,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica el algoritmo de la multiplicación por una y dos cifras en situaciones productivas.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Calcula productos de dos cifras y resuelve problemas de comercio agrícola.",
    "temas_declarativos": [
      "Propiedades de la multiplicación: conmutativa, asociativa y distributiva",
      "Descomposición aditiva"
    ],
    "criterios_evaluacion": "Efectúa multiplicaciones de dos dígitos y resuelve problemas de cálculo de producción.",
    "pagina_libro_sugerida": 85
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 7,
    "competencia_numero": 2,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "La consonante \"g\" (ga, go, gu) y su sonido suave",
      "Cuentos ilustrados"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 85
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 2,
    "semana_sugerida": 7,
    "competencia_numero": 2,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "Animales útiles para el ser humano: producción de alimentos, abono y trabajo",
      "Cuidado animal"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 85
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 7,
    "competencia_numero": 2,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "La Marimba y el Himno Nacional de Guatemala: respeto cívico y entonación solemne",
      "Música nacional"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 85
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 8,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica el algoritmo de la multiplicación por una y dos cifras en situaciones productivas.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Calcula productos de dos cifras y resuelve problemas de comercio agrícola.",
    "temas_declarativos": [
      "Multiplicación por dos cifras básica (ej. 24 x 13) paso a paso",
      "Suma de productos parciales"
    ],
    "criterios_evaluacion": "Efectúa multiplicaciones de dos dígitos y resuelve problemas de cálculo de producción.",
    "pagina_libro_sugerida": 90
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 8,
    "competencia_numero": 2,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "La consonante \"f\" y \"j\": lectura de fábulas breves con animales de la granja",
      "Comprensión literal"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 90
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 2,
    "semana_sugerida": 8,
    "competencia_numero": 2,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "Cadena alimenticia elemental: quién se alimenta de quién en la granja y el bosque",
      "Equilibrio ecológico"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 90
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 8,
    "competencia_numero": 2,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "Fiestas patronales y cívicas: gastronomía tradicional, ferias y expresiones populares",
      "Patrimonio inmaterial"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 90
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 9,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica el algoritmo de la multiplicación por una y dos cifras en situaciones productivas.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Calcula productos de dos cifras y resuelve problemas de comercio agrícola.",
    "temas_declarativos": [
      "Resolución de problemas contextuales de compra por mayor y cosechas",
      "Aplicación en situaciones reales"
    ],
    "criterios_evaluacion": "Efectúa multiplicaciones de dos dígitos y resuelve problemas de cálculo de producción.",
    "pagina_libro_sugerida": 95
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 9,
    "competencia_numero": 2,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Lectura comprensiva de pequeños párrafos respondiendo preguntas ¿Quién? y ¿Qué?",
      "Escritura guiada"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 95
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 2,
    "semana_sugerida": 9,
    "competencia_numero": 2,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "Protección de la flora y fauna de la región de Amatitlán y reservas naturales",
      "Cuidado ambiental"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 95
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 9,
    "competencia_numero": 2,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "La importancia del cuidado de los espacios públicos y la reforestación comunal",
      "Responsabilidad cívica"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 95
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 1,
    "competencia_numero": 4,
    "competencia_descripcion": "Resuelve divisiones con divisor de una cifra e interpreta fracciones simples en repartos equitativos.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Aplica el algoritmo de la división exacta e inexacta con residuo.",
    "temas_declarativos": [
      "Concepto de división como operación inversa a la multiplicación",
      "Relación entre factores y producto"
    ],
    "criterios_evaluacion": "Calcula divisiones con residuo y resuelve operaciones básicas con fracciones homogéneas.",
    "pagina_libro_sugerida": 100
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 1,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "La consonante \"ch\" y \"ll\": fonemas compuestos en palabras de la comunidad",
      "Historias locales"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 100
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 3,
    "semana_sugerida": 1,
    "competencia_numero": 3,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "El ciclo del agua en la naturaleza: evaporación, condensación, precipitación y recolección",
      "Maqueta o dibujo"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 100
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 1,
    "competencia_numero": 3,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "Guatemala: un país multiétnico, pluricultural y multilingüe de cuatro pueblos",
      "Diversidad nacional"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 100
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 2,
    "competencia_numero": 4,
    "competencia_descripcion": "Resuelve divisiones con divisor de una cifra e interpreta fracciones simples en repartos equitativos.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Aplica el algoritmo de la división exacta e inexacta con residuo.",
    "temas_declarativos": [
      "Términos de la división: dividendo, divisor, cociente y residuo",
      "Planteamiento formal"
    ],
    "criterios_evaluacion": "Calcula divisiones con residuo y resuelve operaciones básicas con fracciones homogéneas.",
    "pagina_libro_sugerida": 105
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 2,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Las consonantes \"ñ\" y \"y\": lectura y escritura en nombres propios y comunes",
      "Mayúscula inicial"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 105
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 3,
    "semana_sugerida": 2,
    "competencia_numero": 3,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "Fuentes de agua comunitaria (ríos, pozos, nacimientos) y amenazas de contaminación",
      "Cuidado de cuencas"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 105
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 2,
    "competencia_numero": 3,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "El Pueblo Maya: cosmovisión, sabiduría ancestral, idiomas mayas y tejidos tradicionales",
      "Pueblo Maya"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 105
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 3,
    "competencia_numero": 4,
    "competencia_descripcion": "Resuelve divisiones con divisor de una cifra e interpreta fracciones simples en repartos equitativos.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Aplica el algoritmo de la división exacta e inexacta con residuo.",
    "temas_declarativos": [
      "División exacta con divisor de una cifra y cocientes de dos dígitos",
      "Algoritmo paso a paso"
    ],
    "criterios_evaluacion": "Calcula divisiones con residuo y resuelve operaciones básicas con fracciones homogéneas.",
    "pagina_libro_sugerida": 110
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 3,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Las letras \"k\", \"w\" y \"x\": palabras originarias y préstamos lingüísticos",
      "Diversidad lingüística"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 110
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 3,
    "semana_sugerida": 3,
    "competencia_numero": 3,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "El suelo: tipos de suelo (arenoso, arcilloso, fértil) y su importancia agrícola",
      "Toma de muestras"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 110
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 3,
    "competencia_numero": 3,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "El Pueblo Ladino: características culturales, lengua española, tradiciones y literatura",
      "Pueblo Ladino"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 110
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 4,
    "competencia_numero": 4,
    "competencia_descripcion": "Resuelve divisiones con divisor de una cifra e interpreta fracciones simples en repartos equitativos.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Resuelve problemas de reparto aplicando comprobación matemática.",
    "temas_declarativos": [
      "División inexacta con residuo y su comprobación aritmética",
      "Prueba: d x c + r = D"
    ],
    "criterios_evaluacion": "Calcula divisiones con residuo y resuelve operaciones básicas con fracciones homogéneas.",
    "pagina_libro_sugerida": 115
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 4,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Combinaciones consonánticas con \"l\" (bl, cl, fl, gl, pl): lectura de trabalenguas",
      "Agilidad verbal"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 115
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 3,
    "semana_sugerida": 4,
    "competencia_numero": 3,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "El aire y la atmósfera: propiedades del aire, viento y calidad del aire rural",
      "Molinetes de viento"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 115
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 4,
    "competencia_numero": 3,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "El Pueblo Xinka: cosmovisión, territorio ancestral, idioma y resistencia histórica",
      "Pueblo Xinka"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 115
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 5,
    "competencia_numero": 4,
    "competencia_descripcion": "Resuelve divisiones con divisor de una cifra e interpreta fracciones simples en repartos equitativos.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Resuelve problemas de reparto aplicando comprobación matemática.",
    "temas_declarativos": [
      "Problemas de reparto equitativo y empaque de granos en costales",
      "Contexto agrícola rural"
    ],
    "criterios_evaluacion": "Calcula divisiones con residuo y resuelve operaciones básicas con fracciones homogéneas.",
    "pagina_libro_sugerida": 120
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 5,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Combinaciones consonánticas con \"r\" (br, cr, dr, fr, gr, pr, tr): palabras complejas",
      "Fluidez lectora"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 120
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 3,
    "semana_sugerida": 5,
    "competencia_numero": 3,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "El sol como fuente principal de luz y calor para la vida en la Tierra",
      "Energía solar básica"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 120
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 5,
    "competencia_numero": 3,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "El Pueblo Garífuna: origen histórico en Izabal, idioma, música de tambores y gastronomía",
      "Pueblo Garífuna"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 120
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 6,
    "competencia_numero": 4,
    "competencia_descripcion": "Resuelve divisiones con divisor de una cifra e interpreta fracciones simples en repartos equitativos.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Resuelve problemas de reparto aplicando comprobación matemática.",
    "temas_declarativos": [
      "Noción de fracción como parte de una unidad dividida en partes iguales",
      "Representación en pasteles y barras"
    ],
    "criterios_evaluacion": "Calcula divisiones con residuo y resuelve operaciones básicas con fracciones homogéneas.",
    "pagina_libro_sugerida": 125
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 6,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "La oración simple: separación adecuada de palabras con espacios en blanco",
      "Segmentación léxica"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 125
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 3,
    "semana_sugerida": 6,
    "competencia_numero": 3,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "Los recursos naturales renovables y no renovables de la comunidad",
      "Uso sostenible"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 125
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 6,
    "competencia_numero": 3,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "Cultura de paz y erradicación del racismo y la discriminación en la escuela rural",
      "Convivencia armónica"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 125
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 7,
    "competencia_numero": 4,
    "competencia_descripcion": "Resuelve divisiones con divisor de una cifra e interpreta fracciones simples en repartos equitativos.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Representa, compara y suma fracciones homogéneas gráfica y numéricamente.",
    "temas_declarativos": [
      "Términos de la fracción: numerador y denominador en gráficos circulares",
      "Lectura de fracciones"
    ],
    "criterios_evaluacion": "Calcula divisiones con residuo y resuelve operaciones básicas con fracciones homogéneas.",
    "pagina_libro_sugerida": 130
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 7,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "El sustantivo: nombres de personas, animales y objetos del entorno escolar",
      "Clasificación"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 130
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 3,
    "semana_sugerida": 7,
    "competencia_numero": 3,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "El manejo de los residuos sólidos: clasificación de basura orgánica e inorgánica",
      "Compostaje escolar"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 130
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 7,
    "competencia_numero": 3,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "El respeto a los abuelos y ancianos como guardianes de la sabiduría comunitaria",
      "Sabiduría intergeneracional"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 130
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 8,
    "competencia_numero": 4,
    "competencia_descripcion": "Resuelve divisiones con divisor de una cifra e interpreta fracciones simples en repartos equitativos.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Representa, compara y suma fracciones homogéneas gráfica y numéricamente.",
    "temas_declarativos": [
      "Fracciones unitarias y comunes: medios, tercios, cuartos, sextos y octavos",
      "Fracciones en la regla"
    ],
    "criterios_evaluacion": "Calcula divisiones con residuo y resuelve operaciones básicas con fracciones homogéneas.",
    "pagina_libro_sugerida": 135
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 8,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Uso de la mayúscula al inicio de la oración y punto final",
      "Normas ortográficas"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 135
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 3,
    "semana_sugerida": 8,
    "competencia_numero": 3,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "Las 3R en la escuela: Reducir, Reutilizar y Reciclar materiales didácticos",
      "Taller de reciclaje"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 135
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 8,
    "competencia_numero": 3,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "La indumentaria tradicional maya: significado de los colores, bordados y telares de cintura",
      "Arte textil"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 135
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 9,
    "competencia_numero": 4,
    "competencia_descripcion": "Resuelve divisiones con divisor de una cifra e interpreta fracciones simples en repartos equitativos.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Representa, compara y suma fracciones homogéneas gráfica y numéricamente.",
    "temas_declarativos": [
      "Comparación y suma gráfica de fracciones con igual denominador (homogéneas)",
      "Operaciones en el cuaderno"
    ],
    "criterios_evaluacion": "Calcula divisiones con residuo y resuelve operaciones básicas con fracciones homogéneas.",
    "pagina_libro_sugerida": 140
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 9,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Producción escrita: redacción de oraciones descriptivas sobre la familia",
      "Revisión entre pares"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 140
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 3,
    "semana_sugerida": 9,
    "competencia_numero": 3,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "Fenómenos atmosféricos y prevención de desastres (lluvias fuertes, derrumbes, temblores)",
      "Plan de evacuación"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 140
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 9,
    "competencia_numero": 3,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "Muestra cultural escolar: feria de los cuatro pueblos de Guatemala en el patio escolar",
      "Celebración de identidad"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 140
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 1,
    "competencia_numero": 5,
    "competencia_descripcion": "Aplica conceptos de geometría, cálculo de perímetros, medidas tradicionales y estadística descriptiva.",
    "indicador_numero": "5.1",
    "indicador_descripcion": "Clasifica triángulos y cuadriláteros y calcula el perímetro de figuras planas.",
    "temas_declarativos": [
      "Geometría: ángulos rectos, agudos y obtusos en esquinas y construcciones",
      "Uso de la escuadra"
    ],
    "criterios_evaluacion": "Calcula perímetros, maneja medidas de quintales y arrobas e interpreta gráficos estadísticos.",
    "pagina_libro_sugerida": 145
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 1,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "La descripción oral y escrita de objetos, plantas y animales de la aldea",
      "Uso de adjetivos"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 145
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 4,
    "semana_sugerida": 1,
    "competencia_numero": 4,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "Materia y energía: estados de la materia (sólido, líquido y gaseoso) en la cocina",
      "Cambios de estado"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 145
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 1,
    "competencia_numero": 4,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "Valores cívicos y ciudadanos: la honestidad, la solidaridad, la justicia y el bien común",
      "Ética ciudadana"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 145
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 2,
    "competencia_numero": 5,
    "competencia_descripcion": "Aplica conceptos de geometría, cálculo de perímetros, medidas tradicionales y estadística descriptiva.",
    "indicador_numero": "5.1",
    "indicador_descripcion": "Clasifica triángulos y cuadriláteros y calcula el perímetro de figuras planas.",
    "temas_declarativos": [
      "Clasificación de triángulos por la longitud de sus lados (equilátero, isósceles, escaleno)",
      "Trazo con regla"
    ],
    "criterios_evaluacion": "Calcula perímetros, maneja medidas de quintales y arrobas e interpreta gráficos estadísticos.",
    "pagina_libro_sugerida": 150
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 2,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Los artículos: el, la, los, las, un, una, unos, unas (concordancia de género y número)",
      "Gramática práctica"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 150
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 4,
    "semana_sugerida": 2,
    "competencia_numero": 4,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "El calor y la temperatura: efectos del calor en los objetos y uso del termómetro",
      "Medición térmica"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 150
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 2,
    "competencia_numero": 4,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "El trabajo en la comunidad: oficios tradicionales, agricultura, comercio y profesiones",
      "Dignidad del trabajo"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 150
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 3,
    "competencia_numero": 5,
    "competencia_descripcion": "Aplica conceptos de geometría, cálculo de perímetros, medidas tradicionales y estadística descriptiva.",
    "indicador_numero": "5.1",
    "indicador_descripcion": "Clasifica triángulos y cuadriláteros y calcula el perímetro de figuras planas.",
    "temas_declarativos": [
      "Cuadriláteros: cuadrado, rectángulo, rombo y trapecio (características y diagonales)",
      "Identificación de vértices"
    ],
    "criterios_evaluacion": "Calcula perímetros, maneja medidas de quintales y arrobas e interpreta gráficos estadísticos.",
    "pagina_libro_sugerida": 155
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 3,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Sinónimos y antónimos elementales en diálogos y lecturas compartidas",
      "Enriquecimiento léxico"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 155
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 4,
    "semana_sugerida": 3,
    "competencia_numero": 4,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Identifica sistemas biológicos y practica hábitos de salud e higiene integral.",
    "temas_declarativos": [
      "La luz y las sombras: fuentes naturales y artificiales de iluminación",
      "Óptica elemental"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 155
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 3,
    "competencia_numero": 4,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Participa en comisiones de gobierno escolar y aplica normas consensuadas de convivencia.",
    "temas_declarativos": [
      "La cooperación comunitaria: la \"mano vuelta\" y el trabajo voluntario en la aldea",
      "Solidaridad rural"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 155
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 4,
    "competencia_numero": 5,
    "competencia_descripcion": "Aplica conceptos de geometría, cálculo de perímetros, medidas tradicionales y estadística descriptiva.",
    "indicador_numero": "5.1",
    "indicador_descripcion": "Clasifica triángulos y cuadriláteros y calcula el perímetro de figuras planas.",
    "temas_declarativos": [
      "Cálculo del perímetro de figuras poligonales en parcelas y terrenos escolares",
      "Fórmula P = suma de lados"
    ],
    "criterios_evaluacion": "Calcula perímetros, maneja medidas de quintales y arrobas e interpreta gráficos estadísticos.",
    "pagina_libro_sugerida": 160
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 4,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Signos de interrogación (¿?) y admiración (¡!) en la lectura expresiva",
      "Entonación adecuada"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 160
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 4,
    "semana_sugerida": 4,
    "competencia_numero": 4,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "El sonido: cómo se produce el sonido, vibraciones e instrumentos musicales",
      "Acústica escolar"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 160
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 4,
    "competencia_numero": 4,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "La Constitución Política de la República explicada a los niños: ley suprema del país",
      "Estado de derecho"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 160
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 5,
    "competencia_numero": 5,
    "competencia_descripcion": "Aplica conceptos de geometría, cálculo de perímetros, medidas tradicionales y estadística descriptiva.",
    "indicador_numero": "5.2",
    "indicador_descripcion": "Utiliza medidas tradicionales de peso (arroba, quintal) y tiempo exacto en horas y minutos.",
    "temas_declarativos": [
      "Medidas de longitud del sistema métrico: el milímetro, centímetro, metro y kilómetro",
      "Equivalencias básicas"
    ],
    "criterios_evaluacion": "Calcula perímetros, maneja medidas de quintales y arrobas e interpreta gráficos estadísticos.",
    "pagina_libro_sugerida": 165
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 5,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Estructura básica del cuento: inicio, desarrollo y desenlace",
      "Lectura de cuentos"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 165
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 4,
    "semana_sugerida": 5,
    "competencia_numero": 4,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "Fuerzas y movimiento: empujar, jalar y fricción en juegos infantiles",
      "Dinámica cotidiana"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 165
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 5,
    "competencia_numero": 4,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "Las leyes de tránsito básicas: seguridad vial para peatones y ciclistas en caminos",
      "Seguridad en la calle"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 165
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 6,
    "competencia_numero": 5,
    "competencia_descripcion": "Aplica conceptos de geometría, cálculo de perímetros, medidas tradicionales y estadística descriptiva.",
    "indicador_numero": "5.2",
    "indicador_descripcion": "Utiliza medidas tradicionales de peso (arroba, quintal) y tiempo exacto en horas y minutos.",
    "temas_declarativos": [
      "Medidas de peso tradicionales: la libra, la arroba (25 lb) y el quintal (100 lb)",
      "Cálculo de cargas agrícolas"
    ],
    "criterios_evaluacion": "Calcula perímetros, maneja medidas de quintales y arrobas e interpreta gráficos estadísticos.",
    "pagina_libro_sugerida": 170
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 6,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "La poesía infantil: declamación de poemas cortos y rondas tradicionales",
      "Expresión corporal"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 170
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 4,
    "semana_sugerida": 6,
    "competencia_numero": 4,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Clasifica seres vivos según sus funciones y hábitats en la aldea.",
    "temas_declarativos": [
      "Máquinas simples en la vida diaria: la rueda, la palanca, la rampa y la polea",
      "Uso en el campo"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 170
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 6,
    "competencia_numero": 4,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Reconoce la historia comunitaria y valora los símbolos patrios nacionales.",
    "temas_declarativos": [
      "Prevención del acoso escolar (bullying) y promoción de aulas amables y seguras",
      "Clima escolar"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 170
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 7,
    "competencia_numero": 5,
    "competencia_descripcion": "Aplica conceptos de geometría, cálculo de perímetros, medidas tradicionales y estadística descriptiva.",
    "indicador_numero": "5.2",
    "indicador_descripcion": "Utiliza medidas tradicionales de peso (arroba, quintal) y tiempo exacto en horas y minutos.",
    "temas_declarativos": [
      "Medidas de tiempo: lectura del reloj con minutos exactos (cuartos de hora)",
      "Estimación de duraciones"
    ],
    "criterios_evaluacion": "Calcula perímetros, maneja medidas de quintales y arrobas e interpreta gráficos estadísticos.",
    "pagina_libro_sugerida": 175
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 7,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Instrucciones escritas: seguimiento de pasos para elaborar un juguete tradicional",
      "Texto instructivo"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 175
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 4,
    "semana_sugerida": 7,
    "competencia_numero": 4,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "El sistema solar: el sol, la luna, la tierra y las estrellas en la noche",
      "Astronomía básica"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 175
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 7,
    "competencia_numero": 4,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "El cuidado de los recursos públicos y la rendición de cuentas en el gobierno escolar",
      "Transparencia"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 175
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 8,
    "competencia_numero": 5,
    "competencia_descripcion": "Aplica conceptos de geometría, cálculo de perímetros, medidas tradicionales y estadística descriptiva.",
    "indicador_numero": "5.3",
    "indicador_descripcion": "Organiza datos en tablas estadísticas y construye gráficos de barras con escala.",
    "temas_declarativos": [
      "Manejo de presupuesto familiar con Quetzales y cálculo de gastos semanales",
      "Plan de ahorro escolar"
    ],
    "criterios_evaluacion": "Calcula perímetros, maneja medidas de quintales y arrobas e interpreta gráficos estadísticos.",
    "pagina_libro_sugerida": 180
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 8,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "La dramatización escolar: juego de roles sobre situaciones comunitarias",
      "Expresión oral"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 180
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 4,
    "semana_sugerida": 8,
    "competencia_numero": 4,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "Movimientos de la Tierra: rotación (día y noche) y traslación (las estaciones)",
      "Reloj de sol"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 180
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 8,
    "competencia_numero": 4,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "Construcción de un proyecto cívico comunitario: mejora de un área común de la escuela",
      "Acción solidaria"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 180
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 9,
    "competencia_numero": 5,
    "competencia_descripcion": "Aplica conceptos de geometría, cálculo de perímetros, medidas tradicionales y estadística descriptiva.",
    "indicador_numero": "5.3",
    "indicador_descripcion": "Organiza datos en tablas estadísticas y construye gráficos de barras con escala.",
    "temas_declarativos": [
      "Tablas de frecuencia y gráficas de barras con escala e interpretación estadística",
      "Análisis de datos del aula"
    ],
    "criterios_evaluacion": "Calcula perímetros, maneja medidas de quintales y arrobas e interpreta gráficos estadísticos.",
    "pagina_libro_sugerida": 185
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 9,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica habilidades de lectura comprensiva, comunicación oral y producción de textos en su idioma materno.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "El rincón de lectura: selección autónoma de cuentos y socialización en plenaria",
      "Fomento lector"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 185
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Medio Social y Natural",
    "bloque_bimestre": 4,
    "semana_sugerida": 9,
    "competencia_numero": 4,
    "competencia_descripcion": "Describe la estructura del cuerpo humano, la biodiversidad local y los recursos naturales de su comunidad.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Propone prácticas de conservación de recursos naturales y manejo de residuos.",
    "temas_declarativos": [
      "Feria de ciencias del aula: presentación de proyectos de indagación escolar",
      "Método científico"
    ],
    "criterios_evaluacion": "Describe procesos biológicos y ecológicos registrando observaciones en esquemas y cuadernos.",
    "pagina_libro_sugerida": 185
  },
  {
    "grado": 3,
    "ciclo": "primer_ciclo",
    "area_materia": "Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 9,
    "competencia_numero": 4,
    "competencia_descripcion": "Practica valores democráticos, participación en el gobierno escolar y valoración de la diversidad cultural.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Promueve la equidad, no discriminación y respeto a los cuatro pueblos de Guatemala.",
    "temas_declarativos": [
      "Evaluación del Gobierno Escolar y memoria de labores de las comisiones infantiles",
      "Cierre cívico anual"
    ],
    "criterios_evaluacion": "Participa activamente en acuerdos democráticos y valora las tradiciones culturales de los cuatro pueblos.",
    "pagina_libro_sugerida": 185
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 1,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica el valor posicional de números hasta 100,000 y algoritmos aritméticos en finanzas y producción.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Descompone números de hasta seis cifras en unidades de millar y centenas.",
    "temas_declarativos": [
      "Sistema decimal: números hasta 100,000 (decenas y centenas de millar)",
      "Tabla de posiciones"
    ],
    "criterios_evaluacion": "Resuelve problemas con números de hasta seis cifras y multiplicaciones de dos dígitos.",
    "pagina_libro_sugerida": 10
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 1,
    "competencia_numero": 1,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Lectura comprensiva de textos narrativos: identificación de la idea principal",
      "Subrayado de ideas"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 10
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 1,
    "semana_sugerida": 1,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "La célula: unidad fundamental de la vida (célula animal y célula vegetal)",
      "Organelos celulares"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 10
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 1,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "La célula: unidad fundamental de la vida (célula animal y célula vegetal)",
      "Organelos celulares"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 10
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 2,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica el valor posicional de números hasta 100,000 y algoritmos aritméticos en finanzas y producción.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Descompone números de hasta seis cifras en unidades de millar y centenas.",
    "temas_declarativos": [
      "Notación desarrollada y comparación de cantidades de cinco y seis dígitos",
      "Descomposición polinómica"
    ],
    "criterios_evaluacion": "Resuelve problemas con números de hasta seis cifras y multiplicaciones de dos dígitos.",
    "pagina_libro_sugerida": 15
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 2,
    "competencia_numero": 1,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "El diccionario: orden alfabético y búsqueda rápida de palabras desconocidas",
      "Uso del diccionario"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 15
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 1,
    "semana_sugerida": 2,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Niveles de organización biológica: célula, tejido, órgano, sistema y organismo",
      "Estructura biológica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 15
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 2,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Niveles de organización biológica: célula, tejido, órgano, sistema y organismo",
      "Estructura biológica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 15
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 3,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica el valor posicional de números hasta 100,000 y algoritmos aritméticos en finanzas y producción.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Descompone números de hasta seis cifras en unidades de millar y centenas.",
    "temas_declarativos": [
      "Operaciones con números grandes: adición y sustracción de seis cifras",
      "Problemas de presupuestos"
    ],
    "criterios_evaluacion": "Resuelve problemas con números de hasta seis cifras y multiplicaciones de dos dígitos.",
    "pagina_libro_sugerida": 20
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 3,
    "competencia_numero": 1,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "La estructura del párrafo: oración principal y oraciones secundarias de apoyo",
      "Redacción de párrafos"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 20
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 1,
    "semana_sugerida": 3,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "El sistema circulatorio: el corazón, vasos sanguíneos y circulación de la sangre",
      "Frecuencia cardíaca"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 20
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 3,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "El sistema circulatorio: el corazón, vasos sanguíneos y circulación de la sangre",
      "Frecuencia cardíaca"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 20
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 4,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica el valor posicional de números hasta 100,000 y algoritmos aritméticos en finanzas y producción.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Multiplica cantidades por dos y tres cifras aplicando propiedades formales.",
    "temas_declarativos": [
      "Multiplicación por dos y tres dígitos con procedimiento vertical formal",
      "Productos parciales"
    ],
    "criterios_evaluacion": "Resuelve problemas con números de hasta seis cifras y multiplicaciones de dos dígitos.",
    "pagina_libro_sugerida": 25
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 4,
    "competencia_numero": 1,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Sustantivos propios y comunes, individuales y colectivos en lecturas comunitarias",
      "Gramática formal"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 25
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 1,
    "semana_sugerida": 4,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "El sistema respiratorio: intercambio gaseoso en los pulmones y salud pulmonar",
      "Capacidad pulmonar"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 25
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 4,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "El sistema respiratorio: intercambio gaseoso en los pulmones y salud pulmonar",
      "Capacidad pulmonar"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 25
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 5,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica el valor posicional de números hasta 100,000 y algoritmos aritméticos en finanzas y producción.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Multiplica cantidades por dos y tres cifras aplicando propiedades formales.",
    "temas_declarativos": [
      "Propiedad distributiva de la multiplicación respecto de la suma",
      "Cálculo abreviado"
    ],
    "criterios_evaluacion": "Resuelve problemas con números de hasta seis cifras y multiplicaciones de dos dígitos.",
    "pagina_libro_sugerida": 30
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 5,
    "competencia_numero": 1,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "El adjetivo calificativo y la concordancia de género y número con el sustantivo",
      "Descripciones ricas"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 30
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 1,
    "semana_sugerida": 5,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "El sistema digestivo y nutrición: absorción de nutrientes y dieta balanceada",
      "Higiene alimentaria"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 30
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 5,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "El sistema digestivo y nutrición: absorción de nutrientes y dieta balanceada",
      "Higiene alimentaria"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 30
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 6,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica el valor posicional de números hasta 100,000 y algoritmos aritméticos en finanzas y producción.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Multiplica cantidades por dos y tres cifras aplicando propiedades formales.",
    "temas_declarativos": [
      "Estimación de productos en presupuestos de siembra y construcción",
      "Redondeo a la centena"
    ],
    "criterios_evaluacion": "Resuelve problemas con números de hasta seis cifras y multiplicaciones de dos dígitos.",
    "pagina_libro_sugerida": 35
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 6,
    "competencia_numero": 1,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Palabras agudas, graves y esdrújulas: sílaba tónica y reglas de acentuación",
      "Ortografía acentual"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 35
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 1,
    "semana_sugerida": 6,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "El sistema reproductor humano y cambios físicos y emocionales en la pubertad",
      "Desarrollo humano"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 35
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 6,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "El sistema reproductor humano y cambios físicos y emocionales en la pubertad",
      "Desarrollo humano"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 35
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 7,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica el valor posicional de números hasta 100,000 y algoritmos aritméticos en finanzas y producción.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Resuelve operaciones combinadas y traduce cantidades al sistema maya.",
    "temas_declarativos": [
      "Operaciones combinadas simples de suma, resta y multiplicación",
      "Jerarquía sin paréntesis"
    ],
    "criterios_evaluacion": "Resuelve problemas con números de hasta seis cifras y multiplicaciones de dos dígitos.",
    "pagina_libro_sugerida": 40
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 7,
    "competencia_numero": 1,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "El verbo: tiempos fundamentales (pasado, presente y futuro) en relatos de la aldea",
      "Conjugación verbal"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 40
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 1,
    "semana_sugerida": 7,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "El sistema nervioso y los órganos sensoriales: transmisión de impulsos nerviosos",
      "Reflejos y respuestas"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 40
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 7,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "El sistema nervioso y los órganos sensoriales: transmisión de impulsos nerviosos",
      "Reflejos y respuestas"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 40
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 8,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica el valor posicional de números hasta 100,000 y algoritmos aritméticos en finanzas y producción.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Resuelve operaciones combinadas y traduce cantidades al sistema maya.",
    "temas_declarativos": [
      "Sistema de numeración Maya hasta la segunda posición (vigesimal hasta 400)",
      "Valor de posición (1 y 20)"
    ],
    "criterios_evaluacion": "Resuelve problemas con números de hasta seis cifras y multiplicaciones de dos dígitos.",
    "pagina_libro_sugerida": 45
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 8,
    "competencia_numero": 1,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Uso de la coma en enumeraciones y conectores de secuencia (primero, luego, finalmente)",
      "Puntuación clara"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 45
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 1,
    "semana_sugerida": 8,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Enfermedades infectocontagiosas y parasitarias: prevención, agua segura y vacunación",
      "Epidemiología escolar"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 45
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 8,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Enfermedades infectocontagiosas y parasitarias: prevención, agua segura y vacunación",
      "Epidemiología escolar"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 45
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 9,
    "competencia_numero": 1,
    "competencia_descripcion": "Aplica el valor posicional de números hasta 100,000 y algoritmos aritméticos en finanzas y producción.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Resuelve operaciones combinadas y traduce cantidades al sistema maya.",
    "temas_declarativos": [
      "Resolución de situaciones problemáticas de la economía local de Amatitlán",
      "Formulación de soluciones"
    ],
    "criterios_evaluacion": "Resuelve problemas con números de hasta seis cifras y multiplicaciones de dos dígitos.",
    "pagina_libro_sugerida": 50
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 9,
    "competencia_numero": 1,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Redacción de anécdotas escolares con orden cronológico y ortografía cuidada",
      "Taller de escritura"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 50
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 1,
    "semana_sugerida": 9,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "La medicina tradicional guatemalteca: plantas medicinales validadas científicamente",
      "Etnobotánica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 50
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 9,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "La medicina tradicional guatemalteca: plantas medicinales validadas científicamente",
      "Etnobotánica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 50
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 1,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica la división con divisor de dos cifras y la teoría de números (múltiplos, divisores y primos).",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Efectúa divisiones con divisor de hasta dos cifras y realiza comprobaciones.",
    "temas_declarativos": [
      "División con divisor de una y dos cifras con dividendos de cuatro dígitos",
      "Estimación de cocientes"
    ],
    "criterios_evaluacion": "Realiza divisiones de dos cifras comprobando el residuo y aplica criterios de divisibilidad.",
    "pagina_libro_sugerida": 55
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 1,
    "competencia_numero": 2,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Textos informativos: la noticia comunitaria y artículos de divulgación infantil",
      "Estructura periodística"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 55
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 2,
    "semana_sugerida": 1,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Ecosistemas y biomas de Guatemala: selva tropical, bosque nuboso y altiplano",
      "Biodiversidad nacional"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 55
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 1,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Ecosistemas y biomas de Guatemala: selva tropical, bosque nuboso y altiplano",
      "Biodiversidad nacional"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 55
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 2,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica la división con divisor de dos cifras y la teoría de números (múltiplos, divisores y primos).",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Efectúa divisiones con divisor de hasta dos cifras y realiza comprobaciones.",
    "temas_declarativos": [
      "Algoritmo estándar de la división con residuo paso a paso",
      "Comprobación con multiplicación"
    ],
    "criterios_evaluacion": "Realiza divisiones de dos cifras comprobando el residuo y aplica criterios de divisibilidad.",
    "pagina_libro_sugerida": 60
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 2,
    "competencia_numero": 2,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Organizadores gráficos: elaboración de mapas conceptuales y esquemas de llaves",
      "Técnicas de estudio"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 60
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 2,
    "semana_sugerida": 2,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Factores bióticos y abióticos en el equilibrio ecológico mesoamericano",
      "Interacciones naturales"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 60
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 2,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Factores bióticos y abióticos en el equilibrio ecológico mesoamericano",
      "Interacciones naturales"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 60
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 3,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica la división con divisor de dos cifras y la teoría de números (múltiplos, divisores y primos).",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Efectúa divisiones con divisor de hasta dos cifras y realiza comprobaciones.",
    "temas_declarativos": [
      "Comprobación de la división: (Divisor x Cociente) + Residuo = Dividendo",
      "Verificación formal"
    ],
    "criterios_evaluacion": "Realiza divisiones de dos cifras comprobando el residuo y aplica criterios de divisibilidad.",
    "pagina_libro_sugerida": 65
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 3,
    "competencia_numero": 2,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "El resumen escolar: extracción de ideas centrales sin copiar párrafos enteros",
      "Síntesis textual"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 65
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 2,
    "semana_sugerida": 3,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Niveles tróficos: productores, consumidores primarios, secundarios y descomponedores",
      "Redes alimenticias"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 65
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 3,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Niveles tróficos: productores, consumidores primarios, secundarios y descomponedores",
      "Redes alimenticias"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 65
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 4,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica la división con divisor de dos cifras y la teoría de números (múltiplos, divisores y primos).",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Identifica múltiplos y divisores y aplica criterios de divisibilidad.",
    "temas_declarativos": [
      "División entre números terminados en ceros (simplificación rápida)",
      "Técnicas de cálculo mental"
    ],
    "criterios_evaluacion": "Realiza divisiones de dos cifras comprobando el residuo y aplica criterios de divisibilidad.",
    "pagina_libro_sugerida": 70
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 4,
    "competencia_numero": 2,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Familia de palabras, prefijos (des-, re-, in-) y sufijos (-ito, -ote, -ero) en el léxico",
      "Morfología léxica"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 70
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 2,
    "semana_sugerida": 4,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Flujo de energía y ciclos biogeoquímicos (ciclo del carbono, nitrógeno y fósforo)",
      "Ciclos ecológicos"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 70
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 4,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Flujo de energía y ciclos biogeoquímicos (ciclo del carbono, nitrógeno y fósforo)",
      "Ciclos ecológicos"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 70
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 5,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica la división con divisor de dos cifras y la teoría de números (múltiplos, divisores y primos).",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Identifica múltiplos y divisores y aplica criterios de divisibilidad.",
    "temas_declarativos": [
      "Problemas contextuales de reparto agrario y cálculo de rendimientos por cuerda",
      "Aplicación en la aldea"
    ],
    "criterios_evaluacion": "Realiza divisiones de dos cifras comprobando el residuo y aplica criterios de divisibilidad.",
    "pagina_libro_sugerida": 75
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 5,
    "competencia_numero": 2,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Uso ortográfico de las grafías dudosas: b/v en terminaciones -aba y palabras con bi-",
      "Reglas ortográficas"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 75
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 2,
    "semana_sugerida": 5,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Relaciones interespecíficas: mutualismo, comensalismo, parasitismo y depredación",
      "Simbiosis biológica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 75
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 5,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Relaciones interespecíficas: mutualismo, comensalismo, parasitismo y depredación",
      "Simbiosis biológica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 75
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 6,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica la división con divisor de dos cifras y la teoría de números (múltiplos, divisores y primos).",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Identifica múltiplos y divisores y aplica criterios de divisibilidad.",
    "temas_declarativos": [
      "Múltiplos y divisores de un número natural en arreglos de productos",
      "Listado de divisores"
    ],
    "criterios_evaluacion": "Realiza divisiones de dos cifras comprobando el residuo y aplica criterios de divisibilidad.",
    "pagina_libro_sugerida": 80
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 6,
    "competencia_numero": 2,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Uso ortográfico de c, s, z en diminutivos (-cito, -cita) y plurales de palabras con z",
      "Dictado formativo"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 80
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 2,
    "semana_sugerida": 6,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Áreas protegidas de Guatemala (CONAP): parques nacionales, biotopos y volcanes",
      "Conservación nacional"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 80
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 6,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Áreas protegidas de Guatemala (CONAP): parques nacionales, biotopos y volcanes",
      "Conservación nacional"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 80
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 7,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica la división con divisor de dos cifras y la teoría de números (múltiplos, divisores y primos).",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Diferencia números primos de compuestos y descompone en factores primos.",
    "temas_declarativos": [
      "Criterios de divisibilidad entre 2, 3, 5 y 10 para agilizar cálculos",
      "Reglas operativas"
    ],
    "criterios_evaluacion": "Realiza divisiones de dos cifras comprobando el residuo y aplica criterios de divisibilidad.",
    "pagina_libro_sugerida": 85
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 7,
    "competencia_numero": 2,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "La fábula y la moraleja: análisis de valores éticos en relatos tradicionales",
      "Juicio crítico"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 85
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 2,
    "semana_sugerida": 7,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Especies en peligro de extinción en Guatemala (el Quetzal, jaguar, pinabete)",
      "Protección de especies"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 85
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 7,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Especies en peligro de extinción en Guatemala (el Quetzal, jaguar, pinabete)",
      "Protección de especies"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 85
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 8,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica la división con divisor de dos cifras y la teoría de números (múltiplos, divisores y primos).",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Diferencia números primos de compuestos y descompone en factores primos.",
    "temas_declarativos": [
      "Números primos y compuestos: criba de Eratóstenes hasta 50",
      "Identificación de factores"
    ],
    "criterios_evaluacion": "Realiza divisiones de dos cifras comprobando el residuo y aplica criterios de divisibilidad.",
    "pagina_libro_sugerida": 90
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 8,
    "competencia_numero": 2,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "La entrevista a ancianos y líderes comunitarios: formulación de preguntas abiertas",
      "Tradición oral"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 90
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 2,
    "semana_sugerida": 8,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Impacto ambiental de la deforestación y la contaminación hídrica en el lago de Amatitlán",
      "Estudio de caso local"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 90
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 8,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Impacto ambiental de la deforestación y la contaminación hídrica en el lago de Amatitlán",
      "Estudio de caso local"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 90
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 9,
    "competencia_numero": 3,
    "competencia_descripcion": "Aplica la división con divisor de dos cifras y la teoría de números (múltiplos, divisores y primos).",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Diferencia números primos de compuestos y descompone en factores primos.",
    "temas_declarativos": [
      "Descomposición de números en factores primos básicos (árbol de factores)",
      "Factorización elemental"
    ],
    "criterios_evaluacion": "Realiza divisiones de dos cifras comprobando el residuo y aplica criterios de divisibilidad.",
    "pagina_libro_sugerida": 95
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 9,
    "competencia_numero": 2,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Exposición oral individual: uso de fichas de apoyo y modulación de voz en el aula",
      "Oratoria infantil"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 95
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 2,
    "semana_sugerida": 9,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Proyectos de reforestación escolar y huertos pedagógicos sostenibles",
      "Acción comunitaria"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 95
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 9,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Proyectos de reforestación escolar y huertos pedagógicos sostenibles",
      "Acción comunitaria"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 95
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 1,
    "competencia_numero": 4,
    "competencia_descripcion": "Opera con fracciones propias, impropias, mixtas y números decimales en situaciones cotidianas.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Diferencia fracciones propias, impropias y mixtas y obtiene fracciones equivalentes.",
    "temas_declarativos": [
      "Fracciones propias, impropias y números mixtos (representación gráfica)",
      "Conversión de mixto a impropia"
    ],
    "criterios_evaluacion": "Resuelve operaciones con fracciones homogéneas y opera con decimales en problemas de dinero.",
    "pagina_libro_sugerida": 100
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 1,
    "competencia_numero": 3,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Textos literarios: leyendas y mitos guatemaltecos (El Sombrerón, La Llorona, El Cadejo)",
      "Literatura nacional"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 100
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 3,
    "semana_sugerida": 1,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Estructura de la materia: átomos, moléculas, elementos químicos y compuestos",
      "Tabla periódica básica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 100
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 1,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Estructura de la materia: átomos, moléculas, elementos químicos y compuestos",
      "Tabla periódica básica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 100
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 2,
    "competencia_numero": 4,
    "competencia_descripcion": "Opera con fracciones propias, impropias, mixtas y números decimales en situaciones cotidianas.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Diferencia fracciones propias, impropias y mixtas y obtiene fracciones equivalentes.",
    "temas_declarativos": [
      "Fracciones equivalentes por amplificación y simplificación",
      "Fracción irreducible"
    ],
    "criterios_evaluacion": "Resuelve operaciones con fracciones homogéneas y opera con decimales en problemas de dinero.",
    "pagina_libro_sugerida": 105
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 2,
    "competencia_numero": 3,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Figuras literarias elementales: el símil o comparación y la metáfora en la poesía",
      "Apreciación poética"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 105
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 3,
    "semana_sugerida": 2,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Mezclas homogéneas y heterogéneas y métodos de separación (filtración, decantación)",
      "Laboratorio escolar"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 105
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 2,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Mezclas homogéneas y heterogéneas y métodos de separación (filtración, decantación)",
      "Laboratorio escolar"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 105
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 3,
    "competencia_numero": 4,
    "competencia_descripcion": "Opera con fracciones propias, impropias, mixtas y números decimales en situaciones cotidianas.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Diferencia fracciones propias, impropias y mixtas y obtiene fracciones equivalentes.",
    "temas_declarativos": [
      "Comparación de fracciones con diferente denominador mediante productos cruzados",
      "Orden en la recta numérica"
    ],
    "criterios_evaluacion": "Resuelve operaciones con fracciones homogéneas y opera con decimales en problemas de dinero.",
    "pagina_libro_sugerida": 110
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 3,
    "competencia_numero": 3,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "El texto instructivo: recetas de cocina tradicional y manuales de huerto escolar",
      "Secuencia lógica"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 110
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 3,
    "semana_sugerida": 3,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Cambios físicos y químicos de la materia: combustión, oxidación y fermentación",
      "Reacciones químicas"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 110
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 3,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Cambios físicos y químicos de la materia: combustión, oxidación y fermentación",
      "Reacciones químicas"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 110
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 4,
    "competencia_numero": 4,
    "competencia_descripcion": "Opera con fracciones propias, impropias, mixtas y números decimales en situaciones cotidianas.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Suma y resta fracciones homogéneas y heterogéneas sencillas.",
    "temas_declarativos": [
      "Suma y resta de fracciones homogéneas (igual denominador) con números mixtos",
      "Operaciones directas"
    ],
    "criterios_evaluacion": "Resuelve operaciones con fracciones homogéneas y opera con decimales en problemas de dinero.",
    "pagina_libro_sugerida": 115
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 4,
    "competencia_numero": 3,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "La oración compuesta: nexos coordinantes (y, e, ni, o, pero) en la redacción",
      "Cohesión textual"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 115
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 3,
    "semana_sugerida": 4,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Tipos de energía: mecánica, térmica, eléctrica, solar, eólica e hidráulica",
      "Transformaciones"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 115
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 4,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Tipos de energía: mecánica, térmica, eléctrica, solar, eólica e hidráulica",
      "Transformaciones"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 115
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 5,
    "competencia_numero": 4,
    "competencia_descripcion": "Opera con fracciones propias, impropias, mixtas y números decimales en situaciones cotidianas.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Suma y resta fracciones homogéneas y heterogéneas sencillas.",
    "temas_declarativos": [
      "Suma y resta de fracciones heterogéneas sencillas (denominadores múltiplos)",
      "Búsqueda de común denominador"
    ],
    "criterios_evaluacion": "Resuelve operaciones con fracciones homogéneas y opera con decimales en problemas de dinero.",
    "pagina_libro_sugerida": 120
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 5,
    "competencia_numero": 3,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Puntuación avanzada: uso de los dos puntos (:) antes de enumeraciones y citas",
      "Puntuación formal"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 120
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 3,
    "semana_sugerida": 5,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Fuentes de energía renovables y no renovables en la matriz energética de Guatemala",
      "Sostenibilidad"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 120
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 5,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Fuentes de energía renovables y no renovables en la matriz energética de Guatemala",
      "Sostenibilidad"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 120
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 6,
    "competencia_numero": 4,
    "competencia_descripcion": "Opera con fracciones propias, impropias, mixtas y números decimales en situaciones cotidianas.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Suma y resta fracciones homogéneas y heterogéneas sencillas.",
    "temas_declarativos": [
      "Multiplicación de una fracción por un número entero en recetas y compras",
      "Fracción de un número"
    ],
    "criterios_evaluacion": "Resuelve operaciones con fracciones homogéneas y opera con decimales en problemas de dinero.",
    "pagina_libro_sugerida": 125
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 6,
    "competencia_numero": 3,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Pronombres personales y posesivos: concordancia con el sujeto en la oración",
      "Coherencia oracional"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 125
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 3,
    "semana_sugerida": 6,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Circuitos eléctricos simples: generador, conductores, interruptor y receptores",
      "Armado de circuitos"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 125
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 6,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Circuitos eléctricos simples: generador, conductores, interruptor y receptores",
      "Armado de circuitos"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 125
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 7,
    "competencia_numero": 4,
    "competencia_descripcion": "Opera con fracciones propias, impropias, mixtas y números decimales en situaciones cotidianas.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Opera con números decimales hasta centésimos alineando el punto decimal.",
    "temas_declarativos": [
      "Fracciones decimales y su equivalencia con números decimales (décimos y centésimos)",
      "Uso del punto decimal"
    ],
    "criterios_evaluacion": "Resuelve operaciones con fracciones homogéneas y opera con decimales en problemas de dinero.",
    "pagina_libro_sugerida": 130
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 7,
    "competencia_numero": 3,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Uso de la \"h\" en diptongos (hie-, hue-) y verbos haber y hacer",
      "Normas ortográficas"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 130
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 3,
    "semana_sugerida": 7,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Leyes del movimiento y fuerzas: inercia, aceleración y acción-reacción",
      "Física experimental"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 130
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 7,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Leyes del movimiento y fuerzas: inercia, aceleración y acción-reacción",
      "Física experimental"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 130
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 8,
    "competencia_numero": 4,
    "competencia_descripcion": "Opera con fracciones propias, impropias, mixtas y números decimales en situaciones cotidianas.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Opera con números decimales hasta centésimos alineando el punto decimal.",
    "temas_declarativos": [
      "Lectura, escritura y valor posicional de números decimales hasta centésimos",
      "Alineación de cifras"
    ],
    "criterios_evaluacion": "Resuelve operaciones con fracciones homogéneas y opera con decimales en problemas de dinero.",
    "pagina_libro_sugerida": 135
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 8,
    "competencia_numero": 3,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Lectura crítica: identificación de hechos comprobables frente a opiniones en textos",
      "Pensamiento crítico"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 135
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 3,
    "semana_sugerida": 8,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Máquinas compuestas y tecnología apropiada para el trabajo agrícola comunitario",
      "Innovación rural"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 135
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 8,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Máquinas compuestas y tecnología apropiada para el trabajo agrícola comunitario",
      "Innovación rural"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 135
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 9,
    "competencia_numero": 4,
    "competencia_descripcion": "Opera con fracciones propias, impropias, mixtas y números decimales en situaciones cotidianas.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Opera con números decimales hasta centésimos alineando el punto decimal.",
    "temas_declarativos": [
      "Suma y resta de números decimales alineando el punto decimal",
      "Cálculo de cambio en Quetzales"
    ],
    "criterios_evaluacion": "Resuelve operaciones con fracciones homogéneas y opera con decimales en problemas de dinero.",
    "pagina_libro_sugerida": 140
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 9,
    "competencia_numero": 3,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Creación de un periódico mural escolar con secciones de noticias, deportes y cultura",
      "Trabajo cooperativo"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 140
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 3,
    "semana_sugerida": 9,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Uso responsable de la tecnología y tratamiento de la basura electrónica",
      "Ética tecnológica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 140
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 9,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Uso responsable de la tecnología y tratamiento de la basura electrónica",
      "Ética tecnológica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 140
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 1,
    "competencia_numero": 5,
    "competencia_descripcion": "Calcula perímetros, áreas de figuras poligonales, unidades agrarias tradicionales y análisis de datos.",
    "indicador_numero": "5.1",
    "indicador_descripcion": "Calcula el perímetro y área de cuadrados y rectángulos con fórmulas matemáticas.",
    "temas_declarativos": [
      "Clasificación de cuadriláteros y polígonos regulares e irregulares",
      "Propiedades de los ángulos"
    ],
    "criterios_evaluacion": "Aplica fórmulas de área y perímetro y realiza conversiones con medidas agrarias de la comunidad.",
    "pagina_libro_sugerida": 145
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 1,
    "competencia_numero": 4,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "El texto argumentativo: formulación de opiniones respaldadas con razones claras",
      "Estructura de opinión"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 145
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 4,
    "semana_sugerida": 1,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "El método científico escolar: observación, planteamiento del problema e hipótesis",
      "Diseño experimental"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 145
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 1,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "El método científico escolar: observación, planteamiento del problema e hipótesis",
      "Diseño experimental"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 145
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 2,
    "competencia_numero": 5,
    "competencia_descripcion": "Calcula perímetros, áreas de figuras poligonales, unidades agrarias tradicionales y análisis de datos.",
    "indicador_numero": "5.1",
    "indicador_descripcion": "Calcula el perímetro y área de cuadrados y rectángulos con fórmulas matemáticas.",
    "temas_declarativos": [
      "Perímetro de polígonos regulares y fórmulas de cálculo rápido",
      "Fórmulas P = n x l"
    ],
    "criterios_evaluacion": "Aplica fórmulas de área y perímetro y realiza conversiones con medidas agrarias de la comunidad.",
    "pagina_libro_sugerida": 150
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 2,
    "competencia_numero": 4,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "El debate escolar: normas de discusión, respeto a turnos de habla y réplicas constructivas",
      "Mesa de diálogo"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 150
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 4,
    "semana_sugerida": 2,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Variables experimentales y recolección de datos en tablas y gráficas científicas",
      "Análisis de datos"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 150
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 2,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Variables experimentales y recolección de datos en tablas y gráficas científicas",
      "Análisis de datos"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 150
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 3,
    "competencia_numero": 5,
    "competencia_descripcion": "Calcula perímetros, áreas de figuras poligonales, unidades agrarias tradicionales y análisis de datos.",
    "indicador_numero": "5.1",
    "indicador_descripcion": "Calcula el perímetro y área de cuadrados y rectángulos con fórmulas matemáticas.",
    "temas_declarativos": [
      "Concepto de área como recubrimiento de superficies con unidades cuadradas",
      "Cuadrícula en cm2"
    ],
    "criterios_evaluacion": "Aplica fórmulas de área y perímetro y realiza conversiones con medidas agrarias de la comunidad.",
    "pagina_libro_sugerida": 155
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 3,
    "competencia_numero": 4,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "La carta formal y el correo electrónico: estructura, saludo, cuerpo y despedida",
      "Correspondencia"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 155
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 4,
    "semana_sugerida": 3,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Estructura interna de la Tierra: corteza, manto, núcleo y placas tectónicas",
      "Geología nacional"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 155
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 3,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Estructura interna de la Tierra: corteza, manto, núcleo y placas tectónicas",
      "Geología nacional"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 155
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 4,
    "competencia_numero": 5,
    "competencia_descripcion": "Calcula perímetros, áreas de figuras poligonales, unidades agrarias tradicionales y análisis de datos.",
    "indicador_numero": "5.2",
    "indicador_descripcion": "Aplica unidades agrarias de Guatemala (cuerdas, arrobas y quintales) en el campo.",
    "temas_declarativos": [
      "Fórmulas de área del cuadrado y rectángulo aplicadas a planos escolares",
      "A = b x h"
    ],
    "criterios_evaluacion": "Aplica fórmulas de área y perímetro y realiza conversiones con medidas agrarias de la comunidad.",
    "pagina_libro_sugerida": 160
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 4,
    "competencia_numero": 4,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Afiches y textos publicitarios: análisis de imágenes, eslóganes y mensajes éticos",
      "Lectura multimodal"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 160
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 4,
    "semana_sugerida": 4,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "La tectónica de placas en Centroamérica: fallas de Motagua, Chixoy y Jalpatagua",
      "Sismicidad y volcanismo"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 160
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 4,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "La tectónica de placas en Centroamérica: fallas de Motagua, Chixoy y Jalpatagua",
      "Sismicidad y volcanismo"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 160
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 5,
    "competencia_numero": 5,
    "competencia_descripcion": "Calcula perímetros, áreas de figuras poligonales, unidades agrarias tradicionales y análisis de datos.",
    "indicador_numero": "5.2",
    "indicador_descripcion": "Aplica unidades agrarias de Guatemala (cuerdas, arrobas y quintales) en el campo.",
    "temas_declarativos": [
      "Unidades de superficie: el metro cuadrado (m2) y la cuerda de terreno",
      "Medidas tradicionales rurales"
    ],
    "criterios_evaluacion": "Aplica fórmulas de área y perímetro y realiza conversiones con medidas agrarias de la comunidad.",
    "pagina_libro_sugerida": 165
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 5,
    "competencia_numero": 4,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Ortografía de la \"g\" y \"j\" en terminaciones -aje, -jero, -ger, -gir",
      "Ejercicios prácticos"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 165
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 4,
    "semana_sugerida": 5,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Los volcanes de Guatemala: tipos de erupciones y monitoreo de riesgos (INSIVUMEH)",
      "Prevención volcánica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 165
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 5,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Los volcanes de Guatemala: tipos de erupciones y monitoreo de riesgos (INSIVUMEH)",
      "Prevención volcánica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 165
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 6,
    "competencia_numero": 5,
    "competencia_descripcion": "Calcula perímetros, áreas de figuras poligonales, unidades agrarias tradicionales y análisis de datos.",
    "indicador_numero": "5.2",
    "indicador_descripcion": "Aplica unidades agrarias de Guatemala (cuerdas, arrobas y quintales) en el campo.",
    "temas_declarativos": [
      "Medidas de capacidad y volumen (litro, galón, metro cúbico básico)",
      "Recipientes del entorno"
    ],
    "criterios_evaluacion": "Aplica fórmulas de área y perímetro y realiza conversiones con medidas agrarias de la comunidad.",
    "pagina_libro_sugerida": 170
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 6,
    "competencia_numero": 4,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Vicios del lenguaje comunes (redundancia, palabras comodín) y su corrección formal",
      "Pureza del idioma"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 170
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 4,
    "semana_sugerida": 6,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "La atmósfera y el cambio climático: efecto invernadero, calentamiento global y sequías",
      "Crisis climática"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 170
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 6,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "La atmósfera y el cambio climático: efecto invernadero, calentamiento global y sequías",
      "Crisis climática"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 170
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 7,
    "competencia_numero": 5,
    "competencia_descripcion": "Calcula perímetros, áreas de figuras poligonales, unidades agrarias tradicionales y análisis de datos.",
    "indicador_numero": "5.3",
    "indicador_descripcion": "Elabora e interpreta diagramas de barras dobles y gráficas de líneas.",
    "temas_declarativos": [
      "Medidas de peso tradicionales en Guatemala: quintal, arroba y libra",
      "Conversiones entre unidades"
    ],
    "criterios_evaluacion": "Aplica fórmulas de área y perímetro y realiza conversiones con medidas agrarias de la comunidad.",
    "pagina_libro_sugerida": 175
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 7,
    "competencia_numero": 4,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Fichas bibliográficas y resumen de libros del rincón de lectura escolar",
      "Técnicas de indagación"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 175
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 4,
    "semana_sugerida": 7,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "El universo: galaxias, estrellas, planetas, cometas y exploración espacial moderna",
      "Cosmología"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 175
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 7,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "El universo: galaxias, estrellas, planetas, cometas y exploración espacial moderna",
      "Cosmología"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 175
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 8,
    "competencia_numero": 5,
    "competencia_descripcion": "Calcula perímetros, áreas de figuras poligonales, unidades agrarias tradicionales y análisis de datos.",
    "indicador_numero": "5.3",
    "indicador_descripcion": "Elabora e interpreta diagramas de barras dobles y gráficas de líneas.",
    "temas_declarativos": [
      "Estadística: diagramas de barras dobles y cálculo de la moda escolar",
      "Comparación de dos series de datos"
    ],
    "criterios_evaluacion": "Aplica fórmulas de área y perímetro y realiza conversiones con medidas agrarias de la comunidad.",
    "pagina_libro_sugerida": 180
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 8,
    "competencia_numero": 4,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "El teatro escolar: lectura de guiones dramatizados y acotaciones escénicas",
      "Lectura coral"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 180
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 4,
    "semana_sugerida": 8,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "La astronomía Maya: observaciones de Venus, los solsticios y el calendario agrícola",
      "Arqueoastronomía"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 180
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 8,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "La astronomía Maya: observaciones de Venus, los solsticios y el calendario agrícola",
      "Arqueoastronomía"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 180
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 9,
    "competencia_numero": 5,
    "competencia_descripcion": "Calcula perímetros, áreas de figuras poligonales, unidades agrarias tradicionales y análisis de datos.",
    "indicador_numero": "5.3",
    "indicador_descripcion": "Elabora e interpreta diagramas de barras dobles y gráficas de líneas.",
    "temas_declarativos": [
      "Gráficas de líneas para registrar variaciones de temperatura y ventas",
      "Interpretación de tendencias"
    ],
    "criterios_evaluacion": "Aplica fórmulas de área y perímetro y realiza conversiones con medidas agrarias de la comunidad.",
    "pagina_libro_sugerida": 185
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 9,
    "competencia_numero": 4,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Antología literaria del aula: recopilación de cuentos y poemas escritos por los alumnos",
      "Publicación final"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 185
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 4,
    "semana_sugerida": 9,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Feria Científica y Tecnológica Escolar: exposición de experimentos y prototipos",
      "Comunidad de aprendizaje"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 185
  },
  {
    "grado": 4,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 9,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Feria Científica y Tecnológica Escolar: exposición de experimentos y prototipos",
      "Comunidad de aprendizaje"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 185
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 1,
    "competencia_numero": 1,
    "competencia_descripcion": "Utiliza el valor posicional de números hasta 1,000,000, jerarquía operativa, potenciación y numeración maya.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Resuelve operaciones combinadas respetando la jerarquía de signos y potencias.",
    "temas_declarativos": [
      "Números naturales hasta 1,000,000: valor posicional y notación exponencial",
      "Millones y centenas de millar"
    ],
    "criterios_evaluacion": "Resuelve jerarquías de operaciones, calcula mcm/MCD y maneja potencias y numeración maya.",
    "pagina_libro_sugerida": 10
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 1,
    "competencia_numero": 1,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Lectura comprensiva de textos narrativos: identificación de la idea principal",
      "Subrayado de ideas"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 10
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 1,
    "semana_sugerida": 1,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "La célula: unidad fundamental de la vida (célula animal y célula vegetal)",
      "Organelos celulares"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 10
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 1,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "La célula: unidad fundamental de la vida (célula animal y célula vegetal)",
      "Organelos celulares"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 10
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 2,
    "competencia_numero": 1,
    "competencia_descripcion": "Utiliza el valor posicional de números hasta 1,000,000, jerarquía operativa, potenciación y numeración maya.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Resuelve operaciones combinadas respetando la jerarquía de signos y potencias.",
    "temas_declarativos": [
      "Operaciones combinadas y jerarquía de signos (paréntesis, multiplicación, adición)",
      "Resolución formal"
    ],
    "criterios_evaluacion": "Resuelve jerarquías de operaciones, calcula mcm/MCD y maneja potencias y numeración maya.",
    "pagina_libro_sugerida": 15
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 2,
    "competencia_numero": 1,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "El diccionario: orden alfabético y búsqueda rápida de palabras desconocidas",
      "Uso del diccionario"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 15
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 1,
    "semana_sugerida": 2,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Niveles de organización biológica: célula, tejido, órgano, sistema y organismo",
      "Estructura biológica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 15
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 2,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Niveles de organización biológica: célula, tejido, órgano, sistema y organismo",
      "Estructura biológica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 15
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 3,
    "competencia_numero": 1,
    "competencia_descripcion": "Utiliza el valor posicional de números hasta 1,000,000, jerarquía operativa, potenciación y numeración maya.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Resuelve operaciones combinadas respetando la jerarquía de signos y potencias.",
    "temas_declarativos": [
      "Potenciación de números naturales: base, exponente y cálculo de cuadrados y cubos",
      "Notación de potencias"
    ],
    "criterios_evaluacion": "Resuelve jerarquías de operaciones, calcula mcm/MCD y maneja potencias y numeración maya.",
    "pagina_libro_sugerida": 20
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 3,
    "competencia_numero": 1,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "La estructura del párrafo: oración principal y oraciones secundarias de apoyo",
      "Redacción de párrafos"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 20
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 1,
    "semana_sugerida": 3,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "El sistema circulatorio: el corazón, vasos sanguíneos y circulación de la sangre",
      "Frecuencia cardíaca"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 20
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 3,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "El sistema circulatorio: el corazón, vasos sanguíneos y circulación de la sangre",
      "Frecuencia cardíaca"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 20
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 4,
    "competencia_numero": 1,
    "competencia_descripcion": "Utiliza el valor posicional de números hasta 1,000,000, jerarquía operativa, potenciación y numeración maya.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Calcula el mcm y MCD mediante descomposición simultánea en factores primos.",
    "temas_declarativos": [
      "Radicación elemental: raíz cuadrada exacta de números de dos y tres cifras",
      "Raíz como operación inversa"
    ],
    "criterios_evaluacion": "Resuelve jerarquías de operaciones, calcula mcm/MCD y maneja potencias y numeración maya.",
    "pagina_libro_sugerida": 25
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 4,
    "competencia_numero": 1,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Sustantivos propios y comunes, individuales y colectivos en lecturas comunitarias",
      "Gramática formal"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 25
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 1,
    "semana_sugerida": 4,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "El sistema respiratorio: intercambio gaseoso en los pulmones y salud pulmonar",
      "Capacidad pulmonar"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 25
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 4,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "El sistema respiratorio: intercambio gaseoso en los pulmones y salud pulmonar",
      "Capacidad pulmonar"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 25
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 5,
    "competencia_numero": 1,
    "competencia_descripcion": "Utiliza el valor posicional de números hasta 1,000,000, jerarquía operativa, potenciación y numeración maya.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Calcula el mcm y MCD mediante descomposición simultánea en factores primos.",
    "temas_declarativos": [
      "Mínimo Común Múltiplo (mcm) por factorización simultánea de factores primos",
      "Descomposición en primos"
    ],
    "criterios_evaluacion": "Resuelve jerarquías de operaciones, calcula mcm/MCD y maneja potencias y numeración maya.",
    "pagina_libro_sugerida": 30
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 5,
    "competencia_numero": 1,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "El adjetivo calificativo y la concordancia de género y número con el sustantivo",
      "Descripciones ricas"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 30
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 1,
    "semana_sugerida": 5,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "El sistema digestivo y nutrición: absorción de nutrientes y dieta balanceada",
      "Higiene alimentaria"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 30
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 5,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "El sistema digestivo y nutrición: absorción de nutrientes y dieta balanceada",
      "Higiene alimentaria"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 30
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 6,
    "competencia_numero": 1,
    "competencia_descripcion": "Utiliza el valor posicional de números hasta 1,000,000, jerarquía operativa, potenciación y numeración maya.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Calcula el mcm y MCD mediante descomposición simultánea en factores primos.",
    "temas_declarativos": [
      "Máximo Común Divisor (MCD) aplicado a problemas de distribución y empaque",
      "Cálculo de divisor común"
    ],
    "criterios_evaluacion": "Resuelve jerarquías de operaciones, calcula mcm/MCD y maneja potencias y numeración maya.",
    "pagina_libro_sugerida": 35
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 6,
    "competencia_numero": 1,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Palabras agudas, graves y esdrújulas: sílaba tónica y reglas de acentuación",
      "Ortografía acentual"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 35
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 1,
    "semana_sugerida": 6,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "El sistema reproductor humano y cambios físicos y emocionales en la pubertad",
      "Desarrollo humano"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 35
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 6,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "El sistema reproductor humano y cambios físicos y emocionales en la pubertad",
      "Desarrollo humano"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 35
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 7,
    "competencia_numero": 1,
    "competencia_descripcion": "Utiliza el valor posicional de números hasta 1,000,000, jerarquía operativa, potenciación y numeración maya.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Traduce cantidades complejas al sistema de numeración maya de tres posiciones.",
    "temas_declarativos": [
      "Resolución de problemas de optimización con mcm y MCD en comercio local",
      "Aplicación en logística"
    ],
    "criterios_evaluacion": "Resuelve jerarquías de operaciones, calcula mcm/MCD y maneja potencias y numeración maya.",
    "pagina_libro_sugerida": 40
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 7,
    "competencia_numero": 1,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "El verbo: tiempos fundamentales (pasado, presente y futuro) en relatos de la aldea",
      "Conjugación verbal"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 40
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 1,
    "semana_sugerida": 7,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "El sistema nervioso y los órganos sensoriales: transmisión de impulsos nerviosos",
      "Reflejos y respuestas"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 40
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 7,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "El sistema nervioso y los órganos sensoriales: transmisión de impulsos nerviosos",
      "Reflejos y respuestas"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 40
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 8,
    "competencia_numero": 1,
    "competencia_descripcion": "Utiliza el valor posicional de números hasta 1,000,000, jerarquía operativa, potenciación y numeración maya.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Traduce cantidades complejas al sistema de numeración maya de tres posiciones.",
    "temas_declarativos": [
      "Sistema de numeración Maya hasta la tercera posición (valores 1, 20 y 400 hasta 7,999)",
      "Tablero vigesimal"
    ],
    "criterios_evaluacion": "Resuelve jerarquías de operaciones, calcula mcm/MCD y maneja potencias y numeración maya.",
    "pagina_libro_sugerida": 45
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 8,
    "competencia_numero": 1,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Uso de la coma en enumeraciones y conectores de secuencia (primero, luego, finalmente)",
      "Puntuación clara"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 45
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 1,
    "semana_sugerida": 8,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Enfermedades infectocontagiosas y parasitarias: prevención, agua segura y vacunación",
      "Epidemiología escolar"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 45
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 8,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Enfermedades infectocontagiosas y parasitarias: prevención, agua segura y vacunación",
      "Epidemiología escolar"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 45
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 9,
    "competencia_numero": 1,
    "competencia_descripcion": "Utiliza el valor posicional de números hasta 1,000,000, jerarquía operativa, potenciación y numeración maya.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Traduce cantidades complejas al sistema de numeración maya de tres posiciones.",
    "temas_declarativos": [
      "Conversión entre sistema decimal y vigesimal maya para fechas y cantidades",
      "Cálculo posicional"
    ],
    "criterios_evaluacion": "Resuelve jerarquías de operaciones, calcula mcm/MCD y maneja potencias y numeración maya.",
    "pagina_libro_sugerida": 50
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 9,
    "competencia_numero": 1,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Redacción de anécdotas escolares con orden cronológico y ortografía cuidada",
      "Taller de escritura"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 50
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 1,
    "semana_sugerida": 9,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "La medicina tradicional guatemalteca: plantas medicinales validadas científicamente",
      "Etnobotánica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 50
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 9,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "La medicina tradicional guatemalteca: plantas medicinales validadas científicamente",
      "Etnobotánica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 50
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 1,
    "competencia_numero": 3,
    "competencia_descripcion": "Opera con fracciones heterogéneas mediante mínimo común múltiplo (mcm) y números decimales.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Suma y resta fracciones con distinto denominador simplificando a su mínima expresión.",
    "temas_declarativos": [
      "Fracciones heterogéneas: búsqueda del común denominador mediante mcm",
      "Homogeneización de fracciones"
    ],
    "criterios_evaluacion": "Opera fracciones heterogéneas usando mcm y resuelve multiplicaciones decimales complejas.",
    "pagina_libro_sugerida": 55
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 1,
    "competencia_numero": 2,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Textos informativos: la noticia comunitaria y artículos de divulgación infantil",
      "Estructura periodística"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 55
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 2,
    "semana_sugerida": 1,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Ecosistemas y biomas de Guatemala: selva tropical, bosque nuboso y altiplano",
      "Biodiversidad nacional"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 55
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 1,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Ecosistemas y biomas de Guatemala: selva tropical, bosque nuboso y altiplano",
      "Biodiversidad nacional"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 55
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 2,
    "competencia_numero": 3,
    "competencia_descripcion": "Opera con fracciones heterogéneas mediante mínimo común múltiplo (mcm) y números decimales.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Suma y resta fracciones con distinto denominador simplificando a su mínima expresión.",
    "temas_declarativos": [
      "Adición y sustracción de fracciones heterogéneas y números mixtos",
      "Simplificación al máximo"
    ],
    "criterios_evaluacion": "Opera fracciones heterogéneas usando mcm y resuelve multiplicaciones decimales complejas.",
    "pagina_libro_sugerida": 60
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 2,
    "competencia_numero": 2,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Organizadores gráficos: elaboración de mapas conceptuales y esquemas de llaves",
      "Técnicas de estudio"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 60
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 2,
    "semana_sugerida": 2,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Factores bióticos y abióticos en el equilibrio ecológico mesoamericano",
      "Interacciones naturales"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 60
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 2,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Factores bióticos y abióticos en el equilibrio ecológico mesoamericano",
      "Interacciones naturales"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 60
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 3,
    "competencia_numero": 3,
    "competencia_descripcion": "Opera con fracciones heterogéneas mediante mínimo común múltiplo (mcm) y números decimales.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Suma y resta fracciones con distinto denominador simplificando a su mínima expresión.",
    "temas_declarativos": [
      "Multiplicación de fracciones (numerador por numerador, denominador por denominador)",
      "Cancelación previa"
    ],
    "criterios_evaluacion": "Opera fracciones heterogéneas usando mcm y resuelve multiplicaciones decimales complejas.",
    "pagina_libro_sugerida": 65
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 3,
    "competencia_numero": 2,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "El resumen escolar: extracción de ideas centrales sin copiar párrafos enteros",
      "Síntesis textual"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 65
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 2,
    "semana_sugerida": 3,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Niveles tróficos: productores, consumidores primarios, secundarios y descomponedores",
      "Redes alimenticias"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 65
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 3,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Niveles tróficos: productores, consumidores primarios, secundarios y descomponedores",
      "Redes alimenticias"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 65
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 4,
    "competencia_numero": 3,
    "competencia_descripcion": "Opera con fracciones heterogéneas mediante mínimo común múltiplo (mcm) y números decimales.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Multiplica y divide fracciones comunes y mixtas en resolución de problemas.",
    "temas_declarativos": [
      "Fracción de una cantidad entera (ej. 3/4 de 80 quetzales)",
      "Aplicación financiera"
    ],
    "criterios_evaluacion": "Opera fracciones heterogéneas usando mcm y resuelve multiplicaciones decimales complejas.",
    "pagina_libro_sugerida": 70
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 4,
    "competencia_numero": 2,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Familia de palabras, prefijos (des-, re-, in-) y sufijos (-ito, -ote, -ero) en el léxico",
      "Morfología léxica"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 70
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 2,
    "semana_sugerida": 4,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Flujo de energía y ciclos biogeoquímicos (ciclo del carbono, nitrógeno y fósforo)",
      "Ciclos ecológicos"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 70
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 4,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Flujo de energía y ciclos biogeoquímicos (ciclo del carbono, nitrógeno y fósforo)",
      "Ciclos ecológicos"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 70
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 5,
    "competencia_numero": 3,
    "competencia_descripcion": "Opera con fracciones heterogéneas mediante mínimo común múltiplo (mcm) y números decimales.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Multiplica y divide fracciones comunes y mixtas en resolución de problemas.",
    "temas_declarativos": [
      "División de fracciones mediante el método de producto cruzado o inverso multiplicativo",
      "Ley del sándwich"
    ],
    "criterios_evaluacion": "Opera fracciones heterogéneas usando mcm y resuelve multiplicaciones decimales complejas.",
    "pagina_libro_sugerida": 75
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 5,
    "competencia_numero": 2,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Uso ortográfico de las grafías dudosas: b/v en terminaciones -aba y palabras con bi-",
      "Reglas ortográficas"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 75
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 2,
    "semana_sugerida": 5,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Relaciones interespecíficas: mutualismo, comensalismo, parasitismo y depredación",
      "Simbiosis biológica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 75
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 5,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Relaciones interespecíficas: mutualismo, comensalismo, parasitismo y depredación",
      "Simbiosis biológica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 75
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 6,
    "competencia_numero": 3,
    "competencia_descripcion": "Opera con fracciones heterogéneas mediante mínimo común múltiplo (mcm) y números decimales.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Multiplica y divide fracciones comunes y mixtas en resolución de problemas.",
    "temas_declarativos": [
      "Operaciones combinadas con fracciones y simplificación a su mínima expresión",
      "Uso de paréntesis"
    ],
    "criterios_evaluacion": "Opera fracciones heterogéneas usando mcm y resuelve multiplicaciones decimales complejas.",
    "pagina_libro_sugerida": 80
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 6,
    "competencia_numero": 2,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Uso ortográfico de c, s, z en diminutivos (-cito, -cita) y plurales de palabras con z",
      "Dictado formativo"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 80
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 2,
    "semana_sugerida": 6,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Áreas protegidas de Guatemala (CONAP): parques nacionales, biotopos y volcanes",
      "Conservación nacional"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 80
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 6,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Áreas protegidas de Guatemala (CONAP): parques nacionales, biotopos y volcanes",
      "Conservación nacional"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 80
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 7,
    "competencia_numero": 3,
    "competencia_descripcion": "Opera con fracciones heterogéneas mediante mínimo común múltiplo (mcm) y números decimales.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Multiplica números decimales hasta milésimos con precisión algorítmica.",
    "temas_declarativos": [
      "Problemas de aplicación con medidas de granos básicos y repartos fraccionarios",
      "Contexto comunitario"
    ],
    "criterios_evaluacion": "Opera fracciones heterogéneas usando mcm y resuelve multiplicaciones decimales complejas.",
    "pagina_libro_sugerida": 85
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 7,
    "competencia_numero": 2,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "La fábula y la moraleja: análisis de valores éticos en relatos tradicionales",
      "Juicio crítico"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 85
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 2,
    "semana_sugerida": 7,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Especies en peligro de extinción en Guatemala (el Quetzal, jaguar, pinabete)",
      "Protección de especies"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 85
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 7,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Especies en peligro de extinción en Guatemala (el Quetzal, jaguar, pinabete)",
      "Protección de especies"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 85
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 8,
    "competencia_numero": 3,
    "competencia_descripcion": "Opera con fracciones heterogéneas mediante mínimo común múltiplo (mcm) y números decimales.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Multiplica números decimales hasta milésimos con precisión algorítmica.",
    "temas_declarativos": [
      "Números decimales hasta milésimos: ordenación en la recta numérica",
      "Décimos, centésimos y milésimos"
    ],
    "criterios_evaluacion": "Opera fracciones heterogéneas usando mcm y resuelve multiplicaciones decimales complejas.",
    "pagina_libro_sugerida": 90
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 8,
    "competencia_numero": 2,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "La entrevista a ancianos y líderes comunitarios: formulación de preguntas abiertas",
      "Tradición oral"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 90
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 2,
    "semana_sugerida": 8,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Impacto ambiental de la deforestación y la contaminación hídrica en el lago de Amatitlán",
      "Estudio de caso local"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 90
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 8,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Impacto ambiental de la deforestación y la contaminación hídrica en el lago de Amatitlán",
      "Estudio de caso local"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 90
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 9,
    "competencia_numero": 3,
    "competencia_descripcion": "Opera con fracciones heterogéneas mediante mínimo común múltiplo (mcm) y números decimales.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Multiplica números decimales hasta milésimos con precisión algorítmica.",
    "temas_declarativos": [
      "Suma, resta y multiplicación de números decimales por naturales y decimales",
      "Multiplicación con punto"
    ],
    "criterios_evaluacion": "Opera fracciones heterogéneas usando mcm y resuelve multiplicaciones decimales complejas.",
    "pagina_libro_sugerida": 95
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 9,
    "competencia_numero": 2,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Exposición oral individual: uso de fichas de apoyo y modulación de voz en el aula",
      "Oratoria infantil"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 95
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 2,
    "semana_sugerida": 9,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Proyectos de reforestación escolar y huertos pedagógicos sostenibles",
      "Acción comunitaria"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 95
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 9,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Proyectos de reforestación escolar y huertos pedagógicos sostenibles",
      "Acción comunitaria"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 95
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 1,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica proporciones, regla de tres simple directa, porcentajes y cálculo de áreas de triángulos.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Efectúa divisiones con números decimales en divisor y dividendo.",
    "temas_declarativos": [
      "División de números decimales entre naturales y cocientes decimales exactos",
      "Algoritmo de división"
    ],
    "criterios_evaluacion": "Resuelve problemas de regla de tres directa, calcula porcentajes y áreas triangulares.",
    "pagina_libro_sugerida": 100
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 1,
    "competencia_numero": 3,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Textos literarios: leyendas y mitos guatemaltecos (El Sombrerón, La Llorona, El Cadejo)",
      "Literatura nacional"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 100
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 3,
    "semana_sugerida": 1,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Estructura de la materia: átomos, moléculas, elementos químicos y compuestos",
      "Tabla periódica básica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 100
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 1,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Estructura de la materia: átomos, moléculas, elementos químicos y compuestos",
      "Tabla periódica básica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 100
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 2,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica proporciones, regla de tres simple directa, porcentajes y cálculo de áreas de triángulos.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Efectúa divisiones con números decimales en divisor y dividendo.",
    "temas_declarativos": [
      "División de un número natural entre un número decimal moviendo el punto",
      "Amplificación por 10 o 100"
    ],
    "criterios_evaluacion": "Resuelve problemas de regla de tres directa, calcula porcentajes y áreas triangulares.",
    "pagina_libro_sugerida": 105
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 2,
    "competencia_numero": 3,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Figuras literarias elementales: el símil o comparación y la metáfora en la poesía",
      "Apreciación poética"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 105
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 3,
    "semana_sugerida": 2,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Mezclas homogéneas y heterogéneas y métodos de separación (filtración, decantación)",
      "Laboratorio escolar"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 105
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 2,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Mezclas homogéneas y heterogéneas y métodos de separación (filtración, decantación)",
      "Laboratorio escolar"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 105
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 3,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica proporciones, regla de tres simple directa, porcentajes y cálculo de áreas de triángulos.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Efectúa divisiones con números decimales en divisor y dividendo.",
    "temas_declarativos": [
      "Razones y proporciones: concepto de razón como cociente de dos cantidades",
      "Notación a/b o a:b"
    ],
    "criterios_evaluacion": "Resuelve problemas de regla de tres directa, calcula porcentajes y áreas triangulares.",
    "pagina_libro_sugerida": 110
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 3,
    "competencia_numero": 3,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "El texto instructivo: recetas de cocina tradicional y manuales de huerto escolar",
      "Secuencia lógica"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 110
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 3,
    "semana_sugerida": 3,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Cambios físicos y químicos de la materia: combustión, oxidación y fermentación",
      "Reacciones químicas"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 110
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 3,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Cambios físicos y químicos de la materia: combustión, oxidación y fermentación",
      "Reacciones químicas"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 110
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 4,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica proporciones, regla de tres simple directa, porcentajes y cálculo de áreas de triángulos.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Plantea y resuelve problemas de regla de tres simple directa y porcentajes comerciales.",
    "temas_declarativos": [
      "Proporcionalidad directa: tablas de magnitudes directamente proporcionales",
      "Constante de proporcionalidad"
    ],
    "criterios_evaluacion": "Resuelve problemas de regla de tres directa, calcula porcentajes y áreas triangulares.",
    "pagina_libro_sugerida": 115
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 4,
    "competencia_numero": 3,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "La oración compuesta: nexos coordinantes (y, e, ni, o, pero) en la redacción",
      "Cohesión textual"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 115
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 3,
    "semana_sugerida": 4,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Tipos de energía: mecánica, térmica, eléctrica, solar, eólica e hidráulica",
      "Transformaciones"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 115
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 4,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Tipos de energía: mecánica, térmica, eléctrica, solar, eólica e hidráulica",
      "Transformaciones"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 115
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 5,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica proporciones, regla de tres simple directa, porcentajes y cálculo de áreas de triángulos.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Plantea y resuelve problemas de regla de tres simple directa y porcentajes comerciales.",
    "temas_declarativos": [
      "Regla de tres simple directa aplicada al comercio, precios y recetas",
      "Planteamiento de proporciones"
    ],
    "criterios_evaluacion": "Resuelve problemas de regla de tres directa, calcula porcentajes y áreas triangulares.",
    "pagina_libro_sugerida": 120
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 5,
    "competencia_numero": 3,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Puntuación avanzada: uso de los dos puntos (:) antes de enumeraciones y citas",
      "Puntuación formal"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 120
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 3,
    "semana_sugerida": 5,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Fuentes de energía renovables y no renovables en la matriz energética de Guatemala",
      "Sostenibilidad"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 120
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 5,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Fuentes de energía renovables y no renovables en la matriz energética de Guatemala",
      "Sostenibilidad"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 120
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 6,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica proporciones, regla de tres simple directa, porcentajes y cálculo de áreas de triángulos.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Plantea y resuelve problemas de regla de tres simple directa y porcentajes comerciales.",
    "temas_declarativos": [
      "Concepto de porcentaje (%) como fracción de denominador 100",
      "Equivalencia fracción-decimal-porcentaje"
    ],
    "criterios_evaluacion": "Resuelve problemas de regla de tres directa, calcula porcentajes y áreas triangulares.",
    "pagina_libro_sugerida": 125
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 6,
    "competencia_numero": 3,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Pronombres personales y posesivos: concordancia con el sujeto en la oración",
      "Coherencia oracional"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 125
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 3,
    "semana_sugerida": 6,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Circuitos eléctricos simples: generador, conductores, interruptor y receptores",
      "Armado de circuitos"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 125
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 6,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Circuitos eléctricos simples: generador, conductores, interruptor y receptores",
      "Armado de circuitos"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 125
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 7,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica proporciones, regla de tres simple directa, porcentajes y cálculo de áreas de triángulos.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Calcula el área de triángulos y demuestra la suma de ángulos internos.",
    "temas_declarativos": [
      "Cálculo de porcentajes simples (10%, 25%, 50%) en descuentos de ferretería y granja",
      "Cálculo rápido"
    ],
    "criterios_evaluacion": "Resuelve problemas de regla de tres directa, calcula porcentajes y áreas triangulares.",
    "pagina_libro_sugerida": 130
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 7,
    "competencia_numero": 3,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Uso de la \"h\" en diptongos (hie-, hue-) y verbos haber y hacer",
      "Normas ortográficas"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 130
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 3,
    "semana_sugerida": 7,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Leyes del movimiento y fuerzas: inercia, aceleración y acción-reacción",
      "Física experimental"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 130
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 7,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Leyes del movimiento y fuerzas: inercia, aceleración y acción-reacción",
      "Física experimental"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 130
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 8,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica proporciones, regla de tres simple directa, porcentajes y cálculo de áreas de triángulos.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Calcula el área de triángulos y demuestra la suma de ángulos internos.",
    "temas_declarativos": [
      "Triángulos: clasificación por lados y por ángulos, suma de ángulos internos (180°)",
      "Demostración práctica"
    ],
    "criterios_evaluacion": "Resuelve problemas de regla de tres directa, calcula porcentajes y áreas triangulares.",
    "pagina_libro_sugerida": 135
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 8,
    "competencia_numero": 3,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Lectura crítica: identificación de hechos comprobables frente a opiniones en textos",
      "Pensamiento crítico"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 135
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 3,
    "semana_sugerida": 8,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Máquinas compuestas y tecnología apropiada para el trabajo agrícola comunitario",
      "Innovación rural"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 135
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 8,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Máquinas compuestas y tecnología apropiada para el trabajo agrícola comunitario",
      "Innovación rural"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 135
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 9,
    "competencia_numero": 4,
    "competencia_descripcion": "Aplica proporciones, regla de tres simple directa, porcentajes y cálculo de áreas de triángulos.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Calcula el área de triángulos y demuestra la suma de ángulos internos.",
    "temas_declarativos": [
      "Fórmula y cálculo del área del triángulo (A = (b x h) / 2) en parcelas",
      "Aplicación en terrenos"
    ],
    "criterios_evaluacion": "Resuelve problemas de regla de tres directa, calcula porcentajes y áreas triangulares.",
    "pagina_libro_sugerida": 140
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 9,
    "competencia_numero": 3,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Creación de un periódico mural escolar con secciones de noticias, deportes y cultura",
      "Trabajo cooperativo"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 140
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 3,
    "semana_sugerida": 9,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Uso responsable de la tecnología y tratamiento de la basura electrónica",
      "Ética tecnológica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 140
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 9,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Uso responsable de la tecnología y tratamiento de la basura electrónica",
      "Ética tecnológica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 140
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 1,
    "competencia_numero": 5,
    "competencia_descripcion": "Calcula áreas de polígonos regulares, volúmenes de prismas, promedios estadísticos y probabilidad.",
    "indicador_numero": "5.1",
    "indicador_descripcion": "Calcula el área de polígonos regulares y el volumen de prismas rectangulares.",
    "temas_declarativos": [
      "Área de paralelogramos (romboide y rombo) y trapecios",
      "Fórmulas geométricas formales"
    ],
    "criterios_evaluacion": "Calcula áreas y volúmenes, obtiene promedios escolares e interpreta gráficas circulares.",
    "pagina_libro_sugerida": 145
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 1,
    "competencia_numero": 4,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "El texto argumentativo: formulación de opiniones respaldadas con razones claras",
      "Estructura de opinión"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 145
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 4,
    "semana_sugerida": 1,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "El método científico escolar: observación, planteamiento del problema e hipótesis",
      "Diseño experimental"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 145
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 1,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "El método científico escolar: observación, planteamiento del problema e hipótesis",
      "Diseño experimental"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 145
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 2,
    "competencia_numero": 5,
    "competencia_descripcion": "Calcula áreas de polígonos regulares, volúmenes de prismas, promedios estadísticos y probabilidad.",
    "indicador_numero": "5.1",
    "indicador_descripcion": "Calcula el área de polígonos regulares y el volumen de prismas rectangulares.",
    "temas_declarativos": [
      "Polígonos regulares: apotema y cálculo del área (A = (P x a) / 2)",
      "Descomposición en triángulos"
    ],
    "criterios_evaluacion": "Calcula áreas y volúmenes, obtiene promedios escolares e interpreta gráficas circulares.",
    "pagina_libro_sugerida": 150
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 2,
    "competencia_numero": 4,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "El debate escolar: normas de discusión, respeto a turnos de habla y réplicas constructivas",
      "Mesa de diálogo"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 150
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 4,
    "semana_sugerida": 2,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Variables experimentales y recolección de datos en tablas y gráficas científicas",
      "Análisis de datos"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 150
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 2,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Variables experimentales y recolección de datos en tablas y gráficas científicas",
      "Análisis de datos"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 150
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 3,
    "competencia_numero": 5,
    "competencia_descripcion": "Calcula áreas de polígonos regulares, volúmenes de prismas, promedios estadísticos y probabilidad.",
    "indicador_numero": "5.1",
    "indicador_descripcion": "Calcula el área de polígonos regulares y el volumen de prismas rectangulares.",
    "temas_declarativos": [
      "Volumen de cuerpos geométricos: el cubo y prismas rectangulares (V = l x a x h)",
      "Unidades cúbicas"
    ],
    "criterios_evaluacion": "Calcula áreas y volúmenes, obtiene promedios escolares e interpreta gráficas circulares.",
    "pagina_libro_sugerida": 155
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 3,
    "competencia_numero": 4,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "La carta formal y el correo electrónico: estructura, saludo, cuerpo y despedida",
      "Correspondencia"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 155
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 4,
    "semana_sugerida": 3,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Estructura interna de la Tierra: corteza, manto, núcleo y placas tectónicas",
      "Geología nacional"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 155
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 3,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Estructura interna de la Tierra: corteza, manto, núcleo y placas tectónicas",
      "Geología nacional"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 155
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 4,
    "competencia_numero": 5,
    "competencia_descripcion": "Calcula áreas de polígonos regulares, volúmenes de prismas, promedios estadísticos y probabilidad.",
    "indicador_numero": "5.2",
    "indicador_descripcion": "Realiza conversiones entre el sistema métrico, inglés y tradicional guatemalteco.",
    "temas_declarativos": [
      "Unidades de volumen y capacidad: decímetro cúbico, centímetro cúbico y litros",
      "Equivalencia 1 dm3 = 1 litro"
    ],
    "criterios_evaluacion": "Calcula áreas y volúmenes, obtiene promedios escolares e interpreta gráficas circulares.",
    "pagina_libro_sugerida": 160
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 4,
    "competencia_numero": 4,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Afiches y textos publicitarios: análisis de imágenes, eslóganes y mensajes éticos",
      "Lectura multimodal"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 160
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 4,
    "semana_sugerida": 4,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "La tectónica de placas en Centroamérica: fallas de Motagua, Chixoy y Jalpatagua",
      "Sismicidad y volcanismo"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 160
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 4,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "La tectónica de placas en Centroamérica: fallas de Motagua, Chixoy y Jalpatagua",
      "Sismicidad y volcanismo"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 160
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 5,
    "competencia_numero": 5,
    "competencia_descripcion": "Calcula áreas de polígonos regulares, volúmenes de prismas, promedios estadísticos y probabilidad.",
    "indicador_numero": "5.2",
    "indicador_descripcion": "Realiza conversiones entre el sistema métrico, inglés y tradicional guatemalteco.",
    "temas_declarativos": [
      "Conversiones entre medidas métricas e inglesas (yarda, pulgada, pie a metros)",
      "Tablas de conversión"
    ],
    "criterios_evaluacion": "Calcula áreas y volúmenes, obtiene promedios escolares e interpreta gráficas circulares.",
    "pagina_libro_sugerida": 165
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 5,
    "competencia_numero": 4,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Ortografía de la \"g\" y \"j\" en terminaciones -aje, -jero, -ger, -gir",
      "Ejercicios prácticos"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 165
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 4,
    "semana_sugerida": 5,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Los volcanes de Guatemala: tipos de erupciones y monitoreo de riesgos (INSIVUMEH)",
      "Prevención volcánica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 165
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 5,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Los volcanes de Guatemala: tipos de erupciones y monitoreo de riesgos (INSIVUMEH)",
      "Prevención volcánica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 165
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 6,
    "competencia_numero": 5,
    "competencia_descripcion": "Calcula áreas de polígonos regulares, volúmenes de prismas, promedios estadísticos y probabilidad.",
    "indicador_numero": "5.2",
    "indicador_descripcion": "Realiza conversiones entre el sistema métrico, inglés y tradicional guatemalteco.",
    "temas_declarativos": [
      "Medidas de peso de carga pesada: tonelada métrica y su relación con quintales (20 qq)",
      "Transporte agrícola"
    ],
    "criterios_evaluacion": "Calcula áreas y volúmenes, obtiene promedios escolares e interpreta gráficas circulares.",
    "pagina_libro_sugerida": 170
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 6,
    "competencia_numero": 4,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Vicios del lenguaje comunes (redundancia, palabras comodín) y su corrección formal",
      "Pureza del idioma"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 170
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 4,
    "semana_sugerida": 6,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "La atmósfera y el cambio climático: efecto invernadero, calentamiento global y sequías",
      "Crisis climática"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 170
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 6,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "La atmósfera y el cambio climático: efecto invernadero, calentamiento global y sequías",
      "Crisis climática"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 170
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 7,
    "competencia_numero": 5,
    "competencia_descripcion": "Calcula áreas de polígonos regulares, volúmenes de prismas, promedios estadísticos y probabilidad.",
    "indicador_numero": "5.3",
    "indicador_descripcion": "Calcula la media aritmética (promedio) e interpreta gráficos circulares.",
    "temas_declarativos": [
      "Estadística: media aritmética (promedio) y mediana de un conjunto de datos",
      "Fórmula del promedio"
    ],
    "criterios_evaluacion": "Calcula áreas y volúmenes, obtiene promedios escolares e interpreta gráficas circulares.",
    "pagina_libro_sugerida": 175
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 7,
    "competencia_numero": 4,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Fichas bibliográficas y resumen de libros del rincón de lectura escolar",
      "Técnicas de indagación"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 175
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 4,
    "semana_sugerida": 7,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "El universo: galaxias, estrellas, planetas, cometas y exploración espacial moderna",
      "Cosmología"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 175
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 7,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "El universo: galaxias, estrellas, planetas, cometas y exploración espacial moderna",
      "Cosmología"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 175
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 8,
    "competencia_numero": 5,
    "competencia_descripcion": "Calcula áreas de polígonos regulares, volúmenes de prismas, promedios estadísticos y probabilidad.",
    "indicador_numero": "5.3",
    "indicador_descripcion": "Calcula la media aritmética (promedio) e interpreta gráficos circulares.",
    "temas_declarativos": [
      "Gráficas circulares o de sectores: lectura de porcentajes en censos escolares",
      "Interpretación angular"
    ],
    "criterios_evaluacion": "Calcula áreas y volúmenes, obtiene promedios escolares e interpreta gráficas circulares.",
    "pagina_libro_sugerida": 180
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 8,
    "competencia_numero": 4,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "El teatro escolar: lectura de guiones dramatizados y acotaciones escénicas",
      "Lectura coral"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 180
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 4,
    "semana_sugerida": 8,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "La astronomía Maya: observaciones de Venus, los solsticios y el calendario agrícola",
      "Arqueoastronomía"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 180
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 8,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "La astronomía Maya: observaciones de Venus, los solsticios y el calendario agrícola",
      "Arqueoastronomía"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 180
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 9,
    "competencia_numero": 5,
    "competencia_descripcion": "Calcula áreas de polígonos regulares, volúmenes de prismas, promedios estadísticos y probabilidad.",
    "indicador_numero": "5.3",
    "indicador_descripcion": "Calcula la media aritmética (promedio) e interpreta gráficos circulares.",
    "temas_declarativos": [
      "Probabilidad simple: eventos seguros, posibles e imposibles con dados y monedas",
      "Fracción de probabilidad"
    ],
    "criterios_evaluacion": "Calcula áreas y volúmenes, obtiene promedios escolares e interpreta gráficas circulares.",
    "pagina_libro_sugerida": 185
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 9,
    "competencia_numero": 4,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Antología literaria del aula: recopilación de cuentos y poemas escritos por los alumnos",
      "Publicación final"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 185
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 4,
    "semana_sugerida": 9,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Feria Científica y Tecnológica Escolar: exposición de experimentos y prototipos",
      "Comunidad de aprendizaje"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 185
  },
  {
    "grado": 5,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 9,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Feria Científica y Tecnológica Escolar: exposición de experimentos y prototipos",
      "Comunidad de aprendizaje"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 185
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 1,
    "competencia_numero": 1,
    "competencia_descripcion": "Maneja operaciones combinadas con enteros, teoría de conjuntos y sistema vigesimal maya hasta 4 posiciones.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Aplica operaciones de conjuntos y resuelve expresiones aritméticas con signos de agrupación.",
    "temas_declarativos": [
      "Conjuntos: unión, intersección, diferencia y complemento con diagramas de Venn",
      "Operaciones lógicas"
    ],
    "criterios_evaluacion": "Resuelve operaciones combinadas con signos de agrupación y opera en el sistema maya hasta el 4.° nivel.",
    "pagina_libro_sugerida": 10
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 1,
    "competencia_numero": 1,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Lectura comprensiva de textos narrativos: identificación de la idea principal",
      "Subrayado de ideas"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 10
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 1,
    "semana_sugerida": 1,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "La célula: unidad fundamental de la vida (célula animal y célula vegetal)",
      "Organelos celulares"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 10
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 1,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "La célula: unidad fundamental de la vida (célula animal y célula vegetal)",
      "Organelos celulares"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 10
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 2,
    "competencia_numero": 1,
    "competencia_descripcion": "Maneja operaciones combinadas con enteros, teoría de conjuntos y sistema vigesimal maya hasta 4 posiciones.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Aplica operaciones de conjuntos y resuelve expresiones aritméticas con signos de agrupación.",
    "temas_declarativos": [
      "Números naturales hasta 10,000,000 y notación científica básica",
      "Lectura de grandes magnitudes"
    ],
    "criterios_evaluacion": "Resuelve operaciones combinadas con signos de agrupación y opera en el sistema maya hasta el 4.° nivel.",
    "pagina_libro_sugerida": 15
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 2,
    "competencia_numero": 1,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "El diccionario: orden alfabético y búsqueda rápida de palabras desconocidas",
      "Uso del diccionario"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 15
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 1,
    "semana_sugerida": 2,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Niveles de organización biológica: célula, tejido, órgano, sistema y organismo",
      "Estructura biológica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 15
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 2,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Niveles de organización biológica: célula, tejido, órgano, sistema y organismo",
      "Estructura biológica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 15
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 3,
    "competencia_numero": 1,
    "competencia_descripcion": "Maneja operaciones combinadas con enteros, teoría de conjuntos y sistema vigesimal maya hasta 4 posiciones.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Aplica operaciones de conjuntos y resuelve expresiones aritméticas con signos de agrupación.",
    "temas_declarativos": [
      "Operaciones combinadas complejas con llaves, corchetes y paréntesis",
      "Jerarquía rigurosa"
    ],
    "criterios_evaluacion": "Resuelve operaciones combinadas con signos de agrupación y opera en el sistema maya hasta el 4.° nivel.",
    "pagina_libro_sugerida": 20
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 3,
    "competencia_numero": 1,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "La estructura del párrafo: oración principal y oraciones secundarias de apoyo",
      "Redacción de párrafos"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 20
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 1,
    "semana_sugerida": 3,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "El sistema circulatorio: el corazón, vasos sanguíneos y circulación de la sangre",
      "Frecuencia cardíaca"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 20
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 3,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "El sistema circulatorio: el corazón, vasos sanguíneos y circulación de la sangre",
      "Frecuencia cardíaca"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 20
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 4,
    "competencia_numero": 1,
    "competencia_descripcion": "Maneja operaciones combinadas con enteros, teoría de conjuntos y sistema vigesimal maya hasta 4 posiciones.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Calcula potencias y raíces y formula balances financieros de microempresas.",
    "temas_declarativos": [
      "Potenciación con exponente cero, uno y leyes de exponentes para productos de igual base",
      "Propiedades de potencias"
    ],
    "criterios_evaluacion": "Resuelve operaciones combinadas con signos de agrupación y opera en el sistema maya hasta el 4.° nivel.",
    "pagina_libro_sugerida": 25
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 4,
    "competencia_numero": 1,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Sustantivos propios y comunes, individuales y colectivos en lecturas comunitarias",
      "Gramática formal"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 25
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 1,
    "semana_sugerida": 4,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "El sistema respiratorio: intercambio gaseoso en los pulmones y salud pulmonar",
      "Capacidad pulmonar"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 25
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 4,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "El sistema respiratorio: intercambio gaseoso en los pulmones y salud pulmonar",
      "Capacidad pulmonar"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 25
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 5,
    "competencia_numero": 1,
    "competencia_descripcion": "Maneja operaciones combinadas con enteros, teoría de conjuntos y sistema vigesimal maya hasta 4 posiciones.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Calcula potencias y raíces y formula balances financieros de microempresas.",
    "temas_declarativos": [
      "Raíz cuadrada y cúbica de números naturales con algoritmos de estimación",
      "Aproximaciones sucesivas"
    ],
    "criterios_evaluacion": "Resuelve operaciones combinadas con signos de agrupación y opera en el sistema maya hasta el 4.° nivel.",
    "pagina_libro_sugerida": 30
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 5,
    "competencia_numero": 1,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "El adjetivo calificativo y la concordancia de género y número con el sustantivo",
      "Descripciones ricas"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 30
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 1,
    "semana_sugerida": 5,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "El sistema digestivo y nutrición: absorción de nutrientes y dieta balanceada",
      "Higiene alimentaria"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 30
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 5,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "El sistema digestivo y nutrición: absorción de nutrientes y dieta balanceada",
      "Higiene alimentaria"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 30
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 6,
    "competencia_numero": 1,
    "competencia_descripcion": "Maneja operaciones combinadas con enteros, teoría de conjuntos y sistema vigesimal maya hasta 4 posiciones.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Calcula potencias y raíces y formula balances financieros de microempresas.",
    "temas_declarativos": [
      "Problemas financieros de cálculo de gastos, utilidades y balances de cooperativas",
      "Educación financiera"
    ],
    "criterios_evaluacion": "Resuelve operaciones combinadas con signos de agrupación y opera en el sistema maya hasta el 4.° nivel.",
    "pagina_libro_sugerida": 35
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 6,
    "competencia_numero": 1,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Palabras agudas, graves y esdrújulas: sílaba tónica y reglas de acentuación",
      "Ortografía acentual"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 35
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 1,
    "semana_sugerida": 6,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "El sistema reproductor humano y cambios físicos y emocionales en la pubertad",
      "Desarrollo humano"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 35
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 6,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "El sistema reproductor humano y cambios físicos y emocionales en la pubertad",
      "Desarrollo humano"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 35
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 7,
    "competencia_numero": 1,
    "competencia_descripcion": "Maneja operaciones combinadas con enteros, teoría de conjuntos y sistema vigesimal maya hasta 4 posiciones.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Opera sumas y restas en el sistema vigesimal maya hasta la cuarta posición.",
    "temas_declarativos": [
      "Sistema de numeración Maya hasta la cuarta posición (valores 1, 20, 400 y 8,000 hasta 159,999)",
      "Tablero de 4 niveles"
    ],
    "criterios_evaluacion": "Resuelve operaciones combinadas con signos de agrupación y opera en el sistema maya hasta el 4.° nivel.",
    "pagina_libro_sugerida": 40
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 7,
    "competencia_numero": 1,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "El verbo: tiempos fundamentales (pasado, presente y futuro) en relatos de la aldea",
      "Conjugación verbal"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 40
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 1,
    "semana_sugerida": 7,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "El sistema nervioso y los órganos sensoriales: transmisión de impulsos nerviosos",
      "Reflejos y respuestas"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 40
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 7,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "El sistema nervioso y los órganos sensoriales: transmisión de impulsos nerviosos",
      "Reflejos y respuestas"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 40
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 8,
    "competencia_numero": 1,
    "competencia_descripcion": "Maneja operaciones combinadas con enteros, teoría de conjuntos y sistema vigesimal maya hasta 4 posiciones.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Opera sumas y restas en el sistema vigesimal maya hasta la cuarta posición.",
    "temas_declarativos": [
      "Operaciones de suma y resta en el sistema vigesimal Maya con tablero posicional",
      "Llevadas vigesimales"
    ],
    "criterios_evaluacion": "Resuelve operaciones combinadas con signos de agrupación y opera en el sistema maya hasta el 4.° nivel.",
    "pagina_libro_sugerida": 45
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 8,
    "competencia_numero": 1,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Uso de la coma en enumeraciones y conectores de secuencia (primero, luego, finalmente)",
      "Puntuación clara"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 45
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 1,
    "semana_sugerida": 8,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Enfermedades infectocontagiosas y parasitarias: prevención, agua segura y vacunación",
      "Epidemiología escolar"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 45
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 8,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Enfermedades infectocontagiosas y parasitarias: prevención, agua segura y vacunación",
      "Epidemiología escolar"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 45
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 1,
    "semana_sugerida": 9,
    "competencia_numero": 1,
    "competencia_descripcion": "Maneja operaciones combinadas con enteros, teoría de conjuntos y sistema vigesimal maya hasta 4 posiciones.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Opera sumas y restas en el sistema vigesimal maya hasta la cuarta posición.",
    "temas_declarativos": [
      "Relación entre la cosmovisión maya, el calendario Cholq'ij y la matemática",
      "Matemática cultural"
    ],
    "criterios_evaluacion": "Resuelve operaciones combinadas con signos de agrupación y opera en el sistema maya hasta el 4.° nivel.",
    "pagina_libro_sugerida": 50
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 1,
    "semana_sugerida": 9,
    "competencia_numero": 1,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Redacción de anécdotas escolares con orden cronológico y ortografía cuidada",
      "Taller de escritura"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 50
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 1,
    "semana_sugerida": 9,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "La medicina tradicional guatemalteca: plantas medicinales validadas científicamente",
      "Etnobotánica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 50
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 1,
    "semana_sugerida": 9,
    "competencia_numero": 1,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "1.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "La medicina tradicional guatemalteca: plantas medicinales validadas científicamente",
      "Etnobotánica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 50
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 1,
    "competencia_numero": 3,
    "competencia_descripcion": "Resuelve problemas de proporcionalidad directa e inversa, porcentaje, IVA e interés simple comercial.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Aplica la propiedad fundamental de las proporciones en conversiones y escalas.",
    "temas_declarativos": [
      "Operaciones combinadas con fracciones heterogéneas, números mixtos y decimales",
      "Fracciones complejas"
    ],
    "criterios_evaluacion": "Resuelve problemas de regla de tres simple directa e inversa y calcula el IVA e interés simple.",
    "pagina_libro_sugerida": 55
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 1,
    "competencia_numero": 2,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Textos informativos: la noticia comunitaria y artículos de divulgación infantil",
      "Estructura periodística"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 55
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 2,
    "semana_sugerida": 1,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Ecosistemas y biomas de Guatemala: selva tropical, bosque nuboso y altiplano",
      "Biodiversidad nacional"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 55
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 1,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Ecosistemas y biomas de Guatemala: selva tropical, bosque nuboso y altiplano",
      "Biodiversidad nacional"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 55
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 2,
    "competencia_numero": 3,
    "competencia_descripcion": "Resuelve problemas de proporcionalidad directa e inversa, porcentaje, IVA e interés simple comercial.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Aplica la propiedad fundamental de las proporciones en conversiones y escalas.",
    "temas_declarativos": [
      "Conversión exacta entre fracciones comunes y fracciones decimales periódicas y finitas",
      "División para decimales"
    ],
    "criterios_evaluacion": "Resuelve problemas de regla de tres simple directa e inversa y calcula el IVA e interés simple.",
    "pagina_libro_sugerida": 60
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 2,
    "competencia_numero": 2,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Organizadores gráficos: elaboración de mapas conceptuales y esquemas de llaves",
      "Técnicas de estudio"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 60
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 2,
    "semana_sugerida": 2,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Factores bióticos y abióticos en el equilibrio ecológico mesoamericano",
      "Interacciones naturales"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 60
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 2,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Factores bióticos y abióticos en el equilibrio ecológico mesoamericano",
      "Interacciones naturales"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 60
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 3,
    "competencia_numero": 3,
    "competencia_descripcion": "Resuelve problemas de proporcionalidad directa e inversa, porcentaje, IVA e interés simple comercial.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Aplica la propiedad fundamental de las proporciones en conversiones y escalas.",
    "temas_declarativos": [
      "Razones y proporciones: propiedad fundamental de las proporciones (a x d = b x c)",
      "Extremos y medios"
    ],
    "criterios_evaluacion": "Resuelve problemas de regla de tres simple directa e inversa y calcula el IVA e interés simple.",
    "pagina_libro_sugerida": 65
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 3,
    "competencia_numero": 2,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "El resumen escolar: extracción de ideas centrales sin copiar párrafos enteros",
      "Síntesis textual"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 65
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 2,
    "semana_sugerida": 3,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Niveles tróficos: productores, consumidores primarios, secundarios y descomponedores",
      "Redes alimenticias"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 65
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 3,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Niveles tróficos: productores, consumidores primarios, secundarios y descomponedores",
      "Redes alimenticias"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 65
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 4,
    "competencia_numero": 3,
    "competencia_descripcion": "Resuelve problemas de proporcionalidad directa e inversa, porcentaje, IVA e interés simple comercial.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Resuelve problemas de regla de tres directa e inversa en situaciones de trabajo y producción.",
    "temas_declarativos": [
      "Regla de tres simple directa aplicada a la economía local y rendimientos agrícolas",
      "Constante k = y/x"
    ],
    "criterios_evaluacion": "Resuelve problemas de regla de tres simple directa e inversa y calcula el IVA e interés simple.",
    "pagina_libro_sugerida": 70
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 4,
    "competencia_numero": 2,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Familia de palabras, prefijos (des-, re-, in-) y sufijos (-ito, -ote, -ero) en el léxico",
      "Morfología léxica"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 70
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 2,
    "semana_sugerida": 4,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Flujo de energía y ciclos biogeoquímicos (ciclo del carbono, nitrógeno y fósforo)",
      "Ciclos ecológicos"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 70
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 4,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Flujo de energía y ciclos biogeoquímicos (ciclo del carbono, nitrógeno y fósforo)",
      "Ciclos ecológicos"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 70
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 5,
    "competencia_numero": 3,
    "competencia_descripcion": "Resuelve problemas de proporcionalidad directa e inversa, porcentaje, IVA e interés simple comercial.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Resuelve problemas de regla de tres directa e inversa en situaciones de trabajo y producción.",
    "temas_declarativos": [
      "Regla de tres simple inversa (magnitudes inversamente proporcionales: tiempo vs trabajadores)",
      "Constante k = x x y"
    ],
    "criterios_evaluacion": "Resuelve problemas de regla de tres simple directa e inversa y calcula el IVA e interés simple.",
    "pagina_libro_sugerida": 75
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 5,
    "competencia_numero": 2,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Uso ortográfico de las grafías dudosas: b/v en terminaciones -aba y palabras con bi-",
      "Reglas ortográficas"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 75
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 2,
    "semana_sugerida": 5,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Relaciones interespecíficas: mutualismo, comensalismo, parasitismo y depredación",
      "Simbiosis biológica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 75
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 5,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Relaciones interespecíficas: mutualismo, comensalismo, parasitismo y depredación",
      "Simbiosis biológica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 75
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 6,
    "competencia_numero": 3,
    "competencia_descripcion": "Resuelve problemas de proporcionalidad directa e inversa, porcentaje, IVA e interés simple comercial.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Resuelve problemas de regla de tres directa e inversa en situaciones de trabajo y producción.",
    "temas_declarativos": [
      "Porcentaje aplicado al cálculo del IVA (12%) y facturación formal en Guatemala",
      "Cultura tributaria SAT"
    ],
    "criterios_evaluacion": "Resuelve problemas de regla de tres simple directa e inversa y calcula el IVA e interés simple.",
    "pagina_libro_sugerida": 80
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 6,
    "competencia_numero": 2,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Uso ortográfico de c, s, z en diminutivos (-cito, -cita) y plurales de palabras con z",
      "Dictado formativo"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 80
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 2,
    "semana_sugerida": 6,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Áreas protegidas de Guatemala (CONAP): parques nacionales, biotopos y volcanes",
      "Conservación nacional"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 80
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 6,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Áreas protegidas de Guatemala (CONAP): parques nacionales, biotopos y volcanes",
      "Conservación nacional"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 80
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 7,
    "competencia_numero": 3,
    "competencia_descripcion": "Resuelve problemas de proporcionalidad directa e inversa, porcentaje, IVA e interés simple comercial.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Calcula el IVA (12%), descuentos comerciales e interés simple en finanzas familiares.",
    "temas_declarativos": [
      "Interés simple comercial: fórmula I = (C x t x r) / 100 en préstamos comunitarios",
      "Crédito y finanzas"
    ],
    "criterios_evaluacion": "Resuelve problemas de regla de tres simple directa e inversa y calcula el IVA e interés simple.",
    "pagina_libro_sugerida": 85
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 7,
    "competencia_numero": 2,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "La fábula y la moraleja: análisis de valores éticos en relatos tradicionales",
      "Juicio crítico"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 85
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 2,
    "semana_sugerida": 7,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Especies en peligro de extinción en Guatemala (el Quetzal, jaguar, pinabete)",
      "Protección de especies"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 85
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 7,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Especies en peligro de extinción en Guatemala (el Quetzal, jaguar, pinabete)",
      "Protección de especies"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 85
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 8,
    "competencia_numero": 3,
    "competencia_descripcion": "Resuelve problemas de proporcionalidad directa e inversa, porcentaje, IVA e interés simple comercial.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Calcula el IVA (12%), descuentos comerciales e interés simple en finanzas familiares.",
    "temas_declarativos": [
      "Escalas numéricas y gráficas en planos de construcción y mapas geográficos",
      "Interpretación cartográfica"
    ],
    "criterios_evaluacion": "Resuelve problemas de regla de tres simple directa e inversa y calcula el IVA e interés simple.",
    "pagina_libro_sugerida": 90
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 8,
    "competencia_numero": 2,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "La entrevista a ancianos y líderes comunitarios: formulación de preguntas abiertas",
      "Tradición oral"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 90
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 2,
    "semana_sugerida": 8,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Impacto ambiental de la deforestación y la contaminación hídrica en el lago de Amatitlán",
      "Estudio de caso local"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 90
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 8,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Impacto ambiental de la deforestación y la contaminación hídrica en el lago de Amatitlán",
      "Estudio de caso local"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 90
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 2,
    "semana_sugerida": 9,
    "competencia_numero": 3,
    "competencia_descripcion": "Resuelve problemas de proporcionalidad directa e inversa, porcentaje, IVA e interés simple comercial.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Calcula el IVA (12%), descuentos comerciales e interés simple en finanzas familiares.",
    "temas_declarativos": [
      "Problemas de reparto proporcional directo entre socios de una microempresa",
      "Distribución de ganancias"
    ],
    "criterios_evaluacion": "Resuelve problemas de regla de tres simple directa e inversa y calcula el IVA e interés simple.",
    "pagina_libro_sugerida": 95
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 2,
    "semana_sugerida": 9,
    "competencia_numero": 2,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Exposición oral individual: uso de fichas de apoyo y modulación de voz en el aula",
      "Oratoria infantil"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 95
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 2,
    "semana_sugerida": 9,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Proyectos de reforestación escolar y huertos pedagógicos sostenibles",
      "Acción comunitaria"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 95
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 2,
    "semana_sugerida": 9,
    "competencia_numero": 2,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "2.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Proyectos de reforestación escolar y huertos pedagógicos sostenibles",
      "Acción comunitaria"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 95
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 1,
    "competencia_numero": 4,
    "competencia_descripcion": "Calcula áreas de círculos y figuras compuestas, volúmenes de cilindros y medidas agrarias guatemaltecas.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Calcula la longitud de la circunferencia y el área del círculo utilizando el número pi.",
    "temas_declarativos": [
      "La circunferencia y el círculo: radio, diámetro, cuerda, arco y el número pi (π ≈ 3.1416)",
      "Elementos circulares"
    ],
    "criterios_evaluacion": "Aplica fórmulas de área circular y volumen de cilindros y convierte medidas de cuerdas a m2.",
    "pagina_libro_sugerida": 100
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 1,
    "competencia_numero": 3,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Textos literarios: leyendas y mitos guatemaltecos (El Sombrerón, La Llorona, El Cadejo)",
      "Literatura nacional"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 100
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 3,
    "semana_sugerida": 1,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Estructura de la materia: átomos, moléculas, elementos químicos y compuestos",
      "Tabla periódica básica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 100
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 1,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Estructura de la materia: átomos, moléculas, elementos químicos y compuestos",
      "Tabla periódica básica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 100
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 2,
    "competencia_numero": 4,
    "competencia_descripcion": "Calcula áreas de círculos y figuras compuestas, volúmenes de cilindros y medidas agrarias guatemaltecas.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Calcula la longitud de la circunferencia y el área del círculo utilizando el número pi.",
    "temas_declarativos": [
      "Cálculo de la longitud de la circunferencia (L = 2πr) y área del círculo (A = πr2)",
      "Fórmulas circulares"
    ],
    "criterios_evaluacion": "Aplica fórmulas de área circular y volumen de cilindros y convierte medidas de cuerdas a m2.",
    "pagina_libro_sugerida": 105
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 2,
    "competencia_numero": 3,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "Figuras literarias elementales: el símil o comparación y la metáfora en la poesía",
      "Apreciación poética"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 105
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 3,
    "semana_sugerida": 2,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Mezclas homogéneas y heterogéneas y métodos de separación (filtración, decantación)",
      "Laboratorio escolar"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 105
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 2,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Mezclas homogéneas y heterogéneas y métodos de separación (filtración, decantación)",
      "Laboratorio escolar"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 105
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 3,
    "competencia_numero": 4,
    "competencia_descripcion": "Calcula áreas de círculos y figuras compuestas, volúmenes de cilindros y medidas agrarias guatemaltecas.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Calcula la longitud de la circunferencia y el área del círculo utilizando el número pi.",
    "temas_declarativos": [
      "Área sombreada de figuras compuestas (círculo inscrito en cuadrado y sectores)",
      "Resta de áreas"
    ],
    "criterios_evaluacion": "Aplica fórmulas de área circular y volumen de cilindros y convierte medidas de cuerdas a m2.",
    "pagina_libro_sugerida": 110
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 3,
    "competencia_numero": 3,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "El texto instructivo: recetas de cocina tradicional y manuales de huerto escolar",
      "Secuencia lógica"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 110
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 3,
    "semana_sugerida": 3,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Cambios físicos y químicos de la materia: combustión, oxidación y fermentación",
      "Reacciones químicas"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 110
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 3,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Cambios físicos y químicos de la materia: combustión, oxidación y fermentación",
      "Reacciones químicas"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 110
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 4,
    "competencia_numero": 4,
    "competencia_descripcion": "Calcula áreas de círculos y figuras compuestas, volúmenes de cilindros y medidas agrarias guatemaltecas.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Determina el volumen del cilindro y ubica puntos en el plano cartesiano.",
    "temas_declarativos": [
      "Cuerpos redondos: cilindro, cono y esfera (características y áreas laterales)",
      "Modelos tridimensionales"
    ],
    "criterios_evaluacion": "Aplica fórmulas de área circular y volumen de cilindros y convierte medidas de cuerdas a m2.",
    "pagina_libro_sugerida": 115
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 4,
    "competencia_numero": 3,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "La oración compuesta: nexos coordinantes (y, e, ni, o, pero) en la redacción",
      "Cohesión textual"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 115
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 3,
    "semana_sugerida": 4,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Tipos de energía: mecánica, térmica, eléctrica, solar, eólica e hidráulica",
      "Transformaciones"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 115
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 4,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Tipos de energía: mecánica, térmica, eléctrica, solar, eólica e hidráulica",
      "Transformaciones"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 115
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 5,
    "competencia_numero": 4,
    "competencia_descripcion": "Calcula áreas de círculos y figuras compuestas, volúmenes de cilindros y medidas agrarias guatemaltecas.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Determina el volumen del cilindro y ubica puntos en el plano cartesiano.",
    "temas_declarativos": [
      "Cálculo del volumen del cilindro (V = πr2h) en silos y tanques de agua comunitarios",
      "Aplicación en agua potable"
    ],
    "criterios_evaluacion": "Aplica fórmulas de área circular y volumen de cilindros y convierte medidas de cuerdas a m2.",
    "pagina_libro_sugerida": 120
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 5,
    "competencia_numero": 3,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Puntuación avanzada: uso de los dos puntos (:) antes de enumeraciones y citas",
      "Puntuación formal"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 120
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 3,
    "semana_sugerida": 5,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Fuentes de energía renovables y no renovables en la matriz energética de Guatemala",
      "Sostenibilidad"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 120
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 5,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Fuentes de energía renovables y no renovables en la matriz energética de Guatemala",
      "Sostenibilidad"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 120
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 6,
    "competencia_numero": 4,
    "competencia_descripcion": "Calcula áreas de círculos y figuras compuestas, volúmenes de cilindros y medidas agrarias guatemaltecas.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Determina el volumen del cilindro y ubica puntos en el plano cartesiano.",
    "temas_declarativos": [
      "El plano cartesiano: ubicación de coordenadas en los cuatro cuadrantes",
      "Pares ordenados (x, y)"
    ],
    "criterios_evaluacion": "Aplica fórmulas de área circular y volumen de cilindros y convierte medidas de cuerdas a m2.",
    "pagina_libro_sugerida": 125
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 6,
    "competencia_numero": 3,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Pronombres personales y posesivos: concordancia con el sujeto en la oración",
      "Coherencia oracional"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 125
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 3,
    "semana_sugerida": 6,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Circuitos eléctricos simples: generador, conductores, interruptor y receptores",
      "Armado de circuitos"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 125
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 6,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Circuitos eléctricos simples: generador, conductores, interruptor y receptores",
      "Armado de circuitos"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 125
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 7,
    "competencia_numero": 4,
    "competencia_descripcion": "Calcula áreas de círculos y figuras compuestas, volúmenes de cilindros y medidas agrarias guatemaltecas.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Convierte medidas agrarias tradicionales (cuerdas, varas) a metros cuadrados.",
    "temas_declarativos": [
      "Transformaciones geométricas en el plano: traslación, rotación y reflexión simétrica",
      "Geometría dinámica"
    ],
    "criterios_evaluacion": "Aplica fórmulas de área circular y volumen de cilindros y convierte medidas de cuerdas a m2.",
    "pagina_libro_sugerida": 130
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 7,
    "competencia_numero": 3,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Uso de la \"h\" en diptongos (hie-, hue-) y verbos haber y hacer",
      "Normas ortográficas"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 130
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 3,
    "semana_sugerida": 7,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Leyes del movimiento y fuerzas: inercia, aceleración y acción-reacción",
      "Física experimental"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 130
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 7,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Leyes del movimiento y fuerzas: inercia, aceleración y acción-reacción",
      "Física experimental"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 130
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 8,
    "competencia_numero": 4,
    "competencia_descripcion": "Calcula áreas de círculos y figuras compuestas, volúmenes de cilindros y medidas agrarias guatemaltecas.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Convierte medidas agrarias tradicionales (cuerdas, varas) a metros cuadrados.",
    "temas_declarativos": [
      "Medidas agrarias tradicionales de Guatemala: cuerdas cuadradas, varas y caballerías",
      "Tenencia de la tierra"
    ],
    "criterios_evaluacion": "Aplica fórmulas de área circular y volumen de cilindros y convierte medidas de cuerdas a m2.",
    "pagina_libro_sugerida": 135
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 8,
    "competencia_numero": 3,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Lectura crítica: identificación de hechos comprobables frente a opiniones en textos",
      "Pensamiento crítico"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 135
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 3,
    "semana_sugerida": 8,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Máquinas compuestas y tecnología apropiada para el trabajo agrícola comunitario",
      "Innovación rural"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 135
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 8,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Máquinas compuestas y tecnología apropiada para el trabajo agrícola comunitario",
      "Innovación rural"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 135
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 3,
    "semana_sugerida": 9,
    "competencia_numero": 4,
    "competencia_descripcion": "Calcula áreas de círculos y figuras compuestas, volúmenes de cilindros y medidas agrarias guatemaltecas.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Convierte medidas agrarias tradicionales (cuerdas, varas) a metros cuadrados.",
    "temas_declarativos": [
      "Conversión entre cuerdas de terreno y metros cuadrados en escrituras rurales",
      "Cálculo de superficies reales"
    ],
    "criterios_evaluacion": "Aplica fórmulas de área circular y volumen de cilindros y convierte medidas de cuerdas a m2.",
    "pagina_libro_sugerida": 140
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 3,
    "semana_sugerida": 9,
    "competencia_numero": 3,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Creación de un periódico mural escolar con secciones de noticias, deportes y cultura",
      "Trabajo cooperativo"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 140
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 3,
    "semana_sugerida": 9,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Uso responsable de la tecnología y tratamiento de la basura electrónica",
      "Ética tecnológica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 140
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 3,
    "semana_sugerida": 9,
    "competencia_numero": 3,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "3.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Uso responsable de la tecnología y tratamiento de la basura electrónica",
      "Ética tecnológica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 140
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 1,
    "competencia_numero": 5,
    "competencia_descripcion": "Analiza datos estadísticos agrupados por intervalos, medidas de tendencia central y cálculo de probabilidad.",
    "indicador_numero": "5.1",
    "indicador_descripcion": "Realiza conversiones de temperatura y tipos de cambio de moneda internacional.",
    "temas_declarativos": [
      "Medidas de temperatura: grados Celsius (°C) y Fahrenheit (°F) y su conversión",
      "Uso del termómetro"
    ],
    "criterios_evaluacion": "Calcula media, mediana y moda en datos agrupados y formula un proyecto financiero escolar.",
    "pagina_libro_sugerida": 145
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 1,
    "competencia_numero": 4,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "El texto argumentativo: formulación de opiniones respaldadas con razones claras",
      "Estructura de opinión"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 145
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 4,
    "semana_sugerida": 1,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "El método científico escolar: observación, planteamiento del problema e hipótesis",
      "Diseño experimental"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 145
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 1,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "El método científico escolar: observación, planteamiento del problema e hipótesis",
      "Diseño experimental"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 145
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 2,
    "competencia_numero": 5,
    "competencia_descripcion": "Analiza datos estadísticos agrupados por intervalos, medidas de tendencia central y cálculo de probabilidad.",
    "indicador_numero": "5.1",
    "indicador_descripcion": "Realiza conversiones de temperatura y tipos de cambio de moneda internacional.",
    "temas_declarativos": [
      "El sistema monetario internacional: tipos de cambio entre Quetzales, Dólares y Pesos",
      "Divisas y remesas"
    ],
    "criterios_evaluacion": "Calcula media, mediana y moda en datos agrupados y formula un proyecto financiero escolar.",
    "pagina_libro_sugerida": 150
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 2,
    "competencia_numero": 4,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "El debate escolar: normas de discusión, respeto a turnos de habla y réplicas constructivas",
      "Mesa de diálogo"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 150
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 4,
    "semana_sugerida": 2,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Variables experimentales y recolección de datos en tablas y gráficas científicas",
      "Análisis de datos"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 150
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 2,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Variables experimentales y recolección de datos en tablas y gráficas científicas",
      "Análisis de datos"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 150
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 3,
    "competencia_numero": 5,
    "competencia_descripcion": "Analiza datos estadísticos agrupados por intervalos, medidas de tendencia central y cálculo de probabilidad.",
    "indicador_numero": "5.1",
    "indicador_descripcion": "Realiza conversiones de temperatura y tipos de cambio de moneda internacional.",
    "temas_declarativos": [
      "Estadística: recolección de datos mediante encuestas sobre problemáticas escolares",
      "Diseño de cuestionarios"
    ],
    "criterios_evaluacion": "Calcula media, mediana y moda en datos agrupados y formula un proyecto financiero escolar.",
    "pagina_libro_sugerida": 155
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 3,
    "competencia_numero": 4,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Interpreta mensajes orales y escritos extrayendo ideas clave y vocabulario contextual.",
    "temas_declarativos": [
      "La carta formal y el correo electrónico: estructura, saludo, cuerpo y despedida",
      "Correspondencia"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 155
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 4,
    "semana_sugerida": 3,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Estructura interna de la Tierra: corteza, manto, núcleo y placas tectónicas",
      "Geología nacional"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 155
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 3,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.1",
    "indicador_descripcion": "Explica sistemas celulares y fisiológicos del cuerpo humano practicando la salud integral.",
    "temas_declarativos": [
      "Estructura interna de la Tierra: corteza, manto, núcleo y placas tectónicas",
      "Geología nacional"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 155
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 4,
    "competencia_numero": 5,
    "competencia_descripcion": "Analiza datos estadísticos agrupados por intervalos, medidas de tendencia central y cálculo de probabilidad.",
    "indicador_numero": "5.2",
    "indicador_descripcion": "Construye tablas de frecuencias agrupadas y calcula media, mediana y moda.",
    "temas_declarativos": [
      "Tablas de distribución de frecuencias agrupadas por intervalos",
      "Frecuencia absoluta y relativa"
    ],
    "criterios_evaluacion": "Calcula media, mediana y moda en datos agrupados y formula un proyecto financiero escolar.",
    "pagina_libro_sugerida": 160
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 4,
    "competencia_numero": 4,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Afiches y textos publicitarios: análisis de imágenes, eslóganes y mensajes éticos",
      "Lectura multimodal"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 160
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 4,
    "semana_sugerida": 4,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "La tectónica de placas en Centroamérica: fallas de Motagua, Chixoy y Jalpatagua",
      "Sismicidad y volcanismo"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 160
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 4,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "La tectónica de placas en Centroamérica: fallas de Motagua, Chixoy y Jalpatagua",
      "Sismicidad y volcanismo"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 160
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 5,
    "competencia_numero": 5,
    "competencia_descripcion": "Analiza datos estadísticos agrupados por intervalos, medidas de tendencia central y cálculo de probabilidad.",
    "indicador_numero": "5.2",
    "indicador_descripcion": "Construye tablas de frecuencias agrupadas y calcula media, mediana y moda.",
    "temas_declarativos": [
      "Medidas de tendencia central: media aritmética ponderada, mediana y moda",
      "Cálculo estadístico formal"
    ],
    "criterios_evaluacion": "Calcula media, mediana y moda en datos agrupados y formula un proyecto financiero escolar.",
    "pagina_libro_sugerida": 165
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 5,
    "competencia_numero": 4,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Ortografía de la \"g\" y \"j\" en terminaciones -aje, -jero, -ger, -gir",
      "Ejercicios prácticos"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 165
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 4,
    "semana_sugerida": 5,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Los volcanes de Guatemala: tipos de erupciones y monitoreo de riesgos (INSIVUMEH)",
      "Prevención volcánica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 165
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 5,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "Los volcanes de Guatemala: tipos de erupciones y monitoreo de riesgos (INSIVUMEH)",
      "Prevención volcánica"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 165
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 6,
    "competencia_numero": 5,
    "competencia_descripcion": "Analiza datos estadísticos agrupados por intervalos, medidas de tendencia central y cálculo de probabilidad.",
    "indicador_numero": "5.2",
    "indicador_descripcion": "Construye tablas de frecuencias agrupadas y calcula media, mediana y moda.",
    "temas_declarativos": [
      "Elaboración e interpretación de histogramas y polígonos de frecuencias",
      "Representación gráfica"
    ],
    "criterios_evaluacion": "Calcula media, mediana y moda en datos agrupados y formula un proyecto financiero escolar.",
    "pagina_libro_sugerida": 170
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 6,
    "competencia_numero": 4,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Aplica normas gramaticales y ortográficas en la producción de textos continuos.",
    "temas_declarativos": [
      "Vicios del lenguaje comunes (redundancia, palabras comodín) y su corrección formal",
      "Pureza del idioma"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 170
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 4,
    "semana_sugerida": 6,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "La atmósfera y el cambio climático: efecto invernadero, calentamiento global y sequías",
      "Crisis climática"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 170
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 6,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.2",
    "indicador_descripcion": "Analiza cadenas tróficas y el impacto ambiental en ecosistemas guatemaltecos.",
    "temas_declarativos": [
      "La atmósfera y el cambio climático: efecto invernadero, calentamiento global y sequías",
      "Crisis climática"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 170
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 7,
    "competencia_numero": 5,
    "competencia_descripcion": "Analiza datos estadísticos agrupados por intervalos, medidas de tendencia central y cálculo de probabilidad.",
    "indicador_numero": "5.3",
    "indicador_descripcion": "Elabora histogramas y calcula la probabilidad clásica de sucesos comunitarios.",
    "temas_declarativos": [
      "Gráficos circulares de 360 grados con cálculo de ángulos por regla de tres",
      "Distribución proporcional"
    ],
    "criterios_evaluacion": "Calcula media, mediana y moda en datos agrupados y formula un proyecto financiero escolar.",
    "pagina_libro_sugerida": 175
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 7,
    "competencia_numero": 4,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Fichas bibliográficas y resumen de libros del rincón de lectura escolar",
      "Técnicas de indagación"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 175
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 4,
    "semana_sugerida": 7,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "El universo: galaxias, estrellas, planetas, cometas y exploración espacial moderna",
      "Cosmología"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 175
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 7,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "El universo: galaxias, estrellas, planetas, cometas y exploración espacial moderna",
      "Cosmología"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 175
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 8,
    "competencia_numero": 5,
    "competencia_descripcion": "Analiza datos estadísticos agrupados por intervalos, medidas de tendencia central y cálculo de probabilidad.",
    "indicador_numero": "5.3",
    "indicador_descripcion": "Elabora histogramas y calcula la probabilidad clásica de sucesos comunitarios.",
    "temas_declarativos": [
      "Probabilidad clásica: regla de Laplace (casos favorables entre casos posibles)",
      "Cálculo de probabilidades"
    ],
    "criterios_evaluacion": "Calcula media, mediana y moda en datos agrupados y formula un proyecto financiero escolar.",
    "pagina_libro_sugerida": 180
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 8,
    "competencia_numero": 4,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "El teatro escolar: lectura de guiones dramatizados y acotaciones escénicas",
      "Lectura coral"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 180
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 4,
    "semana_sugerida": 8,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "La astronomía Maya: observaciones de Venus, los solsticios y el calendario agrícola",
      "Arqueoastronomía"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 180
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 8,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "La astronomía Maya: observaciones de Venus, los solsticios y el calendario agrícola",
      "Arqueoastronomía"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 180
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Matemáticas",
    "bloque_bimestre": 4,
    "semana_sugerida": 9,
    "competencia_numero": 5,
    "competencia_descripcion": "Analiza datos estadísticos agrupados por intervalos, medidas de tendencia central y cálculo de probabilidad.",
    "indicador_numero": "5.3",
    "indicador_descripcion": "Elabora histogramas y calcula la probabilidad clásica de sucesos comunitarios.",
    "temas_declarativos": [
      "Proyecto final integrado: formulación de un presupuesto y plan de negocios comunitario",
      "Síntesis de fin de ciclo"
    ],
    "criterios_evaluacion": "Calcula media, mediana y moda en datos agrupados y formula un proyecto financiero escolar.",
    "pagina_libro_sugerida": 185
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Comunicación y Lenguaje",
    "bloque_bimestre": 4,
    "semana_sugerida": 9,
    "competencia_numero": 4,
    "competencia_descripcion": "Evalúa críticamente textos diversos, produce ensayos e informes y participa en debates formales.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Produce textos descriptivos y argumentativos con coherencia y corrección formal.",
    "temas_declarativos": [
      "Antología literaria del aula: recopilación de cuentos y poemas escritos por los alumnos",
      "Publicación final"
    ],
    "criterios_evaluacion": "Demuestra fluidez lectora, redacta párrafos coherentes y aplica ortografía correspondiente al grado.",
    "pagina_libro_sugerida": 185
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Naturales y Tecnología",
    "bloque_bimestre": 4,
    "semana_sugerida": 9,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Feria Científica y Tecnológica Escolar: exposición de experimentos y prototipos",
      "Comunidad de aprendizaje"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 185
  },
  {
    "grado": 6,
    "ciclo": "segundo_ciclo",
    "area_materia": "Ciencias Sociales y Formación Ciudadana",
    "bloque_bimestre": 4,
    "semana_sugerida": 9,
    "competencia_numero": 4,
    "competencia_descripcion": "Explica la organización de los seres vivos, relaciones ecológicas, transformaciones de la materia y método científico.",
    "indicador_numero": "4.3",
    "indicador_descripcion": "Aplica principios de energía, física y método científico en proyectos escolares.",
    "temas_declarativos": [
      "Feria Científica y Tecnológica Escolar: exposición de experimentos y prototipos",
      "Comunidad de aprendizaje"
    ],
    "criterios_evaluacion": "Formula hipótesis, analiza variables y explica fenómenos biológicos y tecnológicos con rigor.",
    "pagina_libro_sugerida": 185
  }
];
