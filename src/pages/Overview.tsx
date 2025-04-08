import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, CheckCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { format, addDays, addMonths, isAfter, isBefore } from "date-fns";
import { sv, de, enUS } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { SERVICE_TYPES } from "@/lib/serviceTypes";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

const dateLocales = {
  sv: sv,
  de: de,
  en: enUS,
};

export default function Overview() {
  const { t, language } = useLanguage();
  const [timeView, setTimeView] = useState<"week" | "month">("week");
  
  const stats = {
    todayAppointments: 3,
    weekAppointments: 15,
    totalCustomers: 275,
    completedJobs: 843
  };
  
  const chartData = [
    { name: t('serviceTypes.maintenance'), value: 25, fill: SERVICE_TYPES[1].color },
    { name: t('serviceTypes.repair'), value: 20, fill: SERVICE_TYPES[2].color },
    { name: t('serviceTypes.inspection'), value: 10, fill: SERVICE_TYPES[3].color },
    { name: t('serviceTypes.tireChange'), value: 15, fill: SERVICE_TYPES[4].color },
    { name: t('serviceTypes.other'), value: 5, fill: SERVICE_TYPES[5].color }
  ];
  
  const upcomingJobs = [
    { 
      id: 1,
      date: new Date(2025, 3, 8, 9, 0), // April 8, 2025, 09:00
      vehicleModel: "Volvo XC60",
      serviceType: 1 
    },
    { 
      id: 2,
      date: new Date(2025, 3, 9, 13, 30), // April 9, 2025, 13:30
      vehicleModel: "BMW X5",
      serviceType: 2 
    },
    { 
      id: 3,
      date: new Date(2025, 3, 10, 10, 0), // April 10, 2025, 10:00
      vehicleModel: "Audi A4",
      serviceType: 1 
    },
    { 
      id: 4,
      date: new Date(2025, 3, 13, 14, 0), // April 13, 2025, 14:00
      vehicleModel: "Volvo V70",
      serviceType: 2 
    },
    { 
      id: 5,
      date: new Date(2025, 3, 15, 11, 30), // April 15, 2025, 11:30
      vehicleModel: "Tesla Model 3",
      serviceType: 1 
    },
    { 
      id: 6,
      date: new Date(2025, 3, 22, 10, 0), // April 22, 2025, 10:00
      vehicleModel: "Mercedes E-Class",
      serviceType: 3 
    },
    { 
      id: 7,
      date: new Date(2025, 3, 28, 15, 30), // April 28, 2025, 15:30
      vehicleModel: "Ford Focus",
      serviceType: 4
    },
    { 
      id: 8,
      date: new Date(2025, 4, 5, 9, 0), // May 5, 2025, 09:00
      vehicleModel: "Toyota RAV4",
      serviceType: 5
    }
  ];
  
  const [filteredJobs, setFilteredJobs] = useState<typeof upcomingJobs>([]);
  
  useEffect(() => {
    const now = new Date();
    let endDate;
    
    if (timeView === "week") {
      endDate = addDays(now, 7); // One week from now
    } else {
      endDate = addMonths(now, 1); // One month from now
    }
    
    const filtered = upcomingJobs.filter(job => 
      isAfter(job.date, now) && isBefore(job.date, endDate)
    );
    
    setFilteredJobs(filtered);
  }, [timeView]);
  
  const jobsByDate = filteredJobs.reduce((acc, job) => {
    const dateStr = format(job.date, 'yyyy-MM-dd');
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(job);
    return acc;
  }, {} as Record<string, typeof upcomingJobs>);
  
  const locale = dateLocales[language as keyof typeof dateLocales] || enUS;

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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col items-center text-center">
              <span className="text-4xl font-bold mb-2">{filteredJobs.length}</span>
              <CardTitle>{t('overview.upcomingJobs')}</CardTitle>
            </div>
            <div className="flex justify-center mt-4 space-x-2">
              <Button 
                variant={timeView === "week" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setTimeView("week")}
              >
                {t('overview.week')}
              </Button>
              <Button 
                variant={timeView === "month" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setTimeView("month")}
              >
                {t('overview.month')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-0">
            {Object.keys(jobsByDate).length > 0 ? (
              <div className="space-y-6">
                {Object.entries(jobsByDate).map(([dateStr, jobs]) => {
                  const date = new Date(dateStr);
                  return (
                    <div key={dateStr} className="border-b last:border-b-0">
                      <div className="px-6 py-2 text-sm font-medium border-b border-muted">
                        {format(date, 'EEEE d MMMM', { locale })}
                      </div>
                      <Table>
                        <TableBody>
                          {jobs.map(job => {
                            const serviceTypeName = SERVICE_TYPES[job.serviceType].name.toLowerCase();
                            
                            return (
                              <TableRow key={job.id}>
                                <TableCell className="w-20">
                                  {format(job.date, 'HH:mm')}
                                </TableCell>
                                <TableCell className="font-medium">
                                  {job.vehicleModel}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div 
                                    className="inline-flex px-2 py-1 rounded-md text-xs font-medium"
                                    style={{ 
                                      backgroundColor: `${SERVICE_TYPES[job.serviceType].color}20`,
                                      color: SERVICE_TYPES[job.serviceType].color
                                    }}
                                  >
                                    {t(`serviceTypes.${serviceTypeName}`)}
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                {t('overview.noAppointments') + (timeView === "week" ? " " + t('overview.week').toLowerCase() : " " + t('overview.month').toLowerCase())}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('overview.upcomingJobs')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer 
                config={{
                  maintenance: { color: SERVICE_TYPES[1].color },
                  repair: { color: SERVICE_TYPES[2].color },
                  inspection: { color: SERVICE_TYPES[3].color },
                  tireChange: { color: SERVICE_TYPES[4].color },
                  other: { color: SERVICE_TYPES[5].color }
                }}
              >
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                  />
                  <Bar 
                    dataKey="value" 
                    name={t('overview.appointments')}
                    isAnimationActive={true}
                  >
                    {chartData.map((entry, index) => (
                      <rect 
                        key={index} 
                        fill={entry.fill}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
              {chartData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded" 
                    style={{ backgroundColor: item.fill }}
                  ></div>
                  <span className="text-sm">
                    {item.name}: <span className="font-medium">{item.value}</span> {t('overview.count')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
