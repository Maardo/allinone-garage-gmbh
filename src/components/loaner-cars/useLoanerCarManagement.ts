
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
  const [previousLoanerCars, setPreviousLoanerCars] = useState<LoanerCar[]>([]);

  const saveStateBeforeChange = () => {
    setPreviousLoanerCars([...loanerCars]);
  };
  
  const undoLastChange = () => {
    setLoanerCars([...previousLoanerCars]);
    toast({
      title: t('actions.undone'),
      description: t('actions.changesReverted'),
    });
    return true;
  };

  const handleAddCar = () => {
    if (!newCar.name || !newCar.license) return;
    
    saveStateBeforeChange();
    
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
      action: (
        <button
          onClick={() => undoLastChange()}
          className="bg-secondary hover:bg-secondary/90 text-foreground px-3 py-1 rounded-md text-xs font-medium"
        >
          {t('actions.undo')}
        </button>
      ),
    });
  };

  const handleUpdateCar = (selectedCar: LoanerCar | null) => {
    if (!selectedCar || !selectedCar.name || !selectedCar.license) return;
    
    saveStateBeforeChange();
    
    const updatedCars = loanerCars.map(car => 
      car.id === selectedCar.id ? selectedCar : car
    );
    
    setLoanerCars(updatedCars);
    
    toast({
      title: t('loanerCar.updated'),
      description: t('loanerCar.updatedDescription'),
      action: (
        <button
          onClick={() => undoLastChange()}
          className="bg-secondary hover:bg-secondary/90 text-foreground px-3 py-1 rounded-md text-xs font-medium"
        >
          {t('actions.undo')}
        </button>
      ),
    });
  };

  const handleDeleteCar = (selectedCar: LoanerCar | null) => {
    if (!selectedCar) return;
    
    saveStateBeforeChange();
    
    const updatedCars = loanerCars.filter(car => car.id !== selectedCar.id);
    setLoanerCars(updatedCars);
    
    toast({
      title: t('loanerCar.deleted'),
      description: t('loanerCar.deletedDescription'),
      action: (
        <button
          onClick={() => undoLastChange()}
          className="bg-secondary hover:bg-secondary/90 text-foreground px-3 py-1 rounded-md text-xs font-medium"
        >
          {t('actions.undo')}
        </button>
      ),
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
    getAvailableLoanerCars,
    saveStateBeforeChange,
    undoLastChange
  };
}
