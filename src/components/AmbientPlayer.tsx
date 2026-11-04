import { useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useAmbientPlayer } from '@/audio/useAudio';
import { useLanguage } from '@/i18n/useLanguage';

const BAR_DELAYS = ['0s', '0.2s', '0.4s', '0.1s'];

function Equalizer({ active }: { active: boolean }) {
  return (
    <div className="flex h-4 items-end gap-[3px]" aria-hidden="true">
      {BAR_DELAYS.map((delay) => (
        <span
          key={delay}
          className={`h-full w-[3px] origin-bottom rounded-full bg-toxic transition-opacity duration-300 ${
            active ? 'animate-eq-bar opacity-100' : 'opacity-40'
          }`}
          style={{
            animationDelay: delay,
            transform: active ? undefined : 'scaleY(0.25)',
          }}
        />
      ))}
    </div>
  );
}

export function AmbientPlayer() {
  const { playing, volume, togglePlay, setVolume } = useAmbientPlayer();
  const { t } = useLanguage();
  const [panelOpen, setPanelOpen] = useState(false);
  const volumePercent = Math.round(volume * 100);

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
      {panelOpen && (
        <div
          id="ambient-volume-panel"
          className="glass-strong w-56 rounded-2xl border border-white/10 p-4 shadow-2xl animate-scale-in origin-bottom-right"
        >
          <div className="mb-3 flex items-center justify-between">
            <label htmlFor="ambient-volume" className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-bone/50">
              {t('player.volume')}
            </label>
            <span className="font-mono text-xs text-toxic">{volumePercent}%</span>
          </div>
          <input
            id="ambient-volume"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full cursor-pointer accent-toxic"
          />
        </div>
      )}

      <div
        className={`glass-strong flex items-center gap-3 rounded-full border p-1.5 pr-2 shadow-2xl transition-all duration-500 ${
          playing ? 'border-toxic/30 shadow-[0_0_24px_rgba(57,255,20,0.15)]' : 'border-white/10'
        }`}
      >
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? t('player.pause') : t('player.play')}
          aria-pressed={playing}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-toxic/60 ${
            playing ? 'bg-toxic text-abyss shadow-[0_0_18px_rgba(57,255,20,0.35)]' : 'bg-blood text-white glow-blood'
          }`}
        >
          {playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current translate-x-[1px]" />}
        </button>

        <div className="flex min-w-0 max-w-[9rem] flex-col leading-tight sm:max-w-[14rem]">
          <span className="font-mono text-[0.55rem] uppercase tracking-[0.25em] text-bone/40">
            {playing ? t('player.playing') : t('player.paused')}
          </span>
          <span className="truncate text-xs font-medium text-bone/85">{t('player.track')}</span>
        </div>

        <Equalizer active={playing} />

        <button
          type="button"
          onClick={() => setPanelOpen((open) => !open)}
          aria-label={t('player.adjustVolume')}
          aria-expanded={panelOpen}
          aria-controls="ambient-volume-panel"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-bone/60 transition-colors hover:bg-white/5 hover:text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-toxic/60"
        >
          {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
