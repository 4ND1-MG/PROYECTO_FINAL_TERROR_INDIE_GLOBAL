import { useState, useMemo, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Catalog } from '@/components/Catalog';
import { Footer } from '@/components/Footer';
import { AgeVerificationModal } from '@/components/AgeVerificationModal';
import { GameDetailModal } from '@/components/GameDetailModal';
import { UploadModal } from '@/components/UploadModal';
import { LoginModal } from '@/components/LoginModal';
import { GamePlayerModal } from '@/components/GamePlayerModal';
import { AmbientPlayer } from '@/components/AmbientPlayer';
import { games, featuredGame, getGameText, type Game, type HorrorGenre } from '@/data/games';
import { useClickSound } from '@/audio/useAudio';
import { useLanguage } from '@/i18n/useLanguage';
import { useAuth } from '@/auth/useAuth';

export default function App() {
  const [activeGenre, setActiveGenre] = useState<HorrorGenre | 'Todos'>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [ageModalGame, setAgeModalGame] = useState<Game | null>(null);
  const [detailGame, setDetailGame] = useState<Game | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [verifiedGames, setVerifiedGames] = useState<Set<string>>(new Set());
  const [playingGame, setPlayingGame] = useState<Game | null>(null);
  const [pendingGame, setPendingGame] = useState<Game | null>(null);
  const playClick = useClickSound();
  const { language } = useLanguage();
  const { user } = useAuth();

  // Body scroll lock when any modal open
  const anyModalOpen = !!ageModalGame || !!detailGame || uploadOpen || loginOpen || !!playingGame;
  useEffect(() => {
    document.body.style.overflow = anyModalOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [anyModalOpen]);

  const filteredGames = useMemo(() => {
    return games.filter((g) => {
      const genreMatch = activeGenre === 'Todos' || g.genre === activeGenre;
      const q = searchQuery.toLowerCase().trim();
      const localizedTitle = getGameText(g, language).title.toLowerCase();
      const searchMatch =
        !q ||
        g.title.toLowerCase().includes(q) ||
        localizedTitle.includes(q) ||
        g.developer.toLowerCase().includes(q) ||
        g.tags.some((t) => t.toLowerCase().includes(q)) ||
        g.genre.toLowerCase().includes(q);
      return genreMatch && searchMatch;
    });
  }, [activeGenre, searchQuery, language]);

  // Play flow: age verification first, then sign-in, then the game screen
  const handlePlayRequest = (game: Game) => {
    playClick();
    setDetailGame(null);
    if (!verifiedGames.has(game.id)) {
      setAgeModalGame(game);
      return;
    }
    if (!user) {
      setPendingGame(game);
      setLoginOpen(true);
      return;
    }
    setPlayingGame(game);
  };

  const handleAgeConfirm = () => {
    if (!ageModalGame) return;
    const game = ageModalGame;
    setVerifiedGames((prev) => new Set(prev).add(game.id));
    setAgeModalGame(null);
    if (!user) {
      setPendingGame(game);
      setLoginOpen(true);
      return;
    }
    setPlayingGame(game);
  };

  const handleAuthenticated = () => {
    if (pendingGame) setPlayingGame(pendingGame);
  };

  const handleLoginClose = () => {
    setLoginOpen(false);
    setPendingGame(null);
  };

  const handleHeroPlay = () => handlePlayRequest(featuredGame);
  const handleHeroDetails = () => setDetailGame(featuredGame);

  return (
    <div id="top" className="min-h-screen bg-abyss text-bone noise-overlay">
      <Navbar
        activeGenre={activeGenre}
        onGenreChange={setActiveGenre}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        onLoginClick={() => setLoginOpen(true)}
        onUploadClick={() => setUploadOpen(true)}
      />

      <main>
        <Hero game={featuredGame} onPlay={handleHeroPlay} onDetails={handleHeroDetails} />
        <Catalog
          games={filteredGames}
          activeGenre={activeGenre}
          onGenreChange={setActiveGenre}
          onDetails={(g) => setDetailGame(g)}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
        />
      </main>

      <Footer />

      <AmbientPlayer />

      {/* Modals */}
      {ageModalGame && (
        <AgeVerificationModal
          game={ageModalGame}
          onClose={() => setAgeModalGame(null)}
          onConfirm={handleAgeConfirm}
        />
      )}
      {detailGame && (
        <GameDetailModal
          game={detailGame}
          onClose={() => setDetailGame(null)}
          onPlay={() => handlePlayRequest(detailGame)}
        />
      )}
      {playingGame && (
        <GamePlayerModal game={playingGame} onClose={() => setPlayingGame(null)} />
      )}
      {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} />}
      {loginOpen && (
        <LoginModal onClose={handleLoginClose} onAuthenticated={handleAuthenticated} />
      )}
    </div>
  );
}
