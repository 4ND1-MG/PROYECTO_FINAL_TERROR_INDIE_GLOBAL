import type { GameEvent } from '@/game/mazeGame';

interface Note {
  freq: number;
  start: number;
  duration: number;
  type: OscillatorType;
  gain: number;
}

const SOUND_NOTES: Record<GameEvent, Note[]> = {
  shard: [
    { freq: 880, start: 0, duration: 0.12, type: 'sine', gain: 0.12 },
    { freq: 1320, start: 0.08, duration: 0.18, type: 'sine', gain: 0.1 },
  ],
  locked: [{ freq: 110, start: 0, duration: 0.35, type: 'sawtooth', gain: 0.08 }],
  won: [
    { freq: 523, start: 0, duration: 0.3, type: 'triangle', gain: 0.12 },
    { freq: 659, start: 0.15, duration: 0.3, type: 'triangle', gain: 0.12 },
    { freq: 784, start: 0.3, duration: 0.3, type: 'triangle', gain: 0.12 },
    { freq: 1046, start: 0.45, duration: 0.6, type: 'triangle', gain: 0.12 },
  ],
  caught: [
    { freq: 140, start: 0, duration: 0.9, type: 'sawtooth', gain: 0.18 },
    { freq: 70, start: 0.1, duration: 1, type: 'square', gain: 0.12 },
  ],
};

export interface GameSound {
  play: (event: GameEvent) => void;
  setMuted: (muted: boolean) => void;
  dispose: () => void;
}

export function createGameSound(): GameSound {
  let context: AudioContext | null = null;
  let muted = false;

  return {
    play(event) {
      if (muted) return;
      if (!context) context = new AudioContext();
      const ctx = context;
      if (ctx.state === 'suspended') void ctx.resume();

      const t0 = ctx.currentTime;
      for (const note of SOUND_NOTES[event]) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = note.type;
        osc.frequency.value = note.freq;
        gain.gain.setValueAtTime(0.0001, t0 + note.start);
        gain.gain.exponentialRampToValueAtTime(note.gain, t0 + note.start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + note.start + note.duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t0 + note.start);
        osc.stop(t0 + note.start + note.duration + 0.02);
      }
    },
    setMuted(value) {
      muted = value;
    },
    dispose() {
      void context?.close();
      context = null;
    },
  };
}
