import { createContext, useContext } from 'react';
import en from './en.json';

const translations = { en };

const I18nContext = createContext();

export function I18nProvider({ children }) {
  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations.en;
    for (const k of keys) {
      value = value?.[k];
    }

    if (!value) return key;

    // Replace placeholders like {name} with actual values
    return value.replace(/\{(\w+)\}/g, (match, param) => {
      return params[param] || match;
    });
  };

  return (
    <I18nContext.Provider value={{ t }}>
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
