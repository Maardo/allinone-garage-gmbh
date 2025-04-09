
import { useState, useEffect, useCallback } from "react";
import { Appointment } from "@/lib/types";
import { CalendarViewMode } from "@/lib/calendar/types";
import { MOCK_APPOINTMENTS } from "@/lib/calendar/mockData";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  createEmptyAppointment,
  navigateToPreviousPeriod, 
  navigateToNextPeriod,
  getStartOfCurrentPeriod,
  updateAppointmentInList,
  addAppointmentToList
} from "@/lib/calendar/calendarService";

export function useCalendar() {
  const isMobile = useIsMobile();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<CalendarViewMode>(isMobile ? 'week' : 'week');

  // Ensure we're using the right view when screen size changes
  useEffect(() => {
    if (isMobile && viewMode === 'month') {
      // Don't automatically change the view mode on mobile anymore
      // We'll let the user decide which view they want to use
    }
  }, [isMobile, viewMode]);

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

  const handleChangeViewMode = useCallback((mode: CalendarViewMode) => {
    setViewMode(mode);
    
    // Adjust current date to the beginning of appropriate period
    setCurrentDate(getStartOfCurrentPeriod(currentDate, mode));
  }, [currentDate]);

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
