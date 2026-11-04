import { useCallback, useState } from 'react';
import { getAudioEngine } from './engine';

const DEFAULT_VOLUME = 0.5;

export function useAmbientPlayer() {
  const engine = getAudioEngine();
  const [playing, setPlaying] = useState(false);
  const [volume, setVolumeState] = useState(DEFAULT_VOLUME);

  const togglePlay = useCallback(() => {
    if (engine.enabled) {
      engine.disable();
      setPlaying(false);
    } else {
      engine.enable();
      setPlaying(true);
    }
  }, [engine]);

  const setVolume = useCallback(
    (value: number) => {
      engine.setVolume(value);
      setVolumeState(value);
    },
    [engine],
  );

  return { playing, volume, togglePlay, setVolume };
}

export function useHoverSound() {
  const engine = getAudioEngine();
  return useCallback(() => engine.playSound('hover'), []);
}

export function useDeepHoverSound() {
  const engine = getAudioEngine();
  return useCallback(() => engine.playSound('deep-hover'), []);
}

export function useClickSound() {
  const engine = getAudioEngine();
  return useCallback(() => engine.playSound('click'), []);
}

export function useWhooshSound() {
  const engine = getAudioEngine();
  return useCallback(() => engine.playSound('whoosh'), []);
}
