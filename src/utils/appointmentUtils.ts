
import { format } from "date-fns";
import { Appointment } from "@/lib/types";

// Define the grouped appointments type
export interface GroupedAppointments {
  [key: string]: Appointment[];
}

export function groupAppointmentsByDate(appointments: Appointment[]): GroupedAppointments {
  return appointments.reduce((acc, job) => {
    const dateStr = format(job.date, 'yyyy-MM-dd');
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(job);
    return acc;
  }, {} as GroupedAppointments);
}
