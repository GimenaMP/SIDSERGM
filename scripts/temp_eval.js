/**
 * Catálogo Fáctico de Índices Oficiales de Libros de Texto MINEDUC
 * y Ponderación Curricular del CNB de Guatemala (Módulos 1, 2 y 3: RF-01 al RF-09)
 */









// ============================================================================
// RF-02 & RF-03: PONDERACIÓN OFICIAL Y RESERVA DE ASIGNATURAS SIN LIBRO (CNB)
// ============================================================================
const ASIGNATURAS_COMPLEMENTARIAS: Record<'primer_ciclo' | 'segundo_ciclo', AsignaturaComplementariaCNB[]> = {
  primer_ciclo: [
    {
      nombre: 'Expresión Artística',
      periodosSemanales: 2,
      horasSemanales: 1.5,
      enfoqueSugerido: 'Educación musical, artes plásticas y expresión corporal.',
      notaPedagogica: 'Reserva horaria para actividades lúdicas y creativas integradas.'
    },
    {
      nombre: 'Educación Física',
      periodosSemanales: 2,
      horasSemanales: 1.5,
      enfoqueSugerido: 'Desarrollo psicomotriz, esquema corporal y salud.',
      notaPedagogica: 'Dos sesiones semanales al aire libre.'
    },
    {
      nombre: 'Formación Ciudadana',
      periodosSemanales: 2,
      horasSemanales: 1.5,
      enfoqueSugerido: 'Cultura de paz y resolución de conflictos.',
      notaPedagogica: 'Transversal en asambleas del Gobierno Escolar.'
    }
  ],
  segundo_ciclo: [
    {
      nombre: 'Expresión Artística',
      periodosSemanales: 2,
      horasSemanales: 1.5,
      enfoqueSugerido: 'Artes visuales, teatro escolar y patrimonio cultural.',
      notaPedagogica: 'Talleres creativos integrados al tema generador.'
    },
    {
      nombre: 'Educación Física',
      periodosSemanales: 2,
      horasSemanales: 1.5,
      enfoqueSugerido: 'Acondicionamiento físico, atletismo y juegos predeportivos.',
      notaPedagogica: 'Práctica guiada en cancha escolar con juego limpio.'
    },
    {
      nombre: 'Productividad y Desarrollo',
      periodosSemanales: 3,
      horasSemanales: 2.25,
      enfoqueSugerido: 'Huerto escolar, emprendimiento comunitario y finanzas.',
      notaPedagogica: 'Proyectos productivos articulados con la comunidad.'
    },
    {
      nombre: 'Formación Ciudadana',
      periodosSemanales: 2,
      horasSemanales: 1.5,
      enfoqueSugerido: 'Democracia, derechos humanos y memoria histórica.',
      notaPedagogica: 'Debates y análisis cívico en plenaria.'
    }
  ]
};

// ============================================================================
// RF-01 & RF-04: CATALOGO OFICIAL DE ÍNDICES DE LIBROS MINEDUC (1.° A 6.°)
// ============================================================================
const CATALOGO_MATERIAS_GRADO = {
  // --------------------------------------------------------------------------
  // 1.er Grado de Primaria (Ciclo I)
  // --------------------------------------------------------------------------
  1: [
    {
      id: 'matematicas_1',
      nombre: 'Matemáticas',
      libroTitulo: 'Matemáticas 1.er Grado (MINEDUC)',
      prioridad: 'Alta prioridad (Áreas Fundamentales)',
      horasSemanales: 5,
      periodosSemanales: 5,
      pesoPorcentaje: 35,
      unidades: [
        {
          unidad: 1,
          titulo: 'Me ubico y Números hasta 10',
          paginaInicio: 6,
          paginaFin: 50,
          competencias: [
            'Establece relaciones entre personas, objetos y figuras geométricas por su posición en el espacio.',
            'Expresa ideas referidas a patrones y relaciones matemáticas en su entorno familiar.',
            'Utiliza conocimientos de aritmética en la interacción con su entorno familiar.'
          ],
          indicadoresLogro: [
            'Ubica objetos en el espacio (arriba, abajo, cerca, lejos).',
            'Traza líneas y dibuja patrones.',
            'Identifica, cuenta, ordena y compara números hasta 10.'
          ],
          temas: [
            { numero: 1, titulo: 'Me ubico', paginaInicio: 6, paginaFin: 17 },
            { numero: 2, titulo: 'Números hasta 10', paginaInicio: 18, paginaFin: 50 }
          ]
        },
        {
          unidad: 2,
          titulo: 'Suma hasta 10, Resta hasta 10 y Números hasta 20',
          paginaInicio: 52,
          paginaFin: 95,
          competencias: ['Aplica operaciones aritméticas de suma y resta con números menores a 20.'],
          indicadoresLogro: ['Calcula sumas y restas con totales hasta 10.', 'Lee y escribe números hasta 20.'],
          temas: [
            { numero: 1, titulo: 'Suma hasta 10', paginaInicio: 52, paginaFin: 61 },
            { numero: 2, titulo: 'Resta con números hasta 10', paginaInicio: 62, paginaFin: 73 },
            { numero: 3, titulo: 'Gráfica', paginaInicio: 74, paginaFin: 76 },
            { numero: 4, titulo: 'Suma y resta con tres números', paginaInicio: 77, paginaFin: 83 },
            { numero: 5, titulo: 'Números hasta 20', paginaInicio: 84, paginaFin: 95 }
          ]
        },
        {
          unidad: 3,
          titulo: 'Suma y Resta hasta 20 y Conteo hasta 100',
          paginaInicio: 97,
          paginaFin: 140,
          competencias: ['Aplica el valor posicional en el conteo hasta 100 y longitud básica.'],
          indicadoresLogro: ['Resuelve sumas y restas con reagrupación hasta 20.', 'Cuenta hasta 100 de 10 en 10.'],
          temas: [
            { numero: 1, titulo: 'Suma hasta 20', paginaInicio: 97, paginaFin: 108 },
            { numero: 2, titulo: 'Resta hasta 20', paginaInicio: 109, paginaFin: 120 },
            { numero: 3, titulo: 'Conteo hasta 100', paginaInicio: 121, paginaFin: 133 },
            { numero: 4, titulo: 'Longitud', paginaInicio: 134, paginaFin: 140 }
          ]
        },
        {
          unidad: 4,
          titulo: 'Suma y resta con dos dígitos, Figuras y Monedas',
          paginaInicio: 143,
          paginaFin: 183,
          competencias: ['Reconoce figuras geométricas, monedas nacionales y medidas tradicionales.'],
          indicadoresLogro: ['Suma y resta números de dos dígitos.', 'Identifica figuras y monedas de Guatemala.'],
          temas: [
            { numero: 1, titulo: 'Suma y resta con dos dígitos', paginaInicio: 143, paginaFin: 158 },
            { numero: 2, titulo: 'Figuras', paginaInicio: 159, paginaFin: 166 },
            { numero: 3, titulo: 'Monedas y números mayas', paginaInicio: 167, paginaFin: 174 },
            { numero: 4, titulo: 'Tiempo y predicción', paginaInicio: 175, paginaFin: 178 },
            { numero: 5, titulo: 'Capacidad y peso', paginaInicio: 179, paginaFin: 183 }
          ]
        }
      ]
    },
    {
      id: 'comunicacion_1',
      nombre: 'Comunicación y Lenguaje',
      libroTitulo: 'Leo y Escribo Paso 2 (MINEDUC)',
      prioridad: 'Alta prioridad (Áreas Fundamentales)',
      horasSemanales: 4,
      periodosSemanales: 6,
      pesoPorcentaje: 35,
      unidades: [
        {
          unidad: 1,
          titulo: 'Vocales y Consonantes Iniciales (m, l, s, y, r, p, t, n)',
          paginaInicio: 5,
          paginaFin: 56,
          competencias: [
            'Escucha y reproduce sonidos fonéticos del idioma materno en interacciones cotidianas.',
            'Asocia grafemas con sus correspondientes fonemas en la lectura inicial.'
          ],
          indicadoresLogro: [
            'Identifica el sonido y trazo de vocales y consonantes m, l, s, r, p, t, n.',
            'Lee y escribe palabras bisílabas directas con fluidez.'
          ],
          temas: [
            { numero: 1, titulo: 'Repasemos las vocales', paginaInicio: 5, paginaFin: 6 },
            { numero: 2, titulo: 'Letra m', paginaInicio: 7, paginaFin: 12 },
            { numero: 3, titulo: 'Letra l', paginaInicio: 13, paginaFin: 18 },
            { numero: 4, titulo: 'Letra s', paginaInicio: 19, paginaFin: 24 },
            { numero: 5, titulo: 'Letra y (conjunción) y Letra r', paginaInicio: 25, paginaFin: 36 },
            { numero: 6, titulo: 'Letras p, t y n', paginaInicio: 37, paginaFin: 54 },
            { numero: 7, titulo: 'Palabras para leer y practicar', paginaInicio: 55, paginaFin: 56 }
          ]
        },
        {
          unidad: 2,
          titulo: 'Consonantes Medias y Sílabas Inversas (c, q, d, pl, pr)',
          paginaInicio: 57,
          paginaFin: 96,
          competencias: ['Decodifica palabras con combinaciones consonánticas y sílabas inversas.'],
          indicadoresLogro: ['Lee y escribe palabras con c, q, d y sílabas inversas _l, _s, _n.', 'Aplica combinaciones pl y pr.'],
          temas: [
            { numero: 1, titulo: '¡Juguemos con las palabras! y Letra c', paginaInicio: 57, paginaFin: 64 },
            { numero: 2, titulo: 'Letras q y d', paginaInicio: 65, paginaFin: 78 },
            { numero: 3, titulo: 'Sílabas inversas _l, _s, _n', paginaInicio: 79, paginaFin: 84 },
            { numero: 4, titulo: 'Combinaciones pl y pr', paginaInicio: 85, paginaFin: 92 },
            { numero: 5, titulo: 'Palabras para leer y practicar', paginaInicio: 93, paginaFin: 96 }
          ]
        },
        {
          unidad: 3,
          titulo: 'Consonantes y Combinaciones (b, j, tr, bl, br, ch)',
          paginaInicio: 97,
          paginaFin: 130,
          competencias: ['Lee oraciones completas con dígrafo ch y combinaciones complejas.'],
          indicadoresLogro: ['Distingue grafemas b, j, dígrafo ch y combinaciones tr, bl, br.'],
          temas: [
            { numero: 1, titulo: 'Letras b y j', paginaInicio: 97, paginaFin: 108 },
            { numero: 2, titulo: 'Combinaciones tr, bl y br', paginaInicio: 109, paginaFin: 120 },
            { numero: 3, titulo: 'Dígrafo ch', paginaInicio: 121, paginaFin: 126 },
            { numero: 4, titulo: 'Palabras para leer y ¡Dominó de palabras!', paginaInicio: 127, paginaFin: 130 }
          ]
        },
        {
          unidad: 4,
          titulo: 'Combinaciones Avanzadas y Lectura Fluida (cl, cr, f, v, rr, ñ)',
          paginaInicio: 131,
          paginaFin: 170,
          competencias: ['Lee textos breves con comprensión literal e inferencial.'],
          indicadoresLogro: ['Decodifica palabras con cl, cr, f, v, dígrafo rr y ñ.', 'Ejercita la memoria y redacta oraciones.'],
          temas: [
            { numero: 1, titulo: 'Combinaciones cl y cr', paginaInicio: 131, paginaFin: 138 },
            { numero: 2, titulo: 'Letras f y v', paginaInicio: 139, paginaFin: 152 },
            { numero: 3, titulo: 'Dígrafo rr y Letra ñ', paginaInicio: 153, paginaFin: 166 },
            { numero: 4, titulo: 'Palabras para leer y ¡Ejercita la memoria!', paginaInicio: 167, paginaFin: 170 }
          ]
        }
      ]
    },
    {
      id: 'medio_social_1',
      nombre: 'Medio Social y Natural',
      libroTitulo: 'Medio Social y Natural 1.er Grado (MINEDUC)',
      prioridad: 'Prioridad Intermedia (Áreas Integradoras)',
      horasSemanales: 4,
      periodosSemanales: 4,
      pesoPorcentaje: 20,
      unidades: [
        {
          unidad: 1,
          titulo: 'Mi Cuerpo, Higiene y Salud',
          paginaInicio: 8,
          paginaFin: 42,
          competencias: ['Describe partes del cuerpo humano y practica normas de higiene.'],
          indicadoresLogro: ['Señala órganos externos y sentidos.', 'Aplica hábitos de aseo personal.'],
          temas: [
            { numero: 1, titulo: 'Partes del cuerpo humano y sentidos', paginaInicio: 8, paginaFin: 24 },
            { numero: 2, titulo: 'Alimentación saludable y vacunas', paginaInicio: 25, paginaFin: 42 }
          ]
        },
        {
          unidad: 2,
          titulo: 'Mi Familia, Hogar y Comunidad',
          paginaInicio: 44,
          paginaFin: 80,
          competencias: ['Reconoce el rol de la familia y de los servidores de la comunidad.'],
          indicadoresLogro: ['Describe miembros familiares y oficios locales.'],
          temas: [
            { numero: 1, titulo: 'La familia y sus valores', paginaInicio: 44, paginaFin: 60 },
            { numero: 2, titulo: 'Servicios comunitarios y vías de transporte', paginaInicio: 61, paginaFin: 80 }
          ]
        },
        {
          unidad: 3,
          titulo: 'Los Seres Vivos: Plantas y Animales',
          paginaInicio: 82,
          paginaFin: 120,
          competencias: ['Clasifica seres vivos de su comunidad y sus beneficios.'],
          indicadoresLogro: ['Diferencia plantas útiles y animales domésticos/silvestres.'],
          temas: [
            { numero: 1, titulo: 'Partes de la planta y germinación', paginaInicio: 82, paginaFin: 100 },
            { numero: 2, titulo: 'Cuidado y protección de los animales', paginaInicio: 101, paginaFin: 120 }
          ]
        },
        {
          unidad: 4,
          titulo: 'Nuestro Entorno y el Planeta Tierra',
          paginaInicio: 122,
          paginaFin: 160,
          competencias: ['Promueve el cuidado del agua, suelo y medio ambiente.'],
          indicadoresLogro: ['Aplica acciones para cuidar los recursos naturales.'],
          temas: [
            { numero: 1, titulo: 'El día y la noche, sol y agua', paginaInicio: 122, paginaFin: 140 },
            { numero: 2, titulo: 'Reciclaje y prevención de desastres', paginaInicio: 141, paginaFin: 160 }
          ]
        }
      ]
    }
  ],

  // --------------------------------------------------------------------------
  // 2.do Grado de Primaria (Ciclo I)
  // --------------------------------------------------------------------------
  2: [
    {
      id: 'matematicas_2',
      nombre: 'Matemáticas',
      libroTitulo: 'Matemáticas 2.° Grado (MINEDUC)',
      prioridad: 'Alta prioridad (Áreas Fundamentales)',
      horasSemanales: 5,
      periodosSemanales: 5,
      pesoPorcentaje: 35,
      unidades: [
        {
          unidad: 1,
          titulo: 'Números hasta 100 y Suma sin Reagrupación',
          paginaInicio: 6,
          paginaFin: 48,
          competencias: ['Reconoce el valor posicional de números hasta 100 y realiza sumas simples.'],
          indicadoresLogro: ['Lee y escribe números hasta 100.', 'Calcula sumas horizontales y verticales.'],
          temas: [
            { numero: 1, titulo: 'Centenas y decenas hasta 100', paginaInicio: 6, paginaFin: 26 },
            { numero: 2, titulo: 'Suma de dos dígitos sin llevar', paginaInicio: 27, paginaFin: 48 }
          ]
        },
        {
          unidad: 2,
          titulo: 'Suma y Resta con Reagrupación hasta 100',
          paginaInicio: 50,
          paginaFin: 92,
          competencias: ['Aplica el algoritmo de suma y resta con reagrupación en situaciones reales.'],
          indicadoresLogro: ['Resuelve problemas de suma llevando y resta prestando.'],
          temas: [
            { numero: 1, titulo: 'Suma con reagrupación de decenas', paginaInicio: 50, paginaFin: 70 },
            { numero: 2, titulo: 'Resta desagrupando decenas', paginaInicio: 71, paginaFin: 92 }
          ]
        },
        {
          unidad: 3,
          titulo: 'Números hasta 1,000 e Introducción a la Multiplicación',
          paginaInicio: 94,
          paginaFin: 138,
          competencias: ['Comprende el concepto de multiplicación como suma repetida.'],
          indicadoresLogro: ['Construye las tablas del 2, 5 y 10.', 'Cuenta hasta 1,000.'],
          temas: [
            { numero: 1, titulo: 'Lectura y escritura de números hasta 1,000', paginaInicio: 94, paginaFin: 114 },
            { numero: 2, titulo: 'Multiplicación con arreglos rectangulares', paginaInicio: 115, paginaFin: 138 }
          ]
        },
        {
          unidad: 4,
          titulo: 'Geometría, Medidas Tradicionales y Monedas',
          paginaInicio: 140,
          paginaFin: 182,
          competencias: ['Utiliza unidades de medida no estándar y dinero nacional en transacciones.'],
          indicadoresLogro: ['Calcula vueltos con monedas y billetes.', 'Mide con brazada y cuarta.'],
          temas: [
            { numero: 1, titulo: 'Figuras planas y cuerpos geométricos', paginaInicio: 140, paginaFin: 160 },
            { numero: 2, titulo: 'Monedas de Guatemala y el Quetzal', paginaInicio: 161, paginaFin: 182 }
          ]
        }
      ]
    },
    {
      id: 'comunicacion_2',
      nombre: 'Comunicación y Lenguaje',
      libroTitulo: 'Comunicación y Lenguaje 2.° Grado (MINEDUC)',
      prioridad: 'Alta prioridad (Áreas Fundamentales)',
      horasSemanales: 4,
      periodosSemanales: 6,
      pesoPorcentaje: 35,
      unidades: [
        {
          unidad: 1,
          titulo: 'Lectura Fluida, Fábulas y el Abecedario',
          paginaInicio: 8,
          paginaFin: 46,
          competencias: ['Lee con entonación adecuada y orden alfabético.'],
          indicadoresLogro: ['Ordena palabras alfabéticamente.', 'Comprende la moraleja en fábulas.'],
          temas: [
            { numero: 1, titulo: 'El abecedario y uso del diccionario escolar', paginaInicio: 8, paginaFin: 26 },
            { numero: 2, titulo: 'La fábula y personajes animales', paginaInicio: 27, paginaFin: 46 }
          ]
        },
        {
          unidad: 2,
          titulo: 'Sustantivos, Adjetivos y Artículos',
          paginaInicio: 48,
          paginaFin: 90,
          competencias: ['Aplica la concordancia de género y número en oraciones.'],
          indicadoresLogro: ['Clasifica sustantivos propios y comunes.', 'Identifica adjetivos calificativos.'],
          temas: [
            { numero: 1, titulo: 'Sustantivos propios y comunes', paginaInicio: 48, paginaFin: 68 },
            { numero: 2, titulo: 'Adjetivos y concordancia con el artículo', paginaInicio: 69, paginaFin: 90 }
          ]
        },
        {
          unidad: 3,
          titulo: 'Signos de Puntuación y Oraciones',
          paginaInicio: 92,
          paginaFin: 134,
          competencias: ['Utiliza punto y signos de interrogación y exclamación.'],
          indicadoresLogro: ['Redacta oraciones afirmativas, negativas e interrogativas.'],
          temas: [
            { numero: 1, titulo: 'El punto y la mayúscula inicial', paginaInicio: 92, paginaFin: 112 },
            { numero: 2, titulo: 'Signos de interrogación y admiración', paginaInicio: 113, paginaFin: 134 }
          ]
        },
        {
          unidad: 4,
          titulo: 'Producción de Cartas, Recados y Rimas',
          paginaInicio: 136,
          paginaFin: 178,
          competencias: ['Redacta textos funcionales sencillos para comunicarse con su familia.'],
          indicadoresLogro: ['Escribe cartas familiares y rimas infantiles.'],
          temas: [
            { numero: 1, titulo: 'Estructura de la carta y el recado', paginaInicio: 136, paginaFin: 156 },
            { numero: 2, titulo: 'Rimas y trabalenguas tradicionales', paginaInicio: 157, paginaFin: 178 }
          ]
        }
      ]
    },
    {
      id: 'medio_social_2',
      nombre: 'Medio Social y Natural',
      libroTitulo: 'Medio Social y Natural 2.° Grado (MINEDUC)',
      prioridad: 'Prioridad Intermedia (Áreas Integradoras)',
      horasSemanales: 4,
      periodosSemanales: 4,
      pesoPorcentaje: 20,
      unidades: [
        {
          unidad: 1,
          titulo: 'Sentidos, Cuerpo Humano y Nutrición',
          paginaInicio: 8,
          paginaFin: 44,
          competencias: ['Practica hábitos que favorecen el buen funcionamiento de los órganos.'],
          indicadoresLogro: ['Describe la función de los sentidos y del sistema óseo.'],
          temas: [
            { numero: 1, titulo: 'Huesos, músculos y articulaciones', paginaInicio: 8, paginaFin: 26 },
            { numero: 2, titulo: 'La olla familiar y grupos de alimentos', paginaInicio: 27, paginaFin: 44 }
          ]
        },
        {
          unidad: 2,
          titulo: 'Comunidad, Paisaje y Trabajo Comunitario',
          paginaInicio: 46,
          paginaFin: 86,
          competencias: ['Valora las manifestaciones culturales y oficios de su municipio.'],
          indicadoresLogro: ['Diferencia paisaje urbano y rural.', 'Describe fiestas y tradiciones locales.'],
          temas: [
            { numero: 1, titulo: 'El municipio y sus autoridades', paginaInicio: 46, paginaFin: 66 },
            { numero: 2, titulo: 'Costumbres y tradiciones comunitarias', paginaInicio: 67, paginaFin: 86 }
          ]
        },
        {
          unidad: 3,
          titulo: 'Animales Vertebrados e Invertebrados y Plantas',
          paginaInicio: 88,
          paginaFin: 128,
          competencias: ['Clasifica animales y plantas según sus características biológicas.'],
          indicadoresLogro: ['Diferencia mamíferos, aves, reptiles y peces.', 'Describe plantas medicinales.'],
          temas: [
            { numero: 1, titulo: 'Clasificación de animales vertebrados', paginaInicio: 88, paginaFin: 108 },
            { numero: 2, titulo: 'Plantas ornamentales, alimenticias y medicinales', paginaInicio: 109, paginaFin: 128 }
          ]
        },
        {
          unidad: 4,
          titulo: 'Recursos Naturales y Fenómenos del Clima',
          paginaInicio: 130,
          paginaFin: 168,
          competencias: ['Participa en simulacros y acciones para proteger fuentes hídricas.'],
          indicadoresLogro: ['Identifica estados del tiempo y tipos de suelo.', 'Aplica medidas ante sismos.'],
          temas: [
            { numero: 1, titulo: 'El ciclo del agua y el suelo', paginaInicio: 130, paginaFin: 148 },
            { numero: 2, titulo: 'Prevención de desastres en la escuela', paginaInicio: 149, paginaFin: 168 }
          ]
        }
      ]
    }
  ],

  // --------------------------------------------------------------------------
  // 3.er Grado de Primaria (Ciclo I)
  // --------------------------------------------------------------------------
  3: [
    {
      id: 'matematicas_3',
      nombre: 'Matemáticas',
      libroTitulo: 'Matemáticas 3.er Grado (MINEDUC)',
      prioridad: 'Alta prioridad (Áreas Fundamentales)',
      horasSemanales: 5,
      periodosSemanales: 5,
      pesoPorcentaje: 35,
      unidades: [
        {
          unidad: 1,
          titulo: 'Números hasta 10,000, Suma y Resta de 4 Dígitos',
          paginaInicio: 6,
          paginaFin: 48,
          competencias: ['Opera con números de 4 dígitos respetando el orden posicional.'],
          indicadoresLogro: ['Lee y descompone números hasta 10,000.', 'Suma y resta con reagrupación múltiple.'],
          temas: [
            { numero: 1, titulo: 'Unidades de millar hasta 10,000', paginaInicio: 6, paginaFin: 26 },
            { numero: 2, titulo: 'Suma y resta con números de 4 dígitos', paginaInicio: 27, paginaFin: 48 }
          ]
        },
        {
          unidad: 2,
          titulo: 'Tablas de Multiplicar y Algoritmo de Multiplicación',
          paginaInicio: 50,
          paginaFin: 94,
          competencias: ['Multiplica números de dos dígitos por un dígito con agilidad.'],
          indicadoresLogro: ['Domina las tablas del 1 al 9.', 'Resuelve problemas de proporcionalidad directa.'],
          temas: [
            { numero: 1, titulo: 'Tablas de multiplicar del 6, 7, 8 y 9', paginaInicio: 50, paginaFin: 72 },
            { numero: 2, titulo: 'Algoritmo de multiplicación vertical', paginaInicio: 73, paginaFin: 94 }
          ]
        },
        {
          unidad: 3,
          titulo: 'División con Residuo y Fracciones Simples',
          paginaInicio: 96,
          paginaFin: 140,
          competencias: ['Aplica la división exacta e inexacta y representa medios, tercios y cuartos.'],
          indicadoresLogro: ['Calcula cocientes con residuos.', 'Representa fracciones gráficamente.'],
          temas: [
            { numero: 1, titulo: 'La división como reparto equitativo', paginaInicio: 96, paginaFin: 118 },
            { numero: 2, titulo: 'Fracciones: medios, cuartos y octavos', paginaInicio: 119, paginaFin: 140 }
          ]
        },
        {
          unidad: 4,
          titulo: 'Geometría, Medidas de Longitud y Numeración Maya',
          paginaInicio: 142,
          paginaFin: 184,
          competencias: ['Calcula perímetros simples y escribe números mayas hasta 399.'],
          indicadoresLogro: ['Calcula perímetros de rectángulos.', 'Suma números mayas en 2.ª posición.'],
          temas: [
            { numero: 1, titulo: 'Perímetros y figuras de 4 lados', paginaInicio: 142, paginaFin: 162 },
            { numero: 2, titulo: 'Numeración maya hasta la 2.ª posición (1 al 399)', paginaInicio: 163, paginaFin: 184 }
          ]
        }
      ]
    },
    {
      id: 'comunicacion_3',
      nombre: 'Comunicación y Lenguaje',
      libroTitulo: 'Comunicación y Lenguaje 3.er Grado (MINEDUC)',
      prioridad: 'Alta prioridad (Áreas Fundamentales)',
      horasSemanales: 4,
      periodosSemanales: 6,
      pesoPorcentaje: 35,
      unidades: [
        {
          unidad: 1,
          titulo: 'Comprensión Lectora y la Estructura Narrativa',
          paginaInicio: 8,
          paginaFin: 46,
          competencias: ['Identifica inicio, nudo y desenlace en relatos folclóricos.'],
          indicadoresLogro: ['Extrae la secuencia cronológica en cuentos.', 'Reconoce verbos en tiempo presente y pasado.'],
          temas: [
            { numero: 1, titulo: 'Partes de la narración (inicio, nudo, desenlace)', paginaInicio: 8, paginaFin: 26 },
            { numero: 2, titulo: 'El verbo y sus tiempos fundamentales', paginaInicio: 27, paginaFin: 46 }
          ]
        },
        {
          unidad: 2,
          titulo: 'El Párrafo Expositivo y Clases de Palabras',
          paginaInicio: 48,
          paginaFin: 90,
          competencias: ['Redacta párrafos informativos usando palabras sinónimas y antónimas.'],
          indicadoresLogro: ['Identifica idea principal y oraciones de apoyo.', 'Aplica sinónimos y antónimos.'],
          temas: [
            { numero: 1, titulo: 'Estructura del párrafo y conectores de unión', paginaInicio: 48, paginaFin: 68 },
            { numero: 2, titulo: 'Palabras sinónimas, antónimas y homófonas', paginaInicio: 69, paginaFin: 90 }
          ]
        },
        {
          unidad: 3,
          titulo: 'Poemas, Coplas y Teatro Infantil',
          paginaInicio: 92,
          paginaFin: 134,
          competencias: ['Declamación poética y caracterización de personajes.'],
          indicadoresLogro: ['Identifica rimas consonantes y asonantes.', 'Participa en dramatizaciones.'],
          temas: [
            { numero: 1, titulo: 'Poemas de autores guatemaltecos y rimas', paginaInicio: 92, paginaFin: 112 },
            { numero: 2, titulo: 'Diálogos y acotaciones en obras teatrales', paginaInicio: 113, paginaFin: 134 }
          ]
        },
        {
          unidad: 4,
          titulo: 'Textos Informativos e Investigación Escolar',
          paginaInicio: 136,
          paginaFin: 178,
          competencias: ['Organiza información de enciclopedias y textos comunitarios.'],
          indicadoresLogro: ['Elabora cuadros sinópticos y fichas de lectura.'],
          temas: [
            { numero: 1, titulo: 'Fichas informativas y resúmenes de lecturas', paginaInicio: 136, paginaFin: 156 },
            { numero: 2, titulo: 'Reglas de acentuación: palabras agudas y graves', paginaInicio: 157, paginaFin: 178 }
          ]
        }
      ]
    },
    {
      id: 'medio_social_3',
      nombre: 'Medio Social y Natural',
      libroTitulo: 'Medio Social y Natural 3.er Grado (MINEDUC)',
      prioridad: 'Prioridad Intermedia (Áreas Integradoras)',
      horasSemanales: 4,
      periodosSemanales: 4,
      pesoPorcentaje: 20,
      unidades: [
        {
          unidad: 1,
          titulo: 'Sistemas Digestivo, Circulatorio y Salud Comunitaria',
          paginaInicio: 8,
          paginaFin: 44,
          competencias: ['Explica la digestión y circulación y previene enfermedades digestivas.'],
          indicadoresLogro: ['Describe órganos del aparato digestivo y medidas de saneamiento.'],
          temas: [
            { numero: 1, titulo: 'El proceso digestivo y respiratorio', paginaInicio: 8, paginaFin: 26 },
            { numero: 2, titulo: 'Purificación del agua y primeros auxilios básicos', paginaInicio: 27, paginaFin: 44 }
          ]
        },
        {
          unidad: 2,
          titulo: 'Municipios y Departamentos de Guatemala',
          paginaInicio: 46,
          paginaFin: 86,
          competencias: ['Ubica los 22 departamentos y regiones socioeconómicas de Guatemala.'],
          indicadoresLogro: ['Identifica cabeceras departamentales y volcanes principales.'],
          temas: [
            { numero: 1, titulo: 'Mapa político de Guatemala y sus regiones', paginaInicio: 46, paginaFin: 66 },
            { numero: 2, titulo: 'Pueblos Maya, Garífuna, Xinka y Ladino', paginaInicio: 67, paginaFin: 86 }
          ]
        },
        {
          unidad: 3,
          titulo: 'Ecosistemas y Conservación Biológica en Guatemala',
          paginaInicio: 88,
          paginaFin: 128,
          competencias: ['Reconoce los recursos biológicos de las áreas protegidas nacionales.'],
          indicadoresLogro: ['Distingue animales en peligro de extinción.', 'Promueve la reforestación.'],
          temas: [
            { numero: 1, titulo: 'Bosques nubosos, tropicales y manglares de Guatemala', paginaInicio: 88, paginaFin: 108 },
            { numero: 2, titulo: 'El Quetzal y especies nativas en riesgo', paginaInicio: 109, paginaFin: 128 }
          ]
        },
        {
          unidad: 4,
          titulo: 'Cuencas Hidrográficas y Reducción del Riesgo',
          paginaInicio: 130,
          paginaFin: 168,
          competencias: ['Propone alternativas para el uso racional de los ríos y lagos.'],
          indicadoresLogro: ['Localiza los principales lagos de Guatemala (Atitlán, Izabal, Petén Itzá).'],
          temas: [
            { numero: 1, titulo: 'Ríos, lagos y cuencas del Pacífico y Atlántico', paginaInicio: 130, paginaFin: 148 },
            { numero: 2, titulo: 'Elaboración del plan escolar de respuesta ante desastres', paginaInicio: 149, paginaFin: 168 }
          ]
        }
      ]
    }
  ],

  // --------------------------------------------------------------------------
  // 4.° Grado de Primaria (Ciclo II)
  // --------------------------------------------------------------------------
  4: [
    {
      id: 'matematicas_4',
      nombre: 'Matemáticas',
      libroTitulo: 'Matemáticas 4.° Grado (MINEDUC)',
      prioridad: 'Alta prioridad (Áreas Fundamentales)',
      horasSemanales: 5,
      periodosSemanales: 5,
      pesoPorcentaje: 35,
      unidades: [
        {
          unidad: 1,
          titulo: 'Números hasta 100,000 y Multiplicación de 2 Dígitos',
          paginaInicio: 6,
          paginaFin: 48,
          competencias: ['Aplica la multiplicación de números de dos y tres dígitos.'],
          indicadoresLogro: ['Lee números hasta 100,000.', 'Calcula multiplicaciones con factores de dos dígitos.'],
          temas: [
            { numero: 1, titulo: 'Valor posicional hasta centenas de millar', paginaInicio: 6, paginaFin: 24 },
            { numero: 2, titulo: 'Multiplicación por números de dos dígitos', paginaInicio: 25, paginaFin: 48 }
          ]
        },
        {
          unidad: 2,
          titulo: 'División de Dos Dígitos y Fracciones Equivalentes',
          paginaInicio: 50,
          paginaFin: 94,
          competencias: ['Resuelve divisiones con divisores de dos dígitos y fracciones homogéneas.'],
          indicadoresLogro: ['Divide con divisores de dos cifras.', 'Suma y resta fracciones con igual denominador.'],
          temas: [
            { numero: 1, titulo: 'División entre dos dígitos', paginaInicio: 50, paginaFin: 72 },
            { numero: 2, titulo: 'Fracciones equivalentes y suma homogénea', paginaInicio: 73, paginaFin: 94 }
          ]
        },
        {
          unidad: 3,
          titulo: 'Decimales, Ángulos y Triángulos',
          paginaInicio: 96,
          paginaFin: 140,
          competencias: ['Mide ángulos con transportador y opera con décimos y centésimos.'],
          indicadoresLogro: ['Clasifica ángulos agudos, rectos y obtusos.', 'Suma y resta decimales hasta centésimos.'],
          temas: [
            { numero: 1, titulo: 'Números decimales: décimos y centésimos', paginaInicio: 96, paginaFin: 118 },
            { numero: 2, titulo: 'Clasificación de triángulos y transportador', paginaInicio: 119, paginaFin: 140 }
          ]
        },
        {
          unidad: 4,
          titulo: 'Sistema de Numeración Maya hasta 3.ª Posición y Medidas',
          paginaInicio: 142,
          paginaFin: 184,
          competencias: ['Maneja numeración maya hasta 7,999 y unidades métricas y tradicionales.'],
          indicadoresLogro: ['Calcula valores en niveles 1, 2 y 3 mayas.', 'Aplica medidas de peso (onza, libra, arroba).'],
          temas: [
            { numero: 1, titulo: 'Numeración maya hasta la 3.ª posición (valores de 1, 20 y 400)', paginaInicio: 142, paginaFin: 162 },
            { numero: 2, titulo: 'Unidades de peso y capacidad guatemaltecas', paginaInicio: 163, paginaFin: 184 }
          ]
        }
      ]
    },
    {
      id: 'comunicacion_4',
      nombre: 'Comunicación y Lenguaje',
      libroTitulo: 'Comunicación y Lenguaje 4.° Grado (MINEDUC)',
      prioridad: 'Alta prioridad (Áreas Fundamentales)',
      horasSemanales: 4,
      periodosSemanales: 5,
      pesoPorcentaje: 30,
      unidades: [
        {
          unidad: 1,
          titulo: 'La Leyenda, Anécdotas y Uso de Conectores',
          paginaInicio: 8,
          paginaFin: 46,
          competencias: ['Comprende la estructura de leyendas tradicionales y utiliza nexos temporales.'],
          indicadoresLogro: ['Identifica elementos reales y míticos en leyendas.', 'Usa conectores de orden.'],
          temas: [
            { numero: 1, titulo: 'Lectura de leyendas guatemaltecas y anécdotas', paginaInicio: 8, paginaFin: 26 },
            { numero: 2, titulo: 'Conectores temporales y causales en la redacción', paginaInicio: 27, paginaFin: 46 }
          ]
        },
        {
          unidad: 2,
          titulo: 'Palabras Compuestas, Prefijos y Acentuación',
          paginaInicio: 48,
          paginaFin: 90,
          competencias: ['Enriquece su vocabulario con morfología y reglas ortográficas.'],
          indicadoresLogro: ['Identifica prefijos y sufijos en vocablos.', 'Tilda palabras esdrújulas y agudas.'],
          temas: [
            { numero: 1, titulo: 'Formación de palabras compuestas y prefijos', paginaInicio: 48, paginaFin: 68 },
            { numero: 2, titulo: 'Acentuación ortográfica de palabras esdrújulas', paginaInicio: 69, paginaFin: 90 }
          ]
        },
        {
          unidad: 3,
          titulo: 'Diálogo Teatral y Figuras Retóricas',
          paginaInicio: 92,
          paginaFin: 134,
          competencias: ['Interpreta textos teatrales identificando recursos poéticos.'],
          indicadoresLogro: ['Diferencia símil y metáfora.', 'Escribe diálogos con guiones largos.'],
          temas: [
            { numero: 1, titulo: 'El símil y la metáfora en textos literarios', paginaInicio: 92, paginaFin: 112 },
            { numero: 2, titulo: 'Redacción de guiones teatrales escolares', paginaInicio: 113, paginaFin: 134 }
          ]
        },
        {
          unidad: 4,
          titulo: 'El Periódico Escolar y el Debate Grupal',
          paginaInicio: 136,
          paginaFin: 178,
          competencias: ['Redacta artículos de opinión y noticias objetivas.'],
          indicadoresLogro: ['Distingue las secciones del periódico.', 'Participa con orden en debates.'],
          temas: [
            { numero: 1, titulo: 'Secciones del periódico y la noticia escolar', paginaInicio: 136, paginaFin: 156 },
            { numero: 2, titulo: 'Preparación y ejecución de un debate grupal', paginaInicio: 157, paginaFin: 178 }
          ]
        }
      ]
    },
    {
      id: 'ciencias_naturales_4',
      nombre: 'Ciencias Naturales y Tecnología',
      libroTitulo: 'Ciencias Naturales 4.° Grado (MINEDUC)',
      prioridad: 'Prioridad Intermedia (Áreas Integradoras)',
      horasSemanales: 3,
      periodosSemanales: 3,
      pesoPorcentaje: 17.5,
      unidades: [
        {
          unidad: 1,
          titulo: 'La Célula y los Sentidos del Ser Humano',
          paginaInicio: 6,
          paginaFin: 44,
          competencias: ['Explica la célula como unidad vital y el funcionamiento de los sentidos.'],
          indicadoresLogro: ['Identifica membrana, núcleo y citoplasma.', 'Previene afecciones en oído y vista.'],
          temas: [
            { numero: 1, titulo: 'La célula vegetal y animal', paginaInicio: 6, paginaFin: 24 },
            { numero: 2, titulo: 'Cuidado y fisiología de los órganos de los sentidos', paginaInicio: 25, paginaFin: 44 }
          ]
        },
        {
          unidad: 2,
          titulo: 'Cadenas Tróficas y Ciclos Biogeoquímicos',
          paginaInicio: 46,
          paginaFin: 86,
          competencias: ['Analiza las interacciones entre productores, consumidores y descomponedores.'],
          indicadoresLogro: ['Diseña cadenas alimentarias de su comunidad.', 'Explica el ciclo del agua.'],
          temas: [
            { numero: 1, titulo: 'Productores, herbívoros y carnívoros en el ecosistema', paginaInicio: 46, paginaFin: 64 },
            { numero: 2, titulo: 'El ciclo del agua y el ciclo del carbono', paginaInicio: 65, paginaFin: 86 }
          ]
        },
        {
          unidad: 3,
          titulo: 'Estados de la Materia y Energía Calórica',
          paginaInicio: 88,
          paginaFin: 126,
          competencias: ['Comprueba empíricamente los cambios de estado y la transmisión del calor.'],
          indicadoresLogro: ['Diferencia conducción, convección y radiación calórica.'],
          temas: [
            { numero: 1, titulo: 'Sólido, líquido, gaseoso y plasma', paginaInicio: 88, paginaFin: 106 },
            { numero: 2, titulo: 'Fuentes de calor y conductores térmicos', paginaInicio: 107, paginaFin: 126 }
          ]
        },
        {
          unidad: 4,
          titulo: 'El Planeta Tierra y Recursos Minerales',
          paginaInicio: 128,
          paginaFin: 168,
          competencias: ['Describe la estructura interna de la Tierra y el uso sustentable de minerales.'],
          indicadoresLogro: ['Identifica corteza, manto y núcleo terrestre.', 'Fomenta el reciclaje de metales.'],
          temas: [
            { numero: 1, titulo: 'Capas de la Tierra y placas tectónicas', paginaInicio: 128, paginaFin: 146 },
            { numero: 2, titulo: 'Minerales y rocas de Guatemala', paginaInicio: 147, paginaFin: 168 }
          ]
        }
      ]
    },
    {
      id: 'ciencias_sociales_4',
      nombre: 'Ciencias Sociales',
      libroTitulo: 'Ciencias Sociales 4.° Grado (MINEDUC)',
      prioridad: 'Prioridad Intermedia (Áreas Integradoras)',
      horasSemanales: 3,
      periodosSemanales: 3,
      pesoPorcentaje: 17.5,
      unidades: [
        {
          unidad: 1,
          titulo: 'Geografía Física y Política de Guatemala',
          paginaInicio: 8,
          paginaFin: 46,
          competencias: ['Ubica departamentos, fronteras, ríos y volcanes en el mapa de Guatemala.'],
          indicadoresLogro: ['Localiza la Sierra Madre y ríos de vertientes pacífica y atlántica.'],
          temas: [
            { numero: 1, titulo: 'Límites, fronteras y orografía de Guatemala', paginaInicio: 8, paginaFin: 26 },
            { numero: 2, titulo: 'Recursos hídricos y actividades agrícolas por región', paginaInicio: 27, paginaFin: 46 }
          ]
        },
        {
          unidad: 2,
          titulo: 'Época Maya Clásica y Señoríos Indígenas',
          paginaInicio: 48,
          paginaFin: 90,
          competencias: ['Explica la historia de las ciudades mayas y los señoríos K\'iche\', Kaqchikel y Mam.'],
          indicadoresLogro: ['Describe Tikal, Quiriguá, Iximché y Gumarkaaj.'],
          temas: [
            { numero: 1, titulo: 'El periodo clásico maya y los sitios arqueológicos', paginaInicio: 48, paginaFin: 68 },
            { numero: 2, titulo: 'Los señoríos indígenas prehispánicos de Guatemala', paginaInicio: 69, paginaFin: 90 }
          ]
        },
        {
          unidad: 3,
          titulo: 'Época Colonial y Capitanía General de Guatemala',
          paginaInicio: 92,
          paginaFin: 134,
          competencias: ['Identifica las etapas de la colonia española y el traslado de ciudades.'],
          indicadoresLogro: ['Describe Santiago de los Caballeros y la Nueva Guatemala de la Asunción.'],
          temas: [
            { numero: 1, titulo: 'La conquista y fundación de ciudades coloniales', paginaInicio: 92, paginaFin: 112 },
            { numero: 2, titulo: 'Economía colonial: el añil, la grana y los repartimientos', paginaInicio: 113, paginaFin: 134 }
          ]
        },
        {
          unidad: 4,
          titulo: 'Cultura de Paz y Símbolos Patrios de Guatemala',
          paginaInicio: 136,
          paginaFin: 178,
          competencias: ['Valora la identidad cívica y la convivencia armónica entre los cuatro pueblos.'],
          indicadoresLogro: ['Identifica símbolos patrios.', 'Promueve la no discriminación.'],
          temas: [
            { numero: 1, titulo: 'Los símbolos nacionales de Guatemala (Bandera, Quetzal, Monja Blanca)', paginaInicio: 136, paginaFin: 156 },
            { numero: 2, titulo: 'Derechos de los pueblos indígenas y convivencia pacífica', paginaInicio: 157, paginaFin: 178 }
          ]
        }
      ]
    }
  ],

  // --------------------------------------------------------------------------
  // 5.° Grado de Primaria (Ciclo II)
  // --------------------------------------------------------------------------
  5: [
    {
      id: 'matematicas_5',
      nombre: 'Matemáticas',
      libroTitulo: 'Matemáticas 5.° Grado (MINEDUC)',
      prioridad: 'Alta prioridad (Áreas Fundamentales)',
      horasSemanales: 5,
      periodosSemanales: 5,
      pesoPorcentaje: 35,
      unidades: [
        {
          unidad: 1,
          titulo: 'Números hasta 1,000,000, Multiplicación y División',
          paginaInicio: 6,
          paginaFin: 48,
          competencias: ['Utiliza el valor posicional de números hasta 1,000,000 y algoritmos de multiplicación.'],
          indicadoresLogro: ['Lee, escribe y descompone números hasta 1,000,000.', 'Calcula multiplicaciones y divisiones con números grandes.'],
          temas: [
            { numero: 1, titulo: 'Valor posicional y lectura hasta 1,000,000', paginaInicio: 6, paginaFin: 22 },
            { numero: 2, titulo: 'Multiplicación por múltiplos de 10, 100 y 1,000', paginaInicio: 23, paginaFin: 36 },
            { numero: 3, titulo: 'División con divisores de dos dígitos', paginaInicio: 37, paginaFin: 48 }
          ]
        },
        {
          unidad: 2,
          titulo: 'Fracciones, Decimales y Geometría',
          paginaInicio: 50,
          paginaFin: 96,
          competencias: ['Opera con fracciones propias, impropias y decimales en problemas contextuales.'],
          indicadoresLogro: ['Suma y resta fracciones con diferente denominador.', 'Traza polígonos y calcula ángulos.'],
          temas: [
            { numero: 1, titulo: 'Fracciones equivalentes y simplificación', paginaInicio: 50, paginaFin: 64 },
            { numero: 2, titulo: 'Suma y resta de fracciones heterogéneas', paginaInicio: 65, paginaFin: 78 },
            { numero: 3, titulo: 'Números decimales hasta milésimos', paginaInicio: 79, paginaFin: 88 },
            { numero: 4, titulo: 'Polígonos regulares y perímetro', paginaInicio: 89, paginaFin: 96 }
          ]
        },
        {
          unidad: 3,
          titulo: 'Multiplicación y División de Decimales y Medidas',
          paginaInicio: 98,
          paginaFin: 142,
          competencias: ['Resuelve problemas de proporcionalidad, razones y medidas mayas y decimales.'],
          indicadoresLogro: ['Multiplica y divide decimales.', 'Aplica unidades de masa, volumen y tiempo.'],
          temas: [
            { numero: 1, titulo: 'Multiplicación de decimal por entero', paginaInicio: 98, paginaFin: 112 },
            { numero: 2, titulo: 'División con decimales en el dividendo', paginaInicio: 113, paginaFin: 126 },
            { numero: 3, titulo: 'Medidas tradicionales guatemaltecas (vara, cuerda, quintal)', paginaInicio: 127, paginaFin: 142 }
          ]
        },
        {
          unidad: 4,
          titulo: 'Estadística, Probabilidad y Sistema Vigesimal Maya',
          paginaInicio: 144,
          paginaFin: 184,
          competencias: ['Interpreta gráficas estadísticas y maneja numeración maya hasta la 3.ª posición.'],
          indicadoresLogro: ['Calcula la media aritmética y moda.', 'Escribe y suma números mayas hasta 7,999.'],
          temas: [
            { numero: 1, titulo: 'Gráficas de líneas y barras dobles', paginaInicio: 144, paginaFin: 158 },
            { numero: 2, titulo: 'Sistema de numeración maya hasta 3.ª posición', paginaInicio: 159, paginaFin: 172 },
            { numero: 3, titulo: 'Áreas de cuadriláteros y triángulos', paginaInicio: 173, paginaFin: 184 }
          ]
        }
      ]
    },
    {
      id: 'comunicacion_5',
      nombre: 'Comunicación y Lenguaje',
      libroTitulo: 'Comunicación y Lenguaje 5.° Grado (MINEDUC)',
      prioridad: 'Alta prioridad (Áreas Fundamentales)',
      horasSemanales: 4,
      periodosSemanales: 5,
      pesoPorcentaje: 30,
      unidades: [
        {
          unidad: 1,
          titulo: 'Lectura Comprensiva, Texto Narrativo y Gramática',
          paginaInicio: 8,
          paginaFin: 46,
          competencias: ['Produce textos narrativos aplicando normas gramaticales y ortográficas.'],
          indicadoresLogro: ['Identifica la idea principal en leyendas y cuentos.', 'Aplica el uso de sustantivos, adjetivos y verbos.'],
          temas: [
            { numero: 1, titulo: 'Estructura del cuento y la fábula', paginaInicio: 8, paginaFin: 24 },
            { numero: 2, titulo: 'Sujeto, predicado y concordancia gramatical', paginaInicio: 25, paginaFin: 46 }
          ]
        },
        {
          unidad: 2,
          titulo: 'Texto Informativo, El Periódico y la Oración Compuesta',
          paginaInicio: 48,
          paginaFin: 92,
          competencias: ['Redacta noticias e informes utilizando conectores lógicos.'],
          indicadoresLogro: ['Diferencia hechos de opiniones.', 'Aplica reglas de acentuación (agudas, graves, esdrújulas).'],
          temas: [
            { numero: 1, titulo: 'La noticia y la entrevista comunitaria', paginaInicio: 48, paginaFin: 68 },
            { numero: 2, titulo: 'Clasificación de palabras por su acento', paginaInicio: 69, paginaFin: 92 }
          ]
        },
        {
          unidad: 3,
          titulo: 'Poesía, Figuras Literarias y Teatro Escolar',
          paginaInicio: 94,
          paginaFin: 138,
          competencias: ['Interpreta poemas reconociendo metáforas y recursos expresivos.'],
          indicadoresLogro: ['Declamación poética y lectura dramatizada.', 'Uso correcto de signos de puntuación.'],
          temas: [
            { numero: 1, titulo: 'Rima, verso y estrofa en la poesía nacional', paginaInicio: 94, paginaFin: 114 },
            { numero: 2, titulo: 'Guion teatral y signos de interrogación/admiración', paginaInicio: 115, paginaFin: 138 }
          ]
        },
        {
          unidad: 4,
          titulo: 'Textos Argumentativos, Ensayos y Tradición Oral',
          paginaInicio: 140,
          paginaFin: 182,
          competencias: ['Participa en mesas redondas sustentando sus ideas con argumentos.'],
          indicadoresLogro: ['Redacta párrafos argumentativos.', 'Valora leyendas y tradiciones orales de Guatemala.'],
          temas: [
            { numero: 1, titulo: 'El debate escolar y la mesa redonda', paginaInicio: 140, paginaFin: 160 },
            { numero: 2, titulo: 'Compilación de leyendas comunitarias', paginaInicio: 161, paginaFin: 182 }
          ]
        }
      ]
    },
    {
      id: 'ciencias_naturales_5',
      nombre: 'Ciencias Naturales y Tecnología',
      libroTitulo: 'Ciencias Naturales 5.° Grado (MINEDUC)',
      prioridad: 'Prioridad Intermedia (Áreas Integradoras)',
      horasSemanales: 3,
      periodosSemanales: 3,
      pesoPorcentaje: 17.5,
      unidades: [
        {
          unidad: 1,
          titulo: 'La Célula, Tejidos y Sistemas del Cuerpo Humano',
          paginaInicio: 6,
          paginaFin: 44,
          competencias: ['Explica la función de la célula y los sistemas digestivo, respiratorio y circulatorio.'],
          indicadoresLogro: ['Diferencia célula animal y vegetal.', 'Describe la nutrición y circulación humana.'],
          temas: [
            { numero: 1, titulo: 'Estructura celular y organelos', paginaInicio: 6, paginaFin: 24 },
            { numero: 2, titulo: 'Sistemas del cuerpo y hábitos de salud', paginaInicio: 25, paginaFin: 44 }
          ]
        },
        {
          unidad: 2,
          titulo: 'Ecosistemas, Cadenas Tróficas y Biodiversidad',
          paginaInicio: 46,
          paginaFin: 86,
          competencias: ['Analiza las relaciones ecológicas y propone medidas de conservación biológica.'],
          indicadoresLogro: ['Construye cadenas y redes tróficas.', 'Identifica áreas protegidas de Guatemala.'],
          temas: [
            { numero: 1, titulo: 'Factores bióticos y abióticos en ecosistemas', paginaInicio: 46, paginaFin: 64 },
            { numero: 2, titulo: 'Bosques y cuencas hidrográficas de Guatemala', paginaInicio: 65, paginaFin: 86 }
          ]
        },
        {
          unidad: 3,
          titulo: 'Materia, Energía y Máquinas Simples',
          paginaInicio: 88,
          paginaFin: 126,
          competencias: ['Experimenta cambios físicos y químicos de la materia y uso de palancas.'],
          indicadoresLogro: ['Distingue mezclas homogéneas y heterogéneas.', 'Demuestra el funcionamiento de poleas y planos inclinados.'],
          temas: [
            { numero: 1, titulo: 'Estados y transformaciones de la materia', paginaInicio: 88, paginaFin: 106 },
            { numero: 2, titulo: 'Máquinas simples en las labores del campo', paginaInicio: 107, paginaFin: 126 }
          ]
        },
        {
          unidad: 4,
          titulo: 'El Universo, El Sistema Solar y Tecnología',
          paginaInicio: 128,
          paginaFin: 168,
          competencias: ['Describe los astros del sistema solar y los aportes de la ciencia tecnológica.'],
          indicadoresLogro: ['Explica movimientos de rotación y traslación.', 'Aplica medidas de seguridad ante sismos y erupciones.'],
          temas: [
            { numero: 1, titulo: 'Planetas, satélites y cometas', paginaInicio: 128, paginaFin: 146 },
            { numero: 2, titulo: 'Fenómenos naturales y gestión de riesgo', paginaInicio: 147, paginaFin: 168 }
          ]
        }
      ]
    },
    {
      id: 'ciencias_sociales_5',
      nombre: 'Ciencias Sociales',
      libroTitulo: 'Ciencias Sociales 5.° Grado (MINEDUC)',
      prioridad: 'Prioridad Intermedia (Áreas Integradoras)',
      horasSemanales: 3,
      periodosSemanales: 3,
      pesoPorcentaje: 17.5,
      unidades: [
        {
          unidad: 1,
          titulo: 'Geografía y Climas de América',
          paginaInicio: 8,
          paginaFin: 46,
          competencias: ['Localiza accidentes geográficos y zonas climáticas del continente americano.'],
          indicadoresLogro: ['Ubica cordilleras, ríos y océanos en el mapa de América.'],
          temas: [
            { numero: 1, titulo: 'Regiones geográficas de América (Norte, Centro, Sur)', paginaInicio: 8, paginaFin: 26 },
            { numero: 2, titulo: 'Recursos naturales y actividades económicas americanas', paginaInicio: 27, paginaFin: 46 }
          ]
        },
        {
          unidad: 2,
          titulo: 'Pueblos Originarios y Época Prehispánica',
          paginaInicio: 48,
          paginaFin: 90,
          competencias: ['Valora la civilización maya, azteca e inca y su legado cultural.'],
          indicadoresLogro: ['Describe la cosmovisión, arquitectura y ciencia maya.'],
          temas: [
            { numero: 1, titulo: 'La civilización maya: periodos preclásico, clásico y posclásico', paginaInicio: 48, paginaFin: 68 },
            { numero: 2, titulo: 'Las grandes culturas de América precolombina', paginaInicio: 69, paginaFin: 90 }
          ]
        },
        {
          unidad: 3,
          titulo: 'Encuentro de Dos Mundos y Época Colonial',
          paginaInicio: 92,
          paginaFin: 134,
          competencias: ['Explica las causas y consecuencias de la conquista y colonización española.'],
          indicadoresLogro: ['Identifica instituciones coloniales y el mestizaje en Guatemala.'],
          temas: [
            { numero: 1, titulo: 'Expediciones y conquista de Guatemala (1524)', paginaInicio: 92, paginaFin: 112 },
            { numero: 2, titulo: 'Organización social, política y económica en la Colonia', paginaInicio: 113, paginaFin: 134 }
          ]
        },
        {
          unidad: 4,
          titulo: 'Independencia, Época Republicana y Derechos Humanos',
          paginaInicio: 136,
          paginaFin: 178,
          competencias: ['Analiza el proceso independentista de 1821 y la construcción democrática.'],
          indicadoresLogro: ['Reconoce los derechos fundamentales en la Constitución de Guatemala.'],
          temas: [
            { numero: 1, titulo: 'La Independencia de Centroamérica y la Federación', paginaInicio: 136, paginaFin: 156 },
            { numero: 2, titulo: 'Derechos y deberes ciudadanos en la Guatemala pluricultural', paginaInicio: 157, paginaFin: 178 }
          ]
        }
      ]
    }
  ],

  // --------------------------------------------------------------------------
  // 6.° Grado de Primaria (Ciclo II)
  // --------------------------------------------------------------------------
  6: [
    {
      id: 'matematicas_6',
      nombre: 'Matemáticas',
      libroTitulo: 'Matemáticas 6.° Grado (MINEDUC)',
      prioridad: 'Alta prioridad (Áreas Fundamentales)',
      horasSemanales: 5,
      periodosSemanales: 5,
      pesoPorcentaje: 35,
      unidades: [
        {
          unidad: 1,
          titulo: 'Teoría de Conjuntos, Jerarquía Operativa y Potencias',
          paginaInicio: 6,
          paginaFin: 48,
          competencias: ['Maneja operaciones de conjuntos y jerarquía operativa con signos de agrupación.'],
          indicadoresLogro: ['Aplica unión, intersección y diferencia con diagramas de Venn.', 'Calcula potencias y raíces cuadradas exactas.'],
          temas: [
            { numero: 1, titulo: 'Conjuntos: operaciones y diagramas de Venn', paginaInicio: 6, paginaFin: 20 },
            { numero: 2, titulo: 'Jerarquía de operaciones combinadas con paréntesis', paginaInicio: 21, paginaFin: 34 },
            { numero: 3, titulo: 'Potenciación y radicación básica', paginaInicio: 35, paginaFin: 48 }
          ]
        },
        {
          unidad: 2,
          titulo: 'Multiplicación y División de Fracciones y Porcentajes',
          paginaInicio: 50,
          paginaFin: 98,
          competencias: ['Resuelve problemas con fracciones complejas, razones y porcentajes.'],
          indicadoresLogro: ['Multiplica y divide fracciones en problemas de la vida real.', 'Calcula porcentajes y descuentos comerciales.'],
          temas: [
            { numero: 1, titulo: 'Multiplicación y división de fracciones', paginaInicio: 50, paginaFin: 66 },
            { numero: 2, titulo: 'Razones y proporciones directas e inversas', paginaInicio: 67, paginaFin: 82 },
            { numero: 3, titulo: 'Cálculo de tanto por ciento (%) en compras familiares', paginaInicio: 83, paginaFin: 98 }
          ]
        },
        {
          unidad: 3,
          titulo: 'Álgebra Inicial, Geometría Espacial y Círculo',
          paginaInicio: 100,
          paginaFin: 144,
          competencias: ['Calcula área de círculos, volumen de prismas y ecuaciones de primer grado.'],
          indicadoresLogro: ['Encuentra el valor de incógnitas simples (x).', 'Calcula el área de círculos y volumen de cubos y prismas.'],
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
      ]
    },
    {
      id: 'comunicacion_6',
      nombre: 'Comunicación y Lenguaje',
      libroTitulo: 'Comunicación y Lenguaje 6.° Grado (MINEDUC)',
      prioridad: 'Alta prioridad (Áreas Fundamentales)',
      horasSemanales: 4,
      periodosSemanales: 5,
      pesoPorcentaje: 30,
      unidades: [
        {
          unidad: 1,
          titulo: 'Análisis Crítico de Textos, Resumen y Cohesión',
          paginaInicio: 8,
          paginaFin: 46,
          competencias: ['Evalúa críticamente textos informativos y redacta resúmenes analíticos.'],
          indicadoresLogro: ['Diferencia ideas principales y secundarias con subrayado.', 'Emplea sinónimos, antónimos y parónimos.'],
          temas: [
            { numero: 1, titulo: 'El resumen y mapas conceptuales', paginaInicio: 8, paginaFin: 26 },
            { numero: 2, titulo: 'Párrafos expositivos y conectores de causa-efecto', paginaInicio: 27, paginaFin: 46 }
          ]
        },
        {
          unidad: 2,
          titulo: 'Ensayo Breve, Ortografía Grafemática y Debate',
          paginaInicio: 48,
          paginaFin: 92,
          competencias: ['Sustenta ensayos breves y domina grafemas dudosos (b/v, c/s/z, g/j).'],
          indicadoresLogro: ['Participa en debates con argumentos fundamentados.', 'Aplica normas ortográficas de la RAE.'],
          temas: [
            { numero: 1, titulo: 'Estructura del ensayo: introducción, desarrollo y conclusión', paginaInicio: 48, paginaFin: 70 },
            { numero: 2, titulo: 'Ortografía de palabras con b, v, c, s, z, h', paginaInicio: 71, paginaFin: 92 }
          ]
        },
        {
          unidad: 3,
          titulo: 'Literatura Guatemalteca, Leyendas y Teatro Clásico',
          paginaInicio: 94,
          paginaFin: 138,
          competencias: ['Analiza obras de autores guatemaltecos y produce obras teatrales.'],
          indicadoresLogro: ['Identifica pasajes de leyendas tradicionales y Popol Vuh.', 'Montaje de sociodramas comunitarios.'],
          temas: [
            { numero: 1, titulo: 'Lectura de fragmentos del Popol Vuh y literatura nacional', paginaInicio: 94, paginaFin: 116 },
            { numero: 2, titulo: 'Elementos de la puesta en escena teatral', paginaInicio: 117, paginaFin: 138 }
          ]
        },
        {
          unidad: 4,
          titulo: 'Medios de Comunicación, Investigación y Citas',
          paginaInicio: 140,
          paginaFin: 182,
          competencias: ['Diseña proyectos de investigación escolar con fuentes bibliográficas.'],
          indicadoresLogro: ['Redacta informes finales con índice y citas.', 'Analiza el impacto de los medios digitales.'],
          temas: [
            { numero: 1, titulo: 'Técnicas de investigación documental y entrevistas', paginaInicio: 140, paginaFin: 160 },
            { numero: 2, titulo: 'Elaboración del informe de investigación escolar', paginaInicio: 161, paginaFin: 182 }
          ]
        }
      ]
    },
    {
      id: 'ciencias_naturales_6',
      nombre: 'Ciencias Naturales y Tecnología',
      libroTitulo: 'Ciencias Naturales 6.° Grado (MINEDUC)',
      prioridad: 'Prioridad Intermedia (Áreas Integradoras)',
      horasSemanales: 3,
      periodosSemanales: 3,
      pesoPorcentaje: 17.5,
      unidades: [
        {
          unidad: 1,
          titulo: 'Niveles de Organización Biológica y Reproducción',
          paginaInicio: 6,
          paginaFin: 44,
          competencias: ['Explica la reproducción humana y la estructura del sistema nervioso y endocrino.'],
          indicadoresLogro: ['Describe etapas del desarrollo humano y sexualidad responsable.', 'Explica el funcionamiento del cerebro y las neuronas.'],
          temas: [
            { numero: 1, titulo: 'Niveles de organización: célula, tejido, órgano, sistema y organismo', paginaInicio: 6, paginaFin: 24 },
            { numero: 2, titulo: 'Sistema reproductor y pubertad', paginaInicio: 25, paginaFin: 44 }
          ]
        },
        {
          unidad: 2,
          titulo: 'Genética Básica, Evolución y Biodiversidad Mundial',
          paginaInicio: 46,
          paginaFin: 88,
          competencias: ['Reconoce los principios de la herencia biológica y las eras geológicas.'],
          indicadoresLogro: ['Explica la herencia de caracteres familiares.', 'Describe la evolución de especies y fósiles.'],
          temas: [
            { numero: 1, titulo: 'Leyes de Mendel y caracteres hereditarios', paginaInicio: 46, paginaFin: 66 },
            { numero: 2, titulo: 'Biodiversidad y biomas del mundo', paginaInicio: 67, paginaFin: 88 }
          ]
        },
        {
          unidad: 3,
          titulo: 'Electricidad, Magnetismo y Fuentes de Energía Renovable',
          paginaInicio: 90,
          paginaFin: 128,
          competencias: ['Construye circuitos eléctricos sencillos y analiza el ahorro energético.'],
          indicadoresLogro: ['Distingue corriente alterna y continua.', 'Propone el uso de energía solar, eólica e hidroeléctrica.'],
          temas: [
            { numero: 1, titulo: 'Circuitos eléctricos en serie y en paralelo', paginaInicio: 90, paginaFin: 108 },
            { numero: 2, titulo: 'Energía limpia y cambio climático', paginaInicio: 109, paginaFin: 128 }
          ]
        },
        {
          unidad: 4,
          titulo: 'Química Básica, Tabla Periódica y Medio Ambiente',
          paginaInicio: 130,
          paginaFin: 170,
          competencias: ['Explica la estructura del átomo y los elementos químicos comunes.'],
          indicadoresLogro: ['Identifica símbolos de elementos químicos (H, O, C, Fe).', 'Promueve el tratamiento de desechos sólidos.'],
          temas: [
            { numero: 1, titulo: 'El átomo y la tabla periódica', paginaInicio: 130, paginaFin: 148 },
            { numero: 2, titulo: 'Huella ecológica y sostenibilidad ambiental', paginaInicio: 149, paginaFin: 170 }
          ]
        }
      ]
    },
    {
      id: 'ciencias_sociales_6',
      nombre: 'Ciencias Sociales',
      libroTitulo: 'Ciencias Sociales 6.° Grado (MINEDUC)',
      prioridad: 'Prioridad Intermedia (Áreas Integradoras)',
      horasSemanales: 3,
      periodosSemanales: 3,
      pesoPorcentaje: 17.5,
      unidades: [
        {
          unidad: 1,
          titulo: 'Geografía Mundial, Husos Horarios y Cartografía',
          paginaInicio: 8,
          paginaFin: 46,
          competencias: ['Aplica coordenadas geográficas (latitud/longitud) y calcula husos horarios.'],
          indicadoresLogro: ['Ubica continentes y husos horarios en el planisferio.'],
          temas: [
            { numero: 1, titulo: 'Líneas imaginarias terrestres y meridianos', paginaInicio: 8, paginaFin: 26 },
            { numero: 2, titulo: 'Los continentes del mundo y su demografía', paginaInicio: 27, paginaFin: 46 }
          ]
        },
        {
          unidad: 2,
          titulo: 'Historia Universal: Primeras Civilizaciones y Edad Media',
          paginaInicio: 48,
          paginaFin: 92,
          competencias: ['Relaciona los aportes de Mesopotamia, Egipto, Grecia y Roma con el mundo actual.'],
          indicadoresLogro: ['Identifica los orígenes de la democracia y la escritura.'],
          temas: [
            { numero: 1, titulo: 'Civilizaciones fluviales y la Grecia clásica', paginaInicio: 48, paginaFin: 70 },
            { numero: 2, titulo: 'El Imperio Romano y la Edad Media', paginaInicio: 71, paginaFin: 92 }
          ]
        },
        {
          unidad: 3,
          titulo: 'Historia Contemporánea de Guatemala y Acuerdos de Paz',
          paginaInicio: 94,
          paginaFin: 136,
          competencias: ['Analiza la Revolución de 1944, el conflicto armado interno y los Acuerdos de Paz.'],
          indicadoresLogro: ['Explica la década democrática (1944-1954).', 'Valora los compromisos de los Acuerdos de Paz de 1996.'],
          temas: [
            { numero: 1, titulo: 'La Revolución de Octubre de 1944 y sus reformas sociales', paginaInicio: 94, paginaFin: 114 },
            { numero: 2, titulo: 'El Conflicto Armado y los Acuerdos de Paz en Guatemala', paginaInicio: 115, paginaFin: 136 }
          ]
        },
        {
          unidad: 4,
          titulo: 'Geopolítica Actual, Globalización y Ciudadanía Global',
          paginaInicio: 138,
          paginaFin: 180,
          competencias: ['Examina los desafíos globales: migración, cambio climático y organismos internacionales.'],
          indicadoresLogro: ['Conoce la función de la ONU, OEA y UNICEF.', 'Ejerce liderazgo juvenil comunitario.'],
          temas: [
            { numero: 1, titulo: 'Organismos internacionales y derechos humanos', paginaInicio: 138, paginaFin: 158 },
            { numero: 2, titulo: 'Participación ciudadana y desarrollo sostenible', paginaInicio: 159, paginaFin: 180 }
          ]
        }
      ]
    }
  ]
};

// ============================================================================
// FUNCIONES UTILITARIAS PARA INGESTA Y CONSULTA DEL RAG
// ============================================================================


const INDICES_REALES = indicesExtraidosRaw {};

function getMateriasPorGrado(grado) {
  const baseMaterias = CATALOGO_MATERIAS_GRADO[grado] || CATALOGO_MATERIAS_GRADO[1];
  const gradoKey = String(grado);
  const extra = INDICES_REALES[gradoKey];
  if (!extra) return baseMaterias;

  return baseMaterias.map(m => {
    if (m.id.startsWith('ciencias_naturales_') && extra.cnyt) {
      return { ...m, unidades: extra.cnyt };
    }
    if (m.id.startsWith('ciencias_sociales_') && extra.csyc) {
      return { ...m, unidades: extra.csyc };
    }
    if (m.id.startsWith('comunicacion_') && extra.cyl) {
      return { ...m, unidades: extra.cyl };
    }
    return m;
  });
}

function getAsignaturasComplementarias(ciclo: 'primer_ciclo' | 'segundo_ciclo'): AsignaturaComplementariaCNB[] {
  return ASIGNATURAS_COMPLEMENTARIAS[ciclo];
}

module.exports = { CATALOGO_MATERIAS_GRADO };