
import { format } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AppointmentForm } from "@/components/AppointmentForm";
import { Appointment } from "@/lib/types";

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onAddAppointment: (appointment: Appointment) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  selectedAppointment: Appointment | null;
  setSelectedAppointment: (appointment: Appointment | null) => void;
}

export function CalendarHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onToday,
  onAddAppointment,
  isDialogOpen,
  setIsDialogOpen,
  selectedAppointment,
  setSelectedAppointment,
}: CalendarHeaderProps) {
  return (
    <div className="mb-6 flex flex-col space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="icon"
            onClick={onPrevMonth}
            aria-label="Previous month"
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold px-1 w-28 text-center">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <Button
            variant="outline"
            size="icon"
            onClick={onNextMonth}
            aria-label="Next month"
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onToday} size="sm" className="h-8">
            <CalendarIcon className="mr-1 h-3.5 w-3.5" />
            Today
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setSelectedAppointment(null)} size="sm" className="h-8">
                <PlusCircle className="mr-1 h-3.5 w-3.5" />
                New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {selectedAppointment ? "Edit Appointment" : "New Appointment"}
                </DialogTitle>
              </DialogHeader>
              <AppointmentForm 
                initialData={selectedAppointment || undefined} 
                onSubmit={onAddAppointment}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
