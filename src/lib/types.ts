
export type UserRole = 'admin' | 'mechanic';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

export type ServiceType = 1 | 2 | 3 | 4 | 5;

export interface ServiceTypeInfo {
  id: ServiceType;
  name: string;
  description: string;
  color: string;
}

export const SERVICE_TYPES: Record<ServiceType, ServiceTypeInfo> = {
  1: {
    id: 1,
    name: 'Service',
    description: 'Regular maintenance service',
    color: '#0284c7' // bright blue, accessible
  },
  2: {
    id: 2,
    name: 'Repair',
    description: 'Mechanical repair',
    color: '#dc2626' // bright red, accessible
  },
  3: {
    id: 3,
    name: 'Inspection',
    description: 'Vehicle inspection',
    color: '#16a34a' // bright green, accessible
  },
  4: {
    id: 4,
    name: 'Diagnostic',
    description: 'Computer diagnostic',
    color: '#9333ea' // bright purple, accessible
  },
  5: {
    id: 5,
    name: 'Bodywork',
    description: 'Body repair',
    color: '#d97706' // bright amber, accessible
  }
};

export interface Appointment {
  id: string;
  date: Date;
  customerId: string;
  customerName: string;
  vehicleInfo: string;
  serviceType: ServiceType;
  notes: string;
  assignedMechanic?: string;
  loanerCarId?: string;
  isPaid: boolean;
  isCompleted: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  vehicles: Vehicle[];
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  license: string;
  vin: string;
}

export interface LoanerCar {
  id: string;
  name: string;
  license: string;
  isAvailable: boolean;
  assignedTo?: string;
  assignedUntil?: Date;
}

export type Language = 'en' | 'sv' | 'de';

export const LANGUAGES: Record<Language, string> = {
  en: 'English',
  sv: 'Svenska',
  de: 'Deutsch'
};

export const TRANSLATIONS = {
  en: {
    common: {
      appName: 'Allinone Garage',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      create: 'Create',
      submit: 'Submit',
      logout: 'Logout',
      loading: 'Loading...',
      search: 'Search',
      filter: 'Filter',
      actions: 'Actions',
      welcome: 'Welcome'
    },
    navigation: {
      overview: 'Overview',
      calendar: 'Calendar',
      customers: 'Customers',
      loanerCars: 'Loaner Cars',
      serviceTypes: 'Service Types',
      settings: 'Settings'
    },
    roles: {
      administrator: 'Administrator',
      mechanic: 'Mechanic'
    },
    login: {
      title: 'Workshop Manager',
      subtitle: 'Enter your credentials to access the system',
      email: 'Email',
      password: 'Password',
      signIn: 'Sign In',
      loggingIn: 'Logging in...',
      demoAccounts: 'Demo Accounts:',
      adminAccount: 'Admin: admin@workshop.com / admin123',
      mechanicAccount: 'Mechanic: mechanic1@workshop.com / mechanic123',
      successMessage: 'Login successful',
      invalidCredentials: 'Invalid email or password',
      failedMessage: 'Login failed'
    },
    overview: {
      todayAppointments: 'Today\'s Appointments',
      weekAppointments: 'Week\'s Appointments',
      totalCustomers: 'Total Customers',
      completedJobs: 'Completed Jobs',
      serviceTypeDistribution: 'Service Type Distribution',
      week: 'Week',
      month: 'Month',
      appointments: 'Appointments',
      upcomingAppointments: 'Upcoming Appointments'
    },
    serviceTypes: {
      maintenance: 'Maintenance',
      repair: 'Repair',
      inspection: 'Inspection',
      tireChange: 'Tire Change',
      other: 'Other',
      title: 'Service Types',
      subtitle: 'Manage and configure service categories',
      description: 'Service types are used for categorizing workshop jobs in the calendar',
      new: 'New Service Type',
      edit: 'Edit Service Type',
      createNew: 'Create New Service Type',
      name: 'Name',
      desc: 'Description',
      color: 'Color',
      about: 'About this service type',
      code: 'Code',
      calendarColor: 'Calendar Color',
      update: 'Update',
      create: 'Create'
    },
    pages: {
      overview: {
        title: 'Overview',
        subtitle: 'Welcome to your workshop dashboard'
      },
      dashboard: {
        title: 'Dashboard',
        subtitle: 'Overview of garage operations'
      },
      calendar: {
        title: 'Calendar',
        subtitle: 'Manage appointments and schedule'
      },
      customers: {
        title: 'Customers',
        subtitle: 'Manage customer information and vehicles'
      },
      loanerCars: {
        title: 'Loaner Cars',
        subtitle: 'Manage loaner car inventory and assignments'
      },
      serviceTypes: {
        title: 'Service Types',
        subtitle: 'Manage and configure service categories'
      },
      settings: {
        title: 'Settings',
        subtitle: 'Configure system settings'
      },
      notFound: {
        title: '404',
        message: 'Oops! Page not found',
        returnHome: 'Return to Home'
      }
    }
  },
  sv: {
    common: {
      appName: 'Allinone Verkstad',
      save: 'Spara',
      cancel: 'Avbryt',
      edit: 'Redigera',
      delete: 'Radera',
      create: 'Skapa',
      submit: 'Skicka',
      logout: 'Logga ut',
      loading: 'Laddar...',
      search: 'Sök',
      filter: 'Filtrera',
      actions: 'Åtgärder',
      welcome: 'Välkommen'
    },
    navigation: {
      overview: 'Översikt',
      calendar: 'Kalender',
      customers: 'Kunder',
      loanerCars: 'Lånebil',
      serviceTypes: 'Servicetyper',
      settings: 'Inställningar'
    },
    roles: {
      administrator: 'Administratör',
      mechanic: 'Mekaniker'
    },
    login: {
      title: 'Verkstadshanterare',
      subtitle: 'Ange dina uppgifter för att komma åt systemet',
      email: 'E-post',
      password: 'Lösenord',
      signIn: 'Logga in',
      loggingIn: 'Loggar in...',
      demoAccounts: 'Demokonton:',
      adminAccount: 'Admin: admin@workshop.com / admin123',
      mechanicAccount: 'Mekaniker: mechanic1@workshop.com / mechanic123',
      successMessage: 'Inloggning lyckades',
      invalidCredentials: 'Ogiltig e-post eller lösenord',
      failedMessage: 'Inloggning misslyckades'
    },
    overview: {
      todayAppointments: 'Dagens bokningar',
      weekAppointments: 'Veckans bokningar',
      totalCustomers: 'Totala kunder',
      completedJobs: 'Totala jobb',
      serviceTypeDistribution: 'Fördelning av tjänstetyper',
      week: 'Vecka',
      month: 'Månad',
      appointments: 'Bokningar',
      upcomingAppointments: 'Kommande bokningar'
    },
    serviceTypes: {
      maintenance: 'Underhåll',
      repair: 'Reparation',
      inspection: 'Inspektion',
      tireChange: 'Däckbyte',
      other: 'Övrigt',
      title: 'Servicetyper',
      subtitle: 'Hantera och konfigurera servicekategorier',
      description: 'Servicetyper används för att kategorisera verkstadsjobb i kalendern',
      new: 'Ny Servicetyp',
      edit: 'Redigera Servicetyp',
      createNew: 'Skapa Ny Servicetyp',
      name: 'Namn',
      desc: 'Beskrivning',
      color: 'Färg',
      about: 'Om denna servicetyp',
      code: 'Kod',
      calendarColor: 'Kalenderfärg',
      update: 'Uppdatera',
      create: 'Skapa'
    },
    pages: {
      overview: {
        title: 'Översikt',
        subtitle: 'Välkommen till din verkstads dashboard'
      },
      dashboard: {
        title: 'Dashboard',
        subtitle: 'Översikt över verkstadens verksamhet'
      },
      calendar: {
        title: 'Kalender',
        subtitle: 'Hantera bokningar och schema'
      },
      customers: {
        title: 'Kunder',
        subtitle: 'Hantera kundinformation och fordon'
      },
      loanerCars: {
        title: 'Lånebil',
        subtitle: 'Hantera lånebilsinventarier och tilldelningar'
      },
      serviceTypes: {
        title: 'Servicetyper',
        subtitle: 'Hantera och konfigurera servicekategorier'
      },
      settings: {
        title: 'Inställningar',
        subtitle: 'Konfigurera systeminställningar'
      },
      notFound: {
        title: '404',
        message: 'Hoppsan! Sidan hittades inte',
        returnHome: 'Återgå till startsidan'
      }
    }
  },
  de: {
    common: {
      appName: 'Allinone Werkstatt',
      save: 'Speichern',
      cancel: 'Abbrechen',
      edit: 'Bearbeiten',
      delete: 'Löschen',
      create: 'Erstellen',
      submit: 'Absenden',
      logout: 'Abmelden',
      loading: 'Lädt...',
      search: 'Suchen',
      filter: 'Filtern',
      actions: 'Aktionen',
      welcome: 'Willkommen'
    },
    navigation: {
      overview: 'Übersicht',
      calendar: 'Kalender',
      customers: 'Kunden',
      loanerCars: 'Leihwagen',
      serviceTypes: 'Service-Typen',
      settings: 'Einstellungen'
    },
    roles: {
      administrator: 'Administrator',
      mechanic: 'Mechaniker'
    },
    login: {
      title: 'Werkstattverwaltung',
      subtitle: 'Geben Sie Ihre Anmeldedaten ein, um auf das System zuzugreifen',
      email: 'E-Mail',
      password: 'Passwort',
      signIn: 'Anmelden',
      loggingIn: 'Anmeldung läuft...',
      demoAccounts: 'Demo-Konten:',
      adminAccount: 'Admin: admin@workshop.com / admin123',
      mechanicAccount: 'Mechaniker: mechanic1@workshop.com / mechanic123',
      successMessage: 'Anmeldung erfolgreich',
      invalidCredentials: 'Ungültige E-Mail oder Passwort',
      failedMessage: 'Anmeldung fehlgeschlagen'
    },
    overview: {
      todayAppointments: 'Heutige Termine',
      weekAppointments: 'Wöchentliche Termine',
      totalCustomers: 'Gesamtkunden',
      completedJobs: 'Abgeschlossene Aufträge',
      serviceTypeDistribution: 'Verteilung der Servicetypen',
      week: 'Woche',
      month: 'Monat',
      appointments: 'Termine',
      upcomingAppointments: 'Kommende Termine'
    },
    serviceTypes: {
      maintenance: 'Wartung',
      repair: 'Reparatur',
      inspection: 'Inspektion',
      tireChange: 'Reifenwechsel',
      other: 'Sonstiges',
      title: 'Service-Typen',
      subtitle: 'Verwalten und konfigurieren Sie Servicekategorien',
      description: 'Service-Typen werden zur Kategorisierung von Werkstattarbeiten im Kalender verwendet',
      new: 'Neue Service-Type',
      edit: 'Service-Type bearbeiten',
      createNew: 'Neue Service-Type erstellen',
      name: 'Name',
      desc: 'Beschreibung',
      color: 'Farbe',
      about: 'Über diesen Service-Typ',
      code: 'Code',
      calendarColor: 'Kalenderfarbe',
      update: 'Aktualisieren',
      create: 'Erstellen'
    },
    pages: {
      overview: {
        title: 'Übersicht',
        subtitle: 'Willkommen zu Ihrem Werkstatt-Dashboard'
      },
      dashboard: {
        title: 'Dashboard',
        subtitle: 'Überblick über die Werkstattoperationen'
      },
      calendar: {
        title: 'Kalender',
        subtitle: 'Termine und Zeitplan verwalten'
      },
      customers: {
        title: 'Kunden',
        subtitle: 'Kundeninformationen und Fahrzeuge verwalten'
      },
      loanerCars: {
        title: 'Leihwagen',
        subtitle: 'Leihwagenbestand und Zuweisungen verwalten'
      },
      serviceTypes: {
        title: 'Service-Typen',
        subtitle: 'Servicekategorien verwalten und konfigurieren'
      },
      settings: {
        title: 'Einstellungen',
        subtitle: 'Systemeinstellungen konfigurieren'
      },
      notFound: {
        title: '404',
        message: 'Hoppla! Seite nicht gefunden',
        returnHome: 'Zurück zur Startseite'
      }
    }
  }
};
