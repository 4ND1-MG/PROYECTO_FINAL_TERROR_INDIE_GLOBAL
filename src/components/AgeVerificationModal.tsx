import { ShieldAlert, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { getGameText, type Game } from '@/data/games';
import { useLanguage } from '@/i18n/useLanguage';

interface AgeVerificationModalProps {
  game: Game | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function AgeVerificationModal({ game, onClose, onConfirm }: AgeVerificationModalProps) {
  const [denied, setDenied] = useState(false);
  const { language } = useLanguage();

  if (!game) return null;
  const text = getGameText(game, language);

  const handleConfirm = () => {
    setDenied(false);
    onConfirm();
  };

  const handleDeny = () => {
    setDenied(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-abyss/90 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md animate-scale-in">
        <div className="relative overflow-hidden rounded-2xl glass-strong border border-blood/20 glow-blood-lg noise-overlay scanlines">
          {/* Header bar */}
          <div className="flex items-center gap-3 border-b border-blood/15 px-6 py-4">
            <ShieldAlert className="h-6 w-6 text-blood animate-pulse" />
            <div>
              <h2 className="font-mono text-sm font-bold tracking-[0.2em] uppercase text-bone">
                Verificación de Edad
              </h2>
              <p className="text-[0.65rem] font-mono text-blood/60 tracking-wider uppercase">
                Contenido Restringido · Clasificación {game.ageRating}
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            <div className="mb-5 flex items-start gap-3 rounded-lg border border-white/5 bg-coal/60 p-4">
              <AlertTriangle className="h-5 w-5 text-blood/70 shrink-0 mt-0.5" />
              <p className="text-sm text-bone/70 leading-relaxed">
                Estás a punto de acceder a <span className="font-bold text-bone">{text.title}</span>.
                Este título contiene contenido sensible y está clasificado para
                <span className="font-bold text-blood"> {game.ageRating} años</span> o más.
              </p>
            </div>

            <p className="mb-5 text-center text-sm text-bone/60">
              Confirma que tienes la edad mínima requerida para continuar.
            </p>

            {denied && (
              <div className="mb-4 rounded-lg border border-blood/20 bg-blood/10 px-4 py-3 text-center animate-fade-in">
                <p className="text-sm text-blood/90 font-medium">
                  Acceso denegado. No cumples con la edad mínima requerida.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleConfirm}
                className="flex-1 rounded-full bg-blood px-4 py-3 text-sm font-bold text-white transition-all hover:bg-blood-dark glow-blood"
              >
                Soy mayor de 18 años
              </button>
              <button
                onClick={handleDeny}
                className="flex-1 rounded-full border border-white/10 bg-coal px-4 py-3 text-sm font-bold text-bone/60 transition-all hover:text-bone hover:border-white/20"
              >
                No, salir
              </button>
            </div>

            <p className="mt-5 text-center text-[0.65rem] font-mono text-bone/30 tracking-wider uppercase">
              Nocturne · Sistema de Verificación Obligatoria
            </p>
          </div>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-coal border border-white/10 text-bone/50 hover:text-bone hover:border-blood/30 transition-all"
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>
    </div>
  );
}
