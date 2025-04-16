
import { LoanerCar } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/context/LanguageContext';
import { updateLoanerCarInDb } from '@/lib/loaner-cars/loanerCarDbService';

export function useDateOperations(
  loanerCars: LoanerCar[],
  setLoanerCars: React.Dispatch<React.SetStateAction<LoanerCar[]>>,
  refreshData: () => Promise<void>
) {
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleUpdateDates = async (carId: string, startDate: string, returnDate: string): Promise<void> => {
    if (!carId) return;
    
    try {
      const updatedCars = loanerCars.map(car => {
        if (car.id === carId) {
          return {
            ...car,
            assignedFrom: new Date(startDate),
            assignedUntil: new Date(returnDate)
          };
        }
        return car;
      });
      
      setLoanerCars(updatedCars);
      
      const updatedCar = updatedCars.find(car => car.id === carId);
      if (updatedCar) {
        const success = await updateLoanerCarInDb(updatedCar);
        if (success) {
          toast({
            title: t('loanerCar.datesUpdated'),
            description: t('loanerCar.datesUpdatedDescription'),
          });
        } else {
          toast({
            title: "Update failed",
            description: "Failed to update the database. Changes may not persist.",
            variant: "destructive"
          });
          await refreshData();
        }
      }
    } catch (error) {
      console.error("Error updating dates:", error);
      toast({
        title: "Update failed",
        description: "An error occurred while updating dates. Please try again.",
        variant: "destructive"
      });
      await refreshData();
    }
  };

  return {
    handleUpdateDates
  };
}
