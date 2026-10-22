-- ============================================================================
-- MIGRACIÓN 06: EXÁMENES DEL VIERNES, EVALUACIÓN BINARIA (1/0) Y REFUERZOS
-- PLATAFORMA SIDSER
-- ============================================================================

-- 1. Exámenes Semanales Adaptativos (Generados por IA sobre Temas Confirmados)
CREATE TABLE IF NOT EXISTS public.examenes_semanales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    planificacion_id UUID NOT NULL REFERENCES public.planificaciones_semanales(id) ON DELETE CASCADE,
    aula_id UUID NOT NULL REFERENCES public.aulas_multigrado(id) ON DELETE CASCADE,
    docente_id UUID NOT NULL REFERENCES public.perfiles(id) ON DELETE RESTRICT,
    fecha_aplicacion DATE NOT NULL, -- Estimado para día viernes
    titulo TEXT NOT NULL,
    instrucciones TEXT NOT NULL,
    -- Estructura del examen por grado y materia en formato JSON
    -- { grados: [{ grado: 2, preguntas: [{ numero: 1, indicador: '1.1', reactivo: '...', libro_fuente: '...', pagina: 23 }] }] }
    contenido_examen_json JSONB NOT NULL,
    formato_pizarra_resumen TEXT, -- Versión condensada para copiar a la pizarra si no hay impresiones
    aplicado BOOLEAN NOT NULL DEFAULT FALSE,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_examenes_aula ON public.examenes_semanales(aula_id);
CREATE INDEX IF NOT EXISTS idx_examenes_planificacion ON public.examenes_semanales(planificacion_id);

-- 2. Matriz de Evaluación Binaria por Indicador (RF-11, BR-06)
CREATE TABLE IF NOT EXISTS public.evaluaciones_binarias_detalle (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    examen_id UUID NOT NULL REFERENCES public.examenes_semanales(id) ON DELETE CASCADE,
    matricula_id UUID NOT NULL REFERENCES public.matriculas(id) ON DELETE CASCADE,
    indicador_codigo VARCHAR(10) NOT NULL,
    indicador_descripcion TEXT NOT NULL,
    materia TEXT NOT NULL,
    grado INT2 NOT NULL CHECK (grado BETWEEN 1 AND 6),
    -- Valor estrictamente binario: 1 (Alcanzado) o 0 (No alcanzado / En Refuerzo)
    valor_binario INT2 NOT NULL CHECK (valor_binario IN (0, 1)),
    en_refuerzo BOOLEAN GENERATED ALWAYS AS (valor_binario = 0) STORED,
    reevaluado BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_reevaluacion TIMESTAMPTZ DEFAULT NULL,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_evaluacion_matricula_indicador UNIQUE (examen_id, matricula_id, indicador_codigo)
);

CREATE INDEX IF NOT EXISTS idx_eval_binaria_matricula ON public.evaluaciones_binarias_detalle(matricula_id);
CREATE INDEX IF NOT EXISTS idx_eval_binaria_refuerzo ON public.evaluaciones_binarias_detalle(matricula_id, valor_binario);

-- 3. Hojas de Nivelación y Refuerzo Pedagógico (15 Minutos - RF-13)
CREATE TABLE IF NOT EXISTS public.hojas_refuerzo_nivelacion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    examen_id UUID NOT NULL REFERENCES public.examenes_semanales(id) ON DELETE CASCADE,
    aula_id UUID NOT NULL REFERENCES public.aulas_multigrado(id) ON DELETE CASCADE,
    materia TEXT NOT NULL,
    grado INT2 NOT NULL CHECK (grado BETWEEN 1 AND 6),
    indicador_codigo VARCHAR(10) NOT NULL,
    indicador_descripcion TEXT NOT NULL,
    -- Lista de IDs de matrículas de estudiantes que necesitan este refuerzo
    estudiantes_ids UUID[] NOT NULL,
    duracion_estimada_minutos INT2 NOT NULL DEFAULT 15 CHECK (duracion_estimada_minutos <= 20),
    libro_referencia TEXT,
    pagina_referencia INT2,
    guia_actividades_json JSONB NOT NULL, -- 2 o 3 ejercicios focalizados
    completado BOOLEAN NOT NULL DEFAULT FALSE,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hojas_refuerzo_aula ON public.hojas_refuerzo_nivelacion(aula_id);
CREATE INDEX IF NOT EXISTS idx_hojas_refuerzo_indicador ON public.hojas_refuerzo_nivelacion(indicador_codigo);

-- 4. Función Trigger para Recalcular Promedio Dinámico del Estudiante (BR-04)
-- PromedioInicial = 100%, penaliza indicadores con 0 y recupera al reevaluar exitosamente
CREATE OR REPLACE FUNCTION public.recalcular_promedio_estudiante()
RETURNS TRIGGER AS $$
DECLARE
    v_total_evaluados INT;
    v_total_alcanzados INT;
    v_nuevo_promedio NUMERIC(5,2);
    v_matricula_id UUID;
BEGIN
    v_matricula_id := COALESCE(NEW.matricula_id, OLD.matricula_id);
    
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE valor_binario = 1)
    INTO v_total_evaluados, v_total_alcanzados
    FROM public.evaluaciones_binarias_detalle
    WHERE matricula_id = v_matricula_id;
    
    IF v_total_evaluados = 0 THEN
        v_nuevo_promedio := 100.00;
    ELSE
        -- Cálculo ponderado sobre base 100
        v_nuevo_promedio := ROUND((v_total_alcanzados::NUMERIC / v_total_evaluados::NUMERIC) * 100.00, 2);
    END IF;
    
    UPDATE public.matriculas
    SET promedio_actual = v_nuevo_promedio,
        actualizado_en = NOW()
    WHERE id = v_matricula_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_recalcular_promedio
AFTER INSERT OR UPDATE OR DELETE ON public.evaluaciones_binarias_detalle
FOR EACH ROW EXECUTE FUNCTION public.recalcular_promedio_estudiante();
