
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { Appointment, Stats } from '@/lib/overview/types';
import { Button } from "@/components/ui/button";

export function useAppointmentMarkComplete() {
  const { t } = useLanguage();
  const { toast } = useToast();

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
  }, [toast]);

  return { markAppointmentAsComplete };
}
