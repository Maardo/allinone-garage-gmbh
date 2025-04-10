
import { useCallback } from 'react';
import { Appointment } from '@/lib/overview/types';
import { useAppointmentDialogState } from './useAppointmentDialogState';
import { useNotificationHandler } from './useNotificationHandler';

export function useAppointmentNotifications() {
  // Use our extracted hooks
  const {
    selectedAppointment,
    setSelectedAppointment,
    dialogOpen,
    setDialogOpen
  } = useAppointmentDialogState();
  
  const {
    handleSendNotification,
    cancelPendingEmail
  } = useNotificationHandler();

  return {
    // Dialog state
    selectedAppointment,
    setSelectedAppointment,
    dialogOpen,
    setDialogOpen,
    
    // Notification functionality
    handleSendNotification,
    cancelPendingEmail
  };
}
