
import { useState, useCallback } from 'react';
import { Appointment, Stats, TimeViewType } from '@/lib/overview/types';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { updateStats } from '@/services/statsService';

export function useOverviewState(initialStats: Stats, initialAppointments: Appointment[]) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [timeView, setTimeView] = useState<TimeViewType>("week");
  
  const [stats, setStats] = useState<Stats>(initialStats);
  const [upcomingJobs, setUpcomingJobs] = useState<Appointment[]>(initialAppointments);
  
  // Store previous state for undo functionality
  const [previousUpcomingJobs, setPreviousUpcomingJobs] = useState<Appointment[]>([...upcomingJobs]);
  const [previousStats, setPreviousStats] = useState<Stats>({...stats});
  
  const saveStateBeforeChange = useCallback(() => {
    setPreviousUpcomingJobs([...upcomingJobs]);
    setPreviousStats({...stats});
  }, [upcomingJobs, stats]);
  
  const undoLastChange = useCallback(() => {
    setUpcomingJobs([...previousUpcomingJobs]);
    setStats({...previousStats});
    
    toast({
      title: t('actions.undone'),
      description: t('actions.changesReverted'),
    });
    
    return true;
  }, [previousUpcomingJobs, previousStats, toast, t]);

  // Function to update total customers count
  const updateTotalCustomers = useCallback(async (change: number) => {
    try {
      saveStateBeforeChange();
      
      const newStats = {
        ...stats,
        totalCustomers: stats.totalCustomers + change
      };
      
      setStats(newStats);
      
      // Persist to database
      await updateStats(newStats);
    } catch (error) {
      console.error('Error updating total customers count:', error);
    }
  }, [saveStateBeforeChange, stats]);

  return {
    timeView,
    setTimeView,
    stats,
    setStats,
    upcomingJobs,
    setUpcomingJobs,
    saveStateBeforeChange,
    undoLastChange,
    updateTotalCustomers
  };
}
