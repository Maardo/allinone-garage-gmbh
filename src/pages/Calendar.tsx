
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { ServiceTypeLegend } from "@/components/calendar/ServiceTypeLegend";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCalendar } from "@/hooks/useCalendar";

export default function CalendarPage() {
  const isMobile = useIsMobile();
  const {
    currentDate,
    appointments,
    selectedAppointment,
    isDialogOpen,
    viewMode,
    setIsDialogOpen,
    setSelectedAppointment,
    handleNavigatePrev,
    handleNavigateNext,
    goToToday,
    handleAddAppointment,
    handleSelectAppointment,
    handleNewAppointmentAtDate,
    handleChangeViewMode
  } = useCalendar();
  
  // If on mobile, default to week view for better UX
  useEffect(() => {
    if (isMobile) {
      handleChangeViewMode('week');
    }
  }, [isMobile]);

  return (
    <Layout>
      <CalendarHeader 
        currentDate={currentDate}
        onPrevMonth={handleNavigatePrev}
        onNextMonth={handleNavigateNext}
        onToday={goToToday}
        onAddAppointment={handleAddAppointment}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        selectedAppointment={selectedAppointment}
        setSelectedAppointment={setSelectedAppointment}
        viewMode={viewMode}
        onChangeViewMode={handleChangeViewMode}
      />

      <CalendarGrid 
        currentDate={currentDate}
        appointments={appointments}
        onSelectAppointment={handleSelectAppointment}
        onNewAppointmentAtDate={handleNewAppointmentAtDate}
        viewMode={viewMode}
      />

      <ServiceTypeLegend />
    </Layout>
  );
}
