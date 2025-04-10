
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

interface Appointment {
  id: string;
  time: string;
  customer: string;
  vehicle: string;
  serviceType: string;
}

interface DashboardAppointmentsProps {
  appointments: Appointment[];
}

export function DashboardAppointments({ appointments }: DashboardAppointmentsProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{t('dashboard.todaySchedule')}</CardTitle>
            <CardDescription>{t('dashboard.upcomingAppointmentsToday')}</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/calendar")}>
            <Calendar className="h-4 w-4 mr-2" />
            {t('dashboard.fullCalendar')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>{t('dashboard.noAppointments')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div 
                key={appointment.id} 
                className="flex items-center p-3 bg-secondary/50 rounded-lg"
              >
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-medium text-foreground">{appointment.customer}</p>
                    <p className="text-sm font-semibold">{appointment.time}</p>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <p className="truncate">{appointment.vehicle}</p>
                    <p>{appointment.serviceType}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
