
import React, { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { Appointment, Stats } from '@/lib/overview/types';
import { useNotificationService } from '@/lib/overview/notificationService';
import { Button } from "@/components/ui/button";

export function useAppointmentCompletion() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Use notification service for email notifications
  const { 
    sendEmailNotification, 
    scheduleEmailNotification, 
    cancelPendingEmail 
  } = useNotificationService();

  const markAppointmentAsComplete = useCallback((
    appointment: Appointment, 
    sendEmail: boolean = false,
    upcomingJobs: Appointment[],
    stats: Stats,
    setUpcomingJobs: React.Dispatch<React.SetStateAction<Appointment[]>>,
    setStats: React.Dispatch<React.SetStateAction<Stats>>,
    undoLastChange: () => boolean
  ) => {
    // Mark as complete
    setUpcomingJobs(currentJobs => 
      currentJobs.map(job => 
        job.id === appointment.id 
          ? { ...job, isCompleted: true } 
          : job
      )
    );
    
    // Update the completed jobs count in stats
    setStats(currentStats => ({
      ...currentStats,
      completedJobs: currentStats.completedJobs + 1
    }));
    
    // Handle email notification based on user choice
    const emailNotificationsEnabled = localStorage.getItem("emailNotifications") !== "false";
    
    // If user chose to send email and email notifications are enabled
    if (sendEmail && emailNotificationsEnabled && appointment.customerEmail) {
      scheduleEmailNotification(appointment);
      toast({
        title: t('overview.appointmentCompleted'),
        description: t('overview.emailScheduled'),
        action: (
          <Button
            onClick={() => undoLastChange()}
            className="px-6 py-2.5 text-sm font-medium bg-secondary hover:bg-secondary/90 text-foreground rounded-md"
          >
            {t('actions.undo')}
          </Button>
        ),
      });
    } else {
      // No email sent
      toast({
        title: t('overview.appointmentCompleted'),
        description: t('overview.appointmentMarkedComplete'),
        action: (
          <Button
            onClick={() => undoLastChange()}
            className="px-6 py-2.5 text-sm font-medium bg-secondary hover:bg-secondary/90 text-foreground rounded-md"
          >
            {t('actions.undo')}
          </Button>
        ),
      });
    }
  }, [toast, scheduleEmailNotification]);

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
      setDialogOpen(true);
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
  }, [markAppointmentAsComplete]);

  return {
    selectedAppointment,
    setSelectedAppointment,
    dialogOpen,
    setDialogOpen,
    markAppointmentAsComplete,
    handleMarkComplete,
    cancelPendingEmail
  };
}
