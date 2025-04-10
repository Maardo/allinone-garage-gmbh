
import { useState, useCallback } from "react";
import { Customer } from "@/lib/types";
import { useCustomerData } from "./useCustomerData";
import { useCustomerOperations } from "./useCustomerOperations";
import { filterCustomers } from "@/lib/customers/customerService";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

export function useCustomers() {
  const { t } = useLanguage();
  const {
    customers,
    setCustomers,
    isLoading,
    previousCustomers,
    setPreviousCustomers,
    refreshData
  } = useCustomerData();

  const [searchTerm, setSearchTerm] = useState("");
  
  // Create a refresh function that can be called from other components
  const refreshCustomers = useCallback(async () => {
    if (refreshData) {
      try {
        await refreshData();
        // Don't return a boolean, just return void to match the expected type
      } catch (error) {
        console.error("Error refreshing customer data:", error);
      }
    }
  }, [refreshData]);

  const {
    selectedCustomer,
    setSelectedCustomer,
    newCustomer,
    setNewCustomer,
    handleAddCustomer: originalHandleAddCustomer,
    handleUpdateCustomer,
    handleDeleteCustomer
  } = useCustomerOperations({
    customers,
    setCustomers,
    previousCustomers,
    setPreviousCustomers,
    refreshData: refreshCustomers
  });

  // Enhanced handleAddCustomer that accepts a customer object parameter
  const handleAddCustomer = useCallback(async (customerData?: Partial<Customer>) => {
    if (customerData) {
      // Create a temporary customer object
      const tempCustomer = {
        ...newCustomer,
        name: customerData.name || newCustomer.name,
        email: customerData.email || newCustomer.email,
        phone: customerData.phone || newCustomer.phone,
        notes: customerData.notes || newCustomer.notes,
        address: customerData.address || newCustomer.address,
        vehicles: customerData.vehicles || newCustomer.vehicles
      };
      
      setNewCustomer(tempCustomer);
      
      try {
        await originalHandleAddCustomer();
        // Refresh customer data
        await refreshCustomers();
        return true;
      } catch (error) {
        console.error("Error adding customer:", error);
        toast.error(t('common.error'));
        return false;
      }
    } else {
      try {
        await originalHandleAddCustomer();
        return true;
      } catch (error) {
        console.error("Error adding customer:", error);
        toast.error(t('common.error'));
        return false;
      }
    }
  }, [newCustomer, originalHandleAddCustomer, refreshCustomers, setNewCustomer, t]);

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
