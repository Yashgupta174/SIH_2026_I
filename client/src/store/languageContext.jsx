import React, { createContext, useContext, useState } from 'react';
import en from '../locales/en.json';
import hi from '../locales/hi.json';

const LanguageContext = createContext();

const locales = { en, hi };

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('hi'); // Default Hindi for Indian Hospital Kiosks

  const t = (key) => {
    return locales[language]?.[key] || locales['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
