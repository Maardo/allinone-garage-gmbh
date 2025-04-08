
import { Button } from "@/components/ui/button";
import { Appointment } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";
import { useAppointmentForm } from "@/hooks/useAppointmentForm";
import { AppointmentDetails } from "./appointment/AppointmentDetails";
import { CustomerDetails } from "./appointment/CustomerDetails";
import { VehicleDetails } from "./appointment/VehicleDetails";
import { Card } from "@/components/ui/card";

interface AppointmentFormProps {
  initialData?: Appointment;
  onSubmit: (data: Appointment) => void;
}

export function AppointmentForm({ initialData, onSubmit }: AppointmentFormProps) {
  const { t } = useLanguage();
  const { formData, handleChange, handleServiceTypeChange, handleDateChange } = useAppointmentForm(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
      <AppointmentDetails
        formData={formData}
        handleDateChange={handleDateChange}
        handleServiceTypeChange={handleServiceTypeChange}
        handleChange={handleChange}
      />

      <CustomerDetails formData={formData} handleChange={handleChange} />
      
      <VehicleDetails formData={formData} handleChange={handleChange} />

      <div className="flex justify-end pt-4">
        <Button 
          type="submit"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
        >
          {initialData ? t('appointment.update') : t('appointment.create')}
        </Button>
      </div>
    </form>
  );
}
