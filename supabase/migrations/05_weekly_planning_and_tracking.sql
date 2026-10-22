-- ============================================================================
-- MIGRACIÓN 05: PLANIFICACIÓN SEMANAL MULTIGRADO, ASISTENCIA Y COBERTURA (JUEVES)
-- PLATAFORMA SIDSER
-- ============================================================================

-- 1. Cabecera de Planificación Semanal Multigrado
CREATE TABLE IF NOT EXISTS public.planificaciones_semanales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aula_id UUID NOT NULL REFERENCES public.aulas_multigrado(id) ON DELETE CASCADE,
    docente_id UUID NOT NULL REFERENCES public.perfiles(id) ON DELETE RESTRICT,
    ciclo_lectivo_id UUID NOT NULL REFERENCES public.ciclos_lectivos(id) ON DELETE CASCADE,
    semana_numero INT2 NOT NULL CHECK (semana_numero BETWEEN 1 AND 40),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    grados_incluidos INT2[] NOT NULL,
    materias_incluidas TEXT[] NOT NULL,
    -- Estructura detallada en JSONB para la matriz de horarios simultáneos
    -- [{ dia: 'Lunes', bloques: [{ horario: '08:00-08:45', grado_2: { tipo: 'directa', tema: '...', indicador: '...' }, grado_3: { tipo: 'autonomo', libro: '...', pagina: 45, ejercicio: '...' } }] }]
    matriz_horaria_json JSONB NOT NULL,
    -- Rutas de lectura y aprendizaje en casa sugeridas por MINEDUC
    ruta_aprendizaje_casa_json JSONB DEFAULT '[]',
    pdf_url TEXT DEFAULT NULL, -- URL si se exporta y almacena en Supabase Storage
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_aula_semana UNIQUE (aula_id, semana_numero, ciclo_lectivo_id)
);

CREATE INDEX IF NOT EXISTS idx_planif_aula_semana ON public.planificaciones_semanales(aula_id, semana_numero);
CREATE INDEX IF NOT EXISTS idx_planif_docente ON public.planificaciones_semanales(docente_id);

-- 2. Detalle de Temas Planificados y Marcaje de Cobertura (Checklist de Jueves Noche - RF-09)
CREATE TABLE IF NOT EXISTS public.planificacion_temas_cobertura (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    planificacion_id UUID NOT NULL REFERENCES public.planificaciones_semanales(id) ON DELETE CASCADE,
    cnb_malla_id UUID REFERENCES public.cnb_malla_curricular(id) ON DELETE SET NULL,
    grado INT2 NOT NULL CHECK (grado BETWEEN 1 AND 6),
    materia TEXT NOT NULL,
    tema_nombre TEXT NOT NULL,
    indicador_codigo VARCHAR(10) NOT NULL,
    indicador_descripcion TEXT NOT NULL,
    -- Estado de confirmación al cierre de jueves: por defecto TRUE (impartido), el maestro desmarca lo omitido
    efectivamente_impartido BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_confirmacion TIMESTAMPTZ DEFAULT NULL,
    motivo_omision TEXT DEFAULT NULL, -- Si se desmarca: "Falta de tiempo", "Actividad escolar imprevista", etc.
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cobertura_planificacion ON public.planificacion_temas_cobertura(planificacion_id);
CREATE INDEX IF NOT EXISTS idx_cobertura_impartido ON public.planificacion_temas_cobertura(planificacion_id, efectivamente_impartido);

-- 3. Control Diario de Asistencia y Cumplimiento de Tareas (RF-08, BR-03)
CREATE TABLE IF NOT EXISTS public.asistencia_diaria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    matricula_id UUID NOT NULL REFERENCES public.matriculas(id) ON DELETE CASCADE,
    aula_id UUID NOT NULL REFERENCES public.aulas_multigrado(id) ON DELETE CASCADE,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    asistio BOOLEAN NOT NULL DEFAULT TRUE,
    retraso BOOLEAN NOT NULL DEFAULT FALSE,
    tarea_entregada BOOLEAN NOT NULL DEFAULT TRUE,
    participacion_destacada BOOLEAN NOT NULL DEFAULT FALSE,
    observacion_docente TEXT DEFAULT NULL,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_asistencia_estudiante_fecha UNIQUE (matricula_id, fecha)
);

CREATE INDEX IF NOT EXISTS idx_asistencia_aula_fecha ON public.asistencia_diaria(aula_id, fecha);
CREATE INDEX IF NOT EXISTS idx_asistencia_matricula ON public.asistencia_diaria(matricula_id);
