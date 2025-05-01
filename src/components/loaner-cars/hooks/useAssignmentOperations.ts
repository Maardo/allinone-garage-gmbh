
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

  const handleAssign = async (assignData: { customerId: string; startDate: string; returnDate: string }): Promise<void> => {
    if (!selectedCar || !assignData.customerId) {
      console.log("Missing data for assignment:", { selectedCar, customerId: assignData.customerId });
      toast({
        title: "Assignment failed",
        description: "Missing required information. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    console.log("Assigning car with data:", { carId: selectedCar.id, ...assignData });
    
    const customer = customers.find(c => c.id === assignData.customerId);
    if (!customer) {
      console.error("Customer not found:", assignData.customerId);
      toast({
        title: "Assignment failed",
        description: "Selected customer not found. Please try again.",
        variant: "destructive"
      });
      return;
    }

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
      try {
        console.log("Updating car in DB:", updatedCar);
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
      } catch (error) {
        console.error("Error in handleAssign:", error);
        toast({
          title: "Update failed",
          description: "An error occurred while updating. Please try again.",
          variant: "destructive"
        });
        await refreshData();
      }
    }
  };

  const handleAssignToAppointment = async (appointmentId: string): Promise<void> => {
    try {
      console.log("Looking for appointment with ID:", appointmentId);
      const appointment = appointments.find(app => app.id === appointmentId);
      if (!appointment) {
        console.error("Appointment not found:", appointmentId);
        toast({
          title: "Assignment failed",
          description: "Could not find the specified appointment.",
          variant: "destructive"
        });
        return;
      }
      
      const availableCar = loanerCars.find(car => car.isAvailable);
      if (!availableCar) {
        toast({
          title: t('loanerCar.noAvailableCars'),
          description: t('loanerCar.noAvailableCarsDescription'),
          variant: "destructive"
        });
        return;
      }
      
      console.log("Assigning car to appointment:", {
        carId: availableCar.id,
        appointmentId: appointmentId,
        customerName: appointment.customerName
      });
      
      const updatedCars = loanerCars.map(car => {
        if (car.id === availableCar.id) {
          return {
            ...car,
            isAvailable: false,
            assignedTo: appointment.customerName,
            appointmentId: appointmentId,
            assignedFrom: new Date(),
            assignedUntil: new Date(new Date().setDate(new Date().getDate() + 3))
          };
        }
        return car;
      });
      
      setLoanerCars(updatedCars);
      
      const updatedCar = updatedCars.find(car => car.id === availableCar.id);
      if (updatedCar) {
        console.log("Updating car in DB:", updatedCar);
        const success = await updateLoanerCarInDb(updatedCar);
        
        // Update the appointment with the loaner car ID
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
    } catch (error) {
      console.error("Error in handleAssignToAppointment:", error);
      toast({
        title: "Assignment failed",
        description: "An error occurred during assignment. Please try again.",
        variant: "destructive"
      });
      await refreshData();
    }
  };

  return {
    selectedCar,
    setSelectedCar,
    handleAssign,
    handleAssignToAppointment
  };
}
