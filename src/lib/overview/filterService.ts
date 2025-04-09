
import { addDays, addMonths, isAfter, isBefore } from 'date-fns';
import { Appointment, TimeViewType } from './types';

export const filterJobsByTimeRange = (
  upcomingJobs: Appointment[],
  timeView: TimeViewType
): Appointment[] => {
  const now = new Date();
  let endDate;
  
  if (timeView === "week") {
    endDate = addDays(now, 7); // One week from now
  } else {
    endDate = addMonths(now, 1); // One month from now
  }
  
  return upcomingJobs.filter(job => 
    !job.isCompleted && isAfter(job.date, now) && isBefore(job.date, endDate)
  );
};

export const calculateStatsFromAppointments = (upcomingJobs: Appointment[]) => {
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

  return { todayAppointments, weekAppointments };
};
