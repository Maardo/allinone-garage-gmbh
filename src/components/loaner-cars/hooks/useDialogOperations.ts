
import { useState } from 'react';
import { format } from 'date-fns';
import { LoanerCar } from '@/lib/types';

export function useDialogOperations() {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDatesDialogOpen, setIsEditDatesDialogOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<LoanerCar | null>(null);
  const [newCar, setNewCar] = useState<Partial<LoanerCar>>({
    name: "",
    license: "",
    isAvailable: true
  });
  
  const today = format(new Date(), "yyyy-MM-dd");
  const [assignData, setAssignData] = useState({
    customerId: "",
    startDate: today,
    returnDate: format(new Date(new Date().setDate(new Date().getDate() + 3)), "yyyy-MM-dd"),
  });
  
  const handleAddNewCar = () => {
    setSelectedCar(null);
    setNewCar({
      name: "",
      license: "",
      isAvailable: true
    });
    setIsEditDialogOpen(true);
  };

  const handleAssignCar = (car: LoanerCar) => {
    setSelectedCar(car);
    const today = format(new Date(), "yyyy-MM-dd");
    setAssignData({
      customerId: "",
      startDate: today,
      returnDate: format(new Date(new Date().setDate(new Date().getDate() + 3)), "yyyy-MM-dd"),
    });
    setIsAssignDialogOpen(true);
  };
  
  return {
    isAssignDialogOpen,
    setIsAssignDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isEditDatesDialogOpen,
    setIsEditDatesDialogOpen,
    selectedCar,
    setSelectedCar,
    newCar,
    setNewCar,
    assignData,
    setAssignData,
    handleAddNewCar,
    handleAssignCar
  };
}
