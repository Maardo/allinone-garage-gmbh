
import { LoanerCar } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/context/LanguageContext';
import { updateLoanerCarInDb } from '@/lib/loaner-cars/loanerCarDbService';

export function useUpdateCarOperations(
  loanerCars: LoanerCar[],
  setLoanerCars: React.Dispatch<React.SetStateAction<LoanerCar[]>>,
  refreshData: () => Promise<void>
) {
  const { t } = useLanguage();
  const { toast } = useToast();

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

  return {
    handleUpdateCar
  };
}
