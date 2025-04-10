
import { useState, useCallback } from "react";
import { Appointment } from "@/lib/types";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { customerToOverviewAppointment, overviewToCustomerAppointment } from "@/lib/overview/appointmentConverter";
import { createAppointment as createAppointmentApi, updateAppointment as updateAppointmentApi, deleteAppointment as deleteAppointmentApi } from "@/services/appointmentService";

interface UseAppointmentOperationsProps {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  setIsDialogOpen: (isOpen: boolean) => void;
  setSelectedAppointment: (appointment: Appointment | null) => void;
  refreshCustomers: () => Promise<void>;
  refreshOverviewData: () => Promise<void>;
  loadAppointments: () => Promise<void>;
}

export function useAppointmentOperations({
  appointments,
  setAppointments,
  setIsDialogOpen,
  setSelectedAppointment,
  refreshCustomers,
  refreshOverviewData,
  loadAppointments
}: UseAppointmentOperationsProps) {
  
  const { t } = useLanguage();

  const handleAddAppointment = async (appointment: Appointment) => {
    try {
      if (appointment.id) {
        appointment.needsLoanerCar = appointment.needsLoanerCar ?? false;
        appointment.loanerCarId = appointment.loanerCarId ?? undefined;
        
        const overviewAppointment = customerToOverviewAppointment(appointment);
        const updatedOverviewAppointment = await updateAppointmentApi(overviewAppointment);
        const updatedCustomerAppointment = overviewToCustomerAppointment(updatedOverviewAppointment);
        
        setAppointments(prev => prev.map(app => 
          app.id === appointment.id ? updatedCustomerAppointment : app
        ));
        
        toast.success(t('appointment.updated'));
      } else {
        const overviewAppointment = customerToOverviewAppointment(appointment);
        const newOverviewAppointment = await createAppointmentApi(overviewAppointment);
        const newCustomerAppointment = overviewToCustomerAppointment(newOverviewAppointment);
        
        setAppointments(prev => [...prev, newCustomerAppointment]);
        toast.success(t('appointment.created'));
      }
      
      setIsDialogOpen(false);
      setSelectedAppointment(null);
      
      // Refresh data
      await Promise.all([
        refreshCustomers(),
        refreshOverviewData(),
        loadAppointments()
      ]);
      
      return true;
    } catch (error) {
      console.error("Error saving appointment:", error);
      toast.error(t('common.error'));
      return false;
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    try {
      const numericId = parseInt(appointmentId);
      if (isNaN(numericId)) {
        throw new Error("Invalid appointment ID");
      }
      
      await deleteAppointmentApi(numericId);
      setAppointments(prev => prev.filter(app => app.id !== appointmentId));
      setIsDialogOpen(false);
      setSelectedAppointment(null);
      toast.success(t('appointment.deleted'));
      
      // Refresh data
      await Promise.all([
        refreshCustomers(),
        refreshOverviewData(),
        loadAppointments()
      ]);
      
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error(t('common.error'));
    }
  };

  return {
    handleAddAppointment,
    handleDeleteAppointment
  };
}
