
import { Appointment } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Car } from "lucide-react";

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

      <div className="mt-6 p-4 border-2 border-blue-200 rounded-lg bg-blue-50 shadow-sm">
        <div className="flex items-center space-x-3">
          <Checkbox 
            id="needsLoanerCar" 
            checked={formData.needsLoanerCar || false}
            onCheckedChange={(checked) => handleSwitchChange('needsLoanerCar', checked === true)}
            className="h-6 w-6 border-2 border-blue-400"
          />
          <Label htmlFor="needsLoanerCar" className="text-lg font-medium cursor-pointer flex items-center gap-2">
            <Car className="h-5 w-5 text-blue-600" />
            {t('appointment.needsLoanerCar')}
          </Label>
        </div>
      </div>
    </div>
  );
}
