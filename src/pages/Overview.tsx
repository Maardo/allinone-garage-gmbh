
import { Layout } from "@/components/Layout";
import { StatsCards } from "@/components/overview/StatsCards";
import { AppointmentsChart } from "@/components/overview/AppointmentsChart";
import { UpcomingAppointments } from "@/components/overview/UpcomingAppointments";
import { useOverviewAppointments } from "@/hooks/useOverviewAppointments";
import { EmailConfirmationDialog } from "@/components/overview/EmailConfirmationDialog";

export default function OverviewPage() {
  const {
    timeView,
    setTimeView,
    stats,
    filteredJobs,
    handleMarkComplete,
    completeAppointment,
    showEmailConfirmDialog,
    setShowEmailConfirmDialog,
    selectedAppointment
  } = useOverviewAppointments();

  return (
    <Layout>
      <div className="space-y-6">
        <StatsCards stats={stats} />
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <AppointmentsChart />
          </div>
          
          <div className="lg:col-span-2">
            <UpcomingAppointments
              timeView={timeView}
              setTimeView={setTimeView}
              appointments={filteredJobs}
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
