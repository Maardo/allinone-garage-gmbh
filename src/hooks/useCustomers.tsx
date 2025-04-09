
import { useState, useEffect } from "react";
import { Customer, Vehicle } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { useOverviewAppointments } from "@/hooks/useOverviewAppointments";
import { MOCK_CUSTOMERS } from "@/lib/customers/mockData";
import { useAuth } from "@/context/AuthContext";
import { 
  createCustomer, 
  createVehicle, 
  filterCustomers, 
  fetchCustomersFromDb,
  addCustomerToDb,
  updateCustomerInDb,
  deleteCustomerFromDb,
  importMockDataToDb
} from "@/lib/customers/customerService";

export function useCustomers() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previousCustomers, setPreviousCustomers] = useState<Customer[]>([]);
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

  // Fetch customers from Supabase on component mount
  useEffect(() => {
    const loadCustomers = async () => {
      setIsLoading(true);
      try {
        // Make sure we have a user before trying to load data
        if (!currentUser) {
          console.log("No current user, using mock data");
          setCustomers(MOCK_CUSTOMERS);
          setPreviousCustomers(MOCK_CUSTOMERS);
          setIsLoading(false);
          return;
        }

        console.log("Loading customers for user:", currentUser.id);
        const dbCustomers = await fetchCustomersFromDb(currentUser.id);
        
        if (dbCustomers.length > 0) {
          console.log(`Found ${dbCustomers.length} customers in database`);
          setCustomers(dbCustomers);
          setPreviousCustomers(dbCustomers);
        } else {
          console.log("No customers found in database, importing mock data");
          // Import mock data to database for this user
          const imported = await importMockDataToDb(MOCK_CUSTOMERS, currentUser.id);
          
          if (imported) {
            // After importing, fetch the customers again with proper IDs
            const importedCustomers = await fetchCustomersFromDb(currentUser.id);
            setCustomers(importedCustomers);
            setPreviousCustomers(importedCustomers);
          } else {
            // Fallback to mock data if import fails
            setCustomers(MOCK_CUSTOMERS);
            setPreviousCustomers(MOCK_CUSTOMERS);
          }
        }
      } catch (error) {
        console.error("Error loading customers:", error);
        // Fallback to mock data on error
        setCustomers(MOCK_CUSTOMERS);
        setPreviousCustomers(MOCK_CUSTOMERS);
      } finally {
        setIsLoading(false);
      }
    };

    loadCustomers();
  }, [currentUser]);

  const filteredCustomers = filterCustomers(customers, searchTerm);

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
    const { id } = toast({
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
    if (!success) {
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
    if (!success) {
      // Handle error (optional: could revert state here)
      toast({
        title: t('common.error'),
        description: t('customer.errorDeleting'),
        variant: "destructive",
      });
    }
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
    handleDeleteCustomer,
    isLoading
  };
}
