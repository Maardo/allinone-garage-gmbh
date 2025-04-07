
import { Language } from "./types";

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
      overview: 'Overview',
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
      pendingPayments: 'Pending Payments',
      availableLoanerCars: 'Available Loaner Cars',
      completedToday: 'Completed Today',
      todaySchedule: 'Today\'s Schedule',
      upcomingAppointmentsToday: 'Upcoming appointments for today',
      fullCalendar: 'Full Calendar',
      noAppointments: 'No appointments scheduled for today',
      schedule: 'Schedule',
      paymentRecords: 'Payment Records',
      commonTasks: 'Common tasks and shortcuts'
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
      startDate: 'Start Date',
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
    },
    common: {
      appName: 'Allinone Garage',
      loading: 'Loading...',
      welcome: 'Welcome'
    },
    roles: {
      administrator: 'Administrator',
      mechanic: 'Mechanic'
    },
    overview: {
      todayAppointments: 'Today\'s Appointments',
      weekAppointments: 'This Week\'s Appointments',
      totalCustomers: 'Total Customers',
      completedJobs: 'Completed Jobs',
      upcomingAppointments: 'Upcoming Appointments',
      appointments: 'Appointments'
    },
    pages: {
      overview: {
        title: 'Overview',
        subtitle: 'Summary of your workshop activities'
      },
      calendar: {
        title: 'Calendar',
        subtitle: 'Schedule and manage appointments'
      },
      customers: {
        title: 'Customers',
        subtitle: 'Manage your customer database'
      },
      loanerCars: {
        title: 'Loaner Cars',
        subtitle: 'Manage your fleet of loaner vehicles'
      },
      serviceTypes: {
        title: 'Service Types',
        subtitle: 'Configure service offerings and pricing'
      },
      settings: {
        title: 'Settings',
        subtitle: 'Configure your workshop settings'
      },
      notFound: {
        title: 'Page Not Found',
        message: 'The page you are looking for does not exist.',
        returnHome: 'Return to Home'
      }
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
    navigation: {
      dashboard: 'Dashboard',
      calendar: 'Kalender',
      customers: 'Kunder',
      serviceTypes: 'Servicetyper',
      loanerCars: 'Lånebilar',
      settings: 'Inställningar',
      logout: 'Logga ut',
      overview: 'Översikt',
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
      pendingPayments: 'Väntande Betalningar',
      availableLoanerCars: 'Tillgängliga Lånebilar',
      completedToday: 'Slutförda Idag',
      todaySchedule: 'Dagens Schema',
      upcomingAppointmentsToday: 'Kommande bokningar för idag',
      fullCalendar: 'Fullständig Kalender',
      noAppointments: 'Inga bokningar schemalagda för idag',
      schedule: 'Schema',
      paymentRecords: 'Betalningshistorik',
      commonTasks: 'Vanliga uppgifter och genvägar'
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
      startDate: 'Startdatum',
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
    },
    common: {
      appName: 'Allinone Garage',
      loading: 'Laddar...',
      welcome: 'Välkommen'
    },
    roles: {
      administrator: 'Administratör',
      mechanic: 'Mekaniker'
    },
    overview: {
      todayAppointments: 'Dagens Bokningar',
      weekAppointments: 'Veckans Bokningar',
      totalCustomers: 'Totalt Antal Kunder',
      completedJobs: 'Utförda Arbeten',
      upcomingAppointments: 'Kommande Bokningar',
      appointments: 'Bokningar'
    },
    pages: {
      overview: {
        title: 'Översikt',
        subtitle: 'Sammanfattning av verkstadsaktiviteter'
      },
      calendar: {
        title: 'Kalender',
        subtitle: 'Planera och hantera bokningar'
      },
      customers: {
        title: 'Kunder',
        subtitle: 'Hantera din kunddatabas'
      },
      loanerCars: {
        title: 'Lånebilar',
        subtitle: 'Hantera din flotta av lånebilar'
      },
      serviceTypes: {
        title: 'Servicetyper',
        subtitle: 'Konfigurera serviceerbjudanden och prissättning'
      },
      settings: {
        title: 'Inställningar',
        subtitle: 'Konfigurera dina verkstadsinställningar'
      },
      notFound: {
        title: 'Sidan Hittades Inte',
        message: 'Sidan du letar efter finns inte.',
        returnHome: 'Återgå till Startsidan'
      }
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
    navigation: {
      dashboard: 'Dashboard',
      calendar: 'Kalender',
      customers: 'Kunden',
      serviceTypes: 'Servicetypen',
      loanerCars: 'Leihwagen',
      settings: 'Einstellungen',
      logout: 'Abmelden',
      overview: 'Übersicht',
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
      pendingPayments: 'Ausstehende Zahlungen',
      availableLoanerCars: 'Verfügbare Leihwagen',
      completedToday: 'Heute Abgeschlossen',
      todaySchedule: 'Heutiger Zeitplan',
      upcomingAppointmentsToday: 'Bevorstehende Termine für heute',
      fullCalendar: 'Vollständiger Kalender',
      noAppointments: 'Keine Termine für heute geplant',
      schedule: 'Zeitplan',
      paymentRecords: 'Zahlungsbelege',
      commonTasks: 'Häufige Aufgaben und Verknüpfungen'
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
      startDate: 'Startdatum',
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
    },
    common: {
      appName: 'Allinone Garage',
      loading: 'Wird geladen...',
      welcome: 'Willkommen'
    },
    roles: {
      administrator: 'Administrator',
      mechanic: 'Mechaniker'
    },
    overview: {
      todayAppointments: 'Heutige Termine',
      weekAppointments: 'Termine dieser Woche',
      totalCustomers: 'Gesamtzahl der Kunden',
      completedJobs: 'Abgeschlossene Arbeiten',
      upcomingAppointments: 'Bevorstehende Termine',
      appointments: 'Termine'
    },
    pages: {
      overview: {
        title: 'Übersicht',
        subtitle: 'Zusammenfassung der Werkstattaktivitäten'
      },
      calendar: {
        title: 'Kalender',
        subtitle: 'Termine planen und verwalten'
      },
      customers: {
        title: 'Kunden',
        subtitle: 'Verwalten Sie Ihre Kundendatenbank'
      },
      loanerCars: {
        title: 'Leihwagen',
        subtitle: 'Verwalten Sie Ihre Leihwagenflotte'
      },
      serviceTypes: {
        title: 'Servicetypen',
        subtitle: 'Serviceangebote und Preise konfigurieren'
      },
      settings: {
        title: 'Einstellungen',
        subtitle: 'Konfigurieren Sie Ihre Werkstatteinstellungen'
      },
      notFound: {
        title: 'Seite nicht gefunden',
        message: 'Die gesuchte Seite existiert nicht.',
        returnHome: 'Zurück zur Startseite'
      }
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
