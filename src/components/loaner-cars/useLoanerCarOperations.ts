
import { LoanerCar, Appointment } from '@/lib/types';
import { useAssignmentOperations } from './hooks/useAssignmentOperations';
import { useDateOperations } from './hooks/useDateOperations';
import { useReturnOperations } from './hooks/useReturnOperations';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";

export function useLoanerCarOperations(
  loanerCars: LoanerCar[],
  setLoanerCars: React.Dispatch<React.SetStateAction<LoanerCar[]>>,
  handleAddAppointment: (appointment: Appointment) => void,
  appointments: Appointment[],
  refreshData: () => Promise<void>
) {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  // Assignment operations
  const {
    selectedCar,
    setSelectedCar,
    handleAssign,
    handleAssignToAppointment
  } = useAssignmentOperations(
    loanerCars, 
    setLoanerCars, 
    handleAddAppointment, 
    appointments, 
    refreshData
  );

  // Date operations
  const { handleUpdateDates } = useDateOperations(
    loanerCars,
    setLoanerCars,
    refreshData
  );

  // Return operations
  const { handleReturn } = useReturnOperations(
    loanerCars,
    setLoanerCars,
    handleAddAppointment,
    appointments,
    refreshData
  );

  return {
    selectedCar,
    setSelectedCar,
    handleAssign,
    handleUpdateDates,
    handleReturn,
    handleAssignToAppointment
  };
}
