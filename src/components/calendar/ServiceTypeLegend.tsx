
import { SERVICE_TYPES } from "@/lib/serviceTypes";
import { useLanguage } from "@/context/LanguageContext";

export function ServiceTypeLegend() {
  const { t } = useLanguage();
  
  return (
    <div className="mt-6 p-4 bg-card rounded-lg shadow-sm">
      <h3 className="font-medium mb-2 text-sm">{t('appointment.serviceType')}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {Object.values(SERVICE_TYPES).map((type) => (
          <div 
            key={type.id} 
            className="flex items-center p-1.5 rounded-md text-xs"
          >
            <div 
              className="h-3 w-3 rounded-full mr-1.5"
              style={{ backgroundColor: type.color }}
            ></div>
            <span>{type.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
