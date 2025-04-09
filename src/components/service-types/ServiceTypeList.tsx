
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ServiceType, ServiceTypeInfo } from "@/lib/serviceTypes";
import { useLanguage } from "@/context/LanguageContext";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ServiceTypeListProps {
  serviceTypes: Record<ServiceType, ServiceTypeInfo>;
  onSelectType: (type: ServiceType) => void;
  onDeleteType: (typeId: ServiceType) => void;
}

export function ServiceTypeList({ 
  serviceTypes, 
  onSelectType, 
  onDeleteType 
}: ServiceTypeListProps) {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('serviceTypes.description')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.values(serviceTypes).map((type) => (
            <div
              key={type.id}
              className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors group relative"
              style={{ borderColor: type.color, borderWidth: '2px' }}
              onClick={() => onSelectType(type.id)}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className="h-8 w-8 flex-shrink-0 rounded mr-4 cursor-help" 
                      style={{ backgroundColor: type.color }}
                    ></div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{type.color}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="overflow-hidden flex-1">
                <h3 className="font-medium text-sm md:text-base">{type.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-xs bg-muted px-2 py-0.5 rounded">
                    {type.code || type.id}
                  </span>
                  <p className="text-xs md:text-sm text-muted-foreground truncate">
                    {type.description}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto" 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteType(type.id);
                }}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
