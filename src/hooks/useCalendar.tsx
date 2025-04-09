
import { useState } from "react";
import { Appointment } from "@/lib/types";
import { CalendarViewMode } from "@/lib/calendar/types";
import { MOCK_APPOINTMENTS } from "@/lib/calendar/mockData";
import { 
  createEmptyAppointment,
  navigateToPreviousPeriod, 
  navigateToNextPeriod,
  getStartOfCurrentPeriod,
  updateAppointmentInList,
  addAppointmentToList
} from "@/lib/calendar/calendarService";

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<CalendarViewMode>('week');

  const handleNavigatePrev = () => {
    setCurrentDate(navigateToPreviousPeriod(currentDate, viewMode));
  };

  const handleNavigateNext = () => {
    setCurrentDate(navigateToNextPeriod(currentDate, viewMode));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(getStartOfCurrentPeriod(today, viewMode));
  };

  const handleAddAppointment = (appointment: Appointment) => {
    if (selectedAppointment) {
      // Update existing appointment
      setAppointments(updateAppointmentInList(appointments, appointment));
    } else {
      // Add new appointment
      setAppointments(addAppointmentToList(appointments, appointment));
    }
    setIsDialogOpen(false);
    setSelectedAppointment(null);
  };

  const handleSelectAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  const handleNewAppointmentAtDate = (date: Date) => {
    setSelectedAppointment(createEmptyAppointment(date));
    setIsDialogOpen(true);
  };

  const handleChangeViewMode = (mode: CalendarViewMode) => {
    setViewMode(mode);
    
    // Adjust the current date to the start of the appropriate period
    const today = new Date();
    setCurrentDate(getStartOfCurrentPeriod(today, mode));
  };

  return {
    currentDate,
    appointments,
    selectedAppointment,
    isDialogOpen,
    viewMode,
    setIsDialogOpen,
    setSelectedAppointment,
    handleNavigatePrev,
    handleNavigateNext,
    goToToday,
    handleAddAppointment,
    handleSelectAppointment,
    handleNewAppointmentAtDate,
    handleChangeViewMode
  };
}
