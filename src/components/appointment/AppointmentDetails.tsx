
import { format } from "date-fns";
import { Appointment, ServiceType } from "@/lib/types";
import { SERVICE_TYPES } from "@/lib/serviceTypes";
import { useLanguage } from "@/context/LanguageContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

interface AppointmentDetailsProps {
  formData: Appointment;
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleServiceTypeChange: (value: string) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function AppointmentDetails({ 
  formData, 
  handleDateChange, 
  handleServiceTypeChange,
  handleChange 
}: AppointmentDetailsProps) {
  const { t } = useLanguage();

  // Helper function to get the translation key for a service type
  const getServiceTypeTranslationKey = (typeId: number): string => {
    switch (typeId) {
      case 1: return 'serviceTypes.maintenance';
      case 2: return 'serviceTypes.repair';
      case 3: return 'serviceTypes.inspection';
      case 4: return 'serviceTypes.tireChange';
      case 5: return 'serviceTypes.other';
      default: return 'serviceTypes.other';
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">{t('appointment.date')}</Label>
          <Input
            id="date"
            type="datetime-local"
            value={formData.date ? format(formData.date, "yyyy-MM-dd'T'HH:mm") : ''}
            onChange={handleDateChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="serviceType">{t('appointment.serviceType')}</Label>
          <RadioGroup 
            value={formData.serviceType.toString()} 
            onValueChange={handleServiceTypeChange}
            className="grid grid-cols-2 sm:grid-cols-3 gap-2"
          >
            {Object.values(SERVICE_TYPES).map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <RadioGroupItem value={type.id.toString()} id={`service-${type.id}`} />
                <Label htmlFor={`service-${type.id}`}>
                  {t(getServiceTypeTranslationKey(type.id))}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">{t('appointment.notes')}</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
        />
      </div>
    </>
  );
}
