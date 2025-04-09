
import React from 'react';
import { Appointment } from './types';
import { useLanguage } from '@/context/LanguageContext';

export function useNotificationService() {
  const { t } = useLanguage();

  // Function to send email notification
  const sendEmailNotification = (appointment: Appointment) => {
    const emailTemplate = localStorage.getItem("completionEmailTemplate") || 
      "Dear customer,\n\nWe are pleased to inform you that your vehicle service has been completed. Your vehicle is now ready for pickup.\n\nThank you for choosing our services.\n\nBest regards,\nAuto Service Center";
    
    console.log(`Sending email to ${appointment.customerEmail}:`);
    console.log(`Subject: ${t('overview.appointmentCompleted')}`);
    console.log(`Body: ${emailTemplate}`);
    
    // In a real application, this would call an API to send the email
    return true;
  };

  return { sendEmailNotification };
}
