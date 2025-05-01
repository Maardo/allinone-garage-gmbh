
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardAppointments } from "@/components/dashboard/DashboardAppointments";
import { DashboardQuickActions } from "@/components/dashboard/DashboardQuickActions";
import { fetchStats } from "@/services/statsService";
import { syncCustomerCount } from "@/services/statsService";

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingPayments: 0,
    availableLoanerCars: 1,
    completedToday: 0
  });
  
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

  // Load stats from the database
  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      try {
        const dbStats = await fetchStats();
        
        // Ensure customer count is accurate
        await syncCustomerCount();
        
        setStats({
          todayAppointments: dbStats.todayAppointments,
          pendingPayments: 5, // Mock data
          availableLoanerCars: 1, // Mock data
          completedToday: dbStats.completedJobs
        });
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStats();
  }, []);

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
