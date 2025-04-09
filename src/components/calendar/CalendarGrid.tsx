
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday, 
  isSameDay,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Appointment } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { SERVICE_TYPES } from "@/lib/serviceTypes";

interface CalendarGridProps {
  currentDate: Date;
  appointments: Appointment[];
  onSelectAppointment: (appointment: Appointment) => void;
  onNewAppointmentAtDate: (date: Date) => void;
  viewMode: 'day' | 'week' | 'month';
}

export function CalendarGrid({
  currentDate,
  appointments,
  onSelectAppointment,
  onNewAppointmentAtDate,
  viewMode
}: CalendarGridProps) {
  const isMobile = useIsMobile();
  
  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter(appointment => 
      isSameDay(new Date(appointment.date), day)
    );
  };

  // Rendera olika vyer baserat på viewMode
  if (viewMode === 'day') {
    return (
      <DayView 
        day={currentDate} 
        appointments={getAppointmentsForDay(currentDate)} 
        onSelectAppointment={onSelectAppointment} 
        onNewAppointmentAtDate={onNewAppointmentAtDate}
      />
    );
  } else if (viewMode === 'week') {
    return (
      <WeekView 
        currentDate={currentDate} 
        appointments={appointments} 
        onSelectAppointment={onSelectAppointment} 
        onNewAppointmentAtDate={onNewAppointmentAtDate}
      />
    );
  }

  // Month view (default)
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

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
            // Justera för att börja veckan på måndag
            let dayOfWeek = day.getDay(); // 0 = söndag, 1 = måndag, etc.
            dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Konvertera till 0 = måndag, 6 = söndag
            
            // Skapa tomma celler för dagar innan den första i månaden
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
  const isMobile = useIsMobile();
  
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
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-4 w-4 opacity-50 hover:opacity-100"
              onClick={onNewAppointmentAtDate}
            >
              <PlusCircle className="h-3 w-3" />
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>
      <div className="space-y-0.5 max-h-10 sm:max-h-16 overflow-y-auto text-xs">
        {appointments.length > 0 ? (
          appointments.slice(0, isMobile ? 2 : 3).map((appointment) => {
            return (
              <div
                key={appointment.id}
                onClick={() => onSelectAppointment(appointment)}
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
          <div className="text-center text-xs text-muted-foreground py-1">
            {isMobile ? "" : "No appointments"}
          </div>
        )}
        {appointments.length > (isMobile ? 2 : 3) && (
          <div className="text-center text-xs text-muted-foreground">
            +{appointments.length - (isMobile ? 2 : 3)} more
          </div>
        )}
      </div>
    </>
  );
}

interface DayViewProps {
  day: Date;
  appointments: Appointment[];
  onSelectAppointment: (appointment: Appointment) => void;
  onNewAppointmentAtDate: (date: Date) => void;
}

function DayView({ day, appointments, onSelectAppointment, onNewAppointmentAtDate }: DayViewProps) {
  const isMobile = useIsMobile();
  
  // Generera timmar för dagen - justera baserat på mobil
  const startHour = 8; // 8 AM
  const endHour = isMobile ? 18 : 19; // 6 PM eller 7 PM
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => i + startHour);

  return (
    <div className="border rounded-md bg-card overflow-y-auto max-h-[calc(100vh-230px)] w-full">
      <div className="sticky top-0 bg-card z-10 border-b flex justify-between items-center p-2">
        <h3 className="font-medium text-sm sm:text-base">{format(day, "EEEE, MMMM d, yyyy")}</h3>
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
                {format(hourDate, "h a")}
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
                          "bg-blue-600", // Alltid använd blå bakgrund för bättre synlighet
                          appointment.isCompleted && "line-through opacity-60"
                        )}
                      >
                        <div className="font-medium text-xs sm:text-sm">
                          {format(new Date(appointment.date), "HH:mm")} - {appointment.customerName}
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

interface WeekViewProps {
  currentDate: Date;
  appointments: Appointment[];
  onSelectAppointment: (appointment: Appointment) => void;
  onNewAppointmentAtDate: (date: Date) => void;
}

function WeekView({ currentDate, appointments, onSelectAppointment, onNewAppointmentAtDate }: WeekViewProps) {
  const isMobile = useIsMobile();
  
  // Få början av veckan (måndag) och slutet av veckan (söndag)
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  
  // Generera dagarna i veckan
  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  // För mobil, visa bara 3 dagar åt gången, centrerade kring det aktuella datumet
  const visibleDays = daysOfWeek;
  
  return (
    <div className="border rounded-md bg-card overflow-x-auto w-full">
      <div className={cn(
        "grid divide-x border-b sticky top-0 z-10 bg-card",
        "grid-cols-7",
        isMobile ? "min-w-[700px]" : "" // Alltid visa hela veckovyn med horisontell scroll på mobil
      )}>
        {/* Veckodagar header */}
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
        isMobile ? "min-w-[700px]" : "" // Alltid visa hela veckovyn med horisontell scroll på mobil
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
