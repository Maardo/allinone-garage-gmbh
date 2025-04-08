
import { useLanguage } from "@/context/LanguageContext";
import { SERVICE_TYPES } from "@/lib/serviceTypes";

export function useChartData() {
  const { t } = useLanguage();
  
  const chartData = [
    { name: t('serviceTypes.maintenance'), value: 25, fill: SERVICE_TYPES[1].color },
    { name: t('serviceTypes.repair'), value: 20, fill: SERVICE_TYPES[2].color },
    { name: t('serviceTypes.inspection'), value: 10, fill: SERVICE_TYPES[3].color },
    { name: t('serviceTypes.tireChange'), value: 15, fill: SERVICE_TYPES[4].color },
    { name: t('serviceTypes.other'), value: 5, fill: SERVICE_TYPES[5].color }
  ];
  
  return { chartData };
}
