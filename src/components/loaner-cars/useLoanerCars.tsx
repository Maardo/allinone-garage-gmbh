
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { LoanerCar, Appointment } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/context/LanguageContext';
import { useCalendar } from '@/hooks/useCalendar';

// Mock data for demo purposes
const INITIAL_LOANER_CARS: LoanerCar[] = [
  {
    id: "car1",
    name: "Volvo V60",
    license: "ABC123",
    isAvailable: false,
    assignedTo: "Erik Svensson", // Preassigned to match appointment with ID "3"
    assignedFrom: new Date(new Date().setDate(new Date().getDate() + 3)),
    assignedUntil: new Date(new Date().setDate(new Date().getDate() + 4))
  },
  {
    id: "car2",
    name: "Toyota Corolla",
    license: "XYZ789",
    isAvailable: false,
    assignedTo: "Johan Andersson",
    assignedFrom: new Date(new Date().setDate(new Date().getDate() - 2)),
    assignedUntil: new Date(new Date().setDate(new Date().getDate() + 2))
  },
  {
    id: "car3",
    name: "Volvo XC60",
    license: "GHI456",
    isAvailable: true
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
  const { appointments, handleAddAppointment } = useCalendar();
  const [loanerCars, setLoanerCars] = useState<LoanerCar[]>(INITIAL_LOANER_CARS);
  const [selectedCar, setSelectedCar] = useState<LoanerCar | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const today = format(new Date(), "yyyy-MM-dd");
  const [assignData, setAssignData] = useState({
    customerId: "",
    startDate: today,
    returnDate: format(new Date(new Date().setDate(new Date().getDate() + 3)), "yyyy-MM-dd"),
  });
  const [newCar, setNewCar] = useState<Partial<LoanerCar>>({
    name: "",
    license: "",
    isAvailable: true
  });

  // Filter appointments that need loaner cars but don't have one assigned yet
  const appointmentsNeedingCars = appointments.filter(
    appointment => appointment.needsLoanerCar && !appointment.loanerCarId
  );

  // Fetch appointments that need loaner cars from local storage or API
  useEffect(() => {
    // This would be replaced with an actual API call in a real application
    // For now we're working with the mocked data
  }, []);

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
          assignedFrom: new Date(assignData.startDate),
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

  // Get available loaner cars (for appointment form)
  const getAvailableLoanerCars = () => {
    return loanerCars.filter(car => car.isAvailable);
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
    appointmentsNeedingCars,
    assignData,
    setAssignData,
    newCar,
    setNewCar,
    handleAssign,
    handleReturn,
    handleAddCar,
    handleUpdateCar,
    handleDeleteCar,
    getAvailableLoanerCars,
    handleAssignToAppointment
  };
}
