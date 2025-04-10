
import { useState } from 'react';
import { LoanerCar } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/context/LanguageContext';
import { addLoanerCarToDb } from '@/lib/loaner-cars/loanerCarDbService';
import { useAuth } from '@/context/AuthContext';

export function useAddCarOperations(
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

  return {
    newCar,
    setNewCar,
    handleAddCar
  };
}
