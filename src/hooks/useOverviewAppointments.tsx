
import React, { useState, useEffect } from 'react';
import { Appointment, GroupedAppointments, Stats, TimeViewType } from '@/lib/overview/types';
import { useNotificationService } from '@/lib/overview/notificationService';
import { useAppointmentFiltering } from '@/lib/overview/filterService';
import { useOverviewState } from './useOverviewState';
import { useAppointmentCompletion } from './useAppointmentCompletion';
import { EmailConfirmationDialog } from '@/components/overview/EmailConfirmationDialog';
import { fetchAppointments, updateAppointment } from '@/services/appointmentService';
import { fetchStats, updateStats } from '@/services/statsService';
import { useToast } from './use-toast';
import { useLanguage } from '@/context/LanguageContext';

// Re-export types for backward compatibility
export type { Appointment, GroupedAppointments, Stats, TimeViewType };

export function useOverviewAppointments() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [initialStats, setInitialStats] = useState<Stats>({
    todayAppointments: 0,
    weekAppointments: 0,
    totalCustomers: 0,
    completedJobs: 0
  });
  const [initialAppointments, setInitialAppointments] = useState<Appointment[]>([]);
  
  // Fetch data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [appointmentsData, statsData] = await Promise.all([
          fetchAppointments(),
          fetchStats()
        ]);
        
        setInitialAppointments(appointmentsData);
        setInitialStats(statsData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: t('common.error'),
          description: t('overview.errorLoadingData'),
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [toast, t]);
  
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
    isLoading,
    EmailConfirmationDialog: EmailConfirmationDialogComponent
  };
}
