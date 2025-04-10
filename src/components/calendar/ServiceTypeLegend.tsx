
import { useServiceTypes } from "@/hooks/useServiceTypes";
import { useLanguage } from "@/context/LanguageContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { COLOR_OPTIONS } from "@/lib/serviceTypes";

export function ServiceTypeLegend() {
  const { t } = useLanguage();
  const { serviceTypes, isLoading } = useServiceTypes();
  
  // Helper function to get the translation key for a service type
  const getServiceTypeTranslationKey = (typeId: number): string => {
    switch (typeId) {
      case 1: return 'serviceTypes.maintenance';
      case 2: return 'serviceTypes.repair';
      case 3: return 'serviceTypes.inspection';
      case 4: return 'serviceTypes.tireChange';
      case 5: return 'serviceTypes.other';
      case 6: return 'serviceTypes.other';
      default: return 'serviceTypes.other';
    }
  };

  // Find color name from hex value
  const getColorName = (hexColor: string): string => {
    const colorOption = COLOR_OPTIONS.find(option => option.value === hexColor);
    return colorOption ? `serviceTypes.${colorOption.name}` : '';
  };
  
  if (isLoading) {
    return (
      <div className="mt-3 p-3 bg-card rounded-lg shadow-sm">
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }
  
  return (
    <div className="mt-3 p-3 bg-card rounded-lg shadow-sm">
      <h3 className="font-medium mb-1.5 text-xs">{t('appointment.serviceType')}</h3>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5">
        {Object.values(serviceTypes || {}).map((type) => (
          <div 
            key={type.id} 
            className="flex items-center p-1 rounded-md text-xs"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className="h-3 w-3 rounded-full mr-1 cursor-help"
                    style={{ backgroundColor: type.color }}
                  ></div>
                </TooltipTrigger>
                <TooltipContent>
                  {/* Use the translation function for the color name */}
                  <p>{t(getColorName(type.color))}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span>
              {t(getServiceTypeTranslationKey(type.id))} ({type.code || type.id})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
