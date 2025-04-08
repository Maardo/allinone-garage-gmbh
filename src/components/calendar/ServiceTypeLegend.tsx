
import { SERVICE_TYPES } from "@/lib/serviceTypes";
import { useLanguage } from "@/context/LanguageContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ServiceTypeLegend() {
  const { t } = useLanguage();
  
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
  
  return (
    <div className="mt-6 p-4 bg-card rounded-lg shadow-sm">
      <h3 className="font-medium mb-2 text-sm">{t('appointment.serviceType')}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {Object.values(SERVICE_TYPES).map((type) => (
          <div 
            key={type.id} 
            className="flex items-center p-1.5 rounded-md text-xs"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className="h-3 w-3 rounded-full mr-1.5 cursor-help"
                    style={{ backgroundColor: type.color }}
                  ></div>
                </TooltipTrigger>
                <TooltipContent>
                  {/* Use the translation function for the color name */}
                  <p>{t(`serviceTypes.${type.color.substring(1)}`)}</p>
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
