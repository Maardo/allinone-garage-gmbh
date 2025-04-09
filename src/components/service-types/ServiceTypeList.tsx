
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceType, ServiceTypeInfo } from "@/lib/serviceTypes";
import { useLanguage } from "@/context/LanguageContext";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ServiceTypeListProps {
  serviceTypes: Record<ServiceType, ServiceTypeInfo>;
  onSelectType: (type: ServiceType) => void;
}

export function ServiceTypeList({ 
  serviceTypes, 
  onSelectType 
}: ServiceTypeListProps) {
  const { t } = useLanguage();

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-muted/30">
        <CardTitle>{t('serviceTypes.description')}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.values(serviceTypes).map((type) => (
            <div
              key={type.id}
              className="flex items-center p-4 bg-card border rounded-lg cursor-pointer hover:border-primary hover:shadow-md transition-all group relative"
              style={{ borderColor: type.color, borderWidth: '2px' }}
              onClick={() => onSelectType(type.id)}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className="h-10 w-10 flex-shrink-0 rounded-md mr-4 cursor-help shadow-sm" 
                      style={{ backgroundColor: type.color }}
                    ></div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{type.color}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="overflow-hidden flex-1">
                <h3 className="font-medium text-base">{type.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-medium text-xs bg-muted px-2 py-0.5 rounded">
                    {type.code || type.id}
                  </span>
                  <p className="text-sm text-muted-foreground truncate">
                    {type.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
