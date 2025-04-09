
import { ServiceType } from '@/lib/serviceTypes';

export interface Appointment {
  id: number;
  date: Date;
  vehicleModel: string;
  serviceType: ServiceType;
  isCompleted?: boolean;
  customerEmail?: string;
  customerName?: string;
  licensePlate?: string;
}

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
