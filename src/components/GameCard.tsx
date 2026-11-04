import { Star, Ghost, Eye } from 'lucide-react';
import { getGameText, type Game } from '@/data/games';
import { useHoverSound } from '@/audio/useAudio';
import { useLanguage } from '@/i18n/useLanguage';
import { GENRE_LABEL_KEYS } from '@/i18n/translations';

interface GameCardProps {
  game: Game;
  onDetails: () => void;
}

export function GameCard({ game, onDetails }: GameCardProps) {
  const playHover = useHoverSound();
  const { t, language } = useLanguage();
  const text = getGameText(game, language);
  return (
    <article
      onClick={onDetails}
      onMouseEnter={playHover}
      className="group relative overflow-hidden rounded-xl border border-white/5 bg-coal transition-all duration-300 card-glow hover:-translate-y-1 cursor-pointer"
    >
      {/* Cover */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={game.cover}
          alt={text.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-75"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-coal via-coal/40 to-transparent" />

        {/* Age rating badge */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center rounded-md border border-blood/40 bg-abyss/80 backdrop-blur-sm px-2 py-0.5 text-[0.7rem] font-bold text-blood tracking-wide">
            {game.ageRating}
          </span>
        </div>

        {/* Genre tag */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-abyss/80 backdrop-blur-sm px-2.5 py-1 text-[0.65rem] font-mono text-bone/60 uppercase tracking-wider border border-white/5">
            <Ghost className="h-3 w-3" />
            {t(GENRE_LABEL_KEYS[game.genre])}
          </span>
        </div>

        {/* Hover quick-view */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2 rounded-full bg-blood/90 backdrop-blur-sm px-5 py-2.5 text-sm font-bold text-white border border-blood/50 glow-blood-lg">
            <Eye className="h-4 w-4" />
            {t('card.view')}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-bone leading-tight group-hover:text-blood transition-colors">
            {text.title}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="h-3 w-3 fill-blood text-blood" />
            <span className="text-xs font-bold text-bone/70">{game.rating}</span>
          </div>
        </div>
        <p className="mt-1 font-mono text-xs text-bone/40 tracking-wide">
          {game.developer}
        </p>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {game.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-ash/60 border border-white/5 px-2 py-0.5 text-[0.65rem] font-medium text-bone/50"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
