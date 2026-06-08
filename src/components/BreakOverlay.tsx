import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Hand, Eye, ArrowUpCircle, Check } from 'lucide-react';
import { useWellnessCtx } from '../lib/WellnessContext';

const EXERCISES = [
  {
     title: 'Peregangan Leher',
     instruction: 'Duduk tegak, jatuhkan dagu perlahan ke dada, lalu putar leher perlahan 360 derajat. Nikmati setiap regangannya. Lakukan juga ke arah sebaliknya.',
     Icon: RefreshCw
  },
  {
     title: 'Peregangan Pergelangan Tangan',
     instruction: 'Luruskan satu lengan ke depan dengan telapak tangan menghadap atas. Gunakan tangan satunya untuk menarik perlahan jari-jari ke arah tubuh. Tahan 15 detik.',
     Icon: Hand
  },
  {
     title: 'Relaksasi Mata (20-20-20)',
     instruction: 'Palingkan pandangan dari layar, tatap sebuah objek yang berjarak sekitar 6 meter (20 kaki) selama minimal 20 detik penuh untuk mengistirahatkan otot rektus matamu.',
     Icon: Eye
  },
  {
     title: 'Peregangan Bahu',
     instruction: 'Angkat kedua bahumu tinggi-tinggi mendekati telinga, tahan keras selama 3 detik, lalu jatuhkan dengan cepat & rileks. Ulangi gerakan ini 3 kali.',
     Icon: ArrowUpCircle
  }
];

export default function BreakOverlay() {
   const { showBreak, finishBreak } = useWellnessCtx();

   // Pick random exercise when showBreak becomes true
   const exercise = useMemo(() => {
       if (!showBreak) return EXERCISES[0];
       return EXERCISES[Math.floor(Math.random() * EXERCISES.length)];
   }, [showBreak]);

   return (
       <AnimatePresence>
           {showBreak && (
               <motion.div 
                  key="break-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl"
               >
                   <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-900/20 via-transparent to-transparent pointer-events-none" />
                   
                   <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="relative z-10 max-w-lg w-full bg-slate-900 border border-slate-700/60 rounded-[2.5rem] p-10 flex flex-col items-center shadow-2xl text-center"
                   >
                       <div className="w-20 h-20 bg-teal-500/10 rounded-full flex items-center justify-center mb-8">
                          <exercise.Icon className="w-10 h-10 text-teal-400 stroke-[1.5]" />
                       </div>

                       <h2 className="text-3xl font-serif text-slate-100 mb-4 tracking-tight">Waktunya Rehat</h2>
                       <h3 className="text-lg font-medium text-teal-300 mb-4">{exercise.title}</h3>
                       
                       <p className="text-slate-400 leading-relaxed font-light mb-10 text-lg">
                           {exercise.instruction}
                       </p>

                       <button 
                          onClick={finishBreak}
                          className="w-full flex items-center justify-center gap-2 py-4 bg-teal-600 text-white rounded-xl font-medium tracking-wide shadow-lg shadow-teal-900/50 hover:bg-teal-500 transition-colors"
                       >
                          <Check className="w-5 h-5" /> Selesai Rehat
                       </button>
                   </motion.div>
               </motion.div>
           )}
       </AnimatePresence>
   );
}
