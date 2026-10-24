import { createContext, useContext, useState } from 'react';
import en from './en.json';

const translations = { en };

const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState('en');

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <I18nContext.Provider value={{ t, language, changeLanguage }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider');
  }
  return context;
}
