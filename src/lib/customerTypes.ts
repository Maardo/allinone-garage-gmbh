
import { ServiceType } from './serviceTypes';

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
  serviceType: ServiceType;
  notes: string;
  isPaid: boolean;
  isCompleted: boolean;
  loanerCarId?: string;
}
