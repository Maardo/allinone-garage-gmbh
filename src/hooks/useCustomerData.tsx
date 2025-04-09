
import { useState, useEffect } from "react";
import { Customer } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { MOCK_CUSTOMERS } from "@/lib/customers/mockData";
import { 
  fetchCustomersFromDb,
  importMockDataToDb
} from "@/lib/customers/customerService";

export function useCustomerData() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previousCustomers, setPreviousCustomers] = useState<Customer[]>([]);
  const { currentUser } = useAuth();

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

  return {
    customers,
    setCustomers,
    isLoading,
    previousCustomers,
    setPreviousCustomers
  };
}
