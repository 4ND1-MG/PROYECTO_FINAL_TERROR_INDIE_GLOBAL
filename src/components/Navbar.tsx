import { Search, Ghost, User, Upload, Menu, X, LogOut, Globe, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { HorrorGenre } from '@/data/games';
import { useAuth } from '@/auth/useAuth';
import { useLanguage } from '@/i18n/useLanguage';
import { GENRE_LABEL_KEYS, LANGUAGE_OPTIONS, type Language } from '@/i18n/translations';

interface NavbarProps {
  activeGenre: HorrorGenre | 'Todos';
  onGenreChange: (genre: HorrorGenre | 'Todos') => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  onLoginClick: () => void;
  onUploadClick: () => void;
}

const genres: (HorrorGenre | 'Todos')[] = ['Todos', 'Survival Horror', 'Psicológico', 'Retro/Lo-fi'];

export function Navbar({ activeGenre, onGenreChange, onSearch, searchQuery, onLoginClick, onUploadClick }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const displayName = user?.email?.split('@')[0] ?? '';

  const handleSignOut = () => {
    void signOut();
  };

  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <a href="#top" className="flex items-center gap-2 shrink-0 group">
            <div className="relative">
              <Ghost className="h-7 w-7 text-blood group-hover:text-blood/80 transition-colors animate-flicker" />
              <div className="absolute inset-0 bg-blood/20 blur-lg group-hover:bg-blood/30 transition-all" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-mono text-lg font-bold tracking-[0.2em] text-bone group-hover:text-blood transition-colors">
                NOCTURNE
              </span>
              <span className="font-mono text-[0.55rem] tracking-[0.3em] text-bone/40 uppercase">
                {t('nav.tagline')}
              </span>
            </div>
          </a>

          {/* Search bar — desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-bone/30 group-focus-within:text-blood transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                placeholder={t('nav.searchPlaceholder')}
                className="w-full rounded-full bg-coal/80 border border-white/5 pl-10 pr-4 py-2 text-sm text-bone placeholder:text-bone/30 focus:outline-none focus:border-blood/40 focus:bg-ash/80 transition-all"
              />
            </div>
          </div>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => onGenreChange(genre)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                  activeGenre === genre
                    ? 'bg-blood/15 text-blood border border-blood/30'
                    : 'text-bone/50 hover:text-bone hover:bg-white/5 border border-transparent'
                }`}
              >
                {t(GENRE_LABEL_KEYS[genre])}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <label className="relative flex items-center">
              <Globe className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-bone/50" />
              <span className="sr-only">{t('nav.language')}</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="cursor-pointer appearance-none rounded-full border border-white/5 bg-coal/80 py-1.5 pl-7 pr-6 text-xs font-medium text-bone/70 transition-all hover:border-white/15 hover:text-bone focus:border-blood/40 focus:outline-none"
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <option key={option.code} value={option.code} className="bg-ink text-bone">
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 h-3 w-3 text-bone/40" />
            </label>
            {user ? (
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/5 bg-coal/80 py-1 pl-1 pr-1.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blood/20 text-xs font-bold uppercase text-blood">
                  {displayName.charAt(0)}
                </span>
                <span className="max-w-[9rem] truncate text-sm text-bone/80">{displayName}</span>
                <button
                  onClick={handleSignOut}
                  aria-label={t('nav.logout')}
                  title={t('nav.logout')}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-bone/50 hover:text-blood hover:bg-white/5 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-bone/70 hover:text-bone hover:bg-white/5 border border-white/5 transition-all whitespace-nowrap"
              >
                <User className="h-4 w-4" />
                {t('nav.login')}
              </button>
            )}
            <button
              onClick={onUploadClick}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold bg-blood text-white hover:bg-blood-dark transition-all glow-blood hover:glow-blood-lg"
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">{t('nav.upload')}</span>
            </button>
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-2 text-bone/70 hover:text-bone transition-colors"
              aria-label={t('nav.menu')}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-bone/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder={t('nav.searchPlaceholder')}
              className="w-full rounded-full bg-coal/80 border border-white/5 pl-10 pr-4 py-2 text-sm text-bone placeholder:text-bone/30 focus:outline-none focus:border-blood/40 transition-all"
            />
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="lg:hidden pb-4 animate-slide-down">
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => {
                    onGenreChange(genre);
                    setMobileOpen(false);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                    activeGenre === genre
                      ? 'bg-blood/15 text-blood border border-blood/30'
                      : 'text-bone/50 hover:text-bone hover:bg-white/5 border border-white/5'
                  }`}
                >
                  {t(GENRE_LABEL_KEYS[genre])}
                </button>
              ))}
            </div>
            {user ? (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleSignOut();
                }}
                className="mt-3 w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium text-bone/70 hover:text-blood bg-coal border border-white/5 transition-all"
              >
                <LogOut className="h-4 w-4" />
                {t('nav.logoutNamed', { name: displayName })}
              </button>
            ) : (
              <button
                onClick={() => {
                  onLoginClick();
                  setMobileOpen(false);
                }}
                className="mt-3 w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium text-bone/70 hover:text-bone bg-coal border border-white/5 transition-all"
              >
                <User className="h-4 w-4" />
                {t('nav.login')}
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
