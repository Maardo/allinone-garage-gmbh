
import { Button } from "@/components/ui/button";
import { Appointment } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";
import { useAppointmentForm } from "@/hooks/useAppointmentForm";
import { AppointmentDetails } from "./appointment/AppointmentDetails";
import { CustomerDetails } from "./appointment/CustomerDetails";
import { VehicleDetails } from "./appointment/VehicleDetails";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface AppointmentFormProps {
  initialData?: Appointment;
  onSubmit: (data: Appointment) => void;
}

export function AppointmentForm({ initialData, onSubmit }: AppointmentFormProps) {
  const { t } = useLanguage();
  const { formData, handleChange, handleServiceTypeChange, handleDateChange, handleSwitchChange } = useAppointmentForm(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl mx-auto">
      <Card className="p-4">
        <AppointmentDetails
          formData={formData}
          handleDateChange={handleDateChange}
          handleServiceTypeChange={handleServiceTypeChange}
          handleChange={handleChange}
        />
      </Card>

      <Card className="p-4">
        <h2 className="text-base font-medium mb-3">{t('appointment.customerDetails')}</h2>
        <CustomerDetails formData={formData} handleChange={handleChange} />
      </Card>
      
      <Card className="p-4">
        <h2 className="text-base font-medium mb-3">{t('appointment.vehicleDetails')}</h2>
        <VehicleDetails formData={formData} handleChange={handleChange} />
      </Card>

      <Card className="p-4 flex flex-col space-y-3">
        <h2 className="text-base font-medium">{t('appointment.status')}</h2>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <Switch 
                checked={formData.isCompleted} 
                onCheckedChange={(checked) => handleSwitchChange('isCompleted', checked)} 
                id="completed-status"
              />
              <Label htmlFor="completed-status">{t('appointment.completed')}</Label>
            </div>
            <p className="text-sm text-muted-foreground">{formData.isCompleted ? t('appointment.vehicleReady') : t('appointment.vehicleInProgress')}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`h-3 w-3 rounded-full ${formData.isCompleted ? 'bg-green-500' : 'bg-amber-500'}`}></div>
            <span className="text-sm">{formData.isCompleted ? t('appointment.ready') : t('appointment.ongoing')}</span>
          </div>
        </div>
      </Card>

      <div className="flex justify-end pt-2">
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
