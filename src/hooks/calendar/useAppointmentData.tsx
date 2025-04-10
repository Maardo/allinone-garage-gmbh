
import { useState, useCallback } from "react";
import { Appointment } from "@/lib/types";
import { fetchAppointments } from "@/services/appointmentService";
import { overviewToCustomerAppointment } from "@/lib/overview/appointmentConverter";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

export function useAppointmentData() {
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAppointments = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchAppointments();
      const customerAppointments = data.map(overviewToCustomerAppointment);
      setAppointments(customerAppointments);
    } catch (error) {
      console.error("Error loading appointments:", error);
      toast.error(t('common.error'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  return {
    appointments,
    setAppointments,
    isLoading,
    loadAppointments
  };
}
