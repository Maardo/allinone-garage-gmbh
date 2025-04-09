
import { Appointment } from './types';
import { ServiceType } from '@/lib/serviceTypes';

export const MOCK_APPOINTMENTS: Appointment[] = [
  { 
    id: 1,
    date: new Date(2025, 3, 8, 9, 0), // April 8, 2025, 09:00
    vehicleModel: "Volvo XC60",
    serviceType: 1 as ServiceType,
    isCompleted: false,
    customerEmail: "johan@example.com",
    customerName: "Johan Andersson",
    licensePlate: "ABC123"
  },
  { 
    id: 2,
    date: new Date(2025, 3, 9, 13, 30), // April 9, 2025, 13:30
    vehicleModel: "BMW X5",
    serviceType: 2 as ServiceType,
    isCompleted: false,
    customerEmail: "customer@example.com",
    customerName: "Maria Johansson",
    licensePlate: "DEF456"
  },
  { 
    id: 3,
    date: new Date(2025, 3, 10, 10, 0), // April 10, 2025, 10:00
    vehicleModel: "Audi A4",
    serviceType: 1 as ServiceType,
    isCompleted: false,
    customerEmail: "customer2@example.com",
    customerName: "Erik Svensson",
    licensePlate: "GHI789"
  },
  { 
    id: 4,
    date: new Date(2025, 3, 13, 14, 0), // April 13, 2025, 14:00
    vehicleModel: "Volvo V70",
    serviceType: 2 as ServiceType,
    isCompleted: false,
    customerEmail: "customer3@example.com",
    customerName: "Anna Karlsson",
    licensePlate: "JKL012"
  },
  { 
    id: 5,
    date: new Date(2025, 3, 15, 11, 30), // April 15, 2025, 11:30
    vehicleModel: "Tesla Model 3",
    serviceType: 1 as ServiceType,
    isCompleted: false,
    customerEmail: "customer4@example.com",
    customerName: "Lars Nilsson",
    licensePlate: "MNO345"
  },
  { 
    id: 6,
    date: new Date(2025, 3, 22, 10, 0), // April 22, 2025, 10:00
    vehicleModel: "Mercedes E-Class",
    serviceType: 3 as ServiceType,
    isCompleted: false,
    customerEmail: "customer5@example.com",
    customerName: "Eva Lindberg",
    licensePlate: "PQR678"
  },
  { 
    id: 7,
    date: new Date(2025, 3, 28, 15, 30), // April 28, 2025, 15:30
    vehicleModel: "Ford Focus",
    serviceType: 4 as ServiceType,
    isCompleted: false,
    customerEmail: "customer6@example.com",
    customerName: "Peter Ekström",
    licensePlate: "STU901"
  },
  { 
    id: 8,
    date: new Date(2025, 4, 5, 9, 0), // May 5, 2025, 09:00
    vehicleModel: "Toyota RAV4",
    serviceType: 5 as ServiceType,
    isCompleted: false,
    customerEmail: "customer7@example.com",
    customerName: "Sofia Berg",
    licensePlate: "VWX234"
  }
];

export const INITIAL_STATS: Stats = {
  todayAppointments: 3,
  weekAppointments: 15,
  totalCustomers: 275,
  completedJobs: 843
};
