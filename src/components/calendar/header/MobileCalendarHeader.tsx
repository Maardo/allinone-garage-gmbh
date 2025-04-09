
import { ChevronLeft, ChevronRight, CalendarIcon, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AppointmentForm } from "@/components/AppointmentForm";
import { Appointment } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";
import { CalendarTitle } from "./CalendarTitle";
import { ViewModeSelector } from "./ViewModeSelector";
import { CalendarViewMode } from "@/lib/calendar/types";

interface MobileCalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onAddAppointment: (appointment: Appointment) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  selectedAppointment: Appointment | null;
  setSelectedAppointment: (appointment: Appointment | null) => void;
  viewMode: CalendarViewMode;
  onChangeViewMode: (mode: CalendarViewMode) => void;
}

export function MobileCalendarHeader({
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
  onChangeViewMode
}: MobileCalendarHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="mb-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="icon"
            onClick={onPrevMonth}
            aria-label={`${t('calendar.previous')} ${viewMode}`}
            className="h-7 w-7"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <CalendarTitle currentDate={currentDate} viewMode={viewMode} />
          <Button
            variant="outline"
            size="icon"
            onClick={onNextMonth}
            aria-label={`${t('calendar.next')} ${viewMode}`}
            className="h-7 w-7"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onToday} size="sm" className="h-7 text-xs px-2">
            <CalendarIcon className="h-3.5 w-3.5" />
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setSelectedAppointment(null)} size="sm" className="h-7 text-xs px-2">
                <PlusCircle className="h-3.5 w-3.5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[calc(100vw-32px)] sm:max-w-[600px] max-h-[90vh] overflow-y-auto mx-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedAppointment ? t('appointment.editAppointment') : t('appointment.newAppointment')}
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
      
      <div className="flex justify-between">
        <ViewModeSelector 
          viewMode={viewMode} 
          onChangeViewMode={onChangeViewMode} 
        />
      </div>
    </div>
  );
}
