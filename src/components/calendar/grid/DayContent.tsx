
import { format, isSameDay, isToday } from "date-fns";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Appointment } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/context/LanguageContext";

interface DayContentProps {
  day: Date;
  currentDate: Date;
  appointments: Appointment[];
  onSelectAppointment: (appointment: Appointment) => void;
  onNewAppointmentAtDate: () => void;
}

export function DayContent({ 
  day, 
  currentDate, 
  appointments, 
  onSelectAppointment,
  onNewAppointmentAtDate 
}: DayContentProps) {
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  
  // Get locale for date formatting
  const getLocale = () => {
    switch (language) {
      case 'sv': return 'sv';
      case 'de': return 'de';
      default: return 'en';
    }
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-1">
        <span 
          className={cn(
            "text-xs font-medium",
            isToday(day) && "bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center"
          )}
        >
          {format(day, "d")}
        </span>
        {appointments.length > 0 && (
          <span className="text-[0.65rem] bg-blue-100 text-blue-800 px-1 rounded-full">
            {appointments.length}
          </span>
        )}
      </div>
      <div className="space-y-0.5 max-h-12 sm:max-h-20 overflow-y-auto text-xs">
        {appointments.length > 0 ? (
          appointments.slice(0, isMobile ? 2 : 3).map((appointment) => {
            return (
              <div
                key={appointment.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectAppointment(appointment);
                }}
                className={cn(
                  "calendar-appointment p-0.5 px-1 rounded cursor-pointer text-white",
                  "bg-blue-600", 
                  appointment.isCompleted && "opacity-60 line-through"
                )}
              >
                <div className="font-medium truncate text-xs">
                  {format(new Date(appointment.date), "HH:mm")} {appointment.customerName.split(' ')[0]}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-xs text-muted-foreground py-1 opacity-50">
            {isMobile ? "" : "No appointments"}
          </div>
        )}
        {appointments.length > (isMobile ? 2 : 3) && (
          <div className="text-center text-[0.65rem] text-blue-700 bg-blue-50 rounded-sm">
            +{appointments.length - (isMobile ? 2 : 3)} more
          </div>
        )}
      </div>
    </>
  );
}
