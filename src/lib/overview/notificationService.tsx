
import React, { useState, useCallback } from 'react';
import { Appointment } from './types';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';

export function useNotificationService() {
  const { t } = useLanguage();
  const [pendingEmails, setPendingEmails] = useState<{[key: number]: NodeJS.Timeout}>({});
  const { toast } = useToast();

  // Clear a pending email without sending it
  const cancelPendingEmail = useCallback((appointmentId: number) => {
    if (pendingEmails[appointmentId]) {
      clearTimeout(pendingEmails[appointmentId]);
      const updatedPendingEmails = { ...pendingEmails };
      delete updatedPendingEmails[appointmentId];
      setPendingEmails(updatedPendingEmails);
      return true;
    }
    return false;
  }, [pendingEmails]);

  // Schedule an email to be sent after delay
  const scheduleEmailNotification = useCallback((appointment: Appointment, delayInSeconds: number = 30) => {
    // Cancel any existing pending email for this appointment
    cancelPendingEmail(appointment.id);
    
    // Schedule the new email
    const timeout = setTimeout(() => {
      sendEmailNotification(appointment);
      // Remove from pending emails
      const updatedPendingEmails = { ...pendingEmails };
      delete updatedPendingEmails[appointment.id];
      setPendingEmails(updatedPendingEmails);
    }, delayInSeconds * 1000);
    
    // Store the timeout reference
    setPendingEmails(prev => ({
      ...prev,
      [appointment.id]: timeout
    }));
    
    return true;
  }, [pendingEmails]);

  // Function to send email notification immediately
  const sendEmailNotification = (appointment: Appointment) => {
    const emailTemplate = localStorage.getItem("completionEmailTemplate") || 
      "Dear customer,\n\nWe are pleased to inform you that your vehicle service has been completed. Your vehicle is now ready for pickup.\n\nThank you for choosing our services.\n\nBest regards,\nAuto Service Center";
    
    console.log(`Sending email to ${appointment.customerEmail}:`);
    console.log(`Subject: ${t('overview.appointmentCompleted')}`);
    console.log(`Body: ${emailTemplate}`);
    
    // In a real application, this would call an API to send the email
    return true;
  };

  return { 
    sendEmailNotification,
    scheduleEmailNotification,
    cancelPendingEmail,
    pendingEmails
  };
}
