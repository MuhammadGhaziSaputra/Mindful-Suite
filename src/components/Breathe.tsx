import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings2 } from 'lucide-react';

const QUOTES = [
  "Terkadang, langkah paling produktif yang bisa kamu ambil adalah beristirahat.",
  "Kamu tidak harus menyelesaikan semuanya hari ini.",
  "Bernapaslah. Ini hanya hari yang buruk, bukan kehidupan yang buruk.",
  "Berikan dirimu izin untuk berhenti sejenak.",
  "Ketenangan adalah kekuatanmu.",
  "Satu tarikan napas pada satu waktu.",
];

type Phase = 'inhale' | 'hold-in' | 'exhale' | 'hold-out';

const PHASE_LABELS = {
  'inhale': 'Tarik Napas',
  'hold-in': 'Tahan Napas',
  'exhale': 'Hembuskan Napas',
  'hold-out': 'Tahan'
};

type Technique = 'box' | 'relax' | 'free';

const TECHNIQUES: Record<Technique, { label: string, durations: Record<Phase, number> }> = {
  'box': {
     label: 'Box Breathing (4-4-4-4)',
     durations: { 'inhale': 4000, 'hold-in': 4000, 'exhale': 4000, 'hold-out': 4000 }
  },
  'relax': {
     label: 'Relaksasi (4-7-8)',
     durations: { 'inhale': 4000, 'hold-in': 7000, 'exhale': 8000, 'hold-out': 0 }
  },
  'free': {
     label: 'Bebas Mengalir',
     durations: { 'inhale': 5000, 'hold-in': 1000, 'exhale': 5000, 'hold-out': 1000 }
  }
};

export default function Breathe() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<Phase>('inhale');
  const [showQuote, setShowQuote] = useState(false);
  const [randomQuote, setRandomQuote] = useState('');
  const [technique, setTechnique] = useState<Technique>('box');
  const phaseTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isActive) {
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
      setPhase('inhale');
      return;
    }

    const runPhase = (currentPhase: Phase) => {
      setPhase(currentPhase);
      
      // Haptic feedback if supported
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50); // short pulse
      }

      let nextPhase: Phase;
      if (currentPhase === 'inhale') nextPhase = 'hold-in';
      else if (currentPhase === 'hold-in') nextPhase = 'exhale';
      else if (currentPhase === 'exhale') nextPhase = 'hold-out';
      else nextPhase = 'inhale';

      // Skip phases with 0 duration (like hold-out in 4-7-8)
      let nextDuration = TECHNIQUES[technique].durations[nextPhase];
      if (nextDuration === 0) {
          if(nextPhase === 'hold-out') nextPhase = 'inhale';
          else if(nextPhase === 'hold-in') nextPhase = 'exhale';
          nextDuration = TECHNIQUES[technique].durations[nextPhase];
      }

      phaseTimerRef.current = setTimeout(() => {
        runPhase(nextPhase);
      }, TECHNIQUES[technique].durations[currentPhase]);
    };

    runPhase('inhale');

    return () => {
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    };
  }, [isActive, technique]);

  const handleStartStop = () => {
    if (isActive) {
      // Stopping
      setIsActive(false);
      setRandomQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
      setShowQuote(true);
      setTimeout(() => {
        setShowQuote(false);
      }, 6000);
    } else {
      // Starting
      setIsActive(true);
      setShowQuote(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl w-full mx-auto px-6 pt-16 pb-36 flex flex-col flex-1 shrink-0 md:pt-24 items-center justify-center min-h-[400px]"
    >
      <h2 className="text-3xl tracking-tight font-serif mb-2 text-slate-100 text-center">Pernapasan Relaksasi</h2>
      <p className="text-slate-400 mb-8 font-light text-center">Ikuti ritme lingkaran. Aktifkan getaran jika didukung oleh perangkat.</p>

      {/* Technique Selector */}
      <div className="flex items-center gap-2 mb-12 bg-slate-900/50 p-1 rounded-xl border border-slate-700/50">
        {(Object.keys(TECHNIQUES) as Technique[]).map(t => (
          <button
             key={t}
             onClick={() => {
                if(!isActive) setTechnique(t);
             }}
             disabled={isActive}
             className={`px-4 py-2 rounded-lg text-sm transition-all ${
               technique === t 
                 ? 'bg-slate-700 text-white shadow-md' 
                 : 'text-slate-400 hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed'
             }`}
          >
             {TECHNIQUES[t].label}
          </button>
        ))}
      </div>

      <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center mb-16">
        {/* Helper ring (background) */}
        <div className="absolute inset-0 rounded-full border border-slate-700/50" />
        
        {/* Animated breathing circle */}
        <motion.div 
          className="absolute rounded-full bg-teal-500/20 shadow-[0_0_40px_rgba(45,212,191,0.2)] mix-blend-screen"
          animate={{
            scale: isActive ? (phase === 'inhale' || phase === 'hold-in' ? 1 : 0.3) : 0.3,
            opacity: isActive ? (phase === 'hold-in' || phase === 'inhale' ? 0.8 : 0.4) : 0.4
          }}
          transition={{
            duration: isActive ? 4 : 1,
            ease: "easeInOut"
          }}
          style={{ width: '100%', height: '100%' }}
        />

        {/* Phase Text inside */}
        <div className="z-10 text-center">
            {isActive ? (
                <motion.div 
                  key={phase}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-2xl md:text-3xl font-medium tracking-wide text-teal-300 drop-shadow-md"
                >
                    {PHASE_LABELS[phase]}
                </motion.div>
            ) : (
                <div className="text-xl font-light tracking-wide text-slate-500 text-center px-4">
                  Mulai sesi {TECHNIQUES[technique].label}
                </div>
            )}
        </div>
      </div>

      <button 
         onClick={handleStartStop}
         className={`px-8 py-3 rounded-full font-medium tracking-wider text-sm transition-all shadow-lg ${isActive ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-teal-600 text-white hover:bg-teal-500 shadow-teal-900/50'}`}
      >
        {isActive ? 'Hentikan Sesi' : 'Mulai Bernapas'}
      </button>

      {/* Motivational Quote Toast */}
      <AnimatePresence>
        {showQuote && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute bottom-40 bg-slate-800/90 backdrop-blur-md px-8 py-6 rounded-2xl border border-slate-700/50 shadow-2xl max-w-sm text-center"
          >
             <p className="text-slate-200 font-light italic leading-relaxed text-lg">"{randomQuote}"</p>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
