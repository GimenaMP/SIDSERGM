-- ============================================================================
-- MIGRACIÓN 03: ESTUDIANTES, INSCRIPCIONES Y TRANSFERENCIA DE DEFICIENCIAS
-- PLATAFORMA SIDSER
-- ============================================================================

-- 1. Catálogo Maestro de Estudiantes
CREATE TABLE IF NOT EXISTS public.estudiantes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cui VARCHAR(13) NOT NULL UNIQUE, -- Código Único de Identificación
    codigo_personal VARCHAR(20), -- Código personal del estudiante MINEDUC
    nombres TEXT NOT NULL,
    apellidos TEXT NOT NULL,
    genero CHAR(1) CHECK (genero IN ('M', 'F')),
    fecha_nacimiento DATE,
    -- Hashing anónimo para RNF-01 (IA Segura sin PII)
    hash_identificador TEXT NOT NULL UNIQUE,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_estudiantes_cui ON public.estudiantes(cui);
CREATE INDEX IF NOT EXISTS idx_estudiantes_hash ON public.estudiantes(hash_identificador);
CREATE INDEX IF NOT EXISTS idx_estudiantes_apellidos_nombres ON public.estudiantes(apellidos, nombres);

-- Trigger para generar hash anónimo automáticamente si no se provee
CREATE OR REPLACE FUNCTION public.generar_hash_estudiante()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.hash_identificador IS NULL OR NEW.hash_identificador = '' THEN
        NEW.hash_identificador := encode(digest(NEW.cui || 'SIDSER_SALT_2026', 'sha256'), 'hex');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_estudiante_hash
BEFORE INSERT ON public.estudiantes
FOR EACH ROW EXECUTE FUNCTION public.generar_hash_estudiante();

-- 2. Matrícula / Asignación a Grado y Aula Multigrado
CREATE TABLE IF NOT EXISTS public.matriculas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estudiante_id UUID NOT NULL REFERENCES public.estudiantes(id) ON DELETE CASCADE,
    aula_id UUID NOT NULL REFERENCES public.aulas_multigrado(id) ON DELETE CASCADE,
    ciclo_lectivo_id UUID NOT NULL REFERENCES public.ciclos_lectivos(id) ON DELETE CASCADE,
    grado INT2 NOT NULL CHECK (grado BETWEEN 1 AND 6),
    clave INT2 NOT NULL CHECK (clave > 0),
    estado estado_matricula NOT NULL DEFAULT 'activo',
    promedio_actual NUMERIC(5,2) NOT NULL DEFAULT 100.00 CHECK (promedio_actual BETWEEN 0.00 AND 100.00),
    promocion_estado estado_promocion DEFAULT NULL,
    justificacion_promocion TEXT DEFAULT NULL,
    fecha_inscripcion DATE NOT NULL DEFAULT CURRENT_DATE,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_matricula_estudiante_ciclo UNIQUE (estudiante_id, ciclo_lectivo_id),
    CONSTRAINT uq_aula_grado_clave UNIQUE (aula_id, grado, clave)
);

CREATE INDEX IF NOT EXISTS idx_matriculas_aula ON public.matriculas(aula_id);
CREATE INDEX IF NOT EXISTS idx_matriculas_grado ON public.matriculas(grado);
CREATE INDEX IF NOT EXISTS idx_matriculas_estudiante ON public.matriculas(estudiante_id);
CREATE INDEX IF NOT EXISTS idx_matriculas_estado ON public.matriculas(estado);

-- 3. Historial Inmutable de Deficiencias y Vacíos Curriculares (BR-08)
-- Permite que el docente del año siguiente conozca exactamente qué competencias e indicadores no fueron alcanzados
CREATE TABLE IF NOT EXISTS public.historial_deficiencias_acumuladas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estudiante_id UUID NOT NULL REFERENCES public.estudiantes(id) ON DELETE CASCADE,
    ciclo_origen_id UUID NOT NULL REFERENCES public.ciclos_lectivos(id) ON DELETE CASCADE,
    grado_origen INT2 NOT NULL CHECK (grado_origen BETWEEN 1 AND 6),
    materia TEXT NOT NULL,
    indicador_logro_codigo TEXT NOT NULL,
    indicador_logro_descripcion TEXT NOT NULL,
    competencia_descripcion TEXT,
    fecha_registro TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    subsanado BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_subsanado TIMESTAMPTZ DEFAULT NULL,
    docente_evaluador_id UUID REFERENCES public.perfiles(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_deficiencias_estudiante ON public.historial_deficiencias_acumuladas(estudiante_id);
CREATE INDEX IF NOT EXISTS idx_deficiencias_subsanado ON public.historial_deficiencias_acumuladas(estudiante_id, subsanado);
