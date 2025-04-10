
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Car, CreditCard, UserIcon, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

export function DashboardQuickActions() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
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
  );
}
