
import { useState, useEffect } from 'react';
import { addDays, addMonths, isAfter, isBefore } from 'date-fns';
import { Appointment, TimeViewType, Stats } from './types';

export function useAppointmentFiltering(timeView: TimeViewType, upcomingJobs: Appointment[], setStats: React.Dispatch<React.SetStateAction<Stats>>) {
  const [filteredJobs, setFilteredJobs] = useState<Appointment[]>([]);

  useEffect(() => {
    const now = new Date();
    let endDate;
    
    if (timeView === "week") {
      endDate = addDays(now, 7); // One week from now
    } else {
      endDate = addMonths(now, 1); // One month from now
    }
    
    const filtered = upcomingJobs.filter(job => 
      !job.isCompleted && isAfter(job.date, now) && isBefore(job.date, endDate)
    );
    
    setFilteredJobs(filtered);
    
    // Update the stats based on the filtered appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayAppointments = upcomingJobs.filter(job => 
      !job.isCompleted && 
      job.date >= today && 
      job.date < tomorrow
    ).length;
    
    const weekEndDate = addDays(today, 7);
    const weekAppointments = upcomingJobs.filter(job => 
      !job.isCompleted && 
      job.date >= today && 
      job.date < weekEndDate
    ).length;
    
    setStats(prevStats => ({
      ...prevStats,
      todayAppointments,
      weekAppointments
    }));
  }, [timeView, upcomingJobs, setStats]);

  return { filteredJobs };
}
