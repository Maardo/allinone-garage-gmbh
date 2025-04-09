
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { SERVICE_TYPES, ServiceType, ServiceTypeInfo } from "@/lib/serviceTypes";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import { ServiceTypeList } from "@/components/service-types/ServiceTypeList";
import { TypeEditorCard } from "@/components/service-types/TypeEditorCard";
import { DeleteTypeDialog } from "@/components/service-types/DeleteTypeDialog";

export default function ServiceTypes() {
  const { t } = useLanguage();
  const [selectedType, setSelectedType] = useState<ServiceType | null>(null);
  const [serviceTypes, setServiceTypes] = useState<Record<ServiceType, ServiceTypeInfo>>(SERVICE_TYPES);
  const [newType, setNewType] = useState<boolean>(false);
  const [nextId, setNextId] = useState<ServiceType>(6 as ServiceType);
  const [typeToDelete, setTypeToDelete] = useState<ServiceType | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleSelectType = (type: ServiceType) => {
    setNewType(false);
    setSelectedType(type);
  };

  const handleCreateNew = () => {
    setSelectedType(null);
    setNewType(true);
  };
  
  const handleDeleteType = (typeId: ServiceType) => {
    setTypeToDelete(typeId);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (typeToDelete) {
      const { [typeToDelete]: _, ...remainingTypes } = serviceTypes;
      setServiceTypes(remainingTypes as Record<ServiceType, ServiceTypeInfo>);
      toast.success(t('serviceTypes.deleted'));
      setIsDeleteDialogOpen(false);
      setTypeToDelete(null);
      
      if (selectedType === typeToDelete) {
        setSelectedType(null);
        setNewType(false);
      }
    }
  };

  const handleUpdateType = (typeId: ServiceType, updatedType: ServiceTypeInfo) => {
    const updatedTypes = {
      ...serviceTypes,
      [typeId]: updatedType
    };
    setServiceTypes(updatedTypes);
    toast.success(t('serviceTypes.updated'));
    setSelectedType(null);
  };

  const handleCreateType = (newServiceType: ServiceTypeInfo) => {
    const updatedTypes = {
      ...serviceTypes,
      [nextId]: newServiceType
    };
    
    setServiceTypes(updatedTypes);
    setNextId((prevId => (prevId + 1) as ServiceType));
    toast.success(t('serviceTypes.created'));
    setNewType(false);
  };

  return (
    <Layout 
      title={t('serviceTypes.title')} 
      subtitle={t('serviceTypes.subtitle')}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-6 md:col-span-2 lg:col-span-2">
          <ServiceTypeList 
            serviceTypes={serviceTypes}
            onSelectType={handleSelectType}
            onDeleteType={handleDeleteType}
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
          />
        </div>
      </div>
      
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
