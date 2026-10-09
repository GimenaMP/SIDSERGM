# Plataforma SIDSER

**Sistema Inteligente de Diagnóstico y Seguimiento Educativo Rural**

## Descripción del Proyecto
SIDSER es una plataforma diseñada para optimizar la gestión pedagógica y administrativa en escuelas rurales multigrado (1.º a 6.º de primaria). Opera bajo una filosofía **Offline-First** (PWA), adaptada a entornos rurales con conectividad limitada o intermitente, integrando el Currículo Nacional Base (CNB) de Guatemala y asistencia con Inteligencia Artificial.

### Componentes y Módulos Clave:
- **Autenticación y Control de Acceso (RBAC):** Roles para Profesor, Director y Administrador.
- **Carga Estudiantil y Planificación Multigrado:** Importación masiva desde Excel/CSV (.xlsx/.csv), consulta curricular RAG con base vectorial CNB, exportación de planificaciones a PDF y control diario de asistencia/tareas.
- **Evaluación, Diagnóstico y Nivelación:** Cierre semanal de temas impartidos, generación adaptativa de exámenes con IA (Google Gemini anonimizado), matriz de evaluación binaria (1/0), cálculo dinámico de promedio, semáforo de desempeño y generación de hojas de refuerzo.
- **Gestión Institucional y Telemetría:** Asignación exclusiva de grados por directores, métricas docentes, monitoreo de cuotas/tokens y purga segura con respaldo automático en Google Drive.

## Pila Tecnológica
- **Frontend / PWA:** Next.js (React), LocalStorage / IndexedDB, Service Workers (Offline-First).
- **Backend & Base de Datos:** Supabase (PostgreSQL 6FN, RLS, pgvector).
- **Inteligencia Artificial:** Google Gemini API (gemini-3.8-flash / gemini-2.5-flash) con salida JSON estructurada y anonimización mediante hashing.
