
import { useState } from 'react';
import { format } from 'date-fns';
import { LoanerCar } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/context/LanguageContext';

// Mock data for demo purposes
const INITIAL_LOANER_CARS: LoanerCar[] = [
  {
    id: "car1",
    name: "Volvo V60",
    license: "ABC123",
    isAvailable: true
  },
  {
    id: "car2",
    name: "Toyota Corolla",
    license: "XYZ789",
    isAvailable: false,
    assignedTo: "Johan Andersson",
    assignedUntil: new Date(new Date().setDate(new Date().getDate() + 2))
  }
];

// Mock customers for demo
const MOCK_CUSTOMERS = [
  { id: "c1", name: "Johan Andersson" },
  { id: "c2", name: "Maria Johansson" },
  { id: "c3", name: "Erik Svensson" },
  { id: "c4", name: "Anna Karlsson" },
];

export function useLoanerCars() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loanerCars, setLoanerCars] = useState<LoanerCar[]>(INITIAL_LOANER_CARS);
  const [selectedCar, setSelectedCar] = useState<LoanerCar | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [assignData, setAssignData] = useState({
    customerId: "",
    returnDate: format(new Date(new Date().setDate(new Date().getDate() + 3)), "yyyy-MM-dd"),
  });
  const [newCar, setNewCar] = useState<Partial<LoanerCar>>({
    name: "",
    license: "",
    isAvailable: true
  });

  const handleAssign = () => {
    if (!selectedCar || !assignData.customerId) return;
    
    const customer = MOCK_CUSTOMERS.find(c => c.id === assignData.customerId);
    if (!customer) return;

    const updatedCars = loanerCars.map(car => {
      if (car.id === selectedCar.id) {
        return {
          ...car,
          isAvailable: false,
          assignedTo: customer.name,
          assignedUntil: new Date(assignData.returnDate)
        };
      }
      return car;
    });
    
    setLoanerCars(updatedCars);
    setIsAssignDialogOpen(false);
    
    toast({
      title: t('loanerCar.assigned'),
      description: t('loanerCar.assignedDescription'),
    });
  };

  const handleReturn = (carId: string) => {
    const updatedCars = loanerCars.map(car => {
      if (car.id === carId) {
        return {
          ...car,
          isAvailable: true,
          assignedTo: undefined,
          assignedUntil: undefined
        };
      }
      return car;
    });
    
    setLoanerCars(updatedCars);
    
    toast({
      title: t('loanerCar.returned'),
      description: t('loanerCar.returnedDescription'),
    });
  };

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
    setIsEditDialogOpen(false);
    
    toast({
      title: t('loanerCar.added'),
      description: t('loanerCar.addedDescription'),
    });
  };

  const handleUpdateCar = () => {
    if (!selectedCar || !selectedCar.name || !selectedCar.license) return;
    
    const updatedCars = loanerCars.map(car => 
      car.id === selectedCar.id ? selectedCar : car
    );
    
    setLoanerCars(updatedCars);
    setIsEditDialogOpen(false);
    
    toast({
      title: t('loanerCar.updated'),
      description: t('loanerCar.updatedDescription'),
    });
  };

  const handleDeleteCar = () => {
    if (!selectedCar) return;
    
    const updatedCars = loanerCars.filter(car => car.id !== selectedCar.id);
    setLoanerCars(updatedCars);
    setIsDeleteDialogOpen(false);
    
    toast({
      title: t('loanerCar.deleted'),
      description: t('loanerCar.deletedDescription'),
    });
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
    assignData,
    setAssignData,
    newCar,
    setNewCar,
    handleAssign,
    handleReturn,
    handleAddCar,
    handleUpdateCar,
    handleDeleteCar
  };
}
