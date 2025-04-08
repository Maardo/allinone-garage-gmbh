
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  colorClass: string;
}

export function StatsCard({ title, value, icon: Icon, colorClass }: StatsCardProps) {
  return (
    <Card className={`${colorClass}-50 border-${colorClass}-100`}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-sm font-medium text-${colorClass}-700`}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <Icon className={`h-8 w-8 text-${colorClass}-500`} />
          <span className={`text-3xl font-bold text-${colorClass}-700`}>{value}</span>
        </div>
      </CardContent>
    </Card>
  );
}
