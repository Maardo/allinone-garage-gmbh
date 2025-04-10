
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { ServiceType, ServiceTypeInfo } from "@/lib/serviceTypes";
import { useLanguage } from "@/context/LanguageContext";
import { ServiceTypeList } from "@/components/service-types/ServiceTypeList";
import { TypeEditorCard } from "@/components/service-types/TypeEditorCard";
import { DeleteTypeDialog } from "@/components/service-types/DeleteTypeDialog";
import { useServiceTypes } from "@/hooks/useServiceTypes";
import { Skeleton } from "@/components/ui/skeleton";

export default function ServiceTypes() {
  const { t } = useLanguage();
  const [selectedType, setSelectedType] = useState<ServiceType | null>(null);
  const [newType, setNewType] = useState<boolean>(false);
  const [typeToDelete, setTypeToDelete] = useState<ServiceType | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const {
    serviceTypes,
    isLoading,
    nextId,
    handleUpdateType,
    handleCreateType,
    handleDeleteType
  } = useServiceTypes();

  const handleSelectType = (type: ServiceType) => {
    setNewType(false);
    setSelectedType(type);
  };

  const handleCreateNew = () => {
    setSelectedType(null);
    setNewType(true);
  };
  
  const handleDeleteTypeRequest = (typeId: ServiceType) => {
    setTypeToDelete(typeId);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (typeToDelete) {
      handleDeleteType(typeToDelete);
      setIsDeleteDialogOpen(false);
      setTypeToDelete(null);
      
      if (selectedType === typeToDelete) {
        setSelectedType(null);
        setNewType(false);
      }
    }
  };

  return (
    <Layout 
      title={t('serviceTypes.title')} 
      subtitle={t('serviceTypes.subtitle')}
    >
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-6 md:col-span-2 lg:col-span-2">
            <Skeleton className="h-[400px] w-full" />
          </div>
          <div>
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-6 md:col-span-2 lg:col-span-2">
            <ServiceTypeList 
              serviceTypes={serviceTypes}
              onSelectType={handleSelectType}
            />
          </div>

          <div>
            <TypeEditorCard
              selectedType={selectedType}
              newType={newType}
              serviceTypes={serviceTypes}
              nextId={nextId}
              onUpdateType={handleUpdateType}
              onCreateType={handleCreateType}
              onSelectType={setSelectedType}
              onNewType={setNewType}
              onDeleteType={handleDeleteTypeRequest}
            />
          </div>
        </div>
      )}
      
      <DeleteTypeDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        typeToDelete={typeToDelete}
        serviceTypes={serviceTypes}
        onConfirmDelete={confirmDelete}
      />
    </Layout>
  );
}
