
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { LoanerCar } from '@/lib/types';
import { useCalendar } from '@/hooks/useCalendar';
import { INITIAL_LOANER_CARS } from './mockLoanerData';
import { useLoanerCarOperations } from './useLoanerCarOperations';
import { useLoanerCarManagement } from './useLoanerCarManagement';

export function useLoanerCars() {
  const [loanerCars, setLoanerCars] = useState<LoanerCar[]>(INITIAL_LOANER_CARS);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDatesDialogOpen, setIsEditDatesDialogOpen] = useState(false);
  const today = format(new Date(), "yyyy-MM-dd");
  const [assignData, setAssignData] = useState({
    customerId: "",
    startDate: today,
    returnDate: format(new Date(new Date().setDate(new Date().getDate() + 3)), "yyyy-MM-dd"),
  });

  const { appointments, handleAddAppointment } = useCalendar();

  // Filter appointments that need loaner cars but don't have one assigned yet
  const appointmentsNeedingCars = appointments.filter(
    appointment => appointment.needsLoanerCar && !appointment.loanerCarId
  );

  // Car operations
  const {
    selectedCar,
    setSelectedCar,
    handleAssign,
    handleUpdateDates,
    handleReturn,
    handleAssignToAppointment
  } = useLoanerCarOperations(loanerCars, setLoanerCars, handleAddAppointment, appointments);

  // Car management
  const {
    newCar,
    setNewCar,
    handleAddCar,
    handleUpdateCar,
    handleDeleteCar,
    getAvailableLoanerCars
  } = useLoanerCarManagement(loanerCars, setLoanerCars);

  // Fetch appointments that need loaner cars from local storage or API
  useEffect(() => {
    // This would be replaced with an actual API call in a real application
    // For now we're working with the mocked data
  }, []);

  // Wrapper functions that call our extracted operations with the right parameters
  const handleAssignWrapper = () => handleAssign(assignData);
  const handleUpdateCarWrapper = () => handleUpdateCar(selectedCar);
  const handleDeleteCarWrapper = () => handleDeleteCar(selectedCar);
  const handleUpdateDatesWrapper = (carId: string, startDate: string, returnDate: string) => {
    handleUpdateDates(carId, startDate, returnDate);
  };

  return {
    loanerCars,
    selectedCar,
    setSelectedCar,
    isAssignDialogOpen,
    setIsAssignDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isEditDatesDialogOpen,
    setIsEditDatesDialogOpen,
    appointmentsNeedingCars,
    assignData,
    setAssignData,
    newCar,
    setNewCar,
    handleAssign: handleAssignWrapper,
    handleReturn,
    handleAddCar,
    handleUpdateCar: handleUpdateCarWrapper,
    handleDeleteCar: handleDeleteCarWrapper,
    handleUpdateDates: handleUpdateDatesWrapper,
    getAvailableLoanerCars,
    handleAssignToAppointment
  };
}
