
import { Calendar as CalendarIcon2 } from "lucide-react";
import { Appointment } from "@/lib/types";
import { CalendarViewMode } from "@/lib/calendar/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileCalendarHeader } from "./header/MobileCalendarHeader";
import { DesktopCalendarHeader } from "./header/DesktopCalendarHeader";

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
  isDialogOpen,
  setIsDialogOpen,
  selectedAppointment,
  setSelectedAppointment,
  viewMode,
  onChangeViewMode,
  existingAppointments, // Not used in the current implementation, but keeping for backward compatibility
}: CalendarHeaderProps) {
  const isMobile = useIsMobile();
  
  // Touch-friendly kompakta kontroller för mobil
  if (isMobile) {
    return (
      <MobileCalendarHeader 
        currentDate={currentDate}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
        onToday={onToday}
        onAddAppointment={onAddAppointment}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        selectedAppointment={selectedAppointment}
        setSelectedAppointment={setSelectedAppointment}
        viewMode={viewMode}
        onChangeViewMode={onChangeViewMode}
      />
    );
  }

  // Desktop version
  return (
    <DesktopCalendarHeader 
      currentDate={currentDate}
      onPrevMonth={onPrevMonth}
      onNextMonth={onNextMonth}
      onToday={onToday}
      onAddAppointment={onAddAppointment}
      isDialogOpen={isDialogOpen}
      setIsDialogOpen={setIsDialogOpen}
      selectedAppointment={selectedAppointment}
      setSelectedAppointment={setSelectedAppointment}
      viewMode={viewMode}
      onChangeViewMode={onChangeViewMode}
    />
  );
}
