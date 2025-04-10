
import { useState, useEffect, useCallback } from "react";
import { Appointment as CustomerAppointment } from "@/lib/types";
import { Appointment as OverviewAppointment } from "@/lib/overview/types";
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
import { customerToOverviewAppointment, overviewToCustomerAppointment } from "@/lib/overview/appointmentConverter";
import { useCustomers } from "@/hooks/useCustomers";

export function useCalendar() {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<CustomerAppointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<CustomerAppointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<CalendarViewMode>(isMobile ? 'week' : 'week');
  const [isLoading, setIsLoading] = useState(true);
  const { handleAddCustomer, customers } = useCustomers();

  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAppointments();
      const customerAppointments = data.map(overviewToCustomerAppointment);
      setAppointments(customerAppointments);
    } catch (error) {
      console.error("Error loading appointments:", error);
      toast.error(t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [t]);

  useEffect(() => {
    if (isMobile && viewMode === 'month') {
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

  const handleAddAppointment = async (appointment: CustomerAppointment) => {
    try {
      if (selectedAppointment && selectedAppointment.id) {
        appointment.needsLoanerCar = appointment.needsLoanerCar ?? selectedAppointment.needsLoanerCar;
        appointment.loanerCarId = appointment.loanerCarId ?? selectedAppointment.loanerCarId;
        
        const overviewAppointment = customerToOverviewAppointment(appointment);
        const updatedOverviewAppointment = await updateAppointmentApi(overviewAppointment);
        const updatedCustomerAppointment = overviewToCustomerAppointment(updatedOverviewAppointment);
        setAppointments(updateAppointmentInList(appointments, updatedCustomerAppointment));
        
        if (appointment.customerName && appointment.customerEmail) {
          const existingCustomer = customers.find(c => 
            c.email === appointment.customerEmail || 
            c.name === appointment.customerName
          );
          
          if (!existingCustomer) {
            await handleAddCustomer();
          }
        }
        
        toast.success(t('appointment.updated'));
      } else {
        const overviewAppointment = customerToOverviewAppointment(appointment);
        const newOverviewAppointment = await createAppointmentApi(overviewAppointment);
        const newCustomerAppointment = overviewToCustomerAppointment(newOverviewAppointment);
        setAppointments([...appointments, newCustomerAppointment]);
        
        if (appointment.customerName && appointment.customerEmail) {
          const existingCustomer = customers.find(c => 
            c.email === appointment.customerEmail || 
            c.name === appointment.customerName
          );
          
          if (!existingCustomer) {
            await handleAddCustomer();
          }
        }
        
        toast.success(t('appointment.created'));
      }
      
      setIsDialogOpen(false);
      setSelectedAppointment(null);
      
      await loadAppointments();
      
    } catch (error) {
      console.error("Error saving appointment:", error);
      toast.error(t('common.error'));
    }
    
    return true;
  };

  const handleSelectAppointment = (appointment: CustomerAppointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  const handleNewAppointmentAtDate = (date: Date) => {
    setSelectedAppointment(createEmptyAppointment(date));
    setIsDialogOpen(true);
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    try {
      const numericId = parseInt(appointmentId);
      if (isNaN(numericId)) {
        throw new Error("Invalid appointment ID");
      }
      
      await deleteAppointmentApi(numericId);
      setAppointments(appointments.filter(app => app.id !== appointmentId));
      setIsDialogOpen(false);
      setSelectedAppointment(null);
      toast.success(t('appointment.deleted'));
      
      await loadAppointments();
      
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error(t('common.error'));
    }
  };

  const handleChangeViewMode = useCallback((mode: CalendarViewMode) => {
    setViewMode(mode);
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
    handleChangeViewMode,
    loadAppointments
  };
}
