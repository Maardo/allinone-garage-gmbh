
import { SERVICE_TYPES } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ServiceTypeLegend() {
  return (
    <div className="mt-6 p-4 bg-card rounded-lg shadow-sm">
      <h3 className="font-medium mb-2 text-sm">Service Types</h3>
      <div className="grid grid-cols-2 gap-2">
        {Object.values(SERVICE_TYPES).map((type) => (
          <div 
            key={type.id} 
            className={cn(
              "flex items-center p-1.5 rounded-md text-xs",
              `service-type-${type.id}`
            )}
          >
            <div className="h-2.5 w-2.5 rounded-full"></div>
            <span className="ml-1.5">{type.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
