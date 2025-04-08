
import { Appointment } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CustomerDetailsProps {
  formData: Appointment;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function CustomerDetails({ formData, handleChange }: CustomerDetailsProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="customerName">{t('appointment.customerName')}</Label>
          <Input
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="customerPhone">{t('appointment.customerPhone')}</Label>
          <Input
            id="customerPhone"
            name="customerPhone"
            value={formData.customerPhone}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="customerEmail">{t('appointment.customerEmail')}</Label>
        <Input
          id="customerEmail"
          name="customerEmail"
          type="email"
          value={formData.customerEmail}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="customerAddress.street">{t('appointment.customerAddress')}</Label>
        <Input
          id="customerAddress.street"
          name="customerAddress.street"
          value={formData.customerAddress.street}
          onChange={handleChange}
          placeholder={t('appointment.street')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="customerAddress.zipCode">{t('appointment.zipCode')}</Label>
          <Input
            id="customerAddress.zipCode"
            name="customerAddress.zipCode"
            value={formData.customerAddress.zipCode}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="customerAddress.city">{t('appointment.city')}</Label>
          <Input
            id="customerAddress.city"
            name="customerAddress.city"
            value={formData.customerAddress.city}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}
