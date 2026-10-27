'use client';

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Printer,
  Layers,
  Clock,
  CheckCircle2,
  BookOpen,
  GraduationCap,
  Calendar,
  ChevronRight,
  FileText,
  AlertCircle,
  HelpCircle,
  Zap,
  Check,
  Bookmark,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  generateUnifiedRAGPlan,
  UnifiedWeeklyPlan,
  DiaSemana
} from '../../utils/ragEngine';
import {
  getMateriasPorGrado,
  getAsignaturasComplementarias,
  MateriaPlanificable,
  UnidadIndice,
  TemaIndice
} from '../../utils/indicesLibrosMineduc';
import {
  analizarRelacionTemasMismaMateria,
  ResultadoRelacionTemasMateria
} from '../../utils/machineLearningPlanning';

// Estructura por grado y materia: qué unidad y qué temas (múltiples) tiene seleccionados
interface MateriaConfig {
  unidadNum: number;
  selectedTemaNums: number[]; // Soporta selección simultánea de múltiples temas
}

export const PlanificadorOficialMineduc: React.FC = () => {
  // ── 1. Grados seleccionados ──
  const [selectedGrados, setSelectedGrados] = useState<number[]>([]);

  // ── 2. Materias activas seleccionadas globalmente para planificar simultáneamente ──
  const [selectedMateriaIds, setSelectedMateriaIds] = useState<string[]>([
    'matematicas', 'comunicacion', 'medio_social', 'ciencias_naturales', 'ciencias_sociales'
  ]);

  // ── 3. Matriz de configuración: [grado][materiaId] => { unidadNum, selectedTemaNums: [] } ──
  const [configMatrix, setConfigMatrix] = useState<Record<number, Record<string, MateriaConfig>>>({});

  // ── 4. Unidad Global Seleccionada (1-4) para cálculo inteligente de cuota semanal CNB ──
  const [selectedUnidadGlobal, setSelectedUnidadGlobal] = useState<number>(1);

  // Cálculo inteligente de cuota semanal según número de grados y ponderación oficial del CNB (RF-02)
  const calculateTemaQuota = (
    materiaNombre: string, 
    periodosSemanales: number, 
    numGrados: number = 1
  ): number => {
    const mLower = (materiaNombre || '').toLowerCase();
    
    // 1. Áreas Troncales Diarias (5 períodos/semana en CNB): 4 sesiones de Lunes a Jueves (Viernes evaluación diagnóstica)
    if (mLower.includes('matemática') || mLower.includes('comunic') || mLower.includes('lengua')) {
      return 4;
    }

    // 2. Ciencias Naturales y Tecnología (2-3 períodos/semana en CNB): Se imparte 2 días (Lunes y Miércoles)
    if ((mLower.includes('natural') || mLower.includes('ciencia')) && !mLower.includes('social')) {
      return 2;
    }

    // 3. Ciencias Sociales y Formación Ciudadana (2-3 períodos/semana en CNB): Se imparte 2 días (Martes y Jueves)
    if (mLower.includes('social') || mLower.includes('ciudad') || mLower.includes('historia')) {
      return 2;
    }

    // 4. Medio Social y Natural (Ciclo I: 1.°, 2.°, 3.°): Área integrada con 3 a 4 períodos semanales
    if (mLower.includes('medio')) {
      return numGrados > 1 ? 3 : 4;
    }

    // 5. Áreas complementarias del CNB (Expresión Artística, Productividad, Ed. Física): 1 a 2 períodos semanales
    if (periodosSemanales <= 2 || mLower.includes('artíst') || mLower.includes('productiv') || mLower.includes('física')) {
      return 1;
    }

    return 2;
  };

  // Función que calcula y autoselecciona los temas óptimos por unidad y grado
  const applyIntelligentAutoSelection = (
    unidadTarget: number,
    gradosList: number[],
    materiaIdsList: string[]
  ) => {
    const numGrados = Math.max(gradosList.length, 1);
    setConfigMatrix(prev => {
      const nextMatrix: Record<number, Record<string, MateriaConfig>> = { ...prev };
      gradosList.forEach(g => {
        const mats = getMateriasPorGrado(g);
        if (!nextMatrix[g]) nextMatrix[g] = {};

        mats.forEach(mat => {
          const idBase = mat.id.replace(/_\d+$/, '');
          if (!materiaIdsList.includes(idBase)) return;

          const uni = mat.unidades.find(u => u.unidad === unidadTarget) || mat.unidades[0];
          const safeTemas = (uni?.temas || []).filter(Boolean);
          const quota = calculateTemaQuota(mat.nombre, mat.periodosSemanales, numGrados);
          const autoTemaNums = safeTemas.slice(0, quota).map(t => t.numero);

          nextMatrix[g][idBase] = {
            unidadNum: unidadTarget,
            selectedTemaNums: autoTemaNums.length > 0 ? autoTemaNums : [safeTemas[0]?.numero || 1]
          };
        });
      });
      return nextMatrix;
    });
  };

  
  // Inicializar autoselección inteligente en el montaje inicial
  React.useEffect(() => {
    applyIntelligentAutoSelection(selectedUnidadGlobal, selectedGrados, selectedMateriaIds);
  }, []);

  const handleSelectUnidadGlobal = (uNum: number) => {
    setSelectedUnidadGlobal(uNum);
    applyIntelligentAutoSelection(uNum, selectedGrados, selectedMateriaIds);
  };

  // ── 4. Estado de vistas y resultados ──
  // Generador de las 5 columnas oficiales estructuradas al estilo Guía del Docente MINEDUC (Encabezados por Período de Horario)
  const getColumnasEstructuradas = () => {
    const isMonogrado = selectedGrados.length === 1;
    const gradoUnico = selectedGrados[0] || 3;
    const gradosText = selectedGrados.map(g => `${g}.°`).join(' y ');

    if (isMonogrado) {
      return [
        {
          id: 'col_1',
          habilidadHeader: 'Primer Período',
          habilidadSub: '08:15 – 09:05 h (50 min) · Apertura y Modelado Didáctico',
          tiempo: '08:15 – 09:05 h',
          grupoHeader: `${gradoUnico}.° PRIMARIA · ATENCIÓN DIRECTA Y MODELADO`,
          materiaBase: 'periodo_1'
        },
        {
          id: 'col_2',
          habilidadHeader: 'Segundo Período',
          habilidadSub: '09:05 – 09:55 h (50 min) · Profundización y Ejercitación',
          tiempo: '09:05 – 09:55 h',
          grupoHeader: `${gradoUnico}.° PRIMARIA · TRABAJO EN CUADERNO Y LIBRO`,
          materiaBase: 'periodo_2'
        },
        {
          id: 'col_3',
          habilidadHeader: 'Tercer Período',
          habilidadSub: '10:30 – 11:15 h (45 min) · Indagación, Entorno y Tema Eje',
          tiempo: '10:30 – 11:15 h',
          grupoHeader: `${gradoUnico}.° PRIMARIA · INDAGACIÓN Y APLICACIÓN`,
          materiaBase: 'periodo_3'
        },
        {
          id: 'col_4',
          habilidadHeader: 'Cuarto Período',
          habilidadSub: '11:15 – 11:50 h (35 min) · Áreas Complementarias CNB / Tutoría',
          tiempo: '11:15 – 11:50 h',
          grupoHeader: `${gradoUnico}.° PRIMARIA · EXPRESIÓN Y SÍNTESIS`,
          materiaBase: 'periodo_4'
        },
        {
          id: 'col_5',
          habilidadHeader: 'Libro Oficial MINEDUC y Tareas',
          habilidadSub: 'Sesión Diaria · Páginas Físicas (Todas las Asignaturas)',
          tiempo: 'Sesión Diaria',
          grupoHeader: `${gradoUnico}.° PRIMARIA (Páginas Físicas Exactas)`,
          materiaBase: 'fijacion'
        }
      ];
    }

    const grupoAText = `${selectedGrados[0]}.° Grado`;
    const grupoBText = selectedGrados.slice(1).map(g => `${g}.°`).join(' y ') + ' Grado';

    return [
      {
        id: 'col_1',
        habilidadHeader: 'Primer Período',
        habilidadSub: '08:15 – 09:05 h (50 min) · Apertura y Modelado en Pizarra',
        tiempo: '08:15 – 09:05 h',
        grupoHeader: `GRUPO A (${grupoAText}) · ATENCIÓN DIRECTA`,
        materiaBase: 'periodo_1'
      },
      {
        id: 'col_2',
        habilidadHeader: 'Segundo Período',
        habilidadSub: '09:05 – 09:55 h (50 min) · Rotación a Grupo B / Práctica Guiada',
        tiempo: '09:05 – 09:55 h',
        grupoHeader: `GRUPO B (${grupoBText}) · ATENCIÓN DIRECTA (ROTACIÓN)`,
        materiaBase: 'periodo_2'
      },
      {
        id: 'col_3',
        habilidadHeader: 'Tercer Período',
        habilidadSub: '10:30 – 11:15 h (45 min) · Indagación y Tema Eje Transversal',
        tiempo: '10:30 – 11:15 h',
        grupoHeader: `TODOS LOS GRADOS (${gradosText}) · TEMA EJE`,
        materiaBase: 'periodo_3'
      },
      {
        id: 'col_4',
        habilidadHeader: 'Cuarto Período',
        habilidadSub: '11:15 – 11:50 h (35 min) · Áreas Complementarias CNB / Tutoría',
        tiempo: '11:15 – 11:50 h',
        grupoHeader: 'GRUPOS MIXTOS · TUTORÍA ENTRE PARES Y CUADERNO',
        materiaBase: 'periodo_4'
      },
      {
        id: 'col_5',
        habilidadHeader: 'Libro Oficial MINEDUC y Tareas',
        habilidadSub: 'Sesión Diaria · Páginas Físicas (Todas las Asignaturas)',
        tiempo: 'Sesión Diaria',
        grupoHeader: 'CADA GRADO (Páginas Físicas Exactas por Asignatura)',
        materiaBase: 'fijacion'
      }
    ];
  };

  const [activeTab, setActiveTab] = useState<'plan_semanal' | 'evaluacion_viernes' | 'asignaturas_cnb'>('plan_semanal');
  const [selectedDiaVista, setSelectedDiaVista] = useState<DiaSemana | 'Viernes' | 'todos'>('todos');
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<UnifiedWeeklyPlan | null>(null);
  const [isSavingCheckin, setIsSavingCheckin] = useState(false);
  const [checkinSaved, setCheckinSaved] = useState(false);
  const [quotaWarning, setQuotaWarning] = useState<string | null>(null);
  const [checkinMessage, setCheckinMessage] = useState<string | null>(null);

  // Estados para Temas Rezagados y Control de Avance
  const [temasRezagadosList, setTemasRezagadosList] = useState<string[]>([]);
  const [showModalRezagados, setShowModalRezagados] = useState(false);
  const [uncompletedSelection, setUncompletedSelection] = useState<Record<string, boolean>>({});

  const CACHE_KEY_PLAN = 'sidser_cached_latest_plan_v3';
  const CACHE_KEY_REZAGADOS = 'sidser_cached_temas_rezagados_v3';
  const CACHE_KEY_MATRIX = 'sidser_cached_config_matrix_v3';
  const CACHE_KEY_GRADOS = 'sidser_cached_selected_grados_v3';
  const CACHE_KEY_MATERIAS = 'sidser_cached_selected_materias_v3';

  // 1. Restaurar dosificación, matriz de selección y temas rezagados desde caché o servidor
  React.useEffect(() => {
    let restored = false;
    try {
      const cachedPlan = localStorage.getItem(CACHE_KEY_PLAN);
      if (cachedPlan) {
        const parsed = JSON.parse(cachedPlan);
        const hasDias = parsed && parsed.dias && (
          (Array.isArray(parsed.dias) && parsed.dias.length > 0) ||
          (typeof parsed.dias === 'object' && Object.keys(parsed.dias).length > 0)
        );
        if (hasDias) {
          setPlan(parsed);
          restored = true;
        }
      }
      const cachedRezagados = localStorage.getItem(CACHE_KEY_REZAGADOS);
      if (cachedRezagados) {
        const parsedRezagados = JSON.parse(cachedRezagados);
        if (Array.isArray(parsedRezagados) && parsedRezagados.length > 0) {
          setTemasRezagadosList(parsedRezagados);
        }
      }
      const cachedMatrix = localStorage.getItem(CACHE_KEY_MATRIX);
      if (cachedMatrix) {
        const parsedMatrix = JSON.parse(cachedMatrix);
        if (parsedMatrix && typeof parsedMatrix === 'object') {
          setConfigMatrix(parsedMatrix);
        }
      }
      const cachedGrados = localStorage.getItem(CACHE_KEY_GRADOS);
      if (cachedGrados) {
        const parsedGrados = JSON.parse(cachedGrados);
        if (Array.isArray(parsedGrados) && parsedGrados.length > 0) {
          setSelectedGrados(parsedGrados);
        }
      }
      const cachedMaterias = localStorage.getItem(CACHE_KEY_MATERIAS);
      if (cachedMaterias) {
        const parsedMaterias = JSON.parse(cachedMaterias);
        if (Array.isArray(parsedMaterias) && parsedMaterias.length > 0) {
          setSelectedMateriaIds(parsedMaterias);
        }
      }
    } catch (e) {
      console.warn('Error leyendo dosificación desde caché local:', e);
    }

    // Si no había plan en localStorage (o tras cerrar sesión / nuevo dispositivo), consultar servidor
    if (!restored) {
      fetch('/api/docente/checkin')
        .then(res => res.json())
        .then(data => {
          if (data?.success && data?.registro?.datos_plan) {
            const serverPlan = data.registro.datos_plan;
            const hasDias = serverPlan && serverPlan.dias && (
              (Array.isArray(serverPlan.dias) && serverPlan.dias.length > 0) ||
              (typeof serverPlan.dias === 'object' && Object.keys(serverPlan.dias).length > 0)
            );
            if (hasDias) {
              setPlan(serverPlan);
              try {
                localStorage.setItem(CACHE_KEY_PLAN, JSON.stringify(serverPlan));
              } catch (e) {}
            }
            if (Array.isArray(data.registro.temas_rezagados) && data.registro.temas_rezagados.length > 0) {
              setTemasRezagadosList(data.registro.temas_rezagados);
              try {
                localStorage.setItem(CACHE_KEY_REZAGADOS, JSON.stringify(data.registro.temas_rezagados));
              } catch (e) {}
            }
            if (data.registro.config_matrix && typeof data.registro.config_matrix === 'object') {
              setConfigMatrix(data.registro.config_matrix);
              try {
                localStorage.setItem(CACHE_KEY_MATRIX, JSON.stringify(data.registro.config_matrix));
              } catch (e) {}
            }
          }
        })
        .catch(err => {
          console.warn('Aviso recuperando plan del servidor:', err);
        });
    }
  }, []);

  // 2. Guardar plan y rezagos en caché persistente y servidor
  const savePlanToCache = (newPlan: UnifiedWeeklyPlan, rezagados?: string[], matrixToSave?: Record<number, Record<string, MateriaConfig>>) => {
    try {
      localStorage.setItem(CACHE_KEY_PLAN, JSON.stringify(newPlan));
      if (rezagados !== undefined) {
        localStorage.setItem(CACHE_KEY_REZAGADOS, JSON.stringify(rezagados));
      }
      const activeMatrix = matrixToSave || configMatrix;
      localStorage.setItem(CACHE_KEY_MATRIX, JSON.stringify(activeMatrix));
      localStorage.setItem(CACHE_KEY_GRADOS, JSON.stringify(selectedGrados));
      localStorage.setItem(CACHE_KEY_MATERIAS, JSON.stringify(selectedMateriaIds));

      // Guardar también en el servidor para persistencia absoluta entre cierres de sesión
      fetch('/api/docente/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grados: selectedGrados,
          materias: selectedMateriaIds,
          plan: newPlan,
          estado: 'planificado_activo',
          temasRezagados: rezagados !== undefined ? rezagados : temasRezagadosList,
          configMatrix: activeMatrix
        })
      }).catch(() => {});
    } catch (e) {
      console.warn('Error guardando dosificación en caché:', e);
    }
  };

  // 3. Extraer lista plana de sesiones impartidas en la planificación actual (compatible con Array y Object)
  const sesionesPlanificadas = useMemo(() => {
    if (!plan || !plan.dias) return [];
    const list: { id: string; dia: string; grado: string; materia: string; tema: string; pagina: number }[] = [];

    const diasList: any[] = Array.isArray(plan.dias) 
      ? plan.dias 
      : Object.entries(plan.dias).map(([diaNombre, diaObj]: [string, any]) => ({
          ...(diaObj || {}),
          dia: (diaObj && diaObj.dia) || diaNombre
        }));

    diasList.forEach(d => {
      // Soporta tanto d.gradosSincronizados como d.grados
      const gList = Array.isArray(d.gradosSincronizados) 
        ? d.gradosSincronizados 
        : (Array.isArray(d.grados) ? d.grados : Object.values(d.gradosSincronizados || d.grados || {}));

      gList.forEach((g: any) => {
        const pNum = g.numeroPagina || g.pagina || 1;
        const key = `${d.dia}_${g.grado || g.gradoNumero}_${g.materia}_${g.tema}_${pNum}`;
        if (!list.some(x => x.id === key)) {
          list.push({
            id: key,
            dia: d.dia,
            grado: g.grado || `${g.gradoNumero || 4}.° Primaria`,
            materia: g.materia || 'Asignatura',
            tema: g.tema || 'Contenido curricular',
            pagina: pNum
          });
        }
      });
    });
    return list;
  }, [plan]);

  // Acción A: El profesor completó todos los temas con éxito (Avanza dosificación automáticamente)
  const handleCompletarTodo = async () => {
    if (!plan) return;
    setIsSavingCheckin(true);
    try {
      // Limpiar rezagados de memoria y caché
      setTemasRezagadosList([]);
      try {
        localStorage.removeItem(CACHE_KEY_REZAGADOS);
      } catch (e) {}

      // Avanzar automáticamente la selección a los temas siguientes del libro
      const numGrados = Math.max(selectedGrados.length, 1);
      let updatedMatrix: Record<number, Record<string, MateriaConfig>> = {};

      setConfigMatrix(prev => {
        const nextMatrix: Record<number, Record<string, MateriaConfig>> = { ...prev };

        selectedGrados.forEach(g => {
          const mats = getMateriasPorGrado(g);
          if (!nextMatrix[g]) nextMatrix[g] = {};

          mats.forEach(mat => {
            const idBase = mat.id.replace(/_\d+$/, '');
            if (!selectedMateriaIds.includes(idBase)) return;

            const currentCfg = nextMatrix[g][idBase] || getConfig(g, idBase);
            const uni = mat.unidades.find(u => u.unidad === currentCfg.unidadNum) || mat.unidades[0];
            const safeTemas = (uni?.temas || []).filter(Boolean);
            const quota = calculateTemaQuota(mat.nombre, mat.periodosSemanales, numGrados);

            const maxTemaActual = currentCfg.selectedTemaNums.length > 0
              ? Math.max(...currentCfg.selectedTemaNums)
              : 1;

            const siguientesTemas = safeTemas.filter(t => t.numero > maxTemaActual);

            if (siguientesTemas.length > 0) {
              const autoNums = siguientesTemas.slice(0, quota).map(t => t.numero);
              nextMatrix[g][idBase] = {
                unidadNum: currentCfg.unidadNum,
                selectedTemaNums: autoNums.length > 0 ? autoNums : [siguientesTemas[0].numero]
              };
            } else {
              const nextUnidadNum = currentCfg.unidadNum < 4 ? currentCfg.unidadNum + 1 : 1;
              const nextUni = mat.unidades.find(u => u.unidad === nextUnidadNum) || mat.unidades[0];
              const nextSafeTemas = (nextUni?.temas || []).filter(Boolean);
              const autoNums = nextSafeTemas.slice(0, quota).map(t => t.numero);

              nextMatrix[g][idBase] = {
                unidadNum: nextUnidadNum,
                selectedTemaNums: autoNums.length > 0 ? autoNums : [1]
              };
            }
          });
        });

        updatedMatrix = nextMatrix;
        try {
          localStorage.setItem(CACHE_KEY_MATRIX, JSON.stringify(nextMatrix));
        } catch (e) {}

        return nextMatrix;
      });

      await fetch('/api/docente/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grados: selectedGrados,
          materias: selectedMateriaIds,
          plan: plan,
          estado: 'completado_100',
          temasRezagados: [],
          configMatrix: updatedMatrix
        })
      });

      setCheckinSaved(true);
      setCheckinMessage('🎉 ¡Excelente! Se registró el cumplimiento del 100% de la planificación. La lista de cotejo se ha preparado con la siguiente dosificación de contenidos.');
      setTimeout(() => {
        setCheckinSaved(false);
        setCheckinMessage(null);
      }, 6500);
    } catch (err) {
      console.warn('Error al confirmar cumplimiento total:', err);
    } finally {
      setIsSavingCheckin(false);
    }
  };

  // Acción B: Confirmar temas rezagados que no se lograron impartir y reprogramarlos en la siguiente dosificación
  const handleConfirmarRezagados = async () => {
    const uncompletedSessions = sesionesPlanificadas.filter(s => uncompletedSelection[s.id]);
    const pendientes = uncompletedSessions.map(s => `${s.grado} · ${s.materia}: ${s.tema} (Pág. ${s.pagina})`);

    if (pendientes.length === 0) {
      setShowModalRezagados(false);
      return;
    }

    setIsSavingCheckin(true);
    try {
      // Avanzar dosificación manteniendo y priorizando los temas no alcanzados
      const numGrados = Math.max(selectedGrados.length, 1);
      let updatedMatrix: Record<number, Record<string, MateriaConfig>> = {};

      setConfigMatrix(prev => {
        const nextMatrix: Record<number, Record<string, MateriaConfig>> = { ...prev };

        selectedGrados.forEach(g => {
          const mats = getMateriasPorGrado(g);
          if (!nextMatrix[g]) nextMatrix[g] = {};

          mats.forEach(mat => {
            const idBase = mat.id.replace(/_\d+$/, '');
            if (!selectedMateriaIds.includes(idBase)) return;

            const currentCfg = nextMatrix[g][idBase] || getConfig(g, idBase);
            const uni = mat.unidades.find(u => u.unidad === currentCfg.unidadNum) || mat.unidades[0];
            const safeTemas = (uni?.temas || []).filter(Boolean);
            const quota = calculateTemaQuota(mat.nombre, mat.periodosSemanales, numGrados);

            // Verificar si este grado y materia tienen sesiones marcadas como no alcanzadas
            const rezagosDeMateria = uncompletedSessions.filter(s => {
              const gNum = parseInt(s.grado.replace(/\D/g, ''), 10);
              const mName = s.materia.toLowerCase();
              return gNum === g && (mName.includes(mat.nombre.toLowerCase()) || mat.nombre.toLowerCase().includes(mName) || mName.includes(idBase));
            });

            if (rezagosDeMateria.length > 0) {
              // Identificar los números de tema correspondientes a estos rezagos
              const temaNumsRezagados: number[] = [];
              rezagosDeMateria.forEach(rz => {
                const found = safeTemas.find(t => 
                  t.titulo.toLowerCase().includes(rz.tema.toLowerCase()) || 
                  rz.tema.toLowerCase().includes(t.titulo.toLowerCase()) ||
                  (rz.pagina >= t.paginaInicio && rz.pagina <= t.paginaFin)
                );
                if (found && !temaNumsRezagados.includes(found.numero)) {
                  temaNumsRezagados.push(found.numero);
                }
              });

              // Mantener los temas rezagados y rellenar con el siguiente si queda cuota semanal
              const baseNums = temaNumsRezagados.length > 0 ? temaNumsRezagados : currentCfg.selectedTemaNums;
              const maxNum = Math.max(...baseNums);
              const siguientes = safeTemas.filter(t => t.numero > maxNum);
              const needed = Math.max(0, quota - baseNums.length);
              const toAdd = siguientes.slice(0, needed).map(t => t.numero);
              const finalNums = Array.from(new Set([...baseNums, ...toAdd]));

              nextMatrix[g][idBase] = {
                unidadNum: currentCfg.unidadNum,
                selectedTemaNums: finalNums
              };
            } else {
              // Para materias donde TODO se completó, avanzar normalmente
              const maxTemaActual = currentCfg.selectedTemaNums.length > 0
                ? Math.max(...currentCfg.selectedTemaNums)
                : 1;
              const siguientesTemas = safeTemas.filter(t => t.numero > maxTemaActual);

              if (siguientesTemas.length > 0) {
                const autoNums = siguientesTemas.slice(0, quota).map(t => t.numero);
                nextMatrix[g][idBase] = {
                  unidadNum: currentCfg.unidadNum,
                  selectedTemaNums: autoNums.length > 0 ? autoNums : [siguientesTemas[0].numero]
                };
              } else {
                const nextUnidadNum = currentCfg.unidadNum < 4 ? currentCfg.unidadNum + 1 : 1;
                const nextUni = mat.unidades.find(u => u.unidad === nextUnidadNum) || mat.unidades[0];
                const nextSafeTemas = (nextUni?.temas || []).filter(Boolean);
                const autoNums = nextSafeTemas.slice(0, quota).map(t => t.numero);

                nextMatrix[g][idBase] = {
                  unidadNum: nextUnidadNum,
                  selectedTemaNums: autoNums.length > 0 ? autoNums : [1]
                };
              }
            }
          });
        });

        updatedMatrix = nextMatrix;
        try {
          localStorage.setItem(CACHE_KEY_MATRIX, JSON.stringify(nextMatrix));
        } catch (e) {}

        return nextMatrix;
      });

      await fetch('/api/docente/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grados: selectedGrados,
          materias: selectedMateriaIds,
          plan: plan,
          estado: 'parcial_con_rezagos',
          temasRezagados: pendientes,
          configMatrix: updatedMatrix
        })
      });

      // Guardar lista de rezagos en estado y caché
      setTemasRezagadosList(pendientes);
      try {
        localStorage.setItem(CACHE_KEY_REZAGADOS, JSON.stringify(pendientes));
      } catch (e) {}

      setShowModalRezagados(false);
      setCheckinMessage(`📋 Se registraron ${pendientes.length} tema(s) pendientes. Han sido cargados automáticamente en la lista de cotejo para la próxima planificación.`);
      setTimeout(() => setCheckinMessage(null), 6500);
    } catch (err) {
      console.warn('Error guardando temas rezagados:', err);
    } finally {
      setIsSavingCheckin(false);
    }
  };

  const handleCheckinDocente = async () => {
    if (!plan) return;
    setIsSavingCheckin(true);
    try {
      await fetch('/api/docente/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grados: selectedGrados,
          materias: selectedMateriaIds,
          plan: plan,
          estado: 'planificado',
          temasRezagados: temasRezagadosList
        })
      });
      setCheckinSaved(true);
      setTimeout(() => setCheckinSaved(false), 4000);
    } catch (err) {
      console.warn('Error en check-in:', err);
    } finally {
      setIsSavingCheckin(false);
    }
  };

  // Determinar ciclo según los grados seleccionados
  const cicloActual = selectedGrados.some(g => g <= 3) ? 'primer_ciclo' : 'segundo_ciclo';
  const asignaturasComplementarias = getAsignaturasComplementarias(
    selectedGrados.length > 0 ? cicloActual : 'segundo_ciclo'
  );

  // Obtener lista consolidada de todas las materias disponibles en los grados seleccionados
  const todasLasMaterias = React.useMemo(() => {
    if (selectedGrados.length === 0) return [];
    const matMap = new Map<string, { idBase: string; nombre: string; prioridad: string }>();
    
    selectedGrados.forEach(g => {
      const mats = getMateriasPorGrado(g);
      mats.forEach(m => {
        const idBase = m.id.replace(/_\d+$/, '');
        if (!matMap.has(idBase)) {
          matMap.set(idBase, {
            idBase,
            nombre: m.nombre,
            prioridad: m.prioridad
          });
        }
      });
    });

    return Array.from(matMap.values());
  }, [selectedGrados]);

  // Helper para obtener el objeto MateriaPlanificable de un grado y un idBase
  const getMateriaForGradoAndBase = (grado: number, idBase: string): MateriaPlanificable | undefined => {
    const mats = getMateriasPorGrado(grado);
    return mats.find(m => m.id === idBase || m.id.startsWith(idBase + '_'));
  };

  // Helper para obtener la configuración (unidad, temas seleccionados)
  const getConfig = (grado: number, idBase: string): MateriaConfig => {
    const mat = getMateriaForGradoAndBase(grado, idBase);
    const defaultUnidad = mat?.unidades[0]?.unidad || 1;
    const uni = mat?.unidades.find(u => u.unidad === defaultUnidad) || mat?.unidades[0];
    const safeTemas = (uni?.temas || []).filter(Boolean);
    const numGrados = Math.max(selectedGrados.length, 1);
    const quota = mat ? calculateTemaQuota(mat.nombre, mat.periodosSemanales, numGrados) : 4;
    const defaultTemas = safeTemas.slice(0, quota).map(t => t.numero);

    if (!configMatrix[grado] || !configMatrix[grado][idBase]) {
      return { 
        unidadNum: defaultUnidad, 
        selectedTemaNums: defaultTemas.length > 0 ? defaultTemas : [1] 
      };
    }
    return configMatrix[grado][idBase];
  };

  // Cambiar de Unidad para una materia específica (aplica cuota inteligente para esa unidad)
  const setUnidad = (grado: number, idBase: string, unidadNum: number) => {
    setConfigMatrix(prev => {
      const gradoConfig = prev[grado] || {};
      const mat = getMateriaForGradoAndBase(grado, idBase);
      const uni = mat?.unidades.find(u => u.unidad === unidadNum);
      const safeTemas = (uni?.temas || []).filter(Boolean);
      const numGrados = Math.max(selectedGrados.length, 1);
      const quota = mat ? calculateTemaQuota(mat.nombre, mat.periodosSemanales, numGrados) : 4;
      const autoTemaNums = safeTemas.slice(0, quota).map(t => t.numero);

      return {
        ...prev,
        [grado]: {
          ...gradoConfig,
          [idBase]: {
            unidadNum,
            selectedTemaNums: autoTemaNums.length > 0 ? autoTemaNums : [1]
          }
        }
      };
    });
  };

  // Toggle de un tema específico con validación estricta de cuota semanal CNB
  const toggleTema = (grado: number, idBase: string, temaNum: number) => {
    const mat = getMateriaForGradoAndBase(grado, idBase);
    const numGrados = Math.max(selectedGrados.length, 1);
    const quota = mat ? calculateTemaQuota(mat.nombre, mat.periodosSemanales, numGrados) : 4;

    const gradoConfig = configMatrix[grado] || {};
    const current = gradoConfig[idBase] || getConfig(grado, idBase);
    let nextTemas = [...current.selectedTemaNums];

    if (nextTemas.includes(temaNum)) {
      if (nextTemas.length > 1) {
        nextTemas = nextTemas.filter(t => t !== temaNum);
        setQuotaWarning(null);
      }
    } else {
      // 1. Validar límite de cuota semanal de temas
      if (nextTemas.length >= quota) {
        const modalText = numGrados > 1 ? 'Multigrado' : 'Monogrado';
        setQuotaWarning(
          `⚠️ Límite de dosificación alcanzado: Para ${mat?.nombre || 'esta asignatura'} en modalidad ${modalText}, la cuota oficial es de máximo ${quota} tema(s) por semana según el CNB. Desmarca uno para seleccionar este.`
        );
        setTimeout(() => setQuotaWarning(null), 5000);
        return;
      }

      // 2. Validar que la suma total de páginas físicas no sobrecargue la semana lectiva
      const uni = mat?.unidades.find(u => u.unidad === current.unidadNum) || mat?.unidades[0];
      const selectedObjs = (uni?.temas || []).filter(item => nextTemas.includes(item.numero));
      const targetObj = (uni?.temas || []).find(item => item.numero === temaNum);
      const targetPages = targetObj ? Math.max((targetObj.paginaFin || targetObj.paginaInicio) - targetObj.paginaInicio + 1, 1) : 1;
      const currentPages = selectedObjs.reduce((acc, item) => acc + Math.max((item.paginaFin || item.paginaInicio) - item.paginaInicio + 1, 1), 0);
      const maxWeeklyPages = (mat?.periodosSemanales || 5) >= 4 ? 6 : 3;

      if (currentPages + targetPages > maxWeeklyPages && nextTemas.length >= 1) {
        const modalText = numGrados > 1 ? 'Multigrado' : 'Monogrado';
        setQuotaWarning(
          `⚠️ Límite semanal de páginas: "${targetObj?.titulo}" abarca ${targetPages} página(s). Con los temas ya seleccionados sumarían ${currentPages + targetPages} páginas, superando la capacidad semanal de ${maxWeeklyPages} páginas lectivas para ${mat?.nombre} (${modalText}). Desmarca un tema previo para incluirlo.`
        );
        setTimeout(() => setQuotaWarning(null), 5500);
        return;
      }

      nextTemas.push(temaNum);
      nextTemas.sort((a, b) => a - b);
      setQuotaWarning(null);
    }

    setConfigMatrix(prev => ({
      ...prev,
      [grado]: {
        ...gradoConfig,
        [idBase]: {
          ...current,
          selectedTemaNums: nextTemas
        }
      }
    }));
  };

  // Seleccionar / Deseleccionar la cuota recomendada para la semana
  const toggleAllTemas = (grado: number, idBase: string, temas: TemaIndice[]) => {
    const mat = getMateriaForGradoAndBase(grado, idBase);
    const numGrados = Math.max(selectedGrados.length, 1);
    const quota = mat ? calculateTemaQuota(mat.nombre, mat.periodosSemanales, numGrados) : 4;
    const maxWeeklyPages = (mat?.periodosSemanales || 5) >= 4 ? 6 : 3;

    const gradoConfig = configMatrix[grado] || {};
    const current = gradoConfig[idBase] || getConfig(grado, idBase);

    // Calcular selección recomendada respetando temas y páginas
    const recommendedTemas: number[] = [];
    let accPages = 0;
    for (const t of temas) {
      if (recommendedTemas.length >= quota) break;
      const span = Math.max((t.paginaFin || t.paginaInicio) - t.paginaInicio + 1, 1);
      if (recommendedTemas.length > 0 && accPages + span > maxWeeklyPages) break;
      recommendedTemas.push(t.numero);
      accPages += span;
    }
    const finalSelection = recommendedTemas.length > 0 ? recommendedTemas : [temas[0]?.numero || 1];

    const isQuotaSelected = finalSelection.length === current.selectedTemaNums.length &&
      finalSelection.every(n => current.selectedTemaNums.includes(n));

    setConfigMatrix(prev => ({
      ...prev,
      [grado]: {
        ...gradoConfig,
        [idBase]: {
          ...current,
          selectedTemaNums: isQuotaSelected ? [temas[0]?.numero || 1] : finalSelection
        }
      }
    }));
  };

  // Toggle grados con dosificación inteligente automática
  const toggleGrado = (g: number) => {
    setSelectedGrados(prev => {
      const next = prev.includes(g)
        ? prev.filter(x => x !== g).sort()
        : [...prev, g].sort();
      applyIntelligentAutoSelection(selectedUnidadGlobal, next, selectedMateriaIds);
      return next;
    });
  };

  // Toggle materia simultánea con dosificación inteligente automática
  const toggleMateria = (idBase: string) => {
    setSelectedMateriaIds(prev => {
      const next = prev.includes(idBase)
        ? (prev.length === 1 ? prev : prev.filter(x => x !== idBase))
        : [...prev, idBase];
      applyIntelligentAutoSelection(selectedUnidadGlobal, selectedGrados, next);
      return next;
    });
  };


  // ==========================================================================
  // DETECCIÓN EN VIVO DE TEMAS EN COMÚN ENTRE GRADOS Y TRAZADO DE TEMAS EJE
  // ==========================================================================
  const temasEjeEnComunDetectados = useMemo((): ResultadoRelacionTemasMateria[] => {
    if (selectedGrados.length < 2 || selectedMateriaIds.length === 0) return [];

    return selectedMateriaIds.map(idBase => {
      const mMeta = todasLasMaterias.find(m => m.idBase === idBase);
      if (!mMeta) return null;

      const temasPorGrado = selectedGrados.map(g => {
        const mat = getMateriaForGradoAndBase(g, idBase);
        if (!mat) return { grado: g, temas: [] };
        const cfg = getConfig(g, idBase);
        const uni = mat.unidades.find(u => u.unidad === cfg.unidadNum) || mat.unidades[0];
        const safeTemas = (uni?.temas || []).filter(Boolean);
        const selectedTemas = safeTemas.filter(t => cfg.selectedTemaNums.includes(t.numero));
        const activeTemas = selectedTemas.length > 0 ? selectedTemas : (safeTemas.length > 0 ? [safeTemas[0]] : []);
        return {
          grado: g,
          libroTitulo: mat.libroTitulo,
          unidadNum: uni?.unidad,
          unidadTitulo: uni?.titulo,
          temas: activeTemas.map(t => ({
            titulo: t.titulo,
            paginaInicio: t.paginaInicio,
            paginaFin: t.paginaFin
          }))
        };
      });

      return analizarRelacionTemasMismaMateria(idBase, mMeta.nombre, temasPorGrado);
    }).filter(Boolean) as ResultadoRelacionTemasMateria[];
  }, [selectedGrados, selectedMateriaIds, configMatrix]);

  // Generar Planificación: procesa TODAS las combinaciones de grado x materia x temas seleccionados
  const handleGenerarPlan = async () => {
    if (selectedGrados.length === 0) return;
    setIsLoading(true);

    const items: any[] = [];

    selectedGrados.forEach(g => {
      todasLasMaterias.forEach(mMeta => {
        if (!selectedMateriaIds.includes(mMeta.idBase)) return;

        const mat = getMateriaForGradoAndBase(g, mMeta.idBase);
        if (!mat) return;

        const cfg = getConfig(g, mMeta.idBase);
        const uni = mat.unidades.find(u => u.unidad === cfg.unidadNum) || mat.unidades[0];
        
        // Obtener todos los temas seleccionados simultáneamente con fallback seguro
        const safeTemas = (uni?.temas || []).filter(Boolean);
        const selectedTemasObj = safeTemas.filter(t => cfg.selectedTemaNums.includes(t.numero));
        const activeTemas = selectedTemasObj.length > 0 
          ? selectedTemasObj 
          : (safeTemas.length > 0 
              ? [safeTemas[0]] 
              : [{ numero: 1, titulo: uni?.titulo || 'Tema 1', paginaInicio: uni?.paginaInicio || 8, paginaFin: uni?.paginaFin || 20 }]);

        const minPag = activeTemas.length > 0 ? Math.min(...activeTemas.map(t => t.paginaInicio)) : (uni?.paginaInicio || 8);
        const maxPag = activeTemas.length > 0 ? Math.max(...activeTemas.map(t => t.paginaFin)) : (uni?.paginaFin || 20);
        const titulosTemas = activeTemas.map(t => t.titulo).join(', ');

        items.push({
          grado: g,
          materia: mat.nombre,
          materiaId: mat.id,
          materiaBase: mMeta.idBase,
          libroTitulo: mat.libroTitulo,
          unidad: uni.unidad,
          unidadTitulo: uni.titulo,
          tema: titulosTemas,
          temaNumero: activeTemas[0]?.numero || 1,
          todosLosTemasNumeros: activeTemas.map(t => t.numero),
          temasSeleccionados: activeTemas.map(t => ({
            numero: t.numero,
            titulo: t.titulo,
            paginaInicio: t.paginaInicio,
            paginaFin: t.paginaFin
          })),
          paginaInicio: minPag,
          paginaFin: maxPag,
          competencias: uni.competencias,
          indicadores: uni.indicadoresLogro,
          periodosSemanales: mat.periodosSemanales,
          pesoPorcentaje: mat.pesoPorcentaje,
        });
      });
    });

    if (items.length === 0) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/planificacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          grados: selectedGrados,
          grado1: String(selectedGrados[0]),
          grado2: String(selectedGrados[1] || selectedGrados[0]),
          bloque: items[0]?.unidad || 1,
          semana: items[0]?.temaNumero || 1,
          area: items.map(i => i.materia).filter((v, i, a) => a.indexOf(v) === i).join(', '),
          temasRezagados: temasRezagadosList
        })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      if (data?.success && data?.plan) {
        setPlan(data.plan);
        savePlanToCache(data.plan, temasRezagadosList);
      } else {
        const local = generateUnifiedRAGPlan({
          grados: selectedGrados,
          area: items[0]?.materia || 'Matemáticas',
          bimestre: items[0]?.unidad || 1,
          semana: items[0]?.temaNumero || 1,
          temasRezagados: temasRezagadosList,
          items: items
        });
        setPlan(local);
        savePlanToCache(local, temasRezagadosList);
      }
    } catch {
      const local = generateUnifiedRAGPlan({
        grados: selectedGrados,
        area: items[0]?.materia || 'Matemáticas',
        bimestre: items[0]?.unidad || 1,
        semana: items[0]?.temaNumero || 1,
        temasRezagados: temasRezagadosList,
        items: items
      });
      setPlan(local);
      savePlanToCache(local, temasRezagadosList);
    } finally {
      setIsLoading(false);
    }
  };

  const diasSemana: DiaSemana[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4">

      {/* =================================================================== */}
      {/* 1. SELECTORES: GRADOS Y MATERIAS SIMULTÁNEAS                        */}
      {/* =================================================================== */}
      <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm print:hidden space-y-5">
        
        {/* 1. GRADOS DEL AULA */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-[#00A3E0]" />
            <span>1. Grados del Aula Multigrado (Selecciona uno o más)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6].map((g) => {
              const isSelected = selectedGrados.includes(g);
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleGrado(g)}
                  className={`w-11 h-11 rounded-xl text-sm font-black transition-all flex items-center justify-center border shadow-sm ${
                    isSelected
                      ? 'bg-[#005B94] text-white border-[#005B94] scale-105 ring-2 ring-[#00A3E0]/30'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  {g}.°
                </button>
              );
            })}
          </div>
          {selectedGrados.length > 0 && (
            <p className="text-[11px] text-slate-500 font-semibold">
              Aula: <span className="text-[#005B94] font-bold">{selectedGrados.map(g => `${g}.°`).join(' y ')} Primaria</span>
            </p>
          )}
        </div>

        {/* 2. UNIDAD GLOBAL Y DOSIFICACIÓN INTELIGENTE AUTOMÁTICA */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-[11px] font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>2. Unidad Bimestral de Avance (Cálculo Automático de Temas por Prioridad CNB)</span>
            </label>
            <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
              ⚡ Dosificación Inteligente Activa
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[1, 2, 3, 4].map((u) => {
              const isSelected = selectedUnidadGlobal === u;
              return (
                <button
                  key={u}
                  type="button"
                  onClick={() => handleSelectUnidadGlobal(u)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all border flex items-center gap-1.5 shadow-sm ${
                    isSelected
                      ? 'bg-[#005B94] text-white border-[#005B94] shadow-md scale-105 ring-2 ring-[#00A3E0]/30'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Unidad {u}</span>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-700 bg-sky-50/80 p-3 rounded-xl border border-sky-200 leading-snug space-y-1">
            <div className="font-extrabold text-[#005B94] flex items-center justify-between">
              <span>Dosificación Inteligente CNB (1 Página Física = 1 Sesión Diaria):</span>
              <span className="text-[10px] bg-[#005B94] text-white px-2 py-0.5 rounded font-black">
                {selectedGrados.length === 1 ? 'Aula Monogrado' : `Aula Multigrado (${selectedGrados.length} Grados)`}
              </span>
            </div>
            <p>
              {selectedGrados.length === 1 ? (
                <>Al atender <strong>1 solo grado</strong>, el docente dedica el 100% del tiempo de clase. Se autoseleccionan <strong>4 sesiones consecutivas de Lunes a Jueves</strong> (1 página por día) para cubrir la carga oficial del CNB: <strong>Matemáticas</strong> (5 horas semanales) y <strong>Comunicación L1</strong> (4-5 horas semanales), más 2 sesiones para áreas integradas. El viernes se reserva para la evaluación diagnóstica.</>
              ) : (
                <>En <strong>aula multigrado ({selectedGrados.map(g => `${g}.°`).join(' y ')})</strong> se aplica <strong>Atención Alternada Rotativa</strong> (Grupo A Modelado Directo / Grupo B Trabajo Autónomo). Cada grado avanza de forma paralela <strong>1 página física real por día</strong> (4 sesiones de Lunes a Jueves) bajo el mismo <strong>Tema Eje Transversal</strong> unificador.</>
              )}
            </p>
          </div>
        </div>

        {/* ASIGNATURAS SIMULTÁNEAS (CHECKLIST) */}
        {selectedGrados.length > 0 && todasLasMaterias.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <label className="text-[11px] font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#00A3E0]" />
              <span>3. Asignaturas a Incluir Simultáneamente (Marca las que deseas planificar)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {todasLasMaterias.map((m) => {
                const isChecked = selectedMateriaIds.includes(m.idBase);
                return (
                  <button
                    key={m.idBase}
                    type="button"
                    onClick={() => toggleMateria(m.idBase)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 shadow-sm ${
                      isChecked
                        ? 'bg-[#00A3E0] text-white border-[#00A3E0] ring-2 ring-[#00A3E0]/20'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                      isChecked ? 'bg-white text-[#00A3E0] border-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span>{m.nombre}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 2. TABLA DE COTEJO INTERACTIVA CON SELECCIÓN MÚLTIPLE DE TEMAS      */}
        {/* =================================================================== */}
        {selectedGrados.length > 0 && selectedMateriaIds.length > 0 && (
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-[#00A3E0]" />
                <span>4. Tabla de Cotejo: Temas y Subtemas Seleccionados (Ajuste Personalizado de Checkboxes)</span>
              </label>
              <span className="text-[10px] text-slate-500 italic">
                * Haz clic en los temas para seleccionarlos simultáneamente (respetando la cuota semanal del CNB)
              </span>
            </div>

            {/* Alerta interactiva de límite de cuota semanal */}
            {quotaWarning && (
              <div className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl text-xs text-amber-900 font-semibold flex items-center justify-between shadow-xs transition-all">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{quotaWarning}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setQuotaWarning(null)}
                  className="text-amber-700 hover:text-amber-900 font-bold ml-2 text-sm px-1.5"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Banner de Temas Rezagados Priorizados para la Dosificación */}
            {temasRezagadosList.length > 0 && (
              <div className="p-3.5 bg-amber-50/90 border-l-4 border-amber-500 rounded-r-xl text-xs text-amber-950 flex flex-col gap-1.5 shadow-xs transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-black text-amber-900">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Contenidos Pendientes / Rezagados Detectados ({temasRezagadosList.length})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setTemasRezagadosList([]);
                      try { localStorage.removeItem(CACHE_KEY_REZAGADOS); } catch (e) {}
                    }}
                    className="text-[10px] text-amber-700 hover:text-amber-950 underline font-bold"
                  >
                    Descartar pendientes
                  </button>
                </div>
                <p className="text-[11px] text-amber-800">
                  El algoritmo priorizará estos temas en los primeros días (Lunes y Martes) de la nueva planificación para nivelar los aprendizajes antes de avanzar:
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {temasRezagadosList.map((tr, idx) => (
                    <span key={idx} className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-lg border border-amber-300 text-[10px] flex items-center gap-1">
                      <span>⚠️ {tr}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="overflow-x-auto rounded-2xl border border-sky-300 shadow-sm">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-[#00A3E0] text-white text-center font-bold">
                    <th className="p-2.5 border border-sky-400 w-16">Grado</th>
                    <th className="p-2.5 border border-sky-400 w-44 text-left">Asignatura</th>
                    <th className="p-2.5 border border-sky-400 w-52 text-left">Unidad del Libro Oficial</th>
                    <th className="p-2.5 border border-sky-400 text-left">Temas y Subtemas del Índice Oficial (Selección Simultánea)</th>
                    <th className="p-2.5 border border-sky-400 w-28 text-center">Páginas Reales</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {selectedGrados.map(g => {
                    return todasLasMaterias
                      .filter(m => selectedMateriaIds.includes(m.idBase))
                      .map((mMeta) => {
                        const mat = getMateriaForGradoAndBase(g, mMeta.idBase);
                        if (!mat) return null;

                        const cfg = getConfig(g, mMeta.idBase);
                        const uni = mat.unidades.find(u => u.unidad === cfg.unidadNum) || mat.unidades[0];
                        const safeTemas = (uni?.temas || []).filter(Boolean);
                        const selectedTemasObj = safeTemas.filter(t => cfg.selectedTemaNums.includes(t.numero));
                        const activeTemas = selectedTemasObj.length > 0 
                          ? selectedTemasObj 
                          : (safeTemas.length > 0 
                              ? [safeTemas[0]] 
                              : [{ numero: 1, titulo: uni?.titulo || 'Tema 1', paginaInicio: uni?.paginaInicio || 8, paginaFin: uni?.paginaFin || 20 }]);
                        const minPag = activeTemas.length > 0 ? Math.min(...activeTemas.map(t => t.paginaInicio)) : (uni?.paginaInicio || 8);
                        const maxPag = activeTemas.length > 0 ? Math.max(...activeTemas.map(t => t.paginaFin)) : (uni?.paginaFin || 20);
                        const allSelected = safeTemas.length > 0 && safeTemas.every(t => cfg.selectedTemaNums.includes(t.numero));

                        return (
                          <tr key={`${g}-${mMeta.idBase}`} className="hover:bg-sky-50/30 transition-colors">
                            {/* Grado */}
                            <td className="p-2.5 border border-slate-200 text-center font-black align-top">
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#005B94] text-white text-xs font-black shadow-sm mt-1">
                                {g}.°
                              </span>
                            </td>

                            {/* Asignatura */}
                            <td className="p-2.5 border border-slate-200 align-top">
                              <div className="font-extrabold text-slate-900 text-xs">{mat.nombre}</div>
                              <div className="text-[10px] text-slate-500 font-medium">
                                {mat.periodosSemanales} per. · {mat.pesoPorcentaje}% CNB
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                  mat.prioridad.includes('Alta') ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {mat.prioridad.includes('Alta') ? '★ Troncal' : 'Integradora'}
                                </span>
                                <span className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                                  {calculateTemaQuota(mat.nombre, mat.periodosSemanales, selectedGrados.length)} tema(s) CNB
                                </span>
                              </div>
                            </td>

                            {/* Unidad */}
                            <td className="p-2.5 border border-slate-200 align-top space-y-1.5">
                              <div className="flex flex-col gap-1">
                                {mat.unidades.map(u => {
                                  const isCurrentUni = u.unidad === cfg.unidadNum;
                                  return (
                                    <button
                                      key={u.unidad}
                                      type="button"
                                      onClick={() => setUnidad(g, mMeta.idBase, u.unidad)}
                                      className={`text-left p-1.5 rounded-lg border text-[11px] font-bold transition-all ${
                                        isCurrentUni
                                          ? 'bg-[#005B94] text-white border-[#005B94] shadow-2xs'
                                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span>Unidad {u.unidad}</span>
                                        <span className={`text-[9px] px-1 rounded ${isCurrentUni ? 'bg-sky-900/50 text-sky-100' : 'text-slate-500'}`}>
                                          p.{u.paginaInicio}-{u.paginaFin}
                                        </span>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </td>

                            {/* Temas y Subtemas - SELECCIÓN SIMULTÁNEA POR CHECKBOX / BOTONES */}
                            <td className="p-2.5 border border-slate-200 align-top space-y-2">
                              {/* Barra superior del selector de temas */}
                              {(() => {
                                const numGrados = Math.max(selectedGrados.length, 1);
                                const quota = calculateTemaQuota(mat.nombre, mat.periodosSemanales, numGrados);
                                const isQuotaReached = cfg.selectedTemaNums.length >= quota;

                                return (
                                  <>
                                    <div className="flex items-center justify-between text-[11px] border-b pb-1.5">
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-bold text-slate-700">
                                          {cfg.selectedTemaNums.length} de máx. {quota} tema(s)
                                        </span>
                                        {isQuotaReached && (
                                          <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-1.5 py-0.2 rounded border border-amber-300">
                                            Cuota semanal completa
                                          </span>
                                        )}
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => toggleAllTemas(g, mMeta.idBase, uni.temas)}
                                        className="text-[10px] font-bold text-[#005B94] hover:underline"
                                      >
                                        {cfg.selectedTemaNums.length > 1 ? 'Dejar solo uno' : `Cuota semanal (${quota})`}
                                      </button>
                                    </div>

                                    {/* Contenedor de temas con scroll cómodo y selección simultánea */}
                                    <div className="max-h-48 overflow-y-auto pr-1 space-y-1 scrollbar-thin">
                                      {uni.temas.map(t => {
                                        const isSelected = cfg.selectedTemaNums.includes(t.numero);
                                        const isDisabledByQuota = !isSelected && isQuotaReached;

                                        return (
                                          <button
                                            key={t.numero}
                                            type="button"
                                            onClick={() => toggleTema(g, mMeta.idBase, t.numero)}
                                            title={isDisabledByQuota ? `Límite semanal alcanzado (máx. ${quota} temas). Desmarca otro tema para seleccionar este.` : undefined}
                                            className={`w-full text-left p-1.5 rounded-lg text-xs transition-all flex items-start gap-2 border ${
                                              isSelected
                                                ? 'bg-sky-100 text-sky-950 border-sky-300 font-bold shadow-2xs'
                                                : isDisabledByQuota
                                                  ? 'bg-slate-100/70 text-slate-400 border-slate-200 hover:bg-slate-200/50 cursor-pointer'
                                                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 font-medium'
                                            }`}
                                          >
                                            {/* Checkbox visual */}
                                            <div className={`w-4 h-4 rounded mt-0.5 shrink-0 flex items-center justify-center border ${
                                              isSelected ? 'bg-[#00A3E0] text-white border-[#00A3E0]' : 'border-slate-300 bg-white'
                                            }`}>
                                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                            </div>

                                            {/* Título del tema y su página */}
                                            <div className="flex-1 min-w-0 flex items-baseline justify-between gap-2">
                                              <span className="truncate">{t.titulo}</span>
                                              <span className={`text-[10px] shrink-0 font-bold px-1.5 py-0.2 rounded ${
                                                isSelected ? 'bg-sky-200/80 text-[#005B94]' : 'bg-slate-200/60 text-slate-600'
                                              }`}>
                                                {t.paginaFin && t.paginaFin > t.paginaInicio
                                                  ? `p.${t.paginaInicio} - ${t.paginaFin}`
                                                  : `p.${t.paginaInicio}`}
                                              </span>
                                            </div>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </>
                                );
                              })()}
                            </td>

                            {/* Páginas Reales */}
                            <td className="p-2.5 border border-slate-200 text-center align-middle">
                              <span className="inline-block bg-sky-100 text-[#005B94] text-xs font-black px-2.5 py-1.5 rounded-lg border border-sky-200">
                                {minPag === maxPag ? `Pág. ${minPag}` : `Págs. ${minPag} - ${maxPag}`}
                              </span>
                            </td>
                          </tr>
                        );
                      });
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}


        {/* =================================================================== */}
        {/* 5. ANÁLISIS EN VIVO: TEMAS EN COMÚN Y EJES TRANSVERSALES TRAZADOS   */}
        {/* =================================================================== */}
        {selectedGrados.length > 1 && (temasEjeEnComunDetectados as any[]).length > 0 && (() => {
          const materiasConEje = (temasEjeEnComunDetectados as ResultadoRelacionTemasMateria[]).filter(
            eje => eje.tieneRelacion && Boolean(eje.temaEjeTrazado)
          );
          const materiasSinEje = (temasEjeEnComunDetectados as ResultadoRelacionTemasMateria[]).filter(
            eje => !eje.tieneRelacion || !eje.temaEjeTrazado
          );

          if (materiasConEje.length === 0) {
            return (
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-[11px] font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#00A3E0]" />
                    <span>5. Análisis Curricular Multigrado: Dosificación Regular por Grado</span>
                  </label>
                  <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full border border-slate-200">
                    {selectedGrados.map(g => `${g}.°`).join(' y ')} Primaria · Temas Independientes
                  </span>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-linear-to-r from-slate-50 via-white to-sky-50/30 p-3.5 flex items-start gap-3 shadow-2xs">
                  <div className="p-2 bg-sky-50 border border-sky-100 rounded-xl text-[#00A3E0] mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">
                        Dosificación Regular por Grado (Sin temas eje artificiales)
                      </span>
                      <span className="text-[9px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                        Atención Alternada
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Los temas seleccionados para {selectedGrados.map(g => `${g}.°`).join(' y ')} Primaria corresponden a unidades o ramas temáticas independientes. Cada grado avanzará directamente en las lecciones y páginas de su libro oficial del MINEDUC.
                    </p>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-[11px] font-black uppercase text-indigo-900 tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>5. Detección Inteligente de Temas Eje en Común (Trazado Automático Multigrado)</span>
                </label>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                  {selectedGrados.map(g => `${g}.°`).join(' y ')} Primaria · {materiasConEje.length} {materiasConEje.length === 1 ? 'Eje Articulador' : 'Ejes Articuladores'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {materiasConEje.map((eje) => (
                  <div
                    key={eje.idBase}
                    className="rounded-2xl border-2 p-3.5 shadow-2xs space-y-2.5 transition-all border-indigo-300 bg-linear-to-br from-indigo-50/70 via-white to-sky-50/50 hover:border-indigo-400"
                  >
                    {/* Encabezado Asignatura */}
                    <div className="flex items-center justify-between border-b pb-2 border-slate-200">
                      <span className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-indigo-600"></span>
                        <span>{eje.materiaNombre}</span>
                      </span>
                      <span className="text-[9px] font-black px-2 py-0.5 rounded shadow-2xs bg-indigo-600 text-white">
                        🎯 Tema Eje Trazado
                      </span>
                    </div>

                    {/* Temas seleccionados por grado */}
                    <div className="space-y-1 text-[11px] bg-white/80 p-2 rounded-xl border border-slate-200">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Temas Seleccionados en los Libros Oficiales:
                      </div>
                      {eje.temasPorGrado.map((tg) => (
                        <div key={tg.grado} className="text-slate-800 flex items-start gap-1.5">
                          <strong className="text-slate-900 shrink-0">{tg.grado}.° Primaria:</strong>
                          <span className="truncate text-slate-700">
                            {tg.temas.map((t) => t.titulo).join(', ')}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Palabras y Conceptos en Común */}
                    {eje.palabrasClaveComunes && eje.palabrasClaveComunes.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold text-indigo-900">
                          Conceptos y Palabras Clave en Común Detectados:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {eje.palabrasClaveComunes.map((kw: string) => (
                            <span
                              key={kw}
                              className="bg-indigo-100/90 text-indigo-900 border border-indigo-200 text-[10px] font-black px-2 py-0.5 rounded-md"
                            >
                              ✓ {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* BLOQUE CENTRAL: TEMA EJE UNIFICADOR */}
                    <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-xs space-y-1">
                      <div className="text-[9px] font-black uppercase tracking-wider text-indigo-200">
                        🎯 Tema Eje Unificador para Explicación en Pizarra:
                      </div>
                      <div className="text-xs font-black leading-snug">
                        {eje.temaEjeTrazado}
                      </div>
                    </div>

                    {/* Estrategia Pedagógica para el Docente */}
                    <p className="text-[11px] text-slate-700 leading-relaxed bg-white/60 p-2 rounded-lg border border-slate-200">
                      <strong className="text-indigo-900">
                        Orientación Didáctica:
                      </strong>{' '}
                      {eje.estrategiaDidactica}
                    </p>
                  </div>
                ))}
              </div>

              {/* Si hay asignaturas sin tema eje simultáneas */}
              {materiasSinEje.length > 0 && (
                <div className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center gap-2">
                  <span className="font-bold text-slate-700 shrink-0">📚 Dosificación regular independiente:</span>
                  <span className="text-slate-600 truncate">
                    {materiasSinEje.map(m => m.materiaNombre).join(', ')} (temas sin convergencia mutua, avanzan en su respectivo libro oficial).
                  </span>
                </div>
              )}
            </div>
          );
        })()}

        {/* BOTÓN GENERAR PLANIFICACIÓN */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleGenerarPlan}
            disabled={isLoading || selectedGrados.length === 0 || selectedMateriaIds.length === 0}
            className={`py-3 px-8 rounded-xl text-xs font-black text-white transition-all shadow-md flex items-center justify-center space-x-2 ${
              isLoading || selectedGrados.length === 0 || selectedMateriaIds.length === 0
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-[#00A3E0] hover:bg-[#008cc0] active:scale-95'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generando Planificación Simultánea RAG...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generar Planificación</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 3. PESTAÑAS + ACCIÓN IMPRIMIR                                       */}
      {/* =================================================================== */}
      {plan && (
        <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('plan_semanal')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'plan_semanal'
                  ? 'bg-[#005B94] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Ficha Oficial Lunes - Jueves</span>
            </button>
            <button
              onClick={() => setActiveTab('evaluacion_viernes')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'evaluacion_viernes'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-rose-700 hover:bg-rose-50'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Viernes: Evaluación (08:00 - 10:00 h)</span>
            </button>
            <button
              onClick={() => setActiveTab('asignaturas_cnb')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'asignaturas_cnb'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-amber-800 hover:bg-amber-50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Demás Asignaturas CNB</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Opción A: Completé todos los temas (Avanza automáticamente la dosificación) */}
            <button
              type="button"
              onClick={handleCompletarTodo}
              disabled={isSavingCheckin}
              title="Registra cumplimiento total de la semana y avanza la lista de cotejo a los siguientes temas del libro"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-3.5 py-2 rounded-xl text-xs transition-all shadow-sm flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>✓ Completé todos los temas</span>
            </button>

            {/* Opción B: No se abarcaron todos los temas (Abre lista de cotejo de pendientes) */}
            <button
              type="button"
              onClick={() => {
                setUncompletedSelection({});
                setShowModalRezagados(true);
              }}
              disabled={isSavingCheckin}
              title="Abre la lista de cotejo de los temas planificados para marcar lo que quedó pendiente y reprogramarlo"
              className="bg-amber-600 hover:bg-amber-700 text-white font-black px-3.5 py-2 rounded-xl text-xs transition-all shadow-sm flex items-center space-x-1.5"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>⚠️ No se abarcaron todos los temas</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all shadow-sm flex items-center space-x-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Ficha (PDF)</span>
            </button>
          </div>
        </div>
      )}

      {/* Alerta de confirmación de Check-in / Avance de dosificación */}
      {checkinMessage && (
        <div className="p-3.5 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl text-xs text-emerald-950 font-bold flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{checkinMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setCheckinMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold text-sm px-1.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4. FICHA OFICIAL INSTITUCIONAL MINEDUC                              */}
      {/* =================================================================== */}
      {plan && (
        <div className="bg-white rounded-3xl border-2 border-[#00A3E0]/50 shadow-xl overflow-hidden print:border-none print:shadow-none print:m-0 print:p-0">

          {/* ENCABEZADO INSTITUCIONAL */}
          <div className="bg-gradient-to-r from-[#004B7A] via-[#005B94] to-[#00A3E0] text-white px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-white text-[#005B94] px-3 py-1.5 rounded-xl font-black text-center leading-tight shadow-md shrink-0">
                <div className="text-[9px] tracking-wider uppercase">Gobierno de la</div>
                <div className="text-xs font-black">REPÚBLICA</div>
                <div className="text-[9px] font-bold">GUATEMALA</div>
              </div>
              <div>
                <div className="text-base sm:text-lg font-black tracking-wide leading-none">Ministerio de Educación</div>
                <div className="text-xs text-sky-100 font-medium mt-0.5">
                  Dirección General de Currículo —DIGECUR— · Aula Multigrado
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-right">
              <div>
                <span className="text-sm font-black uppercase tracking-wider block">
                  PLANIFICACIÓN MULTIGRADO INTEGRAL
                </span>
                <span className="text-[11px] text-sky-100">
                  Grados {selectedGrados.map(g => `${g}.°`).join(' y ')} Primaria
                </span>
              </div>
              <div className="bg-white text-[#005B94] px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm">
                CNB OFICIAL
              </div>
            </div>
          </div>

          {/* FRANJA RESUMEN DEL TEMA EJE TRANSVERSAL Y PROPÓSITO COMÚN */}
          <div className="bg-sky-50/90 border-b border-sky-200 px-6 py-3 space-y-2 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#005B94] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase shadow-2xs">
                    Eje Temático Transversal
                  </span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    {plan.tema_generador_comun}
                  </span>
                </div>
                {plan.proposito_comun && (
                  <p className="text-[11px] text-slate-700 leading-snug">
                    <strong className="text-[#005B94]">Propósito Común:</strong> {plan.proposito_comun}
                  </p>
                )}
              </div>
              <span className="text-[10px] bg-sky-200/80 text-[#005B94] font-bold px-2.5 py-1 rounded-lg shrink-0 self-start sm:self-auto shadow-2xs">
                Asignaturas: {selectedMateriaIds.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pt-1 border-t border-sky-200">
              {selectedGrados.map(g => {
                return (
                  <div key={g} className="bg-white border border-sky-200 rounded-xl p-2.5 shadow-2xs space-y-1">
                    <div className="font-black text-[#005B94] text-xs flex items-center justify-between border-b pb-1">
                      <span>{g}.° Primaria</span>
                      <span className="text-[10px] text-slate-500 font-normal">Avance Simultáneo</span>
                    </div>
                    {todasLasMaterias
                      .filter(m => selectedMateriaIds.includes(m.idBase))
                      .map(mMeta => {
                        const mat = getMateriaForGradoAndBase(g, mMeta.idBase);
                        if (!mat) return null;
                        const cfg = getConfig(g, mMeta.idBase);
                        const uni = mat.unidades.find(u => u.unidad === cfg.unidadNum) || mat.unidades[0];
                        const safeTemas = (uni?.temas || []).filter(Boolean);
                        const activeTemas = safeTemas.filter(t => cfg.selectedTemaNums.includes(t.numero));
                        const safeActive = activeTemas.length > 0 ? activeTemas : safeTemas.slice(0, 1);
                        const temasStr = safeActive.map(t => t.titulo.split(' (Pág.')[0]).join(', ');
                        const minPag = safeActive.length > 0 ? Math.min(...safeActive.map(t => t.paginaInicio)) : (uni?.paginaInicio || 8);
                        const maxPag = safeActive.length > 0 ? Math.max(...safeActive.map(t => t.paginaFin)) : (uni?.paginaFin || 20);
                        return (
                          <div key={mMeta.idBase} className="text-[10px] leading-tight">
                            <strong className="text-slate-800">{mat.nombre}:</strong>{' '}
                            <span className="text-slate-600">U{uni.unidad} {temasStr} (Págs. {minPag}-{maxPag})</span>
                          </div>
                        );
                      })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* =============================================================== */}
          {/* TAB 1: FICHA SEMANAL LUNES A JUEVES                            */}
          {/* =============================================================== */}
          {activeTab === 'plan_semanal' && (
            <div className="p-4 sm:p-6 space-y-5">
              
              {/* FRANJA NORMATIVA HORARIA MINEDUC (60/40) */}
              <div className="bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border-2 border-sky-300 rounded-2xl p-3.5 shadow-sm text-xs">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-[#005B94] text-white font-black px-2.5 py-0.5 rounded-lg text-[10px] uppercase tracking-wide">
                      Jornada Matutina Oficial (08:00 - 12:00 h)
                    </span>
                    <span className="font-extrabold text-[#004F7A]">
                      Ponderación Curricular CNB: 60% Áreas Fundamentales · 40% Áreas Formativas / Integradas
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-sky-200 shadow-2xs">
                    210 min efectivos de clase
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mt-2.5 pt-2 border-t border-sky-200 text-[10px]">
                  <div className="bg-white p-2 rounded-lg border border-sky-100 shadow-2xs">
                    <span className="font-black text-[#005B94] block">08:00 - 08:15 (15 min)</span>
                    <span className="text-slate-600 font-medium">Diálogo de Saberes Comunitario (Inicio Común)</span>
                  </div>
                  <div className="bg-sky-100/80 p-2 rounded-lg border border-sky-300 shadow-2xs">
                    <span className="font-black text-sky-950 block">08:15 - 09:55 (100 min · 60%)</span>
                    <span className="text-sky-900 font-bold">Bloque Fundamental: Matemáticas / Lenguaje L1 (Atención Alternada)</span>
                  </div>
                  <div className="bg-amber-100 p-2 rounded-lg border border-amber-300 shadow-2xs">
                    <span className="font-black text-amber-950 block">10:00 - 10:30 (30 min)</span>
                    <span className="text-amber-900 font-black">🔔 RECESO ESCOLAR LIBRE</span>
                  </div>
                  <div className="bg-indigo-50 p-2 rounded-lg border border-indigo-200 shadow-2xs">
                    <span className="font-black text-indigo-950 block">10:30 - 11:50 (80 min · 40%)</span>
                    <span className="text-indigo-900 font-bold">Bloque Formativo / Aplicado: Ciencias y Entorno</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-sky-100 shadow-2xs">
                    <span className="font-black text-[#005B94] block">11:50 - 12:00 (10 min)</span>
                    <span className="text-slate-600 font-medium">Cierre Común y Gobierno Escolar</span>
                  </div>
                </div>
              </div>

              {/* BANNER RESERVA CNB */}
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-200 text-amber-900 font-black px-2 py-0.5 rounded text-[10px] uppercase">
                    Reserva CNB (Sin Libro)
                  </span>
                  <span className="text-amber-950 font-bold">
                    {asignaturasComplementarias.map(a => `${a.nombre} (${a.periodosSemanales} per.)`).join(' · ')}
                  </span>
                </div>
                <span className="text-[11px] text-amber-900 font-semibold">
                  Bloques diarios sugeridos: 11:15 - 12:00 h
                </span>
              </div>

              {/* =============================================================== */}
              {/* FILTROS RÁPIDOS POR DÍA: FORMATO OFICIAL MINEDUC                */}
              {/* =============================================================== */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 p-2.5 rounded-2xl border border-slate-300 print:hidden">
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
                  <span className="text-slate-500 font-semibold mr-1 text-[11px] uppercase tracking-wider">Ver Día:</span>
                  <button
                    onClick={() => setSelectedDiaVista('todos')}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                      selectedDiaVista === 'todos' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Semana Completa (Lunes a Viernes)</span>
                  </button>
                  {(['Lunes', 'Martes', 'Miércoles', 'Jueves'] as DiaSemana[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDiaVista(d)}
                      className={`px-3 py-1.5 rounded-xl transition-all ${
                        selectedDiaVista === d ? 'bg-[#005B94] text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                  <button
                    onClick={() => setSelectedDiaVista('Viernes')}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                      selectedDiaVista === 'Viernes' ? 'bg-rose-600 text-white shadow-sm' : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Viernes (Evaluación)</span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-600 font-medium">
                  Formato Oficial MINEDUC (Asignatura · Grupo · Día · Hora · Contenidos)
                </div>
              </div>

              {/* =============================================================== */}
              {/* TABLAS DIARIAS ESTRUCTURADAS (1 TABLA POR DÍA SEGÚN PLANTILLA)   */}
              {/* =============================================================== */}
              {(() => {
                const diasAMostrar: (DiaSemana | 'Viernes')[] = selectedDiaVista === 'todos'
                  ? ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
                  : [selectedDiaVista];

                const grupoTexto = selectedGrados.length === 1
                  ? `${selectedGrados[0]}.° Primaria`
                  : `${selectedGrados.map(g => `${g}.°`).join(' y ')} Primaria`;

                return (
                  <div className="space-y-8">
                    {diasAMostrar.map((diaItem) => {
                      if (diaItem === 'Viernes') {
                        // TABLA OFICIAL PARA EL DÍA VIERNES (EVALUACIÓN Y CIERRE)
                        return (
                          <div key="Viernes" className="rounded-2xl border-2 border-slate-400 overflow-hidden shadow-sm bg-white print:break-inside-avoid print:mb-6">
                            {/* ENCABEZADO DEL DÍA */}
                            <div className="bg-[#545454] text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 font-black text-xs uppercase tracking-wider">
                              <div className="flex items-center gap-2">
                                <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded">EVALUACIÓN FORMATIVA</span>
                                <span>Jornada Diaria Oficial: VIERNES</span>
                              </div>
                              <span className="text-[11px] font-semibold text-slate-200 lowercase">
                                08:00 a 10:00 h comprobación + 10:30 a 12:00 h nivelación
                              </span>
                            </div>

                            {/* TABLA DE 5 COLUMNAS DE LA PLANTILLA OFICIAL */}
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs border-collapse border border-slate-400">
                                <thead>
                                  <tr className="bg-[#545454] text-white text-center font-bold text-xs divide-x divide-slate-400">
                                    <th className="p-2.5 border border-slate-400 w-36 uppercase tracking-wider">Asignatura</th>
                                    <th className="p-2.5 border border-slate-400 w-32 uppercase tracking-wider">Grupo</th>
                                    <th className="p-2.5 border border-slate-400 w-16 uppercase tracking-wider">Día</th>
                                    <th className="p-2.5 border border-slate-400 w-28 uppercase tracking-wider">Hora</th>
                                    <th className="p-2.5 border border-slate-400 uppercase tracking-wider">Programación - contenidos</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-300 bg-white">
                                  {/* 1ª HORA: MATEMÁTICAS */}
                                  <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-3 border border-slate-400 font-extrabold text-[#005B94] text-center align-middle bg-slate-50/40">
                                      Matemáticas
                                    </td>
                                    <td className="p-3 border border-slate-400 font-bold text-slate-800 text-center align-middle bg-slate-50/40">
                                      {grupoTexto}
                                    </td>
                                    <td
                                      rowSpan={5}
                                      className="border border-slate-400 bg-slate-100 text-center align-middle font-black text-slate-800 uppercase tracking-widest text-sm p-2 w-16 select-none"
                                      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                                    >
                                      VIERNES
                                    </td>
                                    <td className="p-2.5 border border-slate-400 bg-slate-50 text-center align-middle">
                                      <div className="font-black text-base text-slate-900">1ª</div>
                                      <div className="text-[10px] text-slate-600 font-bold whitespace-nowrap">08:00 - 09:00</div>
                                      <div className="text-[9px] text-[#005B94] font-semibold">60 min</div>
                                    </td>
                                    <td className="p-3 border border-slate-400 align-top text-slate-800 leading-relaxed space-y-2">
                                      <div className="font-bold text-[#005B94] flex items-center justify-between">
                                        <span>• Comprobación Formativa de Matemáticas:</span>
                                        <span className="text-[10px] px-2 py-0.5 rounded font-black bg-rose-100 text-rose-800 border border-rose-300">
                                          Prueba Escrita Individual
                                        </span>
                                      </div>
                                      <p className="text-slate-700 text-xs pl-2">
                                        Resolución de la prueba corta diagnóstica sobre los algoritmos y ejercicios vistos de lunes a jueves en el libro de texto oficial del MINEDUC.
                                      </p>
                                    </td>
                                  </tr>

                                  {/* 2ª HORA: COMUNICACIÓN Y LENGUAJE */}
                                  <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-3 border border-slate-400 font-extrabold text-teal-800 text-center align-middle bg-slate-50/40">
                                      Comunicación y Lenguaje L1
                                    </td>
                                    <td className="p-3 border border-slate-400 font-bold text-slate-800 text-center align-middle bg-slate-50/40">
                                      {grupoTexto}
                                    </td>
                                    <td className="p-2.5 border border-slate-400 bg-slate-50 text-center align-middle">
                                      <div className="font-black text-base text-slate-900">2ª</div>
                                      <div className="text-[10px] text-slate-600 font-bold whitespace-nowrap">09:00 - 10:00</div>
                                      <div className="text-[9px] text-teal-700 font-semibold">60 min</div>
                                    </td>
                                    <td className="p-3 border border-slate-400 align-top text-slate-800 leading-relaxed space-y-2">
                                      <div className="font-bold text-teal-900 flex items-center justify-between">
                                        <span>• Comprobación de Comprensión Lectora y Expresión Escrita:</span>
                                        <span className="text-[10px] px-2 py-0.5 rounded font-black bg-teal-100 text-teal-800 border border-teal-300">
                                          Producción Escrita
                                        </span>
                                      </div>
                                      <p className="text-slate-700 text-xs pl-2">
                                        Evaluación de fluidez, ortografía, redacción de párrafos y respuesta a preguntas literales e inferenciales del texto leído en la semana.
                                      </p>
                                    </td>
                                  </tr>

                                  {/* 3ª HORA: ÁREAS FORMATIVAS */}
                                  <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-3 border border-slate-400 font-extrabold text-indigo-900 text-center align-middle bg-slate-50/40">
                                      Ciencias / Medio Social y Natural
                                    </td>
                                    <td className="p-3 border border-slate-400 font-bold text-slate-800 text-center align-middle bg-slate-50/40">
                                      {grupoTexto}
                                    </td>
                                    <td className="p-2.5 border border-slate-400 bg-slate-50 text-center align-middle">
                                      <div className="font-black text-base text-slate-900">3ª</div>
                                      <div className="text-[10px] text-slate-600 font-bold whitespace-nowrap">10:30 - 11:15</div>
                                      <div className="text-[9px] text-indigo-700 font-semibold">45 min</div>
                                    </td>
                                    <td className="p-3 border border-slate-400 align-top text-slate-800 leading-relaxed space-y-2">
                                      <div className="font-bold text-indigo-900 flex items-center justify-between">
                                        <span>• Verificación de Cuadernos y Bitácora de Indagación:</span>
                                        <span className="text-[10px] px-2 py-0.5 rounded font-black bg-indigo-100 text-indigo-800 border border-indigo-200">
                                          Revisión Formativa
                                        </span>
                                      </div>
                                      <p className="text-slate-700 text-xs pl-2">
                                        Revisión de bitácoras del entorno natural y social articuladas al Tema Eje Transversal ({plan.tema_generador_comun}).
                                      </p>
                                    </td>
                                  </tr>

                                  {/* 4ª HORA: NIVELACIÓN Y RETROALIMENTACIÓN */}
                                  <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-3 border border-slate-400 font-extrabold text-amber-900 text-center align-middle bg-slate-50/40">
                                      Nivelación y Retroalimentación
                                    </td>
                                    <td className="p-3 border border-slate-400 font-bold text-slate-800 text-center align-middle bg-slate-50/40">
                                      {grupoTexto}
                                    </td>
                                    <td className="p-2.5 border border-slate-400 bg-slate-50 text-center align-middle">
                                      <div className="font-black text-base text-slate-900">4ª</div>
                                      <div className="text-[10px] text-slate-600 font-bold whitespace-nowrap">11:15 - 11:50</div>
                                      <div className="text-[9px] text-amber-700 font-semibold">35 min</div>
                                    </td>
                                    <td className="p-3 border border-slate-400 align-top text-slate-800 leading-relaxed space-y-2">
                                      <div className="font-bold text-amber-950 flex items-center justify-between">
                                        <span>• Atención Diferenciada a Estudiantes Rezagados:</span>
                                        <span className="text-[10px] px-2 py-0.5 rounded font-black bg-amber-100 text-amber-800 border border-amber-300">
                                          Lista de Cotejo
                                        </span>
                                      </div>
                                      <p className="text-slate-700 text-xs pl-2">
                                        Tutoría personalizada a estudiantes que no alcanzaron el indicador mínimo y registro de desempeños en la Lista de Cotejo oficial.
                                      </p>
                                    </td>
                                  </tr>

                                  {/* 5ª HORA: CIERRE SEMANAL Y ASAMBLEA */}
                                  <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-3 border border-slate-400 font-extrabold text-slate-800 text-center align-middle bg-slate-50/40">
                                      Cierre Semanal y Asamblea
                                    </td>
                                    <td className="p-3 border border-slate-400 font-bold text-slate-800 text-center align-middle bg-slate-50/40">
                                      {grupoTexto}
                                    </td>
                                    <td className="p-2.5 border border-slate-400 bg-slate-50 text-center align-middle">
                                      <div className="font-black text-base text-slate-900">5ª</div>
                                      <div className="text-[10px] text-slate-600 font-bold whitespace-nowrap">11:50 - 12:00</div>
                                      <div className="text-[9px] text-emerald-700 font-semibold">10 min</div>
                                    </td>
                                    <td className="p-3 border border-slate-400 align-top text-slate-800 leading-relaxed">
                                      <p className="text-slate-700 text-xs">
                                        Asamblea del Gobierno Escolar, felicitaciones por logros semanales, organización del aula y balance pedagógico del docente.
                                      </p>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      }

                      // TABLA OFICIAL PARA LUNES, MARTES, MIÉRCOLES O JUEVES
                      const dia = diaItem as DiaSemana;
                      const diaData = plan.dias[dia];

                      // Obtener nombres de materias para cada período
                      const gData0 = diaData?.gradosSincronizados?.[0];
                      const mats0 = gData0?.materiasSeleccionadas || [];
                      const mat1Nombre = mats0[0]?.materia || gData0?.materia?.split('+')?.[0]?.trim() || 'Matemáticas';
                      const mat2Nombre = mats0[1]?.materia || (mats0.length >= 2 ? mats0[1].materia : 'Comunicación y Lenguaje L1');
                      const mat3Nombre = mats0[2]?.materia || 'Ciencias / Medio Social';
                      const mat4Nombre = mats0[3]?.materia || 'Expresión Artística / Práctica CNB';

                      return (
                        <div key={dia} className="rounded-2xl border-2 border-slate-400 overflow-hidden shadow-sm bg-white print:break-inside-avoid print:mb-8">
                          {/* ENCABEZADO DEL DÍA */}
                          <div className="bg-[#545454] text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 font-black text-xs uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                              <span className="bg-[#00A3E0] text-slate-950 text-[10px] font-black px-2 py-0.5 rounded shadow-2xs">
                                CLASE DIARIA
                              </span>
                              <span>Jornada Diaria Oficial: {dia.toUpperCase()}</span>
                            </div>
                            <span className="text-[11px] font-semibold text-slate-200 lowercase">
                              08:00 a 12:00 h · 210 min efectivos de clase
                            </span>
                          </div>

                          {/* TABLA EXACTA DE 5 COLUMNAS SEGÚN PLANTILLA MINEDUC */}
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs border-collapse border border-slate-400">
                              <thead>
                                <tr className="bg-[#545454] text-white text-center font-bold text-xs divide-x divide-slate-400">
                                  <th className="p-2.5 border border-slate-400 w-36 uppercase tracking-wider">Asignatura</th>
                                  <th className="p-2.5 border border-slate-400 w-32 uppercase tracking-wider">Grupo</th>
                                  <th className="p-2.5 border border-slate-400 w-16 uppercase tracking-wider">Día</th>
                                  <th className="p-2.5 border border-slate-400 w-28 uppercase tracking-wider">Hora</th>
                                  <th className="p-2.5 border border-slate-400 uppercase tracking-wider">Programación - contenidos</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-300 bg-white">
                                
                                {/* ========================================================= */}
                                {/* FILA 1: 1ª HORA (08:15 - 09:05) · MATEMÁTICAS             */}
                                {/* ========================================================= */}
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                  <td className="p-3 border border-slate-400 font-extrabold text-[#005B94] text-center align-middle bg-slate-50/40">
                                    <div className="text-sm font-black text-[#005B94]">{mat1Nombre}</div>
                                    <div className="text-[10px] text-slate-500 font-normal">Bloque Fundamental</div>
                                  </td>
                                  <td className="p-3 border border-slate-400 font-bold text-slate-800 text-center align-middle bg-slate-50/40">
                                    <div className="text-xs font-black">{grupoTexto}</div>
                                    <div className="text-[10px] text-slate-500 font-normal">Atención Simultánea</div>
                                  </td>
                                  <td
                                    rowSpan={5}
                                    className="border border-slate-400 bg-slate-100 text-center align-middle font-black text-slate-800 uppercase tracking-widest text-sm p-2 w-16 select-none"
                                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                                  >
                                    {dia.toUpperCase()}
                                  </td>
                                  <td className="p-2.5 border border-slate-400 bg-slate-50 text-center align-middle">
                                    <div className="font-black text-base text-slate-900">1ª</div>
                                    <div className="text-[10px] text-slate-600 font-bold whitespace-nowrap">08:15 - 09:05</div>
                                    <div className="text-[9px] text-[#005B94] font-semibold">50 min</div>
                                  </td>
                                  <td className="p-3.5 border border-slate-400 align-top text-slate-800 leading-relaxed space-y-3">
                                    {selectedGrados.map((g, idx) => {
                                      const gData = diaData?.gradosSincronizados?.find((gs: any) => gs.gradoNumero === g) || diaData?.gradosSincronizados?.[idx];
                                      const isDirecta = (dia === 'Lunes' && idx === 0) || (dia === 'Martes' && idx === 1) || (dia === 'Miércoles' && idx === 0) || (dia === 'Jueves' && idx === 0) || selectedGrados.length === 1;
                                      const mat1 = gData?.materiasSeleccionadas?.[0];
                                      const pag1 = mat1?.paginaInicio || gData?.numeroPagina || 8;
                                      const tema1 = mat1?.tema || gData?.tema || '';
                                      const temaLimpio1 = tema1.split(',')[0].replace(/\(Pág\..*?\)/g, '').trim();
                                      const actText1 = gData?.periodo1_actividad?.replace(/^08:15\s*-\s*09:05\s*\|\s*/i, '') || gData?.actividadDocente || 'Modelado del algoritmo en pizarra y activación de presaberes.';
                                      const ejs1 = (mat1?.ejerciciosLiterales && mat1.ejerciciosLiterales.length > 0)
                                        ? mat1.ejerciciosLiterales
                                        : (gData?.ejerciciosLiterales || [`Pág. ${pag1}: Resolver ejercicios del libro oficial en el cuaderno.`]);

                                      return (
                                        <div key={g} className="space-y-1.5 pb-2 border-b border-slate-200 last:border-none last:pb-0">
                                          <div className="flex flex-wrap items-center justify-between gap-1 font-bold text-slate-900 text-xs">
                                            <span className="text-[#005B94] font-black flex items-center gap-1.5">
                                              <span className="w-2 h-2 rounded-full bg-[#005B94] shrink-0"></span>
                                              <span>{g}.° Primaria · {mat1?.materia || mat1Nombre} (Pág. {pag1}{temaLimpio1 ? ` · ${temaLimpio1}` : ''})</span>
                                            </span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded font-black ${
                                              isDirecta ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-teal-100 text-teal-800 border border-teal-300'
                                            }`}>
                                              {isDirecta ? 'Atención Directa: Modelado' : 'Trabajo Autónomo: Libro'}
                                            </span>
                                          </div>
                                          <p className="text-slate-700 text-xs pl-3.5 leading-relaxed">
                                            {actText1}
                                          </p>
                                          {ejs1.length > 0 && (
                                            <div className="ml-3.5 mt-1 bg-sky-50 border border-sky-200 rounded-lg p-2 text-[11px] text-sky-950">
                                              <strong className="text-[#005B94]">📖 Libro Oficial MINEDUC:</strong> {ejs1[0]}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </td>
                                </tr>

                                {/* ========================================================= */}
                                {/* FILA 2: 2ª HORA (09:05 - 09:55) · COMUNICACIÓN Y LENGUAJE */}
                                {/* ========================================================= */}
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                  <td className="p-3 border border-slate-400 font-extrabold text-teal-800 text-center align-middle bg-slate-50/40">
                                    <div className="text-sm font-black text-teal-800">{mat2Nombre}</div>
                                    <div className="text-[10px] text-slate-500 font-normal">Bloque Fundamental</div>
                                  </td>
                                  <td className="p-3 border border-slate-400 font-bold text-slate-800 text-center align-middle bg-slate-50/40">
                                    <div className="text-xs font-black">{grupoTexto}</div>
                                    <div className="text-[10px] text-slate-500 font-normal">Rotación de Roles</div>
                                  </td>
                                  <td className="p-2.5 border border-slate-400 bg-slate-50 text-center align-middle">
                                    <div className="font-black text-base text-slate-900">2ª</div>
                                    <div className="text-[10px] text-slate-600 font-bold whitespace-nowrap">09:05 - 09:55</div>
                                    <div className="text-[9px] text-teal-700 font-semibold">50 min</div>
                                  </td>
                                  <td className="p-3.5 border border-slate-400 align-top text-slate-800 leading-relaxed space-y-3">
                                    {selectedGrados.map((g, idx) => {
                                      const gData = diaData?.gradosSincronizados?.find((gs: any) => gs.gradoNumero === g) || diaData?.gradosSincronizados?.[idx];
                                      const isDirectaP2 = (dia === 'Lunes' && idx === 1) || (dia === 'Martes' && idx === 0) || (dia === 'Miércoles' && idx === 1) || (dia === 'Jueves' && idx === 1) || selectedGrados.length === 1;
                                      const mats = gData?.materiasSeleccionadas || [];
                                      const mat2 = (mats.length >= 2) ? mats[1] : mats[0];
                                      const pag2 = mat2?.paginaInicio || gData?.numeroPagina || 8;
                                      const tema2 = mat2?.tema || gData?.tema || '';
                                      const temaLimpio2 = tema2.split(',')[0].replace(/\(Pág\..*?\)/g, '').trim();
                                      const actText2 = gData?.periodo2_actividad?.replace(/^09:05\s*-\s*09:55\s*\|\s*/i, '') || gData?.actividadEstudiante || 'Lectura comprensiva, redacción y ejercitación en libro oficial.';
                                      const ejs2 = (mat2?.ejerciciosLiterales && mat2.ejerciciosLiterales.length > 0)
                                        ? mat2.ejerciciosLiterales
                                        : [`Pág. ${pag2}: Resolver actividades de comprensión lectora en el cuaderno.`];

                                      return (
                                        <div key={g} className="space-y-1.5 pb-2 border-b border-slate-200 last:border-none last:pb-0">
                                          <div className="flex flex-wrap items-center justify-between gap-1 font-bold text-slate-900 text-xs">
                                            <span className="text-teal-900 font-black flex items-center gap-1.5">
                                              <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0"></span>
                                              <span>{g}.° Primaria · {mat2?.materia || mat2Nombre} (Pág. {pag2}{temaLimpio2 ? ` · ${temaLimpio2}` : ''})</span>
                                            </span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded font-black ${
                                              isDirectaP2 ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-teal-100 text-teal-800 border border-teal-300'
                                            }`}>
                                              {isDirectaP2 ? (selectedGrados.length === 1 ? 'Ejercitación Guiada' : 'Atención Directa: Rotación') : 'Trabajo Autónomo: Libro'}
                                            </span>
                                          </div>
                                          <p className="text-slate-700 text-xs pl-3.5 leading-relaxed">
                                            {actText2}
                                          </p>
                                          {ejs2.length > 0 && (
                                            <div className="ml-3.5 mt-1 bg-teal-50 border border-teal-200 rounded-lg p-2 text-[11px] text-teal-950">
                                              <strong className="text-teal-900">📖 Libro Oficial MINEDUC:</strong> {ejs2[0]}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </td>
                                </tr>

                                {/* ========================================================= */}
                                {/* FILA 3: 3ª HORA (10:30 - 11:15) · ÁREAS APLICADAS/CIENCIAS*/}
                                {/* ========================================================= */}
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                  <td className="p-3 border border-slate-400 font-extrabold text-indigo-900 text-center align-middle bg-slate-50/40">
                                    <div className="text-sm font-black text-indigo-900">{mat3Nombre}</div>
                                    <div className="text-[10px] text-slate-500 font-normal">Bloque Formativo</div>
                                  </td>
                                  <td className="p-3 border border-slate-400 font-bold text-slate-800 text-center align-middle bg-slate-50/40">
                                    <div className="text-xs font-black">{grupoTexto}</div>
                                    <div className="text-[10px] text-slate-500 font-normal">Indagación Compartida</div>
                                  </td>
                                  <td className="p-2.5 border border-slate-400 bg-slate-50 text-center align-middle">
                                    <div className="font-black text-base text-slate-900">3ª</div>
                                    <div className="text-[10px] text-slate-600 font-bold whitespace-nowrap">10:30 - 11:15</div>
                                    <div className="text-[9px] text-indigo-700 font-semibold">45 min</div>
                                    <div className="text-[8px] text-amber-700 font-bold mt-0.5">Post-Receso</div>
                                  </td>
                                  <td className="p-3.5 border border-slate-400 align-top text-slate-800 leading-relaxed space-y-3">
                                    {/* En Aulas Multigrado: Explicación Inicial Conjunta en Pizarra sobre el Tema Eje Transversal de la Asignatura */}
                                    {selectedGrados.length > 1 && (() => {
                                      const esSocialesP3 = mat3Nombre.toLowerCase().includes('social');
                                      const esNaturalesP3 = mat3Nombre.toLowerCase().includes('natural') || mat3Nombre.toLowerCase().includes('ciencia');
                                      const temaEjeActivoP3 = (diaData as any)?.temaEjePeriodo3 ||
                                        mats0[2]?.temaEje ||
                                        (esSocialesP3
                                          ? 'Sociedades Prehistóricas, Poblamiento y Primeros Asentamientos de América'
                                          : esNaturalesP3
                                          ? 'La Célula como Unidad de Vida: Estructura, Mitocondria y Reproducción Celular'
                                          : plan.tema_generador_comun);

                                      return (
                                        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-2.5 mb-2 shadow-2xs">
                                          <div className="flex flex-wrap items-center justify-between gap-1 text-xs font-black text-indigo-950 mb-1">
                                            <span className="flex items-center gap-1.5">
                                              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0"></span>
                                              <span>Apertura Plenaria Simultánea en Pizarra (10-15 min) · Tema Eje de {mat3Nombre}</span>
                                            </span>
                                            <span className="bg-indigo-600 text-white text-[9px] px-2 py-0.5 rounded font-black tracking-wide">
                                              Explicación Conjunta a Todos los Grados
                                            </span>
                                          </div>
                                          <p className="text-slate-700 text-xs leading-relaxed">
                                            <strong>Docente en Pizarra:</strong> El maestro reúne la atención de todos los grados ({selectedGrados.map(g => `${g}.°`).join(' y ')} Primaria) y explica el concepto integrador común de <strong>{mat3Nombre}</strong> (<strong>{temaEjeActivoP3}</strong>). Modela el esquema central en la pizarra, formula preguntas generadoras y vincula los conocimientos previos antes de que cada grado pase a resolver individualmente en su libro oficial.
                                          </p>
                                        </div>
                                      );
                                    })()}

                                    {selectedGrados.map((g, idx) => {
                                      const gData = diaData?.gradosSincronizados?.find((gs: any) => gs.gradoNumero === g) || diaData?.gradosSincronizados?.[idx];
                                      const mats = gData?.materiasSeleccionadas || [];
                                      const mat3 = mats[2] || mats[1] || mats[0];
                                      const pag3 = mat3?.paginaInicio || 12;
                                      const tema3 = mat3?.tema || diaData?.enfoqueDidactico || 'Indagación del Tema Eje';
                                      const actText3 = gData?.periodo3_actividad?.replace(/^10:30\s*-\s*11:15\s*\|\s*/i, '') || 'Indagación guiada, experimentación y vinculación comunitaria del tema eje.';
                                      const ejs3 = (mat3?.ejerciciosLiterales && mat3.ejerciciosLiterales.length > 0)
                                        ? mat3.ejerciciosLiterales
                                        : [`Pág. ${pag3}: Responder preguntas de indagación y dibujo reflexivo en el cuaderno.`];

                                      return (
                                        <div key={g} className="space-y-1.5 pb-2 border-b border-slate-200 last:border-none last:pb-0">
                                          <div className="flex flex-wrap items-center justify-between gap-1 font-bold text-slate-900 text-xs">
                                            <span className="text-indigo-900 font-black flex items-center gap-1.5">
                                              <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0"></span>
                                              <span>{g}.° Primaria · {mat3?.materia || mat3Nombre} (Pág. {pag3} · {tema3.slice(0, 32)})</span>
                                            </span>
                                            <span className="text-[10px] px-2 py-0.5 rounded font-black bg-indigo-100 text-indigo-800 border border-indigo-200">
                                              {selectedGrados.length > 1 ? `Trabajo Diferenciado Libro ${g}.°` : 'Indagación y Aplicación'}
                                            </span>
                                          </div>
                                          <p className="text-slate-700 text-xs pl-3.5 leading-relaxed">
                                            {actText3}
                                          </p>
                                          {ejs3.length > 0 && (
                                            <div className="ml-3.5 mt-1 bg-indigo-50 border border-indigo-200 rounded-lg p-2 text-[11px] text-indigo-950">
                                              <strong className="text-indigo-900">📖 Libro Oficial MINEDUC ({g}.° Primaria):</strong> {ejs3[0]}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </td>
                                </tr>

                                {/* ========================================================= */}
                                {/* FILA 4: 4ª HORA (11:15 - 11:50) · RINCONES / PRÁCTICA CNB */}
                                {/* ========================================================= */}
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                  <td className="p-3 border border-slate-400 font-extrabold text-amber-900 text-center align-middle bg-slate-50/40">
                                    <div className="text-sm font-black text-amber-900">{mat4Nombre}</div>
                                    <div className="text-[10px] text-slate-500 font-normal">Rincones y Tutoría</div>
                                  </td>
                                  <td className="p-3 border border-slate-400 font-bold text-slate-800 text-center align-middle bg-slate-50/40">
                                    <div className="text-xs font-black">{grupoTexto}</div>
                                    <div className="text-[10px] text-slate-500 font-normal">Trabajo Cooperativo</div>
                                  </td>
                                  <td className="p-2.5 border border-slate-400 bg-slate-50 text-center align-middle">
                                    <div className="font-black text-base text-slate-900">4ª</div>
                                    <div className="text-[10px] text-slate-600 font-bold whitespace-nowrap">11:15 - 11:50</div>
                                    <div className="text-[9px] text-amber-700 font-semibold">35 min</div>
                                  </td>
                                  <td className="p-3.5 border border-slate-400 align-top text-slate-800 leading-relaxed space-y-3">
                                    {selectedGrados.map((g, idx) => {
                                      const gData = diaData?.gradosSincronizados?.find((gs: any) => gs.gradoNumero === g) || diaData?.gradosSincronizados?.[idx];
                                      const mats = gData?.materiasSeleccionadas || [];
                                      const mat4 = mats[3] || mats[2] || mats[1] || mats[0];
                                      const pag4 = mat4?.paginaInicio || 13;
                                      const tema4 = mat4?.tema || '';
                                      const temaLimpio4 = tema4.split(',')[0].replace(/\(Pág\..*?\)/g, '').trim();
                                      const actText4 = gData?.periodo4_actividad?.replace(/^11:15\s*-\s*11:50\s*\|\s*/i, '') || diaData?.componentes_multigrado?.rincones_aprendizaje || 'Tutoría entre pares y manipulación de material didáctico concreto en rincones de aprendizaje.';
                                      const ejs4 = (mat4?.ejerciciosLiterales && mat4.ejerciciosLiterales.length > 0)
                                        ? mat4.ejerciciosLiterales
                                        : [`Pág. ${pag4}: Realizar lectura del tema y resolver ejercicios analíticos en el cuaderno según el libro oficial.`];

                                      return (
                                        <div key={g} className="space-y-1.5 pb-2 border-b border-slate-200 last:border-none last:pb-0">
                                          <div className="flex flex-wrap items-center justify-between gap-1 font-bold text-slate-900 text-xs">
                                            <span className="text-amber-900 font-black flex items-center gap-1.5">
                                              <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0"></span>
                                              <span>{g}.° Primaria · {mat4?.materia || mat4Nombre} (Pág. {pag4}{temaLimpio4 ? ` · ${temaLimpio4}` : ''})</span>
                                            </span>
                                            <span className="text-[10px] px-2 py-0.5 rounded font-black bg-amber-100 text-amber-800 border border-amber-200">
                                              Rincones y Tutoría entre Pares
                                            </span>
                                          </div>
                                          <p className="text-slate-700 text-xs pl-3.5 leading-relaxed">
                                            {actText4}
                                          </p>
                                          {ejs4.length > 0 && (
                                            <div className="ml-3.5 mt-1 bg-amber-50 border border-amber-200 rounded-lg p-2 text-[11px] text-amber-950">
                                              <strong className="text-amber-900">📖 Libro Oficial MINEDUC:</strong> {ejs4[0]}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </td>
                                </tr>

                                {/* ========================================================= */}
                                {/* FILA 5: 5ª HORA (11:50 - 12:00) · CIERRE Y GOBIERNO       */}
                                {/* ========================================================= */}
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                  <td className="p-3 border border-slate-400 font-extrabold text-slate-800 text-center align-middle bg-slate-50/40">
                                    <div className="text-sm font-black text-slate-900">Cierre Comunitario</div>
                                    <div className="text-[10px] text-slate-500 font-normal">Gobierno y Tareas</div>
                                  </td>
                                  <td className="p-3 border border-slate-400 font-bold text-slate-800 text-center align-middle bg-slate-50/40">
                                    <div className="text-xs font-black">{grupoTexto}</div>
                                    <div className="text-[10px] text-slate-500 font-normal">Asamblea Plenaria</div>
                                  </td>
                                  <td className="p-2.5 border border-slate-400 bg-slate-50 text-center align-middle">
                                    <div className="font-black text-base text-slate-900">5ª</div>
                                    <div className="text-[10px] text-slate-600 font-bold whitespace-nowrap">11:50 - 12:00</div>
                                    <div className="text-[9px] text-emerald-700 font-semibold">10 min</div>
                                  </td>
                                  <td className="p-3.5 border border-slate-400 align-top text-slate-800 leading-relaxed space-y-2">
                                    <div className="bg-sky-50 border border-sky-200 rounded-lg p-2 text-xs">
                                      <strong className="text-[#005B94]">🤝 Diálogo de Saberes Comunitario:</strong>{' '}
                                      <span className="text-slate-700">{diaData?.componentes_multigrado?.dialogo_saberes || 'Puesta en común de los aprendizajes alcanzados y autoevaluación grupal.'}</span>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs">
                                      <strong className="text-slate-800">🏛️ Gobierno Escolar:</strong>{' '}
                                      <span className="text-slate-700">{diaData?.componentes_multigrado?.gobierno_escolar || 'Comisiones estudiantiles organizan el aula, verifican entrega de cuadernos y limpian rincones.'}</span>
                                    </div>
                                    {diaData?.gradosSincronizados?.[0]?.tareaCasa && (
                                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-xs">
                                        <strong className="text-emerald-950">🏠 Tarea en Casa (Refuerzo Familiar):</strong>{' '}
                                        <span className="text-emerald-900 font-medium">{diaData.gradosSincronizados[0].tareaCasa}</span>
                                      </div>
                                    )}
                                  </td>
                                </tr>

                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
{/* NOTAS METODOLÓGICAS */}
              <div className="bg-sky-50/60 rounded-2xl p-4 border border-sky-200 text-slate-700 text-[11px] space-y-1.5">
                <span className="font-extrabold text-[#005B94] uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00A3E0]" />
                  <span>Orientaciones Pedagógicas Oficiales para el Aula Multigrado:</span>
                </span>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 mt-1 leading-relaxed">
                  <li><strong>Prioridad de Materias Troncales:</strong> Matemáticas y Comunicación y Lenguaje L1 ocupan el 60% de la carga horaria semanal.</li>
                  <li><strong>Alternancia Directa/Autónoma:</strong> El docente modela el algoritmo frente a un grado mientras el otro trabaja en el libro oficial del MINEDUC.</li>
                  <li><strong>Demás Clases del CNB:</strong> Consulte la pestaña «Demás Asignaturas del CNB» para la carga horaria de Expresión Artística, Educación Física, etc.</li>
                </ol>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* TAB 2: VIERNES - EVALUACIÓN                                    */}
          {/* =============================================================== */}
          {activeTab === 'evaluacion_viernes' && (
            <div className="p-4 sm:p-6 space-y-6">
              <div className="bg-rose-50 border-2 border-rose-300 p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase text-rose-900 tracking-wider block">
                    Viernes de Evaluación Formativa del CNB
                  </span>
                  <h3 className="text-base font-black text-rose-950">
                    Evaluación de Conocimientos Adquiridos (Materias Planificadas)
                  </h3>
                  <p className="text-xs text-rose-800 mt-0.5">
                    Tiempo destinado exclusivamente (08:00 a 10:00 h) para verificar el alcance de las competencias en cada grado.
                  </p>
                </div>
                <div className="bg-rose-600 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-sm shrink-0">
                  08:00 - 10:00 h (Prueba) + 10:30 - 12:00 h (Refuerzo)
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedGrados.map((grado) => {
                  const evalGrado = plan.evaluacion_viernes?.[`${grado}.° Primaria`] ||
                                   plan.evaluacion_viernes?.[`${grado}`] ||
                                   plan.evaluacion_viernes?.[Object.keys(plan.evaluacion_viernes || {})[0]];

                  return (
                    <div key={grado} className="bg-white rounded-2xl border-2 border-slate-200 p-4 space-y-3 shadow-sm">
                      <div className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center space-x-2">
                          <span className="w-8 h-8 rounded-xl bg-rose-600 text-white font-black text-xs flex items-center justify-center">
                            {grado}.°
                          </span>
                          <div>
                            <h4 className="font-black text-slate-900 text-sm">{grado}.° Primaria</h4>
                            <p className="text-[10px] text-slate-500">Evaluación de Fin de Semana</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900">
                          {evalGrado?.instrumento_evaluacion || 'Prueba Escrita + Lista de Cotejo'}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-[11px] font-black text-slate-700 block">Indicador de Logro Evaluado:</span>
                          <p className="text-slate-600 font-medium">
                            {evalGrado?.indicador_a_evaluar || 'Demuestra dominio de los contenidos trabajados durante la semana.'}
                          </p>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-[11px] font-black text-slate-800 block mb-1">
                            Ejercicios de la Prueba Escrita:
                          </span>
                          <ul className="list-disc list-inside text-slate-700 space-y-1 text-[11px]">
                            {(evalGrado?.hoja_trabajo_ejercicios || [
                              '1. Resuelve los ejercicios y situaciones problema indicados en la hoja.',
                              '2. Aplica los algoritmos y conceptos estudiados en las lecciones de la semana.',
                              '3. Explica tus conclusiones y fundamenta tus respuestas con precisión.'
                            ]).map((ej: string, idx: number) => (
                              <li key={idx}>{ej}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
                          <span className="text-[11px] font-black text-emerald-900 block mb-1">
                            Criterios Observables de la Lista de Cotejo:
                          </span>
                          <ul className="space-y-1 text-[11px] text-emerald-950 font-medium">
                            {(evalGrado?.criterios_lista_cotejo || [
                              'Identifica y ejecuta los algoritmos con precisión fáctica.',
                              'Aplica los conocimientos adquiridos en situaciones de su entorno.',
                              'Muestra orden y autonomía en la resolución de sus ejercicios.'
                            ]).map((crit: string, idx: number) => (
                              <li key={idx} className="flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>{crit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="text-[11px] text-slate-500 pt-1 border-t">
                          <strong>10:30 - 12:00 h:</strong> Retroalimentación formativa y atención a temas rezagados.
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* TAB 3: DEMÁS ASIGNATURAS DEL CNB                               */}
          {/* =============================================================== */}
          {activeTab === 'asignaturas_cnb' && (
            <div className="p-4 sm:p-6 space-y-4">
              <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-900 tracking-wider block">
                    Carga Horaria y Asignaturas Complementarias del CNB
                  </span>
                  <h3 className="text-base font-black text-amber-950">
                    Otras Asignaturas Obligatorias Dictadas por el Ministerio de Educación
                  </h3>
                  <p className="text-xs text-amber-800 mt-0.5">
                    El CNB dicta estas áreas formativas, pero el MINEDUC no distribuye libros de texto para ellas.
                  </p>
                </div>
                <div className="bg-amber-600 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-sm shrink-0">
                  {cicloActual === 'primer_ciclo' ? 'Primer Ciclo (1.°-3.°)' : 'Segundo Ciclo (4.°-6.°)'}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {asignaturasComplementarias.map((asig, idx) => (
                  <div key={idx} className="bg-white border-2 border-slate-200 rounded-2xl p-4 space-y-2 shadow-sm">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="font-extrabold text-slate-900 text-xs">{asig.nombre}</span>
                      <span className="bg-amber-100 text-amber-900 font-black text-[10px] px-2 py-0.5 rounded-full">
                        {asig.periodosSemanales} Periodos
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 space-y-1">
                      <p><strong className="text-slate-800">Carga Horaria:</strong> {asig.horasSemanales} horas semanales</p>
                      <p><strong className="text-slate-800">Enfoque:</strong> {asig.enfoqueSugerido}</p>
                      <p className="text-[10px] text-slate-500 italic mt-1">{asig.notaPedagogica}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PIE DE PÁGINA */}
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center space-x-2">
              <span className="font-black text-[#005B94]">MINEDUC GUATEMALA</span>
              <span>·</span>
              <span>CNB Primaria Multigrado</span>
              <span>·</span>
              <span>DIGECUR / DIGECADE</span>
            </div>
            <div className="font-bold text-[#00A3E0]">
              Ciclo Escolar 2026 · Formato Oficial de Planificación
            </div>
          </div>

        </div>
      )}

      {/* =================================================================== */}
      {/* 5. MODAL DE CONTROL DE AVANCE: TEMAS NO ABARCADOS                   */}
      {/* =================================================================== */}
      {showModalRezagados && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 print:hidden animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col space-y-4">
            {/* Header del Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Control de Avance: Temas No Abarcados</h3>
                  <p className="text-xs text-slate-500">
                    Marca con un gancho las sesiones o temas que <strong>no lograste dar</strong> para que el algoritmo los priorice en la siguiente dosificación.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModalRezagados(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 font-bold flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            {/* Lista de cotejo de sesiones que estaban en el plan */}
            <div className="overflow-y-auto py-2 flex-1 space-y-2 pr-1 scrollbar-thin">
              {sesionesPlanificadas.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-8">
                  No hay sesiones registradas en la dosificación actual.
                </p>
              ) : (
                sesionesPlanificadas.map(s => {
                  const isChecked = !!uncompletedSelection[s.id];
                  return (
                    <label
                      key={s.id}
                      className={`p-3 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-amber-50/90 border-amber-400 shadow-2xs'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          setUncompletedSelection(prev => ({
                            ...prev,
                            [s.id]: e.target.checked
                          }));
                        }}
                        className="mt-1 w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
                      />
                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-extrabold text-slate-900">
                            {s.dia} · {s.materia}
                          </span>
                          <span className="bg-sky-100 text-[#005B94] font-black px-2 py-0.5 rounded-md text-[10px]">
                            {s.grado} · Pág. {s.pagina}
                          </span>
                        </div>
                        <p className="text-slate-700 font-medium mt-1">
                          {s.tema}
                        </p>
                      </div>
                    </label>
                  );
                })
              )}
            </div>

            {/* Footer con acciones */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs font-semibold text-slate-600">
                {Object.values(uncompletedSelection).filter(Boolean).length} tema(s) marcado(s) como pendiente(s)
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setShowModalRezagados(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmarRezagados}
                  disabled={isSavingCheckin}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-black px-4 py-2 rounded-xl text-xs transition-all shadow-sm"
                >
                  {isSavingCheckin ? 'Guardando...' : 'Confirmar y Reprogramar para Siguiente Dosificación'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
