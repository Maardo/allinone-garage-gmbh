
import { SERVICE_TYPES } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ServiceTypeLegend() {
  return (
    <div className="mt-8 p-4 bg-card rounded-lg shadow-sm">
      <h3 className="font-medium mb-2">Service Types</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {Object.values(SERVICE_TYPES).map((type) => (
          <div 
            key={type.id} 
            className={cn(
              "flex items-center p-2 rounded-md",
              `service-type-${type.id}`
            )}
          >
            <div className="h-3 w-3 rounded-full"></div>
            <span className="ml-2 text-sm">{type.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
