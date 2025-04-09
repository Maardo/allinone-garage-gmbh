
import { format } from "date-fns";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Appointment } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/context/LanguageContext";
import { sv, de, enUS } from "date-fns/locale";

interface DayViewProps {
  day: Date;
  appointments: Appointment[];
  onSelectAppointment: (appointment: Appointment) => void;
  onNewAppointmentAtDate: (date: Date) => void;
}

export function DayView({ day, appointments, onSelectAppointment, onNewAppointmentAtDate }: DayViewProps) {
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  
  // Get the appropriate locale based on the selected language
  const getLocale = () => {
    switch (language) {
      case 'sv':
        return sv;
      case 'de':
        return de;
      case 'en':
      default:
        return enUS;
    }
  };
  
  // Generate hours for the day - adjust based on mobile
  const startHour = 8; // 8 AM
  const endHour = isMobile ? 18 : 19; // 6 PM or 7 PM
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => i + startHour);
  const locale = getLocale();

  return (
    <div className="border rounded-md bg-card overflow-y-auto max-h-[calc(100vh-230px)] w-full">
      <div className="sticky top-0 bg-card z-10 border-b flex justify-between items-center p-2">
        <h3 className="font-medium text-sm sm:text-base">{format(day, "EEEE, d MMMM yyyy", { locale })}</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 opacity-80 hover:opacity-100"
              onClick={() => onNewAppointmentAtDate(day)}
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              {!isMobile && "Add"}
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>
      
      <div className="divide-y">
        {hours.map((hour) => {
          const hourDate = new Date(day);
          hourDate.setHours(hour, 0, 0, 0);
          
          const hourAppointments = appointments.filter(app => {
            const appDate = new Date(app.date);
            return appDate.getHours() === hour;
          });
          
          return (
            <div key={hour} className="p-2 hover:bg-gray-50 flex">
              <div className="w-10 sm:w-16 font-medium text-muted-foreground text-xs sm:text-sm shrink-0">
                {format(hourDate, "HH:00", { locale })}
              </div>
              <div className="flex-1">
                {hourAppointments.length > 0 ? (
                  hourAppointments.map(appointment => {
                    return (
                      <div
                        key={appointment.id}
                        onClick={() => onSelectAppointment(appointment)}
                        className={cn(
                          "p-2 rounded cursor-pointer text-white mb-1",
                          "bg-blue-600",
                          appointment.isCompleted && "line-through opacity-60"
                        )}
                      >
                        <div className="font-medium text-xs sm:text-sm">
                          {format(new Date(appointment.date), "HH:mm", { locale })} - {appointment.customerName}
                        </div>
                        <div className="text-xs sm:text-sm">{appointment.vehicleMake} - {appointment.vehicleLicense}</div>
                        {!isMobile && appointment.notes && (
                          <div className="text-xs mt-1 opacity-90">{appointment.notes}</div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div 
                    className="h-6 w-full rounded border border-dashed border-gray-200 hover:border-gray-300 cursor-pointer"
                    onClick={() => {
                      const newDate = new Date(day);
                      newDate.setHours(hour);
                      onNewAppointmentAtDate(newDate);
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
