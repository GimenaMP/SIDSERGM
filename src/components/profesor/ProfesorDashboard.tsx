'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard,
  CalendarDays, 
  GraduationCap, 
  UserCheck, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  BookOpen, 
  Search, 
  Printer, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  LogOut, 
  Menu, 
  X, 
  TrendingUp, 
  Download, 
  Plus, 
  Check, 
  ChevronRight,
  Sparkles,
  School,
  FileText,
  User,
  Users
} from 'lucide-react';
import { playCartoonPopSound, playCartoonRisingSound } from '../../utils/audioEffects';

export interface ProfesorDashboardProps {
  onLogout: () => void;
  teacherName?: string;
  schoolName?: string;
}

export type SidebarMode = 'dashboard' | 'planificaciones' | 'grados' | 'asistencia' | 'pruebas' | 'calendario';

interface GradeSchedule {
  grado: string;
  bloque: string;
  tiempo: string;
  modo: 'atencion_directa' | 'trabajo_autonomo';
  tema: string;
  cnbIndicador: string;
  libro: string;
  pagina: number;
  ejercicio: string;
  tareaCasa: string;
  completado: boolean;
}

interface StudentAttendance {
  id: string;
  nombre: string;
  grado: string;
  estado: 'presente' | 'ausente' | 'justificado';
}

const INITIAL_SCHEDULE: GradeSchedule[] = [
  {
    grado: '4.° Primaria',
    bloque: 'Bloque 1 (8:00 - 8:45)',
    tiempo: '45 min',
    modo: 'atencion_directa',
    tema: 'Fracciones propias e impropias',
    cnbIndicador: 'Indicador 4.2.1 • Representa fracciones usando objetos y diagramas del entorno.',
    libro: 'Guía de Aprendizaje Integrada - 2.° Ciclo',
    pagina: 48,
    ejercicio: 'Actividad 2: Representación gráfica de fracciones en papel cuadriculado.',
    tareaCasa: 'Lectura pág. 49, resolver ejercicios 1 y 2 en el cuaderno.',
    completado: true,
  },
  {
    grado: '5.° Primaria',
    bloque: 'Bloque 1 (8:00 - 8:45)',
    tiempo: '45 min',
    modo: 'trabajo_autonomo',
    tema: 'Suma de fracciones con igual denominador',
    cnbIndicador: 'Indicador 5.1.3 • Opera adición de fracciones homogéneas en problemas de la comunidad.',
    libro: 'Matemáticas 5.° Primaria - MINEDUC',
    pagina: 64,
    ejercicio: 'Pág. 64, sección "Practiquemos juntos", problemas del 1 al 5.',
    tareaCasa: 'Pág. 65, ejercicio 6 (Problema de reparto de maíz).',
    completado: true,
  },
  {
    grado: '6.° Primaria',
    bloque: 'Bloque 1 (8:00 - 8:45)',
    tiempo: '45 min',
    modo: 'trabajo_autonomo',
    tema: 'Fracciones equivalentes y simplificación',
    cnbIndicador: 'Indicador 6.3.2 • Simplifica fracciones hasta su mínima expresión mediante MCD.',
    libro: 'Guía de Autoaprendizaje 6.° - MINEDUC',
    pagina: 82,
    ejercicio: 'Pág. 82, ejercicio 4: Crucigrama de simplificación de fracciones.',
    tareaCasa: 'Pág. 83, actividad de repaso para el hogar.',
    completado: false,
  },
];

const INITIAL_STUDENTS: StudentAttendance[] = [
  { id: '1', nombre: 'Carlos Mateo Hernández', grado: '4.° Primaria', estado: 'presente' },
  { id: '2', nombre: 'Ana Lucía Ramos', grado: '4.° Primaria', estado: 'presente' },
  { id: '3', nombre: 'Josué David Morales', grado: '4.° Primaria', estado: 'presente' },
  { id: '4', nombre: 'Diego Armando Vásquez', grado: '5.° Primaria', estado: 'presente' },
  { id: '5', nombre: 'Sofía Marleny Chajón', grado: '5.° Primaria', estado: 'presente' },
  { id: '6', nombre: 'Kevin Alexander Solís', grado: '5.° Primaria', estado: 'ausente' },
  { id: '7', nombre: 'María Alejandra Tún', grado: '6.° Primaria', estado: 'presente' },
  { id: '8', nombre: 'Bryan Estuardo Gómez', grado: '6.° Primaria', estado: 'presente' },
  { id: '9', nombre: 'Kimberly Nohemí Pocasangre', grado: '6.° Primaria', estado: 'justificado' },
];

export const ProfesorDashboard: React.FC<ProfesorDashboardProps> = ({
  onLogout,
  teacherName = 'Prof. Juan Pérez',
  schoolName = 'EORM Aldea Calderas, Amatitlán (UDI: 01-08-0123-43)',
}) => {
  const [currentMode, setCurrentMode] = useState<SidebarMode>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [schedule, setSchedule] = useState<GradeSchedule[]>(INITIAL_SCHEDULE);
  const [students, setStudents] = useState<StudentAttendance[]>(INITIAL_STUDENTS);
  const [selectedGradoFilter, setSelectedGradoFilter] = useState<string>('todos');
  const [attendanceSaved, setAttendanceSaved] = useState(false);

  // Navegación lateral
  const handleSelectMode = (mode: SidebarMode) => {
    playCartoonPopSound();
    setCurrentMode(mode);
    setMobileMenuOpen(false);
  };

  // Toggle tema completado en planificaciones
  const toggleScheduleCompletado = (index: number) => {
    playCartoonPopSound();
    setSchedule(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], completado: !copy[index].completado };
      return copy;
    });
  };

  // Toggle estado de asistencia de alumno
  const setStudentState = (id: string, nuevoEstado: 'presente' | 'ausente' | 'justificado') => {
    playCartoonPopSound();
    setStudents(prev => prev.map(s => s.id === id ? { ...s, estado: nuevoEstado } : s));
  };

  const saveAttendance = () => {
    playCartoonRisingSound();
    setAttendanceSaved(true);
    setTimeout(() => setAttendanceSaved(false), 3000);
  };

  // Menú de navegación lateral
  const navItems = [
    { mode: 'dashboard' as SidebarMode, label: 'Dashboard', icon: LayoutDashboard, badge: null, color: 'text-sky-600' },
    { mode: 'planificaciones' as SidebarMode, label: 'Planificaciones', icon: CalendarDays, badge: 'CNB', color: 'text-[#FF5A5F]' },
    { mode: 'grados' as SidebarMode, label: 'Grados', icon: GraduationCap, badge: '4.°-6.°', color: 'text-amber-500' },
    { mode: 'asistencia' as SidebarMode, label: 'Asistencia', icon: UserCheck, badge: 'Hoy', color: 'text-emerald-600' },
    { mode: 'pruebas' as SidebarMode, label: 'Pruebas', icon: CheckSquare, badge: '1 / 0', color: 'text-teal-600' },
    { mode: 'calendario' as SidebarMode, label: 'Calendario', icon: CalendarIcon, badge: 'MINEDUC', color: 'text-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans select-none text-slate-800">
      
      {/* 
        ============================================================
        1. BARRA LATERAL (SIDEBAR) - ESTILO CANVA EDUCATIVO
        ============================================================
      */}
      {/* Overlay para móvil */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 z-50 flex flex-col justify-between transition-transform duration-300 shadow-sm ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div>
          {/* Encabezado del Logo SIDSER */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF5A5F] via-[#FFB703] to-[#06D6A0] flex items-center justify-center text-white font-black text-xl shadow-md transform hover:rotate-6 transition-transform">
                S
              </div>
              <div>
                <span className="font-black text-base text-slate-900 tracking-tight block">
                  Plataforma SIDSER
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Módulo Docente
                </span>
              </div>
            </div>

            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menú de Modos del Módulo */}
          <div className="p-3">
            <p className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
              Modos del Módulo
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentMode === item.mode;
                return (
                  <button
                    key={item.mode}
                    onClick={() => handleSelectMode(item.mode)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-bold text-xs transition-all transform active:scale-95 ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.color}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tarjeta del Profesor y Salir (Pie del Sidebar) */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60">
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 text-white font-black text-xs flex items-center justify-center shrink-0">
                JP
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-800 truncate leading-tight">
                  {teacherName}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  Multigrado 4.°-6.°
                </p>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Cerrar sesión"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="text-[10px] text-slate-400 text-center font-medium">
            MINEDUC • Guatemala 2026
          </div>
        </div>
      </aside>

      {/* 
        ============================================================
        2. CONTENIDO PRINCIPAL SEGÚN EL MODO SELECCIONADO
        ============================================================
      */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Barra superior de contexto */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-black text-slate-900 tracking-tight capitalize">
                  {currentMode}
                </h1>
                <span className="text-xs text-slate-400">/</span>
                <span className="text-xs font-semibold text-slate-500">
                  {schoolName.split(',')[0]}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Gestión simultánea de aula multigrado (1.º a 6.º de Primaria)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="hidden sm:inline-flex items-center space-x-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Modo Offline Activo</span>
            </span>
          </div>
        </header>

        {/* Cuerpo del Módulo */}
        <main className="p-4 sm:p-8 max-w-6xl w-full mx-auto space-y-6">

          {/* ========================================================
              MODO 1: DASHBOARD (Resumen y atajos principales)
              ======================================================== */}
          {currentMode === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Canva Banner Hero */}
              <div className="rounded-3xl bg-gradient-to-r from-[#0077B6] via-[#06D6A0] to-[#FFB703] p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 max-w-xl">
                  <div className="inline-flex items-center space-x-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                    <span>Jornada Pedagógica de Hoy</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                    ¡Buenos días, {teacherName}! ☀️
                  </h2>
                  <p className="text-xs sm:text-sm text-white/90 font-medium mt-1">
                    Tu aula multigrado tiene 3 grados sincronizados (4.°, 5.° y 6.°). Recuerda revisar la asistencia matutina y verificar los temas cubiertos para la prueba de viernes.
                  </p>
                </div>
              </div>

              {/* 4 Tarjetas de Métricas Rápidas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div 
                  onClick={() => handleSelectMode('asistencia')}
                  className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs hover:border-emerald-400 cursor-pointer transition-all hover:-translate-y-0.5"
                >
                  <p className="text-[10px] font-black uppercase text-slate-400">Asistencia Hoy</p>
                  <p className="text-2xl font-black text-emerald-600 mt-1">8 / 9</p>
                  <p className="text-[10px] font-semibold text-slate-500 mt-0.5">88.8% presente</p>
                </div>

                <div 
                  onClick={() => handleSelectMode('planificaciones')}
                  className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs hover:border-[#FF5A5F] cursor-pointer transition-all hover:-translate-y-0.5"
                >
                  <p className="text-[10px] font-black uppercase text-slate-400">Temas Cubiertos</p>
                  <p className="text-2xl font-black text-[#FF5A5F] mt-1">2 / 3</p>
                  <p className="text-[10px] font-semibold text-slate-500 mt-0.5">En semana 14</p>
                </div>

                <div 
                  onClick={() => handleSelectMode('pruebas')}
                  className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs hover:border-teal-400 cursor-pointer transition-all hover:-translate-y-0.5"
                >
                  <p className="text-[10px] font-black uppercase text-slate-400">Pruebas de Viernes</p>
                  <p className="text-2xl font-black text-teal-600 mt-1">3 Grados</p>
                  <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Lista para imprimir</p>
                </div>

                <div 
                  onClick={() => handleSelectMode('calendario')}
                  className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs hover:border-purple-400 cursor-pointer transition-all hover:-translate-y-0.5"
                >
                  <p className="text-[10px] font-black uppercase text-slate-400">Próximo Asueto</p>
                  <p className="text-base font-black text-purple-700 mt-1 truncate">1 de Mayo</p>
                  <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Día del Trabajo</p>
                </div>
              </div>

              {/* Vista rápida del cronograma simultáneo */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Cronograma Simultáneo de Hoy
                    </h3>
                    <p className="text-xs text-slate-500">
                      Distribución de atención directa vs trabajo autónomo en libros oficiales MINEDUC.
                    </p>
                  </div>
                  <button
                    onClick={() => handleSelectMode('planificaciones')}
                    className="text-xs font-bold text-[#FF5A5F] hover:underline flex items-center space-x-1"
                  >
                    <span>Ver Plan Completo</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {schedule.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-extrabold text-slate-800">{item.grado}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.modo === 'atencion_directa' 
                            ? 'bg-rose-100 text-rose-800' 
                            : 'bg-teal-100 text-teal-800'
                        }`}>
                          {item.modo === 'atencion_directa' ? 'Profesor' : 'Guía MINEDUC'}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900">{item.tema}</p>
                      <p className="text-[11px] text-slate-500 mt-1">Pág. {item.pagina} • {item.tiempo}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              MODO 2: PLANIFICACIONES (Simultánea CNB + MINEDUC)
              ======================================================== */}
          {currentMode === 'planificaciones' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Planificación Simultánea Semanal
                  </h2>
                  <p className="text-xs text-slate-500">
                    Alineación oficial CNB (DIGECUR) y referencias directas a páginas de libros MINEDUC.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-500">Filtrar:</span>
                  {['todos', '4.° Primaria', '5.° Primaria', '6.° Primaria'].map((grado) => (
                    <button
                      key={grado}
                      onClick={() => { playCartoonPopSound(); setSelectedGradoFilter(grado); }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                        selectedGradoFilter === grado
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {grado}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tarjetas simultáneas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {schedule
                  .filter(s => selectedGradoFilter === 'todos' || s.grado === selectedGradoFilter)
                  .map((item, idx) => (
                    <div 
                      key={idx}
                      className={`bg-white rounded-3xl p-5 border-2 transition-all flex flex-col justify-between shadow-xs ${
                        item.completado ? 'border-emerald-300 bg-emerald-50/15' : 'border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-black text-sm text-slate-800 bg-slate-100 px-3 py-1 rounded-xl">
                            {item.grado}
                          </span>
                          <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                            item.modo === 'atencion_directa'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-teal-100 text-teal-800 border border-teal-200'
                          }`}>
                            {item.modo === 'atencion_directa' ? '👨‍🏫 Atención Directa' : '📖 Autónomo en Guía'}
                          </span>
                        </div>

                        <h3 className="font-extrabold text-base text-slate-900 mb-1">
                          {item.tema}
                        </h3>
                        <p className="text-[11px] font-bold text-slate-400 mb-3 flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{item.bloque} ({item.tiempo})</span>
                        </p>

                        {/* CNB */}
                        <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3 mb-3">
                          <p className="text-[10px] font-black uppercase text-sky-800 tracking-wider mb-1">
                            Alineación CNB Oficial
                          </p>
                          <p className="text-xs text-sky-950 font-medium leading-relaxed">
                            {item.cnbIndicador}
                          </p>
                        </div>

                        {/* MINEDUC y Página Exacta */}
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-[10px] font-black uppercase text-amber-800 tracking-wider">
                              Libro MINEDUC
                            </p>
                            <span className="bg-amber-300 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-md">
                              Pág. {item.pagina}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-amber-950 mb-0.5">
                            {item.libro}
                          </p>
                          <p className="text-[11px] text-amber-900 font-medium">
                            {item.ejercicio}
                          </p>
                        </div>

                        {/* Tarea en Casa */}
                        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3 mb-4 text-xs">
                          <p className="text-[10px] font-black uppercase text-purple-800 tracking-wider mb-1">
                            🏠 Autoaprendizaje en Casa
                          </p>
                          <p className="text-purple-950 font-medium">
                            {item.tareaCasa}
                          </p>
                        </div>
                      </div>

                      {/* Botón de Checklist de Jueves */}
                      <button
                        onClick={() => toggleScheduleCompletado(idx)}
                        className={`w-full py-2.5 px-4 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                          item.completado
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{item.completado ? '✓ Tema Impartido' : 'Marcar como Impartido'}</span>
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ========================================================
              MODO 3: GRADOS (Gestor de Grados Multigrado)
              ======================================================== */}
          {currentMode === 'grados' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Gestor de Grados del Aula Multigrado
                </h2>
                <p className="text-xs text-slate-500">
                  Configuración pedagógica del ciclo multigrado según lineamientos del MINEDUC de Guatemala.
                </p>
              </div>

              {/* Ciclo 1 vs Ciclo 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Ciclo 1 */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[10px] font-black text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full uppercase">
                        Primer Ciclo Primaria
                      </span>
                      <h3 className="text-base font-black text-slate-900 mt-1">1.°, 2.° y 3.° Primaria</h3>
                    </div>
                    <span className="text-xs font-bold text-slate-400">Guías Integradas</span>
                  </div>

                  <div className="space-y-2.5">
                    {['1.° Grado: Iniciación en Lectoescritura & Números', '2.° Grado: Operaciones Básicas y Medio Social', '3.° Grado: Comprensión Lectora y Fracciones Iniciales'].map((g, i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700">{g}</span>
                        <span className="text-[10px] bg-white px-2 py-0.5 rounded-lg border border-slate-200 font-bold text-slate-500">Activo</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ciclo 2 */}
                <div className="bg-white rounded-3xl p-6 border-2 border-emerald-300 shadow-xs bg-emerald-50/10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full uppercase">
                        Segundo Ciclo Multigrado (Tu Aula Actual)
                      </span>
                      <h3 className="text-base font-black text-slate-900 mt-1">4.°, 5.° y 6.° Primaria</h3>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 font-mono">9 Alumnos</span>
                  </div>

                  <div className="space-y-2.5">
                    {['4.° Grado: Fracciones, Geometría & Ciencias', '5.° Grado: Adición Homogénea & Redacción', '6.° Grado: Equivalencias, Razón & Proporción'].map((g, i) => (
                      <div key={i} className="p-3 bg-white rounded-2xl border border-emerald-200 flex items-center justify-between text-xs shadow-xs">
                        <span className="font-extrabold text-slate-800">{g}</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-lg">En Curso</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              MODO 4: ASISTENCIA (Control Diario de Alumnos)
              ======================================================== */}
          {currentMode === 'asistencia' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Registro de Asistencia Diaria
                  </h2>
                  <p className="text-xs text-slate-500">
                    Control diario para cálculo del indicador de ausentismo escolar rural (Offline-Ready).
                  </p>
                </div>

                <button
                  onClick={saveAttendance}
                  className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-2xl text-xs transition-all shadow-md flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar Asistencia de Hoy</span>
                </button>
              </div>

              {attendanceSaved && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-2xl text-xs font-bold text-emerald-900 flex items-center space-x-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>¡Asistencia guardada exitosamente en la base de datos local y sincronizada!</span>
                </div>
              )}

              {/* Tabla de asistencia interactiva */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-black uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4 rounded-l-2xl">Estudiante</th>
                      <th className="py-3 px-4">Grado</th>
                      <th className="py-3 px-4 text-center rounded-r-2xl">Estado de Asistencia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-bold flex items-center space-x-2.5">
                          <span className={`w-2 h-2 rounded-full ${
                            student.estado === 'presente' ? 'bg-emerald-500' : student.estado === 'ausente' ? 'bg-rose-500' : 'bg-amber-500'
                          }`} />
                          <span>{student.nombre}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">{student.grado}</td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex rounded-xl p-0.5 bg-slate-100 border border-slate-200">
                            <button
                              onClick={() => setStudentState(student.id, 'presente')}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                student.estado === 'presente'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Presente
                            </button>
                            <button
                              onClick={() => setStudentState(student.id, 'ausente')}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                student.estado === 'ausente'
                                  ? 'bg-rose-600 text-white shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Ausente
                            </button>
                            <button
                              onClick={() => setStudentState(student.id, 'justificado')}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                student.estado === 'justificado'
                                  ? 'bg-amber-500 text-white shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Justificado
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================
              MODO 5: PRUEBAS (Evaluaciones de Viernes 1/0)
              ======================================================== */}
          {currentMode === 'pruebas' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Evaluaciones de Viernes & Diagnóstico (1 / 0)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Generadas con ejercicios de las guías MINEDUC para evaluar competencias alcanzadas.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => alert('Modo Pizarrón: Se amplían los ejercicios para transcribirlos en la pizarra sin costo de fotocopias.')}
                    className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-3.5 py-2 rounded-2xl text-xs transition-colors"
                  >
                    🖍️ Modo Pizarrón
                  </button>
                  <button 
                    onClick={() => alert('Generando hoja de prueba en PDF...')}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-2xl text-xs transition-colors flex items-center space-x-1.5 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar PDF</span>
                  </button>
                </div>
              </div>

              {/* Calificador 1/0 */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-black uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4 rounded-l-2xl">Alumno</th>
                      <th className="py-3 px-4">Grado</th>
                      <th className="py-3 px-4 text-center">Ej. 1 (1/0)</th>
                      <th className="py-3 px-4 text-center">Ej. 2 (1/0)</th>
                      <th className="py-3 px-4 text-center">Ej. 3 (1/0)</th>
                      <th className="py-3 px-4 text-center">Nota Final</th>
                      <th className="py-3 px-4 rounded-r-2xl text-center">Diagnóstico</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold">Carlos Mateo Hernández</td>
                      <td className="py-3 px-4 text-slate-500">4.° Primaria</td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-600">1</td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-600">1</td>
                      <td className="py-3 px-4 text-center font-bold text-rose-600">0</td>
                      <td className="py-3 px-4 text-center font-black text-amber-600">67 / 100</td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          ⚡ Refuerzo 15 min
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold">Ana Lucía Ramos</td>
                      <td className="py-3 px-4 text-slate-500">4.° Primaria</td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-600">1</td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-600">1</td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-600">1</td>
                      <td className="py-3 px-4 text-center font-black text-emerald-600">100 / 100</td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          ✓ Aprobada
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold">Diego Armando Vásquez</td>
                      <td className="py-3 px-4 text-slate-500">5.° Primaria</td>
                      <td className="py-3 px-4 text-center font-bold text-rose-600">0</td>
                      <td className="py-3 px-4 text-center font-bold text-rose-600">0</td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-600">1</td>
                      <td className="py-3 px-4 text-center font-black text-rose-600">33 / 100</td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          ⚡ Refuerzo 15 min
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================
              MODO 6: CALENDARIO (Asuetos Oficiales MINEDUC & Asuetos)
              ======================================================== */}
          {currentMode === 'calendario' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Calendario Escolar Oficial 2026 (MINEDUC)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Asuetos oficiales y días de permiso comunitario que no deben tomarse en cuenta para la planificación.
                  </p>
                </div>

                <button 
                  onClick={() => alert('Selecciona una fecha para agregar un día sin clases (actividad, permiso o feria local).')}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-2xl text-xs transition-colors flex items-center space-x-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Marcar Día Sin Clase</span>
                </button>
              </div>

              {/* Lista de Asuetos Oficiales de Guatemala */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { fecha: '15 de Enero de 2026', nombre: 'Inauguración del Ciclo Escolar', tipo: 'Hito Ministerial', icono: '🎒' },
                  { fecha: '26 al 30 de Marzo de 2026', nombre: 'Semana Santa', tipo: 'Asueto Oficial MINEDUC', icono: '🕊️' },
                  { fecha: '1 de Mayo de 2026', nombre: 'Día Internacional del Trabajo', tipo: 'Feriado Nacional', icono: '🛠️' },
                  { fecha: '30 de Junio de 2026', nombre: 'Día del Ejército', tipo: 'Feriado Nacional', icono: '🎖️' },
                  { fecha: '15 de Agosto de 2026', nombre: 'Feria Patronal de Amatitlán', tipo: 'Permiso Comunitario Local', icono: '🎡' },
                  { fecha: '15 de Septiembre de 2026', nombre: 'Día de la Independencia de Guatemala', tipo: 'Feriado Nacional Patrio', icono: '🇬🇹' },
                  { fecha: '20 de Octubre de 2026', nombre: 'Día de la Revolución', tipo: 'Feriado Nacional', icono: '✊' },
                  { fecha: '1 de Noviembre de 2026', nombre: 'Día de Todos los Santos (Barriletes)', tipo: 'Tradición Nacional', icono: '🪁' },
                ].map((asueto, i) => (
                  <div key={i} className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between hover:border-purple-300 transition-colors">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{asueto.icono}</span>
                      <div>
                        <p className="font-extrabold text-xs text-slate-800">{asueto.nombre}</p>
                        <p className="text-[11px] text-slate-500">{asueto.fecha}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      {asueto.tipo}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
