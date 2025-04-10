
import { Customer } from "@/lib/types";
import { useCustomerState } from "./customers/useCustomerState";
import { useCustomerActions } from "./customers/useCustomerActions";

interface UseCustomerOperationsProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  previousCustomers: Customer[];
  setPreviousCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  refreshData?: () => Promise<void>;
}

export function useCustomerOperations({ 
  customers, 
  setCustomers,
  previousCustomers,
  setPreviousCustomers,
  refreshData 
}: UseCustomerOperationsProps) {
  
  // Extract state management to a separate hook
  const {
    selectedCustomer,
    setSelectedCustomer,
    newCustomer,
    setNewCustomer,
    resetNewCustomerForm
  } = useCustomerState();

  // Extract action handlers to a separate hook
  const {
    handleAddCustomer,
    handleUpdateCustomer,
    handleDeleteCustomer
  } = useCustomerActions({
    customers,
    setCustomers,
    previousCustomers,
    setPreviousCustomers,
    selectedCustomer,
    newCustomer,
    resetNewCustomerForm,
    refreshData
  });

  return {
    selectedCustomer,
    setSelectedCustomer,
    newCustomer,
    setNewCustomer,
    handleAddCustomer,
    handleUpdateCustomer,
    handleDeleteCustomer
  };
}
