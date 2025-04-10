
import { useCallback } from 'react';
import { Appointment } from '@/lib/overview/types';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from "@/components/ui/button";
import { useNotificationService } from '@/lib/overview/notificationService';

export function useNotificationHandler() {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  // Use notification service for email notifications
  const { 
    sendEmailNotification, 
    scheduleEmailNotification, 
    cancelPendingEmail 
  } = useNotificationService();

  const handleSendNotification = useCallback((
    appointment: Appointment, 
    sendEmail: boolean,
    undoLastChange: () => boolean
  ) => {
    // If user chose to send email and email notifications are enabled
    const emailNotificationsEnabled = localStorage.getItem("emailNotifications") !== "false";
    
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
  }, [scheduleEmailNotification, toast, t]);

  return {
    handleSendNotification,
    cancelPendingEmail
  };
}
