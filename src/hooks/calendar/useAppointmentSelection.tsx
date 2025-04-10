
import { useState, useCallback } from "react";
import { Appointment } from "@/lib/types";
import { createEmptyAppointment } from "@/lib/calendar/calendarService";

export function useAppointmentSelection() {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSelectAppointment = useCallback((appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  }, []);

  const handleNewAppointmentAtDate = useCallback((date: Date) => {
    setSelectedAppointment(createEmptyAppointment(date));
    setIsDialogOpen(true);
  }, []);

  return {
    selectedAppointment,
    setSelectedAppointment,
    isDialogOpen,
    setIsDialogOpen,
    handleSelectAppointment,
    handleNewAppointmentAtDate
  };
}
