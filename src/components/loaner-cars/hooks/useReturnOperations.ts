
import { LoanerCar, Appointment } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/context/LanguageContext';
import { updateLoanerCarInDb } from '@/lib/loaner-cars/loanerCarDbService';

export function useReturnOperations(
  loanerCars: LoanerCar[],
  setLoanerCars: React.Dispatch<React.SetStateAction<LoanerCar[]>>,
  handleAddAppointment: (appointment: Appointment) => void,
  appointments: Appointment[],
  refreshData: () => Promise<void>
) {
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleReturn = async (carId: string) => {
    const car = loanerCars.find(c => c.id === carId);
    if (!car) return;
    
    let updatedCars;
    
    if (!car.appointmentId) {
      updatedCars = loanerCars.map(c => {
        if (c.id === carId) {
          return {
            ...c,
            isAvailable: true,
            assignedTo: undefined,
            appointmentId: undefined,
            assignedFrom: undefined,
            assignedUntil: undefined
          };
        }
        return c;
      });
      
      setLoanerCars(updatedCars);
    } else {
      const appointment = appointments.find(a => a.id === car.appointmentId);
      if (appointment) {
        const updatedAppointment = {
          ...appointment,
          loanerCarId: undefined
        };
        
        handleAddAppointment(updatedAppointment);
      }
      
      updatedCars = loanerCars.map(c => {
        if (c.id === carId) {
          return {
            ...c,
            isAvailable: true,
            assignedTo: undefined,
            appointmentId: undefined,
            assignedFrom: undefined,
            assignedUntil: undefined
          };
        }
        return c;
      });
      
      setLoanerCars(updatedCars);
    }
    
    const updatedCar = updatedCars.find(c => c.id === carId);
    if (updatedCar) {
      const success = await updateLoanerCarInDb(updatedCar);
      if (success) {
        toast({
          title: t('loanerCar.returned'),
          description: t('loanerCar.returnedDescription'),
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
  };

  return {
    handleReturn
  };
}
