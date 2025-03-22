
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Appointment } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CalendarGridProps {
  currentDate: Date;
  appointments: Appointment[];
  onSelectAppointment: (appointment: Appointment) => void;
  onNewAppointmentAtDate: (date: Date) => void;
}

export function CalendarGrid({
  currentDate,
  appointments,
  onSelectAppointment,
  onNewAppointmentAtDate,
}: CalendarGridProps) {
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
      <div className="min-w-[640px]">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div 
              key={day} 
              className="text-center font-medium text-muted-foreground py-2 text-xs sm:text-sm"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 auto-rows-fr">
          {daysInMonth.map((day, i) => {
            // Adjust for starting the week on Monday
            let dayOfWeek = day.getDay(); // 0 = Sunday, 1 = Monday, etc.
            dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to 0 = Monday, 6 = Sunday
            
            // Create empty cells for days before the 1st of the month
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
                    "calendar-day",
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
                  "calendar-day",
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

interface DayContentProps {
  day: Date;
  currentDate: Date;
  appointments: Appointment[];
  onSelectAppointment: (appointment: Appointment) => void;
  onNewAppointmentAtDate: () => void;
}

function DayContent({ 
  day, 
  currentDate, 
  appointments, 
  onSelectAppointment,
  onNewAppointmentAtDate 
}: DayContentProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-1">
        <span 
          className={cn(
            "text-xs sm:text-sm font-medium",
            isToday(day) && "bg-primary text-primary-foreground rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center"
          )}
        >
          {format(day, "d")}
        </span>
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-4 w-4 sm:h-5 sm:w-5 opacity-50 hover:opacity-100"
              onClick={onNewAppointmentAtDate}
            >
              <PlusCircle className="h-3 w-3" />
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>
      <div className="space-y-0.5 max-h-16 overflow-y-auto">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            onClick={() => onSelectAppointment(appointment)}
            className={cn(
              "calendar-appointment",
              `service-type-${appointment.serviceType}`,
              appointment.isPaid && "opacity-80",
              appointment.isCompleted && "line-through opacity-60"
            )}
          >
            <div className="font-medium truncate text-xs">
              {format(new Date(appointment.date), "HH:mm")} {appointment.customerName}
            </div>
            <div className="truncate text-xs">{appointment.vehicleInfo}</div>
          </div>
        ))}
      </div>
    </>
  );
}
