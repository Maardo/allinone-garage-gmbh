
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceType, ServiceTypeInfo } from "@/lib/serviceTypes";
import { useLanguage } from "@/context/LanguageContext";
import { TypeEditor } from "./TypeEditor";
import { NewTypeEditor } from "./NewTypeEditor";
import { CreateNewTypePrompt } from "./CreateNewTypePrompt";

interface TypeEditorCardProps {
  selectedType: ServiceType | null;
  newType: boolean;
  serviceTypes: Record<ServiceType, ServiceTypeInfo>;
  nextId: ServiceType;
  onUpdateType: (typeId: ServiceType, updatedType: ServiceTypeInfo) => void;
  onCreateType: (newType: ServiceTypeInfo) => void;
  onSelectType: (type: ServiceType | null) => void;
  onNewType: (newType: boolean) => void;
}

export function TypeEditorCard({
  selectedType,
  newType,
  serviceTypes,
  nextId,
  onUpdateType,
  onCreateType,
  onSelectType,
  onNewType,
}: TypeEditorCardProps) {
  const { t } = useLanguage();

  const handleUpdate = (updatedType: ServiceTypeInfo) => {
    if (selectedType) {
      onUpdateType(selectedType, updatedType);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {selectedType 
            ? t('serviceTypes.edit')
            : newType 
              ? t('serviceTypes.new')
              : t('serviceTypes.select')
          }
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedType ? (
          <TypeEditor 
            typeId={selectedType} 
            serviceTypes={serviceTypes}
            onUpdate={handleUpdate}
            onCancel={() => onSelectType(null)} 
          />
        ) : newType ? (
          <NewTypeEditor 
            nextId={nextId}
            onCreate={onCreateType}
            onCancel={() => onNewType(false)} 
          />
        ) : (
          <CreateNewTypePrompt onCreateNew={() => onNewType(true)} />
        )}
      </CardContent>
    </Card>
  );
}
