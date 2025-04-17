import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/context/LanguageContext";
import { sv, de, enUS } from "date-fns/locale";
import { StatsCards } from "@/components/overview/StatsCards";
import { UpcomingAppointments } from "@/components/overview/UpcomingAppointments";
import { AppointmentsChart } from "@/components/overview/AppointmentsChart";
import { useOverviewAppointments } from "@/hooks/useOverviewAppointments";
import { useChartData } from "@/services/chartDataService";
import { groupAppointmentsByDate } from "@/utils/appointmentUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomers } from "@/hooks/useCustomers";
import { useLoanerCars } from "@/components/loaner-cars/useLoanerCars";
import { useAvailableCarOperations } from "@/components/loaner-cars/hooks/useAvailableCarOperations";

const dateLocales = {
  sv: sv,
  de: de,
  en: enUS,
};

export default function Overview() {
  const { language } = useLanguage();
  const { refreshCustomers, customers } = useCustomers();
  
  const { 
    timeView, 
    setTimeView, 
    stats, 
    filteredJobs, 
    upcomingJobs,
    handleMarkComplete,
    isLoading,
    EmailConfirmationDialog,
    refreshData
  } = useOverviewAppointments();
  
  const { chartData } = useChartData(upcomingJobs);
  
  const locale = dateLocales[language as keyof typeof dateLocales] || enUS;
  const jobsByDate = groupAppointmentsByDate(filteredJobs);

  // Simplified stats without loaner cars
  const enhancedStats = {
    todayAppointments: stats.todayAppointments,
    weekAppointments: stats.weekAppointments,
    totalCustomers: customers.length,
    completedJobs: stats.completedJobs,
  };

  // Ensure data is synchronized
  useEffect(() => {
    const syncData = async () => {
      await Promise.all([
        refreshCustomers(),
        refreshData()
      ]);
    };
    
    syncData();
    
    // Set up an interval to refresh data every minute
    const intervalId = setInterval(syncData, 60000);
    
    return () => clearInterval(intervalId);
  }, [refreshCustomers, refreshData]);

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-36 w-full rounded-lg" />
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-[500px] w-full rounded-lg" />
            <Skeleton className="h-[500px] w-full rounded-lg" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <StatsCards stats={enhancedStats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UpcomingAppointments 
          filteredJobs={filteredJobs}
          timeView={timeView}
          setTimeView={setTimeView}
          jobsByDate={jobsByDate}
          locale={locale}
          onMarkComplete={handleMarkComplete}
        />
        <AppointmentsChart chartData={chartData} />
      </div>
      
      <EmailConfirmationDialog />
    </Layout>
  );
}
