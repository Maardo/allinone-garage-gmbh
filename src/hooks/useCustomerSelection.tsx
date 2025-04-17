
import { useState, useCallback } from 'react';
import { Customer, Vehicle, Appointment } from '@/lib/types';
import { useCustomers } from './useCustomers';

export function useCustomerSelection(formData: Appointment, handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void) {
  const { customers } = useCustomers();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const handleSelectCustomer = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);

    // Create synthetic change events for each field
    const createChangeEvent = (name: string, value: string) => ({
      target: { name, value }
    }) as React.ChangeEvent<HTMLInputElement>;

    // Update customer details
    handleChange(createChangeEvent("customerName", customer.name));
    handleChange(createChangeEvent("customerEmail", customer.email || ""));
    handleChange(createChangeEvent("customerPhone", customer.phone || ""));
    
    // Update address
    if (customer.address) {
      handleChange(createChangeEvent("customerAddress.street", customer.address.street || ""));
      handleChange(createChangeEvent("customerAddress.zipCode", customer.address.zipCode || ""));
      handleChange(createChangeEvent("customerAddress.city", customer.address.city || ""));
    }

    // If customer has vehicles, use the first one's details
    if (customer.vehicles && customer.vehicles.length > 0) {
      const primaryVehicle = customer.vehicles[0];
      handleChange(createChangeEvent("vehicleMake", primaryVehicle.make));
      handleChange(createChangeEvent("vehicleModel", primaryVehicle.model));
      handleChange(createChangeEvent("vehicleLicense", primaryVehicle.license));
      handleChange(createChangeEvent("vehicleVin", primaryVehicle.vin));
      handleChange(createChangeEvent("vehicleCarId", primaryVehicle.carId));
      handleChange(createChangeEvent("vehicleInfo", `${primaryVehicle.make} ${primaryVehicle.model} (${primaryVehicle.license})`));
    }
  }, [handleChange]);

  return {
    selectedCustomer,
    handleSelectCustomer,
    customers
  };
}
