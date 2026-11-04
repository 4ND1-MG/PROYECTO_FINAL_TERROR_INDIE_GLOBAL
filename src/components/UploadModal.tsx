import { X, Upload, AlertTriangle, Check } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/i18n/useLanguage';
import { GENRE_LABEL_KEYS } from '@/i18n/translations';

interface UploadModalProps {
  onClose: () => void;
}

interface FormState {
  title: string;
  developer: string;
  genre: string;
  description: string;
  tags: string;
  ageRating: string;
}

const LABEL_CLASS = 'block text-xs font-mono uppercase tracking-wider text-bone/40 mb-1.5';
const FIELD_CLASS = 'w-full rounded-lg bg-coal border border-white/5 px-3 py-2.5 text-sm text-bone placeholder:text-bone/30 focus:outline-none focus:border-blood/30 transition-all';

export function UploadModal({ onClose }: UploadModalProps) {
  const { t } = useLanguage();
  const [form, setForm] = useState<FormState>({
    title: '',
    developer: '',
    genre: 'Survival Horror',
    description: '',
    tags: '',
    ageRating: '+18',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-abyss/90 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto animate-scale-in">
        <div className="relative overflow-hidden rounded-2xl glass-strong border border-white/8 noise-overlay">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
            <div className="flex items-center gap-3">
              <Upload className="h-5 w-5 text-blood" />
              <div>
                <h2 className="font-mono text-sm font-bold tracking-[0.15em] uppercase text-bone">
                  {t('upload.title')}
                </h2>
                <p className="text-[0.65rem] font-mono text-bone/40 tracking-wider uppercase">
                  {t('upload.subtitle')}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-coal border border-white/10 text-bone/50 hover:text-bone hover:border-blood/30 transition-all"
              aria-label={t('common.close')}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {submitted ? (
            <div className="px-6 py-10 text-center animate-fade-in">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-toxic/15 border border-toxic/30">
                <Check className="h-7 w-7 text-toxic-dim" />
              </div>
              <h3 className="text-lg font-bold text-bone">{t('upload.receivedTitle')}</h3>
              <p className="mt-2 text-sm text-bone/60 max-w-sm mx-auto">
                {t('upload.receivedBody', { title: form.title || t('upload.untitled') })}
              </p>
              <button
                onClick={onClose}
                className="mt-6 rounded-full border border-white/10 bg-coal px-6 py-2.5 text-sm font-bold text-bone/70 hover:text-bone hover:border-blood/30 transition-all"
              >
                {t('common.close')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className={LABEL_CLASS}>{t('upload.fieldTitle')}</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder={t('upload.titlePlaceholder')}
                  className={FIELD_CLASS}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>{t('upload.fieldDeveloper')}</label>
                <input
                  type="text"
                  required
                  value={form.developer}
                  onChange={(e) => setForm({ ...form, developer: e.target.value })}
                  placeholder={t('upload.developerPlaceholder')}
                  className={FIELD_CLASS}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLASS}>{t('upload.fieldGenre')}</label>
                  <select
                    value={form.genre}
                    onChange={(e) => setForm({ ...form, genre: e.target.value })}
                    className="w-full rounded-lg bg-coal border border-white/5 px-3 py-2.5 text-sm text-bone focus:outline-none focus:border-blood/30 transition-all"
                  >
                    <option value="Survival Horror">{t(GENRE_LABEL_KEYS['Survival Horror'])}</option>
                    <option value="Psicológico">{t(GENRE_LABEL_KEYS['Psicológico'])}</option>
                    <option value="Retro/Lo-fi">{t(GENRE_LABEL_KEYS['Retro/Lo-fi'])}</option>
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLASS}>{t('upload.fieldRating')}</label>
                  <select
                    value={form.ageRating}
                    onChange={(e) => setForm({ ...form, ageRating: e.target.value })}
                    className="w-full rounded-lg bg-coal border border-white/5 px-3 py-2.5 text-sm text-bone focus:outline-none focus:border-blood/30 transition-all"
                  >
                    <option value="+18">{t('upload.rating18')}</option>
                    <option value="+16">{t('upload.rating16')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={LABEL_CLASS}>{t('upload.fieldDescription')}</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder={t('upload.descriptionPlaceholder')}
                  className={`${FIELD_CLASS} resize-none`}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>{t('upload.fieldTags')}</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder={t('upload.tagsPlaceholder')}
                  className={FIELD_CLASS}
                />
              </div>

              {/* File upload placeholder */}
              <div className="rounded-lg border border-dashed border-white/10 bg-coal/40 p-4 text-center">
                <Upload className="h-6 w-6 mx-auto text-bone/30 mb-1" />
                <p className="text-xs text-bone/40">{t('upload.dropzone')}</p>
              </div>

              {/* Warning */}
              <div className="flex items-start gap-2 rounded-lg border border-blood/10 bg-blood/5 p-3">
                <AlertTriangle className="h-4 w-4 text-blood/60 shrink-0 mt-0.5" />
                <p className="text-xs text-bone/50">{t('upload.policy')}</p>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-full bg-blood px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-blood-dark glow-blood"
              >
                <Upload className="h-4 w-4" />
                {t('upload.submit')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
