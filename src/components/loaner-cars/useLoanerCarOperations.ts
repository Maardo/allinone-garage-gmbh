
import { useState } from 'react';
import { format } from 'date-fns';
import { LoanerCar, Appointment } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/context/LanguageContext';
import { MOCK_CUSTOMERS } from './mockLoanerData';

export function useLoanerCarOperations(
  loanerCars: LoanerCar[],
  setLoanerCars: React.Dispatch<React.SetStateAction<LoanerCar[]>>,
  handleAddAppointment: (appointment: Appointment) => void,
  appointments: Appointment[]
) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedCar, setSelectedCar] = useState<LoanerCar | null>(null);

  const handleAssign = (assignData: { customerId: string; startDate: string; returnDate: string }) => {
    if (!selectedCar || !assignData.customerId) return;
    
    const customer = MOCK_CUSTOMERS.find(c => c.id === assignData.customerId);
    if (!customer) return;

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
    
    toast({
      title: t('loanerCar.assigned'),
      description: t('loanerCar.assignedDescription'),
    });
  };

  const handleUpdateDates = (carId: string, startDate: string, returnDate: string) => {
    if (!carId) return;
    
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
    
    toast({
      title: t('loanerCar.datesUpdated'),
      description: t('loanerCar.datesUpdatedDescription'),
    });
  };

  const handleAssignToAppointment = (appointmentId: string) => {
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
    
    // Update the car to assign it to the customer
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
    
    // Update the appointment with the loaner car info
    const updatedAppointment = {
      ...appointment,
      loanerCarId: availableCar.id
    };
    
    handleAddAppointment(updatedAppointment);
    
    toast({
      title: t('loanerCar.assigned'),
      description: t('loanerCar.assignedToAppointmentDescription'),
    });
  };

  const handleReturn = (carId: string) => {
    // Get the car
    const car = loanerCars.find(c => c.id === carId);
    if (!car || !car.appointmentId) {
      // Car is not linked to an appointment, just mark it as available
      const updatedCars = loanerCars.map(c => {
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
      
      const updatedCars = loanerCars.map(c => {
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
    
    toast({
      title: t('loanerCar.returned'),
      description: t('loanerCar.returnedDescription'),
    });
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
