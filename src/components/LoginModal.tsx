import { useState, type FormEvent } from 'react';
import { Lock, Mail, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/auth/useAuth';
import { AuthModalShell } from '@/components/auth/AuthModalShell';
import { AppleIcon, FacebookIcon, GoogleIcon } from '@/components/auth/BrandIcons';
import type { OAuthProvider } from '@/auth/authContext';
import { useLanguage } from '@/i18n/useLanguage';
import type { TranslationKey } from '@/i18n/translations';

export type AuthMode = 'login' | 'register';

interface EmailAuthFormProps {
  mode: AuthMode;
  onSuccess: () => void;
  onConfirmationSent: () => void;
}

const INPUT_CLASS =
  'w-full rounded-lg bg-coal border border-white/5 pl-10 pr-3 py-2.5 text-sm text-bone placeholder:text-bone/30 focus:outline-none focus:border-blood/40 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.12)] transition-all';

const LABEL_CLASS = 'block text-xs font-mono uppercase tracking-wider text-bone/50 mb-1.5';

export function EmailAuthForm({ mode, onSuccess, onConfirmationSent }: EmailAuthFormProps) {
  const { signInWithPassword, signUpWithPassword } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adultConfirmed, setAdultConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const isRegister = mode === 'register';

  const translateAuthError = (message: string) => {
    const m = message.toLowerCase();
    let key: TranslationKey = 'auth.errGeneric';
    if (m.includes('invalid login credentials')) key = 'auth.errInvalidCredentials';
    else if (m.includes('already registered')) key = 'auth.errAlreadyRegistered';
    else if (m.includes('email not confirmed')) key = 'auth.errEmailNotConfirmed';
    else if (m.includes('password') && m.includes('at least')) key = 'auth.errPasswordShort';
    else if (m.includes('rate limit') || m.includes('too many')) key = 'auth.errRateLimit';
    return t(key);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    if (isRegister && !adultConfirmed) {
      setError(t('auth.errAdult'));
      return;
    }

    setError(null);
    setSubmitting(true);
    const cleanEmail = email.trim();

    if (isRegister) {
      const result = await signUpWithPassword(cleanEmail, password);
      setSubmitting(false);
      if (result.error) {
        setError(translateAuthError(result.error));
        return;
      }
      if (result.needsConfirmation) {
        onConfirmationSent();
        return;
      }
      onSuccess();
      return;
    }

    const result = await signInWithPassword(cleanEmail, password);
    setSubmitting(false);
    if (result.error) {
      setError(translateAuthError(result.error));
      return;
    }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="auth-email" className={LABEL_CLASS}>{t('auth.email')}</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-bone/30" />
          <input
            id="auth-email"
            type="email"
            required
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            className={INPUT_CLASS}
          />
        </div>
      </div>

      <div>
        <label htmlFor="auth-password" className={LABEL_CLASS}>{t('auth.password')}</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-bone/30" />
          <input
            id="auth-password"
            type="password"
            required
            minLength={isRegister ? 6 : undefined}
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isRegister ? t('auth.passwordMin') : '••••••••'}
            className={INPUT_CLASS}
          />
        </div>
      </div>

      {isRegister && (
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={adultConfirmed}
            onChange={(e) => setAdultConfirmed(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-coal accent-red-600"
          />
          <span className="text-xs text-bone/60 leading-relaxed">{t('auth.adultConfirm')}</span>
        </label>
      )}

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-blood/25 bg-blood/10 px-3 py-2.5 animate-fade-in"
        >
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-blood" />
          <p className="text-sm text-bone/90">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-blood px-6 py-3 text-sm font-bold text-white transition-all hover:bg-blood-dark glow-blood hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {submitting ? t('auth.processing') : isRegister ? t('auth.registerTitle') : t('auth.enter')}
      </button>
    </form>
  );
}

interface LoginModalProps {
  initialMode?: AuthMode;
  onClose: () => void;
  onAuthenticated?: () => void;
}

const SOCIAL_PROVIDERS: {
  provider: OAuthProvider;
  labelKey: TranslationKey;
  className: string;
  Icon: typeof GoogleIcon;
}[] = [
  {
    provider: 'google',
    labelKey: 'auth.continueGoogle',
    className: 'bg-white text-neutral-800 hover:bg-neutral-100 border-white',
    Icon: GoogleIcon,
  },
  {
    provider: 'apple',
    labelKey: 'auth.continueApple',
    className: 'bg-black text-white hover:bg-neutral-900 border-white/15',
    Icon: AppleIcon,
  },
  {
    provider: 'facebook',
    labelKey: 'auth.continueFacebook',
    className: 'bg-[#1877F2] text-white hover:bg-[#166fe5] border-[#1877F2]',
    Icon: FacebookIcon,
  },
];

export function LoginModal({ initialMode = 'login', onClose, onAuthenticated }: LoginModalProps) {
  const { signInWithOAuth } = useAuth();
  const { t } = useLanguage();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [pendingProvider, setPendingProvider] = useState<OAuthProvider | null>(null);
  const [oauthError, setOauthError] = useState<string | null>(null);

  const handleOAuth = async (provider: OAuthProvider) => {
    setOauthError(null);
    setPendingProvider(provider);
    const { error } = await signInWithOAuth(provider);
    if (error) {
      setPendingProvider(null);
      setOauthError(t('auth.oauthUnavailable'));
    }
  };

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setOauthError(null);
  };

  const title = mode === 'login' ? t('auth.loginTitle') : t('auth.registerTitle');

  return (
    <AuthModalShell title={title} onClose={onClose}>
      {confirmationSent ? (
        <div className="px-6 py-10 text-center animate-fade-in">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blood/15 border border-blood/30">
            <ShieldCheck className="h-7 w-7 text-blood" />
          </div>
          <h3 className="text-lg font-bold text-bone">{t('auth.checkEmailTitle')}</h3>
          <p className="mt-2 text-sm text-bone/60 max-w-xs mx-auto">{t('auth.checkEmailBody')}</p>
          <button
            onClick={onClose}
            className="mt-6 rounded-full border border-white/10 bg-coal px-6 py-2.5 text-sm font-bold text-bone/70 hover:text-bone hover:border-blood/30 transition-all"
          >
            {t('auth.understood')}
          </button>
        </div>
      ) : (
        <div className="px-6 py-6 space-y-5">
          <div role="tablist" aria-label={t('auth.tabsLabel')} className="grid grid-cols-2 rounded-full bg-coal p-1 border border-white/5">
            {(['login', 'register'] as const).map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={mode === tab}
                onClick={() => switchMode(tab)}
                className={`rounded-full py-2 text-sm font-semibold transition-all duration-300 ${
                  mode === tab
                    ? 'bg-blood text-white shadow-[0_0_18px_rgba(220,38,38,0.35)]'
                    : 'text-bone/60 hover:text-bone'
                }`}
              >
                {tab === 'login' ? t('auth.loginTitle') : t('auth.registerTitle')}
              </button>
            ))}
          </div>

          <div className="space-y-2.5">
            {SOCIAL_PROVIDERS.map(({ provider, labelKey, className, Icon }) => (
              <button
                key={provider}
                type="button"
                onClick={() => handleOAuth(provider)}
                disabled={pendingProvider !== null}
                className={`flex w-full items-center justify-center gap-3 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0 ${className}`}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                {pendingProvider === provider ? t('auth.redirecting') : t(labelKey)}
              </button>
            ))}
          </div>

          {oauthError && (
            <p role="alert" className="text-xs text-center text-blood/90">{oauthError}</p>
          )}

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-white/10" />
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-bone/40">{t('auth.orEmail')}</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <EmailAuthForm
            key={mode}
            mode={mode}
            onSuccess={() => {
              onAuthenticated?.();
              onClose();
            }}
            onConfirmationSent={() => setConfirmationSent(true)}
          />

          <p className="text-center text-xs text-bone/50">
            {mode === 'login' ? t('auth.noAccount') : t('auth.haveAccount')}{' '}
            <button
              type="button"
              onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
              className="text-blood hover:text-blood/80 font-semibold underline underline-offset-2"
            >
              {mode === 'login' ? t('auth.registerLink') : t('auth.loginLink')}
            </button>
          </p>
        </div>
      )}
    </AuthModalShell>
  );
}
