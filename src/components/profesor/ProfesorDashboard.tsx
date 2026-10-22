'use client';

import React, { useState } from 'react';
import { 
  CalendarDays, 
  BookOpen, 
  CheckSquare, 
  Sparkles, 
  Users, 
  Search, 
  FileText, 
  Printer, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  ArrowLeft, 
  LogOut, 
  Home, 
  Star, 
  Layers, 
  Filter, 
  Share2,
  BookmarkCheck,
  Award,
  HelpCircle,
  TrendingUp,
  Download
} from 'lucide-react';
import { playCartoonPopSound, playCartoonRisingSound } from '../../utils/audioEffects';

export interface ProfesorDashboardProps {
  onLogout: () => void;
  teacherName?: string;
  schoolName?: string;
}

type TabType = 'planificacion' | 'evaluaciones' | 'refuerzo' | 'biblioteca' | 'alumnos';

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

export const ProfesorDashboard: React.FC<ProfesorDashboardProps> = ({
  onLogout,
  teacherName = 'Prof. Juan Pérez',
  schoolName = 'EORM Aldea Calderas, Amatitlán (UDI: 01-08-0123-43)',
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('planificacion');
  const [selectedGrado, setSelectedGrado] = useState<string>('todos');
  const [schedule, setSchedule] = useState<GradeSchedule[]>(INITIAL_SCHEDULE);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Toggle checklist de tema impartido
  const toggleCompletado = (index: number) => {
    playCartoonPopSound();
    setSchedule(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], completado: !updated[index].completado };
      return updated;
    });
  };

  const handleTabChange = (tab: TabType) => {
    playCartoonPopSound();
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-slate-800 flex flex-col font-sans select-none pb-12">
      {/* 
        1. BARRA SUPERIOR ESTILO CANVA (Limpia, colorida, con búsqueda y perfil)
      */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3 flex items-center justify-between shadow-sm">
        {/* Logo y Aula Multigrado */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF5A5F] to-[#FFB703] flex items-center justify-center text-white font-black text-xl shadow-md transform hover:rotate-6 transition-transform">
            S
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
                SIDSER Profesores
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-200">
                Ciclo 2026
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium truncate max-w-[200px] sm:max-w-xs">
              {schoolName}
            </p>
          </div>
        </div>

        {/* Buscador central estilo Canva */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar competencia CNB, tema, libro o página..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100 hover:bg-slate-200/70 focus:bg-white border border-transparent focus:border-teal-500 rounded-full text-xs font-medium text-slate-800 transition-all outline-none"
          />
        </div>

        {/* Acciones de profesor y avatar */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => { playCartoonRisingSound(); setShowPrintModal(true); }}
            className="hidden sm:flex items-center space-x-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all transform active:scale-95 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Plan Semanal</span>
          </button>

          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 p-0.5 shadow-sm">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-bold text-slate-700 text-xs">
                JP
              </div>
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight">{teacherName}</p>
              <p className="text-[10px] text-slate-500 font-medium">Multigrado 4.°, 5.° y 6.°</p>
            </div>
            <button
              onClick={onLogout}
              title="Cerrar sesión"
              className="p-1.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 
        2. HERO BANNER ESTILO CANVA (Creativo, motivador y lleno de color)
      */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 pt-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0077B6] via-[#06D6A0] to-[#FFB703] p-6 sm:p-8 text-white shadow-xl">
          {/* Formas circulares de fondo */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute left-1/3 -top-12 w-40 h-40 bg-white/15 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                <span>Asistente Pedagógico Multigrado CNB</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                ¡Hola de nuevo, {teacherName}! 🌟
              </h1>
              <p className="text-xs sm:text-sm text-white/90 font-medium mt-1 leading-relaxed">
                Hoy es <span className="font-bold underline decoration-yellow-300">Jueves Pedagógico</span>. Revisa tu checklist de temas cubiertos para que el sistema genere automáticamente tus <span className="font-bold text-yellow-200">Evaluaciones de Viernes</span> y el plan de refuerzo de 15 minutos.
              </p>
            </div>

            {/* Tarjeta de Resumen Rápido de Progreso */}
            <div className="bg-white/90 text-slate-800 rounded-2xl p-4 shadow-lg flex items-center space-x-4 border border-white/60 shrink-0">
              <div className="text-center">
                <span className="text-2xl font-black text-[#FF5A5F]">
                  {schedule.filter(s => s.completado).length}/{schedule.length}
                </span>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Temas Cubiertos
                </p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="text-center">
                <span className="text-2xl font-black text-emerald-600">92%</span>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Asistencia Aula
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 
        3. PESTAÑAS DE NAVEGACIÓN ESTILO CANVA (Píldoras redondeadas con iconos vibrantes)
      */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 mt-6">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => handleTabChange('planificacion')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all transform active:scale-95 shrink-0 ${
              activeTab === 'planificacion'
                ? 'bg-[#FF5A5F] text-white shadow-md shadow-rose-200'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>1. Planificación Simultánea (CNB + MINEDUC)</span>
          </button>

          <button
            onClick={() => handleTabChange('evaluaciones')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all transform active:scale-95 shrink-0 ${
              activeTab === 'evaluaciones'
                ? 'bg-[#FFB703] text-slate-900 shadow-md shadow-amber-200'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>2. Evaluaciones de Viernes (Binarias 1/0)</span>
          </button>

          <button
            onClick={() => handleTabChange('refuerzo')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all transform active:scale-95 shrink-0 ${
              activeTab === 'refuerzo'
                ? 'bg-[#06D6A0] text-slate-900 shadow-md shadow-emerald-200'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>3. Refuerzo de 15 Minutos & Tareas</span>
          </button>

          <button
            onClick={() => handleTabChange('biblioteca')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all transform active:scale-95 shrink-0 ${
              activeTab === 'biblioteca'
                ? 'bg-[#0077B6] text-white shadow-md shadow-sky-200'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>4. Biblioteca de Guías MINEDUC</span>
          </button>

          <button
            onClick={() => handleTabChange('alumnos')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all transform active:scale-95 shrink-0 ${
              activeTab === 'alumnos'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>5. Mis Alumnos & Radar de Deficiencias</span>
          </button>
        </div>
      </div>

      {/* 
        4. CONTENIDO PRINCIPAL POR SECCIÓN
      */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-8 mt-4 flex-1">
        
        {/* ========================================================
            TAB 1: PLANIFICACIÓN SIMULTÁNEA (CNB + LIBROS MINEDUC)
            ======================================================== */}
        {activeTab === 'planificacion' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Aviso inteligente de asuetos oficiales MINEDUC */}
            <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-4 flex items-start space-x-3 shadow-sm">
              <span className="text-2xl">📅</span>
              <div className="flex-1 text-xs">
                <p className="font-extrabold text-amber-900">
                  Control de Calendario Oficial MINEDUC y Asuetos Escolares
                </p>
                <p className="text-amber-800 mt-0.5">
                  El sistema detecta automáticamente los asuetos ministeriales y actividades escolares programadas (como permisos y feriados locales en Amatitlán) para omitirlos en la distribución semanal.
                </p>
              </div>
              <button 
                onClick={() => alert('Selector de calendario: Puedes marcar días sin clase para reajustar automáticamente las semanas del ciclo.')}
                className="bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold px-3 py-1 rounded-xl text-xs transition-colors shrink-0"
              >
                Configurar Fechas
              </button>
            </div>

            {/* Selector de grados de la clase multigrado */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 px-3">Filtrar Grado:</span>
                {['todos', '4.° Primaria', '5.° Primaria', '6.° Primaria'].map((grado) => (
                  <button
                    key={grado}
                    onClick={() => { playCartoonPopSound(); setSelectedGrado(grado); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                      selectedGrado === grado
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {grado}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                <span>Atención Directa</span>
                <span className="w-3 h-3 rounded-full bg-teal-500 inline-block ml-2" />
                <span>Trabajo Autónomo en Guía</span>
              </div>
            </div>

            {/* Matriz de Cronograma Simultáneo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {schedule
                .filter(item => selectedGrado === 'todos' || item.grado === selectedGrado)
                .map((item, index) => (
                  <div
                    key={index}
                    className={`bg-white rounded-3xl p-5 border-2 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between ${
                      item.completado ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200'
                    }`}
                  >
                    <div>
                      {/* Encabezado de la tarjeta con insignia de grado y modo */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-black text-sm text-slate-800 bg-slate-100 px-3 py-1 rounded-xl">
                          {item.grado}
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                            item.modo === 'atencion_directa'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-teal-100 text-teal-800 border border-teal-200'
                          }`}
                        >
                          {item.modo === 'atencion_directa' ? '👨‍🏫 Con Profesor' : '📖 Autónomo en Guía'}
                        </span>
                      </div>

                      {/* Título del tema y Bloque de Tiempo */}
                      <h3 className="font-extrabold text-base text-slate-900 mb-1">
                        {item.tema}
                      </h3>
                      <p className="text-[11px] font-bold text-slate-400 mb-3 flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{item.bloque} ({item.tiempo})</span>
                      </p>

                      {/* Alineación CNB Oficial */}
                      <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3 mb-3">
                        <p className="text-[10px] font-black uppercase text-sky-800 tracking-wider mb-1">
                          Alineación CNB (DIGECUR)
                        </p>
                        <p className="text-xs text-sky-950 font-medium leading-relaxed">
                          {item.cnbIndicador}
                        </p>
                      </div>

                      {/* Cruce exacto con libro MINEDUC y número de página */}
                      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[10px] font-black uppercase text-amber-800 tracking-wider">
                            Libro Oficial MINEDUC
                          </p>
                          <span className="bg-amber-300 text-amber-950 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                            Pág. {item.pagina}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-amber-950 mb-1">
                          {item.libro}
                        </p>
                        <p className="text-[11px] text-amber-900 font-medium">
                          {item.ejercicio}
                        </p>
                      </div>

                      {/* Tarea / Lectura sugerida para la casa */}
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl text-xs mb-3">
                        <p className="text-[10px] font-black uppercase text-purple-800 tracking-wider mb-1">
                          🏠 Para Leer y Aprender en Casa
                        </p>
                        <p className="text-purple-950 font-medium">
                          {item.tareaCasa}
                        </p>
                      </div>
                    </div>

                    {/* Botón de confirmación (Checklist de Jueves) */}
                    <button
                      onClick={() => toggleCompletado(index)}
                      className={`w-full py-2.5 px-4 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                        item.completado
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{item.completado ? '✓ Impartido en Clase' : 'Marcar como Impartido'}</span>
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: EVALUACIONES DE VIERNES (PRUEBAS BINARIAS 1/0)
            ======================================================== */}
        {activeTab === 'evaluaciones' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Evaluación Diagnóstica de Viernes (Binaria 1 / 0)
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Generada con base en los temas confirmados en el checklist de la semana.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => alert('Modo Pizarrón: Se despliega la guía con ejercicios ampliados para que el profesor los copie en la pizarra sin gastar fotocopias.')}
                    className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-4 py-2 rounded-2xl text-xs transition-colors flex items-center space-x-1"
                  >
                    <span>🖍️ Modo Pizarrón</span>
                  </button>
                  <button 
                    onClick={() => alert('Generando hoja de respuestas y prueba para impresión...')}
                    className="bg-[#0077B6] hover:bg-sky-700 text-white font-bold px-4 py-2 rounded-2xl text-xs transition-colors flex items-center space-x-1 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar PDF</span>
                  </button>
                </div>
              </div>

              {/* Tabla de Calificación Rápida de Alumnos 1 / 0 */}
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-black uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4 rounded-l-2xl">Alumno</th>
                      <th className="py-3 px-4">Grado</th>
                      <th className="py-3 px-4 text-center">Ej. 1: Fracciones Propias (1/0)</th>
                      <th className="py-3 px-4 text-center">Ej. 2: Suma Homogénea (1/0)</th>
                      <th className="py-3 px-4 text-center">Ej. 3: Problema Contexto (1/0)</th>
                      <th className="py-3 px-4 text-center">Nota Ponderada</th>
                      <th className="py-3 px-4 rounded-r-2xl text-center">Plan Refuerzo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Carlos Mateo Hernández</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">4.° Primaria</td>
                      <td className="py-3.5 px-4 text-center font-bold text-emerald-600 bg-emerald-50/50">1</td>
                      <td className="py-3.5 px-4 text-center font-bold text-emerald-600 bg-emerald-50/50">1</td>
                      <td className="py-3.5 px-4 text-center font-bold text-rose-600 bg-rose-50/50">0</td>
                      <td className="py-3.5 px-4 text-center font-black text-amber-600">67 / 100 pts</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          ⚡ Requiere Refuerzo
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Ana Lucía Ramos</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">4.° Primaria</td>
                      <td className="py-3.5 px-4 text-center font-bold text-emerald-600 bg-emerald-50/50">1</td>
                      <td className="py-3.5 px-4 text-center font-bold text-emerald-600 bg-emerald-50/50">1</td>
                      <td className="py-3.5 px-4 text-center font-bold text-emerald-600 bg-emerald-50/50">1</td>
                      <td className="py-3.5 px-4 text-center font-black text-emerald-600">100 / 100 pts</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          ✓ Competencia Lograda
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Diego Armando Vásquez</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">5.° Primaria</td>
                      <td className="py-3.5 px-4 text-center font-bold text-rose-600 bg-rose-50/50">0</td>
                      <td className="py-3.5 px-4 text-center font-bold text-rose-600 bg-rose-50/50">0</td>
                      <td className="py-3.5 px-4 text-center font-bold text-emerald-600 bg-emerald-50/50">1</td>
                      <td className="py-3.5 px-4 text-center font-black text-rose-600">33 / 100 pts</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          ⚡ Requiere Refuerzo
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: REFUERZO DE 15 MINUTOS & TAREAS
            ======================================================== */}
        {activeTab === 'refuerzo' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-black text-lg">
                  ⚡
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Plan de Refuerzo Unificado (Fichas de 15 Minutos)
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Diseñado para no sobrecargar la jornada docente y nivelar temas no alcanzados en la evaluación.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-5 bg-rose-50/40 border border-rose-200 rounded-2xl">
                  <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-lg">
                    Ficha de Refuerzo N.° 1 • Matemáticas (4.° Grado)
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base mt-2">
                    Resolución de Problemas con Fracciones del Entorno
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Alumnos: <span className="font-bold">Carlos Mateo Hernández</span>
                  </p>
                  <div className="mt-3 p-3 bg-white rounded-xl border border-rose-200 text-xs">
                    <p className="font-bold text-slate-800">Ejercicio práctico sugerido (Guía MINEDUC Pág. 50):</p>
                    <p className="text-slate-600 mt-0.5">
                      Reparto de 3 naranjas entre 4 compañeros. Dibuja y sombrea la porción exacta de cada niño.
                    </p>
                  </div>
                </div>

                <div className="p-5 bg-amber-50/40 border border-amber-200 rounded-2xl">
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg">
                    Ficha de Refuerzo N.° 2 • Matemáticas (5.° Grado)
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base mt-2">
                    Suma de Fracciones Homogéneas
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Alumnos: <span className="font-bold">Diego Armando Vásquez</span>
                  </p>
                  <div className="mt-3 p-3 bg-white rounded-xl border border-amber-200 text-xs">
                    <p className="font-bold text-slate-800">Ejercicio práctico sugerido (Libro 5.° Pág. 66):</p>
                    <p className="text-slate-600 mt-0.5">
                      Suma rápida de numeradores manteniendo el denominador común con tiras de papel doblado.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: BIBLIOTECA DE GUÍAS MINEDUC
            ======================================================== */}
        {activeTab === 'biblioteca' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Biblioteca Oficial de Textos Escolares MINEDUC
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  36 libros y guías de autoaprendizaje indexados con números de página físicos exactos.
                </p>
              </div>
              <span className="bg-sky-100 text-sky-800 font-bold text-xs px-3 py-1.5 rounded-full border border-sky-200">
                📚 100% Offline en Servidor Local
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { title: 'Guía de Aprendizaje Integrada', ciclo: '2.° Ciclo (4.°, 5.° y 6.°)', paginas: '240 págs', color: 'from-amber-400 to-rose-400' },
                { title: 'Matemáticas 4.° Primaria', ciclo: '1.° y 2.° Semestre', paginas: '180 págs', color: 'from-sky-400 to-indigo-500' },
                { title: 'Matemáticas 5.° Primaria', ciclo: '1.° y 2.° Semestre', paginas: '192 págs', color: 'from-emerald-400 to-teal-500' },
                { title: 'Matemáticas 6.° Primaria', ciclo: '1.° y 2.° Semestre', paginas: '204 págs', color: 'from-purple-400 to-pink-500' },
              ].map((book, i) => (
                <div key={i} className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className={`w-full h-32 rounded-2xl bg-gradient-to-tr ${book.color} flex items-center justify-center text-white p-4 text-center font-black text-sm shadow-inner`}>
                      {book.title}
                    </div>
                    <h3 className="font-bold text-slate-900 text-xs mt-3 leading-tight">{book.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{book.ciclo}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-600">
                    <span>{book.paginas}</span>
                    <button 
                      onClick={() => alert(`Abriendo visor de ejercicios para ${book.title}...`)}
                      className="text-teal-600 hover:text-teal-800 hover:underline"
                    >
                      Ver Ejercicios →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: ALUMNOS & RADAR DE DEFICIENCIAS
            ======================================================== */}
        {activeTab === 'alumnos' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Registro de Alumnos Multigrado (EORM Aldea Calderas)
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Historial de deficiencias transferible protegido por SHA-256 + Salt institucional (Regla BR-08).
                  </p>
                </div>
                <button 
                  onClick={() => alert('Formulario de nuevo estudiante o carga desde archivo SIRVEM')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-2xl text-xs transition-colors shadow-sm"
                >
                  + Agregar Estudiante
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-500">Total Estudiantes</p>
                  <p className="text-3xl font-black text-slate-900 mt-1">18</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">En aula multigrado 4.°, 5.° y 6.°</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <p className="text-xs font-bold text-emerald-800">Competencias Alcanzadas</p>
                  <p className="text-3xl font-black text-emerald-600 mt-1">84%</p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">Promedio general del bimestre</p>
                </div>
                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200">
                  <p className="text-xs font-bold text-rose-800">En Plan de Refuerzo</p>
                  <p className="text-3xl font-black text-rose-600 mt-1">3</p>
                  <p className="text-[11px] text-rose-700 mt-0.5">Atención focalizada de 15 min</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MODAL DE IMPRESIÓN PARA EL PROFESOR */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-scaleUp">
            <h3 className="text-lg font-black text-slate-900 mb-2">Imprimir Planificación Semanal</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Generando formato estándar oficial del MINEDUC con cronograma simultáneo por grados, códigos de competencia CNB y números de página de las guías.
            </p>
            <div className="space-y-2 mb-6">
              <label className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                <input type="checkbox" defaultChecked className="rounded text-teal-600" />
                <span>Incluir ejercicios sugeridos de las guías</span>
              </label>
              <label className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                <input type="checkbox" defaultChecked className="rounded text-teal-600" />
                <span>Incluir sugerencias de lectura en casa</span>
              </label>
              <label className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                <input type="checkbox" defaultChecked className="rounded text-teal-600" />
                <span>Formato de bajo consumo de tinta</span>
              </label>
            </div>
            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowPrintModal(false);
                  window.print();
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
              >
                Imprimir Documento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
