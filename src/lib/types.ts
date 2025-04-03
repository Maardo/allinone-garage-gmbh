
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
      appointments: 'Appointments',
      upcomingAppointments: 'Upcoming Appointments'
    },
    calendar: {
      day: 'Day',
      week: 'Week',
      month: 'Month',
      today: 'Today',
      new: 'New',
      previous: 'Previous',
      next: 'Next'
    },
    appointment: {
      newAppointment: 'New Appointment',
      editAppointment: 'Edit Appointment',
      customerName: 'Customer Name',
      customerNamePlaceholder: 'Customer name',
      vehicleInfo: 'Vehicle Information',
      vehicleInfoPlaceholder: 'Make, model, registration',
      date: 'Date',
      pickDate: 'Pick a date',
      time: 'Time',
      serviceType: 'Service Type',
      selectServiceType: 'Select service type',
      notes: 'Notes',
      notesPlaceholder: 'Additional notes about the appointment',
      paid: 'Paid',
      unpaid: 'Unpaid',
      completed: 'Completed',
      inProgress: 'In Progress',
      createAppointment: 'Create Appointment',
      updateAppointment: 'Update Appointment'
    },
    customer: {
      details: 'Customer Details',
      info: 'Customer Info',
      vehiclesTab: 'Vehicles',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      notes: 'Notes',
      notProvided: 'Not provided',
      noNotes: 'No notes added for this customer',
      noVehicles: 'No vehicles registered for this customer',
      vehicle: 'vehicle',
      vehicles: 'vehicles'
    },
    vehicle: {
      year: 'Year',
      license: 'License Plate',
      vin: 'VIN'
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
      appointments: 'Bokningar',
      upcomingAppointments: 'Kommande bokningar'
    },
    calendar: {
      day: 'Dag',
      week: 'Vecka',
      month: 'Månad',
      today: 'Idag',
      new: 'Ny',
      previous: 'Föregående',
      next: 'Nästa'
    },
    appointment: {
      newAppointment: 'Ny Bokning',
      editAppointment: 'Redigera Bokning',
      customerName: 'Kundnamn',
      customerNamePlaceholder: 'Kundens namn',
      vehicleInfo: 'Fordonsinformation',
      vehicleInfoPlaceholder: 'Märke, modell, registreringsnummer',
      date: 'Datum',
      pickDate: 'Välj ett datum',
      time: 'Tid',
      serviceType: 'Servicetyp',
      selectServiceType: 'Välj servicetyp',
      notes: 'Anteckningar',
      notesPlaceholder: 'Ytterligare anteckningar om bokningen',
      paid: 'Betald',
      unpaid: 'Obetald',
      completed: 'Slutförd',
      inProgress: 'Pågående',
      createAppointment: 'Skapa Bokning',
      updateAppointment: 'Uppdatera Bokning'
    },
    customer: {
      details: 'Kunddetaljer',
      info: 'Kundinformation',
      vehiclesTab: 'Fordon',
      name: 'Namn',
      email: 'E-post',
      phone: 'Telefon',
      notes: 'Anteckningar',
      notProvided: 'Ej angivet',
      noNotes: 'Inga anteckningar tillagda för denna kund',
      noVehicles: 'Inga fordon registrerade för denna kund',
      vehicle: 'fordon',
      vehicles: 'fordon'
    },
    vehicle: {
      year: 'År',
      license: 'Registreringsnummer',
      vin: 'Chassinummer'
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
      appointments: 'Termine',
      upcomingAppointments: 'Kommende Termine'
    },
    calendar: {
      day: 'Tag',
      week: 'Woche',
      month: 'Monat',
      today: 'Heute',
      new: 'Neu',
      previous: 'Vorherige',
      next: 'Nächste'
    },
    appointment: {
      newAppointment: 'Neuer Termin',
      editAppointment: 'Termin bearbeiten',
      customerName: 'Kundenname',
      customerNamePlaceholder: 'Name des Kunden',
      vehicleInfo: 'Fahrzeuginformationen',
      vehicleInfoPlaceholder: 'Marke, Modell, Kennzeichen',
      date: 'Datum',
      pickDate: 'Datum auswählen',
      time: 'Uhrzeit',
      serviceType: 'Service-Typ',
      selectServiceType: 'Service-Typ auswählen',
      notes: 'Notizen',
      notesPlaceholder: 'Zusätzliche Notizen zum Termin',
      paid: 'Bezahlt',
      unpaid: 'Unbezahlt',
      completed: 'Abgeschlossen',
      inProgress: 'In Bearbeitung',
      createAppointment: 'Termin erstellen',
      updateAppointment: 'Termin aktualisieren'
    },
    customer: {
      details: 'Kundendetails',
      info: 'Kundeninformationen',
      vehiclesTab: 'Fahrzeuge',
      name: 'Name',
      email: 'E-Mail',
      phone: 'Telefon',
      notes: 'Notizen',
      notProvided: 'Nicht angegeben',
      noNotes: 'Keine Notizen für diesen Kunden hinzugefügt',
      noVehicles: 'Keine Fahrzeuge für diesen Kunden registriert',
      vehicle: 'Fahrzeug',
      vehicles: 'Fahrzeuge'
    },
    vehicle: {
      year: 'Jahr',
      license: 'Kennzeichen',
      vin: 'Fahrgestellnummer'
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
