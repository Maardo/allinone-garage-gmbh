
import { useState, useEffect, useCallback } from 'react';
import { Appointment, Stats } from '@/lib/overview/types';
import { fetchAppointments } from '@/services/appointmentService';
import { fetchStats } from '@/services/statsService';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';

export function useAppointmentDataLoader() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [initialStats, setInitialStats] = useState<Stats>({
    todayAppointments: 0,
    weekAppointments: 0,
    totalCustomers: 0,
    completedJobs: 0
  });
  const [initialAppointments, setInitialAppointments] = useState<Appointment[]>([]);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  
  // Fetch data from Supabase
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [appointmentsData, statsData] = await Promise.all([
        fetchAppointments(),
        fetchStats()
      ]);
      
      setInitialAppointments(appointmentsData);
      setInitialStats(statsData);
      setLastRefreshed(new Date());
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: t('common.error'),
        description: t('overview.errorLoadingData'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, t]);
  
  // Initial data loading
  useEffect(() => {
    loadData();
  }, [loadData]);
  
  // Set up refresh interval
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      loadData();
    }, 30000); // 30 seconds
    
    // Refresh when tab becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Only refresh if it's been more than 10 seconds since last refresh
        const now = new Date();
        const timeSinceLastRefresh = now.getTime() - lastRefreshed.getTime();
        if (timeSinceLastRefresh > 10000) { // 10 seconds
          loadData();
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(refreshInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadData, lastRefreshed]);

  return {
    isLoading,
    initialStats,
    initialAppointments,
    lastRefreshed,
    loadData
  };
}
