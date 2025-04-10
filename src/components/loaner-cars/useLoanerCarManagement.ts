
import { LoanerCar } from '@/lib/types';
import { useAddCarOperations } from './hooks/useAddCarOperations';
import { useUpdateCarOperations } from './hooks/useUpdateCarOperations';
import { useDeleteCarOperations } from './hooks/useDeleteCarOperations';
import { useAvailableCarOperations } from './hooks/useAvailableCarOperations';

export function useLoanerCarManagement(
  loanerCars: LoanerCar[],
  setLoanerCars: React.Dispatch<React.SetStateAction<LoanerCar[]>>,
  refreshData: () => Promise<void>
) {
  // Add operations
  const {
    newCar,
    setNewCar,
    handleAddCar
  } = useAddCarOperations(loanerCars, setLoanerCars, refreshData);

  // Update operations
  const { handleUpdateCar } = useUpdateCarOperations(loanerCars, setLoanerCars, refreshData);

  // Delete operations
  const { handleDeleteCar } = useDeleteCarOperations(loanerCars, setLoanerCars, refreshData);

  // Available car operations
  const { getAvailableLoanerCars } = useAvailableCarOperations(loanerCars);

  return {
    newCar,
    setNewCar,
    handleAddCar,
    handleUpdateCar,
    handleDeleteCar,
    getAvailableLoanerCars
  };
}
