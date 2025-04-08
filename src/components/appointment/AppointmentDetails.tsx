
import { format } from "date-fns";
import { Appointment, ServiceType } from "@/lib/types";
import { SERVICE_TYPES } from "@/lib/serviceTypes";
import { useLanguage } from "@/context/LanguageContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
        <div className="space-y-2">
          <Label htmlFor="date" className="text-sm font-medium">
            {t('appointment.date')}
          </Label>
          <Input
            id="date"
            type="datetime-local"
            value={formData.date ? format(formData.date, "yyyy-MM-dd'T'HH:mm") : ''}
            onChange={handleDateChange}
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="serviceType" className="text-sm font-medium">
            {t('appointment.serviceType')}
          </Label>
          <Select 
            value={formData.serviceType.toString()} 
            onValueChange={handleServiceTypeChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('serviceTypes.select')} />
            </SelectTrigger>
            <SelectContent>
              {Object.values(SERVICE_TYPES).map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className="h-2 w-2 rounded-full cursor-help" 
                            style={{ backgroundColor: type.color }}
                          ></div>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{type.color}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <span>
                      {t(getServiceTypeTranslationKey(type.id))} ({type.code || type.id})
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-medium">
          {t('appointment.notes')}
        </Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full resize-none"
          placeholder={t('appointment.notes')}
        />
      </div>
    </div>
  );
}
