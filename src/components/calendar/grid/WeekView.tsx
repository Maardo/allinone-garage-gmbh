
import { format, isSameDay, isToday, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Appointment } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface WeekViewProps {
  currentDate: Date;
  appointments: Appointment[];
  onSelectAppointment: (appointment: Appointment) => void;
  onNewAppointmentAtDate: (date: Date) => void;
}

export function WeekView({ currentDate, appointments, onSelectAppointment, onNewAppointmentAtDate }: WeekViewProps) {
  const isMobile = useIsMobile();
  
  // Get start of week (Monday) and end of week (Sunday)
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  
  // Generate days of the week
  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  // For mobile, show all 7 days with horizontal scroll
  const visibleDays = daysOfWeek;
  
  return (
    <div className="border rounded-md bg-card overflow-x-auto w-full">
      <div className={cn(
        "grid divide-x border-b sticky top-0 z-10 bg-card",
        "grid-cols-7",
        isMobile ? "min-w-[700px]" : "" // Always show full week view with horizontal scroll on mobile
      )}>
        {/* Week days header */}
        {visibleDays.map(day => (
          <div 
            key={day.toISOString() + "-header"} 
            className={cn(
              "p-2 text-center",
              isToday(day) && "bg-primary/10"
            )}
          >
            <div className="font-medium text-xs">{format(day, "EEE")}</div>
            <div className={cn(
              "text-xs",
              isToday(day) && "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mx-auto"
            )}>
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>
      
      {/* Week content */}
      <div className={cn(
        "grid divide-x min-h-[300px] max-h-[calc(100vh-250px)] overflow-y-auto",
        "grid-cols-7",
        isMobile ? "min-w-[700px]" : "" // Always show full week view with horizontal scroll on mobile
      )}>
        {visibleDays.map(day => {
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
                        {format(new Date(appointment.date), "HH:mm")}
                      </div>
                      <div className="text-xs truncate">{appointment.customerName}</div>
                    </div>
                  );
                })}
                
                {dayAppointments.length === 0 && (
                  <div className="text-center text-muted-foreground text-xs py-2">
                    {isMobile ? "" : "No appointments"}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
