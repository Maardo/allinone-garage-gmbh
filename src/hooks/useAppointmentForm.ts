
import { useState } from "react";
import { Appointment, ServiceType } from "@/lib/types";

export function useAppointmentForm(initialData?: Appointment) {
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
    const [date, time] = e.target.value.split('T');
    const dateObj = new Date(`${date}T${time || '09:00'}`);
    setFormData((prev) => ({ ...prev, date: dateObj }));
  };

  return {
    formData,
    handleChange,
    handleServiceTypeChange,
    handleDateChange,
  };
}
