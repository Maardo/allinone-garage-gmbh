
import { useState } from 'react';
import { LoanerCar } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/context/LanguageContext';
import { addLoanerCarToDb, updateLoanerCarInDb, deleteLoanerCarFromDb } from '@/lib/loaner-cars/loanerCarDbService';
import { useAuth } from '@/context/AuthContext';

export function useLoanerCarManagement(
  loanerCars: LoanerCar[],
  setLoanerCars: React.Dispatch<React.SetStateAction<LoanerCar[]>>,
  refreshData: () => Promise<void>
) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [newCar, setNewCar] = useState<Partial<LoanerCar>>({
    name: "",
    license: "",
    isAvailable: true
  });

  const handleAddCar = async () => {
    if (!newCar.name || !newCar.license || !currentUser) return;
    
    // First add to the database to get the ID
    const carId = await addLoanerCarToDb(newCar, currentUser.id);
    
    if (carId) {
      // If successful, add to the local state with the returned ID
      const car: LoanerCar = {
        id: carId,
        name: newCar.name,
        license: newCar.license,
        isAvailable: true
      };
      
      setLoanerCars([...loanerCars, car]);
      setNewCar({
        name: "",
        license: "",
        isAvailable: true
      });
      
      toast({
        title: t('loanerCar.added'),
        description: t('loanerCar.addedDescription'),
      });
    } else {
      toast({
        title: "Add failed",
        description: "Failed to add the car to the database.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateCar = async (selectedCar: LoanerCar | null) => {
    if (!selectedCar || !selectedCar.name || !selectedCar.license) return;
    
    // First update in memory
    const updatedCars = loanerCars.map(car => 
      car.id === selectedCar.id ? selectedCar : car
    );
    
    setLoanerCars(updatedCars);
    
    // Then update in database
    const success = await updateLoanerCarInDb(selectedCar);
    
    if (success) {
      toast({
        title: t('loanerCar.updated'),
        description: t('loanerCar.updatedDescription'),
      });
    } else {
      toast({
        title: "Update failed",
        description: "Failed to update the car in the database. Changes may not persist.",
        variant: "destructive"
      });
      await refreshData(); // Refresh to get the latest state from DB
    }
  };

  const handleDeleteCar = async (selectedCar: LoanerCar | null) => {
    if (!selectedCar) return;
    
    // First delete from database
    const success = await deleteLoanerCarFromDb(selectedCar.id);
    
    if (success) {
      // If successful, update local state
      const updatedCars = loanerCars.filter(car => car.id !== selectedCar.id);
      setLoanerCars(updatedCars);
      
      toast({
        title: t('loanerCar.deleted'),
        description: t('loanerCar.deletedDescription'),
      });
    } else {
      toast({
        title: "Delete failed",
        description: "Failed to delete the car from the database.",
        variant: "destructive"
      });
    }
  };

  // Get available loaner cars (for appointment form)
  const getAvailableLoanerCars = () => {
    return loanerCars.filter(car => car.isAvailable);
  };

  return {
    newCar,
    setNewCar,
    handleAddCar,
    handleUpdateCar,
    handleDeleteCar,
    getAvailableLoanerCars
  };
}
