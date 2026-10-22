'use client';

import React, { useState } from 'react';
import { MouseCursorTrail } from '../components/login/MouseCursorTrail';
import { SchoolDoodles } from '../components/login/SchoolDoodles';
import { LoginForm, UserRole } from '../components/login/LoginForm';
import { 
  LogOut, 
  CalendarDays, 
  BookOpen, 
  CheckSquare, 
  GraduationCap, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

import { useRouter } from 'next/navigation';

interface ActiveSession {
  role: UserRole;
  email: string;
  nombre: string;
  escuela: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [session, setSession] = useState<ActiveSession | null>(null);

  const handleLoginSuccess = (role: UserRole, user: any) => {
    setSession({
      role,
      email: user.email,
      nombre: user.nombre,
      escuela: user.escuela,
    });

    // Si el rol es profesor, transición automática tras el confeti
    if (role === 'profesor') {
      setTimeout(() => {
        router.push('/profesor');
      }, 1000);
    }
  };

  const handleLogout = () => {
    setSession(null);
  };

  return (
    <main className="relative min-h-screen flex flex-col justify-center items-center py-12 px-4 md:px-8 overflow-x-hidden">
      {/* 1. Estela y cursor animado del ratoncito escolar */}
      <MouseCursorTrail />

      {/* 2. Doodles y papelería escolar de fondo (clip superior, regla inferior) */}
      <SchoolDoodles />

      {/* Contenido Principal */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        {!session ? (
          /* Formulario de Login con el GIF de SIDSER superpuesto encima */
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        ) : (
          /* Pantalla de Bienvenida tras Iniciar Sesión Exitosamente */
          <div className="w-full max-w-xl mx-auto card-educational rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-slate-200 animate-fadeIn text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-100 border-[3px] border-emerald-400 flex items-center justify-center mb-4 shadow-inner">
              <GraduationCap className="w-10 h-10 text-emerald-600" />
            </div>

            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2 bg-emerald-50 text-emerald-700 border border-emerald-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Autenticación Exitosa</span>
            </div>

            <h1 className="text-2xl font-black text-slate-800">
              ¡Hola, {session.nombre}!
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {session.escuela}
            </p>

            <div className="my-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500">Rol Activo:</span>
                <span className="capitalize px-2 py-0.5 rounded-lg bg-sky-100 text-sky-800 border border-sky-200">
                  {session.role}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500">Correo / CUI:</span>
                <span className="text-slate-700 font-mono">{session.email}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500">Estado de Cuenta:</span>
                <span className="text-emerald-600 flex items-center space-x-1">
                  <span>●</span> <span>Activo y Autorizado</span>
                </span>
              </div>
            </div>

            {/* Módulos Próximos a Gestionar */}
            <div className="space-y-2 text-left mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Módulos de la Plataforma
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center space-x-3 shadow-sm hover:border-sky-400 transition-colors">
                  <CalendarDays className="w-5 h-5 text-sky-500" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Planificación Semanal</p>
                    <p className="text-[10px] text-slate-500">Alineación CNB y libros</p>
                  </div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center space-x-3 shadow-sm hover:border-emerald-400 transition-colors">
                  <BookOpen className="w-5 h-5 text-emerald-500" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Guías de Ejercicios</p>
                    <p className="text-[10px] text-slate-500">Páginas exactas MINEDUC</p>
                  </div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center space-x-3 shadow-sm hover:border-amber-400 transition-colors">
                  <CheckSquare className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Evaluaciones de Viernes</p>
                    <p className="text-[10px] text-slate-500">Pruebas binarias 1 / 0</p>
                  </div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center space-x-3 shadow-sm hover:border-rose-400 transition-colors">
                  <GraduationCap className="w-5 h-5 text-rose-500" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Refuerzo de 15 Minutos</p>
                    <p className="text-[10px] text-slate-500">Nivelación por estudiante</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón principal de acceso al módulo */}
            <button
              onClick={() => router.push('/profesor')}
              className="w-full mb-3 py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF5A5F] to-[#FFB703] text-white text-xs font-black flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Entrar al Módulo de Profesores (Aula Multigrado)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleLogout}
              className="w-full py-2.5 px-4 rounded-xl border-2 border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold flex items-center justify-center space-x-2 transition-all hover:bg-slate-50"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión / Probar otro rol</span>
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
