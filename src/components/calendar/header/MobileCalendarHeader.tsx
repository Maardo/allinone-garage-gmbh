
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

interface MobileCalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onAddAppointment: (appointment: Appointment) => void;
  onDeleteAppointment?: (appointmentId: number) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  selectedAppointment: Appointment | null;
  setSelectedAppointment: (appointment: Appointment | null) => void;
  viewMode: CalendarViewMode;
  onChangeViewMode: (mode: CalendarViewMode) => void;
  existingAppointments?: Appointment[];
}

export function MobileCalendarHeader({
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
}: MobileCalendarHeaderProps) {
  const { t } = useLanguage();

  const handleDelete = () => {
    if (selectedAppointment && typeof selectedAppointment.id === 'number' && onDeleteAppointment) {
      onDeleteAppointment(selectedAppointment.id);
    }
  };

  return (
    <div className="mb-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="icon"
            onClick={onPrevMonth}
            aria-label={`${t('calendar.previous')} ${viewMode}`}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <CalendarTitle currentDate={currentDate} viewMode={viewMode} />
          <Button
            variant="outline"
            size="icon"
            onClick={onNextMonth}
            aria-label={`${t('calendar.next')} ${viewMode}`}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onToday} size="sm" className="h-8 text-xs px-2 min-h-0">
            <CalendarIcon className="h-3.5 w-3.5" />
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setSelectedAppointment(null)} size="sm" className="h-8 text-xs px-2 min-h-0">
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
      
      <div className="flex justify-between items-center">
        <ViewModeSelector 
          viewMode={viewMode} 
          onChangeViewMode={onChangeViewMode} 
        />
      </div>
    </div>
  );
}
