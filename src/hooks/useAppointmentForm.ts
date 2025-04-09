
import { useState } from "react";
import { Appointment, ServiceType } from "@/lib/types";
import { addHours, areIntervalsOverlapping } from "date-fns";
import { useOverviewAppointments } from "@/hooks/useOverviewAppointments";

export function useAppointmentForm(initialData?: Appointment) {
  const { updateTotalCustomers } = useOverviewAppointments();
  const [formData, setFormData] = useState<Appointment>(() => {
    if (initialData) return { ...initialData };
    
    return {
      id: "",
      date: new Date(),
      customerId: "",
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      customerAddress: {
        street: "",
        zipCode: "",
        city: "",
      },
      vehicleInfo: "",
      vehicleMake: "",
      vehicleModel: "", 
      vehicleLicense: "",
      vehicleVin: "",
      vehicleCarId: "",
      serviceType: 1 as ServiceType,
      notes: "",
      isPaid: false,
      isCompleted: false,
      needsLoanerCar: false,
      loanerCarId: undefined,
    };
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof Appointment] as object || {}),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleServiceTypeChange = (value: string) => {
    const serviceTypeValue = parseInt(value) as ServiceType;
    setFormData((prev) => ({ ...prev, serviceType: serviceTypeValue }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Make sure we handle the date in a 24-hour time format
    if (e.target.value) {
      const dateObj = new Date(e.target.value);
      if (!isNaN(dateObj.getTime())) {
        setFormData((prev) => ({ ...prev, date: dateObj }));
      }
    }
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // Validate that the appointment time doesn't conflict with other appointments
  const validateDateAvailability = (existingAppointments: Appointment[]) => {
    // Skip validation if it's updating the same appointment
    const appointmentsToCheck = existingAppointments.filter(
      appointment => appointment.id !== formData.id
    );

    // Default appointment duration is 1 hour
    const appointmentStart = formData.date;
    const appointmentEnd = addHours(appointmentStart, 1);
    
    // Check for overlapping appointments
    const hasConflict = appointmentsToCheck.some(existing => {
      const existingStart = new Date(existing.date);
      const existingEnd = addHours(existingStart, 1);
      
      return areIntervalsOverlapping(
        { start: appointmentStart, end: appointmentEnd },
        { start: existingStart, end: existingEnd }
      );
    });
    
    return !hasConflict;
  };

  return {
    formData,
    handleChange,
    handleServiceTypeChange,
    handleDateChange,
    handleSwitchChange,
    validateDateAvailability,
  };
}
