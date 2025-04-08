
import { Calendar, Users, CheckCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { StatsCard } from "./StatsCard";

interface StatsData {
  todayAppointments: number;
  weekAppointments: number;
  totalCustomers: number;
  completedJobs: number;
}

interface StatsCardGridProps {
  stats: StatsData;
}

export function StatsCardGrid({ stats }: StatsCardGridProps) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard 
        title={t('overview.todayAppointments')} 
        value={stats.todayAppointments} 
        icon={Calendar} 
        colorClass="bg-blue"
      />
      
      <StatsCard 
        title={t('overview.weekAppointments')} 
        value={stats.weekAppointments} 
        icon={Calendar} 
        colorClass="bg-green"
      />
      
      <StatsCard 
        title={t('overview.totalCustomers')} 
        value={stats.totalCustomers} 
        icon={Users} 
        colorClass="bg-purple"
      />
      
      <StatsCard 
        title={t('overview.completedJobs')} 
        value={stats.completedJobs} 
        icon={CheckCircle} 
        colorClass="bg-amber"
      />
    </div>
  );
}
