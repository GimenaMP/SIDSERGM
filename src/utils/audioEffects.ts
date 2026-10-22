// Utilidad de síntesis de efectos de sonido educativos y caricaturescos usando Web Audio API
// 100% nativo, sin dependencias externas, cero latencia y compatible con todos los navegadores modernos.

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Efecto de silbato / resorte caricaturesco que sube de tono ("whoooop! 🚀")
 * Ideal para la animación de las mascotas subiendo a la tarjeta.
 */
export function playCartoonRisingSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const duration = 0.65;

  // 1. Oscilador principal (onda triangular para calidez de caricatura)
  const osc = ctx.createOscillator();
  osc.type = 'triangle';

  // 2. Modulador LFO para el efecto de vibrato / bamboleo de resorte
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.setValueAtTime(14, now); // 14 Hz de vibrato rápido
  lfoGain.gain.setValueAtTime(25, now);  // Profundidad de vibrato en Hz
  lfo.connect(osc.frequency);
  lfo.start(now);
  lfo.stop(now + duration);

  // 3. Barrido de frecuencia ascendente: de 240 Hz a 920 Hz
  osc.frequency.setValueAtTime(240, now);
  osc.frequency.exponentialRampToValueAtTime(940, now + duration);

  // 4. Control de ganancia (volumen) con ataque suave y decaimiento agradable
  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0.001, now);
  gainNode.gain.linearRampToValueAtTime(0.22, now + 0.08);
  gainNode.gain.setValueAtTime(0.22, now + duration - 0.1);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

  // 5. Filtro pasa-bajas para redondear el tono
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1800, now);

  // Conexión del grafo de audio
  osc.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration);

  // Pequeña campanita dulce al llegar al tope
  setTimeout(() => {
    playTopChime();
  }, (duration - 0.08) * 1000);
}

/**
 * Campanita suave al alcanzar la cima del salto
 */
function playTopChime() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const chimeOsc = ctx.createOscillator();
  const chimeGain = ctx.createGain();

  chimeOsc.type = 'sine';
  chimeOsc.frequency.setValueAtTime(1046.5, now); // Nota C6 (Do agudo)
  chimeOsc.frequency.exponentialRampToValueAtTime(1318.5, now + 0.15); // E6 (Mi)

  chimeGain.gain.setValueAtTime(0.18, now);
  chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

  chimeOsc.connect(chimeGain);
  chimeGain.connect(ctx.destination);

  chimeOsc.start(now);
  chimeOsc.stop(now + 0.3);
}

/**
 * Sonido de pop/burbuja al hacer clic o interactuar con un botón
 */
export function playCartoonPopSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, now);
  osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.08);
}

export function toggleSoundState(): boolean {
  soundEnabled = !soundEnabled;
  return soundEnabled;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}
