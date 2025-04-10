
import { LoanerCar } from '@/lib/types';

export function useAvailableCarOperations(loanerCars: LoanerCar[]) {
  // Get available loaner cars (for appointment form)
  const getAvailableLoanerCars = () => {
    return loanerCars.filter(car => car.isAvailable);
  };

  return {
    getAvailableLoanerCars
  };
}
