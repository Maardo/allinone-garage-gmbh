
import { useState } from 'react';
import { LoanerCar } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/context/LanguageContext';

export type SortOption = 'name' | 'license' | 'availability';
export type FilterOption = 'all' | 'available' | 'loaned';

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
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

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

  // Sort cars by the selected criteria
  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      // Toggle sort order if clicking on the same column
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to ascending order when changing sort column
      setSortBy(option);
      setSortOrder('asc');
    }
  };

  // Filter cars by availability
  const handleFilter = (option: FilterOption) => {
    setFilterBy(option);
  };

  // Get sorted and filtered cars
  const getSortedAndFilteredCars = () => {
    // First apply filters
    let filteredCars = [...loanerCars];
    
    if (filterBy === 'available') {
      filteredCars = filteredCars.filter(car => car.isAvailable);
    } else if (filterBy === 'loaned') {
      filteredCars = filteredCars.filter(car => !car.isAvailable);
    }
    
    // Then sort the filtered results
    return filteredCars.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'license':
          comparison = a.license.localeCompare(b.license);
          break;
        case 'availability':
          comparison = Number(a.isAvailable) - Number(b.isAvailable);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  return {
    newCar,
    setNewCar,
    handleAddCar,
    handleUpdateCar,
    handleDeleteCar,
    getAvailableLoanerCars,
    sortBy,
    sortOrder,
    filterBy,
    handleSort,
    handleFilter,
    getSortedAndFilteredCars
  };
}
