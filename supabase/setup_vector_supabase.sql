-- ==============================================================================
-- CONFIGURACIÓN DE BASE DE DATOS VECTORIAL EN SUPABASE (PGVECTOR + GEMINI EMBEDDINGS)
-- PLATAFORMA SIDSER — LIBROS OFICIALES MINEDUC Y MALLA CNB (GUATEMALA)
-- Basado en la documentación oficial de Supabase AI: https://supabase.com/docs/guides/ai
-- ==============================================================================

-- 1. Habilitar la extensión pgvector
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- Asegurar tipo ciclo_educativo si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ciclo_educativo') THEN
        CREATE TYPE ciclo_educativo AS ENUM ('primer_ciclo', 'segundo_ciclo');
    END IF;
END$$;

-- 2. Tabla Malla Curricular CNB con Vector de 768 dimensiones (Google Gemini text-embedding-004)
CREATE TABLE IF NOT EXISTS public.cnb_malla_curricular (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grado INT2 NOT NULL CHECK (grado BETWEEN 1 AND 6),
    ciclo ciclo_educativo NOT NULL,
    area_materia TEXT NOT NULL,
    bloque_bimestre INT2 NOT NULL CHECK (bloque_bimestre BETWEEN 1 AND 4),
    semana_sugerida INT2 CHECK (semana_sugerida BETWEEN 1 AND 40),
    competencia_numero INT2 NOT NULL,
    competencia_descripcion TEXT NOT NULL,
    indicador_numero VARCHAR(10) NOT NULL,
    indicador_descripcion TEXT NOT NULL,
    temas_declarativos TEXT[] DEFAULT '{}',
    criterios_evaluacion TEXT,
    embedding extensions.vector(768), -- Embedding nativo Google Gemini text-embedding-004
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Si la tabla ya existía con 1536 dimensiones, migrarla a 768 dimensiones
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'cnb_malla_curricular' 
          AND column_name = 'embedding'
          AND udt_name = 'vector'
    ) THEN
        ALTER TABLE public.cnb_malla_curricular ALTER COLUMN embedding TYPE extensions.vector(768);
    END IF;
EXCEPTION WHEN OTHERS THEN
    -- Si falla por datos existentes incompatibles, recrear columna
    ALTER TABLE public.cnb_malla_curricular DROP COLUMN IF EXISTS embedding;
    ALTER TABLE public.cnb_malla_curricular ADD COLUMN embedding extensions.vector(768);
END$$;

-- 3. Tabla Recursos Didácticos y Ejercicios Oficiales MINEDUC (1.º a 6.º Primaria)
CREATE TABLE IF NOT EXISTS public.mineduc_recursos_didacticos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    libro_titulo TEXT NOT NULL,
    archivo_fuente TEXT,
    grado_especifico INT2 CHECK (grado_especifico BETWEEN 1 AND 6),
    grados_aplicables INT2[] DEFAULT '{}',
    ciclo ciclo_educativo NOT NULL,
    materia TEXT NOT NULL,
    numero_pagina INT2 NOT NULL CHECK (numero_pagina > 0),
    total_paginas_libro INT2,
    seccion_unidad TEXT,
    tipo_recurso TEXT NOT NULL DEFAULT 'ejercicio_estudiante' CHECK (tipo_recurso IN (
        'ejercicio_estudiante',
        'evaluacion_cierre',
        'lectura_autonoma_casa',
        'actividad_manipulable',
        'guia_docente_ejemplo'
    )),
    enunciado_ejercicio TEXT NOT NULL,
    instrucciones_docente TEXT,
    texto_completo TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    embedding extensions.vector(768), -- Embedding nativo Google Gemini text-embedding-004
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Si la tabla ya existía con 1536 dimensiones, migrarla a 768 dimensiones
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'mineduc_recursos_didacticos' 
          AND column_name = 'embedding'
          AND udt_name = 'vector'
    ) THEN
        ALTER TABLE public.mineduc_recursos_didacticos ALTER COLUMN embedding TYPE extensions.vector(768);
    END IF;
EXCEPTION WHEN OTHERS THEN
    ALTER TABLE public.mineduc_recursos_didacticos DROP COLUMN IF EXISTS embedding;
    ALTER TABLE public.mineduc_recursos_didacticos ADD COLUMN embedding extensions.vector(768);
END$$;

-- 4. Índices Vectoriales HNSW (Recomendación oficial de Supabase frente a IVFFlat)
-- HNSW ofrece mejor recall, no requiere reentrenamiento de clusters y es óptimo para producción
DROP INDEX IF EXISTS public.idx_cnb_vector_hnsw;
CREATE INDEX idx_cnb_vector_hnsw ON public.cnb_malla_curricular 
USING hnsw (embedding extensions.vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

DROP INDEX IF EXISTS public.idx_mineduc_vector_hnsw;
CREATE INDEX idx_mineduc_vector_hnsw ON public.mineduc_recursos_didacticos 
USING hnsw (embedding extensions.vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Índices relacionales para filtros de metadatos (pre-filtering recomendado por Supabase)
CREATE INDEX IF NOT EXISTS idx_cnb_grado_materia ON public.cnb_malla_curricular(grado, area_materia);
CREATE INDEX IF NOT EXISTS idx_cnb_bloque_semana ON public.cnb_malla_curricular(bloque_bimestre, semana_sugerida);
CREATE INDEX IF NOT EXISTS idx_mineduc_grado_materia ON public.mineduc_recursos_didacticos(grado_especifico, materia);
CREATE INDEX IF NOT EXISTS idx_mineduc_pagina ON public.mineduc_recursos_didacticos(libro_titulo, numero_pagina);
CREATE INDEX IF NOT EXISTS idx_mineduc_metadata ON public.mineduc_recursos_didacticos USING gin (metadata);

-- 5. Función RPC Oficial para Búsqueda Semántica de Ejercicios MINEDUC
-- Incorpora filtrado de metadatos (grado, materia, página) DENTRO de la consulta para máximo rendimiento
CREATE OR REPLACE FUNCTION public.buscar_recursos_mineduc(
    query_embedding extensions.vector(768),
    match_threshold FLOAT DEFAULT 0.50,
    match_count INT DEFAULT 10,
    filter_grado INT DEFAULT NULL,
    filter_materia TEXT DEFAULT NULL,
    filter_pagina INT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    libro_titulo TEXT,
    grado_especifico INT2,
    materia TEXT,
    numero_pagina INT2,
    seccion_unidad TEXT,
    tipo_recurso TEXT,
    enunciado_ejercicio TEXT,
    instrucciones_docente TEXT,
    similarity FLOAT
)
LANGUAGE sql STABLE
AS $$
    SELECT
        m.id,
        m.libro_titulo,
        m.grado_especifico,
        m.materia,
        m.numero_pagina,
        m.seccion_unidad,
        m.tipo_recurso,
        m.enunciado_ejercicio,
        m.instrucciones_docente,
        1 - (m.embedding <=> query_embedding) AS similarity
    FROM public.mineduc_recursos_didacticos m
    WHERE
        -- Filtro por grado escolar
        (filter_grado IS NULL OR m.grado_especifico = filter_grado OR filter_grado = ANY(m.grados_aplicables))
        -- Filtro por materia curricular
        AND (filter_materia IS NULL OR m.materia ILIKE '%' || filter_materia || '%')
        -- Filtro opcional por cercanía de página (+/- 4 páginas para encontrar la lección)
        AND (filter_pagina IS NULL OR ABS(m.numero_pagina - filter_pagina) <= 4)
        -- Umbral de similitud de coseno
        AND (query_embedding IS NULL OR 1 - (m.embedding <=> query_embedding) > match_threshold)
    ORDER BY
        -- Si hay página exacta o cercana, ponderar proximidad y similitud
        CASE WHEN query_embedding IS NOT NULL THEN (m.embedding <=> query_embedding) END ASC,
        CASE WHEN filter_pagina IS NOT NULL THEN ABS(m.numero_pagina - filter_pagina) END ASC
    LIMIT LEAST(match_count, 100);
$$;

-- 6. Función RPC Oficial para Búsqueda Semántica en la Malla CNB
CREATE OR REPLACE FUNCTION public.buscar_cnb_competencias(
    query_embedding extensions.vector(768),
    match_threshold FLOAT DEFAULT 0.50,
    match_count INT DEFAULT 5,
    filter_grado INT DEFAULT NULL,
    filter_materia TEXT DEFAULT NULL,
    filter_bloque INT DEFAULT NULL,
    filter_semana INT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    grado INT2,
    area_materia TEXT,
    bloque_bimestre INT2,
    semana_sugerida INT2,
    competencia_numero INT2,
    competencia_descripcion TEXT,
    indicador_numero VARCHAR(10),
    indicador_descripcion TEXT,
    temas_declarativos TEXT[],
    criterios_evaluacion TEXT,
    similarity FLOAT
)
LANGUAGE sql STABLE
AS $$
    SELECT
        c.id,
        c.grado,
        c.area_materia,
        c.bloque_bimestre,
        c.semana_sugerida,
        c.competencia_numero,
        c.competencia_descripcion,
        c.indicador_numero,
        c.indicador_descripcion,
        c.temas_declarativos,
        c.criterios_evaluacion,
        1 - (c.embedding <=> query_embedding) AS similarity
    FROM public.cnb_malla_curricular c
    WHERE
        (filter_grado IS NULL OR c.grado = filter_grado)
        AND (filter_materia IS NULL OR c.area_materia ILIKE '%' || filter_materia || '%')
        AND (filter_bloque IS NULL OR c.bloque_bimestre = filter_bloque)
        AND (filter_semana IS NULL OR c.semana_sugerida = filter_semana)
        AND (query_embedding IS NULL OR 1 - (c.embedding <=> query_embedding) > match_threshold)
    ORDER BY
        (c.embedding <=> query_embedding) ASC
    LIMIT LEAST(match_count, 50);
$$;

-- Permisos de lectura pública / anónima para consumo desde la plataforma
GRANT EXECUTE ON FUNCTION public.buscar_recursos_mineduc TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.buscar_cnb_competencias TO anon, authenticated, service_role;
