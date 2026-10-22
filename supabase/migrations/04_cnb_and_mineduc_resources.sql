-- ============================================================================
-- MIGRACIÓN 04: MALLA CURRICULAR CNB Y BANCO DE EJERCICIOS MINEDUC (RAG)
-- PLATAFORMA SIDSER
-- ============================================================================

-- 1. Malla Curricular CNB (DIGECUR - Marco Normativo Oficial de Guatemala)
CREATE TABLE IF NOT EXISTS public.cnb_malla_curricular (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grado INT2 NOT NULL CHECK (grado BETWEEN 1 AND 6),
    ciclo ciclo_educativo NOT NULL,
    area_materia TEXT NOT NULL, -- Ej: 'Matemáticas', 'Comunicación y Lenguaje', 'Medio Social y Natural', 'Ciencias Naturales y Tecnología'
    bloque_bimestre INT2 NOT NULL CHECK (bloque_bimestre BETWEEN 1 AND 4),
    semana_sugerida INT2 CHECK (semana_sugerida BETWEEN 1 AND 40),
    competencia_numero INT2 NOT NULL,
    competencia_descripcion TEXT NOT NULL,
    indicador_numero VARCHAR(10) NOT NULL, -- Ej: "1.1", "2.3"
    indicador_descripcion TEXT NOT NULL,
    temas_declarativos TEXT[] DEFAULT '{}',
    criterios_evaluacion TEXT,
    embedding vector(1536), -- Vector semántico para búsqueda RAG
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices B-tree para filtrado relacional exacto
CREATE INDEX IF NOT EXISTS idx_cnb_grado_materia ON public.cnb_malla_curricular(grado, area_materia);
CREATE INDEX IF NOT EXISTS idx_cnb_bloque_semana ON public.cnb_malla_curricular(bloque_bimestre, semana_sugerida);

-- Índice vectorial HNSW para búsqueda por similitud semántica rápida y de bajo costo de tokens
CREATE INDEX IF NOT EXISTS idx_cnb_vector_hnsw ON public.cnb_malla_curricular 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- 2. Banco de Ejercicios y Recursos Didácticos MINEDUC (Libros de Texto y Guías de Ciclo)
CREATE TABLE IF NOT EXISTS public.mineduc_recursos_didacticos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    libro_titulo TEXT NOT NULL, -- Ej: 'Matemáticas 3G', 'Guía para la enseñanza de Matemáticas Segundo Ciclo', 'Mi libro de lecturas 2do grado'
    libro_url TEXT, -- Enlace al PDF oficial
    grado_especifico INT2 CHECK (grado_especifico BETWEEN 1 AND 6), -- Grado exacto
    grados_aplicables INT2[] DEFAULT '{}', -- Para guías multigrado o de ciclo [4, 5, 6]
    ciclo ciclo_educativo NOT NULL,
    materia TEXT NOT NULL,
    numero_pagina INT2 NOT NULL CHECK (numero_pagina > 0),
    seccion_unidad TEXT, -- Ej: 'Unidad 2: Operaciones básicas', 'Lectura 14'
    tipo_recurso TEXT NOT NULL CHECK (tipo_recurso IN (
        'ejercicio_estudiante',    -- Para trabajo autónomo en clase
        'evaluacion_cierre',       -- Ejercicios oficiales para el examen del viernes
        'lectura_autonoma_casa',   -- Para aprendizaje en el hogar (Leamos Juntos)
        'actividad_manipulable',   -- Del material recortable
        'guia_docente_ejemplo'     -- Orientación metodológica para atención directa
    )),
    enunciado_ejercicio TEXT NOT NULL, -- Texto exacto del ejercicio para confrontar en el libro físico
    instrucciones_docente TEXT,
    embedding vector(1536), -- Vector para vincular con temas del CNB
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mineduc_grado_materia ON public.mineduc_recursos_didacticos(grado_especifico, materia);
CREATE INDEX IF NOT EXISTS idx_mineduc_tipo ON public.mineduc_recursos_didacticos(tipo_recurso);
CREATE INDEX IF NOT EXISTS idx_mineduc_pagina ON public.mineduc_recursos_didacticos(libro_titulo, numero_pagina);

CREATE INDEX IF NOT EXISTS idx_mineduc_vector_hnsw ON public.mineduc_recursos_didacticos 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- 3. Función RAG Híbrida: Busca Indicadores CNB con Ejercicios Asociados
CREATE OR REPLACE FUNCTION public.buscar_cnb_con_ejercicios(
    p_grados INT2[],
    p_materia TEXT,
    p_semana INT2,
    p_query_embedding vector(1536) DEFAULT NULL,
    p_limit INT DEFAULT 5
)
RETURNS TABLE (
    cnb_id UUID,
    grado INT2,
    area_materia TEXT,
    competencia_descripcion TEXT,
    indicador_numero VARCHAR(10),
    indicador_descripcion TEXT,
    temas_declarativos TEXT[],
    libro_titulo TEXT,
    numero_pagina INT2,
    tipo_recurso TEXT,
    enunciado_ejercicio TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id AS cnb_id,
        c.grado,
        c.area_materia,
        c.competencia_descripcion,
        c.indicador_numero,
        c.indicador_descripcion,
        c.temas_declarativos,
        m.libro_titulo,
        m.numero_pagina,
        m.tipo_recurso,
        m.enunciado_ejercicio
    FROM public.cnb_malla_curricular c
    LEFT JOIN LATERAL (
        SELECT r.libro_titulo, r.numero_pagina, r.tipo_recurso, r.enunciado_ejercicio
        FROM public.mineduc_recursos_didacticos r
        WHERE (r.grado_especifico = c.grado OR c.grado = ANY(r.grados_aplicables))
          AND r.materia = c.area_materia
        ORDER BY 
            CASE WHEN p_query_embedding IS NOT NULL 
                 THEN r.embedding <=> p_query_embedding 
                 ELSE RANDOM() 
            END ASC
        LIMIT 2
    ) m ON TRUE
    WHERE c.grado = ANY(p_grados)
      AND (p_materia IS NULL OR c.area_materia = p_materia)
      AND (p_semana IS NULL OR c.semana_sugerida = p_semana)
    ORDER BY c.grado, c.indicador_numero
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;
