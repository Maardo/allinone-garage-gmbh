
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { ServiceTypeLegend } from "@/components/calendar/ServiceTypeLegend";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCalendar } from "@/hooks/useCalendar";
import { useCustomers } from "@/hooks/useCustomers";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function CalendarPage() {
  const isMobile = useIsMobile();
  const { refreshCustomers } = useCustomers();
  const {
    currentDate,
    appointments,
    selectedAppointment,
    isDialogOpen,
    viewMode,
    isLoading,
    setIsDialogOpen,
    setSelectedAppointment,
    handleNavigatePrev,
    handleNavigateNext,
    goToToday,
    handleAddAppointment,
    handleSelectAppointment,
    handleNewAppointmentAtDate,
    handleDeleteAppointment,
    handleChangeViewMode,
    loadAppointments
  } = useCalendar();

  // Ensure data is synchronized by refreshing customers when appointments change
  useEffect(() => {
    const syncData = async () => {
      await refreshCustomers();
    };
    
    syncData();
  }, [appointments, refreshCustomers]);

  if (isLoading) {
    return (
      <Layout>
        <div className="h-[80vh] flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading calendar data...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-2 sm:space-y-4 px-0.5 sm:px-0 max-w-full overflow-hidden">
        <CalendarHeader 
          currentDate={currentDate}
          onPrevMonth={handleNavigatePrev}
          onNextMonth={handleNavigateNext}
          onToday={goToToday}
          onAddAppointment={handleAddAppointment}
          onDeleteAppointment={handleDeleteAppointment}
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
