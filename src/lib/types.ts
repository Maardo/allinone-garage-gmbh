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
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: {
    street: string;
    zipCode: string;
    city: string;
  };
  vehicleInfo: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleLicense?: string;
  vehicleVin?: string;
  vehicleCarId?: string;
  serviceType: 1 | 2 | 3 | 4 | 5;
  notes: string;
  isPaid: boolean;
  isCompleted: boolean;
  loanerCarId?: string;
}

export interface Address {
  street: string;
  zipCode: string;
  city: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  address?: Address;
  vehicles: Vehicle[];
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  license: string;
  vin: string;
  carId: string;
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
  de: 'Deutsch',
};

export const TRANSLATIONS: Record<Language, Record<string, any>> = {
  en: {
    navigation: {
      dashboard: 'Dashboard',
      calendar: 'Calendar',
      customers: 'Customers',
      serviceTypes: 'Service Types',
      loanerCars: 'Loaner Cars',
      settings: 'Settings',
      logout: 'Logout',
    },
    dashboard: {
      welcome: 'Welcome back',
      summary: 'Here\'s a summary of your workshop',
      todayAppointments: 'Today\'s Appointments',
      upcomingServices: 'Upcoming Services',
      quickActions: 'Quick Actions',
      createAppointment: 'Create Appointment',
      addCustomer: 'Add Customer',
      viewCalendar: 'View Calendar',
      recentCustomers: 'Recent Customers',
      statistics: 'Statistics',
      appointmentsCompleted: 'Appointments completed this month',
      averageServiceTime: 'Average service time',
    },
    calendar: {
      today: 'Today',
      month: 'Month',
      week: 'Week',
      day: 'Day',
      newAppointment: 'New Appointment',
    },
    loanerCar: {
      manageSubtitle: 'Manage your fleet of loaner vehicles',
      availableCars: 'Available Cars',
      addNew: 'Add New Car',
      available: 'Available',
      readyToBeAssigned: 'Ready to be assigned to a customer',
      loanedOut: 'Loaned Out',
      currentlyAssigned: 'Currently assigned to a customer',
      licensePlate: 'License Plate',
      assignedTo: 'Assigned To',
      returnDate: 'Return Date',
      overdue: 'Overdue - Should have been returned',
      assignToCustomer: 'Assign to Customer',
      markAsReturned: 'Mark as Returned',
      deleteTitle: 'Delete Loaner Car',
      deleteConfirmation: 'Are you sure you want to delete this loaner car? This action cannot be undone.',
      editTitle: 'Edit Loaner Car',
      carName: 'Car Model',
      carNamePlaceholder: 'e.g. Volvo V60',
      licensePlatePlaceholder: 'e.g. ABC123',
      assignLoanerCar: 'Assign Loaner Car',
      car: 'Car',
      customer: 'Customer',
      selectCustomer: 'Select a customer',
      assignCar: 'Assign Car',
      assigned: 'Car Assigned',
      assignedDescription: 'The car has been successfully assigned to the customer',
      returned: 'Car Returned',
      returnedDescription: 'The car has been marked as returned and is now available',
      added: 'Car Added',
      addedDescription: 'The new car has been added to your fleet',
      updated: 'Car Updated',
      updatedDescription: 'The car details have been updated',
      deleted: 'Car Deleted',
      deletedDescription: 'The car has been removed from your fleet'
    },
    actions: {
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      confirmDelete: 'Yes, Delete'
    }
  },
  sv: {
    navigation: {
      dashboard: 'Översikt',
      calendar: 'Kalender',
      customers: 'Kunder',
      serviceTypes: 'Servicetyper',
      loanerCars: 'Lånebilsflotta',
      settings: 'Inställningar',
      logout: 'Logga ut',
    },
    dashboard: {
      welcome: 'Välkommen tillbaka',
      summary: 'Här är en sammanfattning av din verkstad',
      todayAppointments: 'Dagens Bokningar',
      upcomingServices: 'Kommande Service',
      quickActions: 'Snabbåtgärder',
      createAppointment: 'Skapa Bokning',
      addCustomer: 'Lägg till Kund',
      viewCalendar: 'Visa Kalender',
      recentCustomers: 'Senaste Kunderna',
      statistics: 'Statistik',
      appointmentsCompleted: 'Utförda bokningar denna månad',
      averageServiceTime: 'Genomsnittlig servicetid',
    },
    calendar: {
      today: 'Idag',
      month: 'Månad',
      week: 'Vecka',
      day: 'Dag',
      newAppointment: 'Ny Bokning',
    },
    loanerCar: {
      manageSubtitle: 'Hantera din flotta av lånebilar',
      availableCars: 'Tillgängliga Bilar',
      addNew: 'Lägg Till Bil',
      available: 'Tillgänglig',
      readyToBeAssigned: 'Redo att tilldelas till en kund',
      loanedOut: 'Utlånad',
      currentlyAssigned: 'För närvarande tilldelad till en kund',
      licensePlate: 'Registreringsnummer',
      assignedTo: 'Tilldelad Till',
      returnDate: 'Återlämningsdatum',
      overdue: 'Försenad - Borde ha återlämnats',
      assignToCustomer: 'Tilldela till Kund',
      markAsReturned: 'Markera som Återlämnad',
      deleteTitle: 'Ta Bort Lånebil',
      deleteConfirmation: 'Är du säker på att du vill ta bort denna lånebil? Denna åtgärd kan inte ångras.',
      editTitle: 'Redigera Lånebil',
      carName: 'Bilmodell',
      carNamePlaceholder: 't.ex. Volvo V60',
      licensePlatePlaceholder: 't.ex. ABC123',
      assignLoanerCar: 'Tilldela Lånebil',
      car: 'Bil',
      customer: 'Kund',
      selectCustomer: 'Välj en kund',
      assignCar: 'Tilldela Bil',
      assigned: 'Bil Tilldelad',
      assignedDescription: 'Bilen har framgångsrikt tilldelats kunden',
      returned: 'Bil Återlämnad',
      returnedDescription: 'Bilen har markerats som återlämnad och är nu tillgänglig',
      added: 'Bil Tillagd',
      addedDescription: 'Den nya bilen har lagts till i din flotta',
      updated: 'Bil Uppdaterad',
      updatedDescription: 'Bilens uppgifter har uppdaterats',
      deleted: 'Bil Borttagen',
      deletedDescription: 'Bilen har tagits bort från din flotta'
    },
    actions: {
      save: 'Spara',
      cancel: 'Avbryt',
      edit: 'Redigera',
      delete: 'Ta Bort',
      confirmDelete: 'Ja, Ta Bort'
    }
  },
  de: {
    navigation: {
      dashboard: 'Dashboard',
      calendar: 'Kalender',
      customers: 'Kunden',
      serviceTypes: 'Servicetypen',
      loanerCars: 'Leihwagen',
      settings: 'Einstellungen',
      logout: 'Abmelden',
    },
    dashboard: {
      welcome: 'Willkommen zurück',
      summary: 'Hier ist eine Zusammenfassung Ihrer Werkstatt',
      todayAppointments: 'Heutige Termine',
      upcomingServices: 'Bevorstehende Services',
      quickActions: 'Schnellaktionen',
      createAppointment: 'Termin erstellen',
      addCustomer: 'Kunde hinzufügen',
      viewCalendar: 'Kalender anzeigen',
      recentCustomers: 'Neueste Kunden',
      statistics: 'Statistiken',
      appointmentsCompleted: 'Erledigte Termine diesen Monat',
      averageServiceTime: 'Durchschnittliche Servicezeit',
    },
    calendar: {
      today: 'Heute',
      month: 'Monat',
      week: 'Woche',
      day: 'Tag',
      newAppointment: 'Neuer Termin',
    },
    loanerCar: {
      manageSubtitle: 'Verwalten Sie Ihre Leihwagenflotte',
      availableCars: 'Verfügbare Autos',
      addNew: 'Auto Hinzufügen',
      available: 'Verfügbar',
      readyToBeAssigned: 'Bereit für die Zuweisung an einen Kunden',
      loanedOut: 'Ausgeliehen',
      currentlyAssigned: 'Derzeit einem Kunden zugewiesen',
      licensePlate: 'Kennzeichen',
      assignedTo: 'Zugewiesen an',
      returnDate: 'Rückgabedatum',
      overdue: 'Überfällig - Hätte zurückgegeben werden sollen',
      assignToCustomer: 'Kunden zuweisen',
      markAsReturned: 'Als zurückgegeben markieren',
      deleteTitle: 'Leihwagen löschen',
      deleteConfirmation: 'Sind Sie sicher, dass Sie diesen Leihwagen löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',
      editTitle: 'Leihwagen bearbeiten',
      carName: 'Automodell',
      carNamePlaceholder: 'z.B. Volvo V60',
      licensePlatePlaceholder: 'z.B. ABC123',
      assignLoanerCar: 'Leihwagen zuweisen',
      car: 'Auto',
      customer: 'Kunde',
      selectCustomer: 'Wählen Sie einen Kunden',
      assignCar: 'Auto zuweisen',
      assigned: 'Auto zugewiesen',
      assignedDescription: 'Das Auto wurde erfolgreich dem Kunden zugewiesen',
      returned: 'Auto zurückgegeben',
      returnedDescription: 'Das Auto wurde als zurückgegeben markiert und ist jetzt verfügbar',
      added: 'Auto hinzugefügt',
      addedDescription: 'Das neue Auto wurde zu Ihrer Flotte hinzugefügt',
      updated: 'Auto aktualisiert',
      updatedDescription: 'Die Autodaten wurden aktualisiert',
      deleted: 'Auto gelöscht',
      deletedDescription: 'Das Auto wurde aus Ihrer Flotte entfernt'
    },
    actions: {
      save: 'Speichern',
      cancel: 'Abbrechen',
      edit: 'Bearbeiten',
      delete: 'Löschen',
      confirmDelete: 'Ja, Löschen'
    }
  }
};
