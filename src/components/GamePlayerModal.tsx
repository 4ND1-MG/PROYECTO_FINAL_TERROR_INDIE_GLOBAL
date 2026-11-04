import { useCallback, useEffect, useRef, useState } from 'react';
import { Maximize, Minimize, Pause, Play, RotateCcw, Skull, Volume2, VolumeX, X } from 'lucide-react';
import { getGameText, type Game } from '@/data/games';
import { useLanguage } from '@/i18n/useLanguage';
import { createGameSound, type GameSound } from '@/game/gameSound';
import {
  SHARD_TOTAL,
  WORLD_HEIGHT,
  WORLD_WIDTH,
  createMazeGame,
  renderMazeGame,
  updateMazeGame,
  type GameStatus,
  type MazeGame,
  type MazeInput,
} from '@/game/mazeGame';

interface GamePlayerModalProps {
  game: Game;
  onClose: () => void;
}

type Direction = 'up' | 'down' | 'left' | 'right';

const KEY_DIRECTIONS: Record<string, Direction> = {
  KeyW: 'up',
  ArrowUp: 'up',
  KeyS: 'down',
  ArrowDown: 'down',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
};

const createInput = (): MazeInput => ({ up: false, down: false, left: false, right: false, interact: false });

const CONTROL_BUTTON =
  'flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-coal/90 text-bone/70 backdrop-blur-sm transition-all hover:text-bone hover:border-blood/30 disabled:opacity-40 disabled:pointer-events-none';

const KEY_BADGE = 'rounded-md border border-white/10 bg-ash px-2 py-1 font-mono text-xs text-bone/80';

export function GamePlayerModal({ game, onClose }: GamePlayerModalProps) {
  const { t, language } = useLanguage();
  const text = getGameText(game, language);

  const screenRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [initialMaze] = useState(createMazeGame);
  const mazeRef = useRef<MazeGame>(initialMaze);
  const inputRef = useRef<MazeInput>(createInput());
  const pausedRef = useRef(false);
  const [sound] = useState(createGameSound);

  const [status, setStatus] = useState<GameStatus>('playing');
  const [collected, setCollected] = useState(0);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const togglePause = useCallback(() => {
    if (mazeRef.current.status !== 'playing') return;
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
  }, []);

  const restart = () => {
    mazeRef.current = createMazeGame();
    inputRef.current = createInput();
    pausedRef.current = false;
    setPaused(false);
    setStatus('playing');
    setCollected(0);
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    sound.setMuted(next);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }
    void screenRef.current?.requestFullscreen();
  };

  useEffect(() => () => sound.dispose(), [sound]);

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;

    let frame = 0;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const maze = mazeRef.current;
      const input = inputRef.current;
      const interact = input.interact;
      input.interact = false;

      if (!pausedRef.current && maze.status === 'playing') {
        const events = updateMazeGame(maze, dt, { ...input, interact });
        for (const event of events) {
          sound.play(event);
          if (event === 'shard') setCollected(maze.collected);
          if (event === 'won' || event === 'caught') setStatus(event);
        }
      }

      renderMazeGame(context, maze);
      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [sound]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        onClose();
        return;
      }
      if (event.code === 'KeyP') {
        togglePause();
        return;
      }
      if (event.code === 'Space') {
        event.preventDefault();
        if (!event.repeat) inputRef.current.interact = true;
        return;
      }
      const direction = KEY_DIRECTIONS[event.code];
      if (direction) {
        event.preventDefault();
        inputRef.current[direction] = true;
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const direction = KEY_DIRECTIONS[event.code];
      if (direction) inputRef.current[direction] = false;
    };

    const onBlur = () => {
      inputRef.current = createInput();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [onClose, togglePause]);

  useEffect(() => {
    const syncFullscreen = () => setFullscreen(document.fullscreenElement === screenRef.current);
    document.addEventListener('fullscreenchange', syncFullscreen);
    return () => {
      document.removeEventListener('fullscreenchange', syncFullscreen);
      if (document.fullscreenElement) void document.exitFullscreen();
    };
  }, []);

  const isOver = status !== 'playing';
  const fearLevel = game.ageRating === '+18' ? 5 : 4;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6">
      <div className="absolute inset-0 bg-abyss/95 backdrop-blur-md animate-fade-in" onClick={onClose} />

      <div className="relative flex w-full max-w-6xl max-h-[92vh] flex-col overflow-y-auto rounded-2xl glass-strong border border-white/8 animate-scale-in lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
          <div
            ref={screenRef}
            className={`group relative flex items-center justify-center overflow-hidden bg-black ${
              fullscreen ? 'h-screen w-screen' : 'w-full rounded-xl border border-white/5'
            }`}
            style={fullscreen ? undefined : { aspectRatio: `${WORLD_WIDTH} / ${WORLD_HEIGHT}` }}
          >
            <canvas
              ref={canvasRef}
              width={WORLD_WIDTH}
              height={WORLD_HEIGHT}
              role="img"
              aria-label={t('play.canvasLabel')}
              className={fullscreen ? 'h-full w-full object-contain' : 'block h-auto w-full'}
            />

            {paused && !isOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-abyss/70 backdrop-blur-sm animate-fade-in">
                <p className="font-mono text-sm uppercase tracking-[0.3em] text-bone/80">{t('play.paused')}</p>
              </div>
            )}

            {isOver && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-abyss/80 backdrop-blur-sm animate-fade-in">
                <p
                  className={`px-6 text-center font-display text-xl sm:text-2xl font-extrabold ${
                    status === 'won' ? 'text-toxic' : 'text-blood'
                  }`}
                >
                  {status === 'won' ? t('play.won') : t('play.caught')}
                </p>
                <button
                  onClick={restart}
                  className="flex items-center gap-2 rounded-full bg-blood px-6 py-2.5 text-sm font-bold text-white glow-blood transition-all hover:scale-105"
                >
                  <RotateCcw className="h-4 w-4" />
                  {t('play.restart')}
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className={`absolute top-3 right-3 z-10 ${CONTROL_BUTTON}`}
              aria-label={t('common.close')}
            >
              <X className="h-4 w-4" />
            </button>

            <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-2 bg-gradient-to-t from-black/90 to-transparent p-3 pt-10">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePause}
                  disabled={isOver}
                  className={CONTROL_BUTTON}
                  aria-label={paused ? t('play.resume') : t('play.pause')}
                  title={paused ? t('play.resume') : t('play.pause')}
                >
                  {paused ? <Play className="h-4 w-4 fill-current" /> : <Pause className="h-4 w-4" />}
                </button>
                <button
                  onClick={restart}
                  className={CONTROL_BUTTON}
                  aria-label={t('play.restart')}
                  title={t('play.restart')}
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  onClick={toggleMute}
                  className={CONTROL_BUTTON}
                  aria-label={muted ? t('play.unmute') : t('play.mute')}
                  title={muted ? t('play.unmute') : t('play.mute')}
                >
                  {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
              </div>
              <button
                onClick={toggleFullscreen}
                className={CONTROL_BUTTON}
                aria-label={fullscreen ? t('play.exitFullscreen') : t('play.fullscreen')}
                title={fullscreen ? t('play.exitFullscreen') : t('play.fullscreen')}
              >
                {fullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        <aside className="flex w-full shrink-0 flex-col gap-6 border-t border-white/5 p-5 sm:p-6 lg:w-80 lg:border-l lg:border-t-0">
          <div>
            <p className="font-mono text-xs tracking-wide text-bone/40">
              {t('hero.by', { developer: game.developer })}
            </p>
            <h2 className="mt-1 font-display text-2xl font-extrabold leading-tight text-bone text-glow-soft">
              {text.title}
            </h2>
          </div>

          <div className="space-y-3 rounded-xl border border-white/5 bg-coal/60 p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-bone/40">{t('play.rating')}</span>
              <span className="inline-flex items-center rounded-md border border-blood/30 bg-blood/10 px-2 py-0.5 text-xs font-bold text-blood">
                {game.ageRating}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-bone/40">{t('play.fearLevel')}</span>
              <div className="flex items-center gap-1" aria-label={`${fearLevel} / 5`}>
                {[1, 2, 3, 4, 5].map((level) => (
                  <Skull
                    key={level}
                    className={`h-4 w-4 ${level <= fearLevel ? 'text-blood' : 'text-bone/15'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-bone/60">{t('play.fragments')}</span>
              <span className="font-bold text-bone">
                {collected} / {SHARD_TOTAL}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ash">
              <div
                className="h-full rounded-full bg-bone transition-all duration-500"
                style={{ width: `${(collected / SHARD_TOTAL) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-bone/40">{t('play.objective')}</h3>
            <p className="text-sm leading-relaxed text-bone/70">{t('play.objectiveText')}</p>
          </div>

          <div>
            <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-bone/40">{t('play.controls')}</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center justify-between gap-3">
                <span className="text-bone/60">{t('play.moveLabel')}</span>
                <kbd className={KEY_BADGE}>{t('play.moveKeys')}</kbd>
              </li>
              <li className="flex items-center justify-between gap-3">
                <span className="text-bone/60">{t('play.interactLabel')}</span>
                <kbd className={KEY_BADGE}>{t('play.interactKey')}</kbd>
              </li>
              <li className="flex items-center justify-between gap-3">
                <span className="text-bone/60">{t('play.pause')}</span>
                <kbd className={KEY_BADGE}>P</kbd>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
