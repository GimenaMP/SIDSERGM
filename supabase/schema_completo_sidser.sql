-- ============================================================================
-- MIGRACIÓN 01: EXTENSIONES, TIPOS ENUM Y PERFILES DE USUARIO (RBAC)
-- PLATAFORMA SIDSER (Sistema Inteligente de Diagnóstico y Seguimiento Educativo Rural)
-- ============================================================================

-- 1. Extensiones requeridas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. Tipos ENUM del Negocio
CREATE TYPE rol_usuario AS ENUM ('profesor', 'director', 'administrador');

CREATE TYPE ciclo_educativo AS ENUM ('primer_ciclo', 'segundo_ciclo');

CREATE TYPE estado_matricula AS ENUM ('activo', 'retirado', 'trasladado', 'promovido', 'no_promovido');

CREATE TYPE tipo_dia_calendario AS ENUM ('habil', 'asueto_oficial', 'actividad_escolar', 'suspension_autorizada');

CREATE TYPE estado_tema_cobertura AS ENUM ('no_iniciado', 'en_proceso', 'impartido', 'reprogramado');

CREATE TYPE resultado_binario AS ENUM ('alcanzado', 'no_alcanzado');

CREATE TYPE estado_promocion AS ENUM ('aprobado_automatico', 'aprobado_modificado', 'reprobado');

-- 3. Tabla de Perfiles de Usuario (Vinculada a auth.users de Supabase)
CREATE TABLE IF NOT EXISTS public.perfiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    nombres TEXT NOT NULL,
    apellidos TEXT NOT NULL,
    cui VARCHAR(13) UNIQUE,
    telefono VARCHAR(15),
    rol rol_usuario NOT NULL DEFAULT 'profesor',
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_perfiles_rol ON public.perfiles(rol);
CREATE INDEX IF NOT EXISTS idx_perfiles_activo ON public.perfiles(activo);

-- Función para actualizar timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_perfiles_updated_at
BEFORE UPDATE ON public.perfiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Función de conveniencia para verificar rol actual
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS rol_usuario AS $$
    SELECT rol FROM public.perfiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;
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
-- ============================================================================
-- MIGRACIÓN 08: POLÍTICAS DE ROW LEVEL SECURITY (RLS) Y AISLAMIENTO DE ROLES
-- PLATAFORMA SIDSER
-- ============================================================================

-- 1. Habilitar RLS en todas las tablas
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escuelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ciclos_lectivos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aulas_multigrado ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendario_escolar_dias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estudiantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matriculas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historial_deficiencias_acumuladas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cnb_malla_curricular ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mineduc_recursos_didacticos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planificaciones_semanales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planificacion_temas_cobertura ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asistencia_diaria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.examenes_semanales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluaciones_binarias_detalle ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hojas_refuerzo_nivelacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetria_tokens_ia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auditoria_modificaciones_promocion ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitudes_purga_datos ENABLE ROW LEVEL SECURITY;

-- 2. Funciones auxiliares optimizadas para RLS (Evitan recursión y fugas de contexto)
CREATE OR REPLACE FUNCTION public.es_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.perfiles 
        WHERE id = (SELECT auth.uid()) AND rol = 'administrador' AND activo = TRUE
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.es_director_de_escuela(p_escuela_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.escuelas 
        WHERE id = p_escuela_id AND director_id = (SELECT auth.uid())
    ) OR public.es_admin();
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.es_docente_de_aula(p_aula_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.aulas_multigrado 
        WHERE id = p_aula_id AND docente_id = (SELECT auth.uid())
    ) OR public.es_admin();
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- ============================================================================
-- 3. POLÍTICAS POR TABLA
-- ============================================================================

-- PERFILES
CREATE POLICY "Usuarios ven su propio perfil" ON public.perfiles
    FOR SELECT TO authenticated USING (id = (SELECT auth.uid()) OR public.es_admin());

CREATE POLICY "Admin gestiona perfiles" ON public.perfiles
    FOR ALL TO authenticated USING (public.es_admin());

-- CNB Y RECURSOS MINEDUC (Lectura para cualquier docente o usuario autenticado)
CREATE POLICY "Lectura de CNB para autenticados" ON public.cnb_malla_curricular
    FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "Lectura de MINEDUC para autenticados" ON public.mineduc_recursos_didacticos
    FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "Admin gestiona CNB y MINEDUC" ON public.cnb_malla_curricular
    FOR ALL TO authenticated USING (public.es_admin());

CREATE POLICY "Admin gestiona recursos MINEDUC" ON public.mineduc_recursos_didacticos
    FOR ALL TO authenticated USING (public.es_admin());

-- ESCUELAS Y CICLOS
CREATE POLICY "Docentes y Directores ven su escuela" ON public.escuelas
    FOR SELECT TO authenticated USING (
        director_id = (SELECT auth.uid()) 
        OR id IN (SELECT escuela_id FROM public.aulas_multigrado WHERE docente_id = (SELECT auth.uid()))
        OR public.es_admin()
    );

CREATE POLICY "Director o Admin gestiona escuela" ON public.escuelas
    FOR UPDATE TO authenticated USING (public.es_director_de_escuela(id));

CREATE POLICY "Ver ciclos lectivos" ON public.ciclos_lectivos
    FOR SELECT TO authenticated USING (TRUE);

-- AULAS MULTIGRADO (Asignación exclusiva del Director - RF-16)
CREATE POLICY "Docente ve sus aulas asignadas" ON public.aulas_multigrado
    FOR SELECT TO authenticated USING (
        docente_id = (SELECT auth.uid()) 
        OR public.es_director_de_escuela(escuela_id)
    );

CREATE POLICY "Director asigna aulas a docentes" ON public.aulas_multigrado
    FOR ALL TO authenticated USING (public.es_director_de_escuela(escuela_id));

-- ESTUDIANTES Y MATRÍCULAS
CREATE POLICY "Docente y Director ven estudiantes de su aula" ON public.matriculas
    FOR SELECT TO authenticated USING (
        public.es_docente_de_aula(aula_id) 
        OR public.es_admin()
    );

CREATE POLICY "Docente inscribe o edita en su aula" ON public.matriculas
    FOR ALL TO authenticated USING (public.es_docente_de_aula(aula_id));

CREATE POLICY "Ver catalogo de estudiantes vinculados" ON public.estudiantes
    FOR SELECT TO authenticated USING (
        id IN (SELECT estudiante_id FROM public.matriculas WHERE public.es_docente_de_aula(aula_id))
        OR public.es_admin()
    );

CREATE POLICY "Insertar estudiantes" ON public.estudiantes
    FOR INSERT TO authenticated WITH CHECK (TRUE);

-- PLANIFICACIONES SEMANALES Y COBERTURA
CREATE POLICY "Docente gestiona sus planificaciones" ON public.planificaciones_semanales
    FOR ALL TO authenticated USING (
        docente_id = (SELECT auth.uid()) 
        OR public.es_admin()
    );

CREATE POLICY "Director consulta planificaciones para KPIs" ON public.planificaciones_semanales
    FOR SELECT TO authenticated USING (
        aula_id IN (SELECT id FROM public.aulas_multigrado WHERE public.es_director_de_escuela(escuela_id))
    );

CREATE POLICY "Gestion de cobertura semanal" ON public.planificacion_temas_cobertura
    FOR ALL TO authenticated USING (
        planificacion_id IN (SELECT id FROM public.planificaciones_semanales WHERE docente_id = (SELECT auth.uid()))
        OR public.es_admin()
    );

-- ASISTENCIA DIARIA
CREATE POLICY "Docente gestiona asistencia de su aula" ON public.asistencia_diaria
    FOR ALL TO authenticated USING (
        public.es_docente_de_aula(aula_id) 
        OR public.es_admin()
    );

-- EXÁMENES, EVALUACIONES BINARIAS Y HOJAS DE REFUERZO
CREATE POLICY "Docente gestiona examenes" ON public.examenes_semanales
    FOR ALL TO authenticated USING (
        docente_id = (SELECT auth.uid()) 
        OR public.es_admin()
    );

CREATE POLICY "Docente califica notas binarias" ON public.evaluaciones_binarias_detalle
    FOR ALL TO authenticated USING (
        examen_id IN (SELECT id FROM public.examenes_semanales WHERE docente_id = (SELECT auth.uid()))
        OR public.es_admin()
    );

CREATE POLICY "Docente gestiona hojas de refuerzo" ON public.hojas_refuerzo_nivelacion
    FOR ALL TO authenticated USING (
        public.es_docente_de_aula(aula_id) 
        OR public.es_admin()
    );

-- TELEMETRÍA, AUDITORÍA Y PURGAS
CREATE POLICY "Solo admin ve telemetria de tokens" ON public.telemetria_tokens_ia
    FOR ALL TO authenticated USING (public.es_admin());

CREATE POLICY "Docente registra justificaciones de nota" ON public.auditoria_modificaciones_promocion
    FOR INSERT TO authenticated WITH CHECK (docente_id = (SELECT auth.uid()));

CREATE POLICY "Director y admin ven auditorias" ON public.auditoria_modificaciones_promocion
    FOR SELECT TO authenticated USING (
        public.es_admin() 
        OR docente_id = (SELECT auth.uid())
    );

CREATE POLICY "Director solicita purga y Admin ejecuta" ON public.solicitudes_purga_datos
    FOR ALL TO authenticated USING (
        solicitante_id = (SELECT auth.uid()) 
        OR public.es_admin()
    );
