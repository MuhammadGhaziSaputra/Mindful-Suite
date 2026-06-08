import React from 'react';
import { Flower2, PenLine, CalendarDays, Wind, Coffee } from 'lucide-react';
import { motion } from 'motion/react';

export type Tab = 'zen' | 'journal' | 'calendar' | 'breathe' | 'wellness';

export default function Navigation({ activeTab, onChange }: { activeTab: Tab, onChange: (t: Tab) => void }) {
   const tabs = [
       { id: 'zen', icon: Flower2, label: 'Zen Sandbox' },
       { id: 'breathe', icon: Wind, label: 'Breathe' },
       { id: 'wellness', icon: Coffee, label: 'Rehat Fisik' },
       { id: 'journal', icon: PenLine, label: 'Mental Dump' },
       { id: 'calendar', icon: CalendarDays, label: 'Jejak Emosi' },
   ] as const;

   return (
       <div className="fixed bottom-0 left-0 right-0 p-6 flex justify-center z-50 pointer-events-none">
           <div className="pointer-events-auto bg-slate-900/80 backdrop-blur-2xl p-2 rounded-full border border-slate-700/50 shadow-2xl flex gap-1 items-center">
               {tabs.map(t => {
                   const isActive = t.id === activeTab;
                   return (
                       <button
                          key={t.id}
                          onClick={() => onChange(t.id)}
                          className={`relative px-4 md:px-8 py-3.5 rounded-full flex items-center gap-3 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 ${isActive ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                       >
                           {isActive && (
                               <motion.div 
                                  layoutId="nav-pill"
                                  className="absolute inset-0 bg-slate-800 rounded-full"
                                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                               />
                           )}
                           <t.icon className="w-5 h-5 relative z-10" />
                           <span className="text-sm tracking-wide font-medium relative z-10 hidden md:block">{t.label}</span>
                       </button>
                   )
               })}
           </div>
       </div>
   );
}
