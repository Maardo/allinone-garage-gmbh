
import { Layout } from "@/components/Layout";
import { StatsCards } from "@/components/overview/StatsCards";
import { AppointmentsChart } from "@/components/overview/AppointmentsChart";
import { UpcomingAppointments } from "@/components/overview/UpcomingAppointments";
import { useOverviewAppointments } from "@/hooks/useOverviewAppointments";
import { EmailConfirmationDialog } from "@/components/overview/EmailConfirmationDialog";
import { useLanguage } from "@/context/LanguageContext";
import { useChartData } from "@/services/chartDataService";
import { sv, de, enUS } from "date-fns/locale";
import { format } from "date-fns";
import { groupAppointmentsByDate } from "@/utils/appointmentUtils";

export default function OverviewPage() {
  const { language } = useLanguage();
  
  // Get the correct date-fns locale based on selected language
  const getLocale = () => {
    switch (language) {
      case 'sv': return sv;
      case 'de': return de;
      default: return enUS;
    }
  };

  const {
    timeView,
    setTimeView,
    stats,
    filteredJobs,
    upcomingJobs,
    handleMarkComplete,
    completeAppointment,
    showEmailConfirmDialog,
    setShowEmailConfirmDialog,
    selectedAppointment
  } = useOverviewAppointments();
  
  const { chartData } = useChartData(upcomingJobs);
  const jobsByDate = groupAppointmentsByDate(filteredJobs);
  const locale = getLocale();

  return (
    <Layout>
      <div className="space-y-6">
        <StatsCards stats={stats} />
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <AppointmentsChart chartData={chartData} />
          </div>
          
          <div className="lg:col-span-2">
            <UpcomingAppointments
              timeView={timeView}
              setTimeView={setTimeView}
              filteredJobs={filteredJobs}
              jobsByDate={jobsByDate}
              locale={locale}
              onMarkComplete={handleMarkComplete}
            />
          </div>
        </div>
      </div>
      
      {/* Email confirmation dialog */}
      <EmailConfirmationDialog 
        isOpen={showEmailConfirmDialog} 
        onOpenChange={setShowEmailConfirmDialog}
        onConfirm={(sendEmail) => {
          if (selectedAppointment) {
            completeAppointment(selectedAppointment.id, sendEmail);
          }
        }}
        customerName={selectedAppointment?.customerName || ''}
      />
    </Layout>
  );
}
