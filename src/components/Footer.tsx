import { Ghost, Twitter, Github, Youtube, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/i18n/useLanguage';

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="relative border-t border-white/5 bg-ink noise-overlay">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Content warning */}
        <div className="mb-10 flex items-start gap-3 rounded-lg border border-blood/10 bg-blood/5 p-4">
          <AlertTriangle className="h-5 w-5 text-blood/60 shrink-0 mt-0.5" />
          <p className="text-xs text-bone/50 leading-relaxed">
            <span className="font-bold text-bone/70">{t('footer.warningTitle')}</span>{' '}
            {t('footer.warningBody')}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Ghost className="h-6 w-6 text-blood animate-flicker" />
              <span className="font-mono text-base font-bold tracking-[0.2em] text-bone">
                NOCTURNE
              </span>
            </div>
            <p className="text-xs text-bone/40 leading-relaxed max-w-xs">{t('footer.brandDesc')}</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-bone/40 mb-3">{t('footer.platform')}</h4>
            <ul className="space-y-2 text-sm text-bone/60">
              <li><a href="#" className="hover:text-blood transition-colors">{t('footer.catalog')}</a></li>
              <li><a href="#" className="hover:text-blood transition-colors">{t('footer.uploadGame')}</a></li>
              <li><a href="#" className="hover:text-blood transition-colors">{t('footer.forDevelopers')}</a></li>
              <li><a href="#" className="hover:text-blood transition-colors">{t('footer.upcoming')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-bone/40 mb-3">{t('footer.legal')}</h4>
            <ul className="space-y-2 text-sm text-bone/60">
              <li><a href="#" className="hover:text-blood transition-colors">{t('footer.terms')}</a></li>
              <li><a href="#" className="hover:text-blood transition-colors">{t('footer.privacy')}</a></li>
              <li><a href="#" className="hover:text-blood transition-colors">{t('footer.contentPolicy')}</a></li>
              <li><a href="#" className="hover:text-blood transition-colors">{t('footer.ageClassification')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-bone/40 mb-3">{t('footer.community')}</h4>
            <div className="flex gap-3">
              <a href="#" aria-label="Twitter" className="flex h-9 w-9 items-center justify-center rounded-full bg-coal border border-white/5 text-bone/50 hover:text-blood hover:border-blood/30 transition-all">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Github" className="flex h-9 w-9 items-center justify-center rounded-full bg-coal border border-white/5 text-bone/50 hover:text-blood hover:border-blood/30 transition-all">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Youtube" className="flex h-9 w-9 items-center justify-center rounded-full bg-coal border border-white/5 text-bone/50 hover:text-blood hover:border-blood/30 transition-all">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-mono text-bone/30 tracking-wider">{t('footer.rights')}</p>
          <p className="text-xs font-mono text-bone/30 tracking-wider">
            {t('footer.madeWith')}{' '}
            <span className="text-blood/80 font-medium">Tecnolochicas</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
