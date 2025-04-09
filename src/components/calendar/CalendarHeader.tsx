
import { useIsMobile } from "@/hooks/use-mobile";
import { Appointment } from "@/lib/types";
import { CalendarViewMode } from "@/lib/calendar/types";
import { MobileCalendarHeader } from "./header/MobileCalendarHeader";
import { DesktopCalendarHeader } from "./header/DesktopCalendarHeader";

interface CalendarHeaderProps {
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

export function CalendarHeader({
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
}: CalendarHeaderProps) {
  const isMobile = useIsMobile();
  
  // Render appropriate header based on screen size
  if (isMobile) {
    return (
      <MobileCalendarHeader
        currentDate={currentDate}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
        onToday={onToday}
        onAddAppointment={onAddAppointment}
        onDeleteAppointment={onDeleteAppointment}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        selectedAppointment={selectedAppointment}
        setSelectedAppointment={setSelectedAppointment}
        viewMode={viewMode}
        onChangeViewMode={onChangeViewMode}
        existingAppointments={existingAppointments}
      />
    );
  }
  
  // Desktop header
  return (
    <DesktopCalendarHeader
      currentDate={currentDate}
      onPrevMonth={onPrevMonth}
      onNextMonth={onNextMonth}
      onToday={onToday}
      onAddAppointment={onAddAppointment}
      onDeleteAppointment={onDeleteAppointment}
      isDialogOpen={isDialogOpen}
      setIsDialogOpen={setIsDialogOpen}
      selectedAppointment={selectedAppointment}
      setSelectedAppointment={setSelectedAppointment}
      viewMode={viewMode}
      onChangeViewMode={onChangeViewMode}
      existingAppointments={existingAppointments}
    />
  );
}
