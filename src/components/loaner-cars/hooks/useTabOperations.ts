
import { useState, useEffect } from 'react';
import { Appointment } from '@/lib/types';

export function useTabOperations(
  appointmentsNeedingCars: Appointment[], 
  refreshOverviewData: () => Promise<void>,
  loadAppointments: () => Promise<void>
) {
  // Force tab to "loanerNeeds" if there are appointments needing cars
  const [activeTab, setActiveTab] = useState(
    appointmentsNeedingCars.length > 0 ? "loanerNeeds" : "availableCars"
  );

  // Set active tab based on appointments needing cars
  useEffect(() => {
    if (appointmentsNeedingCars.length > 0) {
      setActiveTab("loanerNeeds");
    }
  }, [appointmentsNeedingCars.length]);

  // Reload data when tab changes
  useEffect(() => {
    refreshOverviewData();
    loadAppointments();
  }, [activeTab, refreshOverviewData, loadAppointments]);

  return {
    activeTab,
    setActiveTab
  };
}
