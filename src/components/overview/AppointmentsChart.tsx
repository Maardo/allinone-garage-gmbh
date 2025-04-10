
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useServiceTypes } from "@/hooks/useServiceTypes";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

interface AppointmentsChartProps {
  chartData: Array<{
    name: string;
    value: number;
    fill: string;
  }>;
}

export function AppointmentsChart({ chartData }: AppointmentsChartProps) {
  const { t } = useLanguage();
  const { serviceTypes } = useServiceTypes();
  
  // Calculate the total number of appointments
  const totalAppointments = chartData.reduce((sum, item) => sum + item.value, 0);

  // Create config from service types
  const createChartConfig = () => {
    const config: Record<string, { color: string }> = {};
    
    if (serviceTypes) {
      Object.values(serviceTypes).forEach(type => {
        config[`type${type.id}`] = { color: type.color };
      });
    }
    
    return config;
  };

  return (
    <Card>
      <CardHeader className="text-center pb-0">
        <div className="flex flex-col items-center justify-center">
          <div className="text-4xl font-bold">{totalAppointments}</div>
          <CardTitle className="mt-1">{t('overview.appointments')}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer config={createChartConfig()}>
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
  );
}
