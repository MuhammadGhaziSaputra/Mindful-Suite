import React, { useState } from 'react';
import { CloudRain, Wind, Waves, Music, Volume2 } from 'lucide-react';
import { audioControl } from '../lib/audio';
import { motion, AnimatePresence } from 'motion/react';

export default function AmbientPlayer() {
  const [activeSounds, setActiveSounds] = useState<Record<string, boolean>>({
    rain: false,
    wind: false,
    ocean: false,
    chimes: false,
  });

  const [volume, setVolume] = useState(50);
  const [showInfo, setShowInfo] = useState(true);

  const toggleSound = (soundName: string) => {
    const isActive = !activeSounds[soundName];
    setActiveSounds(prev => ({ ...prev, [soundName]: isActive }));

    // Initialize/resume AudioContext on first interaction
    try {
      audioControl.init();
      switch (soundName) {
        case 'rain': audioControl.toggleRain(isActive); break;
        case 'wind': audioControl.toggleWind(isActive); break;
        case 'ocean': audioControl.toggleOcean(isActive); break;
        case 'chimes': audioControl.toggleChimes(isActive); break;
      }
    } catch (e) {
      console.error("Audio playback error:", e);
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setVolume(val);
    audioControl.setVolume(val / 100);
  };

  const sounds = [
    { id: 'rain', icon: CloudRain, label: 'Rain' },
    { id: 'wind', icon: Wind, label: 'Wind' },
    { id: 'ocean', icon: Waves, label: 'Ocean' },
    { id: 'chimes', icon: Music, label: 'Chimes' },
  ];

  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-end p-6 pb-32 md:p-12 md:pb-36 font-sans">
      
      <AnimatePresence>
        {showInfo && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(5px)' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute top-12 left-1/2 -translate-x-1/2 text-center text-slate-300 pointer-events-auto bg-slate-900/60 backdrop-blur-xl px-8 py-6 rounded-3xl border border-slate-700/50 shadow-2xl"
          >
            <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-slate-100 mb-2 font-serif">Zen Garden</h1>
            <p className="text-sm md:text-base font-light text-slate-400">Interact with the lights. Blend sounds to detach.</p>
            <button 
              onClick={() => setShowInfo(false)} 
              className="mt-6 px-6 py-2 rounded-full text-xs font-medium tracking-widest text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 hover:text-white transition-all uppercase"
            >
              Enter Sandbox
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="mx-auto pointer-events-auto flex flex-col items-center gap-6 bg-slate-900/40 backdrop-blur-xl px-6 py-8 md:px-10 rounded-[2rem] border border-slate-700/30 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:bg-slate-900/60 transition-colors duration-500"
      >
        <div className="flex gap-4 md:gap-8">
          {sounds.map(s => {
            const Icon = s.icon;
            const active = activeSounds[s.id];
            
            return (
              <button
                key={s.id}
                onClick={() => {
                  toggleSound(s.id);
                  if (showInfo) setShowInfo(false);
                }}
                className={`relative group flex flex-col items-center justify-center w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl transition-all duration-300 ease-out outline-none ${
                  active 
                    ? 'bg-slate-800/80 text-teal-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_20px_rgba(45,212,191,0.15)] border border-teal-500/30 -translate-y-1' 
                    : 'bg-slate-800/30 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-slate-700/50 hover:border-slate-600/50'
                }`}
              >
                <Icon strokeWidth={active ? 2 : 1.5} className="w-6 h-6 md:w-8 md:h-8 mb-2" />
                <span className="text-[10px] md:text-xs font-medium tracking-wider uppercase">{s.label}</span>
                
                {/* Active Indicator dot */}
                <div className={`absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-teal-400 transition-all duration-300 ${active ? 'opacity-100 scale-100 shadow-[0_0_8px_rgba(45,212,191,0.8)]' : 'opacity-0 scale-50'}`} />
              </button>
            )
          })}
        </div>

        <div className="w-full flex items-center gap-4 px-4 pt-4 border-t border-slate-700/30">
          <Volume2 className="w-4 h-4 text-slate-500" />
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={volume} 
            onChange={handleVolume}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500 focus:outline-none"
          />
        </div>

      </motion.div>
    </div>
  );
}
