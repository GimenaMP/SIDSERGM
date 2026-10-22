'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  GraduationCap, 
  School, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  UserCheck
} from 'lucide-react';

export type UserRole = 'profesor' | 'director' | 'admin';

interface LoginFormProps {
  onLoginSuccess?: (role: UserRole, user: any) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [role, setRole] = useState<UserRole>('profesor');
  const [email, setEmail] = useState('profesor@sidser.edu.gt');
  const [password, setPassword] = useState('Plataforma2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // Mascot state
  const [focusedField, setFocusedField] = useState<'none' | 'email' | 'password'>('none');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Trigger celebration confetti
  const launchCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF5A5F', '#FFB703', '#0077B6', '#06D6A0', '#38B000'],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    // Simulación de autenticación y validación de reglas de negocio
    setTimeout(() => {
      setIsLoading(false);

      // Verificación de caso de prueba: Usuario Desactivado
      if (email.toLowerCase().includes('inactivo') || email.toLowerCase().includes('desactivado')) {
        setErrorMessage(
          'Su cuenta se encuentra temporalmente DESACTIVADA por la Dirección o Administración Escolar. Comuníquese con la dirección de su centro educativo para reactivar su acceso.'
        );
        return;
      }

      if (!email || !password) {
        setErrorMessage('Por favor ingrese su usuario/correo y contraseña institucional.');
        return;
      }

      // Login exitoso
      launchCelebration();
      setSuccessMessage(
        `¡Bienvenido(a)! Sesión iniciada con éxito como ${
          role === 'profesor' ? 'Profesor Multigrado' : role === 'director' ? 'Director Escolar' : 'Administrador'
        }.`
      );

      if (onLoginSuccess) {
        onLoginSuccess(role, {
          email,
          role,
          nombre: role === 'profesor' ? 'Prof. Juan Pérez (Multigrado 1.º a 6.º)' : role === 'director' ? 'Directora Elena Gómez' : 'Administrador Departamental',
          escuela: 'EORM Aldea Calderas (UDI: 01-08-0123-43)',
        });
      }
    }, 700);
  };

  // Demo accounts helper
  const handleQuickFill = (targetRole: UserRole, isInactive: boolean = false) => {
    setRole(targetRole);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (isInactive) {
      setEmail('profesor.inactivo@sidser.edu.gt');
      setPassword('Plataforma2026!');
      return;
    }

    if (targetRole === 'profesor') {
      setEmail('profesor@sidser.edu.gt');
      setPassword('Plataforma2026!');
    } else if (targetRole === 'director') {
      setEmail('director@sidser.edu.gt');
      setPassword('Plataforma2026!');
    } else {
      setEmail('admin@sidser.edu.gt');
      setPassword('Admin2026Master!');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative z-10 px-4">
      {/* Tarjeta de Inicio de Sesión Educativa */}
      <div className="card-educational rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-slate-200 relative overflow-hidden">
        
        {/* Adorno superior simulando cinta adhesiva o post-it */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-200/90 border border-amber-300 w-28 h-6 rotate-1 rounded shadow-sm flex items-center justify-center">
          <span className="text-[10px] font-black tracking-widest text-amber-800 uppercase">SIDSER 2026</span>
        </div>

        {/* Ventana de Mascota Reaccionaria */}
        <div className="flex flex-col items-center justify-center mb-6 pt-2">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-b from-sky-50 to-indigo-50 border-3 border-dashed border-sky-300 p-2 shadow-inner flex items-center justify-center overflow-hidden transition-all duration-300">
            {focusedField === 'email' ? (
              <div className="flex flex-col items-center animate-fadeIn">
                <video
                  src="/assets/8.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>
            ) : focusedField === 'password' ? (
              <div className="flex flex-col items-center animate-fadeIn">
                <video
                  src="/assets/9.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <video
                  src="/assets/9.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Burbuja de estado de la mascota */}
            <div className="absolute bottom-1 bg-white/95 text-[10px] font-bold text-slate-700 px-2 py-0.5 rounded-full border border-slate-300 shadow-sm">
              {focusedField === 'email'
                ? '🔍 Verificando usuario...'
                : focusedField === 'password'
                ? '🤫 Protegiendo clave...'
                : '📖 ¡Listo para aprender!'}
            </div>
          </div>
          <h2 className="text-xl font-extrabold text-slate-800 mt-2 tracking-tight text-center">
            Acceso a Plataforma SIDSER
          </h2>
          <p className="text-xs text-slate-500 text-center font-medium">
            Sistema Multigrado Primaria • CNB & MINEDUC
          </p>
        </div>

        {/* Selector de Rol Educativo */}
        <div className="mb-5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 text-center">
            Selecciona tu rol educativo
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => handleQuickFill('profesor')}
              className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all font-bold text-xs ${
                role === 'profesor'
                  ? 'bg-rose-500 text-white shadow-md transform scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <GraduationCap className="w-5 h-5 mb-1" />
              <span>Profesor</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('director')}
              className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all font-bold text-xs ${
                role === 'director'
                  ? 'bg-amber-500 text-white shadow-md transform scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <School className="w-5 h-5 mb-1" />
              <span>Director</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all font-bold text-xs ${
                role === 'admin'
                  ? 'bg-teal-600 text-white shadow-md transform scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <ShieldCheck className="w-5 h-5 mb-1" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Alerta de Error / Cuenta Desactivada */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border-2 border-red-300 rounded-2xl flex items-start space-x-2 text-xs text-red-800 animate-shake">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Acceso Restringido</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Alerta de Éxito */}
        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-start space-x-2 text-xs text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">¡Bienvenido(a)!</p>
              <p>{successMessage}</p>
            </div>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Correo / CUI */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Correo Institucional o Usuario
            </label>
            <div className="relative rounded-2xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('none')}
                placeholder="ej. profesor@sidser.edu.gt"
                className="w-full pl-10 pr-3 py-2.5 bg-white border-2 border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 rounded-2xl text-sm font-medium text-slate-800 transition-all outline-none"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Contraseña
              </label>
              <button
                type="button"
                className="text-[11px] font-semibold text-sky-600 hover:text-sky-800 hover:underline"
                onClick={() => alert('Para reestablecer su clave, solicite el enlace de recuperación a la Dirección de su centro escolar.')}
              >
                ¿Olvidó su clave?
              </button>
            </div>
            <div className="relative rounded-2xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField('none')}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-white border-2 border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 rounded-2xl text-sm font-medium text-slate-800 transition-all outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Recordar sesión */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-400"
              />
              <span className="text-xs text-slate-600 font-medium">Recordar en este equipo escolar</span>
            </label>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              ⚡ Offline-Ready
            </span>
          </div>

          {/* Botón Principal de Inicio de Sesión */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 px-4 rounded-2xl font-extrabold text-sm text-white shadow-lg btn-educational flex items-center justify-center space-x-2 transition-all ${
              role === 'profesor'
                ? 'bg-rose-500 hover:bg-rose-600 active:bg-rose-700 shadow-rose-200'
                : role === 'director'
                ? 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 shadow-amber-200'
                : 'bg-teal-600 hover:bg-teal-700 active:bg-teal-800 shadow-teal-200'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Validando credenciales...</span>
              </div>
            ) : (
              <>
                <span>Ingresar al Aula Multigrado</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Sección de pruebas rápidas / Demo Directo */}
        <div className="mt-6 pt-4 border-t border-dashed border-slate-200">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-2">
            Accesos Rápidos de Prueba (Demo)
          </p>
          <div className="flex flex-wrap gap-1.5 justify-center">
            <button
              type="button"
              onClick={() => handleQuickFill('profesor')}
              className="text-[11px] bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold px-2.5 py-1 rounded-xl transition-all"
            >
              🎓 Profe Juan
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('director')}
              className="text-[11px] bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold px-2.5 py-1 rounded-xl transition-all"
            >
              🏫 Dir. Elena
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className="text-[11px] bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 font-bold px-2.5 py-1 rounded-xl transition-all"
            >
              ⚙️ Administrador
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('profesor', true)}
              className="text-[11px] bg-slate-100 hover:bg-red-100 text-red-600 border border-red-200 font-bold px-2.5 py-1 rounded-xl transition-all"
              title="Prueba el bloqueo de usuarios desactivados según RF-09 y CU-01"
            >
              ⚠️ Profe Desactivado
            </button>
          </div>
        </div>

      </div>

      {/* Pie de página con créditos institucionales y versión */}
      <div className="mt-4 text-center">
        <p className="text-[11px] text-slate-500 font-medium">
          MINEDUC Guatemala • Currículo Nacional Base (CNB)
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5">
          EORM Aldea Calderas, Amatitlán • Plataforma SIDSER v1.0 (2026)
        </p>
      </div>
    </div>
  );
};
