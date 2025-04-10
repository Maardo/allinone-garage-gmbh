
import { useState } from 'react';
import { format } from 'date-fns';
import { LoanerCar, Appointment } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/context/LanguageContext';
import { MOCK_CUSTOMERS } from './mockLoanerData';
import { updateLoanerCarInDb } from '@/lib/loaner-cars/loanerCarDbService';

export function useLoanerCarOperations(
  loanerCars: LoanerCar[],
  setLoanerCars: React.Dispatch<React.SetStateAction<LoanerCar[]>>,
  handleAddAppointment: (appointment: Appointment) => void,
  appointments: Appointment[],
  refreshData: () => Promise<void>
) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedCar, setSelectedCar] = useState<LoanerCar | null>(null);

  const handleAssign = async (assignData: { customerId: string; startDate: string; returnDate: string }) => {
    if (!selectedCar || !assignData.customerId) return;
    
    const customer = MOCK_CUSTOMERS.find(c => c.id === assignData.customerId);
    if (!customer) return;

    // First update in memory
    const updatedCars = loanerCars.map(car => {
      if (car.id === selectedCar.id) {
        return {
          ...car,
          isAvailable: false,
          assignedTo: customer.name,
          assignedFrom: new Date(assignData.startDate),
          assignedUntil: new Date(assignData.returnDate)
        };
      }
      return car;
    });
    
    setLoanerCars(updatedCars);
    
    // Then update in database
    const updatedCar = updatedCars.find(car => car.id === selectedCar.id);
    if (updatedCar) {
      const success = await updateLoanerCarInDb(updatedCar);
      if (success) {
        toast({
          title: t('loanerCar.assigned'),
          description: t('loanerCar.assignedDescription'),
        });
      } else {
        toast({
          title: "Update failed",
          description: "Failed to update the database. Changes may not persist.",
          variant: "destructive"
        });
        await refreshData(); // Refresh to get the latest state from DB
      }
    }
  };

  const handleUpdateDates = async (carId: string, startDate: string, returnDate: string) => {
    if (!carId) return;
    
    // First update in memory
    const updatedCars = loanerCars.map(car => {
      if (car.id === carId) {
        return {
          ...car,
          assignedFrom: new Date(startDate),
          assignedUntil: new Date(returnDate)
        };
      }
      return car;
    });
    
    setLoanerCars(updatedCars);
    
    // Then update in database
    const updatedCar = updatedCars.find(car => car.id === carId);
    if (updatedCar) {
      const success = await updateLoanerCarInDb(updatedCar);
      if (success) {
        toast({
          title: t('loanerCar.datesUpdated'),
          description: t('loanerCar.datesUpdatedDescription'),
        });
      } else {
        toast({
          title: "Update failed",
          description: "Failed to update the database. Changes may not persist.",
          variant: "destructive"
        });
        await refreshData(); // Refresh to get the latest state from DB
      }
    }
  };

  const handleAssignToAppointment = async (appointmentId: string) => {
    // Find the appointment
    const appointment = appointments.find(app => app.id === appointmentId);
    if (!appointment) return;
    
    // Find an available car
    const availableCar = loanerCars.find(car => car.isAvailable);
    if (!availableCar) {
      toast({
        title: t('loanerCar.noAvailableCars'),
        description: t('loanerCar.noAvailableCarsDescription'),
        variant: "destructive"
      });
      return;
    }
    
    // Update the car to assign it to the customer (first in memory)
    const updatedCars = loanerCars.map(car => {
      if (car.id === availableCar.id) {
        return {
          ...car,
          isAvailable: false,
          assignedTo: appointment.customerName,
          appointmentId: appointment.id,
          assignedFrom: new Date(),
          assignedUntil: new Date(new Date().setDate(new Date().getDate() + 3))
        };
      }
      return car;
    });
    
    setLoanerCars(updatedCars);
    
    // Then update in database
    const updatedCar = updatedCars.find(car => car.id === availableCar.id);
    if (updatedCar) {
      const success = await updateLoanerCarInDb(updatedCar);
      
      // Update the appointment with the loaner car info
      const updatedAppointment = {
        ...appointment,
        loanerCarId: availableCar.id
      };
      
      handleAddAppointment(updatedAppointment);
      
      if (success) {
        toast({
          title: t('loanerCar.assigned'),
          description: t('loanerCar.assignedToAppointmentDescription'),
        });
      } else {
        toast({
          title: "Update failed",
          description: "Failed to update the database. Changes may not persist.",
          variant: "destructive"
        });
        await refreshData(); // Refresh to get the latest state from DB
      }
    }
  };

  const handleReturn = async (carId: string) => {
    // First update in memory
    
    // Get the car
    const car = loanerCars.find(c => c.id === carId);
    if (!car) return;
    
    let updatedCars;
    
    if (!car.appointmentId) {
      // Car is not linked to an appointment, just mark it as available
      updatedCars = loanerCars.map(c => {
        if (c.id === carId) {
          return {
            ...c,
            isAvailable: true,
            assignedTo: undefined,
            appointmentId: undefined,
            assignedFrom: undefined,
            assignedUntil: undefined
          };
        }
        return c;
      });
      
      setLoanerCars(updatedCars);
    } else {
      // Car is linked to an appointment, update both
      const appointment = appointments.find(a => a.id === car.appointmentId);
      if (appointment) {
        const updatedAppointment = {
          ...appointment,
          loanerCarId: undefined
        };
        
        handleAddAppointment(updatedAppointment);
      }
      
      updatedCars = loanerCars.map(c => {
        if (c.id === carId) {
          return {
            ...c,
            isAvailable: true,
            assignedTo: undefined,
            appointmentId: undefined,
            assignedFrom: undefined,
            assignedUntil: undefined
          };
        }
        return c;
      });
      
      setLoanerCars(updatedCars);
    }
    
    // Then update in database
    const updatedCar = updatedCars.find(c => c.id === carId);
    if (updatedCar) {
      const success = await updateLoanerCarInDb(updatedCar);
      if (success) {
        toast({
          title: t('loanerCar.returned'),
          description: t('loanerCar.returnedDescription'),
        });
      } else {
        toast({
          title: "Update failed",
          description: "Failed to update the database. Changes may not persist.",
          variant: "destructive"
        });
        await refreshData(); // Refresh to get the latest state from DB
      }
    }
  };

  return {
    selectedCar,
    setSelectedCar,
    handleAssign,
    handleUpdateDates,
    handleReturn,
    handleAssignToAppointment
  };
}
