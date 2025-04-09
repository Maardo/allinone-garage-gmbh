
import { Appointment as OverviewAppointment } from "@/lib/overview/types";
import { Appointment as CustomerAppointment } from "@/lib/types";

/**
 * Converts a customer appointment to an overview appointment
 */
export const customerToOverviewAppointment = (appointment: CustomerAppointment): OverviewAppointment => {
  return {
    id: typeof appointment.id === 'string' ? parseInt(appointment.id.replace(/\D/g, '')) || 0 : 0,
    date: new Date(appointment.date),
    vehicleModel: appointment.vehicleMake + ' ' + appointment.vehicleModel,
    serviceType: appointment.serviceType,
    isCompleted: appointment.isCompleted || false,
    customerEmail: appointment.customerEmail || '',
    customerName: appointment.customerName || '',
    licensePlate: appointment.vehicleLicense || ''
  };
};

/**
 * Converts an overview appointment to a customer appointment
 */
export const overviewToCustomerAppointment = (appointment: OverviewAppointment): CustomerAppointment => {
  const [make, ...modelParts] = (appointment.vehicleModel || '').split(' ');
  const model = modelParts.join(' ');
  
  return {
    id: appointment.id.toString(),
    date: appointment.date,
    customerId: '',
    customerName: appointment.customerName || '',
    customerEmail: appointment.customerEmail || '',
    customerPhone: '',
    customerAddress: {
      street: '',
      zipCode: '',
      city: ''
    },
    vehicleInfo: appointment.vehicleModel || '',
    vehicleMake: make || '',
    vehicleModel: model || '',
    vehicleLicense: appointment.licensePlate || '',
    vehicleVin: '',
    vehicleCarId: '',
    serviceType: appointment.serviceType,
    notes: '',
    isPaid: false,
    isCompleted: appointment.isCompleted || false,
    needsLoanerCar: false
  };
};
