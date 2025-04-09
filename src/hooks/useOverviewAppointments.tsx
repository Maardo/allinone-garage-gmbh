
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { Appointment, Stats, TimeViewType } from '@/lib/overview/types';
import { MOCK_APPOINTMENTS, INITIAL_STATS } from '@/lib/overview/mockData';
import { sendEmailNotification, createUndoButton } from '@/lib/overview/notificationService';
import { filterJobsByTimeRange, calculateStatsFromAppointments } from '@/lib/overview/filterService';

// Re-export types that are used by other components
export type { Appointment, Stats, TimeViewType };
export { GroupedAppointments } from '@/lib/overview/types';

export function useOverviewAppointments() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [timeView, setTimeView] = useState<TimeViewType>("week");
  const [stats, setStats] = useState<Stats>(INITIAL_STATS);
  const [upcomingJobs, setUpcomingJobs] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  
  // Store previous state for undo functionality
  const [previousUpcomingJobs, setPreviousUpcomingJobs] = useState<Appointment[]>([...upcomingJobs]);
  const [previousStats, setPreviousStats] = useState<Stats>({...stats});
  
  const [filteredJobs, setFilteredJobs] = useState<Appointment[]>([]);
  
  useEffect(() => {
    const filtered = filterJobsByTimeRange(upcomingJobs, timeView);
    setFilteredJobs(filtered);
    
    // Update the stats based on the filtered appointments
    const { todayAppointments, weekAppointments } = calculateStatsFromAppointments(upcomingJobs);
    
    setStats(prevStats => ({
      ...prevStats,
      todayAppointments,
      weekAppointments
    }));
  }, [timeView, upcomingJobs]);
  
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
      const emailSent = sendEmailNotification(appointment, t);
      if (emailSent) {
        toast({
          title: t('overview.appointmentCompleted'),
          description: t('overview.appointmentMarkedComplete') + 
            (emailNotificationsEnabled ? ` ${t('overview.emailSentToCustomer')}` : ''),
          action: createUndoButton(undoLastChange, t),
        });
      }
    } else {
      toast({
        title: t('overview.appointmentCompleted'),
        description: t('overview.appointmentMarkedComplete'),
        action: createUndoButton(undoLastChange, t),
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
