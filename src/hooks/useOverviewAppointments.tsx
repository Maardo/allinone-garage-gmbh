
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { Appointment, GroupedAppointments, Stats, TimeViewType } from '@/lib/overview/types';
import { initialStats, initialAppointments } from '@/lib/overview/mockData';
import { useNotificationService } from '@/lib/overview/notificationService';
import { useAppointmentFiltering } from '@/lib/overview/filterService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Re-export types for backward compatibility
export type { Appointment, GroupedAppointments, Stats, TimeViewType };

export function useOverviewAppointments() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [timeView, setTimeView] = useState<TimeViewType>("week");
  
  const [stats, setStats] = useState<Stats>(initialStats);
  const [upcomingJobs, setUpcomingJobs] = useState<Appointment[]>(initialAppointments);
  
  // Store previous state for undo functionality
  const [previousUpcomingJobs, setPreviousUpcomingJobs] = useState<Appointment[]>([...upcomingJobs]);
  const [previousStats, setPreviousStats] = useState<Stats>({...stats});
  
  // Use the filtering service to get filtered jobs
  const { filteredJobs } = useAppointmentFiltering(timeView, upcomingJobs, setStats);
  
  // Use notification service for email notifications
  const { sendEmailNotification, scheduleEmailNotification, cancelPendingEmail } = useNotificationService();

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const saveStateBeforeChange = () => {
    setPreviousUpcomingJobs([...upcomingJobs]);
    setPreviousStats({...stats});
  };
  
  const undoLastChange = () => {
    setUpcomingJobs([...previousUpcomingJobs]);
    setStats({...previousStats});
    
    // Cancel any pending emails if the appointment was part of the undo
    if (selectedAppointment) {
      cancelPendingEmail(selectedAppointment.id);
    }
    
    toast({
      title: t('actions.undone'),
      description: t('actions.changesReverted'),
    });
    return true;
  };

  const markAppointmentAsComplete = (appointment: Appointment, sendEmail: boolean = false) => {
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
            className="bg-secondary hover:bg-secondary/90 text-foreground px-6 py-2 rounded-md text-sm font-medium"
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
            className="bg-secondary hover:bg-secondary/90 text-foreground px-6 py-2 rounded-md text-sm font-medium"
          >
            {t('actions.undo')}
          </Button>
        ),
      });
    }
  };

  // Handle marking an appointment as complete
  const handleMarkComplete = (appointmentId: number) => {
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
      markAppointmentAsComplete(appointment, false);
    }
  };

  // Function to update total customers count
  const updateTotalCustomers = (change: number) => {
    saveStateBeforeChange();
    setStats(currentStats => ({
      ...currentStats,
      totalCustomers: currentStats.totalCustomers + change
    }));
  };

  // Confirmation dialog component
  const EmailConfirmationDialog = () => {
    if (!selectedAppointment) return null;
    
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('overview.sendEmailConfirmation')}</DialogTitle>
            <DialogDescription>{t('overview.sendEmailQuestion')}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col md:flex-row sm:justify-start gap-2 mt-5">
            <Button 
              variant="default"
              onClick={() => {
                markAppointmentAsComplete(selectedAppointment, true);
                setDialogOpen(false);
              }}
            >
              {t('actions.yes')}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                markAppointmentAsComplete(selectedAppointment, false);
                setDialogOpen(false);
              }}
            >
              {t('actions.no')}
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
              }}
              className="md:ml-auto"
            >
              {t('actions.cancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

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
    EmailConfirmationDialog
  };
}
