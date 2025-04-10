
import { LoanerCar } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/context/LanguageContext';
import { deleteLoanerCarFromDb } from '@/lib/loaner-cars/loanerCarDbService';

export function useDeleteCarOperations(
  loanerCars: LoanerCar[],
  setLoanerCars: React.Dispatch<React.SetStateAction<LoanerCar[]>>,
  refreshData: () => Promise<void>
) {
  const { t } = useLanguage();
  const { toast } = useToast();

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

  return {
    handleDeleteCar
  };
}
