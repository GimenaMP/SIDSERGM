'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WelcomeHolaOverlay } from '../../components/profesor/WelcomeHolaOverlay';
import { ProfesorDashboard } from '../../components/profesor/ProfesorDashboard';

export default function ProfesorPage() {
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(true);

  const handleContinue = () => {
    setShowWelcome(false);
  };

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <div className="relative min-h-screen">
      {/* 
        Pantalla de Bienvenida con Hola.gif antes de entrar al módulo
        Exacto a la imagen subida por el usuario
      */}
      {showWelcome && (
        <WelcomeHolaOverlay onContinue={handleContinue} teacherName="Prof. Juan Pérez" />
      )}

      {/* Módulo de Profesores estilo Canva */}
      <ProfesorDashboard onLogout={handleLogout} />
    </div>
  );
}
