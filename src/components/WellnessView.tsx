import React from 'react';
import { motion } from 'motion/react';
import { Droplets, Timer, Play, Square, RotateCcw } from 'lucide-react';
import { useWellnessCtx } from '../lib/WellnessContext';

export default function WellnessView() {
  const { water, addWater, resetWater, duration, setDuration, isActive, toggleTimer, timeLeft } = useWellnessCtx();

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl w-full mx-auto px-6 pt-16 pb-36 flex flex-col flex-1 shrink-0 md:pt-24 min-h-[500px]"
    >
      <h2 className="text-3xl tracking-tight font-serif mb-2 text-slate-100">Rehat Fisik</h2>
      <p className="text-slate-400 mb-12 font-light">Kurangi ketegangan tubuh. Jangan biarkan layar merusak posturmu.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Smart Timer */}
         <div className="bg-slate-900/60 backdrop-blur-md rounded-[2rem] border border-slate-700/50 p-8 flex flex-col items-center shadow-lg relative overflow-hidden">
            {isActive && (
                <motion.div
                   className="absolute inset-0 bg-teal-500/5 pointer-events-none"
                   animate={{ opacity: [0.2, 0.5, 0.2] }}
                   transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
            )}
            <Timer className="w-8 h-8 text-teal-400 mb-6" />
            <div className="text-5xl font-mono text-slate-100 mb-2 relative z-10">{formatTime(timeLeft)}</div>
            <p className="text-sm text-slate-400 mb-8 z-10 text-center">Berjalan di latar belakang</p>
            
            <div className="flex items-center gap-4 z-10 w-full mb-6 relative">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-widest shrink-0">Durasi (Mnt)</label>
                <input 
                   type="range" min="5" max="60" step="5"
                   value={duration}
                   onChange={e => setDuration(parseInt(e.target.value))}
                   disabled={isActive}
                   className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer disabled:opacity-50 accent-teal-500"
                />
                <span className="text-sm font-medium text-slate-300 min-w-[1.5rem]">{duration}</span>
            </div>

            <button 
               onClick={toggleTimer}
               className={`w-full py-4 rounded-xl font-medium tracking-wide flex items-center justify-center gap-2 transition-all z-10 ${isActive ? 'bg-red-950/40 text-red-400 border border-red-900/40 hover:bg-red-900/60 shadow-lg' : 'bg-teal-600/90 text-white hover:bg-teal-500 shadow-lg shadow-teal-900/20'}`}
            >
               {isActive ? <><Square className="w-4 h-4" /> Hentikan</> : <><Play className="w-4 h-4 ml-1" /> Mulai Fokus</>}
            </button>
         </div>

         {/* Water Tracker */}
         <div className="bg-slate-900/60 backdrop-blur-md rounded-[2rem] border border-slate-700/50 p-8 flex flex-col items-center justify-center shadow-lg relative overflow-hidden group">
             <button 
                onClick={resetWater}
                className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-400 opacity-50 hover:opacity-100 transition-all z-20 outline-none"
                title="Reset catatan air"
                aria-label="Reset catatan air"
             >
                <RotateCcw className="w-5 h-5" />
             </button>
             
             <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none">
                 <Droplets className="w-48 h-48 text-blue-500" />
             </div>
             
             <div className="relative z-10 flex flex-col items-center w-full">
                 <div className="w-20 h-20 bg-blue-900/30 rounded-full flex items-center justify-center mb-6 shadow-[inset_0_4px_10px_rgba(59,130,246,0.2)]">
                     <Droplets className="w-8 h-8 text-blue-400" />
                 </div>
                 <h3 className="text-2xl font-semibold text-slate-100 mb-1">{water} / 8 <span className="text-sm text-slate-400 font-normal">Gelas</span></h3>
                 <p className="text-sm text-slate-400 text-center mb-10 font-light">Setiap tetes memicu neuron.</p>
                 
                 <button 
                    onClick={addWater}
                    className="w-full py-4 rounded-xl font-medium tracking-wide flex items-center justify-center gap-2 transition-all bg-blue-950/40 text-blue-400 border border-blue-900/40 hover:bg-blue-900/60 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                 >
                    + Catat Air
                 </button>
             </div>
         </div>
      </div>
    </motion.div>
  );
}
