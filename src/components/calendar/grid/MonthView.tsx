
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Appointment } from "@/lib/types";
import { DayContent } from "./DayContent";

interface MonthViewProps {
  currentDate: Date;
  appointments: Appointment[];
  onSelectAppointment: (appointment: Appointment) => void;
  onNewAppointmentAtDate: (date: Date) => void;
}

export function MonthView({ 
  currentDate, 
  appointments,
  onSelectAppointment,
  onNewAppointmentAtDate
}: MonthViewProps) {
  const isMobile = useIsMobile();
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter(appointment => 
      isSameDay(new Date(appointment.date), day)
    );
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="w-full min-w-[320px]">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {(isMobile ? ["M", "T", "W", "T", "F", "S", "S"] : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]).map((day) => (
            <div 
              key={day} 
              className="text-center font-medium text-muted-foreground py-1 text-xs"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 auto-rows-fr">
          {daysInMonth.map((day, i) => {
            // Adjust to start week on Monday
            let dayOfWeek = day.getDay(); // 0 = Sunday, 1 = Monday, etc.
            dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to 0 = Monday, 6 = Sunday
            
            // Create empty cells for days before the first of the month
            const startOffset = dayOfWeek;
            if (i === 0) {
              const emptyCells = Array(startOffset).fill(null);
              return [
                ...emptyCells.map((_, index) => (
                  <div key={`empty-${index}`} className="calendar-day opacity-0"></div>
                )),
                <div
                  key={day.toISOString()}
                  className={cn(
                    "calendar-day min-h-[50px] sm:min-h-[80px] p-1 border rounded-md bg-card",
                    !isSameMonth(day, currentDate) && "opacity-40",
                    isToday(day) && "border-primary shadow-sm"
                  )}
                >
                  <DayContent 
                    day={day} 
                    currentDate={currentDate}
                    appointments={getAppointmentsForDay(day)}
                    onSelectAppointment={onSelectAppointment}
                    onNewAppointmentAtDate={() => onNewAppointmentAtDate(day)}
                  />
                </div>
              ];
            }
            
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "calendar-day min-h-[50px] sm:min-h-[80px] p-1 border rounded-md bg-card",
                  !isSameMonth(day, currentDate) && "opacity-40",
                  isToday(day) && "border-primary shadow-sm"
                )}
              >
                <DayContent 
                  day={day} 
                  currentDate={currentDate}
                  appointments={getAppointmentsForDay(day)}
                  onSelectAppointment={onSelectAppointment}
                  onNewAppointmentAtDate={() => onNewAppointmentAtDate(day)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
