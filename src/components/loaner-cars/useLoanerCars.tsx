
import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { LoanerCar } from '@/lib/types';
import { useCalendar } from '@/hooks/useCalendar';
import { INITIAL_LOANER_CARS } from './mockLoanerData';
import { useLoanerCarOperations } from './useLoanerCarOperations';
import { useLoanerCarManagement } from './useLoanerCarManagement';
import { useAuth } from "@/context/AuthContext";
import { fetchLoanerCarsFromDb, importLoanerCarsToDb } from '@/lib/loaner-cars/loanerCarDbService';
import { useToast } from '@/hooks/use-toast';
import { useCustomers } from '@/hooks/useCustomers';

export function useLoanerCars() {
  const [loanerCars, setLoanerCars] = useState<LoanerCar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const today = format(new Date(), "yyyy-MM-dd");
  const [assignData, setAssignData] = useState({
    customerId: "",
    startDate: today,
    returnDate: format(new Date(new Date().setDate(new Date().getDate() + 3)), "yyyy-MM-dd"),
  });
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { refreshCustomers } = useCustomers();

  const { appointments, handleAddAppointment } = useCalendar();

  // Filter appointments that need loaner cars but don't have one assigned yet
  const appointmentsNeedingCars = appointments.filter(
    appointment => appointment.needsLoanerCar && !appointment.loanerCarId
  );

  const loadLoanerCars = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!currentUser) {
        console.log("No current user, using mock data for loaner cars");
        setLoanerCars(INITIAL_LOANER_CARS);
        setIsLoading(false);
        return;
      }

      console.log("Loading loaner cars for user:", currentUser.id);
      const dbLoanerCars = await fetchLoanerCarsFromDb(currentUser.id);
      
      if (dbLoanerCars.length > 0) {
        console.log(`Found ${dbLoanerCars.length} loaner cars in database`);
        setLoanerCars(dbLoanerCars);
      } else {
        console.log("No loaner cars found in database, importing mock data");
        // Import mock data to database for this user
        const imported = await importLoanerCarsToDb(INITIAL_LOANER_CARS, currentUser.id);
        
        if (imported) {
          // After importing, fetch the loaner cars again with proper IDs
          const importedLoanerCars = await fetchLoanerCarsFromDb(currentUser.id);
          setLoanerCars(importedLoanerCars);
        } else {
          // Fallback to mock data if import fails
          setLoanerCars(INITIAL_LOANER_CARS);
        }
      }
    } catch (error) {
      console.error("Error loading loaner cars:", error);
      // Fallback to mock data on error
      setLoanerCars(INITIAL_LOANER_CARS);
      toast({
        title: "Error loading loaner cars",
        description: "There was an error loading your loaner cars. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, toast]);

  // Car operations
  const {
    selectedCar,
    setSelectedCar,
    handleAssign,
    handleUpdateDates,
    handleReturn,
    handleAssignToAppointment
  } = useLoanerCarOperations(loanerCars, setLoanerCars, handleAddAppointment, appointments, loadLoanerCars);

  // Car management
  const {
    newCar,
    setNewCar,
    handleAddCar,
    handleUpdateCar,
    handleDeleteCar,
    getAvailableLoanerCars
  } = useLoanerCarManagement(loanerCars, setLoanerCars, loadLoanerCars);

  // Load loaner cars from database on component mount
  useEffect(() => {
    loadLoanerCars();
  }, [loadLoanerCars]);

  // Ensure customer data is refreshed when needed
  useEffect(() => {
    refreshCustomers();
  }, [refreshCustomers]);

  return {
    loanerCars,
    selectedCar,
    setSelectedCar,
    appointmentsNeedingCars,
    assignData,
    setAssignData,
    newCar,
    setNewCar,
    handleAssign: () => handleAssign(assignData),
    handleReturn,
    handleAddCar,
    handleUpdateCar: () => handleUpdateCar(selectedCar),
    handleDeleteCar: () => handleDeleteCar(selectedCar),
    handleUpdateDates,
    getAvailableLoanerCars,
    handleAssignToAppointment,
    isLoading,
    loadLoanerCars
  };
}
