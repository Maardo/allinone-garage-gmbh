
import { format, isSameDay, isToday, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { sv, de, enUS } from "date-fns/locale";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Appointment } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/context/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WeekViewProps {
  currentDate: Date;
  appointments: Appointment[];
  onSelectAppointment: (appointment: Appointment) => void;
  onNewAppointmentAtDate: (date: Date) => void;
}

export function WeekView({ currentDate, appointments, onSelectAppointment, onNewAppointmentAtDate }: WeekViewProps) {
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  
  // Get locale for date formatting
  const getLocale = () => {
    switch (language) {
      case 'sv': return sv;
      case 'de': return de;
      default: return enUS;
    }
  };
  
  // Get start of week (Monday) and end of week (Sunday)
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  
  // Generate days of the week
  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  // Get today's date for highlighting
  const today = new Date();
  
  return (
    <div className="border rounded-md bg-card w-full">
      <ScrollArea className="w-full overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-7 divide-x border-b sticky top-0 z-10 bg-card">
            {/* Week days header */}
            {daysOfWeek.map(day => (
              <div 
                key={day.toISOString() + "-header"} 
                className={cn(
                  "p-2 text-center",
                  isToday(day) && "bg-primary/10"
                )}
              >
                <div className="font-medium text-xs">
                  {format(day, "EEE", { locale: getLocale() })}
                </div>
                <div className={cn(
                  "text-xs",
                  isToday(day) && "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mx-auto"
                )}>
                  {format(day, "d", { locale: getLocale() })}
                </div>
              </div>
            ))}
          </div>
          
          {/* Week content */}
          <div className="grid grid-cols-7 divide-x min-h-[300px] max-h-[calc(100vh-250px)] overflow-y-auto">
            {daysOfWeek.map(day => {
              const dayAppointments = appointments.filter(appointment => 
                isSameDay(new Date(appointment.date), day)
              );
              
              return (
                <div 
                  key={day.toISOString() + "-content"} 
                  className={cn(
                    "p-2 relative",
                    isToday(day) && "bg-primary/5"
                  )}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0 opacity-50 hover:opacity-100"
                    onClick={() => onNewAppointmentAtDate(day)}
                  >
                    <PlusCircle className="h-3 w-3" />
                  </Button>
                  
                  <div className="mt-6 space-y-1">
                    {dayAppointments.map(appointment => {
                      const appointmentDate = new Date(appointment.date);
                      return (
                        <div
                          key={appointment.id}
                          onClick={() => onSelectAppointment(appointment)}
                          className={cn(
                            "p-1 rounded cursor-pointer text-white",
                            "bg-blue-600", 
                            appointment.isCompleted && "line-through opacity-60"
                          )}
                        >
                          <div className="font-medium text-xs">
                            {format(appointmentDate, "HH:mm", { locale: getLocale() })}
                          </div>
                          <div className="text-xs truncate">{appointment.customerName}</div>
                        </div>
                      );
                    })}
                    
                    {dayAppointments.length === 0 && !isMobile && (
                      <div className="text-center text-muted-foreground text-xs py-2">
                        No appointments
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
