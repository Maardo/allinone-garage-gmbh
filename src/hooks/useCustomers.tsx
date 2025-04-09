
import { useState } from "react";
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
    setPreviousCustomers
  });

  const [searchTerm, setSearchTerm] = useState("");
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
    isLoading
  };
}
