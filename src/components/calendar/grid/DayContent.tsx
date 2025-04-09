
import { format, isSameDay, isToday } from "date-fns";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Appointment } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

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
