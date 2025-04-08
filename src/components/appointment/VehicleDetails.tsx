
import { Appointment } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface VehicleDetailsProps {
  formData: Appointment;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function VehicleDetails({ formData, handleChange }: VehicleDetailsProps) {
  const { t } = useLanguage();

  return (
    <Card className="p-5 border-gray-200 shadow-sm">
      <h3 className="text-lg font-medium mb-4 pb-2 border-b">{t('appointment.vehicleDetails')}</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="vehicleMake" className="text-gray-700">{t('appointment.vehicleMake')}</Label>
          <Input
            id="vehicleMake"
            name="vehicleMake"
            value={formData.vehicleMake}
            onChange={handleChange}
            placeholder={t('vehicle.makePlaceholder')}
            className="bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vehicleLicense" className="text-gray-700">{t('appointment.vehicleLicense')}</Label>
            <Input
              id="vehicleLicense"
              name="vehicleLicense"
              value={formData.vehicleLicense}
              onChange={handleChange}
              placeholder={t('vehicle.licensePlaceholder')}
              className="bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleVin" className="text-gray-700">{t('appointment.vehicleVin')}</Label>
            <Input
              id="vehicleVin"
              name="vehicleVin"
              value={formData.vehicleVin}
              onChange={handleChange}
              placeholder={t('vehicle.vinPlaceholder')}
              className="bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="vehicleCarId" className="text-gray-700">{t('appointment.vehicleCarId')}</Label>
          <Input
            id="vehicleCarId"
            name="vehicleCarId"
            value={formData.vehicleCarId}
            onChange={handleChange}
            placeholder={t('vehicle.carIdPlaceholder')}
            className="bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    </Card>
  );
}
