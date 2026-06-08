export class ZenAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  
  private sources: { [key: string]: { node?: AudioNode, source?: AudioScheduledSourceNode, gain?: GainNode, timer?: any } } = {};

  // Pentatonic scale creates a harmonious, relaxing "zen" feel
  private pentatonicFrequencies = [
    261.63, 293.66, 329.63, 392.00, 440.00, 
    523.25, 587.33, 659.25, 783.99, 880.00
  ];

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.5;
    this.masterGain.connect(this.ctx.destination);
  }

  private createWhiteNoise(): AudioBufferSourceNode {
    if (!this.ctx) throw new Error("AudioContext not initialized");
    const bufferSize = this.ctx.sampleRate * 2; 
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    return noise;
  }

  toggleRain(active: boolean) {
    if (!active) {
      this.stopSource('rain');
      return;
    }
    this.init();
    if (!this.ctx || !this.masterGain) return;
    
    // Pinkish noise effect using lowpass on white noise
    const noise = this.createWhiteNoise();
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800; // Rain is low/mid frequency hiss
    filter.Q.value = 0.5;

    const gain = this.ctx.createGain();
    gain.gain.value = 0.8;

    noise.connect(filter).connect(gain).connect(this.masterGain);
    noise.start();

    this.sources['rain'] = { source: noise, gain };
  }

  toggleWind(active: boolean) {
    if (!active) {
      this.stopSource('wind');
      return;
    }
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const noise = this.createWhiteNoise();
    
    const filter = this.ctx.createBiquadFilter();
    // Wind is a sweeping bandpass or lowpass
    filter.type = 'bandpass';
    filter.frequency.value = 300;
    filter.Q.value = 0.8;

    // Modulate filter frequency with an LFO
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.05; // very slow
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 300; // Sweep from 0 to 600 Hz

    lfo.connect(lfoGain).connect(filter.frequency);

    const gain = this.ctx.createGain();
    gain.gain.value = 1.0;

    noise.connect(filter).connect(gain).connect(this.masterGain);
    noise.start();
    lfo.start();

    this.sources['wind'] = { source: noise, gain, node: lfo };
  }

  toggleOcean(active: boolean) {
    if (!active) {
      this.stopSource('ocean');
      return;
    }
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const noise = this.createWhiteNoise();
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    // Simulate waves with LFO modulating volume and slightly frequency
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.12; // Ocean wave rhythm

    const envGain = this.ctx.createGain();
    
    // Modulate filter frequency instead of volume heavily, it sounds like waves
    const freqGain = this.ctx.createGain();
    freqGain.gain.value = 400;
    lfo.connect(freqGain).connect(filter.frequency);

    // Also modulate volume slightly
    const volGainLfo = this.ctx.createGain();
    volGainLfo.gain.value = 0.4;
    lfo.connect(volGainLfo).connect(envGain.gain);
    
    // Base volume
    envGain.gain.setValueAtTime(0.5, this.ctx.currentTime);


    noise.connect(filter).connect(envGain).connect(this.masterGain);
    noise.start();
    lfo.start();

    this.sources['ocean'] = { source: noise, gain: envGain, node: lfo };
  }

  toggleChimes(active: boolean) {
    if (!active) {
      this.stopSource('chimes');
      return;
    }
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const playRandomChime = () => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      const freq = this.pentatonicFrequencies[Math.floor(Math.random() * this.pentatonicFrequencies.length)];
      osc.frequency.value = freq;
      osc.type = 'sine';
      
      // Envelope
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.05); // Rapid Attack
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 4); // Long, resonant release

      osc.connect(gain).connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 4.1);
    };

    // Play one immediately
    playRandomChime();
    
    // Then play randomly
    const timer = setInterval(() => {
      if (Math.random() > 0.4) playRandomChime();
    }, 2000);

    this.sources['chimes'] = { timer };
  }

  private stopSource(key: string) {
    const s = this.sources[key];
    if (!s) return;
    if (s.source) s.source.stop();
    if (s.node && s.node instanceof OscillatorNode) s.node.stop();
    if (s.gain) s.gain.disconnect();
    if (s.timer) clearInterval(s.timer);
    delete this.sources[key];
  }

  setVolume(val: number) { // 0.0 to 1.0
     if (this.masterGain && this.ctx) {
       this.masterGain.gain.setValueAtTime(val, this.ctx.currentTime);
     }
  }
}

export const audioControl = new ZenAudioEngine();
