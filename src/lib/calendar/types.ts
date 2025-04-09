
import { Appointment } from "@/lib/types";

export type CalendarViewMode = 'day' | 'week' | 'month';

export interface CalendarState {
  currentDate: Date;
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  isDialogOpen: boolean;
  viewMode: CalendarViewMode;
}
