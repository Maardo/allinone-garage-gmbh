
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Car, CheckCircle, Clock, Users, Wrench } from "lucide-react";
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
  const [timeRange, setTimeRange] = useState<"week" | "month">("week");
  
  // Mock data - in a real app, this would come from your backend
  const stats = {
    todayAppointments: 3,
    weekAppointments: 15,
    totalCustomers: 275,
    completedJobs: 843
  };
  
  // Mock upcoming appointments
  const upcomingAppointments = [
    {
      id: "1",
      date: "2023-07-12",
      time: "10:00",
      customer: "Johan Andersson",
      vehicle: "Volvo V70",
      serviceType: t('serviceTypes.maintenance')
    },
    {
      id: "2",
      date: "2023-07-13",
      time: "13:30",
      customer: "Maria Johansson",
      vehicle: "Audi A4",
      serviceType: t('serviceTypes.repair')
    },
    {
      id: "3",
      date: "2023-07-14",
      time: "15:45",
      customer: "Erik Svensson",
      vehicle: "BMW 3 Series",
      serviceType: t('serviceTypes.inspection')
    },
    {
      id: "4",
      date: "2023-07-17",
      time: "09:30",
      customer: "Anna Lindberg",
      vehicle: "Tesla Model 3",
      serviceType: t('serviceTypes.repair')
    },
    {
      id: "5",
      date: "2023-07-18",
      time: "11:00",
      customer: "Karl Nilsson",
      vehicle: "Volvo XC60",
      serviceType: t('serviceTypes.maintenance')
    }
  ];
  
  // Mock chart data
  const weekChartData = [
    { name: t('serviceTypes.maintenance'), value: 8 },
    { name: t('serviceTypes.repair'), value: 5 },
    { name: t('serviceTypes.inspection'), value: 3 },
    { name: t('serviceTypes.tireChange'), value: 4 },
    { name: t('serviceTypes.other'), value: 2 }
  ];
  
  const monthChartData = [
    { name: t('serviceTypes.maintenance'), value: 28 },
    { name: t('serviceTypes.repair'), value: 15 },
    { name: t('serviceTypes.inspection'), value: 12 },
    { name: t('serviceTypes.tireChange'), value: 18 },
    { name: t('serviceTypes.other'), value: 7 }
  ];
  
  // In a real app, you would fetch data here
  useEffect(() => {
    // Fetch data based on timeRange
    console.log(`Fetching data for ${timeRange}`);
    // fetchData(timeRange);
  }, [timeRange]);
  
  return (
    <Layout title={t('pages.overview.title')} subtitle={t('pages.overview.subtitle')}>
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('overview.upcomingJobs')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="week" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger 
                  value="week"
                  onClick={() => setTimeRange("week")}
                >
                  {t('overview.week')}
                </TabsTrigger>
                <TabsTrigger 
                  value="month"
                  onClick={() => setTimeRange("month")}
                >
                  {t('overview.month')}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="week" className="space-y-4">
                {upcomingAppointments.slice(0, 3).map((appointment) => (
                  <div 
                    key={appointment.id} 
                    className="flex items-center p-3 bg-secondary/50 rounded-lg"
                  >
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-medium text-foreground">{appointment.date} {appointment.time}</p>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <p className="truncate">{appointment.customer} - {appointment.vehicle}</p>
                        <p>{appointment.serviceType}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="month" className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div 
                    key={appointment.id} 
                    className="flex items-center p-3 bg-secondary/50 rounded-lg"
                  >
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-medium text-foreground">{appointment.date} {appointment.time}</p>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <p className="truncate">{appointment.customer} - {appointment.vehicle}</p>
                        <p>{appointment.serviceType}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('overview.serviceTypeDistribution')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="week" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger 
                  value="week"
                  onClick={() => setTimeRange("week")}
                >
                  {t('overview.week')}
                </TabsTrigger>
                <TabsTrigger 
                  value="month"
                  onClick={() => setTimeRange("month")}
                >
                  {t('overview.month')}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="week">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weekChartData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#6366f1" name={t('overview.appointments')} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              <TabsContent value="month">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthChartData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#6366f1" name={t('overview.appointments')} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
