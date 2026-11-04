import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '@/i18n/useLanguage';

interface AuthModalShellProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function AuthModalShell({ title, onClose, children }: AuthModalShellProps) {
  const { t } = useLanguage();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-abyss/75 backdrop-blur-md animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto animate-scale-in"
      >
        <div className="relative overflow-hidden rounded-2xl glass-strong border border-blood/15 glow-blood-lg noise-overlay">
          <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
            <div>
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-blood/70">{t('auth.brand')}</p>
              <h2 id="auth-modal-title" className="font-mono text-sm font-bold tracking-[0.15em] uppercase text-bone">
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-coal border border-white/10 text-bone/60 hover:text-bone hover:border-blood/40 hover:rotate-90 transition-all duration-300"
              aria-label={t('common.close')}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
