
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TRANSLATIONS } from '@/lib/types';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get language from localStorage or use 'en' as default
    const savedLang = localStorage.getItem('language');
    return (savedLang as Language) || 'en';
  });

  useEffect(() => {
    // Save language to localStorage whenever it changes
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function that navigates the nested TRANSLATIONS object
  // Example: t('serviceTypes.title') would return the title for the current language
  const t = (key: string): string => {
    try {
      const keys = key.split('.');
      let value: any = TRANSLATIONS[language];
      
      for (const k of keys) {
        if (!value[k]) return key; // Return the key if translation not found
        value = value[k];
      }
      
      return value;
    } catch (err) {
      console.error(`Translation error for key: ${key}`, err);
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
