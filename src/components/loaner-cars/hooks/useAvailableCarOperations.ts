
import { LoanerCar } from '@/lib/types';

export function useAvailableCarOperations(loanerCars: LoanerCar[]) {
  // Get available loaner cars (for appointment form)
  const getAvailableLoanerCars = () => {
    return loanerCars.filter(car => car.isAvailable);
  };

  // Get count of available loaner cars (for dashboard)
  const getAvailableLoanerCount = () => {
    return loanerCars.filter(car => car.isAvailable).length;
  };

  return {
    getAvailableLoanerCars,
    getAvailableLoanerCount
  };
}
