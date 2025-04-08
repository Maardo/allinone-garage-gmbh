
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '@/lib/types';
import { TRANSLATIONS } from '@/lib/translations';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'sv', label: 'Svenska' },
  { value: 'de', label: 'Deutsch' }
];

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    // Default language is now Swedish
    const savedLang = localStorage.getItem('language');
    return (savedLang as Language) || 'sv';
  });

  useEffect(() => {
    // Save language to localStorage whenever it changes
    localStorage.setItem('language', language);
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  // Translation function that navigates the nested TRANSLATIONS object
  const t = (key: string): string => {
    try {
      const keys = key.split('.');
      let value: any = TRANSLATIONS[language];
      
      for (const k of keys) {
        if (!value || !value[k]) {
          // If the translation is missing, fall back to English, then to the key itself
          if (language !== 'en') {
            const enValue = getTranslation(key, 'en');
            if (enValue !== key) return enValue;
          }
          console.warn(`Translation missing for key: ${key} in language: ${language}`);
          return key; // Return the key if translation not found
        }
        value = value[k];
      }
      
      return value;
    } catch (err) {
      console.error(`Translation error for key: ${key}`, err);
      return key;
    }
  };

  // Helper function to try getting a translation in a specific language
  const getTranslation = (key: string, lang: Language): string => {
    try {
      const keys = key.split('.');
      let value: any = TRANSLATIONS[lang];
      
      for (const k of keys) {
        if (!value || !value[k]) {
          return key;
        }
        value = value[k];
      }
      
      return value;
    } catch {
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
