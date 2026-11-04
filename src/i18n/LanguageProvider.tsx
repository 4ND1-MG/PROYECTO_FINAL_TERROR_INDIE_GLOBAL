import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { LanguageContext, type LanguageContextValue } from './languageContext';
import { LANGUAGE_OPTIONS, translations, type Language } from './translations';

const STORAGE_KEY = 'nocturne-language';
const DEFAULT_LANGUAGE: Language = 'es';

function readStoredLanguage(): Language {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return LANGUAGE_OPTIONS.find((option) => option.code === stored)?.code ?? DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(readStoredLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((next: Language) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    setLanguageState(next);
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t: (key, vars) => {
        const template = translations[language][key];
        if (!vars) return template;
        return Object.entries(vars).reduce(
          (text, [name, val]) => text.replace(`{${name}}`, String(val)),
          template,
        );
      },
    }),
    [language, setLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
