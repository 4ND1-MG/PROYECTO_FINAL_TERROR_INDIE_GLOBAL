import { X, Star, Play, Tag, Calendar } from 'lucide-react';
import { getGameText, type Game } from '@/data/games';
import { useLanguage } from '@/i18n/useLanguage';
import { GENRE_LABEL_KEYS, TAG_LABEL_KEYS } from '@/i18n/translations';

interface GameDetailModalProps {
  game: Game | null;
  onClose: () => void;
  onPlay: () => void;
}

export function GameDetailModal({ game, onClose, onPlay }: GameDetailModalProps) {
  const { t, language } = useLanguage();
  if (!game) return null;
  const text = getGameText(game, language);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-abyss/90 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto animate-scale-in">
        <div className="relative overflow-hidden rounded-2xl glass-strong border border-white/8">
          {/* Banner */}
          <div className="relative h-48 sm:h-64 overflow-hidden">
            <img src={game.banner} alt="" className="h-full w-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-abyss/80 backdrop-blur-sm border border-white/10 text-bone/70 hover:text-bone hover:border-blood/30 transition-all"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="relative px-6 pb-6 -mt-12">
            <div className="flex flex-col sm:flex-row gap-5">
              {/* Cover */}
              <div className="shrink-0">
                <div className="h-40 w-28 sm:h-44 sm:w-32 overflow-hidden rounded-lg border border-white/10 glow-blood">
                  <img src={game.cover} alt={text.title} className="h-full w-full object-cover" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 pt-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-blood/30 bg-blood/10 px-2.5 py-0.5 text-xs font-bold text-blood mb-2">
                  {game.ageRating}
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-bone text-glow-soft">
                  {text.title}
                </h2>
                <p className="mt-1 font-mono text-sm text-bone/50">
                  por {game.developer}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-blood text-blood" />
                    <span className="font-bold text-bone">{game.rating}</span>
                    <span className="text-bone/40 text-xs">/5.0</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-bone/50">
                    <Tag className="h-3.5 w-3.5" />
                    {t(GENRE_LABEL_KEYS[game.genre])}
                  </div>
                  <div className="flex items-center gap-1.5 text-bone/50">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(game.releaseDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="mt-5 text-bone/70 leading-relaxed">
              {text.description}
            </p>

            {/* Tags */}
            <div className="mt-5">
              <h3 className="font-mono text-xs uppercase tracking-wider text-bone/40 mb-2">Etiquetas</h3>
              <div className="flex flex-wrap gap-2">
                {game.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-ash/60 border border-white/5 px-3 py-1 text-xs font-medium text-bone/60"
                  >
                    {t(TAG_LABEL_KEYS[tag])}
                  </span>
                ))}
              </div>
            </div>

            {/* Action */}
            <button
              onClick={onPlay}
              className="mt-6 flex items-center gap-2.5 rounded-full bg-blood px-7 py-3.5 text-sm font-bold text-white transition-all glow-blood hover:glow-blood-lg hover:scale-[1.02] w-full sm:w-auto justify-center"
            >
              <Play className="h-4 w-4 fill-white" />
              Jugar Ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
