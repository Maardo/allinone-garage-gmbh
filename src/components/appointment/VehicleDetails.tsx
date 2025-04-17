
import { Appointment, Customer, Vehicle } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Car } from "lucide-react";
import { useCustomers } from "@/hooks/useCustomers";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { useState } from "react";

interface VehicleDetailsProps {
  formData: Appointment;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

export function VehicleDetails({ formData, handleChange, handleSwitchChange }: VehicleDetailsProps) {
  const { t } = useLanguage();
  const { customers } = useCustomers();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Handle selecting a vehicle from a customer
  const handleSelectVehicle = (customer: Customer, vehicle: Vehicle) => {
    // Create artificial change events for each vehicle field
    const createChangeEvent = (name: string, value: string) => ({
      target: { name, value }
    }) as React.ChangeEvent<HTMLInputElement>;
    
    // Update vehicle fields
    handleChange(createChangeEvent("vehicleMake", vehicle.make));
    handleChange(createChangeEvent("vehicleModel", vehicle.model));
    handleChange(createChangeEvent("vehicleLicense", vehicle.license));
    handleChange(createChangeEvent("vehicleVin", vehicle.vin || ""));
    handleChange(createChangeEvent("vehicleCarId", vehicle.carId || ""));
    
    // Also update customer fields
    handleChange(createChangeEvent("customerName", customer.name));
    handleChange(createChangeEvent("customerEmail", customer.email || ""));
    handleChange(createChangeEvent("customerPhone", customer.phone || ""));
    
    // Update address fields if available
    if (customer.address) {
      handleChange(createChangeEvent("customerAddress.street", customer.address.street || ""));
      handleChange(createChangeEvent("customerAddress.zipCode", customer.address.zipCode || ""));
      handleChange(createChangeEvent("customerAddress.city", customer.address.city || ""));
    }
    
    setSearchTerm(`${vehicle.make} ${vehicle.model} - ${vehicle.license}`);
    setOpen(false);
  };

  // Filter customers with vehicles
  const customersWithVehicles = customers.filter(customer => 
    customer.vehicles && customer.vehicles.length > 0
  );

  return (
    <div className="space-y-3">
      <div className="space-y-1.5 mb-4">
        <Label htmlFor="vehicleSearch">{t('customer.search')}</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              role="combobox" 
              aria-expanded={open}
              className="w-full justify-between"
            >
              {searchTerm || t('vehicle.licensePlaceholder')}
              <Car className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder={t('vehicle.licensePlaceholder')} />
              <CommandList>
                <CommandEmpty>{t('customer.noVehicles')}</CommandEmpty>
                {customersWithVehicles.map((customer) => (
                  <CommandGroup key={customer.id} heading={customer.name}>
                    {customer.vehicles?.map((vehicle) => (
                      <CommandItem
                        key={vehicle.id}
                        value={`${vehicle.make} ${vehicle.model} ${vehicle.license}`}
                        onSelect={() => handleSelectVehicle(customer, vehicle)}
                        className="cursor-pointer"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {vehicle.make} {vehicle.model}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {vehicle.license}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                    <CommandSeparator />
                  </CommandGroup>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="vehicleMake">{t('appointment.vehicleMake')}</Label>
        <Input
          id="vehicleMake"
          name="vehicleMake"
          value={formData.vehicleMake || ""}
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
            value={formData.vehicleLicense || ""}
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
            value={formData.vehicleVin || ""}
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
          value={formData.vehicleCarId || ""}
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
