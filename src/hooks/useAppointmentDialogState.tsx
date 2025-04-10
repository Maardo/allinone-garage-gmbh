
import { useState, useCallback } from 'react';
import { Appointment } from '@/lib/overview/types';

export function useAppointmentDialogState() {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const openDialog = useCallback((appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDialogOpen(true);
  }, []);
  
  const closeDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);
  
  return {
    selectedAppointment,
    setSelectedAppointment,
    dialogOpen,
    setDialogOpen,
    openDialog,
    closeDialog
  };
}
