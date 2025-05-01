
import React, { useEffect, useCallback } from 'react';
import { Appointment, GroupedAppointments, Stats, TimeViewType } from '@/lib/overview/types';
import { updateAppointment } from '@/services/appointmentService';
import { updateStats, fetchStats } from '@/services/statsService';
import { useOverviewState } from './useOverviewState';
import { useAppointmentCompletion } from './useAppointmentCompletion';
import { useAppointmentDataLoader } from './useAppointmentDataLoader';
import { useAppointmentNotifications } from './useAppointmentNotifications';
import { useAppointmentFiltering } from '@/lib/overview/filterService';
import { EmailConfirmationDialog } from '@/components/overview/EmailConfirmationDialog';

// Re-export types for backward compatibility
export type { Appointment, GroupedAppointments, Stats, TimeViewType };

export function useOverviewAppointments() {
  // Use our extracted hooks
  const {
    isLoading,
    initialStats,
    initialAppointments,
    loadData: refreshData
  } = useAppointmentDataLoader();
  
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
    handleSendNotification,
    cancelPendingEmail
  } = useAppointmentNotifications();
  
  // Use the appointment completion hook
  const {
    markAppointmentAsComplete,
    handleMarkComplete: baseHandleMarkComplete,
  } = useAppointmentCompletion();
  
  // Use the filtering service to get filtered jobs
  const { filteredJobs } = useAppointmentFiltering(timeView, upcomingJobs, setStats);

  // Effect to update database whenever stats or upcomingJobs change
  useEffect(() => {
    if (isLoading) return; // Don't update during initial load
    
    const updateDatabase = async () => {
      try {
        await updateStats(stats);
        
        // For appointments, we only update ones that have been marked as completed
        const completedAppointments = upcomingJobs.filter(job => job.isCompleted);
        
        for (const appointment of completedAppointments) {
          await updateAppointment(appointment);
        }
      } catch (error) {
        console.error('Error updating database:', error);
      }
    };
    
    updateDatabase();
  }, [stats, upcomingJobs, isLoading]);

  // Sync stats with the database
  useEffect(() => {
    const syncStats = async () => {
      if (isLoading) return;
      
      try {
        const dbStats = await fetchStats();
        setStats(dbStats);
      } catch (error) {
        console.error("Error syncing stats:", error);
      }
    };
    
    syncStats();
  }, [isLoading, setStats]);

  // Wrap handleMarkComplete to pass the required parameters
  const handleMarkComplete = useCallback((appointmentId: number) => {
    baseHandleMarkComplete(
      appointmentId,
      upcomingJobs,
      stats,
      setUpcomingJobs,
      setStats,
      saveStateBeforeChange,
      undoLastChange
    );
  }, [baseHandleMarkComplete, upcomingJobs, stats, setUpcomingJobs, setStats, saveStateBeforeChange, undoLastChange]);

  // Handle email confirmation dialog actions
  const handleConfirmSendEmail = useCallback(() => {
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
      handleSendNotification(selectedAppointment, true, undoLastChange);
    }
  }, [selectedAppointment, markAppointmentAsComplete, upcomingJobs, stats, setUpcomingJobs, setStats, undoLastChange, handleSendNotification]);

  const handleConfirmNoEmail = useCallback(() => {
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
      handleSendNotification(selectedAppointment, false, undoLastChange);
    }
  }, [selectedAppointment, markAppointmentAsComplete, upcomingJobs, stats, setUpcomingJobs, setStats, undoLastChange, handleSendNotification]);

  // Custom dialog component that uses our state and callbacks
  const EmailConfirmationDialogComponent = useCallback(() => (
    <EmailConfirmationDialog
      open={dialogOpen}
      setOpen={setDialogOpen}
      appointment={selectedAppointment}
      onConfirmSendEmail={handleConfirmSendEmail}
      onConfirmNoEmail={handleConfirmNoEmail}
    />
  ), [dialogOpen, setDialogOpen, selectedAppointment, handleConfirmSendEmail, handleConfirmNoEmail]);

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
    isLoading,
    refreshData,
    EmailConfirmationDialog: EmailConfirmationDialogComponent
  };
}
