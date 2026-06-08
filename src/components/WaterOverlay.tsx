import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Droplets, Check, X } from 'lucide-react';
import { useWellnessCtx } from '../lib/WellnessContext';

export default function WaterOverlay() {
   const { showWaterReminder, finishWaterReminder, addWater } = useWellnessCtx();

   const handleDrink = () => {
       addWater();
       finishWaterReminder();
   };

   return (
       <AnimatePresence>
           {showWaterReminder && (
               <motion.div 
                  key="water-overlay"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, type: 'spring' }}
                  className="fixed top-8 left-1/2 -translate-x-1/2 z-50 p-6 bg-slate-900/90 backdrop-blur-xl border border-blue-900/50 rounded-[2rem] shadow-2xl flex flex-col items-center w-[calc(100%-32px)] max-w-sm"
               >
                   <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent rounded-[2rem] pointer-events-none" />
                   
                   <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 text-blue-400">
                      <Droplets className="w-8 h-8" />
                   </div>

                   <h3 className="text-xl tracking-tight font-serif text-slate-100 mb-2 relative z-10">Waktunya Minum Air</h3>
                   <p className="text-sm text-slate-400 text-center mb-6 relative z-10 font-light">Tetap terhidrasi untuk menjaga fokus dan energi.</p>
                   
                   <div className="flex gap-4 w-full z-10 relative">
                       <button 
                          onClick={finishWaterReminder}
                          className="flex-1 py-3 rounded-xl font-medium text-sm text-slate-400 bg-slate-800/80 border border-slate-700/50 hover:bg-slate-700 hover:text-slate-200 transition-colors flex items-center justify-center gap-2"
                       >
                          <X className="w-4 h-4" /> Nanti
                       </button>
                       <button 
                          onClick={handleDrink}
                          className="flex-1 py-3 rounded-xl font-medium text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/40 transition-colors flex items-center justify-center gap-2"
                       >
                          <Check className="w-4 h-4" /> Sudah
                       </button>
                   </div>
               </motion.div>
           )}
       </AnimatePresence>
   );
}
