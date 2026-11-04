import { SlidersHorizontal } from 'lucide-react';
import { GameCard } from './GameCard';
import type { Game, HorrorGenre } from '@/data/games';
import { useLanguage } from '@/i18n/useLanguage';
import { GENRE_LABEL_KEYS } from '@/i18n/translations';

interface CatalogProps {
  games: Game[];
  activeGenre: HorrorGenre | 'Todos';
  onGenreChange: (genre: HorrorGenre | 'Todos') => void;
  onDetails: (game: Game) => void;
  searchQuery: string;
  onClearSearch: () => void;
}

const genres: (HorrorGenre | 'Todos')[] = ['Todos', 'Survival Horror', 'Psicológico', 'Retro/Lo-fi'];

export function Catalog({ games, activeGenre, onGenreChange, onDetails, searchQuery, onClearSearch }: CatalogProps) {
  const { t } = useLanguage();
  const countText = games.length === 1 ? t('catalog.countOne', { count: games.length }) : t('catalog.countMany', { count: games.length });
  return (
    <section id="catalog" className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <SlidersHorizontal className="h-4 w-4 text-blood" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-blood/70">
              {t('catalog.label')}
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-bone text-glow-soft">
            {t('catalog.title')}
          </h2>
          <p className="mt-1 text-sm text-bone/40">
            {countText}
            {searchQuery && ` ${t('catalog.searchFor', { query: searchQuery })}`}
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => onGenreChange(genre)}
              className={`px-4 py-2 rounded-full text-sm font-medium tracking-wide transition-all ${
                activeGenre === genre
                  ? 'bg-blood/15 text-blood border border-blood/30 glow-blood'
                  : 'text-bone/50 hover:text-bone hover:bg-white/5 border border-white/5'
              }`}
            >
              {t(GENRE_LABEL_KEYS[genre])}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {games.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
          {games.map((game, idx) => (
            <div
              key={game.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${idx * 60}ms`, opacity: 0 }}
            >
              <GameCard game={game} onDetails={() => onDetails(game)} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="font-mono text-bone/40 tracking-wider">
            {t('catalog.empty')}
          </p>
          <p className="mt-2 text-sm text-bone/30">
            {t('catalog.emptyHint')}
          </p>
          {searchQuery && (
            <button
              onClick={onClearSearch}
              className="mt-6 rounded-full border border-white/10 bg-coal px-6 py-2.5 text-sm font-bold text-bone/70 hover:text-bone hover:border-blood/30 transition-all"
            >
              {t('catalog.clearSearch')}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
