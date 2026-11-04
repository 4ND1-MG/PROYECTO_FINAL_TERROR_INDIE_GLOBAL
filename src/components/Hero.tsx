import { Play, ArrowRight, Star, Eye } from 'lucide-react';
import { getGameText, type Game } from '@/data/games';
import { GENRE_LABEL_KEYS } from '@/i18n/translations';
import { useDeepHoverSound } from '@/audio/useAudio';
import { useLanguage } from '@/i18n/useLanguage';

interface HeroProps {
  game: Game;
  onPlay: () => void;
  onDetails: () => void;
}

export function Hero({ game, onPlay, onDetails }: HeroProps) {
  const playDeepHover = useDeepHoverSound();
  const { t, language } = useLanguage();
  const text = getGameText(game, language);
  return (
    <section
      onMouseEnter={playDeepHover}
      className="relative overflow-hidden noise-overlay scanlines"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={game.banner}
          alt=""
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/70 to-abyss/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-abyss via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
        <div className="max-w-2xl">
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 mb-4 animate-fade-in">
            <span className="h-2 w-2 rounded-full bg-blood animate-pulse" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-blood/80">
              {t('hero.badge')}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-bone text-glow-soft animate-fade-in-up animation-delay-100">
            {text.title}
          </h1>

          {/* Developer */}
          <p className="mt-2 font-mono text-sm text-bone/50 tracking-wide animate-fade-in-up animation-delay-200">
            {t('hero.by', { developer: game.developer })}
          </p>

          {/* Rating */}
          <div className="mt-4 flex items-center gap-4 animate-fade-in-up animation-delay-300">
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-blood text-blood" />
              <span className="text-sm font-bold text-bone">{game.rating}</span>
              <span className="text-xs text-bone/40">/5.0</span>
            </div>
            <span className="h-3 w-px bg-white/10" />
            <span className="inline-flex items-center gap-1 rounded-md border border-blood/30 bg-blood/10 px-2 py-0.5 text-xs font-bold text-blood">
              {game.ageRating}
            </span>
            <span className="h-3 w-px bg-white/10" />
            <span className="text-xs font-mono text-bone/40 uppercase tracking-wider">
              {t(GENRE_LABEL_KEYS[game.genre])}
            </span>
          </div>

          {/* Description */}
          <p className="mt-6 text-lg text-bone/70 leading-relaxed max-w-xl animate-fade-in-up animation-delay-400">
            {text.description}
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center gap-4 animate-fade-in-up animation-delay-500">
            <button
              onClick={onPlay}
              className="group flex items-center gap-2.5 rounded-full bg-blood px-7 py-3.5 text-sm font-bold text-white transition-all glow-blood hover:glow-blood-lg hover:scale-105"
            >
              <Play className="h-4 w-4 fill-white transition-transform group-hover:scale-110" />
              {t('hero.play')}
            </button>
            <button
              onClick={onDetails}
              className="group flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-bold text-bone backdrop-blur-sm transition-all hover:border-blood/30 hover:bg-white/10"
            >
              <Eye className="h-4 w-4 transition-transform group-hover:scale-110" />
              {t('hero.details')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blood/30 to-transparent" />
    </section>
  );
}
