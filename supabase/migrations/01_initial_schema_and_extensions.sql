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
