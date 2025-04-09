
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
          {allDays.map((day) => (
            <div
              key={day.toISOString()}
              className={cn(
                "calendar-day min-h-[60px] sm:min-h-[90px] p-1 border rounded-md",
                !isSameMonth(day, currentDate) ? "bg-gray-50 opacity-40" : "bg-card",
                isToday(day) && "border-primary border-2 shadow-sm"
              )}
              onClick={() => onNewAppointmentAtDate(day)}
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
