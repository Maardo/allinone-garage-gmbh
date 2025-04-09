
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
import { fetchAppointments, createAppointment as createAppointmentApi, updateAppointment as updateAppointmentApi, deleteAppointment as deleteAppointmentApi } from "@/services/appointmentService";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

export function useCalendar() {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<CalendarViewMode>(isMobile ? 'week' : 'week');
  const [isLoading, setIsLoading] = useState(true);

  // Load appointments from the database
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAppointments();
        setAppointments(data);
      } catch (error) {
        console.error("Error loading appointments:", error);
        toast.error(t('common.error'));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAppointments();
  }, [t]);

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

  const handleAddAppointment = async (appointment: Appointment) => {
    try {
      if (selectedAppointment && selectedAppointment.id) {
        // Update existing appointment
        const updatedAppointment = await updateAppointmentApi(appointment);
        setAppointments(updateAppointmentInList(appointments, updatedAppointment));
        toast.success(t('appointment.updated'));
      } else {
        // Add new appointment
        const newAppointment = await createAppointmentApi(appointment);
        setAppointments([...appointments, newAppointment]);
        toast.success(t('appointment.created'));
      }
      setIsDialogOpen(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error("Error saving appointment:", error);
      toast.error(t('common.error'));
    }
  };

  const handleSelectAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  const handleNewAppointmentAtDate = (date: Date) => {
    setSelectedAppointment(createEmptyAppointment(date));
    setIsDialogOpen(true);
  };

  const handleDeleteAppointment = async (appointmentId: number) => {
    try {
      await deleteAppointmentApi(appointmentId);
      setAppointments(appointments.filter(app => app.id !== appointmentId));
      setIsDialogOpen(false);
      setSelectedAppointment(null);
      toast.success(t('appointment.deleted'));
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error(t('common.error'));
    }
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
    isLoading,
    setIsDialogOpen,
    setSelectedAppointment,
    handleNavigatePrev,
    handleNavigateNext,
    goToToday,
    handleAddAppointment,
    handleSelectAppointment,
    handleNewAppointmentAtDate,
    handleDeleteAppointment,
    handleChangeViewMode
  };
}
