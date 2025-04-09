
import { useState } from "react";
import { Customer, Vehicle } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useOverviewAppointments } from "@/hooks/useOverviewAppointments";
import { 
  createCustomer, 
  createVehicle, 
  addCustomerToDb,
  updateCustomerInDb,
  deleteCustomerFromDb
} from "@/lib/customers/customerService";

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
  const { toast } = useToast();
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const { updateTotalCustomers } = useOverviewAppointments();
  
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

  const saveStateBeforeChange = () => {
    setPreviousCustomers([...customers]);
  };

  const undoLastChange = () => {
    setCustomers([...previousCustomers]);
    toast({
      title: t('actions.undone'),
      description: t('actions.changesReverted'),
    });
    return true;
  };

  const handleAddCustomer = async () => {
    if (!newCustomer.name) return;
    if (!currentUser) {
      toast({
        title: t('common.error'),
        description: "You must be logged in to add customers",
        variant: "destructive",
      });
      return;
    }
    
    saveStateBeforeChange();
    const customer = createCustomer(newCustomer);
    
    // First update UI for responsiveness
    setCustomers([...customers, customer]);
    // Update total customers count
    updateTotalCustomers(1);
    
    // Reset form
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
    
    // Show toast
    toast({
      title: t('customer.addedTitle'),
      description: t('customer.addedDescription'),
      action: (
        <button
          onClick={() => undoLastChange()}
          className="bg-secondary hover:bg-secondary/90 text-foreground px-3 py-1 rounded-md text-xs font-medium"
        >
          {t('actions.undo')}
        </button>
      ),
    });

    // Then persist to database
    const savedCustomer = await addCustomerToDb(customer, currentUser.id);
    if (savedCustomer) {
      // Update with saved customer from DB (with proper IDs)
      setCustomers(prev => prev.map(c => c.id === customer.id ? savedCustomer : c));
      
      // Refresh related data if needed
      if (refreshData) {
        await refreshData();
      }
    } else {
      // Handle error (optional: could revert state here)
      toast({
        title: t('common.error'),
        description: t('customer.errorSaving'),
        variant: "destructive",
      });
    }

    return customer;
  };

  const handleUpdateCustomer = async () => {
    if (!selectedCustomer || !selectedCustomer.name) return;
    if (!currentUser) {
      toast({
        title: t('common.error'),
        description: "You must be logged in to update customers",
        variant: "destructive",
      });
      return;
    }
    
    saveStateBeforeChange();
    
    // First update UI for responsiveness
    const updatedCustomers = customers.map(c => 
      c.id === selectedCustomer.id ? selectedCustomer : c
    );
    setCustomers(updatedCustomers);
    
    // Show toast
    toast({
      title: t('customer.updatedTitle'),
      description: t('customer.updatedDescription'),
      action: (
        <button
          onClick={() => undoLastChange()}
          className="bg-secondary hover:bg-secondary/90 text-foreground px-3 py-1 rounded-md text-xs font-medium"
        >
          {t('actions.undo')}
        </button>
      ),
    });

    // Then persist to database
    const success = await updateCustomerInDb(selectedCustomer, currentUser.id);
    if (success) {
      // Refresh related data if needed
      if (refreshData) {
        await refreshData();
      }
    } else {
      // Handle error (optional: could revert state here)
      toast({
        title: t('common.error'),
        description: t('customer.errorUpdating'),
        variant: "destructive",
      });
    }

    return selectedCustomer;
  };

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return;
    if (!currentUser) {
      toast({
        title: t('common.error'),
        description: "You must be logged in to delete customers",
        variant: "destructive",
      });
      return;
    }
    
    saveStateBeforeChange();
    
    // First update UI for responsiveness
    const updatedCustomers = customers.filter(c => c.id !== selectedCustomer.id);
    setCustomers(updatedCustomers);
    
    // Update total customers count
    updateTotalCustomers(-1);
    
    // Show toast
    toast({
      title: t('customer.deletedTitle'),
      description: t('customer.deletedDescription'),
      action: (
        <button
          onClick={() => undoLastChange()}
          className="bg-secondary hover:bg-secondary/90 text-foreground px-3 py-1 rounded-md text-xs font-medium"
        >
          {t('actions.undo')}
        </button>
      ),
    });

    // Then delete from database
    const success = await deleteCustomerFromDb(selectedCustomer.id);
    if (success) {
      // Refresh related data if needed
      if (refreshData) {
        await refreshData();
      }
    } else {
      // Handle error (optional: could revert state here)
      toast({
        title: t('common.error'),
        description: t('customer.errorDeleting'),
        variant: "destructive",
      });
    }
  };

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
