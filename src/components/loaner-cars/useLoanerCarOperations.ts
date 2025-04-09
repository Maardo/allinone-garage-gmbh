
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

  const handleAssign = (assignData: { customerId: string; startDate: string; returnDate: string }) => {
    if (!selectedCar || !assignData.customerId) return;
    
    saveStateBeforeChange();
    
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

  const handleAssignToAppointment = (appointmentId: string) => {
    // Find the appointment
    const appointment = appointments.find(app => app.id === appointmentId);
    if (!appointment) return;
    
    saveStateBeforeChange();
    
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

  const handleReturn = (carId: string) => {
    saveStateBeforeChange();
    
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

  return {
    selectedCar,
    setSelectedCar,
    handleAssign,
    handleReturn,
    handleAssignToAppointment,
    saveStateBeforeChange,
    undoLastChange
  };
}
