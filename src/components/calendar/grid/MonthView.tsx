
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addDays, getDay } from "date-fns";
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

  // Calculate days to display before the first day of the month
  const startWeekday = getDay(monthStart);
  // Convert from 0 = Sunday to 0 = Monday
  const startDayOffset = startWeekday === 0 ? 6 : startWeekday - 1;
  const prevDays = Array.from({ length: startDayOffset }).map((_, i) => 
    addDays(monthStart, -1 * (startDayOffset - i))
  );

  // Combine all days to display
  const calendarDays = [...prevDays, ...daysInMonth];
  
  // Calculate rows based on the number of days
  const rows = Math.ceil(calendarDays.length / 7);
  
  // Complete the grid with days from the next month
  const nextDays = Array.from({ length: rows * 7 - calendarDays.length }).map((_, i) => 
    addDays(monthEnd, i + 1)
  );
  
  // Final calendar grid
  const allDays = [...calendarDays, ...nextDays];

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter(appointment => 
      isSameDay(new Date(appointment.date), day)
    );
  };

  return (
    <div className="overflow-x-auto pb-2">
      <div className="w-full min-w-[320px]">
        {/* Day headers - more compact on mobile */}
        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {(isMobile ? ["M", "T", "W", "T", "F", "S", "S"] : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]).map((day) => (
            <div 
              key={day} 
              className="text-center font-medium text-muted-foreground py-1 text-xs"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days grid - more compact on mobile */}
        <div className="grid grid-cols-7 gap-0.5 auto-rows-fr">
          {allDays.map((day) => (
            <div
              key={day.toISOString()}
              className={cn(
                "calendar-day min-h-[40px] sm:min-h-[80px] p-0.5 sm:p-1 border rounded-md bg-card",
                !isSameMonth(day, currentDate) && "opacity-40 bg-muted/30",
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
          ))}
        </div>
      </div>
    </div>
  );
}
