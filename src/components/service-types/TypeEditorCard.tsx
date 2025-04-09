
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
  onDeleteType: (typeId: ServiceType) => void;
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
  onDeleteType,
}: TypeEditorCardProps) {
  const { t } = useLanguage();

  const handleUpdate = (updatedType: ServiceTypeInfo) => {
    if (selectedType) {
      onUpdateType(selectedType, updatedType);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-muted/30">
        <CardTitle>
          {selectedType 
            ? t('serviceTypes.edit')
            : newType 
              ? t('serviceTypes.new')
              : t('serviceTypes.select')
          }
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {selectedType ? (
          <TypeEditor 
            typeId={selectedType} 
            serviceTypes={serviceTypes}
            onUpdate={handleUpdate}
            onCancel={() => onSelectType(null)}
            onDelete={onDeleteType}
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
