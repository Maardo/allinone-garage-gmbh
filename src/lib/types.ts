
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
