
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { SERVICE_TYPES } from "@/lib/serviceTypes";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

interface ChartDataItem {
  name: string;
  value: number;
  fill: string;
}

interface JobsChartProps {
  chartData: ChartDataItem[];
}

export function JobsChart({ chartData }: JobsChartProps) {
  const { t } = useLanguage();
  
  return (
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
  );
}
