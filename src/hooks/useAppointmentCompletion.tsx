
import { useCallback } from 'react';
import { Appointment, Stats } from '@/lib/overview/types';
import { useAppointmentDialogState } from './useAppointmentDialogState';
import { useAppointmentMarkComplete } from './useAppointmentMarkComplete';
import { useNotificationHandler } from './useNotificationHandler';

export function useAppointmentCompletion() {
  // Use our extracted hooks
  const { 
    selectedAppointment,
    setSelectedAppointment,
    dialogOpen,
    setDialogOpen,
    openDialog,
    closeDialog
  } = useAppointmentDialogState();
  
  const { markAppointmentAsComplete } = useAppointmentMarkComplete();
  
  // Use notification handler for email notifications
  const { 
    handleSendNotification, 
    cancelPendingEmail 
  } = useNotificationHandler();

  // Handle marking an appointment as complete
  const handleMarkComplete = useCallback((
    appointmentId: number,
    upcomingJobs: Appointment[],
    stats: Stats,
    setUpcomingJobs: React.Dispatch<React.SetStateAction<Appointment[]>>,
    setStats: React.Dispatch<React.SetStateAction<Stats>>,
    saveStateBeforeChange: () => void,
    undoLastChange: () => boolean
  ) => {
    saveStateBeforeChange();
    
    // Find the appointment
    const appointment = upcomingJobs.find(job => job.id === appointmentId);
    if (!appointment) return;
    
    // Check if email could be sent
    const emailNotificationsEnabled = localStorage.getItem("emailNotifications") !== "false";
    const canSendEmail = emailNotificationsEnabled && appointment.customerEmail;
    
    // Set selected appointment for potential use in dialog
    setSelectedAppointment(appointment);
    
    // Show dialog if email can be sent, otherwise just mark as complete
    if (canSendEmail) {
      openDialog(appointment);
    } else {
      markAppointmentAsComplete(
        appointment, 
        false,
        upcomingJobs,
        stats,
        setUpcomingJobs,
        setStats,
        undoLastChange
      );
    }
  }, [openDialog, markAppointmentAsComplete, setSelectedAppointment]);

  // Enhanced version of markAppointmentAsComplete that handles email notifications
  const completeAppointmentWithEmailOption = useCallback((
    appointment: Appointment,
    sendEmail: boolean,
    upcomingJobs: Appointment[],
    stats: Stats,
    setUpcomingJobs: React.Dispatch<React.SetStateAction<Appointment[]>>,
    setStats: React.Dispatch<React.SetStateAction<Stats>>,
    undoLastChange: () => boolean
  ) => {
    // Send email notification if requested
    if (sendEmail && appointment.customerEmail) {
      handleSendNotification(appointment, sendEmail, undoLastChange);
    }
    
    // Mark appointment as complete
    markAppointmentAsComplete(
      appointment,
      sendEmail,
      upcomingJobs,
      stats,
      setUpcomingJobs,
      setStats,
      undoLastChange
    );
  }, [markAppointmentAsComplete, handleSendNotification]);

  return {
    selectedAppointment,
    setSelectedAppointment,
    dialogOpen,
    setDialogOpen,
    markAppointmentAsComplete: completeAppointmentWithEmailOption,
    handleMarkComplete,
    cancelPendingEmail
  };
}
