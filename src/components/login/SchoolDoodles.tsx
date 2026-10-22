'use client';

import React from 'react';

export const SchoolDoodles: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none opacity-80" aria-hidden="true">
      {/* Clip de papel superior izquierdo */}
      <div className="absolute -top-3 left-12 md:left-24 rotate-12 transition-transform duration-700 hover:rotate-45 pointer-events-auto cursor-pointer">
        <svg width="60" height="90" viewBox="0 0 60 90" fill="none" className="drop-shadow-md">
          <path
            d="M20 85 V25 C20 12, 40 12, 40 25 V70 C40 78, 28 78, 28 70 V32 C28 27, 34 27, 34 32 V65"
            stroke="#EF4444"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Lápiz escolar flotante superior derecho */}
      <div className="absolute top-8 right-6 md:right-16 -rotate-45 animate-pulse">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="drop-shadow-lg">
          {/* Cuerpo del lápiz */}
          <polygon points="14,46 46,14 54,22 22,54" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
          {/* Punta de madera y grafito */}
          <polygon points="14,46 6,58 22,54" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
          <polygon points="6,58 10,50 14,54" fill="#1E293B" />
          {/* Borrador rosa */}
          <polygon points="46,14 52,8 60,16 54,22" fill="#F472B6" stroke="#DB2777" strokeWidth="2" />
          {/* Virola plateada */}
          <line x1="44" y1="16" x2="52" y2="24" stroke="#94A3B8" strokeWidth="4" />
        </svg>
      </div>

      {/* Regla medidora en esquina inferior izquierda */}
      <div className="absolute bottom-6 left-6 md:left-14 rotate-6 hidden sm:block">
        <div className="bg-amber-100 border-2 border-amber-400 rounded-lg shadow-md px-3 py-2 flex items-center space-x-2 font-mono text-xs text-amber-900/60 font-bold">
          <span>📏</span>
          <span>1 cm</span>
          <div className="h-4 w-px bg-amber-400" />
          <span>2 cm</span>
          <div className="h-4 w-px bg-amber-400" />
          <span>3 cm</span>
          <div className="h-4 w-px bg-amber-400" />
          <span>4 cm</span>
        </div>
      </div>

      {/* Estampita de estrella '¡Excelente trabajo!' */}
      <div className="absolute bottom-12 right-8 md:right-20 rotate-12 transition-transform duration-500 hover:scale-125 pointer-events-auto cursor-pointer">
        <div className="bg-yellow-300 border-2 border-dashed border-amber-500 rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-lg transform active:scale-95">
          <span className="text-xl">⭐</span>
          <span className="text-[9px] font-black text-amber-900 uppercase tracking-tighter">¡100 pts!</span>
        </div>
      </div>

      {/* Pegatina de manzana del profesor */}
      <div className="absolute top-1/2 -left-3 -translate-y-1/2 hidden lg:block opacity-60 hover:opacity-100 transition-opacity">
        <div className="bg-red-500 text-white p-2 rounded-r-2xl border-2 border-red-600 shadow-md flex items-center space-x-1 text-sm font-bold">
          <span>🍎</span>
          <span className="text-xs">MINEDUC</span>
        </div>
      </div>
    </div>
  );
};
