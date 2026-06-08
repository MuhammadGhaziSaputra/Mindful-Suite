import React, { createContext, useContext, useState, useEffect } from 'react';
import { audioControl } from './audio';

interface WellnessContextType {
  water: number;
  addWater: () => void;
  resetWater: () => void;
  duration: number;
  setDuration: (m: number) => void;
  isActive: boolean;
  toggleTimer: () => void;
  timeLeft: number;
  showBreak: boolean;
  finishBreak: () => void;
  showWaterReminder: boolean;
  finishWaterReminder: () => void;
}

const WellnessContext = createContext<WellnessContextType | null>(null);

export function WellnessProvider({ children }: { children: React.ReactNode }) {
    const [water, setWater] = useState(0);
    const [duration, setDuration] = useState(25);
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [showBreak, setShowBreak] = useState(false);
    const [showWaterReminder, setShowWaterReminder] = useState(false);

    const today = new Date().toDateString();

    useEffect(() => {
        // Request notification permission on mount
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
        
        const saved = localStorage.getItem('mindful_water_' + today);
        if (saved) setWater(parseInt(saved, 10));
    }, [today]);

    // Reset timer when duration changes and it's stopped
    useEffect(() => {
       if (!isActive && !showBreak) {
           setTimeLeft(duration * 60);
       }
    }, [duration, isActive, showBreak]);

    const notifyUser = (title: string, body: string) => {
        try { audioControl.playChimeSingular(); } catch(e) {}
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, { body, icon: '/favicon.ico' });
        }
    };

    // Timer logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(t => t - 1);
            }, 1000);
        } else if (isActive && timeLeft <= 0) {
            setShowBreak(true);
            setIsActive(false);
            setTimeLeft(duration * 60);
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate([200, 100, 200, 100, 500]);
            }
            notifyUser('Waktunya Rehat Fisik!', 'Lakukan peregangan 20-20-20 sebentar yuk.');
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft, duration]);

    // Water reminder interval (every 60 minutes)
    useEffect(() => {
        const waterInterval = setInterval(() => {
            setShowWaterReminder(true);
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate([200, 100, 200]);
            }
            notifyUser('Waktunya Minum Air', 'Tetap terhidrasi untuk fokus yang lebih tajam.');
        }, 60 * 60 * 1000); // 60 minutes
        return () => clearInterval(waterInterval);
    }, []);

    const toggleTimer = () => setIsActive(!isActive);
    
    const addWater = () => {
       setWater(w => {
          const nw = w + 1;
          localStorage.setItem('mindful_water_' + today, nw.toString());
          return nw;
       });
    };

    const resetWater = () => {
       setWater(0);
       localStorage.setItem('mindful_water_' + today, '0');
    };

    const finishBreak = () => setShowBreak(false);
    const finishWaterReminder = () => setShowWaterReminder(false);

    return (
        <WellnessContext.Provider value={{ water, addWater, resetWater, duration, setDuration, isActive, toggleTimer, timeLeft, showBreak, finishBreak, showWaterReminder, finishWaterReminder }}>
            {children}
        </WellnessContext.Provider>
    );
}

export const useWellnessCtx = () => {
    const ctx = useContext(WellnessContext);
    if (!ctx) throw new Error("Missing provider");
    return ctx;
};
