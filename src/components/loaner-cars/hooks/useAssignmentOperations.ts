
import { useState } from 'react';
import { LoanerCar, Appointment, Customer } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/context/LanguageContext';
import { updateLoanerCarInDb } from '@/lib/loaner-cars/loanerCarDbService';
import { useCustomers } from '@/hooks/useCustomers';

export function useAssignmentOperations(
  loanerCars: LoanerCar[],
  setLoanerCars: React.Dispatch<React.SetStateAction<LoanerCar[]>>,
  handleAddAppointment: (appointment: Appointment) => void,
  appointments: Appointment[],
  refreshData: () => Promise<void>
) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedCar, setSelectedCar] = useState<LoanerCar | null>(null);
  const { customers } = useCustomers();

  const handleAssign = async (assignData: { customerId: string; startDate: string; returnDate: string }) => {
    if (!selectedCar || !assignData.customerId) return;
    
    const customer = customers.find(c => c.id === assignData.customerId);
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
        await refreshData();
      }
    }
  };

  const handleAssignToAppointment = async (appointmentId: string) => {
    const appointment = appointments.find(app => app.id === appointmentId);
    if (!appointment) return;
    
    const availableCar = loanerCars.find(car => car.isAvailable);
    if (!availableCar) {
      toast({
        title: t('loanerCar.noAvailableCars'),
        description: t('loanerCar.noAvailableCarsDescription'),
        variant: "destructive"
      });
      return;
    }
    
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
    
    const updatedCar = updatedCars.find(car => car.id === availableCar.id);
    if (updatedCar) {
      const success = await updateLoanerCarInDb(updatedCar);
      
      const updatedAppointment = {
        ...appointment,
        loanerCarId: availableCar.id,
        needsLoanerCar: true
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
        await refreshData();
      }
    }
  };

  return {
    selectedCar,
    setSelectedCar,
    handleAssign,
    handleAssignToAppointment
  };
}
