-- ============================================================================
-- MIGRACIÓN 09: TABLA MAESTRA DE ROLES, PERMISOS Y CONTROL DE ACTIVACIÓN/INHABILITACIÓN
-- PLATAFORMA SIDSER
-- ============================================================================

-- 1. Tabla Maestra de Roles
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_rol VARCHAR(30) UNIQUE NOT NULL, -- 'profesor', 'director', 'administrador'
    etiqueta TEXT NOT NULL, -- 'Profesor / Docente Rural', 'Director de Establecimiento', 'Administrador del Sistema'
    descripcion TEXT NOT NULL,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insertar roles iniciales
INSERT INTO public.roles (nombre_rol, etiqueta, descripcion) VALUES
('administrador', 'Administrador del Sistema', 'Acceso global técnico, creación/inhabilitación de cuentas, monitoreo de cuotas y purgas.'),
('director', 'Director de Establecimiento', 'Gestión escolar, asignación exclusiva de grados a docentes, KPIs institucionales.'),
('profesor', 'Profesor / Docente', 'Planificación semanal multigrado, asistencia, exámenes, evaluación binaria 1/0 y refuerzos.')
ON CONFLICT (nombre_rol) DO UPDATE 
SET etiqueta = EXCLUDED.etiqueta, descripcion = EXCLUDED.descripcion;

-- 2. Tabla de Permisos Granulares del Sistema
CREATE TABLE IF NOT EXISTS public.permisos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_permiso VARCHAR(50) UNIQUE NOT NULL,
    modulo VARCHAR(30) NOT NULL, -- 'usuarios', 'grados', 'planificacion', 'evaluaciones', 'purga'
    descripcion TEXT NOT NULL
);

INSERT INTO public.permisos (codigo_permiso, modulo, descripcion) VALUES
('usuarios.crear', 'usuarios', 'Crear cuentas de docentes y directores'),
('usuarios.inhabilitar', 'usuarios', 'Activar o desactivar usuarios del sistema'),
('grados.asignar', 'grados', 'Asignar grados y secciones a docentes'),
('planificacion.crear', 'planificacion', 'Generar planificaciones semanales multigrado'),
('evaluacion.calificar', 'evaluaciones', 'Ingresar notas binarias 1/0'),
('telemetria.ver', 'sistema', 'Visualizar consumo de tokens de Gemini y concurrencia'),
('purga.solicitar', 'purga', 'Solicitar depuración de alumnos con Excel'),
('purga.ejecutar', 'purga', 'Ejecutar borrado físico con resguardo en Google Drive')
ON CONFLICT (codigo_permiso) DO NOTHING;

-- 3. Tabla Intermedia: Rol y sus Permisos
CREATE TABLE IF NOT EXISTS public.rol_permisos (
    rol_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permiso_id UUID NOT NULL REFERENCES public.permisos(id) ON DELETE CASCADE,
    PRIMARY KEY (rol_id, permiso_id)
);

-- 4. Modificar y Robustecer Tabla `perfiles` con Trazabilidad de Inhabilitación
ALTER TABLE public.perfiles
ADD COLUMN IF NOT EXISTS rol_id UUID REFERENCES public.roles(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS inhabilitado_por UUID REFERENCES public.perfiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS fecha_inhabilitacion TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS motivo_inhabilitacion TEXT DEFAULT NULL;

-- Sincronizar rol_id con el campo rol existente
UPDATE public.perfiles p
SET rol_id = r.id
FROM public.roles r
WHERE p.rol::text = r.nombre_rol AND (p.rol_id IS NULL);

-- 5. Tabla de Auditoría de Cambios de Estado (Activación / Inhabilitación)
CREATE TABLE IF NOT EXISTS public.auditoria_activacion_usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_afectado_id UUID NOT NULL REFERENCES public.perfiles(id) ON DELETE CASCADE,
    modificado_por_id UUID NOT NULL REFERENCES public.perfiles(id) ON DELETE RESTRICT,
    estado_anterior BOOLEAN NOT NULL,
    estado_nuevo BOOLEAN NOT NULL,
    motivo TEXT NOT NULL, -- Ej: 'Traslado a otra escuela', 'Licencia médica', 'Baja temporal', 'Reactivación de ciclo'
    fecha_cambio TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_auditoria_usuario_afectado ON public.auditoria_activacion_usuarios(usuario_afectado_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_modificado_por ON public.auditoria_activacion_usuarios(modificado_por_id);

-- 6. Procedimiento Seguro para Activar o Inhabilitar Usuarios (RF-02)
-- Permite al Administrador (y al Director sobre sus propios docentes) activar/desactivar cuentas
CREATE OR REPLACE FUNCTION public.toggle_estado_usuario(
    p_usuario_id UUID,
    p_nuevo_estado BOOLEAN,
    p_motivo TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_ejecutor_id UUID;
    v_ejecutor_rol rol_usuario;
    v_usuario_rol rol_usuario;
    v_estado_anterior BOOLEAN;
BEGIN
    v_ejecutor_id := auth.uid();
    
    -- Validar que el ejecutor esté autenticado y activo
    SELECT rol, activo INTO v_ejecutor_rol, v_estado_anterior
    FROM public.perfiles 
    WHERE id = v_ejecutor_id;

    IF v_ejecutor_rol IS NULL OR v_estado_anterior = FALSE THEN
        RAISE EXCEPTION 'Usuario no autorizado o cuenta inhabilitada.';
    END IF;

    -- Obtener datos del usuario afectado
    SELECT rol, activo INTO v_usuario_rol, v_estado_anterior
    FROM public.perfiles 
    WHERE id = p_usuario_id;

    IF v_usuario_rol IS NULL THEN
        RAISE EXCEPTION 'El usuario especificado no existe.';
    END IF;

    -- REGLA DE SEGURIDAD (BR-01, RF-02):
    -- 1. Un Administrador puede activar/inhabilitar a cualquier usuario.
    -- 2. Un Director puede inhabilitar únicamente a Profesores adscritos a su escuela.
    -- 3. Un Docente jamás puede modificar estados de cuentas.
    IF v_ejecutor_rol = 'administrador' THEN
        -- Permitido total
        NULL;
    ELSIF v_ejecutor_rol = 'director' THEN
        IF v_usuario_rol != 'profesor' THEN
            RAISE EXCEPTION 'Los directores solo pueden gestionar cuentas de docentes.';
        END IF;
        -- Verificar que el docente pertenezca a una escuela donde el ejecutor es Director
        IF NOT EXISTS (
            SELECT 1 FROM public.aulas_multigrado a
            JOIN public.escuelas e ON e.id = a.escuela_id
            WHERE a.docente_id = p_usuario_id AND e.director_id = v_ejecutor_id
        ) THEN
            RAISE EXCEPTION 'El docente no está asignado a su establecimiento educativo.';
        END IF;
    ELSE
        RAISE EXCEPTION 'No tiene permisos para activar o inhabilitar cuentas.';
    END IF;

    -- Si el estado no cambia, salir
    IF v_estado_anterior = p_nuevo_estado THEN
        RETURN jsonb_build_object('success', true, 'mensaje', 'El usuario ya tenía el estado solicitado.');
    END IF;

    -- Actualizar perfil del usuario
    UPDATE public.perfiles
    SET 
        activo = p_nuevo_estado,
        inhabilitado_por = CASE WHEN p_nuevo_estado = FALSE THEN v_ejecutor_id ELSE NULL END,
        fecha_inhabilitacion = CASE WHEN p_nuevo_estado = FALSE THEN NOW() ELSE NULL END,
        motivo_inhabilitacion = CASE WHEN p_nuevo_estado = FALSE THEN p_motivo ELSE NULL END,
        actualizado_en = NOW()
    WHERE id = p_usuario_id;

    -- Registrar auditoría inmutable
    INSERT INTO public.auditoria_activacion_usuarios (
        usuario_afectado_id, modificado_por_id, estado_anterior, estado_nuevo, motivo
    ) VALUES (
        p_usuario_id, v_ejecutor_id, v_estado_anterior, p_nuevo_estado, p_motivo
    );

    RETURN jsonb_build_object(
        'success', true, 
        'usuario_id', p_usuario_id,
        'estado_nuevo', p_nuevo_estado,
        'motivo', p_motivo,
        'mensaje', CASE WHEN p_nuevo_estado THEN 'Usuario habilitado exitosamente.' ELSE 'Usuario inhabilitado exitosamente.' END
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 7. Actualizar RLS en public.perfiles para bloquear cuentas inhabilitadas
CREATE POLICY "Bloqueo estricto para cuentas inactivas" ON public.perfiles
    FOR ALL TO authenticated
    USING (activo = TRUE OR id = (SELECT auth.uid()) OR public.es_admin());

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura de roles para todos los autenticados" ON public.roles
    FOR SELECT TO authenticated USING (TRUE);

ALTER TABLE public.auditoria_activacion_usuarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin y Director ven auditoria de activaciones" ON public.auditoria_activacion_usuarios
    FOR SELECT TO authenticated 
    USING (public.es_admin() OR modificado_por_id = (SELECT auth.uid()));
