
import { Car } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Vehicle } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";

interface VehicleFormProps {
  vehicles: Vehicle[];
  newVehicle: Partial<Vehicle>;
  setNewVehicle: React.Dispatch<React.SetStateAction<Partial<Vehicle>>>;
  onAddVehicle: () => void;
  onRemoveVehicle: (vehicleId: string) => void;
}

export function VehicleForm({ 
  vehicles, 
  newVehicle, 
  setNewVehicle, 
  onAddVehicle, 
  onRemoveVehicle 
}: VehicleFormProps) {
  const { t } = useLanguage();
  
  return (
    <>
      {vehicles && vehicles.length > 0 ? (
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">{t('customer.addedVehicles')}</h3>
          <div className="space-y-2">
            {vehicles.map((vehicle, index) => (
              <div 
                key={index} 
                className="bg-muted p-3 rounded-md flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">
                    {vehicle.make} {vehicle.model}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {vehicle.license}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onRemoveVehicle(vehicle.id)}
                >
                  {t('actions.remove')}
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-muted/50 p-4 rounded-md text-center text-muted-foreground mb-4">
          <Car className="h-12 w-12 mx-auto mb-2 opacity-30" />
          <p>{t('customer.noVehicles')}</p>
        </div>
      )}
      
      <div className="bg-card border rounded-md p-4">
        <h3 className="text-sm font-medium mb-3">{t('customer.addVehicle')}</h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="space-y-2">
            <label htmlFor="make" className="text-xs font-medium">
              {t('vehicle.make')}
            </label>
            <Input
              id="make"
              value={newVehicle.make || ""}
              onChange={(e) => setNewVehicle({...newVehicle, make: e.target.value})}
              placeholder={t('vehicle.makePlaceholder')}
              className="text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="model" className="text-xs font-medium">
              {t('vehicle.model')}
            </label>
            <Input
              id="model"
              value={newVehicle.model || ""}
              onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
              placeholder={t('vehicle.modelPlaceholder')}
              className="text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="license" className="text-xs font-medium">
              {t('vehicle.license')}
            </label>
            <Input
              id="license"
              value={newVehicle.license || ""}
              onChange={(e) => setNewVehicle({...newVehicle, license: e.target.value})}
              placeholder={t('vehicle.licensePlaceholder')}
              className="text-sm"
            />
          </div>
          
          <div className="space-y-2 col-span-2">
            <label htmlFor="vin" className="text-xs font-medium">
              {t('vehicle.vin')}
            </label>
            <Input
              id="vin"
              value={newVehicle.vin || ""}
              onChange={(e) => setNewVehicle({...newVehicle, vin: e.target.value})}
              placeholder={t('vehicle.vinPlaceholder')}
              className="text-sm"
            />
          </div>
          
          <div className="space-y-2 col-span-2">
            <label htmlFor="carId" className="text-xs font-medium">
              {t('vehicle.carId')}
            </label>
            <Input
              id="carId"
              value={newVehicle.carId || ""}
              onChange={(e) => setNewVehicle({...newVehicle, carId: e.target.value})}
              placeholder={t('vehicle.carIdPlaceholder')}
              className="text-sm"
            />
          </div>
        </div>
        
        <Button
          size="sm"
          onClick={onAddVehicle}
          disabled={!newVehicle.make || !newVehicle.model || !newVehicle.license}
          className="bg-blue-400 hover:bg-blue-500 text-white"
        >
          {t('customer.addVehicle')}
        </Button>
      </div>
    </>
  );
}
