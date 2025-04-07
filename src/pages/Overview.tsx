
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, CheckCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function Overview() {
  const { t } = useLanguage();
  
  // Mock data - in a real app, this would come from your backend
  const stats = {
    todayAppointments: 3,
    weekAppointments: 15,
    totalCustomers: 275,
    completedJobs: 843
  };
  
  // Mock chart data - total upcoming appointments by service type
  const totalChartData = [
    { name: t('serviceTypes.maintenance'), value: 28 },
    { name: t('serviceTypes.repair'), value: 15 },
    { name: t('serviceTypes.inspection'), value: 12 },
    { name: t('serviceTypes.tireChange'), value: 18 },
    { name: t('serviceTypes.other'), value: 7 }
  ];
  
  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-blue-50 border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">{t('overview.todayAppointments')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <Calendar className="h-8 w-8 text-blue-500" />
              <span className="text-3xl font-bold text-blue-700">{stats.todayAppointments}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">{t('overview.weekAppointments')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <Calendar className="h-8 w-8 text-green-500" />
              <span className="text-3xl font-bold text-green-700">{stats.weekAppointments}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">{t('overview.totalCustomers')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <Users className="h-8 w-8 text-purple-500" />
              <span className="text-3xl font-bold text-purple-700">{stats.totalCustomers}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50 border-amber-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">{t('overview.completedJobs')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <CheckCircle className="h-8 w-8 text-amber-500" />
              <span className="text-3xl font-bold text-amber-700">{stats.completedJobs}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('overview.upcomingAppointments')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={totalChartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#6366f1" name={t('overview.appointments')} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
