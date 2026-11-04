type SoundName = 'hover' | 'deep-hover' | 'click' | 'whoosh';

interface OscConfig {
  type: OscillatorType;
  freq: number;
  freqEnd?: number;
  gain: number;
  duration: number;
  delay?: number;
}

const MAX_MASTER_GAIN = 0.6;

class AudioEngine {
  private ctx: AudioContext | null = null;
  private volume = 0.5;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private ambientNodes: AudioNode[] = [];
  private _enabled = false;
  private _started = false;

  get enabled() {
    return this._enabled;
  }

  private ensureContext() {
    if (!this.ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AC();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  setVolume(value: number) {
    this.volume = Math.min(1, Math.max(0, value));
    if (!this._enabled || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(this.volume * MAX_MASTER_GAIN, now + 0.3);
  }

  enable() {
    const ctx = this.ensureContext();
    this._enabled = true;
    if (!this._started) {
      this.startAmbient();
      this._started = true;
    }
    const now = ctx.currentTime;
    this.masterGain?.gain.cancelScheduledValues(now);
    this.masterGain?.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain?.gain.linearRampToValueAtTime(this.volume * MAX_MASTER_GAIN, now + 1.5);
  }

  disable() {
    if (!this.ctx || !this.masterGain) return;
    this._enabled = false;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(0, now + 0.8);
  }

  private startAmbient() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    this.ambientGain = ctx.createGain();
    this.ambientGain.gain.value = 0.12;
    this.ambientGain.connect(this.masterGain);

    // Low drone — two detuned oscillators
    const droneFreqs = [55, 55.3, 82.5];
    droneFreqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const oscGain = ctx.createGain();
      oscGain.gain.value = 0.33;

      // Slow LFO modulating amplitude for a "breathing" feel
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.07 + Math.random() * 0.06;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.18;

      lfo.connect(lfoGain);
      lfoGain.connect(oscGain.gain);
      osc.connect(oscGain);
      oscGain.connect(this.ambientGain!);

      osc.start();
      lfo.start();
      this.ambientNodes.push(osc, lfo);
    });

    // Subtle filtered noise for "wind / room tone"
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 220;
    noiseFilter.Q.value = 0.7;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.04;
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ambientGain);
    noise.start();

    this.ambientNodes.push(noise);
  }

  playSound(name: SoundName) {
    if (!this._enabled || !this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const configs: Record<SoundName, OscConfig[]> = {
      // Quick eerie blip on card hover
      hover: [
        { type: 'sine', freq: 320, freqEnd: 280, gain: 0.06, duration: 0.18 },
      ],
      // Deeper, longer swell for hero hover
      'deep-hover': [
        { type: 'sine', freq: 110, freqEnd: 90, gain: 0.09, duration: 0.5 },
        { type: 'triangle', freq: 220, freqEnd: 180, gain: 0.04, duration: 0.5, delay: 0.03 },
      ],
      // Sharp click for buttons
      click: [
        { type: 'square', freq: 180, freqEnd: 120, gain: 0.05, duration: 0.08 },
      ],
      // Whoosh for modal/transitions
      whoosh: [
        { type: 'sawtooth', freq: 90, freqEnd: 40, gain: 0.06, duration: 0.4 },
      ],
    };

    for (const cfg of configs[name]) {
      const start = now + (cfg.delay ?? 0);
      const osc = ctx.createOscillator();
      osc.type = cfg.type;
      osc.frequency.setValueAtTime(cfg.freq, start);
      if (cfg.freqEnd !== undefined) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(1, cfg.freqEnd), start + cfg.duration);
      }
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, start);
      g.gain.linearRampToValueAtTime(cfg.gain, start + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, start + cfg.duration);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(start);
      osc.stop(start + cfg.duration + 0.05);
    }
  }
}

// Singleton
let engineInstance: AudioEngine | null = null;
export function getAudioEngine(): AudioEngine {
  if (!engineInstance) engineInstance = new AudioEngine();
  return engineInstance;
}
