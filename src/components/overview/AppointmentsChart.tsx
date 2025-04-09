
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { SERVICE_TYPES } from "@/lib/serviceTypes";
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
  
  // Calculate the total number of appointments
  const totalAppointments = chartData.reduce((sum, item) => sum + item.value, 0);

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
  );
}
