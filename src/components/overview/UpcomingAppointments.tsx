
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { format } from "date-fns";
import { sv, de, enUS } from "date-fns/locale";
import { SERVICE_TYPES, ServiceType } from "@/lib/serviceTypes";

type Locale = typeof sv | typeof de | typeof enUS;

interface Appointment {
  id: number;
  date: Date;
  vehicleModel: string;
  serviceType: ServiceType;
}

interface GroupedAppointments {
  [key: string]: Appointment[];
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
      <CardHeader className="text-center pb-0">
        <div className="flex flex-col items-center justify-center">
          <div className="text-4xl font-bold">{filteredJobs.length}</div>
          <CardTitle className="mt-1">{t('overview.upcomingAppointments')}</CardTitle>
        </div>
        <div className="flex justify-center mt-4">
          <div className="flex gap-2 bg-secondary rounded-lg p-1">
            <button
              onClick={() => setTimeView("week")}
              className={`px-3 py-1 rounded ${
                timeView === "week" ? "bg-white shadow-sm" : ""
              }`}
            >
              {t('overview.week')}
            </button>
            <button
              onClick={() => setTimeView("month")}
              className={`px-3 py-1 rounded ${
                timeView === "month" ? "bg-white shadow-sm" : ""
              }`}
            >
              {t('overview.month')}
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {t('overview.noAppointments')}
          </div>
        ) : (
          <div className="space-y-4">
            {Object.keys(jobsByDate).map((date) => (
              <div key={date}>
                <h3 className="font-medium mb-2">
                  {format(new Date(date), "EEEE, d MMMM", { locale })}
                </h3>
                <div className="space-y-2">
                  {jobsByDate[date].map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center p-2 rounded-md bg-secondary/30"
                    >
                      <div
                        className="w-2 h-6 rounded-full mr-3"
                        style={{
                          backgroundColor: SERVICE_TYPES[job.serviceType].color,
                        }}
                      ></div>
                      <div className="flex-1">
                        <div className="font-medium">{job.vehicleModel}</div>
                        <div className="text-sm text-muted-foreground">
                          {t(`serviceTypes.${job.serviceType === 1 ? 'maintenance' : 
                             job.serviceType === 2 ? 'repair' : 
                             job.serviceType === 3 ? 'inspection' : 
                             job.serviceType === 4 ? 'tireChange' : 'other'}`)}
                        </div>
                      </div>
                      <div className="text-sm">
                        {format(job.date, "HH:mm")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
