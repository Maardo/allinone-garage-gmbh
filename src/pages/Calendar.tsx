
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
  
  // Om på mobil, alltid defaulta till veckovis för bättre upplevelse
  useEffect(() => {
    if (isMobile && viewMode === 'month') {
      handleChangeViewMode('week');
    }
  }, [isMobile, viewMode, handleChangeViewMode]);

  return (
    <Layout>
      <div className="space-y-3 sm:space-y-4 px-1 sm:px-0 max-w-full overflow-hidden">
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
          existingAppointments={appointments}
        />

        <CalendarGrid 
          currentDate={currentDate}
          appointments={appointments}
          onSelectAppointment={handleSelectAppointment}
          onNewAppointmentAtDate={handleNewAppointmentAtDate}
          viewMode={viewMode}
        />

        <div className="mt-2 sm:mt-4">
          <ServiceTypeLegend />
        </div>
      </div>
    </Layout>
  );
}
