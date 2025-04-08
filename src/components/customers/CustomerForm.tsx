
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, MapPin } from "lucide-react";
import { Customer, Vehicle } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";
import { VehicleForm } from "./VehicleForm";

interface CustomerFormProps {
  customer: Partial<Customer>;
  setCustomer: React.Dispatch<React.SetStateAction<any>>;
  isEdit: boolean;
}

export function CustomerForm({ customer, setCustomer, isEdit }: CustomerFormProps) {
  const { t } = useLanguage();
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    license: "",
    vin: "",
    carId: ""
  });

  const updateCustomer = (field: string, value: any) => {
    setCustomer({
      ...customer,
      [field]: value
    });
  };

  const updateAddress = (field: string, value: string) => {
    setCustomer({
      ...customer,
      address: {
        ...(customer.address || { street: "", zipCode: "", city: "" }),
        [field]: value
      }
    });
  };

  const handleAddVehicle = () => {
    if (!newVehicle.make || !newVehicle.model || !newVehicle.license) return;
    
    const vehicle: Vehicle = {
      id: Math.random().toString(36).substring(2, 9),
      make: newVehicle.make || "",
      model: newVehicle.model || "",
      year: newVehicle.year || new Date().getFullYear(),
      license: newVehicle.license || "",
      vin: newVehicle.vin || "",
      carId: newVehicle.carId || ""
    };
    
    setCustomer({
      ...customer,
      vehicles: [...(customer.vehicles || []), vehicle]
    });
    
    setNewVehicle({
      make: "",
      model: "",
      year: new Date().getFullYear(),
      license: "",
      vin: "",
      carId: ""
    });
  };

  const handleRemoveVehicle = (vehicleId: string) => {
    setCustomer({
      ...customer,
      vehicles: (customer.vehicles || []).filter(v => v.id !== vehicleId)
    });
  };

  return (
    <Tabs defaultValue="details" className="mt-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="details">{t('customer.details')}</TabsTrigger>
        <TabsTrigger value="vehiclesTab">{t('customer.vehiclesTab')}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="details" className="space-y-4 py-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              {t('customer.name')}
            </label>
            <Input
              id="name"
              value={customer.name || ""}
              onChange={(e) => updateCustomer('name', e.target.value)}
              placeholder={t('customer.namePlaceholder')}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              {t('customer.email')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="email"
                value={customer.email || ""}
                onChange={(e) => updateCustomer('email', e.target.value)}
                placeholder={t('customer.emailPlaceholder')}
                className="pl-10"
                type="email"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              {t('customer.phone')}
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="phone"
                value={customer.phone || ""}
                onChange={(e) => updateCustomer('phone', e.target.value)}
                placeholder={t('customer.phonePlaceholder')}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="street" className="text-sm font-medium">
              {t('customer.street')}
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="street"
                value={customer.address?.street || ""}
                onChange={(e) => updateAddress('street', e.target.value)}
                placeholder={t('customer.streetPlaceholder')}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label htmlFor="zipCode" className="text-sm font-medium">
                {t('customer.zipCode')}
              </label>
              <Input
                id="zipCode"
                value={customer.address?.zipCode || ""}
                onChange={(e) => updateAddress('zipCode', e.target.value)}
                placeholder={t('customer.zipCodePlaceholder')}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium">
                {t('customer.city')}
              </label>
              <Input
                id="city"
                value={customer.address?.city || ""}
                onChange={(e) => updateAddress('city', e.target.value)}
                placeholder={t('customer.cityPlaceholder')}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              {t('customer.notes')}
            </label>
            <Input
              id="notes"
              value={customer.notes || ""}
              onChange={(e) => updateCustomer('notes', e.target.value)}
              placeholder={t('customer.notesPlaceholder')}
            />
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="vehiclesTab" className="space-y-4 py-4">
        <VehicleForm 
          vehicles={customer.vehicles || []}
          newVehicle={newVehicle}
          setNewVehicle={setNewVehicle}
          onAddVehicle={handleAddVehicle}
          onRemoveVehicle={handleRemoveVehicle}
        />
      </TabsContent>
    </Tabs>
  );
}
