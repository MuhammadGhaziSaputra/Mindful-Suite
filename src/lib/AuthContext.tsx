import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, signInWithGoogle, logOut } from './firebase';
import { User, signInAnonymously } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signInAnonymous: () => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async () => {
    try {
      setError(null);
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Error signing in with Google', err);
      if (err.code === 'auth/cancelled-popup-request' || err.code === 'auth/popup-closed-by-user') {
        setError('Popup login dibatalkan/diblokir oleh browser. Jika menggunakan preview, coba "Open in New Tab" (Buka di Tab Baru) di pojok kanan atas.');
      } else {
        setError('Gagal login: ' + err.message);
      }
    }
  };

  const signInAnonymous = async () => {
    try {
      setError(null);
      await signInAnonymously(auth);
    } catch (err: any) {
      console.error('Error signing in anonymously', err);
      setError('Gagal login guest: ' + err.message);
    }
  }

  const logoutUser = async () => {
    try {
      await logOut();
    } catch (err: any) {
      console.error('Error signing out', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signInAnonymous, signOut: logoutUser, error }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

