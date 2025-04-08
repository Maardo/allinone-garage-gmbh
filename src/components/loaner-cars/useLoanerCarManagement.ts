
import { useState } from 'react';
import { LoanerCar } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/context/LanguageContext';

export function useLoanerCarManagement(
  loanerCars: LoanerCar[],
  setLoanerCars: React.Dispatch<React.SetStateAction<LoanerCar[]>>
) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [newCar, setNewCar] = useState<Partial<LoanerCar>>({
    name: "",
    license: "",
    isAvailable: true
  });

  const handleAddCar = () => {
    if (!newCar.name || !newCar.license) return;
    
    const car: LoanerCar = {
      id: Math.random().toString(36).substring(2, 9),
      name: newCar.name,
      license: newCar.license,
      isAvailable: true
    };
    
    setLoanerCars([...loanerCars, car]);
    setNewCar({
      name: "",
      license: "",
      isAvailable: true
    });
    
    toast({
      title: t('loanerCar.added'),
      description: t('loanerCar.addedDescription'),
    });
  };

  const handleUpdateCar = (selectedCar: LoanerCar | null) => {
    if (!selectedCar || !selectedCar.name || !selectedCar.license) return;
    
    const updatedCars = loanerCars.map(car => 
      car.id === selectedCar.id ? selectedCar : car
    );
    
    setLoanerCars(updatedCars);
    
    toast({
      title: t('loanerCar.updated'),
      description: t('loanerCar.updatedDescription'),
    });
  };

  const handleDeleteCar = (selectedCar: LoanerCar | null) => {
    if (!selectedCar) return;
    
    const updatedCars = loanerCars.filter(car => car.id !== selectedCar.id);
    setLoanerCars(updatedCars);
    
    toast({
      title: t('loanerCar.deleted'),
      description: t('loanerCar.deletedDescription'),
    });
  };

  // Get available loaner cars (for appointment form)
  const getAvailableLoanerCars = () => {
    return loanerCars.filter(car => car.isAvailable);
  };

  return {
    newCar,
    setNewCar,
    handleAddCar,
    handleUpdateCar,
    handleDeleteCar,
    getAvailableLoanerCars
  };
}
