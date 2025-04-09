
import { useState } from "react";
import { Customer, Vehicle } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { useOverviewAppointments } from "@/hooks/useOverviewAppointments";
import { MOCK_CUSTOMERS } from "@/lib/customers/mockData";
import { createCustomer, createVehicle, filterCustomers } from "@/lib/customers/customerService";

export function useCustomers() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const { updateTotalCustomers } = useOverviewAppointments();
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

  const filteredCustomers = filterCustomers(customers, searchTerm);

  const handleAddCustomer = () => {
    if (!newCustomer.name) return;
    
    const customer = createCustomer(newCustomer);
    
    setCustomers([...customers, customer]);
    // Update total customers count
    updateTotalCustomers(1);
    
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
    
    toast({
      title: t('customer.addedTitle'),
      description: t('customer.addedDescription'),
    });

    return customer;
  };

  const handleUpdateCustomer = () => {
    if (!selectedCustomer || !selectedCustomer.name) return;
    
    const updatedCustomers = customers.map(c => 
      c.id === selectedCustomer.id ? selectedCustomer : c
    );
    
    setCustomers(updatedCustomers);
    
    toast({
      title: t('customer.updatedTitle'),
      description: t('customer.updatedDescription'),
    });

    return selectedCustomer;
  };

  const handleDeleteCustomer = () => {
    if (!selectedCustomer) return;
    
    const updatedCustomers = customers.filter(c => c.id !== selectedCustomer.id);
    setCustomers(updatedCustomers);
    
    // Update total customers count
    updateTotalCustomers(-1);
    
    toast({
      title: t('customer.deletedTitle'),
      description: t('customer.deletedDescription'),
    });
  };

  return {
    customers,
    filteredCustomers,
    searchTerm,
    setSearchTerm,
    selectedCustomer,
    setSelectedCustomer,
    newCustomer,
    setNewCustomer,
    handleAddCustomer,
    handleUpdateCustomer,
    handleDeleteCustomer
  };
}
