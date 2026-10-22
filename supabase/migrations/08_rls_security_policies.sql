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
