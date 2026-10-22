'use client';

import React, { useEffect, useState, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

export function MouseCursorTrail() {
  const [points, setPoints] = useState<Point[]>([]);
  const [mousePos, setMousePos] = useState<Point>({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      // Limitar captura de puntos cada 35ms para suavidad
      if (now - lastTimeRef.current > 35) {
        lastTimeRef.current = now;
        setPoints((prev) => {
          const next = [...prev, { x: e.clientX, y: e.clientY }];
          if (next.length > 18) {
            return next.slice(next.length - 18);
          }
          return next;
        });
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setPoints([]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Construir curva SVG suave
  let pathD = '';
  if (points.length > 1) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const midX = (prev.x + curr.x) / 2;
      const midY = (prev.y + curr.y) / 2;
      pathD += ` Q ${prev.x} ${prev.y}, ${midX} ${midY}`;
    }
  }

  if (!isVisible) return null;

  return (
    <div className="trail-path">
      <svg className="w-full h-full">
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke="#94A3B8"
            strokeWidth="2.5"
            strokeDasharray="6 6"
            strokeLinecap="round"
            opacity="0.65"
          />
        )}
      </svg>

      {/* Ratoncito caricaturesco guía (inspirado en el video de ejemplo) */}
      <div
        className="fixed pointer-events-none transition-transform duration-75 ease-out select-none"
        style={{
          transform: `translate(${mousePos.x - 16}px, ${mousePos.y - 18}px)`,
        }}
      >
        <div className="relative animate-wiggle">
          <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
            {/* Orejas de ratón */}
            <circle cx="12" cy="12" r="7" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="4" fill="#F472B6" />
            <circle cx="28" cy="12" r="7" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
            <circle cx="28" cy="12" r="4" fill="#F472B6" />
            {/* Cabeza */}
            <ellipse cx="20" cy="22" rx="12" ry="11" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
            {/* Ojos */}
            <circle cx="16" cy="20" r="2" fill="#0F172A" />
            <circle cx="24" cy="20" r="2" fill="#0F172A" />
            {/* Nariz rosa */}
            <polygon points="18,24 22,24 20,27" fill="#EC4899" />
            {/* Bigotes */}
            <line x1="8" y1="23" x2="15" y2="24" stroke="#94A3B8" strokeWidth="1.2" />
            <line x1="8" y1="26" x2="15" y2="25" stroke="#94A3B8" strokeWidth="1.2" />
            <line x1="25" y1="24" x2="32" y2="23" stroke="#94A3B8" strokeWidth="1.2" />
            <line x1="25" y1="25" x2="32" y2="26" stroke="#94A3B8" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
    </div>
  );
}
