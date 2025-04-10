
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useOverviewAppointments } from "@/hooks/useOverviewAppointments";
import { useEffect } from "react";

interface AppointmentFormProps {
  initialData?: Appointment;
  onSubmit: (data: Appointment) => void;
  existingAppointments?: Appointment[];
}

export function AppointmentForm({ initialData, onSubmit, existingAppointments = [] }: AppointmentFormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { refreshData: refreshOverviewData } = useOverviewAppointments();
  const { formData, handleChange, handleServiceTypeChange, handleDateChange, handleSwitchChange, validateDateAvailability } = useAppointmentForm(initialData);

  // Refresh overview data when form is mounted
  useEffect(() => {
    refreshOverviewData();
  }, [refreshOverviewData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for overlapping appointments
    if (!validateDateAvailability(existingAppointments)) {
      toast({
        title: t('appointment.timeConflict'),
        description: t('appointment.timeConflictDescription'),
        variant: "destructive"
      });
      return;
    }
    
    await onSubmit(formData);
    
    // Refresh overview data after submission
    refreshOverviewData();
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

      <Tabs defaultValue="customer" className="w-full">
        <TabsList className="grid grid-cols-2 mb-2">
          <TabsTrigger value="customer">{t('appointment.customerDetails')}</TabsTrigger>
          <TabsTrigger value="vehicle">{t('appointment.vehicleDetails')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="customer" className="mt-0">
          <Card className="p-4">
            <CustomerDetails formData={formData} handleChange={handleChange} />
          </Card>
        </TabsContent>
        
        <TabsContent value="vehicle" className="mt-0">
          <Card className="p-4">
            <VehicleDetails formData={formData} handleChange={handleChange} handleSwitchChange={handleSwitchChange} />
          </Card>
        </TabsContent>
      </Tabs>

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

        {formData.needsLoanerCar && (
          <div className="mt-2 pt-2 border-t">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {formData.loanerCarId ? t('loanerCar.assigned') : t('loanerCar.requested')}
              </Badge>
              <span className="text-sm">{t('appointment.needsLoanerCar')}</span>
            </div>
          </div>
        )}
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
