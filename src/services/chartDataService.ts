
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { SERVICE_TYPES } from '@/lib/serviceTypes';
import { Appointment } from '@/hooks/useOverviewAppointments';

export function useChartData(upcomingJobs: Appointment[]) {
  const { t } = useLanguage();
  const [chartData, setChartData] = useState<Array<{
    name: string;
    value: number;
    fill: string;
  }>>([]);

  useEffect(() => {
    // Count appointments by service type
    const serviceTypeCounts: { [key: number]: number } = {};
    
    // Only consider non-completed jobs
    upcomingJobs
      .filter(job => !job.isCompleted)
      .forEach(job => {
        const serviceTypeId = job.serviceType;
        if (!serviceTypeCounts[serviceTypeId]) {
          serviceTypeCounts[serviceTypeId] = 0;
        }
        serviceTypeCounts[serviceTypeId]++;
      });
    
    const data = Object.entries(serviceTypeCounts).map(([typeId, count]) => {
      const numericTypeId = parseInt(typeId);
      const serviceType = SERVICE_TYPES[numericTypeId];
      
      // Get translation key
      let translationKey;
      switch (numericTypeId) {
        case 1: translationKey = 'serviceTypes.maintenance'; break;
        case 2: translationKey = 'serviceTypes.repair'; break;
        case 3: translationKey = 'serviceTypes.inspection'; break;
        case 4: translationKey = 'serviceTypes.tireChange'; break;
        case 5: translationKey = 'serviceTypes.other'; break;
        default: translationKey = 'serviceTypes.other';
      }
      
      return {
        name: t(translationKey),
        value: count,
        fill: serviceType?.color || "#cccccc"
      };
    });
    
    setChartData(data);
  }, [upcomingJobs, t]);

  return { chartData };
}
