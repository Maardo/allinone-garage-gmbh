
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { format, addDays, addMonths, isAfter, isBefore } from "date-fns";
import { sv, de, enUS } from 'date-fns/locale';
import { SERVICE_TYPES } from "@/lib/serviceTypes";

interface Job {
  id: number;
  date: Date;
  vehicleModel: string;
  serviceType: number;
}

interface UpcomingJobsListProps {
  jobs: Job[];
}

export function UpcomingJobsList({ jobs }: UpcomingJobsListProps) {
  const { t, language } = useLanguage();
  const [timeView, setTimeView] = useState<"week" | "month">("week");
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  
  // Get locale for date formatting
  const getLocale = () => {
    switch (language) {
      case 'sv': return sv;
      case 'de': return de;
      default: return enUS;
    }
  };

  // Filter jobs based on selected time view
  useEffect(() => {
    const now = new Date();
    let endDate;
    
    if (timeView === "week") {
      endDate = addDays(now, 7); // One week from now
    } else {
      endDate = addMonths(now, 1); // One month from now
    }
    
    const filtered = jobs.filter(job => 
      isAfter(job.date, now) && isBefore(job.date, endDate)
    );
    
    setFilteredJobs(filtered);
  }, [timeView, jobs]);
  
  // Group jobs by date for display
  const jobsByDate = filteredJobs.reduce((acc, job) => {
    const dateStr = format(job.date, 'yyyy-MM-dd');
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(job);
    return acc;
  }, {} as Record<string, Job[]>);
  
  const locale = getLocale();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t('overview.upcomingJobs')}</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant={timeView === "week" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setTimeView("week")}
          >
            {t('overview.week')}
          </Button>
          <Button 
            variant={timeView === "month" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setTimeView("month")}
          >
            {t('overview.month')}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        {Object.keys(jobsByDate).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(jobsByDate).map(([dateStr, jobs]) => {
              const date = new Date(dateStr);
              return (
                <div key={dateStr} className="border-b last:border-b-0">
                  <div className="px-6 py-2 text-sm font-medium border-b border-muted">
                    {format(date, 'EEEE d MMMM', { locale })}
                  </div>
                  <Table>
                    <TableBody>
                      {jobs.map(job => (
                        <TableRow key={job.id}>
                          <TableCell className="w-20">
                            {format(job.date, 'HH:mm')}
                          </TableCell>
                          <TableCell className="font-medium">
                            {job.vehicleModel}
                          </TableCell>
                          <TableCell className="text-right">
                            <div 
                              className="inline-flex px-2 py-1 rounded-md text-xs font-medium"
                              style={{ 
                                backgroundColor: `${SERVICE_TYPES[job.serviceType].color}20`,
                                color: SERVICE_TYPES[job.serviceType].color
                              }}
                            >
                              {t(`serviceTypes.${SERVICE_TYPES[job.serviceType].name.toLowerCase()}`)}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            {t(timeView === "week" 
              ? "overview.noAppointmentsWeek" 
              : "overview.noAppointmentsMonth"
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
