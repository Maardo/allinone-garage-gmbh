
import { useState, useEffect, useCallback } from "react";
import { Appointment } from "@/lib/types";
import { CalendarViewMode } from "@/lib/calendar/types";
import { MOCK_APPOINTMENTS } from "@/lib/calendar/mockData";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { useOverviewAppointments } from "@/hooks/useOverviewAppointments";
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
  const { toast } = useToast();
  const { t } = useLanguage();
  const { upcomingJobs, setUpcomingJobs } = useOverviewAppointments();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [previousAppointments, setPreviousAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
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

  const saveStateBeforeChange = () => {
    setPreviousAppointments([...appointments]);
  };
  
  const undoLastChange = () => {
    setAppointments([...previousAppointments]);
    toast({
      title: t('actions.undone'),
      description: t('actions.changesReverted'),
    });
    return true;
  };

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
    saveStateBeforeChange();
    let updatedAppointments;
    
    if (selectedAppointment) {
      // Update existing appointment
      updatedAppointments = updateAppointmentInList(appointments, appointment);
    } else {
      // Add new appointment
      updatedAppointments = addAppointmentToList(appointments, appointment);
    }
    
    setAppointments(updatedAppointments);
    
    // Also update overview appointments with relevant data
    const simpleAppointment = {
      id: typeof appointment.id === 'string' ? parseInt(appointment.id) : appointment.id,
      date: appointment.date,
      vehicleModel: appointment.vehicleModel || "",
      serviceType: appointment.serviceType,
      isCompleted: appointment.isCompleted || false,
      customerEmail: appointment.customerEmail,
      customerName: appointment.customerName,
      licensePlate: appointment.vehicleLicense
    };
    
    // Update the upcomingJobs list
    if (selectedAppointment) {
      setUpcomingJobs(prev => prev.map(job => 
        job.id === simpleAppointment.id ? simpleAppointment : job
      ));
    } else {
      setUpcomingJobs(prev => [...prev, simpleAppointment]);
    }
    
    setIsDialogOpen(false);
    setSelectedAppointment(null);
    
    toast({
      title: selectedAppointment ? t('calendar.appointmentUpdated') : t('calendar.appointmentAdded'),
      description: selectedAppointment ? t('calendar.appointmentUpdatedDesc') : t('calendar.appointmentAddedDesc'),
      action: (
        <button
          onClick={() => undoLastChange()}
          className="bg-secondary hover:bg-secondary/90 text-foreground px-3 py-1 rounded-md text-xs font-medium"
        >
          {t('actions.undo')}
        </button>
      ),
    });
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
    handleChangeViewMode,
    saveStateBeforeChange,
    undoLastChange
  };
}
