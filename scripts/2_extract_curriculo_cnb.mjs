import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve('data');

// Base Curricular Estructurada del Currículo Nacional Base (CNB) de Guatemala
// Para Educación Primaria (1.º a 6.º grado)
const curriculoOficialCNB = [
  // ==========================================
  // PRIMER GRADO (Primer Ciclo)
  // ==========================================
  {
    grado: 1,
    ciclo: 'primer_ciclo',
    area_materia: 'Matemáticas',
    bloque_bimestre: 1,
    semana_sugerida: 1,
    competencia_numero: 1,
    competencia_descripcion: 'Establece relaciones entre personas, objetos y figuras geométricas por su posición en el espacio y por la distancia entre ellos.',
    indicador_numero: '1.1',
    indicador_descripcion: 'Identifica la ubicación de objetos en el espacio: arriba-abajo, delante-atrás, cerca-lejos.',
    temas_declarativos: ['Nociones espaciales básicas', 'Ubicación en el aula y patio', 'Lateralidad elemental'],
    criterios_evaluacion: 'Ubica objetos en relación con su propio cuerpo.'
  },
  {
    grado: 1,
    ciclo: 'primer_ciclo',
    area_materia: 'Matemáticas',
    bloque_bimestre: 1,
    semana_sugerida: 2,
    competencia_numero: 2,
    competencia_descripcion: 'Expresa ideas y pensamientos con libertad y coherencia utilizando diferentes signos y algoritmos matemáticos.',
    indicador_numero: '2.1',
    indicador_descripcion: 'Cuenta objetos de su entorno del 1 al 10 en orden ascendente y descendente.',
    temas_declarativos: ['Conjuntos y elementos', 'Conteo del 1 al 10 con material concreto (semillas/frijoles)', 'Correspondencia uno a uno'],
    criterios_evaluacion: 'Asocia el numeral con la cantidad correspondiente.'
  },
  {
    grado: 1,
    ciclo: 'primer_ciclo',
    area_materia: 'Comunicación y Lenguaje',
    bloque_bimestre: 1,
    semana_sugerida: 1,
    competencia_numero: 1,
    competencia_descripcion: 'Escucha activamente instrucciones, relatos y conversaciones en su idioma materno.',
    indicador_numero: '1.1',
    indicador_descripcion: 'Demuestra comprensión de mensajes orales simples mediante respuestas no verbales y verbales.',
    temas_declarativos: ['La escucha atenta', 'Seguimiento de instrucciones orales en el aula', 'Saludos y normas de convivencia'],
    criterios_evaluacion: 'Ejecuta 2 o 3 instrucciones consecutivas dadas por el docente.'
  },
  {
    grado: 1,
    ciclo: 'primer_ciclo',
    area_materia: 'Medio Social y Natural',
    bloque_bimestre: 1,
    semana_sugerida: 1,
    competencia_numero: 1,
    competencia_descripcion: 'Describe las partes del cuerpo humano y practica normas básicas para el cuidado de su salud personal.',
    indicador_numero: '1.1',
    indicador_descripcion: 'Identifica las partes principales de su cuerpo: cabeza, tronco y extremidades.',
    temas_declarativos: ['El cuerpo humano y sus partes', 'Hábitos de higiene personal en la escuela rural', 'Lavado de manos con agua segura'],
    criterios_evaluacion: 'Señala y nombra las partes externas de su cuerpo.'
  },

  // ==========================================
  // SEGUNDO GRADO (Primer Ciclo)
  // ==========================================
  {
    grado: 2,
    ciclo: 'primer_ciclo',
    area_materia: 'Matemáticas',
    bloque_bimestre: 1,
    semana_sugerida: 1,
    competencia_numero: 1,
    competencia_descripcion: 'Aplica conocimientos y experiencias de aritmética básica en la interacción con su entorno familiar y comunitario.',
    indicador_numero: '1.1',
    indicador_descripcion: 'Lee y escribe números naturales hasta 100 en el sistema decimal.',
    temas_declarativos: ['Decenas y unidades', 'Lectura y escritura de números hasta 100', 'Valor posicional con ábaco o semillas'],
    criterios_evaluacion: 'Descompone números de dos dígitos en decenas y unidades.'
  },
  {
    grado: 2,
    ciclo: 'primer_ciclo',
    area_materia: 'Matemáticas',
    bloque_bimestre: 1,
    semana_sugerida: 2,
    competencia_numero: 2,
    competencia_descripcion: 'Efectúa sumas y restas con números naturales para resolver problemas cotidianos de su comunidad.',
    indicador_numero: '2.1',
    indicador_descripcion: 'Resuelve sumas sin llevar con totales hasta 99 utilizando objetos del entorno.',
    temas_declarativos: ['La adición sin reagrupación', 'Problemas de compra y venta en el mercado local', 'Cálculo mental simple'],
    criterios_evaluacion: 'Calcula sumas horizontales y verticales de 2 dígitos sin transformación.'
  },
  {
    grado: 2,
    ciclo: 'primer_ciclo',
    area_materia: 'Comunicación y Lenguaje',
    bloque_bimestre: 1,
    semana_sugerida: 1,
    competencia_numero: 2,
    competencia_descripcion: 'Lee con fluidez y entonación textos sencillos en voz alta y en silencio, identificando la idea central.',
    indicador_numero: '2.1',
    indicador_descripcion: 'Lee oraciones y párrafos cortos respondiendo a preguntas literales (¿Quién?, ¿Qué pasó?, ¿Dónde?).',
    temas_declarativos: ['Lectura guiada de cuentos cortos', 'Comprensión lectora literal', 'Pronunciación y fluidez'],
    criterios_evaluacion: 'Responde acertadamente 3 de 4 preguntas sobre la lectura leída.'
  },
  {
    grado: 2,
    ciclo: 'primer_ciclo',
    area_materia: 'Medio Social y Natural',
    bloque_bimestre: 1,
    semana_sugerida: 1,
    competencia_numero: 1,
    competencia_descripcion: 'Describe las características físicas y las funciones de los seres vivos de su comunidad.',
    indicador_numero: '1.1',
    indicador_descripcion: 'Clasifica los seres vivos de su entorno en animales y plantas según su hábitat y alimentación.',
    temas_declarativos: ['Animales domésticos y silvestres de la comunidad', 'Partes de la planta y su utilidad', 'Cuidado de los animales de granja'],
    criterios_evaluacion: 'Distingue las necesidades vitales de plantas y animales.'
  },

  // ==========================================
  // TERCER GRADO (Primer Ciclo)
  // ==========================================
  {
    grado: 3,
    ciclo: 'primer_ciclo',
    area_materia: 'Matemáticas',
    bloque_bimestre: 1,
    semana_sugerida: 1,
    competencia_numero: 1,
    competencia_descripcion: 'Utiliza el cálculo aritmético y el razonamiento lógico para resolver situaciones problemáticas de su contexto rural.',
    indicador_numero: '1.1',
    indicador_descripcion: 'Efectúa multiplicaciones de un dígito como suma abreviada con apoyo de tablas y material concreto.',
    temas_declarativos: ['Concepto de multiplicación como sumas repetidas', 'Tablas de multiplicar del 2, 3, 4 y 5', 'Arreglos rectangulares'],
    criterios_evaluacion: 'Aplica el algoritmo de la multiplicación en situaciones de reparto y conteo rápido.'
  },
  {
    grado: 3,
    ciclo: 'primer_ciclo',
    area_materia: 'Matemáticas',
    bloque_bimestre: 2,
    semana_sugerida: 12,
    competencia_numero: 1,
    competencia_descripcion: 'Identifica y representa fracciones comunes en situaciones de la vida cotidiana.',
    indicador_numero: '1.2',
    indicador_descripcion: 'Reconoce medios, cuartos y octavos en figuras geométricas y repartos reales.',
    temas_declarativos: ['Partes de una fracción (numerador y denominador)', 'Fracciones equivalentes básicas', 'Reparto equitativo de frutas y cosechas'],
    criterios_evaluacion: 'Sombrea y escribe la fracción correspondiente a figuras divididas en partes iguales.'
  },
  {
    grado: 3,
    ciclo: 'primer_ciclo',
    area_materia: 'Comunicación y Lenguaje',
    bloque_bimestre: 1,
    semana_sugerida: 1,
    competencia_numero: 3,
    competencia_descripcion: 'Redacta textos informativos y narrativos breves utilizando oraciones completas y signos de puntuación.',
    indicador_numero: '3.1',
    indicador_descripcion: 'Escribe párrafos cortos aplicando el uso de mayúsculas al inicio y punto al final de cada oración.',
    temas_declarativos: ['Estructura de la oración (Sujeto y Predicado simple)', 'Uso de mayúsculas y punto', 'Redacción de anécdotas personales'],
    criterios_evaluacion: 'Produce un texto coherente de al menos 4 oraciones bien estructuradas.'
  },
  {
    grado: 3,
    ciclo: 'primer_ciclo',
    area_materia: 'Medio Social y Natural',
    bloque_bimestre: 1,
    semana_sugerida: 1,
    competencia_numero: 2,
    competencia_descripcion: 'Explica los recursos naturales de su comunidad y propone acciones para su conservación.',
    indicador_numero: '2.1',
    indicador_descripcion: 'Identifica los recursos naturales renovables y no renovables de su entorno rural.',
    temas_declarativos: ['El agua, el suelo y los bosques en la aldea', 'Fuentes de agua y su protección contra la contaminación', 'La deforestación y la siembra de árboles'],
    criterios_evaluacion: 'Propone 2 prácticas familiares para ahorrar y proteger el agua.'
  },

  // ==========================================
  // CUARTO GRADO (Segundo Ciclo)
  // ==========================================
  {
    grado: 4,
    ciclo: 'segundo_ciclo',
    area_materia: 'Matemáticas',
    bloque_bimestre: 1,
    semana_sugerida: 1,
    competencia_numero: 1,
    competencia_descripcion: 'Aplica el valor posicional de los números en el sistema decimal hasta centenas de millar en operaciones aritméticas.',
    indicador_numero: '1.1',
    indicador_descripcion: 'Lee, escribe y descompone números de hasta seis cifras.',
    temas_declarativos: ['Centenas de millar', 'Descomposición aditiva y multiplicativa', 'Lectura de cifras grandes en presupuestos agrícolas'],
    criterios_evaluacion: 'Ordena de mayor a menor conjuntos de números de hasta 6 cifras.'
  },
  {
    grado: 4,
    ciclo: 'segundo_ciclo',
    area_materia: 'Ciencias Naturales y Tecnología',
    bloque_bimestre: 1,
    semana_sugerida: 1,
    competencia_numero: 1,
    competencia_descripcion: 'Explica la estructura y función de los sistemas del cuerpo humano y su relación con la salud integral.',
    indicador_numero: '1.1',
    indicador_descripcion: 'Describe los órganos y el funcionamiento del sistema digestivo y respiratorio.',
    temas_declarativos: ['El sistema digestivo: órganos y recorrido de los alimentos', 'La digestión y la nutrición en la edad escolar', 'Higiene de los alimentos'],
    criterios_evaluacion: 'Explica el trayecto de los alimentos desde la boca hasta su absorción.'
  },
  {
    grado: 4,
    ciclo: 'segundo_ciclo',
    area_materia: 'Ciencias Sociales y Formación Ciudadana',
    bloque_bimestre: 1,
    semana_sugerida: 1,
    competencia_numero: 1,
    competencia_descripcion: 'Describe la geografía física de Guatemala y su influencia en las actividades productivas de la población.',
    indicador_numero: '1.1',
    indicador_descripcion: 'Ubica en el mapa de Guatemala las principales regiones geográficas, volcanes y ríos.',
    temas_declarativos: ['Regiones naturales de Guatemala', 'Relieve: cordilleras y volcanes', 'Principales ríos y lagos de su departamento'],
    criterios_evaluacion: 'Localiza en un mapa mudo las tres regiones geográficas principales.'
  },
  {
    grado: 4,
    ciclo: 'segundo_ciclo',
    area_materia: 'Comunicación y Lenguaje',
    bloque_bimestre: 1,
    semana_sugerida: 1,
    competencia_numero: 2,
    competencia_descripcion: 'Aplica estrategias cognitivas de comprensión lectora para inferir mensajes y conclusiones en diversos tipos de texto.',
    indicador_numero: '2.1',
    indicador_descripcion: 'Identifica la idea principal y las ideas secundarias en textos informativos y literarios.',
    temas_declarativos: ['Diferenciación entre idea principal y secundaria', 'Resumen de párrafos', 'Técnicas de subrayado eficaz'],
    criterios_evaluacion: 'Subraya correctamente la idea principal de un texto expositivo de tres párrafos.'
  },

  // ==========================================
  // QUINTO GRADO (Segundo Ciclo)
  // ==========================================
  {
    grado: 5,
    ciclo: 'segundo_ciclo',
    area_materia: 'Matemáticas',
    bloque_bimestre: 1,
    semana_sugerida: 1,
    competencia_numero: 1,
    competencia_descripcion: 'Resuelve problemas que involucran operaciones con números naturales, fracciones y decimales.',
    indicador_numero: '1.1',
    indicador_descripcion: 'Suma y resta fracciones con diferente denominador utilizando el mínimo común múltiplo (mcm).',
    temas_declarativos: ['Fracciones heterogéneas', 'Cálculo del MCM para denominadores comunes', 'Suma y resta de fracciones en problemas de medidas'],
    criterios_evaluacion: 'Simplifica los resultados a su mínima expresión fraccionaria.'
  },
  {
    grado: 5,
    ciclo: 'segundo_ciclo',
    area_materia: 'Ciencias Naturales y Tecnología',
    bloque_bimestre: 1,
    semana_sugerida: 1,
    competencia_numero: 2,
    competencia_descripcion: 'Analiza las relaciones ecológicas entre los componentes bióticos y abióticos de los ecosistemas.',
    indicador_numero: '2.1',
    indicador_descripcion: 'Explica las cadenas y redes tróficas y el flujo de energía entre productores, consumidores y descomponedores.',
    temas_declarativos: ['Ecosistemas terrestres y acuáticos', 'Cadenas alimenticias en el bosque y la milpa', 'Impacto humano en el equilibrio ecológico'],
    criterios_evaluacion: 'Construye un diagrama de red alimentaria con 5 organismos de su comunidad.'
  },
  {
    grado: 5,
    ciclo: 'segundo_ciclo',
    area_materia: 'Ciencias Sociales y Formación Ciudadana',
    bloque_bimestre: 1,
    semana_sugerida: 1,
    competencia_numero: 2,
    competencia_descripcion: 'Explica los procesos históricos de Centroamérica y su impacto en la sociedad guatemalteca contemporánea.',
    indicador_numero: '2.1',
    indicador_descripcion: 'Describe los rasgos principales de la civilización maya en su período Clásico y Posclásico.',
    temas_declarativos: ['La civilización maya: ciencia, astronomía y agricultura', 'Sitios arqueológicos de Guatemala', 'Aportes culturales mayas vigentes en la actualidad'],
    criterios_evaluacion: 'Identifica 3 avances científicos del sistema de numeración y calendario maya.'
  },

  // ==========================================
  // SEXTO GRADO (Segundo Ciclo)
  // ==========================================
  {
    grado: 6,
    ciclo: 'segundo_ciclo',
    area_materia: 'Matemáticas',
    bloque_bimestre: 1,
    semana_sugerida: 1,
    competencia_numero: 1,
    competencia_descripcion: 'Aplica conceptos de proporciones, porcentajes y geometría para resolver problemas de la vida económica comunitaria.',
    indicador_numero: '1.1',
    indicador_descripcion: 'Calcula razones, proporciones y porcentajes (regla de tres simple) en situaciones comerciales.',
    temas_declarativos: ['Regla de tres simple directa', 'Cálculo del tanto por ciento (%) en compras, ventas y descuentos', 'Interés simple elemental'],
    criterios_evaluacion: 'Calcula correctamente el valor final de un producto con el 12% de IVA o descuento.'
  },
  {
    grado: 6,
    ciclo: 'segundo_ciclo',
    area_materia: 'Ciencias Naturales y Tecnología',
    bloque_bimestre: 1,
    semana_sugerida: 1,
    competencia_numero: 1,
    competencia_descripcion: 'Aplica el método científico en la investigación de fenómenos naturales y proyectos de tecnología escolar.',
    indicador_numero: '1.1',
    indicador_descripcion: 'Diseña y ejecuta experimentos sencillos registrando observaciones, hipótesis y conclusiones en un informe.',
    temas_declarativos: ['Pasos del método científico', 'Planteamiento de hipótesis y variables', 'Elaboración de tablas y gráficas de resultados'],
    criterios_evaluacion: 'Presenta un informe escrito con hipótesis, procedimiento y conclusión fundamentada.'
  },
  {
    grado: 6,
    ciclo: 'segundo_ciclo',
    area_materia: 'Ciencias Sociales y Formación Ciudadana',
    bloque_bimestre: 1,
    semana_sugerida: 1,
    competencia_numero: 3,
    competencia_descripcion: 'Participa en la promoción de los Derechos Humanos, la democracia y la resolución pacífica de conflictos en la escuela y la comunidad.',
    indicador_numero: '3.1',
    indicador_descripcion: 'Identifica las instituciones que velan por el cumplimiento de los Derechos de la Niñez y la Constitución en Guatemala.',
    temas_declarativos: ['La Constitución Política de la República de Guatemala', 'Derechos y deberes de los niños y adolescentes', 'Mecanismos de diálogo y mediación de conflictos en el aula'],
    criterios_evaluacion: 'Propone una solución dialogada a un dilema de convivencia escolar.'
  }
];

function main() {
  console.log('🚀 Procesando Malla Curricular Oficial del CNB...');
  const outputPath = path.join(DATA_DIR, 'cnb_processed.json');
  fs.writeFileSync(outputPath, JSON.stringify(curriculoOficialCNB, null, 2), 'utf8');
  console.log(`✅ ${curriculoOficialCNB.length} competencias e indicadores procesados y guardados en ${outputPath}`);
}

main();
