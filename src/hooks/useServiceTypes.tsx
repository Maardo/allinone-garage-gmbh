
import { useState, useEffect } from 'react';
import { ServiceType, ServiceTypeInfo } from '@/lib/serviceTypes';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { 
  fetchServiceTypesFromDb, 
  addServiceTypeToDb, 
  updateServiceTypeInDb,
  deleteServiceTypeFromDb,
  initializeServiceTypesInDb
} from '@/lib/service-types/serviceTypesDbService';
import { SERVICE_TYPES } from '@/lib/serviceTypes';

export function useServiceTypes() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [serviceTypes, setServiceTypes] = useState<Record<ServiceType, ServiceTypeInfo>>(SERVICE_TYPES);
  const [isLoading, setIsLoading] = useState(true);
  const [nextId, setNextId] = useState<ServiceType>(6 as ServiceType);

  // Initialize and fetch service types
  useEffect(() => {
    const loadServiceTypes = async () => {
      if (!currentUser) return;
      
      setIsLoading(true);
      try {
        // Initialize service types if needed
        await initializeServiceTypesInDb(currentUser.id);
        
        // Fetch service types
        const loadedTypes = await fetchServiceTypesFromDb(currentUser.id);
        
        if (Object.keys(loadedTypes).length > 0) {
          setServiceTypes(loadedTypes);
          
          // Determine next ID
          const maxId = Math.max(...Object.keys(loadedTypes).map(id => parseInt(id)));
          setNextId((maxId + 1) as ServiceType);
        }
      } catch (error) {
        console.error('Error loading service types:', error);
        toast({
          title: t('common.error'),
          description: t('serviceTypes.loadError'),
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadServiceTypes();
  }, [currentUser, toast, t]);

  const handleUpdateType = async (typeId: ServiceType, updatedType: ServiceTypeInfo) => {
    if (!currentUser) return;
    
    // Update optimistically in the UI
    const updatedTypes = {
      ...serviceTypes,
      [typeId]: updatedType
    };
    setServiceTypes(updatedTypes);
    
    // Update in the database
    const success = await updateServiceTypeInDb(updatedType, currentUser.id);
    
    if (success) {
      toast({
        title: t('serviceTypes.updated'),
      });
    } else {
      // Revert to previous state if update failed
      toast({
        title: t('common.error'),
        description: t('serviceTypes.updateError'),
        variant: "destructive"
      });
      
      // Refresh data from database
      const refreshedTypes = await fetchServiceTypesFromDb(currentUser.id);
      if (Object.keys(refreshedTypes).length > 0) {
        setServiceTypes(refreshedTypes);
      }
    }
  };

  const handleCreateType = async (newServiceType: ServiceTypeInfo) => {
    if (!currentUser) return;
    
    // Update optimistically in the UI
    const updatedTypes = {
      ...serviceTypes,
      [nextId]: newServiceType
    };
    
    setServiceTypes(updatedTypes);
    
    // Add to the database
    const success = await addServiceTypeToDb(newServiceType, currentUser.id);
    
    if (success) {
      setNextId((prevId => (prevId + 1) as ServiceType));
      toast({
        title: t('serviceTypes.created'),
      });
    } else {
      // Revert to previous state if add failed
      toast({
        title: t('common.error'),
        description: t('serviceTypes.createError'),
        variant: "destructive"
      });
      
      // Refresh data from database
      const refreshedTypes = await fetchServiceTypesFromDb(currentUser.id);
      if (Object.keys(refreshedTypes).length > 0) {
        setServiceTypes(refreshedTypes);
      }
    }
  };
  
  const handleDeleteType = async (typeId: ServiceType) => {
    if (!currentUser) return;
    
    // Delete optimistically in the UI
    const { [typeId]: _, ...remainingTypes } = serviceTypes;
    setServiceTypes(remainingTypes as Record<ServiceType, ServiceTypeInfo>);
    
    // Delete from the database
    const success = await deleteServiceTypeFromDb(typeId, currentUser.id);
    
    if (success) {
      toast({
        title: t('serviceTypes.deleted'),
      });
    } else {
      // Revert to previous state if delete failed
      toast({
        title: t('common.error'),
        description: t('serviceTypes.deleteError'),
        variant: "destructive"
      });
      
      // Refresh data from database
      const refreshedTypes = await fetchServiceTypesFromDb(currentUser.id);
      if (Object.keys(refreshedTypes).length > 0) {
        setServiceTypes(refreshedTypes);
      }
    }
  };

  return {
    serviceTypes,
    isLoading,
    nextId,
    handleUpdateType,
    handleCreateType,
    handleDeleteType
  };
}
