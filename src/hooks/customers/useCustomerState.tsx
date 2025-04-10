
import { useState } from "react";
import { Customer } from "@/lib/types";

export function useCustomerState() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: "",
    email: "",
    phone: "",
    notes: "",
    address: {
      street: "",
      zipCode: "",
      city: ""
    },
    vehicles: []
  });

  // Reset form function for reuse
  const resetNewCustomerForm = () => {
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      notes: "",
      address: {
        street: "",
        zipCode: "",
        city: ""
      },
      vehicles: []
    });
  };

  return {
    selectedCustomer,
    setSelectedCustomer,
    newCustomer,
    setNewCustomer,
    resetNewCustomerForm
  };
}
