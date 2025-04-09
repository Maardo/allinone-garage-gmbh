
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { ServiceTypeLegend } from "@/components/calendar/ServiceTypeLegend";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCalendar } from "@/hooks/useCalendar";
import { toast } from "sonner";

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

  return (
    <Layout>
      <div className="space-y-2 sm:space-y-4 px-0.5 sm:px-0 max-w-full overflow-hidden">
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

        <div className="mt-1 sm:mt-4">
          <ServiceTypeLegend />
        </div>
      </div>
    </Layout>
  );
}
