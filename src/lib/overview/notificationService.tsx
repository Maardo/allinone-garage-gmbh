
import React from 'react';
import { Appointment } from './types';

export const sendEmailNotification = (appointment: Appointment, t: (key: string) => string) => {
  const emailTemplate = localStorage.getItem("completionEmailTemplate") || 
    "Dear customer,\n\nWe are pleased to inform you that your vehicle service has been completed. Your vehicle is now ready for pickup.\n\nThank you for choosing our services.\n\nBest regards,\nAuto Service Center";
  
  console.log(`Sending email to ${appointment.customerEmail}:`);
  console.log(`Subject: ${t('overview.appointmentCompleted')}`);
  console.log(`Body: ${emailTemplate}`);
  
  // In a real application, this would call an API to send the email
  return true;
};

// Utility to create the toast action button for undo functionality
export const createUndoButton = (undoCallback: () => void, t: (key: string) => string) => {
  return (
    <button
      onClick={undoCallback}
      className="bg-secondary hover:bg-secondary/90 text-foreground px-3 py-1 rounded-md text-xs font-medium"
    >
      {t('actions.undo')}
    </button>
  );
};
