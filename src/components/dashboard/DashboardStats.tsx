
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Car, CheckCircle, CreditCard } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface DashboardStatsProps {
  stats: {
    todayAppointments: number;
    pendingPayments: number;
    availableLoanerCars: number;
    completedToday: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const { t } = useLanguage();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-blue-50 border-blue-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-700">{t('dashboard.todayAppointments')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <Calendar className="h-8 w-8 text-blue-500" />
            <span className="text-3xl font-bold text-blue-700">{stats.todayAppointments}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-amber-50 border-amber-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-amber-700">{t('dashboard.pendingPayments')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <CreditCard className="h-8 w-8 text-amber-500" />
            <span className="text-3xl font-bold text-amber-700">{stats.pendingPayments}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-green-50 border-green-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-700">{t('dashboard.availableLoanerCars')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <Car className="h-8 w-8 text-green-500" />
            <span className="text-3xl font-bold text-green-700">{stats.availableLoanerCars}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-purple-50 border-purple-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-700">{t('dashboard.completedToday')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <CheckCircle className="h-8 w-8 text-purple-500" />
            <span className="text-3xl font-bold text-purple-700">{stats.completedToday}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
