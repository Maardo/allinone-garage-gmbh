
import { ChevronLeft, ChevronRight, CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AppointmentForm } from "@/components/AppointmentForm";
import { Appointment } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";
import { CalendarTitle } from "./CalendarTitle";
import { ViewModeSelector } from "./ViewModeSelector";
import { CalendarViewMode } from "@/lib/calendar/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface DesktopCalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onAddAppointment: (appointment: Appointment) => void;
  onDeleteAppointment?: (appointmentId: string) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  selectedAppointment: Appointment | null;
  setSelectedAppointment: (appointment: Appointment | null) => void;
  viewMode: CalendarViewMode;
  onChangeViewMode: (mode: CalendarViewMode) => void;
  existingAppointments?: Appointment[];
}

export function DesktopCalendarHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onToday,
  onAddAppointment,
  onDeleteAppointment,
  isDialogOpen,
  setIsDialogOpen,
  selectedAppointment,
  setSelectedAppointment,
  viewMode,
  onChangeViewMode,
  existingAppointments = []
}: DesktopCalendarHeaderProps) {
  const { t } = useLanguage();
  
  const handleDelete = () => {
    if (selectedAppointment && selectedAppointment.id && onDeleteAppointment) {
      onDeleteAppointment(selectedAppointment.id);
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
            aria-label={`${t('calendar.previous')} ${viewMode}`}
            className="h-7 w-7 sm:h-8 sm:w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <CalendarTitle currentDate={currentDate} viewMode={viewMode} />
          <Button
            variant="outline"
            size="icon"
            onClick={onNextMonth}
            aria-label={`${t('calendar.next')} ${viewMode}`}
            className="h-7 w-7 sm:h-8 sm:w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <ViewModeSelector 
            viewMode={viewMode} 
            onChangeViewMode={onChangeViewMode}
          />
          
          <Button variant="outline" onClick={onToday} size="sm" className="h-7 sm:h-8 text-xs sm:text-sm">
            <CalendarIcon className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
            {t('calendar.today')}
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setSelectedAppointment(null)} size="sm" className="h-7 sm:h-8 text-xs sm:text-sm">
                <PlusCircle className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                {t('calendar.new')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedAppointment ? t('appointment.editAppointment') : t('appointment.newAppointment')}
                </DialogTitle>
              </DialogHeader>
              <AppointmentForm 
                initialData={selectedAppointment || undefined} 
                onSubmit={onAddAppointment}
                existingAppointments={existingAppointments}
              />
              
              {selectedAppointment && onDeleteAppointment && (
                <DialogFooter className="mt-4 pt-4 border-t">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-1" />
                        {t('actions.delete')}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t('appointment.confirmDelete')}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t('appointment.confirmDeleteDescription')}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t('actions.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                          {t('actions.confirmDelete')}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DialogFooter>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
