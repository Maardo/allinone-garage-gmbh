
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Customer, Vehicle } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";
import { VehicleForm } from "./VehicleForm";
import { CustomerDetailsTab } from "./CustomerDetailsTab";

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
        <CustomerDetailsTab 
          customer={customer}
          updateCustomer={updateCustomer}
          updateAddress={updateAddress}
        />
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
