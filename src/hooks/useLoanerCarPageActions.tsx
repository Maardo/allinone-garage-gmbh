
import { useState } from "react";
import { format } from "date-fns";
import { LoanerCar } from "@/lib/types";

interface UseLoanerCarPageActionsProps {
  handleAssign: () => Promise<void>;
  handleReturn: (carId: string) => Promise<void>;
  handleAddCar: () => Promise<void>;
  handleUpdateCar: () => Promise<void>;
  handleDeleteCar: () => Promise<void>;
  handleUpdateDates: (carId: string, startDate: string, returnDate: string) => Promise<void>;
  handleAssignToAppointment: (appointmentId: string) => Promise<void>;
  setSelectedCar: (car: LoanerCar | null) => void;
  setNewCar: (car: Partial<LoanerCar>) => void;
  setAssignData: (data: { customerId: string; returnDate: string; startDate: string }) => void;
  refreshOverviewData: () => Promise<void>;
  loadAppointments: () => Promise<void>;
}

export function useLoanerCarPageActions({
  handleAssign,
  handleReturn,
  handleAddCar,
  handleUpdateCar,
  handleDeleteCar,
  handleUpdateDates,
  handleAssignToAppointment,
  setSelectedCar,
  setNewCar,
  setAssignData,
  refreshOverviewData,
  loadAppointments
}: UseLoanerCarPageActionsProps) {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDatesDialogOpen, setIsEditDatesDialogOpen] = useState(false);

  // Combined actions for page operations
  const handleAssignToAppointmentWithRefresh = async (appointmentId: string) => {
    await handleAssignToAppointment(appointmentId);
    await refreshOverviewData();
    await loadAppointments();
  };

  const handleReturnWithRefresh = async (carId: string) => {
    await handleReturn(carId);
    await refreshOverviewData();
    await loadAppointments();
  };

  const handleAddNewCar = () => {
    setSelectedCar(null);
    setNewCar({
      name: "",
      license: "",
      isAvailable: true
    });
    setIsEditDialogOpen(true);
  };

  const handleAssignCar = (car: LoanerCar) => {
    setSelectedCar(car);
    const today = format(new Date(), "yyyy-MM-dd");
    setAssignData({
      customerId: "",
      startDate: today,
      returnDate: format(new Date(new Date().setDate(new Date().getDate() + 3)), "yyyy-MM-dd"),
    });
    setIsAssignDialogOpen(true);
  };

  return {
    isAssignDialogOpen,
    setIsAssignDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isEditDatesDialogOpen,
    setIsEditDatesDialogOpen,
    handleAssignToAppointmentWithRefresh,
    handleReturnWithRefresh,
    handleAddNewCar,
    handleAssignCar
  };
}
