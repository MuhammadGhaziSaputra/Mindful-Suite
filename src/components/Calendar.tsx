import React, { useMemo } from 'react';
import { useJournal } from '../lib/store';
import { motion } from 'motion/react';

export default function Calendar() {
  const { entries } = useJournal();
  
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const blanks = Array.from({ length: firstDay }).map((_, i) => i);
  const days = Array.from({ length: daysInMonth }).map((_, i) => i + 1);

  const monthName = today.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
     <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="max-w-3xl w-full mx-auto px-6 pt-16 pb-36 md:pt-24 flex-1 shrink-0"
     >
        <h2 className="text-3xl tracking-tight font-serif mb-2 text-slate-100">Kalender Emosi</h2>
        <p className="text-slate-400 mb-12 font-light">Rekam jejak warna perasaanmu di bulan {monthName}.</p>

        <div className="grid grid-cols-7 gap-2 md:gap-4 lg:gap-6">
           {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day, i) => (
               <div key={i} className="text-center text-xs md:text-sm font-semibold tracking-wider text-slate-500 mb-2">{day}</div>
           ))}
           
           {blanks.map(b => <div key={`blank-${b}`} className="aspect-square rounded-2xl bg-slate-900/10 border border-slate-800/20" />)}

           {days.map(day => {
               // Pad correctly to match state YYYY-MM-DD
               const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
               const entry = entries[dateStr];
               
               const colorClass = entry?.moodColor || 'bg-slate-900/30 border border-slate-800/30';
               const hasText = !!entry?.text;

               return (
                   <div 
                      key={dateStr}
                      className={`relative aspect-square rounded-[1.2rem] md:rounded-[1.5rem] flex items-center justify-center transition-all hover:scale-105 duration-300 ${colorClass} ${entry ? 'shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.1)] ring-1 ring-white/10' : ''}`}
                      title={hasText ? 'Ada catatan jurnal pada hari ini.' : 'Hanya jejak mood.'}
                   >
                       <span className="text-white text-xs md:text-sm font-medium mix-blend-overlay opacity-80 z-10 pointer-events-none">
                           {day}
                       </span>
                       
                       {/* Indicator if user kept a note that day instead of burning it */}
                       {hasText && (
                           <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-full opacity-70" />
                       )}
                   </div>
               )
           })}
        </div>
     </motion.div>
  );
}
