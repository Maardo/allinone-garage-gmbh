
import { Customer } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { 
  createCustomer, 
  addCustomerToDb,
  updateCustomerInDb,
  deleteCustomerFromDb
} from "@/lib/customers/customerService";
import { syncCustomerCount, fetchStats, updateStats } from "@/services/statsService";

interface UseCustomerActionsProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  previousCustomers: Customer[];
  setPreviousCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  selectedCustomer: Customer | null;
  newCustomer: Partial<Customer>;
  resetNewCustomerForm: () => void;
  refreshData?: () => Promise<void>;
}

export function useCustomerActions({
  customers,
  setCustomers,
  previousCustomers, 
  setPreviousCustomers,
  selectedCustomer,
  newCustomer,
  resetNewCustomerForm,
  refreshData
}: UseCustomerActionsProps) {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { currentUser } = useAuth();

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

  const updateTotalCustomers = async (change: number) => {
    try {
      // Get current stats
      const currentStats = await fetchStats();
      
      // Update stats with the new count
      const updatedStats = {
        ...currentStats,
        totalCustomers: currentStats.totalCustomers + change
      };
      
      // Save updated stats
      await updateStats(updatedStats);
    } catch (error) {
      console.error('Error updating total customers count:', error);
    }
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
    
    // Reset form
    resetNewCustomerForm();
    
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
      
      // Update total customers count
      await updateTotalCustomers(1);
      
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
      // Update total customers count
      await updateTotalCustomers(-1);
      
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
    handleAddCustomer,
    handleUpdateCustomer,
    handleDeleteCustomer
  };
}
