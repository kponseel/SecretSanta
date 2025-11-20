import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { DICTIONARY } from '../constants';

interface I18nContextProps {
  locale: Language;
  setLocale: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('sso_locale');
    if (saved && (saved === 'en' || saved === 'fr' || saved === 'es')) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (lang: Language) => {
    setLocaleState(lang);
    localStorage.setItem('sso_locale', lang);
  };

  const t = (key: string, params?: Record<string, string>): string => {
    let text = DICTIONARY[locale][key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, v);
      });
    }
    return text;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useTranslation must be used within I18nProvider");
  return context;
};
