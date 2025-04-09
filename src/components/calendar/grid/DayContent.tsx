
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
    <div className="h-full flex flex-col">
      {/* Day number and add button */}
      <div className="flex justify-between items-center mb-0.5">
        <span 
          className={cn(
            "text-xs font-medium",
            isToday(day) && "bg-primary text-primary-foreground rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center"
          )}
        >
          {format(day, "d")}
        </span>
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-3 w-3 sm:h-4 sm:w-4 opacity-40 hover:opacity-100 p-0"
              onClick={onNewAppointmentAtDate}
            >
              <PlusCircle className="h-2 w-2 sm:h-3 sm:w-3" />
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>
      
      {/* Appointments list */}
      <div className="space-y-0.5 max-h-9 sm:max-h-16 overflow-y-auto text-xs grow">
        {appointments.length > 0 ? (
          appointments.slice(0, isMobile ? 2 : 3).map((appointment) => {
            return (
              <div
                key={appointment.id}
                onClick={() => onSelectAppointment(appointment)}
                className={cn(
                  "p-0.5 rounded cursor-pointer text-white text-[0.6rem] sm:text-xs",
                  "bg-primary", 
                  appointment.isCompleted && "opacity-60 line-through"
                )}
              >
                <div className="font-medium truncate">
                  {format(new Date(appointment.date), "HH:mm")} {appointment.customerName.split(' ')[0]}
                </div>
              </div>
            );
          })
        ) : null}
        
        {appointments.length > (isMobile ? 2 : 3) && (
          <div className="text-center text-[0.6rem] sm:text-xs text-muted-foreground">
            +{appointments.length - (isMobile ? 2 : 3)} more
          </div>
        )}
      </div>
    </div>
  );
}
