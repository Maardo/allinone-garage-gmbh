
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCustomers } from "@/hooks/useCustomers";
import { useOverviewAppointments } from "@/hooks/useOverviewAppointments";
import { useCalendarNavigation } from "./calendar/useCalendarNavigation";
import { useAppointmentSelection } from "./calendar/useAppointmentSelection";
import { useAppointmentData } from "./calendar/useAppointmentData";
import { useAppointmentOperations } from "./calendar/useAppointmentOperations";

export function useCalendar() {
  const isMobile = useIsMobile();
  const { refreshCustomers } = useCustomers();
  const { refreshData: refreshOverviewData } = useOverviewAppointments();
  
  // Get calendar navigation state and handlers
  const {
    currentDate,
    viewMode,
    handleNavigatePrev,
    handleNavigateNext,
    goToToday,
    handleChangeViewMode
  } = useCalendarNavigation();

  // Get appointment selection state and handlers
  const {
    selectedAppointment,
    setSelectedAppointment,
    isDialogOpen,
    setIsDialogOpen,
    handleSelectAppointment,
    handleNewAppointmentAtDate
  } = useAppointmentSelection();

  // Get appointment data
  const {
    appointments,
    setAppointments,
    isLoading,
    loadAppointments
  } = useAppointmentData();

  // Get appointment operations
  const {
    handleAddAppointment,
    handleDeleteAppointment
  } = useAppointmentOperations({
    appointments,
    setAppointments,
    setIsDialogOpen,
    setSelectedAppointment,
    refreshCustomers,
    refreshOverviewData,
    loadAppointments
  });

  // Load appointments on mount
  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

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
