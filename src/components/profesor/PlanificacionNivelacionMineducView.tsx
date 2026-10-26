'use client';

import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  FileText, 
  Users, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  ArrowRight,
  Layers,
  ChevronDown,
  Info
} from 'lucide-react';

interface Props {
  semana?: number;
  grados?: number[];
  onVolver?: () => void;
}

export const PlanificacionNivelacionMineducView: React.FC<Props> = ({
  semana = 1,
  grados = [5, 6],
  onVolver
}) => {
  const [activeTab, setActiveTab] = useState<'grupoA' | 'grupoB' | 'horarioMultigrado'>('grupoA');
  const [showNotes, setShowNotes] = useState(true);

  return (
    <div className="space-y-6">
      {/* Barra de Acciones y Navegación */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="bg-[#00A3E0]/15 text-[#0077A9] font-black text-xs px-2.5 py-0.5 rounded-full border border-[#00A3E0]/30">
              Formato Oficial MINEDUC
            </span>
            <span className="bg-amber-100 text-amber-900 font-bold text-xs px-2.5 py-0.5 rounded-full border border-amber-200">
              Aulas Multigrado: 5.° y 6.° Primaria
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Estrategia de Nivelación de los Aprendizajes</span>
            <span className="text-sm font-semibold text-slate-500">· Semana {semana}</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Estructura idéntica al folleto técnico emitido por DIGECUR / DIGECADE para la recuperación intensiva de la lectoescritura.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Tabs Selector */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('grupoA')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'grupoA'
                  ? 'bg-[#00A3E0] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Grupo A (Nivelación)
            </button>
            <button
              onClick={() => setActiveTab('grupoB')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'grupoB'
                  ? 'bg-[#0077A9] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Grupo B (Lectura Fluida)
            </button>
            <button
              onClick={() => setActiveTab('horarioMultigrado')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'horarioMultigrado'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Horario Multigrado (CNB 5.° y 6.°)
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all shadow-sm flex items-center space-x-1.5"
            title="Imprimir o guardar en PDF con formato oficial"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Ficha</span>
          </button>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL ESTILO DOCUMENTO OFICIAL MINEDUC */}
      <div className="bg-white rounded-3xl border-2 border-[#00A3E0]/40 shadow-xl overflow-hidden print:border-none print:shadow-none print:m-0 print:p-0">
        
        {/* ========================================================= */}
        {/* ENCABEZADO OFICIAL MINEDUC (IDÉNTICO A LAS PÁGINAS 3 Y 5) */}
        {/* ========================================================= */}
        <div className="bg-gradient-to-r from-[#005B94] via-[#0077A9] to-[#00A3E0] text-white px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="bg-white text-[#005B94] p-2 rounded-xl font-black text-center leading-tight shadow-md">
              <div className="text-[10px] tracking-wider uppercase">Gobierno de la</div>
              <div className="text-xs font-black">REPÚBLICA</div>
              <div className="text-[9px] font-bold">GUATEMALA</div>
            </div>
            <div>
              <div className="text-lg font-black tracking-wide leading-none">Ministerio de Educación</div>
              <div className="text-xs text-sky-100 font-medium mt-0.5">Dirección General de Currículo —DIGECUR— / DIGECADE</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <span className="text-sm font-black uppercase tracking-wider block">PLANIFICACIÓN SEMANA {semana}</span>
              <span className="text-[11px] text-sky-100">Área de Comunicación y Lenguaje / Lectoescritura</span>
            </div>
            <div className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-md ${
              activeTab === 'grupoA'
                ? 'bg-[#00A3E0] text-white border-2 border-white'
                : activeTab === 'grupoB'
                ? 'bg-[#00B4D8] text-white border-2 border-white'
                : 'bg-slate-900 text-white border-2 border-white'
            }`}>
              {activeTab === 'grupoA' && 'GRUPO A'}
              {activeTab === 'grupoB' && 'GRUPO B'}
              {activeTab === 'horarioMultigrado' && 'CNB MULTIGRADO'}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* VISTA 1: GRUPO A (PÁGINA 3 DEL DOCUMENTO OFICIAL)         */}
        {/* ========================================================= */}
        {activeTab === 'grupoA' && (
          <div className="p-4 sm:p-6 space-y-6">
            <div className="overflow-x-auto rounded-2xl border border-sky-300 shadow-sm">
              <table className="w-full text-xs text-left border-collapse">
                {/* ENCABEZADOS DE COLUMNAS CYAN OFICIALES */}
                <thead>
                  <tr className="bg-[#00A3E0] text-white text-center font-bold">
                    <th className="p-3 border border-sky-400 w-28 uppercase text-[11px]">
                      Materiales /<br />Habilidades
                    </th>
                    <th className="p-3 border border-sky-400 w-44">
                      Hoja con cajas de sonidos¹ /<br />
                      <span className="text-sky-100 font-normal">conciencia fonológica</span>
                    </th>
                    <th className="p-3 border border-sky-400 w-48">
                      Tarjetas de letras² /<br />
                      <span className="text-sky-100 font-normal">Principio Alfabético</span>
                    </th>
                    <th className="p-3 border border-sky-400 w-48">
                      Tira de letras³ /<br />
                      <span className="text-sky-100 font-normal">decodificación</span>
                    </th>
                    <th className="p-3 border border-sky-400 w-52">
                      Tarjetas de fluidez⁴ /<br />
                      <span className="text-sky-100 font-normal">fluidez</span>
                    </th>
                    <th className="p-3 border border-sky-400 w-64">
                      Tarjetas de fluidez⁴ /<br />
                      <span className="text-sky-100 font-normal">escritura</span>
                    </th>
                  </tr>

                  {/* FILA DE TIEMPOS SUGERIDOS */}
                  <tr className="bg-[#E0F2FE] text-[#0369A1] text-center font-extrabold text-[11px]">
                    <td className="p-1.5 border border-sky-300">Tiempo</td>
                    <td className="p-1.5 border border-sky-300">Aprox. 7 minutos</td>
                    <td className="p-1.5 border border-sky-300">Aprox. 5 minutos</td>
                    <td className="p-1.5 border border-sky-300">Aprox. 8 minutos</td>
                    <td className="p-1.5 border border-sky-300">Aprox. 10 minutos</td>
                    <td className="p-1.5 border border-sky-300">Aprox. 10 minutos</td>
                  </tr>

                  {/* FILA DE ASIGNACIÓN DÍA / GRUPO */}
                  <tr className="bg-[#BAE6FD] text-[#075985] text-center font-extrabold text-[11px]">
                    <td className="p-1.5 border border-sky-300">Día/Grupo</td>
                    <td className="p-1.5 border border-sky-300">TODOS GRUPO A</td>
                    <td className="p-1.5 border border-sky-300">TODOS GRUPO A</td>
                    <td className="p-1.5 border border-sky-300">TODOS GRUPO A</td>
                    <td className="p-1.5 border border-sky-300">CADA GRUPO TARJETA 1⁵</td>
                    <td className="p-1.5 border border-sky-300">CADA GRUPO TARJETA 1⁶</td>
                  </tr>
                </thead>

                {/* CUERPO DE LA TABLA: LUNES A VIERNES */}
                <tbody className="divide-y divide-sky-200 bg-white">
                  
                  {/* --- LUNES --- */}
                  <tr className="hover:bg-sky-50/50 transition-colors">
                    <td className="p-3 font-extrabold text-[#0369A1] bg-sky-50/80 border border-sky-200 text-center align-top">
                      Lunes
                    </td>
                    <td className="p-3 border border-sky-200 align-top">
                      <p className="font-bold text-slate-800 mb-1">Separar los sonidos de:</p>
                      <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                        <li>se</li>
                        <li>Sam</li>
                        <li>mío</li>
                        <li>ame</li>
                        <li>asas</li>
                      </ul>
                    </td>
                    <td className="p-3 border border-sky-200 align-top text-slate-700 leading-relaxed">
                      Presente las letras <strong className="text-slate-900">m, s, a, e, i, o, u</strong>, en mayúscula y minúscula, diciendo: <em>«esta letra se llama… y su sonido es…»</em> Luego las ponen en la bolsa.<br /><br />
                      Muestre las tarjetas de las letras rápidamente mientras los estudiantes van diciendo el sonido de cada una.⁸
                    </td>
                    <td className="p-3 border border-sky-200 align-top text-slate-700 leading-relaxed">
                      Con las letras: <strong className="text-slate-900">a, s, í, e</strong>, formen las palabras:
                      <ul className="mt-1 font-mono text-[11px] font-bold text-slate-900 space-y-0.5">
                        <li>• así</li>
                        <li>• así —› sí⁷</li>
                        <li>• sí —› se</li>
                        <li>• se —› ese</li>
                        <li>• ese —› es</li>
                      </ul>
                    </td>
                    <td className="p-3 border border-sky-200 align-top text-slate-700 leading-relaxed">
                      <p className="font-bold text-slate-800">Etapas emergente, inicial y decodificadora⁵:</p>
                      <p className="mb-2">en parejas realizan lectura a coro.</p>
                      <p className="font-bold text-slate-800">Etapa automatizadora:</p>
                      <p>lectura individual en voz alta.</p>
                    </td>
                    <td className="p-3 border border-sky-200 align-top text-slate-700 leading-relaxed space-y-1">
                      <p>• <strong className="text-slate-900">Etapa emergente:</strong> copia de las palabras de la 1 a la 8.</p>
                      <p>• <strong className="text-slate-900">Etapa inicial:</strong> copia de las palabras de la 1 a la 8.</p>
                      <p>• <strong className="text-slate-900">Etapa decodificadora:</strong> copia de las frases de la 1 a la 5.</p>
                      <p>• <strong className="text-slate-900">Etapa automatizadora:</strong> dictado del primer párrafo del texto <em>Tikal</em>.</p>
                    </td>
                  </tr>

                  {/* --- MARTES --- */}
                  <tr className="hover:bg-sky-50/50 transition-colors">
                    <td className="p-3 font-extrabold text-[#0369A1] bg-sky-50/80 border border-sky-200 text-center align-top">
                      Martes
                    </td>
                    <td className="p-3 border border-sky-200 align-top">
                      <p className="font-bold text-slate-800 mb-1">Unir los sonidos de:</p>
                      <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                        <li>es</li>
                        <li>mía</li>
                        <li>Ema</li>
                        <li>mimo</li>
                        <li>amas</li>
                      </ul>
                    </td>
                    <td className="p-3 border border-sky-200 align-top text-slate-700 leading-relaxed">
                      Muestre las tarjetas de las letras rápidamente mientras los estudiantes van diciendo el sonido de cada una.⁸
                    </td>
                    <td className="p-3 border border-sky-200 align-top text-slate-700 leading-relaxed">
                      Con las letras: <strong className="text-slate-900">a (2), s, o, e</strong>, formen las palabras:
                      <ul className="mt-1 font-mono text-[11px] font-bold text-slate-900 space-y-0.5">
                        <li>• asa</li>
                        <li>• asa —› aso</li>
                        <li>• aso —› eso</li>
                        <li>• eso —› oso</li>
                        <li>• oso —› osa</li>
                      </ul>
                    </td>
                    <td className="p-3 border border-sky-200 align-top text-slate-700 leading-relaxed">
                      <p className="font-bold text-slate-800">• Emergente, inicial, decodificadora⁵:</p>
                      <p className="mb-2">en pareja realizan lectura por turnos.</p>
                      <p className="font-bold text-slate-800">• Etapa automatizadora:</p>
                      <p>en pareja realizan lectura por turnos.</p>
                    </td>
                    <td className="p-3 border border-sky-200 align-top text-slate-700 leading-relaxed space-y-1">
                      <p>• <strong className="text-slate-900">Etapa emergente:</strong> copia de las palabras de la 9 a la 16.</p>
                      <p>• <strong className="text-slate-900">Etapa inicial:</strong> copia de las palabras de la 9 a la 16.</p>
                      <p>• <strong className="text-slate-900">Etapa decodificadora:</strong> dictado de las oraciones de la 6 a la 9.</p>
                      <p>• <strong className="text-slate-900">Etapa automatizadora:</strong> copia del segundo párrafo del texto <em>Tikal</em>.</p>
                    </td>
                  </tr>

                  {/* --- MIÉRCOLES --- */}
                  <tr className="hover:bg-sky-50/50 transition-colors">
                    <td className="p-3 font-extrabold text-[#0369A1] bg-sky-50/80 border border-sky-200 text-center align-top">
                      Miércoles
                    </td>
                    <td className="p-3 border border-sky-200 align-top">
                      <p className="font-bold text-slate-800 mb-1">Separar los sonidos:</p>
                      <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                        <li>mi</li>
                        <li>mes</li>
                        <li>misa</li>
                        <li>osas</li>
                        <li>mamá</li>
                      </ul>
                    </td>
                    <td className="p-3 border border-sky-200 align-top text-slate-700 leading-relaxed">
                      Muestre las tarjetas de las letras rápidamente mientras los estudiantes van diciendo el sonido de cada una.⁸
                    </td>
                    <td className="p-3 border border-sky-200 align-top text-slate-700 leading-relaxed">
                      Con las letras: <strong className="text-slate-900">m, e, i, s, a</strong>, formen las palabras:
                      <ul className="mt-1 font-mono text-[11px] font-bold text-slate-900 space-y-0.5">
                        <li>• mis</li>
                        <li>• mis —› mi</li>
                        <li>• mi —› me</li>
                        <li>• me —› mes</li>
                        <li>• mes —› mesa</li>
                      </ul>
                    </td>
                    <td className="p-3 border border-sky-200 align-top text-slate-700 leading-relaxed">
                      <p className="font-bold text-slate-800">Etapas emergente, inicial y decodificadora⁵:</p>
                      <p className="mb-2">en pareja realizan lectura a coro.</p>
                      <p className="font-bold text-slate-800">Etapa automatizadora:</p>
                      <p>en pareja realizan lectura a coro.</p>
                    </td>
                    <td className="p-3 border border-sky-200 align-top text-slate-700 leading-relaxed space-y-1">
                      <p>• <strong className="text-slate-900">Etapa emergente:</strong> copia de las palabras de la 17 a la 24.</p>
                      <p>• <strong className="text-slate-900">Etapa inicial:</strong> dictado de las palabras de la 17 a la 25.</p>
                      <p>• <strong className="text-slate-900">Etapa decodificadora:</strong> copia de las oraciones de la 11 a la 12.</p>
                      <p>• <strong className="text-slate-900">Etapa automatizadora:</strong> copia del último párrafo del texto <em>Tikal</em>.</p>
                    </td>
                  </tr>

                  {/* --- JUEVES --- */}
                  <tr className="hover:bg-sky-50/50 transition-colors">
                    <td className="p-3 font-extrabold text-[#0369A1] bg-sky-50/80 border border-sky-200 text-center align-top">
                      Jueves
                    </td>
                    <td className="p-3 border border-sky-200 align-top">
                      <p className="font-bold text-slate-800 mb-1">Unir los sonidos de:</p>
                      <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                        <li>sea</li>
                        <li>eso</li>
                        <li>suma</li>
                        <li>mesa</li>
                        <li>osos</li>
                      </ul>
                    </td>
                    <td className="p-3 border border-sky-200 align-top text-slate-700 leading-relaxed">
                      Muestre las tarjetas de las letras rápidamente mientras los estudiantes van diciendo el sonido de cada una.⁸
                    </td>
                    <td className="p-3 border border-sky-200 align-top text-slate-700 leading-relaxed">
                      Con las letras: <strong className="text-slate-900">m, s, a</strong>, formen las palabras:
                      <ul className="mt-1 font-mono text-[11px] font-bold text-slate-900 space-y-0.5">
                        <li>• amas</li>
                        <li>• amas —› mas</li>
                        <li>• mas —› masa</li>
                        <li>• masa —› asa</li>
                        <li>• asa —› ama</li>
                      </ul>
                    </td>
                    <td className="p-3 border border-sky-200 align-top text-slate-700 leading-relaxed">
                      <p className="font-bold text-slate-800">Emergente, inicial y decodificadora:</p>
                      <p className="mb-2">en pareja realizan lectura en eco.</p>
                      <p className="font-bold text-slate-800">Etapa automatizadora:</p>
                      <p>lectura silenciosa y responden oralmente las preguntas de comprensión de la tarjeta anaranjada.</p>
                    </td>
                    <td className="p-3 border border-sky-200 align-top text-slate-700 leading-relaxed space-y-1">
                      <p>• <strong className="text-slate-900">Etapa emergente:</strong> dictado de las palabras de la 25 a la 32.</p>
                      <p>• <strong className="text-slate-900">Etapa inicial:</strong> copia de las frases de la 26 a la 33.</p>
                      <p>• <strong className="text-slate-900">Etapa decodificadora:</strong> copia de las oraciones de la 13 a la 15.</p>
                      <p>• <strong className="text-slate-900">Etapa automatizadora:</strong> actividad de escritura de la tarjeta anaranjada sem 1.</p>
                    </td>
                  </tr>

                  {/* --- VIERNES --- */}
                  <tr className="hover:bg-sky-50/50 transition-colors">
                    <td className="p-3 font-extrabold text-[#0369A1] bg-sky-50/80 border border-sky-200 text-center align-top">
                      Viernes
                    </td>
                    <td className="p-3 border border-sky-200 align-top text-slate-700 leading-relaxed">
                      Reposición de alguna sesión que le haya faltado. O trabaje separación de sonidos usando las palabras del jueves.
                    </td>
                    <td className="p-3 border border-sky-200 align-top text-slate-700 leading-relaxed">
                      En parejas los estudiantes juegan <strong className="text-slate-900">lotería de letras</strong> (ver guía).
                    </td>
                    <td className="p-3 border border-sky-200 align-top text-slate-700 leading-relaxed">
                      SOLO si hizo todas las actividades de los días anteriores, formen palabras que ya conocen con las letras disponibles. Luego deben leerla para asegurarse de que tiene sentido.
                    </td>
                    <td className="p-3 border border-sky-200 align-top text-slate-700 leading-relaxed">
                      Repase haciendo lectura a coro en parejas.
                    </td>
                    <td className="p-3 border border-sky-200 align-top text-slate-700 leading-relaxed space-y-1">
                      <p>• <strong className="text-slate-900">Etapas emergente, inicial y decodificadora:</strong> copia de las palabras, frases u oraciones que no lograron hacer durante la semana. O repase la copia donde cometieron errores.</p>
                      <p>• <strong className="text-slate-900">Etapa automatizadora:</strong> escritura libre.⁹</p>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>

            {/* NOTAS METODOLÓGICAS OFICIALES AL PIE */}
            <div className="bg-sky-50/60 rounded-2xl p-4 border border-sky-200 text-slate-700 text-[11px] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[#0369A1] uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-[#00A3E0]" />
                  <span>Notas Metodológicas Oficiales de la Semana 1</span>
                </span>
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className="text-xs font-bold text-[#0077A9] hover:underline"
                >
                  {showNotes ? 'Ocultar notas' : 'Ver 9 notas'}
                </button>
              </div>

              {showNotes && (
                <ol className="list-decimal list-inside space-y-1.5 text-slate-600 mt-2 leading-relaxed">
                  <li><strong>Caja de sonidos:</strong> Elaborada en clase con cartón resistente y seis casillas. Se emplean objetos pequeños (semillas, tapitas o maíces) para representar los sonidos de la palabra. Desarrolla la conciencia fonológica.</li>
                  <li><strong>Organización de tarjetas:</strong> Los estudiantes usarán dos sobres o bolsas: uno para todo el alfabeto recortable y otro para las letras de la semana activa.</li>
                  <li><strong>Tira de letras:</strong> Tira de cartulina doblada con pestaña para encajar las letras y formar palabras continuas. (2) indica que se necesitan dos tarjetas de la misma letra.</li>
                  <li><strong>Tarjetas decodificables Sem. 1:</strong> Morada (Emergente), Azul (Inicial), Verde (Decodificadora), Anaranjada (Automatizadora).</li>
                  <li><strong>Lectura previa:</strong> Antes de la lectura en voz alta, el estudiante realiza lectura silenciosa e individual para familiarizarse.</li>
                  <li><strong>Cuaderno de escritura:</strong> Las actividades de copia y dictado se realizan en su cuaderno habitual de Comunicación y Lenguaje L1.</li>
                  <li><strong>Regla ortográfica de acentuación:</strong> A partir de tercer grado recordar que <em>«así»</em> es aguda terminada en vocal y lleva tilde; <em>«sí»</em> lleva tilde diacrítica afirmativa.</li>
                  <li><strong>Actividades de tiempo extra:</strong> Juego del sonido inicial con palabras de la tarjeta morada o azul; «Dime el sonido de la mayúscula».</li>
                  <li><strong>Sugerencias de escritura libre:</strong> Pasos de una receta, manualidad, descripción de un animal, tradición comunitaria o carta familiar.</li>
                </ol>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VISTA 2: GRUPO B (PÁGINA 5 DEL DOCUMENTO OFICIAL)         */}
        {/* ========================================================= */}
        {activeTab === 'grupoB' && (
          <div className="p-4 sm:p-6 space-y-6">
            <div className="bg-[#EBF8FF] p-3 rounded-xl border border-sky-200 text-xs text-[#0369A1] font-semibold flex items-center justify-between">
              <span><strong>IMPORTANTE:</strong> Utilice esta planificación para las 16 semanas de intervención con los alumnos que alcanzaron el nivel de fluidez lectora (lectores independientes).</span>
              <span className="bg-[#0077A9] text-white px-3 py-1 rounded-lg font-bold text-[11px]">Semana 1: Tarjetas 1 y 2</span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-sky-300 shadow-sm">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-[#0077A9] text-white text-center font-bold">
                    <th className="p-3 border border-sky-400 w-48 uppercase text-[11px]">
                      Material a utilizar
                    </th>
                    <th className="p-3 border border-sky-400 w-28">Tiempo</th>
                    <th className="p-3 border border-sky-400">Lunes</th>
                    <th className="p-3 border border-sky-400">Martes</th>
                    <th className="p-3 border border-sky-400">Miércoles</th>
                    <th className="p-3 border border-sky-400">Jueves</th>
                    <th className="p-3 border border-sky-400">Viernes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-200 bg-white">
                  <tr>
                    <td rowSpan={2} className="p-4 font-bold text-slate-800 bg-sky-50/50 border border-sky-200 align-top">
                      <div className="flex items-start gap-2">
                        <BookOpen className="w-5 h-5 text-[#0077A9] shrink-0 mt-0.5" />
                        <div>
                          <div className="font-extrabold text-[#005B94]">Tarjetas de lecturas ilustradas</div>
                          <div className="text-[11px] text-slate-600 font-normal mt-1">
                            Serie oficial <em>«Historias jamás contadas»</em> con ejercicios de comprensión y redacción.
                          </div>
                          <div className="mt-2 inline-block bg-sky-100 text-[#0077A9] px-2 py-0.5 rounded text-[10px] font-bold">
                            Lectura 1: El espantapájaros feliz
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-extrabold text-[#0369A1] bg-sky-50/30 border border-sky-200 text-center align-top whitespace-nowrap">
                      20 minutos<br />
                      <span className="text-[10px] text-slate-500 font-normal">(Lectura)</span>
                    </td>
                    <td className="p-3 border border-sky-200 align-top text-slate-700 leading-relaxed">
                      Práctica de lectura individual (oral y silenciosa) utilizando la <strong className="text-slate-900">tarjeta 1</strong>.
                    </td>
                    <td className="p-3 border border-sky-200 align-top text-slate-700 leading-relaxed">
                      Práctica de lectura por turnos utilizando la <strong className="text-slate-900">tarjeta 1</strong>.
                    </td>
                    <td className="p-3 border border-sky-200 align-top text-slate-700 leading-relaxed">
                      Práctica de lectura individual (oral y silenciosa) utilizando la <strong className="text-slate-900">tarjeta 2</strong>.
                    </td>
                    <td className="p-3 border border-sky-200 align-top text-slate-700 leading-relaxed">
                      Práctica de lectura en coro utilizando la <strong className="text-slate-900">tarjeta 2</strong>.
                    </td>
                    <td className="p-3 border border-sky-200 align-top text-slate-700 leading-relaxed">
                      Repaso de fluidez lectora utilizando lectura en eco.
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3 font-extrabold text-[#0369A1] bg-sky-50/30 border border-sky-200 text-center align-top whitespace-nowrap">
                      20 minutos<br />
                      <span className="text-[10px] text-slate-500 font-normal">(Comprensión / Escritura)</span>
                    </td>
                    <td className="p-3 border border-sky-200 align-top text-slate-700 leading-relaxed">
                      Realizar los ejercicios de comprensión lectora de la <strong className="text-slate-900">tarjeta 1</strong>.
                    </td>
                    <td className="p-3 border border-sky-200 align-top text-slate-700 leading-relaxed">
                      Realizar los ejercicios de escritura de la <strong className="text-slate-900">tarjeta 1</strong>.
                    </td>
                    <td className="p-3 border border-sky-200 align-top text-slate-700 leading-relaxed">
                      Realizar los ejercicios de comprensión lectora de la <strong className="text-slate-900">tarjeta 2</strong>.
                    </td>
                    <td className="p-3 border border-sky-200 align-top text-slate-700 leading-relaxed">
                      Realizar los ejercicios de escritura de la <strong className="text-slate-900">tarjeta 2</strong>.
                    </td>
                    <td className="p-3 border border-sky-200 align-top text-slate-700 leading-relaxed">
                      Escritura libre realizando alguno de los ejercicios propuestos en la guía docente.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Dosificación de las 16 semanas para Grupo B */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
                Referencia Rápida de Tarjetas — Grupo B (16 Semanas)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 text-[11px]">
                <div className="bg-sky-100/70 border border-sky-300 p-2 rounded-xl text-center font-bold text-sky-900">
                  Sem 1: Tarj. 1 y 2
                </div>
                <div className="bg-white border border-slate-200 p-2 rounded-xl text-center text-slate-700">
                  Sem 2: Tarj. 3 y 4
                </div>
                <div className="bg-white border border-slate-200 p-2 rounded-xl text-center text-slate-700">
                  Sem 3: Tarj. 5 y 6
                </div>
                <div className="bg-white border border-slate-200 p-2 rounded-xl text-center text-slate-700">
                  Sem 4: Tarj. 7 y 8
                </div>
                <div className="bg-white border border-slate-200 p-2 rounded-xl text-center text-slate-700">
                  Sem 5: Tarj. 9 y 10
                </div>
                <div className="bg-white border border-slate-200 p-2 rounded-xl text-center text-slate-700">
                  Sem 6: Tarj. 11 y 12
                </div>
                <div className="bg-white border border-slate-200 p-2 rounded-xl text-center text-slate-700">
                  Sem 7: Tarj. 13 y 14
                </div>
                <div className="bg-white border border-slate-200 p-2 rounded-xl text-center text-slate-700">
                  Sem 8: Tarj. 15 y 16
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VISTA 3: HORARIO DIARIO CNB MULTIGRADO (5.° Y 6.° PRIMARIA)*/}
        {/* ========================================================= */}
        {activeTab === 'horarioMultigrado' && (
          <div className="p-4 sm:p-6 space-y-6">
            <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
                  Distribución Oficial de la Jornada (08:00 - 12:00 h)
                </span>
                <h3 className="text-lg font-black tracking-tight">
                  Ponderación Curricular CNB para Aulas Multigrado (5.° y 6.° Grado)
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  60% del tiempo concentrado en las Áreas Fundamentales (Matemáticas y Lenguaje) con alternancia directa docente.
                </p>
              </div>
              <div className="flex items-center space-x-3 shrink-0">
                <div className="bg-white/10 px-3 py-2 rounded-xl text-center">
                  <div className="text-[10px] text-slate-400">Tiempo Troncal</div>
                  <div className="text-base font-black text-white">150 min (71%)</div>
                </div>
                <div className="bg-white/10 px-3 py-2 rounded-xl text-center">
                  <div className="text-[10px] text-slate-400">Tiempo Integrado</div>
                  <div className="text-base font-black text-emerald-400">60 min (29%)</div>
                </div>
              </div>
            </div>

            {/* Matriz de Bloques Diarios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* QUINTO PRIMARIA */}
              <div className="bg-white rounded-2xl border-2 border-slate-200 p-4 space-y-3 shadow-sm">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-7 h-7 rounded-lg bg-sky-600 text-white font-black text-xs flex items-center justify-center">5.°</span>
                    <div>
                      <h4 className="font-black text-slate-900 text-sm">Quinto Primaria</h4>
                      <p className="text-[10px] text-slate-500">Semana 1 · Bloque 1</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                    Pág. 10 Libro MINEDUC
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                    <div className="flex items-center justify-between text-[11px] font-black text-rose-900 mb-0.5">
                      <span>08:15 - 09:05 | Matemáticas (50 min)</span>
                      <span className="bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded text-[10px]">Atención Directa</span>
                    </div>
                    <p className="text-slate-700 font-semibold">Valor Posicional hasta 1,000,000</p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      El maestro explica en pizarra la tabla de órdenes: unidades, millares y millones. Los estudiantes descomponen cantidades en notación exponencial.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200">
                    <div className="flex items-center justify-between text-[11px] font-black text-teal-900 mb-0.5">
                      <span>09:05 - 09:55 | Matemáticas (50 min)</span>
                      <span className="bg-teal-200 text-teal-900 px-1.5 py-0.5 rounded text-[10px]">Trabajo Autónomo</span>
                    </div>
                    <p className="text-slate-700 font-semibold">Resolución en Libro MINEDUC Pág. 10</p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Resuelven de forma individual los ejercicios 1 al 8 de descomposición y jerarquía numérica mientras el maestro asiste a 6.°.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200">
                    <div className="flex items-center justify-between text-[11px] font-black text-sky-900 mb-0.5">
                      <span>10:30 - 11:15 | Lenguaje / ENA (45 min)</span>
                      <span className="bg-sky-200 text-sky-900 px-1.5 py-0.5 rounded text-[10px]">Grupo A / B</span>
                    </div>
                    <p className="text-slate-700 font-semibold">Estrategia de Nivelación (Semana 1)</p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Grupo A ejecuta caja de sonidos y tarjetas M-S. Grupo B realiza lectura silenciosa de <em>«El espantapájaros feliz»</em>.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center justify-between text-[11px] font-black text-emerald-900 mb-0.5">
                      <span>11:15 - 11:50 | Ciencias Naturales (35 min)</span>
                      <span className="bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded text-[10px]">Rincones / Cooperativo</span>
                    </div>
                    <p className="text-slate-700 font-semibold">La Célula Vegetal y Animal</p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Elaboran modelo gráfico de la célula comparando membrana, núcleo y citoplasma.
                    </p>
                  </div>
                </div>
              </div>

              {/* SEXTO PRIMARIA */}
              <div className="bg-white rounded-2xl border-2 border-slate-200 p-4 space-y-3 shadow-sm">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center">6.°</span>
                    <div>
                      <h4 className="font-black text-slate-900 text-sm">Sexto Primaria</h4>
                      <p className="text-[10px] text-slate-500">Semana 1 · Bloque 1</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                    Pág. 10 Libro MINEDUC
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200">
                    <div className="flex items-center justify-between text-[11px] font-black text-teal-900 mb-0.5">
                      <span>08:15 - 09:05 | Matemáticas (50 min)</span>
                      <span className="bg-teal-200 text-teal-900 px-1.5 py-0.5 rounded text-[10px]">Trabajo Autónomo</span>
                    </div>
                    <p className="text-slate-700 font-semibold">Teoría de Conjuntos en Libro Pág. 10</p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Lectura guiada de la lección 1 y resolución autónoma de diagramas de Venn (unión e intersección de conjuntos).
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                    <div className="flex items-center justify-between text-[11px] font-black text-rose-900 mb-0.5">
                      <span>09:05 - 09:55 | Matemáticas (50 min)</span>
                      <span className="bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded text-[10px]">Atención Directa</span>
                    </div>
                    <p className="text-slate-700 font-semibold">Operaciones Lógicas con Conjuntos</p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      El maestro modela en la pizarra la diferencia (A - B) y complemento (A&apos;). Corrección interactiva y aclaración de dudas.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200">
                    <div className="flex items-center justify-between text-[11px] font-black text-sky-900 mb-0.5">
                      <span>10:30 - 11:15 | Lenguaje / ENA (45 min)</span>
                      <span className="bg-sky-200 text-sky-900 px-1.5 py-0.5 rounded text-[10px]">Grupo A / B</span>
                    </div>
                    <p className="text-slate-700 font-semibold">Estrategia de Nivelación (Semana 1)</p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Alumnos con rezago se unen a Grupo A con tarjetas de letras; lectores avanzados lideran Grupo B con tarjetas 1 y 2.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center justify-between text-[11px] font-black text-emerald-900 mb-0.5">
                      <span>11:15 - 11:50 | Ciencias Naturales (35 min)</span>
                      <span className="bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded text-[10px]">Tutoría entre Pares</span>
                    </div>
                    <p className="text-slate-700 font-semibold">Niveles de Organización Biológica</p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Estudiantes de 6.° apoyan a sus compañeros de 5.° para integrar células en tejidos, órganos y sistemas biológicos.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* PIE DE PÁGINA OFICIAL CON PAGINACIÓN Y LOGOS */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center space-x-2">
            <span className="font-black text-[#005B94]">MINEDUC GUATEMALA</span>
            <span>·</span>
            <span>Estrategia de Nivelación de los Aprendizajes</span>
            <span>·</span>
            <span>Apoyo Técnico: BID / OEI / UNICEF</span>
          </div>
          <div className="font-extrabold text-[#00A3E0] text-sm">
            {activeTab === 'grupoA' && 'Página 3'}
            {activeTab === 'grupoB' && 'Página 5'}
            {activeTab === 'horarioMultigrado' && 'Guía Multigrado 2026'}
          </div>
        </div>

      </div>
    </div>
  );
};
