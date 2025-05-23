
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Appointment, ServiceType } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";
import { format, isValid } from "date-fns";
import { sv, de, enUS } from "date-fns/locale";

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
  const { t, language } = useLanguage();

  // Get the appropriate locale based on the selected language
  const getLocale = () => {
    switch (language) {
      case 'sv':
        return sv;
      case 'de':
        return de;
      case 'en':
      default:
        return enUS;
    }
  };

  // Format the date for the input value using 24-hour time format
  const dateValue = formData.date;
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  
  // Default to current time if date is invalid
  const formattedDate = isValid(date) 
    ? format(date, "yyyy-MM-dd'T'HH:mm", { locale: getLocale() }) 
    : format(new Date(), "yyyy-MM-dd'T'HH:mm", { locale: getLocale() });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">{t('appointment.date')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">{t('appointment.date')}</Label>
          <Input
            type="datetime-local"
            id="date"
            name="date"
            value={formattedDate}
            onChange={handleDateChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="serviceType">{t('appointment.serviceType')}</Label>
          <Select 
            value={formData.serviceType.toString()} 
            onValueChange={handleServiceTypeChange}
          >
            <SelectTrigger id="serviceType">
              <SelectValue placeholder={t('appointment.serviceType')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">{t('serviceTypes.maintenance')}</SelectItem>
              <SelectItem value="2">{t('serviceTypes.repair')}</SelectItem>
              <SelectItem value="3">{t('serviceTypes.inspection')}</SelectItem>
              <SelectItem value="4">{t('serviceTypes.tireChange')}</SelectItem>
              <SelectItem value="5">{t('serviceTypes.other')}</SelectItem>
            </SelectContent>
          </Select>
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
    </div>
  );
}
