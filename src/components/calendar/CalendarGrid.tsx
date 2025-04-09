
import { isSameDay } from "date-fns";
import { Appointment } from "@/lib/types";
import { MonthView } from "./grid/MonthView";
import { WeekView } from "./grid/WeekView";
import { DayView } from "./grid/DayView";

interface CalendarGridProps {
  currentDate: Date;
  appointments: Appointment[];
  onSelectAppointment: (appointment: Appointment) => void;
  onNewAppointmentAtDate: (date: Date) => void;
  viewMode: 'day' | 'week' | 'month';
}

export function CalendarGrid({
  currentDate,
  appointments,
  onSelectAppointment,
  onNewAppointmentAtDate,
  viewMode
}: CalendarGridProps) {
  
  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter(appointment => 
      isSameDay(new Date(appointment.date), day)
    );
  };

  // Render different views based on viewMode
  if (viewMode === 'day') {
    return (
      <DayView 
        day={currentDate} 
        appointments={getAppointmentsForDay(currentDate)} 
        onSelectAppointment={onSelectAppointment} 
        onNewAppointmentAtDate={onNewAppointmentAtDate}
      />
    );
  } else if (viewMode === 'week') {
    return (
      <WeekView 
        currentDate={currentDate} 
        appointments={appointments} 
        onSelectAppointment={onSelectAppointment} 
        onNewAppointmentAtDate={onNewAppointmentAtDate}
      />
    );
  }

  // Month view (default)
  return (
    <MonthView
      currentDate={currentDate}
      appointments={appointments}
      onSelectAppointment={onSelectAppointment}
      onNewAppointmentAtDate={onNewAppointmentAtDate}
    />
  );
}
