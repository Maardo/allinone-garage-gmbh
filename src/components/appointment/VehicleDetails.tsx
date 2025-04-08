
import { Appointment } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface VehicleDetailsProps {
  formData: Appointment;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

export function VehicleDetails({ formData, handleChange, handleSwitchChange }: VehicleDetailsProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="vehicleMake">{t('appointment.vehicleMake')}</Label>
        <Input
          id="vehicleMake"
          name="vehicleMake"
          value={formData.vehicleMake}
          onChange={handleChange}
          placeholder={t('vehicle.makePlaceholder')}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="vehicleLicense">{t('appointment.vehicleLicense')}</Label>
          <Input
            id="vehicleLicense"
            name="vehicleLicense"
            value={formData.vehicleLicense}
            onChange={handleChange}
            placeholder={t('vehicle.licensePlaceholder')}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="vehicleVin">{t('appointment.vehicleVin')}</Label>
          <Input
            id="vehicleVin"
            name="vehicleVin"
            value={formData.vehicleVin}
            onChange={handleChange}
            placeholder={t('vehicle.vinPlaceholder')}
          />
        </div>
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="vehicleCarId">{t('appointment.vehicleCarId')}</Label>
        <Input
          id="vehicleCarId"
          name="vehicleCarId"
          value={formData.vehicleCarId}
          onChange={handleChange}
          placeholder={t('vehicle.carIdPlaceholder')}
        />
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <Checkbox 
          id="needsLoanerCar" 
          checked={formData.needsLoanerCar || false}
          onCheckedChange={(checked) => handleSwitchChange('needsLoanerCar', checked === true)}
        />
        <Label htmlFor="needsLoanerCar" className="text-sm font-medium cursor-pointer">
          {t('appointment.needsLoanerCar')}
        </Label>
      </div>
    </div>
  );
}
