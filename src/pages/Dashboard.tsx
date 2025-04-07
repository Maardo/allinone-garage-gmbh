
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Car, CheckCircle, Clock, CreditCard, UserIcon, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{t('dashboard.todaySchedule')}</CardTitle>
                <CardDescription>{t('dashboard.upcomingAppointmentsToday')}</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/calendar")}>
                <Calendar className="h-4 w-4 mr-2" />
                {t('dashboard.fullCalendar')}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>{t('dashboard.noAppointments')}</p>
              </div>
            ) : (
              <div className="space-y-4">
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
                        <p className="font-medium text-foreground">{appointment.customer}</p>
                        <p className="text-sm font-semibold">{appointment.time}</p>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <p className="truncate">{appointment.vehicle}</p>
                        <p>{appointment.serviceType}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.quickActions')}</CardTitle>
            <CardDescription>{t('dashboard.commonTasks')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-auto flex-col py-6"
                onClick={() => navigate("/calendar")}
              >
                <Calendar className="h-8 w-8 mb-2" />
                <span>{t('dashboard.schedule')}</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto flex-col py-6"
                onClick={() => navigate("/customers")}
              >
                <UserIcon className="h-8 w-8 mb-2" />
                <span>{t('navigation.customers')}</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto flex-col py-6"
                onClick={() => navigate("/loaner-cars")}
              >
                <Car className="h-8 w-8 mb-2" />
                <span>{t('navigation.loanerCars')}</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto flex-col py-6"
                onClick={() => navigate("/service-types")}
              >
                <Wrench className="h-8 w-8 mb-2" />
                <span>{t('navigation.serviceTypes')}</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto flex-col py-6 col-span-2 md:col-span-2"
              >
                <CreditCard className="h-8 w-8 mb-2" />
                <span>{t('dashboard.paymentRecords')}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
