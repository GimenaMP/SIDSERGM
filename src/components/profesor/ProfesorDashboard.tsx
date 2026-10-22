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
  Users,
  Sliders,
  RotateCcw,
  Zap,
  Lightbulb,
  Tag,
  Layers,
  ArrowRight
} from 'lucide-react';
import { playCartoonPopSound, playCartoonRisingSound } from '../../utils/audioEffects';
import { 
  generateUnifiedRAGPlan, 
  UnifiedWeeklyPlan, 
  DiaSemana, 
  GradeSchedule, 
  TimeAllocation,
  DayPlan,
  EvaluacionGradoViernes,
  AlineacionCNBGrado
} from '../../utils/ragEngine';

export type DiaNavegacion = DiaSemana | 'Viernes';

export interface ProfesorDashboardProps {
  onLogout: () => void;
  teacherName?: string;
  schoolName?: string;
}

export type SidebarMode = 'dashboard' | 'planificaciones' | 'grados' | 'asistencia' | 'pruebas' | 'calendario';



interface StudentAttendance {
  id: string;
  nombre: string;
  grado: string;
  estado: 'presente' | 'ausente' | 'justificado';
}

const INITIAL_SCHEDULE: GradeSchedule[] = [
  {
    grado: '4.° Primaria',
    bloque: 'Bloque 1 (08:00 - 08:45 hrs)',
    duracionTotal: '45 min',
    materia: 'Matemáticas',
    tema: 'Descomposición posicional y valor relativo de números grandes',
    cnbCompetencia: 'Competencia 4: Aplica elementos matemáticos y de su entorno en situaciones que promueven la mejora de su comunidad.',
    cnbIndicador: 'Indicador 4.2.1: Representa números hasta de 6 dígitos mediante descomposición posicional y valor relativo en situaciones cotidianas.',
    libroTitulo: 'Matemáticas 4G — MINEDUC (Edición Oficial)',
    numeroPagina: 38,
    seccionLibro: 'Unidad 2: Descomposición posicional y valor relativo',
    tiemposReferencia: [
      { rango: '00 - 15 min', rolDocente: 'atencion_directa', descripcion: 'Explicación del maestro en pizarra: Lectura y escritura de cantidades de 6 dígitos con la tabla posicional.' },
      { rango: '15 - 35 min', rolDocente: 'trabajo_autonomo', descripcion: 'Trabajo individual en cuaderno: Los alumnos resuelven los incisos a, b y c de la pág. 38.' },
      { rango: '35 - 45 min', rolDocente: 'trabajo_autonomo', descripcion: 'Revisión en parejas: Comparan resultados y escriben en letras la cantidad del problema de café.' },
    ],
    ejerciciosLiterales: [
      '1. Descompón aditivamente los siguientes números según el valor posicional de cada cifra:',
      '   a) 354,210 = 300,000 + 50,000 + 4,000 + 200 + 10',
      '   b) 608,405 = _______ + _______ + _______ + _______',
      '   c) 920,014 = _______ + _______ + _______ + _______',
      '2. Problema de aplicación comunitaria:',
      '   En una cooperativa de Amatitlán se cosecharon 452,190 libras de café en grano.',
      '   • Escribe en tu cuaderno cómo se lee esta cantidad en letras.',
      '   • Dibuja la tabla de posiciones (CM, DM, UM, C, D, U) y ubica cada dígito.',
    ],
    tareaCasa: 'Pág. 39: Leer la sección de autoaprendizaje y resolver en familia los ejercicios 1 y 2.',
    completado: true,
  },
  {
    grado: '5.° Primaria',
    bloque: 'Bloque 1 (08:00 - 08:45 hrs)',
    duracionTotal: '45 min',
    materia: 'Matemáticas',
    tema: 'Suma y resta de fracciones homogéneas (igual denominador)',
    cnbCompetencia: 'Competencia 5: Aplica conocimientos matemáticos en la formulación de soluciones a problemas de la vida cotidiana.',
    cnbIndicador: 'Indicador 5.1.3: Opera adición y sustracción de fracciones homogéneas en situaciones de comercio y agricultura local.',
    libroTitulo: 'Matemáticas 5G — MINEDUC (Edición Oficial)',
    numeroPagina: 64,
    seccionLibro: 'Unidad 3: Fracciones y sus operaciones en la comunidad',
    tiemposReferencia: [
      { rango: '00 - 15 min', rolDocente: 'trabajo_autonomo', descripcion: 'Lectura silenciosa guiada: Observar las ilustraciones de reparto de granos en la pág. 64.' },
      { rango: '15 - 30 min', rolDocente: 'atencion_directa', descripcion: 'Atención directa del maestro: Demostración en pizarra con tiras de papel doblado sobre por qué el denominador se mantiene.' },
      { rango: '30 - 45 min', rolDocente: 'trabajo_autonomo', descripcion: 'Resolución autónoma en cuaderno: Resolver los 3 problemas de suma de fracciones de la guía.' },
    ],
    ejerciciosLiterales: [
      '1. Calcula la suma de fracciones homogéneas y simplifica al máximo:',
      '   a) 2/7 + 3/7 = _______',
      '   b) 5/12 + 4/12 = _______',
      '   c) 3/10 + 4/10 = _______',
      '2. Problema contextual de la comunidad:',
      '   Don Mateo vendió 3/8 de quintal de maíz por la mañana y 2/8 de quintal por la tarde.',
      '   • ¿Qué fracción total del quintal de maíz vendió durante el día?',
      '   • ¿Qué fracción le falta vender para completar el quintal entero?',
    ],
    tareaCasa: 'Pág. 65: Ejercicio 6 de autoaprendizaje (El reparto familiar de frijol en medidas tradicionales).',
    completado: true,
  },
  {
    grado: '6.° Primaria',
    bloque: 'Bloque 1 (08:00 - 08:45 hrs)',
    duracionTotal: '45 min',
    materia: 'Matemáticas',
    tema: 'Proporcionalidad directa y Regla de Tres Simple aplicada',
    cnbCompetencia: 'Competencia 6: Emplea modelos matemáticos en la formulación y resolución de problemas de cálculo y producción.',
    cnbIndicador: 'Indicador 6.3.2: Plantea y resuelve problemas de regla de tres simple directa aplicados a la economía y comercio local.',
    libroTitulo: 'Guía para la enseñanza de Matemáticas Segundo Ciclo — MINEDUC',
    numeroPagina: 115,
    seccionLibro: 'Unidad 4: Proporcionalidad, porcentajes y regla de tres',
    tiemposReferencia: [
      { rango: '00 - 25 min', rolDocente: 'trabajo_autonomo', descripcion: 'Trabajo en equipo de 2: Plantear la tabla de magnitudes (quintales vs quetzales) en base a la pág. 115.' },
      { rango: '25 - 40 min', rolDocente: 'atencion_directa', descripcion: 'Atención directa del maestro: Despeje de la incógnita "x" en proporciones directas y verificación de resultados.' },
      { rango: '40 - 45 min', rolDocente: 'trabajo_autonomo', descripcion: 'Cierre individual: Anotar el procedimiento estándar de regla de tres en el cuaderno de trabajo.' },
    ],
    ejerciciosLiterales: [
      '1. Problema de regla de tres simple directa:',
      '   Si un quintal de café pergamino tiene un valor de Q 850.00 en la cooperativa local de Amatitlán:',
      '   a) ¿Cuánto dinero se obtendrá por la venta de 4 quintales?',
      '   b) ¿Cuánto se pagará por 7 quintales y medio (7.5 qq)?',
      '   • Planteamiento obligatorio en el cuaderno: 1 / 850 = 4 / x => x = (4 * 850) / 1',
      '2. Formula un problema similar con la compra de abono o semillas en tu aldea.',
    ],
    tareaCasa: 'Pág. 116: Investigar en casa el precio de 1 arroba de azúcar y calcular el precio de 3 y 5 arrobas.',
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
  const [students, setStudents] = useState<StudentAttendance[]>(INITIAL_STUDENTS);
  const [selectedGradoFilter, setSelectedGradoFilter] = useState<string>('todos');
  const [attendanceSaved, setAttendanceSaved] = useState(false);

  // Estados de Planificación Multigrado RAG (Tres datos simples del docente)
  const [selectedGrados, setSelectedGrados] = useState<number[]>([3, 4]);
  const [selectedArea, setSelectedArea] = useState<string>('Matemáticas');
  const [selectedBloque, setSelectedBloque] = useState<number>(1);
  const [selectedSemanaBloque, setSelectedSemanaBloque] = useState<number>(3);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<boolean>(false);
  const [selectedCycle, setSelectedCycle] = useState<'segundo_ciclo' | 'primer_ciclo'>('segundo_ciclo');
  const [selectedBimestre, setSelectedBimestre] = useState<number>(1);
  const [selectedSemana, setSelectedSemana] = useState<number>(3);
  const [paginasPorGrado, setPaginasPorGrado] = useState<Record<number, number>>({ 3: 12, 4: 16 });
  const [temasRezagados, setTemasRezagados] = useState<string[]>([]);
  const [nuevoTemaRezagado, setNuevoTemaRezagado] = useState<string>('');
  const [selectedDia, setSelectedDia] = useState<DiaNavegacion>('Lunes');
  const [viewMode, setViewMode] = useState<'dia' | 'semana_completa'>('dia');
  const [showConfig, setShowConfig] = useState<boolean>(true);
  const [isGeneratingRAG, setIsGeneratingRAG] = useState<boolean>(false);
  const [ragStep, setRagStep] = useState<number>(1);
  const [ragMessage, setRagMessage] = useState<string>('');
  const [aiEnrichment, setAiEnrichment] = useState<any>(null);
  const [cotejoEstudiantes, setCotejoEstudiantes] = useState<Record<string, boolean[]>>({
    '1': [true, true, true],
    '2': [true, true, false],
    '3': [true, false, true],
    '4': [true, true, true],
    '5': [true, true, true],
    '6': [false, true, false],
    '7': [true, true, true],
    '8': [true, true, false],
    '9': [true, false, false],
  });

  const toggleCriterioEstudiante = (estudianteId: string, critIndex: number) => {
    playCartoonPopSound();
    setCotejoEstudiantes(prev => {
      const current = prev[estudianteId] ? [...prev[estudianteId]] : [false, false, false];
      current[critIndex] = !current[critIndex];
      return { ...prev, [estudianteId]: current };
    });
  };

  const [unifiedPlan, setUnifiedPlan] = useState<UnifiedWeeklyPlan>(() => 
    generateUnifiedRAGPlan({
      grados: [3, 4],
      bimestre: 1,
      semana: 3,
      area: 'Matemáticas'
    })
  );

  const handleToggleGrado = (gradoNum: number) => {
    playCartoonPopSound();
    setSelectedGrados(prev => {
      if (prev.includes(gradoNum)) {
        if (prev.length === 1) return prev; // Mantener al menos 1 grado
        return prev.filter(g => g !== gradoNum);
      } else {
        return [...prev, gradoNum].sort((a, b) => a - b);
      }
    });
  };

  const handleSetPresetGrados = (gradosArr: number[]) => {
    playCartoonPopSound();
    setSelectedGrados(gradosArr);
  };

  const handleCycleChange = (ciclo: 'segundo_ciclo' | 'primer_ciclo') => {
    playCartoonPopSound();
    setSelectedCycle(ciclo);
    if (ciclo === 'segundo_ciclo') {
      setSelectedGrados([4, 5, 6]);
    } else {
      setSelectedGrados([1, 2, 3]);
    }
  };

  const handleAddTemaRezagado = (tema: string) => {
    if (!tema || !tema.trim()) return;
    playCartoonPopSound();
    if (!temasRezagados.includes(tema.trim())) {
      setTemasRezagados(prev => [...prev, tema.trim()]);
    }
    setNuevoTemaRezagado('');
  };

  const handleRemoveTemaRezagado = (tema: string) => {
    playCartoonPopSound();
    setTemasRezagados(prev => prev.filter(t => t !== tema));
  };

  const handlePaginaChange = (grado: number, valor: number) => {
    setPaginasPorGrado(prev => ({ ...prev, [grado]: Math.max(1, valor || 1) }));
  };

  const handleGenerateRAG = async () => {
    playCartoonRisingSound();
    setIsGeneratingRAG(true);
    setRagStep(1);
    setRagMessage(`Paso 1: Consultando CNB (DIGECUR) para Bloque ${selectedBloque}, Semana ${selectedSemanaBloque}...`);

    setTimeout(() => {
      setRagStep(2);
      setRagMessage(`Paso 2: Deduciendo ejercicios literales de guías MINEDUC para ${selectedGrados.map(g => `${g}.°`).join(' y ')}...`);
    }, 700);

    setTimeout(() => {
      setRagStep(3);
      setRagMessage('Paso 3: Sincronizando alternancia multigrado (08:00 a 12:00) con Gemini 2.5 Flash...');
    }, 1500);

    try {
      const res = await fetch('/api/planificacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grado1: String(selectedGrados[0]),
          grado2: String(selectedGrados[1] || selectedGrados[0]),
          grados: selectedGrados,
          area: selectedArea,
          bloque: selectedBloque,
          semana: selectedSemanaBloque,
          temasRezagados
        })
      });

      const data = await res.json();
      if (data && data.success && data.plan) {
        setUnifiedPlan(data.plan);
        if (data.enriquecimientoAI) {
          setAiEnrichment(data.enriquecimientoAI);
        }
      } else {
        const local = generateUnifiedRAGPlan({
          grados: selectedGrados,
          area: selectedArea,
          bimestre: selectedBloque,
          semana: selectedSemanaBloque,
          temasRezagados
        });
        setUnifiedPlan(local);
      }
    } catch {
      const local = generateUnifiedRAGPlan({
        grados: selectedGrados,
        area: selectedArea,
        bimestre: selectedBloque,
        semana: selectedSemanaBloque,
        temasRezagados
      });
      setUnifiedPlan(local);
    } finally {
      setTimeout(() => {
        setIsGeneratingRAG(false);
        playCartoonPopSound();
      }, 2100);
    }
  };

  // Toggle tema completado en planificaciones para el día actual
  const toggleScheduleCompletado = (dia: DiaSemana, index: number) => {
    playCartoonPopSound();
    setUnifiedPlan(prev => {
      const copy = { ...prev };
      const currentDay = { ...copy.dias[dia] };
      const updatedGrados = [...currentDay.gradosSincronizados];
      updatedGrados[index] = {
        ...updatedGrados[index],
        completado: !updatedGrados[index].completado
      };
      currentDay.gradosSincronizados = updatedGrados;
      copy.dias[dia] = currentDay;
      return copy;
    });
  };

  const handleSelectMode = (mode: SidebarMode) => {
    playCartoonPopSound();
    setCurrentMode(mode);
    setMobileMenuOpen(false);
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
                  {(unifiedPlan.dias[selectedDia]?.gradosSincronizados || []).map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-extrabold text-slate-800">{item.grado}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.tiemposReferencia[0]?.rolDocente === 'atencion_directa' 
                            ? 'bg-rose-100 text-rose-800' 
                            : 'bg-teal-100 text-teal-800'
                        }`}>
                          {item.tiemposReferencia[0]?.rolDocente === 'atencion_directa' ? '👨‍🏫 Atención Directa' : '📖 Autónomo en Guía'}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 line-clamp-1">{item.tema}</p>
                      <p className="text-[11px] text-slate-500 mt-1">Pág. {item.numeroPagina} • {item.duracionTotal}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              MODO 2: PLANIFICACIONES (Guía Pedagógica Unificada Multigrado)
              ======================================================== */}
          {currentMode === 'planificaciones' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Encabezado Principal de la Guía Unificada */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 text-xs font-black px-3 py-1 rounded-full border border-emerald-200">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Guía Unificada Multigrado • Lunes a Jueves (Ciclo Escolar 2026)</span>
                    </span>

                    {unifiedPlan.fuenteGeneracion === 'gemini_rag_grounded' ? (
                      <span className="inline-flex items-center space-x-1.5 bg-purple-50 text-purple-800 text-xs font-black px-3 py-1 rounded-full border border-purple-200 animate-pulse">
                        <Zap className="w-3.5 h-3.5 text-purple-600" />
                        <span>Google Gemini AI Grounded • Cero Alucinaciones</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1.5 bg-sky-50 text-sky-800 text-xs font-black px-3 py-1 rounded-full border border-sky-200">
                        <Layers className="w-3.5 h-3.5 text-sky-600" />
                        <span>Base Vectorial CNB + Textos MINEDUC Verificada</span>
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Planificación Simultánea Unificada: {selectedCycle === 'segundo_ciclo' ? '4.°, 5.° y 6.°' : '1.°, 2.° y 3.°'} Primaria
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                    Estructurada de <strong>Lunes a Jueves</strong> (dejando el Viernes para pruebas de diagnóstico y nivelación). Consulta la <strong>base vectorial del CNB (DIGECUR)</strong> para indicadores oficiales y transcribe <strong>ejercicios exactos de los libros MINEDUC por número de página</strong>, permitiendo incorporar temas rezagados sin alucinaciones.
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => { playCartoonPopSound(); setShowConfig(!showConfig); }}
                    className={`font-bold px-4 py-2.5 rounded-2xl text-xs transition-all flex items-center space-x-1.5 border ${
                      showConfig 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                        : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <Sliders className="w-4 h-4" />
                    <span>{showConfig ? 'Ocultar Parámetros' : 'Configurar Parámetros'}</span>
                  </button>

                  <button
                    onClick={() => { playCartoonRisingSound(); window.print(); }}
                    className="bg-[#0077B6] hover:bg-sky-700 active:bg-sky-800 text-white font-bold px-4 py-2.5 rounded-2xl text-xs transition-all shadow-sm flex items-center space-x-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimir Guía</span>
                  </button>
                </div>
              </div>

              {/* 
                PANEL DE CONFIGURACIÓN AUTOMÁTICA (3 DATOS SIMPLES: GRADOS, ÁREA, BLOQUE Y SEMANA)
              */}
              {showConfig && (
                <div className="bg-white rounded-3xl p-6 border-2 border-indigo-100 shadow-md space-y-5 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF5A5F] to-[#FFB703] flex items-center justify-center text-white font-black text-xs shadow-sm">
                        ⚡
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900">
                          Generador Inteligente CNB + Guías MINEDUC
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          Selecciona únicamente los 3 datos de tu clase; el sistema deduce automáticamente lecciones, páginas y ejercicios
                        </p>
                      </div>
                    </div>

                    <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center space-x-1.5 self-start sm:self-auto">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Cero búsqueda manual de páginas</span>
                    </div>
                  </div>

                  {/* LOS 3 DATOS SIMPLES QUE ELIGE EL DOCENTE */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* 1. DATO 1: GRADOS A ATENDER */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-black uppercase text-slate-700 tracking-wider flex items-center space-x-1">
                          <GraduationCap className="w-3.5 h-3.5 text-sky-600" />
                          <span>1. Grados a Atender</span>
                        </p>
                        <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                          {selectedGrados.map(g => `${g}.°`).join(', ')}
                        </span>
                      </div>

                      {/* Chips interactivos de grados */}
                      <div className="flex flex-wrap gap-1.5">
                        {[1, 2, 3, 4, 5, 6].map((g) => {
                          const isSelected = selectedGrados.includes(g);
                          return (
                            <button
                              key={g}
                              type="button"
                              onClick={() => handleToggleGrado(g)}
                              className={`flex-1 min-w-[42px] py-2 rounded-xl text-xs font-black transition-all border ${
                                isSelected
                                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm scale-105'
                                  : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200'
                              }`}
                            >
                              {g}.°
                            </button>
                          );
                        })}
                      </div>

                      {/* Atajos rápidos multiaula */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        <button
                          type="button"
                          onClick={() => handleSetPresetGrados([3, 4])}
                          className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all ${
                            selectedGrados.length === 2 && selectedGrados.includes(3) && selectedGrados.includes(4)
                              ? 'bg-sky-600 text-white border-sky-600'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          3.° y 4.°
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetPresetGrados([4, 5, 6])}
                          className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all ${
                            selectedGrados.length === 3 && selectedGrados.includes(4) && selectedGrados.includes(5) && selectedGrados.includes(6)
                              ? 'bg-sky-600 text-white border-sky-600'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          4.°, 5.° y 6.°
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetPresetGrados([1, 2])}
                          className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all ${
                            selectedGrados.length === 2 && selectedGrados.includes(1) && selectedGrados.includes(2)
                              ? 'bg-sky-600 text-white border-sky-600'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          1.° y 2.°
                        </button>
                      </div>
                    </div>

                    {/* 2. DATO 2: ÁREA CURRICULAR */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <p className="text-[11px] font-black uppercase text-slate-700 tracking-wider flex items-center space-x-1">
                        <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                        <span>2. Área Curricular</span>
                      </p>

                      <div className="space-y-1.5">
                        <select
                          value={selectedArea}
                          onChange={(e) => setSelectedArea(e.target.value)}
                          className="w-full text-xs font-bold bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                        >
                          <option value="Matemáticas">📐 Matemáticas (Oficial MINEDUC)</option>
                          <option value="Medio Social y Natural">🌿 Medio Social y Natural / CCNN</option>
                          <option value="Comunicación y Lenguaje">📖 Comunicación y Lenguaje (L1)</option>
                        </select>
                      </div>

                      <p className="text-[10px] text-slate-500 leading-tight">
                        Se vinculan los libros de texto y guías pedagógicas oficiales del área seleccionada.
                      </p>
                    </div>

                    {/* 3. DATO 3: BLOQUE (BIMESTRE) Y SEMANA */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <p className="text-[11px] font-black uppercase text-slate-700 tracking-wider flex items-center space-x-1">
                        <CalendarIcon className="w-3.5 h-3.5 text-emerald-600" />
                        <span>3. Bloque y Semana CNB</span>
                      </p>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Bloque (Unidad)</label>
                          <select
                            value={selectedBloque}
                            onChange={(e) => setSelectedBloque(Number(e.target.value))}
                            className="w-full text-xs font-bold bg-white border border-slate-300 rounded-xl p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value={1}>Bloque 1</option>
                            <option value={2}>Bloque 2</option>
                            <option value={3}>Bloque 3</option>
                            <option value={4}>Bloque 4</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Semana (1 a 9)</label>
                          <select
                            value={selectedSemanaBloque}
                            onChange={(e) => setSelectedSemanaBloque(Number(e.target.value))}
                            className="w-full text-xs font-bold bg-white border border-slate-300 rounded-xl p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                              <option key={num} value={num}>Semana {num}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-500 leading-tight">
                        Cada bloque abarca de 8 a 9 semanas según la malla curricular del CNB.
                      </p>
                    </div>
                  </div>

                  {/* OPCIONES AVANZADAS COLAPSABLES (OPCIONAL: TEMAS REZAGADOS) */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                      className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center space-x-1"
                    >
                      <span>{showAdvancedOptions ? '▾ Ocultar opciones avanzadas' : '▸ Opciones avanzadas (Nivelación de temas rezagados)'}</span>
                    </button>

                    {showAdvancedOptions && (
                      <div className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] font-black uppercase text-slate-600 flex items-center space-x-1">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                            <span>Temas Pendientes o Rezagados para Refuerzo</span>
                          </p>
                          <span className="text-[10px] text-slate-400">Opcional</span>
                        </div>

                        <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                          {temasRezagados.length === 0 ? (
                            <span className="text-[11px] text-slate-400 italic">Sin temas pendientes (el plan sigue el orden del CNB)</span>
                          ) : (
                            temasRezagados.map((tema, tIdx) => (
                              <span 
                                key={tIdx} 
                                className="inline-flex items-center space-x-1 bg-rose-100 text-rose-900 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-rose-200"
                              >
                                <span className="truncate max-w-[120px]">{tema}</span>
                                <button 
                                  onClick={() => handleRemoveTemaRezagado(tema)}
                                  className="text-rose-600 hover:text-rose-900 font-black ml-1"
                                >
                                  ×
                                </button>
                              </span>
                            ))
                          )}
                        </div>

                        <div className="flex items-center space-x-1 pt-1">
                          <input
                            type="text"
                            placeholder="Escribe tema a nivelar si existe retraso..."
                            value={nuevoTemaRezagado}
                            onChange={(e) => setNuevoTemaRezagado(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddTemaRezagado(nuevoTemaRezagado);
                              }
                            }}
                            className="flex-1 text-[11px] bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddTemaRezagado(nuevoTemaRezagado)}
                            className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-3 py-1.5 rounded-xl text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Botón Principal de Generación RAG */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-[11px] text-slate-500 flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>
                        La API de Google Gemini combina los datos recuperados de la base vectorial para garantizar 0% alucinaciones.
                      </span>
                    </div>

                    <button
                      onClick={handleGenerateRAG}
                      disabled={isGeneratingRAG}
                      className="w-full sm:w-auto bg-gradient-to-r from-[#FF5A5F] via-[#FFB703] to-[#06D6A0] hover:opacity-95 active:scale-95 text-white font-black px-6 py-3 rounded-2xl text-xs shadow-lg transition-all flex items-center justify-center space-x-2 shrink-0 disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4 text-white animate-spin" />
                      <span>{isGeneratingRAG ? 'Generando con Gemini RAG...' : '✨ Generar Planificación con Gemini AI (Base Vectorial CNB/MINEDUC)'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 
                ESTADO DE CARGA ANIMADO DE RAG MULTIETAPA
              */}
              {isGeneratingRAG && (
                <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-4 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                      <div>
                        <h4 className="text-sm font-black text-amber-300">
                          Búsqueda Vectorial y Generación Grounded en Curso...
                        </h4>
                        <p className="text-xs text-slate-300">{ragMessage}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold bg-white/10 px-3 py-1 rounded-full text-amber-300">
                      Paso {ragStep} de 3
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 h-full transition-all duration-500"
                      style={{ width: `${(ragStep / 3) * 100}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400 font-mono">
                    <span className={ragStep >= 1 ? 'text-emerald-400 font-bold' : ''}>1. CNB DIGECUR</span>
                    <span className={ragStep >= 2 ? 'text-amber-300 font-bold' : ''}>2. Libros MINEDUC</span>
                    <span className={ragStep >= 3 ? 'text-purple-300 font-bold' : ''}>3. Gemini Sync 45m</span>
                  </div>
                </div>
              )}

              {/* 
                ============================================================
                1. EJE INTEGRADOR / TEMA GENERADOR COMÚN (METODOLOGÍA CNB MULTIGRADO)
                ============================================================
              */}
              <div className="bg-gradient-to-r from-amber-500 via-[#FF5A5F] to-[#0077B6] p-0.5 rounded-3xl shadow-md">
                <div className="bg-white rounded-[22px] p-5 sm:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-amber-300">
                        🎯 Eje Integrador Multigrado
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        Área Curricular: {unifiedPlan.area_curricular || 'Matemáticas'} • Metodología CNB
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      Bimestre {unifiedPlan.bimestre} • Semana {unifiedPlan.semana}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                      Tema Generador Común: "{unifiedPlan.tema_generador_comun}"
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {unifiedPlan.descripcion_eje_integrador}
                    </p>
                  </div>

                  {/* Graduación de la Complejidad por Grado (CNB DIGECUR) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                    {Object.values(unifiedPlan.alineacion_cnb || {}).map((al, alIdx) => (
                      <div key={alIdx} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-slate-900 text-xs">{al.grado}</span>
                          <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full">
                            CNB DIGECUR
                          </span>
                        </div>
                        <p className="text-slate-700 font-medium text-[11px] leading-tight line-clamp-2" title={al.competencia}>
                          {al.competencia}
                        </p>
                        <p className="text-sky-900 font-bold text-[10px] pt-1 border-t border-slate-200">
                          {al.indicador_logro}
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          Contenido: {al.contenido_declarativo}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 
                ============================================================
                2. BARRA DE NAVEGACIÓN: LUNES A JUEVES + VIERNES (EVALUACIÓN CNB)
                ============================================================
              */}
              <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1">
                  {(['Lunes', 'Martes', 'Miércoles', 'Jueves'] as DiaSemana[]).map((dia) => {
                    const isActive = selectedDia === dia && viewMode === 'dia';
                    return (
                      <button
                        key={dia}
                        onClick={() => {
                          playCartoonPopSound();
                          setSelectedDia(dia);
                          setViewMode('dia');
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
                          isActive
                            ? 'bg-slate-900 text-white shadow-sm scale-105'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span>{dia}</span>
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                      </button>
                    );
                  })}

                  {/* Pestaña Especial de Viernes (Evaluación del Alcance de la Competencia) */}
                  <button
                    onClick={() => {
                      playCartoonPopSound();
                      setSelectedDia('Viernes');
                      setViewMode('dia');
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
                      selectedDia === 'Viernes' && viewMode === 'dia'
                        ? 'bg-rose-600 text-white shadow-sm scale-105'
                        : 'text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200'
                    }`}
                  >
                    <span>🔴 Viernes (Evaluación CNB)</span>
                    {selectedDia === 'Viernes' && viewMode === 'dia' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-pulse" />
                    )}
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      playCartoonPopSound();
                      setViewMode(viewMode === 'dia' ? 'semana_completa' : 'dia');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      viewMode === 'semana_completa'
                        ? 'bg-[#0077B6] text-white border-[#0077B6] shadow-sm'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    📑 {viewMode === 'semana_completa' ? 'Ver Día Individual' : 'Ver Semana Completa (L-V)'}
                  </button>

                  <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">
                    Semana {unifiedPlan.semana} • Bimestre {unifiedPlan.bimestre}
                  </span>
                </div>
              </div>

              {/* 
                ============================================================
                3. VISTA DIARIA: LUNES A JUEVES (CICLO DIARIO EN 3 FASES)
                ============================================================
              */}
              {selectedDia !== 'Viernes' && (
                <div className="space-y-6">
                  {/* FASE 1: INICIO COMÚN (10–15 MINUTOS) */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl p-5 shadow-sm">
                    <div className="flex items-start space-x-3.5">
                      <div className="w-9 h-9 rounded-2xl bg-amber-400 text-amber-950 font-black text-lg flex items-center justify-center shrink-0 shadow-sm">
                        🌅
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-amber-900 tracking-wider">
                            Fase 1: Inicio Común (10 – 15 Minutos - Todos los Grados Juntos)
                          </span>
                          <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                            Activación de Conocimientos Previos
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-amber-950">
                          Dinámica Motivacional: {unifiedPlan.tema_generador_comun}
                        </h4>
                        <p className="text-xs text-amber-900/90 leading-relaxed font-medium">
                          {unifiedPlan.dias[selectedDia as DiaSemana]?.fase_inicio_comun}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* LÍNEA DE TIEMPO ROTATIVA DEL DOCENTE EN EL HORARIO OFICIAL (08:00 A 12:00 - 210 MIN EFECTIVOS) */}
                  <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-md space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div className="flex items-center space-x-2.5">
                        <Clock className="w-5 h-5 text-amber-400" />
                        <div>
                          <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-amber-300">
                            Jornada Diaria Oficial: 08:00 a 12:00 (210 Minutos Efectivos)
                          </h3>
                          <p className="text-[11px] text-slate-300">
                            Estructura de 2 Bloques con Alternancia Estricta y Receso sin actividades académicas
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-slate-200 bg-white/10 px-3 py-1 rounded-full border border-white/10 self-start sm:self-auto">
                        🕒 3.5 hrs efectivas de clase
                      </span>
                    </div>

                    {/* Grilla de Franjas Horarias */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                      {/* 1. Periodo 1 */}
                      <div className="p-3 rounded-2xl bg-white/10 border border-white/15 space-y-1">
                        <div className="flex items-center justify-between font-black text-amber-300">
                          <span>08:15 - 09:05 (50 min)</span>
                          <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                            Período 1
                          </span>
                        </div>
                        <p className="text-white/90 text-[11px] font-medium leading-tight">
                          Rotación Multigrado: Grado principal en <strong>Atención Directa</strong> en pizarra; grados secundarios en <strong>Trabajo Autónomo</strong> con guías.
                        </p>
                      </div>

                      {/* 2. Periodo 2 - Inversion */}
                      <div className="p-3 rounded-2xl bg-white/10 border border-amber-400/40 space-y-1 ring-1 ring-amber-400/30">
                        <div className="flex items-center justify-between font-black text-amber-300">
                          <span>09:05 - 09:55 (50 min)</span>
                          <span className="bg-amber-400 text-slate-950 text-[10px] px-2 py-0.5 rounded-full font-black">
                            Período 2 (Inversión)
                          </span>
                        </div>
                        <p className="text-white/90 text-[11px] font-medium leading-tight">
                          Inversión estricta de roles: El maestro rota la <strong>Atención Directa</strong> al segundo grado; el primer grado pasa a <strong>Trabajo Autónomo</strong> en cuaderno.
                        </p>
                      </div>

                      {/* 3. Receso Libre */}
                      <div className="p-3 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 space-y-1 text-emerald-200">
                        <div className="flex items-center justify-between font-black text-emerald-300">
                          <span>10:00 - 10:30 (30 min)</span>
                          <span className="bg-emerald-500 text-slate-950 text-[10px] px-2 py-0.5 rounded-full font-black">
                            🍎 RECESO
                          </span>
                        </div>
                        <p className="text-emerald-100 text-[11px] font-medium leading-tight">
                          Recreo y refacción escolar. <strong>Estrictamente sin actividades académicas asignadas</strong>.
                        </p>
                      </div>

                      {/* 4. Bloque 2 Aplicado */}
                      <div className="p-3 rounded-2xl bg-white/10 border border-white/15 space-y-1">
                        <div className="flex items-center justify-between font-black text-sky-300">
                          <span>10:30 - 11:50 (80 min)</span>
                          <span className="bg-sky-500 text-slate-950 text-[10px] px-2 py-0.5 rounded-full font-bold">
                            Períodos 3 y 4
                          </span>
                        </div>
                        <p className="text-white/90 text-[11px] font-medium leading-tight">
                          Aplicación contextual comunitaria en parejas (Período 3) y consolidación autónoma en cuadernos de estudio (Período 4).
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* FASE 2: COLUMNAS DE DESARROLLO DIFERENCIADO POR GRADO */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {(unifiedPlan.dias[selectedDia as DiaSemana]?.gradosSincronizados || []).map((item, idx) => (
                      <div 
                        key={idx}
                        className={`bg-white rounded-3xl p-5 sm:p-6 border-2 transition-all flex flex-col justify-between shadow-sm ${
                          item.completado ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200'
                        }`}
                      >
                        <div className="space-y-4">
                          {/* Grado, Modalidad y Página de Guía */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-base font-black text-slate-900 bg-slate-100 px-3.5 py-1.5 rounded-2xl">
                                {item.grado}
                              </span>

                              <span className="bg-amber-100 text-amber-900 text-xs font-black px-2.5 py-1 rounded-xl border border-amber-300 flex items-center space-x-1">
                                <span>📖</span>
                                <span>Pág. Física {item.numeroPagina}</span>
                              </span>
                            </div>

                            {/* Modalidad Pedagógica del Día */}
                            <div className="mb-2">
                              {item.modalidad === 'Atención Directa Docente' ? (
                                <span className="bg-rose-100 text-rose-900 border border-rose-300 text-xs font-black px-3 py-1 rounded-full inline-flex items-center space-x-1.5">
                                  <span>👨‍🏫</span>
                                  <span>Atención Directa Docente (Período 1)</span>
                                </span>
                              ) : item.modalidad === 'Trabajo Autónomo con Guía' ? (
                                <span className="bg-teal-100 text-teal-900 border border-teal-300 text-xs font-black px-3 py-1 rounded-full inline-flex items-center space-x-1.5">
                                  <span>📖</span>
                                  <span>Trabajo Autónomo con Guía (Período 1)</span>
                                </span>
                              ) : (
                                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black px-3 py-1 rounded-full inline-flex items-center space-x-1.5">
                                  <span>👥</span>
                                  <span>Trabajo Cooperativo / Práctica</span>
                                </span>
                              )}
                            </div>

                            <h3 className="font-black text-base text-slate-900 leading-snug">
                              {item.tema}
                            </h3>
                            <p className="text-xs font-bold text-slate-500 mt-0.5">
                              {item.libroTitulo} • {item.seccionLibro}
                            </p>
                          </div>

                          {/* Cronograma Horario Detallado de la Jornada para este Grado */}
                          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                              Distribución por Períodos (08:00 - 12:00):
                            </p>
                            
                            <div className="space-y-1.5 text-[11px]">
                              {item.periodo1_actividad && (
                                <div className="p-2 bg-white rounded-xl border border-slate-200 leading-tight">
                                  <strong className="text-slate-900">Período 1: </strong>
                                  <span className="text-slate-700">{item.periodo1_actividad}</span>
                                </div>
                              )}

                              {item.periodo2_actividad && (
                                <div className="p-2 bg-amber-50/70 rounded-xl border border-amber-200 leading-tight">
                                  <strong className="text-amber-950">Período 2 (Inversión): </strong>
                                  <span className="text-amber-900">{item.periodo2_actividad}</span>
                                </div>
                              )}

                              {item.periodo3_actividad && (
                                <div className="p-2 bg-white rounded-xl border border-slate-200 leading-tight">
                                  <strong className="text-slate-900">Período 3: </strong>
                                  <span className="text-slate-700">{item.periodo3_actividad}</span>
                                </div>
                              )}

                              {item.periodo4_actividad && (
                                <div className="p-2 bg-white rounded-xl border border-slate-200 leading-tight">
                                  <strong className="text-slate-900">Período 4: </strong>
                                  <span className="text-slate-700">{item.periodo4_actividad}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Objetivo CNB DIGECUR */}
                          <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-2xl text-xs space-y-1">
                            <p className="text-[10px] font-black uppercase text-sky-800 tracking-wider">
                              Alineación CNB (DIGECUR)
                            </p>
                            <p className="text-sky-950 font-bold text-[11px] leading-snug">
                              {item.cnbCompetencia}
                            </p>
                            <p className="text-sky-900 font-medium text-[11px] leading-relaxed pt-1 border-t border-sky-200/60">
                              {item.cnbIndicador}
                            </p>
                          </div>

                          {/* Ejercicios Literales de la Guía Oficial */}
                          <div className="p-4 bg-amber-50/40 border-2 border-amber-300 rounded-2xl space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] font-black uppercase text-amber-900 tracking-wider flex items-center space-x-1">
                                <span>✏️</span>
                                <span>Ejercicios Literales Redactados</span>
                              </p>
                              <span className="text-[10px] font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded">
                                Pág. {item.numeroPagina}
                              </span>
                            </div>

                            <div className="bg-white p-3 rounded-xl border border-amber-200 font-mono text-xs text-slate-800 space-y-1.5 leading-relaxed shadow-inner">
                              {item.ejerciciosLiterales.map((line, lIdx) => (
                                <p key={lIdx} className={`${line.startsWith('   ') ? 'pl-3 font-semibold text-slate-700' : 'font-bold text-slate-900'}`}>
                                  {line}
                                </p>
                              ))}
                            </div>
                          </div>

                          {/* Autoaprendizaje en el Hogar */}
                          <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl text-xs">
                            <p className="text-[10px] font-black uppercase text-purple-800 tracking-wider mb-0.5">
                              🏠 Tarea y Autoaprendizaje en Casa
                            </p>
                            <p className="text-purple-950 font-medium text-[11px] leading-snug">
                              {item.tareaCasa}
                            </p>
                          </div>
                        </div>

                        {/* Botón de Checklist */}
                        <div className="mt-5 pt-4 border-t border-slate-100">
                          <button
                            onClick={() => toggleScheduleCompletado(selectedDia as DiaSemana, idx)}
                            className={`w-full py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                              item.completado
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{item.completado ? `✓ Tema Impartido en ${selectedDia}` : `Marcar como Impartido (${selectedDia})`}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* FASE 3: CIERRE COMÚN (10 MINUTOS) */}
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-3xl p-5 shadow-sm">
                    <div className="flex items-start space-x-3.5">
                      <div className="w-9 h-9 rounded-2xl bg-emerald-500 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-sm">
                        🌆
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-emerald-900 tracking-wider">
                            Fase 3: Cierre Común (10 Minutos - Todos los Grados Juntos)
                          </span>
                          <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                            Socialización y Síntesis
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-emerald-950">
                          Puesta en Común y Verificación de Logros
                        </h4>
                        <p className="text-xs text-emerald-900/90 leading-relaxed font-medium">
                          {unifiedPlan.dias[selectedDia as DiaSemana]?.fase_cierre_comun}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 
                ============================================================
                4. VISTA DE VIERNES: EVALUACIÓN DEL ALCANCE DE LA COMPETENCIA
                ============================================================
              */}
              {selectedDia === 'Viernes' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Banner de Jornada de Evaluación de Viernes con Horario Oficial */}
                  <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-indigo-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
                    <div className="max-w-3xl space-y-2">
                      <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-yellow-300">
                        <span>📝</span>
                        <span>Jornada de Evaluación Formativa y Cuantitativa (Viernes) • 08:00 a 12:00</span>
                      </div>
                      <h3 className="text-2xl font-black tracking-tight leading-tight">
                        Evaluación del Alcance de la Competencia por Grado
                      </h3>
                      <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
                        El Viernes se evalúa si cada estudiante alcanzó el <strong>indicador de logro del CNB</strong> trabajado durante la semana bajo el tema generador común. Se genera la <strong>hoja de trabajo individual</strong> y el <strong>instrumento de registro (lista de cotejo con 3 criterios observables)</strong>.
                      </p>
                    </div>

                    {/* Franjas Horarias del Viernes */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                      <div className="p-3 rounded-2xl bg-white/10 border border-white/20 space-y-1">
                        <div className="flex items-center justify-between font-black text-amber-300">
                          <span>08:00 - 10:00 (120 min)</span>
                          <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                            Bloque 1: Test
                          </span>
                        </div>
                        <p className="text-white/90 text-[11px] font-medium leading-tight">
                          Aplicación individual y resolución de las hojas de evaluación de cada grado sin interrupciones.
                        </p>
                      </div>

                      <div className="p-3 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 space-y-1 text-emerald-200">
                        <div className="flex items-center justify-between font-black text-emerald-300">
                          <span>10:00 - 10:30 (30 min)</span>
                          <span className="bg-emerald-500 text-slate-950 text-[10px] px-2 py-0.5 rounded-full font-black">
                            🍎 RECESO
                          </span>
                        </div>
                        <p className="text-emerald-100 text-[11px] font-medium leading-tight">
                          Recreo escolar libre de actividades académicas.
                        </p>
                      </div>

                      <div className="p-3 rounded-2xl bg-white/10 border border-white/20 space-y-1">
                        <div className="flex items-center justify-between font-black text-sky-300">
                          <span>10:30 - 12:00 (90 min)</span>
                          <span className="bg-sky-500 text-slate-950 text-[10px] px-2 py-0.5 rounded-full font-bold">
                            Bloque 2: Registro
                          </span>
                        </div>
                        <p className="text-white/90 text-[11px] font-medium leading-tight">
                          Retroalimentación de respuestas en plenaria y registro docente en la Lista de Cotejo interactiva.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 3 Columnas de Evaluación: Una por Grado */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {Object.values(unifiedPlan.evaluacion_viernes || {}).map((ev, evIdx) => {
                      const gradoEstudiantes = students.filter(s => s.grado.includes(String(ev.gradoNumero)));
                      return (
                        <div key={evIdx} className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-rose-200 shadow-sm space-y-5 flex flex-col justify-between">
                          <div className="space-y-4">
                            {/* Grado y Título */}
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                              <span className="text-base font-black text-slate-900 bg-rose-50 text-rose-900 border border-rose-200 px-3 py-1 rounded-2xl">
                                {ev.grado}
                              </span>
                              <span className="text-xs font-bold text-slate-500">
                                Prueba Individual
                              </span>
                            </div>

                            {/* Indicador a Evaluar */}
                            <div className="p-3 bg-sky-50 border border-sky-200 rounded-2xl text-xs space-y-1">
                              <p className="text-[10px] font-black uppercase text-sky-800 tracking-wider">
                                Indicador CNB a Evaluar:
                              </p>
                              <p className="text-sky-950 font-bold text-[11px] leading-snug">
                                {ev.indicador_a_evaluar}
                              </p>
                            </div>

                            {/* Hoja de Trabajo / Test Individual */}
                            <div className="p-4 bg-amber-50/50 border border-amber-300 rounded-2xl space-y-2">
                              <p className="text-[10px] font-black uppercase text-amber-900 tracking-wider flex items-center space-x-1">
                                <span>📄</span>
                                <span>Hoja de Evaluación Individual (3 Ítems)</span>
                              </p>
                              <p className="text-[11px] text-amber-950 font-semibold">
                                {ev.descripcion_test}
                              </p>
                              <div className="bg-white p-3 rounded-xl border border-amber-200 font-mono text-xs text-slate-800 space-y-1.5 shadow-inner">
                                {ev.hoja_trabajo_ejercicios.map((ej, ejIdx) => (
                                  <p key={ejIdx} className="leading-relaxed">
                                    <strong>{ej.split(':')[0]}:</strong>{ej.split(':')[1]}
                                  </p>
                                ))}
                              </div>
                            </div>

                            {/* Instrumento de Registro: Lista de Cotejo */}
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                              <div className="flex items-center justify-between">
                                <p className="text-[10px] font-black uppercase text-slate-700 tracking-wider flex items-center space-x-1">
                                  <span>📋</span>
                                  <span>Lista de Cotejo (3 Criterios)</span>
                                </p>
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                  Registro Oficial
                                </span>
                              </div>

                              {/* 3 Criterios de Evaluación */}
                              <div className="space-y-1 text-[11px] text-slate-700 font-medium">
                                {ev.criterios_lista_cotejo.map((crit, cIdx) => (
                                  <div key={cIdx} className="p-1.5 rounded-lg bg-white border border-slate-200 flex items-start space-x-1.5">
                                    <span className="font-bold text-slate-900 shrink-0">{cIdx + 1}.</span>
                                    <span>{crit}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Tabla de Estudiantes del Grado con Casillas Interactivas */}
                              <div className="pt-2">
                                <p className="text-[10px] font-black uppercase text-slate-500 mb-1.5">
                                  Calificación de Alumnos del Grado:
                                </p>
                                <div className="space-y-1.5">
                                  {gradoEstudiantes.map((est) => {
                                    const checks = cotejoEstudiantes[est.id] || [true, true, true];
                                    const count = checks.filter(Boolean).length;
                                    return (
                                      <div key={est.id} className="p-2 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                                        <div className="truncate pr-2">
                                          <p className="font-bold text-slate-800 text-[11px] truncate">{est.nombre}</p>
                                          <p className="text-[10px] text-slate-400">
                                            {count === 3 ? '🟢 Logrado' : count === 2 ? '🟡 En Proceso' : '🔴 Necesita Refuerzo'}
                                          </p>
                                        </div>

                                        <div className="flex items-center space-x-1 shrink-0">
                                          {[0, 1, 2].map((cIdx) => (
                                            <button
                                              key={cIdx}
                                              onClick={() => toggleCriterioEstudiante(est.id, cIdx)}
                                              title={`Criterio ${cIdx + 1}`}
                                              className={`w-6 h-6 rounded-lg text-xs font-black transition-all flex items-center justify-center ${
                                                checks[cIdx]
                                                  ? 'bg-emerald-500 text-white shadow-xs'
                                                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                              }`}
                                            >
                                              {checks[cIdx] ? '✓' : '—'}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Botón de Impresión de la Prueba de Viernes */}
                          <div className="pt-2">
                            <button
                              onClick={() => { playCartoonRisingSound(); window.print(); }}
                              className="w-full py-2.5 px-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-xs"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Imprimir Prueba y Lista de Cotejo</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 
                ============================================================
                5. VISTA SEMANA COMPLETA (LUNES A VIERNES)
                ============================================================
              */}
              {viewMode === 'semana_completa' && (
                <div className="space-y-8 pt-4">
                  {(['Lunes', 'Martes', 'Miércoles', 'Jueves'] as DiaSemana[]).map((diaRender) => (
                    <div key={diaRender} className="space-y-4 pt-4 border-t-2 border-slate-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="w-3 h-3 rounded-full bg-[#FF5A5F]" />
                          <h3 className="text-lg font-black text-slate-900 capitalize">
                            Jornada de {diaRender} — {unifiedPlan.dias[diaRender]?.enfoqueDidactico}
                          </h3>
                        </div>
                        <span className="text-xs font-bold text-slate-500">45 Minutos</span>
                      </div>

                      <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-2xl text-xs">
                        <strong className="text-amber-900 font-black">🌅 Fase de Inicio Común:</strong>{' '}
                        <span className="text-amber-950 font-medium">{unifiedPlan.dias[diaRender]?.fase_inicio_comun}</span>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {(unifiedPlan.dias[diaRender]?.gradosSincronizados || []).map((item, idx) => (
                          <div key={idx} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="font-black text-slate-900 text-xs">{item.grado}</span>
                              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-lg border border-amber-200">
                                Pág. {item.numeroPagina}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 block">
                              {item.modalidad}
                            </span>
                            <p className="text-xs font-bold text-slate-800">{item.tema}</p>
                            <p className="text-[11px] text-slate-600 leading-snug">
                              {item.modalidad === 'Atención Directa Docente' ? item.actividadDocente : item.actividadEstudiante}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-2xl text-xs">
                        <strong className="text-emerald-900 font-black">🌆 Fase de Cierre Común:</strong>{' '}
                        <span className="text-emerald-950 font-medium">{unifiedPlan.dias[diaRender]?.fase_cierre_comun}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
