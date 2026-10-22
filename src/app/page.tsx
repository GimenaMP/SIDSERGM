'use client';

import React, { useState } from 'react';
import { MouseCursorTrail } from '../components/login/MouseCursorTrail';
import { SchoolDoodles } from '../components/login/SchoolDoodles';
import { SidserLetterStage } from '../components/login/SidserLetterStage';
import { LoginForm, UserRole } from '../components/login/LoginForm';
import { 
  LogOut, 
  CalendarDays, 
  BookOpen, 
  CheckSquare, 
  GraduationCap, 
  School, 
  ShieldCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface ActiveSession {
  role: UserRole;
  email: string;
  nombre: string;
  escuela: string;
}

export default function LoginPage() {
  const [session, setSession] = useState<ActiveSession | null>(null);

  const handleLoginSuccess = (role: UserRole, user: any) => {
    setSession({
      role,
      email: user.email,
      nombre: user.nombre,
      escuela: user.escuela,
    });
  };

  const handleLogout = () => {
    setSession(null);
  };

  return (
    <main className="relative min-h-screen flex flex-col justify-between py-6 px-4 md:px-8 overflow-hidden">
      {/* 1. Estela y cursor animado del ratoncito escolar */}
      <MouseCursorTrail />

      {/* 2. Doodles y papelería escolar de fondo */}
      <SchoolDoodles />

      {/* Encabezado o Barra Superior */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between py-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-amber-400 border-2 border-amber-500 shadow-sm flex items-center justify-center font-black text-amber-950 text-base">
            S
          </div>
          <span className="font-extrabold text-slate-800 tracking-tight text-base sm:text-lg">
            Plataforma SIDSER
          </span>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300 hidden sm:inline-block">
            Ciclo Escolar 2026
          </span>
        </div>

        <div className="flex items-center space-x-3 text-xs font-semibold text-slate-600">
          <span className="hidden md:inline">Guatemala • MINEDUC</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-emerald-700 font-bold">En línea / Cache Offline</span>
        </div>
      </header>

      {/* Contenido Principal */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-4">
        {!session ? (
          <>
            {/* 3. Escenario interactivo de las letras S-I-D-S-E-R */}
            <SidserLetterStage />

            {/* 4. Tarjeta del Formulario de Inicio de Sesión */}
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          </>
        ) : (
          /* Pantalla de Bienvenida tras Iniciar Sesión Exitosamente */
          <div className="w-full max-w-xl mx-auto card-educational rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-slate-200 animate-fadeIn text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-100 border-3 border-emerald-400 flex items-center justify-center mb-4 shadow-inner">
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

      {/* Pie de página */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto pt-4 text-center text-xs text-slate-400 font-medium">
        © 2026 Plataforma SIDSER • Diseñado con orgullo para la educación rural de Guatemala
      </footer>
    </main>
  );
}
