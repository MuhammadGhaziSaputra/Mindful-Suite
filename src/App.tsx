/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import ParticleCanvas from './components/ParticleCanvas';
import AmbientPlayer from './components/AmbientPlayer';
import Journal from './components/Journal';
import Calendar from './components/Calendar';
import Breathe from './components/Breathe';
import WellnessView from './components/WellnessView';
import BreakOverlay from './components/BreakOverlay';
import WaterOverlay from './components/WaterOverlay';
import Navigation, { Tab } from './components/Navigation';
import { WellnessProvider } from './lib/WellnessContext';
import { AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('journal');

  return (
    <WellnessProvider>
      <main className="w-screen h-screen overflow-hidden bg-slate-950 text-slate-200 relative selection:bg-teal-500/30 font-sans">
        <Navigation activeTab={activeTab} onChange={setActiveTab} />
      
      {/* Background Zen Element */}
      <div className={`transition-all duration-1000 fixed inset-0 z-0 pointer-events-none ${activeTab === 'zen' ? 'opacity-100 scale-100' : 'opacity-15 scale-105'}`}>
          <ParticleCanvas />
      </div>

      {/* Zen Ambient Player */}
      <div className={`transition-opacity duration-700 absolute inset-0 z-10 ${activeTab === 'zen' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
         <AmbientPlayer />
      </div>

      {/* Main Feature Views */}
      <div className={`absolute inset-0 z-20 overflow-y-auto overflow-x-hidden scrollbar-none flex flex-col ${activeTab !== 'zen' ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <AnimatePresence mode="wait">
             {activeTab === 'journal' && <Journal key="journal" />}
             {activeTab === 'calendar' && <Calendar key="calendar" />}
             {activeTab === 'breathe' && <Breathe key="breathe" />}
             {activeTab === 'wellness' && <WellnessView key="wellness" />}
          </AnimatePresence>
      </div>
      
      {/* Global Modals/Overlays */}
      <BreakOverlay />
      <WaterOverlay />
    </main>
    </WellnessProvider>
  );
}
