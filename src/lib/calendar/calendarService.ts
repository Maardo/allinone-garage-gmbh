
import { addDays, addMonths, addWeeks, startOfDay, startOfMonth, startOfWeek, subDays, subMonths, subWeeks } from "date-fns";
import { Appointment } from "@/lib/types";
import { CalendarViewMode } from "./types";

export const createEmptyAppointment = (date: Date): Appointment => {
  // Set the time to 9 AM
  const appointmentDate = new Date(date);
  appointmentDate.setHours(9, 0, 0, 0);
  
  return {
    id: "",
    date: appointmentDate,
    customerId: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: {
      street: "",
      zipCode: "",
      city: ""
    },
    vehicleInfo: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleLicense: "",
    vehicleVin: "",
    vehicleCarId: "",
    serviceType: 1,
    notes: "",
    isPaid: false,
    isCompleted: false,
    needsLoanerCar: false
  };
};

export const navigateToPreviousPeriod = (currentDate: Date, viewMode: CalendarViewMode): Date => {
  switch (viewMode) {
    case 'day':
      return subDays(currentDate, 1);
    case 'week':
      return subWeeks(currentDate, 1);
    case 'month':
      return subMonths(currentDate, 1);
  }
};

export const navigateToNextPeriod = (currentDate: Date, viewMode: CalendarViewMode): Date => {
  switch (viewMode) {
    case 'day':
      return addDays(currentDate, 1);
    case 'week':
      return addWeeks(currentDate, 1);
    case 'month':
      return addMonths(currentDate, 1);
  }
};

export const getStartOfCurrentPeriod = (date: Date, viewMode: CalendarViewMode): Date => {
  switch (viewMode) {
    case 'day':
      return startOfDay(date);
    case 'week':
      return startOfWeek(date, { weekStartsOn: 1 });
    case 'month':
      return startOfMonth(date);
  }
};

export const updateAppointmentInList = (
  appointments: Appointment[],
  updatedAppointment: Appointment
): Appointment[] => {
  return appointments.map(app => 
    app.id === updatedAppointment.id ? updatedAppointment : app
  );
};

export const addAppointmentToList = (
  appointments: Appointment[],
  newAppointment: Appointment
): Appointment[] => {
  return [...appointments, {
    ...newAppointment,
    id: Math.random().toString(36).substr(2, 9)
  }];
};
