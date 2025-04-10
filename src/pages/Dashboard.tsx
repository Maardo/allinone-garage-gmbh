
import { Layout } from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardAppointments } from "@/components/dashboard/DashboardAppointments";
import { DashboardQuickActions } from "@/components/dashboard/DashboardQuickActions";

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Mock statistics for demonstration
  const stats = {
    todayAppointments: 3,
    pendingPayments: 5,
    availableLoanerCars: 1,
    completedToday: 2
  };
  
  // Mock upcoming appointments
  const upcomingAppointments = [
    {
      id: "1",
      time: "10:00",
      customer: "Johan Andersson",
      vehicle: "Volvo V70",
      serviceType: t('serviceTypes.maintenance')
    },
    {
      id: "2",
      time: "13:30",
      customer: "Maria Johansson",
      vehicle: "Audi A4",
      serviceType: t('serviceTypes.repair')
    },
    {
      id: "3",
      time: "15:45",
      customer: "Erik Svensson",
      vehicle: "BMW 3 Series",
      serviceType: t('serviceTypes.inspection')
    }
  ];

  return (
    <Layout title={t('dashboard.welcome')} subtitle={t('dashboard.summary')}>
      <DashboardStats stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DashboardAppointments appointments={upcomingAppointments} />
        <DashboardQuickActions />
      </div>
    </Layout>
  );
}
