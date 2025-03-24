
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
    color: 'blue'
  },
  2: {
    id: 2,
    name: 'Repair',
    description: 'Mechanical repair',
    color: 'red'
  },
  3: {
    id: 3,
    name: 'Inspection',
    description: 'Vehicle inspection',
    color: 'green'
  },
  4: {
    id: 4,
    name: 'Diagnostic',
    description: 'Computer diagnostic',
    color: 'purple'
  },
  5: {
    id: 5,
    name: 'Bodywork',
    description: 'Body repair',
    color: 'amber'
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
    serviceTypes: {
      title: 'Service Types',
      subtitle: 'Manage and configure service categories',
      description: 'Service types are used for categorizing workshop jobs in the calendar',
      new: 'New Service Type',
      edit: 'Edit Service Type',
      create: 'Create New Service Type',
      name: 'Name',
      desc: 'Description',
      color: 'Color',
      about: 'About this service type',
      code: 'Code',
      calendarColor: 'Calendar Color',
      update: 'Update',
      create: 'Create'
    }
  },
  sv: {
    serviceTypes: {
      title: 'Servicetyper',
      subtitle: 'Hantera och konfigurera servicekategorier',
      description: 'Servicetyper används för att kategorisera verkstadsjobb i kalendern',
      new: 'Ny Servicetyp',
      edit: 'Redigera Servicetyp',
      create: 'Skapa Ny Servicetyp',
      name: 'Namn',
      desc: 'Beskrivning',
      color: 'Färg',
      about: 'Om denna servicetyp',
      code: 'Kod',
      calendarColor: 'Kalenderfärg',
      update: 'Uppdatera',
      create: 'Skapa'
    }
  },
  de: {
    serviceTypes: {
      title: 'Service-Typen',
      subtitle: 'Verwalten und konfigurieren Sie Servicekategorien',
      description: 'Service-Typen werden zur Kategorisierung von Werkstattarbeiten im Kalender verwendet',
      new: 'Neue Service-Type',
      edit: 'Service-Type bearbeiten',
      create: 'Neue Service-Type erstellen',
      name: 'Name',
      desc: 'Beschreibung',
      color: 'Farbe',
      about: 'Über diesen Service-Typ',
      code: 'Code',
      calendarColor: 'Kalenderfarbe',
      update: 'Aktualisieren',
      create: 'Erstellen'
    }
  }
};
