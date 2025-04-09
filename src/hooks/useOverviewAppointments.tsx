
import React from 'react';
import { Appointment, GroupedAppointments, Stats, TimeViewType } from '@/lib/overview/types';
import { initialStats, initialAppointments } from '@/lib/overview/mockData';
import { useNotificationService } from '@/lib/overview/notificationService';
import { useAppointmentFiltering } from '@/lib/overview/filterService';
import { useOverviewState } from './useOverviewState';
import { useAppointmentCompletion } from './useAppointmentCompletion';
import { EmailConfirmationDialog } from '@/components/overview/EmailConfirmationDialog';

// Re-export types for backward compatibility
export type { Appointment, GroupedAppointments, Stats, TimeViewType };

export function useOverviewAppointments() {
  const {
    timeView,
    setTimeView,
    stats,
    setStats,
    upcomingJobs,
    setUpcomingJobs,
    saveStateBeforeChange,
    undoLastChange,
    updateTotalCustomers
  } = useOverviewState(initialStats, initialAppointments);
  
  const {
    selectedAppointment,
    setSelectedAppointment,
    dialogOpen,
    setDialogOpen,
    markAppointmentAsComplete,
    handleMarkComplete: baseHandleMarkComplete,
    cancelPendingEmail
  } = useAppointmentCompletion();
  
  // Use the filtering service to get filtered jobs
  const { filteredJobs } = useAppointmentFiltering(timeView, upcomingJobs, setStats);

  // Wrap handleMarkComplete to pass the required parameters
  const handleMarkComplete = (appointmentId: number) => {
    baseHandleMarkComplete(
      appointmentId,
      upcomingJobs,
      stats,
      setUpcomingJobs,
      setStats,
      saveStateBeforeChange,
      undoLastChange
    );
  };

  // Handle email confirmation dialog actions
  const handleConfirmSendEmail = () => {
    if (selectedAppointment) {
      markAppointmentAsComplete(
        selectedAppointment,
        true,
        upcomingJobs,
        stats,
        setUpcomingJobs,
        setStats,
        undoLastChange
      );
    }
  };

  const handleConfirmNoEmail = () => {
    if (selectedAppointment) {
      markAppointmentAsComplete(
        selectedAppointment,
        false,
        upcomingJobs,
        stats,
        setUpcomingJobs,
        setStats,
        undoLastChange
      );
    }
  };

  // Custom dialog component that uses our state and callbacks
  const EmailConfirmationDialogComponent = () => (
    <EmailConfirmationDialog
      open={dialogOpen}
      setOpen={setDialogOpen}
      appointment={selectedAppointment}
      onConfirmSendEmail={handleConfirmSendEmail}
      onConfirmNoEmail={handleConfirmNoEmail}
    />
  );

  return {
    timeView,
    setTimeView,
    stats,
    setStats,
    filteredJobs,
    upcomingJobs,
    setUpcomingJobs,
    handleMarkComplete,
    updateTotalCustomers,
    saveStateBeforeChange,
    undoLastChange,
    EmailConfirmationDialog: EmailConfirmationDialogComponent
  };
}
