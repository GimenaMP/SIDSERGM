'use client';

import React, { useState } from 'react';

interface LetterData {
  letter: string;
  word: string;
  meaning: string;
  color: string;
  border: string;
  shadow: string;
  video: string;
  svg: string;
}

const LETTERS: LetterData[] = [
  {
    letter: 'S',
    word: 'Sistema',
    meaning: 'Plataforma Offline-First para aulas rurales',
    color: 'bg-rose-500',
    border: 'border-rose-600',
    shadow: 'shadow-rose-300',
    video: '/assets/2.mp4',
    svg: '/assets/2.svg',
  },
  {
    letter: 'I',
    word: 'Inteligente',
    meaning: 'Alineación pedagógica con CNB y MINEDUC',
    color: 'bg-amber-500',
    border: 'border-amber-600',
    shadow: 'shadow-amber-300',
    video: '/assets/3.mp4',
    svg: '/assets/3.svg',
  },
  {
    letter: 'D',
    word: 'Diagnóstico',
    meaning: 'Detección temprana de deficiencias por alumno',
    color: 'bg-sky-500',
    border: 'border-sky-600',
    shadow: 'shadow-sky-300',
    video: '/assets/4.mp4',
    svg: '/assets/4.svg',
  },
  {
    letter: 'S',
    word: 'Seguimiento',
    meaning: 'Control semanal continuo de competencias',
    color: 'bg-emerald-500',
    border: 'border-emerald-600',
    shadow: 'shadow-emerald-300',
    video: '/assets/5.mp4',
    svg: '/assets/5.svg',
  },
  {
    letter: 'E',
    word: 'Educativo',
    meaning: 'Guías de ejercicios de 1.º a 6.º de primaria',
    color: 'bg-lime-500',
    border: 'border-lime-600',
    shadow: 'shadow-lime-300',
    video: '/assets/6.mp4',
    svg: '/assets/6.svg',
  },
  {
    letter: 'R',
    word: 'Rural',
    meaning: 'Optimizado para multigrado en Guatemala',
    color: 'bg-indigo-500',
    border: 'border-indigo-600',
    shadow: 'shadow-indigo-300',
    video: '/assets/7.mp4',
    svg: '/assets/7.svg',
  },
];

interface SidserLetterStageProps {
  activeMascot?: string | null;
}

export const SidserLetterStage: React.FC<SidserLetterStageProps> = () => {
  const [activeLetter, setActiveLetter] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'individual' | 'banner'>('individual');

  return (
    <div className="w-full flex flex-col items-center justify-center my-2 sm:my-4 select-none relative z-10">
      {/* Vista de Banner Completo animado o Letras individuales */}
      {viewMode === 'banner' ? (
        <div className="relative group flex flex-col items-center">
          <div className="w-72 sm:w-96 md:w-[480px] rounded-3xl overflow-hidden bg-white/80 p-2 shadow-2xl border-4 border-amber-300">
            <video
              src="/assets/1.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto object-cover rounded-2xl"
            />
          </div>
          <button
            onClick={() => setViewMode('individual')}
            className="mt-2 text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded-full border border-amber-300 transition-all transform hover:scale-105 active:scale-95"
          >
            🔍 Ver personajes interactivos por letra
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {/* Globo de diálogo que explica la sigla activa */}
          <div className="h-10 mb-2 flex items-center justify-center">
            {activeLetter !== null ? (
              <div className="animate-bounce bg-white px-4 py-1.5 rounded-full border-2 border-slate-700 shadow-md flex items-center space-x-2 text-xs sm:text-sm font-bold">
                <span className={`w-3 h-3 rounded-full ${LETTERS[activeLetter].color}`} />
                <span className="text-slate-900 font-extrabold">{LETTERS[activeLetter].letter}:</span>
                <span className="text-slate-700">{LETTERS[activeLetter].word}</span>
                <span className="text-slate-400 font-normal hidden md:inline">
                  — {LETTERS[activeLetter].meaning}
                </span>
              </div>
            ) : (
              <p className="text-xs text-slate-500 font-semibold italic flex items-center space-x-1">
                <span>✨</span>
                <span>Pasa el cursor o toca cada personaje para conocer su función</span>
                <span>✨</span>
              </p>
            )}
          </div>

          {/* Fila de personajes S-I-D-S-E-R */}
          <div className="flex items-end justify-center gap-1.5 sm:gap-3 md:gap-4 px-2 py-1">
            {LETTERS.map((item, index) => {
              const isHovered = activeLetter === index;
              return (
                <div
                  key={index}
                  onMouseEnter={() => setActiveLetter(index)}
                  onMouseLeave={() => setActiveLetter(null)}
                  onClick={() => setActiveLetter(activeLetter === index ? null : index)}
                  className={`relative flex flex-col items-center cursor-pointer transition-all duration-300 ${
                    isHovered
                      ? '-translate-y-3 scale-110 z-20'
                      : 'hover:-translate-y-1 z-10'
                  }`}
                  style={{
                    animationDelay: `${index * 150}ms`,
                  }}
                >
                  {/* Contenedor del video del personaje */}
                  <div
                    className={`w-14 h-16 sm:w-20 sm:h-24 md:w-24 md:h-28 rounded-2xl overflow-hidden bg-white/90 border-2 ${
                      item.border
                    } shadow-lg ${item.shadow} flex items-center justify-center relative p-1 transition-transform`}
                  >
                    <video
                      src={item.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-contain pointer-events-none"
                    />

                    {/* Insignia pequeña con la letra */}
                    <div
                      className={`absolute bottom-0.5 right-0.5 ${item.color} text-white text-[10px] sm:text-xs font-black rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center border border-white shadow`}
                    >
                      {item.letter}
                    </div>
                  </div>

                  {/* Sombra proyectada en el suelo del cuaderno */}
                  <div
                    className={`w-10 h-1.5 sm:w-14 sm:h-2 rounded-full bg-slate-400/30 blur-[1px] mt-1 transition-all ${
                      isHovered ? 'scale-125 opacity-70' : 'opacity-40'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Botón sutil para alternar con banner */}
          <button
            onClick={() => setViewMode('banner')}
            className="mt-3 text-[11px] font-semibold text-slate-500 hover:text-slate-800 hover:underline flex items-center space-x-1"
          >
            <span>🎬 Ver animación unificada del logo</span>
          </button>
        </div>
      )}
    </div>
  );
};
