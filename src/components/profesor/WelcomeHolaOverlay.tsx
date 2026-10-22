'use client';

import React, { useState } from 'react';
import { playCartoonRisingSound, playCartoonPopSound } from '../../utils/audioEffects';

interface WelcomeHolaOverlayProps {
  onContinue: () => void;
  teacherName?: string;
}

export const WelcomeHolaOverlay: React.FC<WelcomeHolaOverlayProps> = ({ 
  onContinue,
  teacherName = 'Prof. Juan Pérez'
}) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleContinue = () => {
    playCartoonRisingSound();
    setIsExiting(true);
    setTimeout(() => {
      onContinue();
    }, 600);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col justify-between items-center bg-[#FAFCFD] select-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* 
        Fondo con patrón continuo de lápices y garabatos escolares (como la imagen de referencia)
      */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%2394A3B8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3C!-- Lápiz inclinado 1 --%3E%3Cpath d='M20 70 L45 25 L55 31 L30 76 Z' /%3E%3Cpath d='M20 70 L14 78 L30 76 Z' /%3E%3Cpath d='M45 25 L49 19 L59 25 L55 31 Z' /%3E%3C!-- Garabato onda --%3E%3Cpath d='M75 20 Q85 10 95 20 T115 20' /%3E%3C!-- Lápiz inclinado 2 --%3E%3Cpath d='M80 110 L105 65 L115 71 L90 116 Z' /%3E%3Cpath d='M80 110 L74 118 L90 116 Z' /%3E%3C!-- Garabato bucle --%3E%3Cpath d='M10 100 Q25 90 20 105 T35 110' /%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '120px 120px',
        }}
      />

      {/* Espacio superior para balance visual */}
      <div className="w-full pt-8 px-8 flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2 bg-white/80 backdrop-blur px-4 py-1.5 rounded-full border border-slate-200 shadow-sm text-xs font-bold text-slate-600">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Aula Multigrado • EORM Aldea Calderas</span>
        </div>

        <span className="text-xs font-semibold text-slate-400">
          SIDSER 2026 • Bienvenida Docente
        </span>
      </div>

      {/* Centro: El GIF animado "HOLA SOY SIDSER" con la mascota saludando */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto px-4 max-w-2xl w-full">
        <div className="relative w-full max-w-[480px] sm:max-w-[560px] md:max-w-[620px] transition-transform duration-500 hover:scale-[1.02] drop-shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/hola.gif"
            alt="HOLA SOY SIDSER"
            className="w-full h-auto object-contain pointer-events-none"
          />
        </div>

        {/* Mensaje cálido para el profesor */}
        <p className="mt-2 text-sm sm:text-base font-bold text-slate-600 text-center animate-fadeIn">
          ¡Qué alegría tenerte aquí, <span className="text-emerald-700">{teacherName}</span>! Preparando tu jornada multigrado...
        </p>
      </div>

      {/* Esquina inferior derecha: Botón "continuar" idéntico a la maqueta */}
      <div className="w-full pb-8 sm:pb-12 px-6 sm:px-16 flex justify-end items-center relative z-20">
        <button
          onClick={handleContinue}
          className="group relative bg-white hover:bg-teal-50/80 active:bg-teal-100 border-[3.5px] border-[#007780] rounded-full px-10 sm:px-14 py-3 sm:py-3.5 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0.5 active:scale-95 flex items-center space-x-3 cursor-pointer"
        >
          <span className="text-[#0f172a] font-black text-xl sm:text-2xl lowercase tracking-tight group-hover:text-[#007780] transition-colors">
            continuar
          </span>
          <span className="text-[#007780] text-xl font-black group-hover:translate-x-1.5 transition-transform duration-300">
            →
          </span>
        </button>
      </div>
    </div>
  );
};
