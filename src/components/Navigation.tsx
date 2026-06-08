import React, { useState } from 'react';
import { Flower2, PenLine, CalendarDays, Wind, Coffee, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../lib/AuthContext';

export type Tab = 'zen' | 'journal' | 'calendar' | 'breathe' | 'wellness';

export default function Navigation({ activeTab, onChange }: { activeTab: Tab, onChange: (t: Tab) => void }) {
   const { signOut } = useAuth();
   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
   const tabs = [
       { id: 'zen', icon: Flower2, label: 'Zen Sandbox' },
       { id: 'breathe', icon: Wind, label: 'Breathe' },
       { id: 'wellness', icon: Coffee, label: 'Rehat Fisik' },
       { id: 'journal', icon: PenLine, label: 'Mental Dump' },
       { id: 'calendar', icon: CalendarDays, label: 'Jejak Emosi' },
   ] as const;

   return (
       <>
           <AnimatePresence>
               {showLogoutConfirm && (
                   <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm px-4">
                       <motion.div 
                           initial={{ opacity: 0, scale: 0.95 }}
                           animate={{ opacity: 1, scale: 1 }}
                           exit={{ opacity: 0, scale: 0.95 }}
                           className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full shadow-2xl origin-bottom"
                       >
                           <h3 className="text-xl font-medium text-slate-100 mb-2">Konfirmasi Keluar</h3>
                           <p className="text-slate-400 text-sm mb-6 leading-relaxed">Apakah Anda yakin ingin keluar? <br/><br/><strong>Catatan:</strong> Jika Anda masuk sebagai Guest, sewaktu-waktu data Anda dapat hilang apabila file cache pada browser dibersihkan.</p>
                           <div className="flex gap-3 justify-end mt-4">
                               <button 
                                   onClick={() => setShowLogoutConfirm(false)}
                                   className="px-4 py-2 text-slate-300 hover:bg-slate-800 rounded-xl text-sm font-medium transition-colors"
                               >
                                   Batal
                               </button>
                               <button 
                                   onClick={() => {
                                       setShowLogoutConfirm(false);
                                       signOut();
                                   }}
                                   className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-sm font-medium transition-colors"
                               >
                                   Ya, Keluar
                               </button>
                           </div>
                       </motion.div>
                   </div>
               )}
           </AnimatePresence>
           
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
                   <div className="w-[1px] h-8 bg-slate-700 mx-2"></div>
                   <button
                      onClick={() => setShowLogoutConfirm(true)}
                      title="Keluar"
                      className="relative px-4 py-3.5 rounded-full flex items-center gap-3 transition-colors outline-none hover:text-red-400 text-slate-400 hover:bg-slate-800/50 focus-visible:ring-2 focus-visible:ring-red-500/50"
                   >
                       <LogOut className="w-5 h-5 relative z-10" />
                   </button>
               </div>
           </div>
       </>
   );
}
