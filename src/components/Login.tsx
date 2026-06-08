import React from 'react';
import { useAuth } from '../lib/AuthContext';
import { motion } from 'motion/react';
import { LogIn, AlertCircle } from 'lucide-react';

export default function Login() {
  const { signIn, signInAnonymous, error } = useAuth();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-sm w-full bg-slate-900 border border-slate-800 rounded-[2rem] p-8 flex flex-col items-center text-center shadow-2xl"
      >
        <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mb-6">
          <LogIn className="w-8 h-8 text-teal-400 stroke-[1.5]" />
        </div>
        <h2 className="text-2xl font-serif text-slate-100 mb-2">Selamat Datang</h2>
        <p className="text-sm font-light text-slate-400 mb-6">Masuk dengan akun Google untuk memulai sesi Mindful Suite-mu.</p>
        
        {error && (
          <div className="mb-6 p-4 w-full bg-red-500/10 border border-red-500/20 rounded-xl flex flex-col gap-2 items-center text-red-400">
             <AlertCircle className="w-5 h-5" />
             <p className="text-xs">{error}</p>
          </div>
        )}

        <button
          onClick={signIn}
          className="w-full py-3 px-6 bg-slate-100 text-slate-900 rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-white transition-colors mb-3"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Masuk dengan Popup
        </button>

        <div className="mt-4 flex flex-col gap-2 w-full">
          <button
            onClick={signInAnonymous}
            className="w-full py-3 px-6 bg-slate-800 text-slate-300 rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-slate-700 transition-colors text-sm"
          >
            Masuk sebagai Guest
          </button>
          <p className="text-[10px] text-slate-500 font-light leading-snug text-center px-4">
            *Login Guest beresiko kehilangan data jika data aplikasi (browser storage) dibersihkan.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

