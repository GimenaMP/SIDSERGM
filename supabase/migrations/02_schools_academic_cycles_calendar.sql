-- ============================================================================
-- MIGRACIÓN 02: ESCUELAS, CICLOS ESCOLARES, SECCIONES Y CALENDARIO
-- PLATAFORMA SIDSER
-- ============================================================================

-- 1. Escuelas Rurales
CREATE TABLE IF NOT EXISTS public.escuelas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_udi VARCHAR(30) UNIQUE NOT NULL, -- Código único de establecimiento MINEDUC
    nombre TEXT NOT NULL,
    departamento TEXT NOT NULL DEFAULT 'Guatemala',
    municipio TEXT NOT NULL,
    aldea_comunidad TEXT,
    sector TEXT NOT NULL DEFAULT 'Oficial Rural',
    director_id UUID REFERENCES public.perfiles(id) ON DELETE SET NULL,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_escuelas_director ON public.escuelas(director_id);
CREATE INDEX IF NOT EXISTS idx_escuelas_municipio ON public.escuelas(departamento, municipio);

-- 2. Ciclo Lectivo Anual
CREATE TABLE IF NOT EXISTS public.ciclos_lectivos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    escuela_id UUID NOT NULL REFERENCES public.escuelas(id) ON DELETE CASCADE,
    anio_escolar INT2 NOT NULL CHECK (anio_escolar BETWEEN 2020 AND 2050),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_fechas_ciclo CHECK (fecha_fin > fecha_inicio),
    CONSTRAINT uq_escuela_anio UNIQUE (escuela_id, anio_escolar)
);

CREATE INDEX IF NOT EXISTS idx_ciclos_escuela_activo ON public.ciclos_lectivos(escuela_id, activo);

-- 3. Aulas / Secciones Multigrado
CREATE TABLE IF NOT EXISTS public.aulas_multigrado (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    escuela_id UUID NOT NULL REFERENCES public.escuelas(id) ON DELETE CASCADE,
    ciclo_lectivo_id UUID NOT NULL REFERENCES public.ciclos_lectivos(id) ON DELETE CASCADE,
    nombre_aula VARCHAR(50) NOT NULL, -- Ej: "Aula Multigrado A (1ro a 3ro)", "Escuela Unitaria"
    docente_id UUID NOT NULL REFERENCES public.perfiles(id) ON DELETE RESTRICT,
    grados_atendidos INT2[] NOT NULL, -- Ej: ARRAY[1, 2, 3] o ARRAY[4, 5, 6] (1 al 6)
    activa BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_aulas_docente ON public.aulas_multigrado(docente_id);
CREATE INDEX IF NOT EXISTS idx_aulas_ciclo ON public.aulas_multigrado(ciclo_lectivo_id);

-- 4. Calendario Escolar y Días Inhábiles (Feriados MINEDUC y Actividades Locales)
CREATE TABLE IF NOT EXISTS public.calendario_escolar_dias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ciclo_lectivo_id UUID NOT NULL REFERENCES public.ciclos_lectivos(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    tipo tipo_dia_calendario NOT NULL DEFAULT 'asueto_oficial',
    descripcion TEXT NOT NULL, -- Ej: "Semana Santa", "Feria Patronal de la Aldea", "Entrega de Alimentación Escolar"
    es_habil BOOLEAN NOT NULL DEFAULT FALSE,
    creado_por UUID REFERENCES public.perfiles(id),
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_ciclo_fecha UNIQUE (ciclo_lectivo_id, fecha)
);

CREATE INDEX IF NOT EXISTS idx_calendario_ciclo_fecha ON public.calendario_escolar_dias(ciclo_lectivo_id, fecha);
CREATE INDEX IF NOT EXISTS idx_calendario_habil ON public.calendario_escolar_dias(ciclo_lectivo_id, es_habil);
