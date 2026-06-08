import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame } from 'lucide-react';
import { audioControl } from '../lib/audio';
import { useJournal } from '../lib/store';

const MOODS = [
  { id: 'happy', color: 'bg-yellow-400', label: 'Senang' },
  { id: 'calm', color: 'bg-green-500', label: 'Tenang' },
  { id: 'sad', color: 'bg-blue-500', label: 'Sedih' },
  { id: 'anxious', color: 'bg-indigo-400', label: 'Cemas' },
  { id: 'angry', color: 'bg-red-500', label: 'Marah/Stres' },
];

export default function Journal() {
  const { entries, saveEntry, burnNote, isLoaded } = useJournal();
  
  // Custom format local date in YYYY-MM-DD
  const t = new Date();
  const today = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
  
  const [mood, setMood] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [isBurning, setIsBurning] = useState(false);
  const initialized = React.useRef(false);

  // Only load from entries once when it's first loaded
  useEffect(() => {
    if (isLoaded && !initialized.current) {
        if (entries[today]) {
            setMood(entries[today].moodColor || '');
            setText(entries[today].text || '');
        }
        initialized.current = true;
    }
  }, [entries, today, isLoaded]);

  const handleSave = () => {
    if (initialized.current) {
       saveEntry({ date: today, moodColor: mood, text });
    }
  };

  useEffect(() => {
     if (!initialized.current) return;
     const timer = setTimeout(() => {
         handleSave(); // save any changes, even if emptying out the strings.
     }, 1000);
     return () => clearTimeout(timer);
  }, [mood, text]); // Auto-save when mood or text changes

  const handleBurn = () => {
    if (!text) return;
    setIsBurning(true);
    
    try {
      audioControl.playBurnSound();
    } catch(e) {}

    // Erase text immediately in state, but wait for animation to complete before clearing from screen smoothly
    setTimeout(() => {
       burnNote(today);
       setText('');
       setIsBurning(false);
    }, 2500); 
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl w-full mx-auto px-6 pt-16 pb-36 flex flex-col flex-1 shrink-0 md:pt-24"
    >
        <h2 className="text-3xl tracking-tight font-serif mb-2 text-slate-100">Apa yang ada di pikiranmu?</h2>
        <p className="text-slate-400 mb-8 font-light">Pilih warna perasaanmu, tumpahkan bebanmu, lalu lepaskan.</p>
        
        <div className="flex gap-4 mb-8 overflow-x-auto py-2 px-1 -mx-1 scrollbar-none">
            {MOODS.map(m => (
                <button 
                  key={m.id}
                  onClick={() => setMood(m.color)}
                  className={`w-12 h-12 rounded-full flex-shrink-0 transition-all duration-300 ease-out outline-none 
                    ${m.color} 
                    ${mood === m.color ? 'scale-110 ring-4 ring-white/20 shadow-[0_0_20px_rgba(255,255,255,0.15)]' : 'opacity-30 hover:opacity-100 hover:scale-105'}
                  `}
                  title={m.label}
                  aria-label={`Mood: ${m.label}`}
                />
            ))}
        </div>

        <div className="relative flex-1 min-h-[350px]">
           <AnimatePresence>
             {!isBurning ? (
                 <motion.textarea
                   key="canvas"
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1, filter: 'brightness(1) blur(0px)' }}
                   exit={{ 
                      opacity: 0, 
                      y: -80, 
                      filter: 'contrast(2) saturate(2) sepia(1) brightness(1.5) blur(10px)',
                      scale: 0.8,
                      rotate: [0, -2, 2, 0]
                   }}
                   transition={{ duration: 1.5, ease: "easeIn" }}
                   value={text}
                   onChange={e => setText(e.target.value)}
                   placeholder="Tuliskan keluh kesahmu tanpa sensor di sini..."
                   className="w-full h-full bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-[2rem] p-8 text-lg font-light text-slate-200 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/30 placeholder:text-slate-600 transition-colors hover:bg-slate-900/80"
                 />
             ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                   <motion.div
                      animate={{ 
                         scale: [1, 2, 0], 
                         y: [0, -40, -150],
                         opacity: [1, 0.8, 0] 
                      }}
                      transition={{ duration: 2.5, ease: "easeInOut" }}
                   >
                     <Flame className="w-48 h-48 text-orange-600 fill-orange-500 animate-pulse drop-shadow-[0_0_50px_rgba(234,88,12,1)]" />
                   </motion.div>
                </motion.div>
             )}
           </AnimatePresence>
        </div>

        <div className="mt-8 flex justify-end">
            <button 
               onClick={handleBurn}
               disabled={!text || isBurning}
               className="flex items-center gap-2 px-8 py-4 bg-orange-950/40 text-orange-400 hover:bg-orange-900/60 hover:text-orange-300 rounded-full transition-all disabled:opacity-20 disabled:cursor-not-allowed border border-orange-900/30 font-medium tracking-wide shadow-lg group focus:outline-none"
            >
               <Flame className={`w-5 h-5 ${isBurning ? 'animate-bounce' : 'group-hover:animate-pulse'}`} />
               Burn the Note
            </button>
        </div>
    </motion.div>
  );
}
