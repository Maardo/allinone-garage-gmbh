import { ServiceType } from '@/lib/serviceTypes';

// Define the appointment type specifically for this component
export interface Appointment {
  id: number;
  date: Date;
  vehicleModel: string;
  serviceType: ServiceType;
  isCompleted?: boolean;
  customerEmail?: string;
  customerName?: string;
  licensePlate?: string;
  needsLoanerCar?: boolean;
  loanerCarId?: string;
}

// Define the grouped appointments type
export interface GroupedAppointments {
  [key: string]: Appointment[];
}

export type TimeViewType = "week" | "month";

export interface Stats {
  todayAppointments: number;
  weekAppointments: number;
  totalCustomers: number;
  completedJobs: number;
}
