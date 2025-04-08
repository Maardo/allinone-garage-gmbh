
import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/context/LanguageContext";
import { SERVICE_TYPES } from "@/lib/serviceTypes";

interface Appointment {
  id: number;
  date: Date;
  vehicleModel: string;
  serviceType: 1 | 2 | 3 | 4 | 5;
}

interface GroupedAppointments {
  [date: string]: Appointment[];
}

interface UpcomingAppointmentsProps {
  filteredJobs: Appointment[];
  timeView: "week" | "month";
  setTimeView: (view: "week" | "month") => void;
  jobsByDate: GroupedAppointments;
  locale: Locale;
}

export function UpcomingAppointments({ 
  filteredJobs, 
  timeView, 
  setTimeView, 
  jobsByDate,
  locale
}: UpcomingAppointmentsProps) {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col items-center text-center">
          <span className="text-4xl font-bold mb-2">{filteredJobs.length}</span>
          <CardTitle>{t('overview.upcomingJobs')}</CardTitle>
        </div>
        <div className="flex justify-center mt-4 space-x-2">
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
                      {jobs.map(job => {
                        const serviceTypeName = SERVICE_TYPES[job.serviceType].name.toLowerCase();
                        
                        return (
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
                                {t(`serviceTypes.${serviceTypeName}`)}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            {t('overview.noAppointments') + (timeView === "week" ? " " + t('overview.week').toLowerCase() : " " + t('overview.month').toLowerCase())}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
