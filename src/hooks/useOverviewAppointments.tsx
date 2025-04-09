
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { Appointment, GroupedAppointments, Stats, TimeViewType } from '@/lib/overview/types';
import { initialStats, initialAppointments } from '@/lib/overview/mockData';
import { useNotificationService } from '@/lib/overview/notificationService';
import { useAppointmentFiltering } from '@/lib/overview/filterService';

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
  const { sendEmailNotification } = useNotificationService();

  const saveStateBeforeChange = () => {
    setPreviousUpcomingJobs([...upcomingJobs]);
    setPreviousStats({...stats});
  };
  
  const undoLastChange = () => {
    setUpcomingJobs([...previousUpcomingJobs]);
    setStats({...previousStats});
    toast({
      title: t('actions.undone'),
      description: t('actions.changesReverted'),
    });
    return true;
  };

  // Handle marking an appointment as complete
  const handleMarkComplete = (appointmentId: number) => {
    saveStateBeforeChange();
    
    // Find the appointment
    const appointment = upcomingJobs.find(job => job.id === appointmentId);
    if (!appointment) return;
    
    // Mark as complete
    setUpcomingJobs(currentJobs => 
      currentJobs.map(job => 
        job.id === appointmentId 
          ? { ...job, isCompleted: true } 
          : job
      )
    );
    
    // Update the completed jobs count in stats
    setStats(currentStats => ({
      ...currentStats,
      completedJobs: currentStats.completedJobs + 1
    }));
    
    // Send email notification if enabled
    const emailNotificationsEnabled = localStorage.getItem("emailNotifications") !== "false";
    if (emailNotificationsEnabled && appointment.customerEmail) {
      const emailSent = sendEmailNotification(appointment);
      if (emailSent) {
        toast({
          title: t('overview.appointmentCompleted'),
          description: t('overview.appointmentMarkedComplete') + 
            (emailNotificationsEnabled ? ` ${t('overview.emailSentToCustomer')}` : ''),
          action: (
            <button
              onClick={() => undoLastChange()}
              className="bg-secondary hover:bg-secondary/90 text-foreground px-3 py-1 rounded-md text-xs font-medium"
            >
              {t('actions.undo')}
            </button>
          ),
        });
      }
    } else {
      toast({
        title: t('overview.appointmentCompleted'),
        description: t('overview.appointmentMarkedComplete'),
        action: (
          <button
            onClick={() => undoLastChange()}
            className="bg-secondary hover:bg-secondary/90 text-foreground px-3 py-1 rounded-md text-xs font-medium"
          >
            {t('actions.undo')}
          </button>
        ),
      });
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
    undoLastChange
  };
}
