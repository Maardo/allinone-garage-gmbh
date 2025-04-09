
import { useState, useCallback } from "react";
import { Customer } from "@/lib/types";
import { useCustomerData } from "./useCustomerData";
import { useCustomerOperations } from "./useCustomerOperations";
import { filterCustomers } from "@/lib/customers/customerService";

export function useCustomers() {
  const {
    customers,
    setCustomers,
    isLoading,
    previousCustomers,
    setPreviousCustomers
  } = useCustomerData();

  const [searchTerm, setSearchTerm] = useState("");
  
  // Create a refresh function that can be called from other components
  const refreshCustomers = useCallback(async () => {
    const { refreshData } = useCustomerData();
    if (refreshData) {
      await refreshData();
    }
  }, []);

  const {
    selectedCustomer,
    setSelectedCustomer,
    newCustomer,
    setNewCustomer,
    handleAddCustomer,
    handleUpdateCustomer,
    handleDeleteCustomer
  } = useCustomerOperations({
    customers,
    setCustomers,
    previousCustomers,
    setPreviousCustomers,
    refreshData: refreshCustomers
  });

  const filteredCustomers = filterCustomers(customers, searchTerm);

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
    handleDeleteCustomer,
    isLoading,
    refreshCustomers
  };
}
