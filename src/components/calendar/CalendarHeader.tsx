import { format } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight, PlusCircle, CalendarDays, CalendarCheck, Calendar as CalendarIcon2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AppointmentForm } from "@/components/AppointmentForm";
import { Appointment } from "@/lib/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";

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
  viewMode: 'day' | 'week' | 'month';
  onChangeViewMode: (mode: 'day' | 'week' | 'month') => void;
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
  viewMode,
  onChangeViewMode,
}: CalendarHeaderProps) {
  const isMobile = useIsMobile();
  
  const getViewTitle = () => {
    switch (viewMode) {
      case 'day':
        return format(currentDate, 'd MMMM yyyy');
      case 'week':
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1)); // Start from Monday
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // End on Sunday
        
        if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
          return `${format(startOfWeek, 'd')}–${format(endOfWeek, 'd MMM yyyy')}`;
        }
        else if (startOfWeek.getFullYear() === endOfWeek.getFullYear()) {
          return `${format(startOfWeek, 'd MMM')}–${format(endOfWeek, 'd MMM yyyy')}`;
        }
        else {
          return `${format(startOfWeek, 'd MMM yyyy')}–${format(endOfWeek, 'd MMM yyyy')}`;
        }
      case 'month':
      default:
        return format(currentDate, 'MMMM yyyy');
    }
  };

  const getViewButtonLabel = () => {
    switch (viewMode) {
      case 'day':
        return 'Day';
      case 'week':
        return 'Week';
      case 'month':
        return 'Month';
    }
  };

  const getViewIcon = () => {
    switch (viewMode) {
      case 'day':
        return <CalendarIcon2 className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />;
      case 'week':
        return <CalendarCheck className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />;
      case 'month':
        return <CalendarDays className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />;
    }
  };

  return (
    <div className="mb-4 sm:mb-6 flex flex-col space-y-3 sm:space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="icon"
            onClick={onPrevMonth}
            aria-label={`Previous ${viewMode}`}
            className="h-7 w-7 sm:h-8 sm:w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-base sm:text-lg font-semibold px-1 min-w-28 sm:min-w-32 text-center">
            {getViewTitle()}
          </h2>
          <Button
            variant="outline"
            size="icon"
            onClick={onNextMonth}
            aria-label={`Next ${viewMode}`}
            className="h-7 w-7 sm:h-8 sm:w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 sm:h-8 text-xs sm:text-sm">
                {getViewIcon()}
                {getViewButtonLabel()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem onClick={() => onChangeViewMode('day')} className="cursor-pointer">
                <CalendarIcon2 className="mr-2 h-4 w-4" />
                <span>Day</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChangeViewMode('week')} className="cursor-pointer">
                <CalendarCheck className="mr-2 h-4 w-4" />
                <span>Week</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChangeViewMode('month')} className="cursor-pointer">
                <CalendarDays className="mr-2 h-4 w-4" />
                <span>Month</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {!isMobile && (
            <Button variant="outline" onClick={onToday} size="sm" className="h-7 sm:h-8 text-xs sm:text-sm">
              <CalendarIcon className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
              Today
            </Button>
          )}
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setSelectedAppointment(null)} size="sm" className="h-7 sm:h-8 text-xs sm:text-sm">
                <PlusCircle className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                {isMobile ? "" : "New"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
