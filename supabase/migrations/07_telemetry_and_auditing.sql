-- ============================================================================
-- MIGRACIÓN 07: TELEMETRÍA DE TOKENS, AUDITORÍA DE NOTAS Y PURGA CON BACKUP DRIVE
-- PLATAFORMA SIDSER
-- ============================================================================

-- 1. Registro de Telemetría de Tokens de Google Gemini (RF-20, RF-21, RF-22)
CREATE TABLE IF NOT EXISTS public.telemetria_tokens_ia (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES public.perfiles(id) ON DELETE SET NULL,
    operacion TEXT NOT NULL, -- 'planificacion_semanal', 'generacion_examen', 'hoja_refuerzo'
    modelo TEXT NOT NULL DEFAULT 'gemini-3.8-flash',
    prompt_tokens INT NOT NULL,
    completion_tokens INT NOT NULL,
    total_tokens INT GENERATED ALWAYS AS (prompt_tokens + completion_tokens) STORED,
    latencia_ms INT NOT NULL,
    alerta_cuota_80 BOOLEAN NOT NULL DEFAULT FALSE,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_telemetria_fecha ON public.telemetria_tokens_ia(creado_en);
CREATE INDEX IF NOT EXISTS idx_telemetria_usuario ON public.telemetria_tokens_ia(usuario_id);

-- 2. Auditoría Inmutable de Modificaciones de Nota y Promoción (BR-07, RF-15)
-- Registra cambios justificados por el docente a la condición final sin alterar el promedio calculado
CREATE TABLE IF NOT EXISTS public.auditoria_modificaciones_promocion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    matricula_id UUID NOT NULL REFERENCES public.matriculas(id) ON DELETE CASCADE,
    docente_id UUID NOT NULL REFERENCES public.perfiles(id) ON DELETE RESTRICT,
    promedio_original NUMERIC(5,2) NOT NULL,
    condicion_previa estado_promocion,
    nueva_condicion estado_promocion NOT NULL,
    motivo_justificacion TEXT NOT NULL, -- Razón oficial (ej. Aprobó prueba de recuperación externa supervisada por CTA)
    documento_soporte_url TEXT,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_auditoria_matricula ON public.auditoria_modificaciones_promocion(matricula_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_docente ON public.auditoria_modificaciones_promocion(docente_id);

-- 3. Solicitudes de Purga de Alumnos con Resguardo Obligatorio en Drive (BR-09, RF-19, RF-23)
CREATE TABLE IF NOT EXISTS public.solicitudes_purga_datos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    escuela_id UUID NOT NULL REFERENCES public.escuelas(id) ON DELETE CASCADE,
    solicitante_id UUID NOT NULL REFERENCES public.perfiles(id) ON DELETE RESTRICT, -- Director solicitante
    administrador_id UUID REFERENCES public.perfiles(id) ON DELETE SET NULL, -- Administrador aprobador
    archivo_excel_solicitud_url TEXT NOT NULL,
    estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'backup_generado', 'completada', 'rechazada')),
    -- Resguardo obligatorio antes de purga
    backup_csv_drive_url TEXT DEFAULT NULL,
    backup_fecha TIMESTAMPTZ DEFAULT NULL,
    total_estudiantes_afectados INT DEFAULT 0,
    observaciones TEXT,
    fecha_solicitud TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fecha_ejecucion TIMESTAMPTZ DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_purga_escuela ON public.solicitudes_purga_datos(escuela_id);
CREATE INDEX IF NOT EXISTS idx_purga_estado ON public.solicitudes_purga_datos(estado);
