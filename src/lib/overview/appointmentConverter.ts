
import { Appointment as CustomerAppointment } from "@/lib/types";
import { Appointment as OverviewAppointment } from "@/lib/overview/types";

/**
 * Converts an overview appointment to a customer appointment
 */
export function overviewToCustomerAppointment(appointment: OverviewAppointment): CustomerAppointment {
  return {
    id: String(appointment.id),
    date: appointment.date,
    customerId: "",
    customerName: appointment.customerName || "",
    customerEmail: appointment.customerEmail,
    vehicleInfo: appointment.vehicleModel,
    vehicleMake: "",
    vehicleModel: appointment.vehicleModel,
    vehicleLicense: appointment.licensePlate,
    serviceType: appointment.serviceType,
    notes: "",
    isPaid: false,
    isCompleted: appointment.isCompleted || false
  };
}

/**
 * Converts a customer appointment to an overview appointment
 */
export function customerToOverviewAppointment(appointment: CustomerAppointment): OverviewAppointment {
  return {
    id: parseInt(appointment.id) || Math.floor(Math.random() * 10000),
    date: appointment.date,
    vehicleModel: appointment.vehicleModel || appointment.vehicleInfo,
    serviceType: appointment.serviceType,
    isCompleted: appointment.isCompleted,
    customerEmail: appointment.customerEmail,
    customerName: appointment.customerName,
    licensePlate: appointment.vehicleLicense
  };
}
