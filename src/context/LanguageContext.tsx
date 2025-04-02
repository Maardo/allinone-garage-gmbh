import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TRANSLATIONS } from '@/lib/types';

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

export const translations = {
  en: {
    common: {
      appName: 'AutoWorkshop CRM',
      welcome: 'Welcome',
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      search: 'Search',
      filter: 'Filter',
      actions: 'Actions',
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Info'
    },
    navigation: {
      overview: 'Overview',
      calendar: 'Calendar',
      customers: 'Customers',
      loanerCars: 'Loaner Cars',
      serviceTypes: 'Service Types',
      settings: 'Settings'
    },
    pages: {
      overview: {
        title: 'Overview',
        subtitle: 'Welcome to your workshop dashboard'
      },
      dashboard: {
        title: 'Dashboard',
        subtitle: 'Overview of workshop operations'
      },
      calendar: {
        title: 'Calendar',
        subtitle: 'Schedule and manage appointments'
      },
      customers: {
        title: 'Customers',
        subtitle: 'Manage customer information'
      },
      loanerCars: {
        title: 'Loaner Cars',
        subtitle: 'Manage loaner car availability'
      },
      serviceTypes: {
        title: 'Service Types',
        subtitle: 'Manage available service types'
      },
      settings: {
        title: 'Settings',
        subtitle: 'Configure your workshop settings'
      },
      notFound: {
        title: '404 - Page Not Found',
        message: 'The page you are looking for does not exist',
        returnHome: 'Return to Dashboard'
      }
    },
    login: {
      title: 'Welcome to AutoWorkshop CRM',
      subtitle: 'Log in to manage your workshop',
      emailLabel: 'Email',
      passwordLabel: 'Password',
      loginButton: 'Log In',
      forgotPassword: 'Forgot Password?',
      demoAccess: 'Demo Access',
      loginError: 'Invalid email or password'
    },
    overview: {
      todayAppointments: 'Today\'s Appointments',
      weekAppointments: 'Week\'s Appointments',
      totalCustomers: 'Total Customers',
      completedJobs: 'Completed Jobs',
      upcomingJobs: 'Upcoming Jobs',
      serviceTypeDistribution: 'Service Type Distribution',
      week: 'Week',
      month: 'Month',
      appointments: 'Appointments'
    },
    serviceTypes: {
      maintenance: 'Maintenance',
      repair: 'Repair',
      inspection: 'Inspection',
      tireChange: 'Tire Change',
      other: 'Other'
    }
  },
  sv: {
    common: {
      appName: 'Bilverkstad CRM',
      welcome: 'Välkommen',
      loading: 'Laddar...',
      save: 'Spara',
      cancel: 'Avbryt',
      delete: 'Ta bort',
      edit: 'Redigera',
      search: 'Sök',
      filter: 'Filtrera',
      actions: 'Åtgärder',
      success: 'Lyckades',
      error: 'Fel',
      warning: 'Varning',
      info: 'Info'
    },
    navigation: {
      overview: 'Översikt',
      calendar: 'Kalender',
      customers: 'Kunder',
      loanerCars: 'Lånebil',
      serviceTypes: 'Tjänster',
      settings: 'Inställningar'
    },
    pages: {
      overview: {
        title: 'Översikt',
        subtitle: 'Välkommen till din verkstads dashboard'
      },
      dashboard: {
        title: 'Dashboard',
        subtitle: 'Översikt av verkstadens verksamhet'
      },
      calendar: {
        title: 'Kalender',
        subtitle: 'Schemalägg och hantera bokningar'
      },
      customers: {
        title: 'Kunder',
        subtitle: 'Hantera kundinformation'
      },
      loanerCars: {
        title: 'Lånebil',
        subtitle: 'Hantera tillgänglighet för lånebil'
      },
      serviceTypes: {
        title: 'Tjänster',
        subtitle: 'Hantera tillgängliga tjänstetyper'
      },
      settings: {
        title: 'Inställningar',
        subtitle: 'Konfigurera verkstadens inställningar'
      },
      notFound: {
        title: '404 - Sidan hittades inte',
        message: 'Sidan du letar efter finns inte',
        returnHome: 'Tillbaka till Dashboard'
      }
    },
    login: {
      title: 'Välkommen till Bilverkstad CRM',
      subtitle: 'Logga in för att hantera din verkstad',
      emailLabel: 'E-post',
      passwordLabel: 'Lösenord',
      loginButton: 'Logga In',
      forgotPassword: 'Glömt lösenord?',
      demoAccess: 'Demo-åtkomst',
      loginError: 'Ogiltig e-post eller lösenord'
    },
    overview: {
      todayAppointments: 'Dagens bokningar',
      weekAppointments: 'Veckans bokningar',
      totalCustomers: 'Totala kunder',
      completedJobs: 'Slutförda jobb',
      upcomingJobs: 'Kommande jobb',
      serviceTypeDistribution: 'Fördelning av tjänstetyper',
      week: 'Vecka',
      month: 'Månad',
      appointments: 'Bokningar'
    },
    serviceTypes: {
      maintenance: 'Underhåll',
      repair: 'Reparation',
      inspection: 'Inspektion',
      tireChange: 'Däckbyte',
      other: 'Övrigt'
    }
  },
  de: {
    common: {
      appName: 'Autowerkstatt CRM',
      welcome: 'Willkommen',
      loading: 'Wird geladen...',
      save: 'Speichern',
      cancel: 'Abbrechen',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      search: 'Suchen',
      filter: 'Filter',
      actions: 'Aktionen',
      success: 'Erfolg',
      error: 'Fehler',
      warning: 'Warnung',
      info: 'Info'
    },
    navigation: {
      overview: 'Übersicht',
      calendar: 'Kalender',
      customers: 'Kunden',
      loanerCars: 'Leihwagen',
      serviceTypes: 'Servicearten',
      settings: 'Einstellungen'
    },
    pages: {
      overview: {
        title: 'Übersicht',
        subtitle: 'Willkommen in Ihrem Werkstatt-Dashboard'
      },
      dashboard: {
        title: 'Dashboard',
        subtitle: 'Überblick über den Werkstattbetrieb'
      },
      calendar: {
        title: 'Kalender',
        subtitle: 'Termine planen und verwalten'
      },
      customers: {
        title: 'Kunden',
        subtitle: 'Kundendaten verwalten'
      },
      loanerCars: {
        title: 'Leihwagen',
        subtitle: 'Verfügbarkeit von Leihwagen verwalten'
      },
      serviceTypes: {
        title: 'Servicearten',
        subtitle: 'Verfügbare Servicearten verwalten'
      },
      settings: {
        title: 'Einstellungen',
        subtitle: 'Werkstatteinstellungen konfigurieren'
      },
      notFound: {
        title: '404 - Seite nicht gefunden',
        message: 'Die gesuchte Seite existiert nicht',
        returnHome: 'Zurück zum Dashboard'
      }
    },
    login: {
      title: 'Willkommen bei Autowerkstatt CRM',
      subtitle: 'Melden Sie sich an, um Ihre Werkstatt zu verwalten',
      emailLabel: 'E-Mail',
      passwordLabel: 'Passwort',
      loginButton: 'Anmelden',
      forgotPassword: 'Passwort vergessen?',
      demoAccess: 'Demo-Zugang',
      loginError: 'Ungültige E-Mail oder Passwort'
    },
    overview: {
      todayAppointments: 'Heutige Termine',
      weekAppointments: 'Termine diese Woche',
      totalCustomers: 'Gesamtkunden',
      completedJobs: 'Abgeschlossene Aufträge',
      upcomingJobs: 'Kommende Aufträge',
      serviceTypeDistribution: 'Verteilung der Servicearten',
      week: 'Woche',
      month: 'Monat',
      appointments: 'Termine'
    },
    serviceTypes: {
      maintenance: 'Wartung',
      repair: 'Reparatur',
      inspection: 'Inspektion',
      tireChange: 'Reifenwechsel',
      other: 'Sonstiges'
    }
  }
};

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
