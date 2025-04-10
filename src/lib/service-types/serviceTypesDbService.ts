
import { supabase } from "@/integrations/supabase/client";
import { ServiceType, ServiceTypeInfo } from "@/lib/serviceTypes";
import { COLOR_OPTIONS } from "@/lib/serviceTypes";

// Fetch service types from the database
export async function fetchServiceTypesFromDb(userId: string): Promise<Record<ServiceType, ServiceTypeInfo>> {
  try {
    const { data, error } = await supabase
      .from('service_types')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching service types:', error);
      return {};
    }

    // Convert the array of service types to the expected format
    const serviceTypes: Record<ServiceType, ServiceTypeInfo> = {};
    
    data.forEach(type => {
      const serviceType = type.id as ServiceType;
      serviceTypes[serviceType] = {
        id: serviceType,
        name: type.name,
        description: type.description || '',
        color: type.color,
        code: type.code || undefined
      };
    });

    return serviceTypes;
  } catch (error) {
    console.error('Error in fetchServiceTypesFromDb:', error);
    return {};
  }
}

// Add a service type to the database
export async function addServiceTypeToDb(
  serviceType: ServiceTypeInfo, 
  userId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('service_types')
      .insert({
        id: serviceType.id,
        name: serviceType.name,
        description: serviceType.description,
        color: serviceType.color,
        code: serviceType.code,
        user_id: userId
      });

    if (error) {
      console.error('Error adding service type:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in addServiceTypeToDb:', error);
    return false;
  }
}

// Update a service type in the database
export async function updateServiceTypeInDb(
  serviceType: ServiceTypeInfo, 
  userId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('service_types')
      .update({
        name: serviceType.name,
        description: serviceType.description,
        color: serviceType.color,
        code: serviceType.code,
        updated_at: new Date().toISOString()
      })
      .eq('id', serviceType.id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating service type:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateServiceTypeInDb:', error);
    return false;
  }
}

// Delete a service type from the database
export async function deleteServiceTypeFromDb(
  typeId: ServiceType, 
  userId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('service_types')
      .delete()
      .eq('id', typeId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting service type:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteServiceTypeFromDb:', error);
    return false;
  }
}

// Initialize service types in the database with default values
export async function initializeServiceTypesInDb(userId: string): Promise<boolean> {
  try {
    // First check if the user already has service types
    const { data, error: checkError } = await supabase
      .from('service_types')
      .select('id')
      .eq('user_id', userId);

    if (checkError) {
      console.error('Error checking existing service types:', checkError);
      return false;
    }

    // If user already has service types, skip initialization
    if (data && data.length > 0) {
      return true;
    }

    // Default service types
    const defaultServiceTypes = [
      {
        id: 1,
        name: 'Service',
        description: 'Regular maintenance service',
        color: '#0284c7',
        code: 'S01',
        user_id: userId
      },
      {
        id: 2,
        name: 'Repair',
        description: 'Mechanical repair',
        color: '#dc2626',
        code: 'R01',
        user_id: userId
      },
      {
        id: 3,
        name: 'Inspection',
        description: 'Vehicle inspection',
        color: '#16a34a',
        code: 'I01',
        user_id: userId
      },
      {
        id: 4,
        name: 'Diagnostic',
        description: 'Computer diagnostic',
        color: '#9333ea',
        code: 'D01',
        user_id: userId
      },
      {
        id: 5,
        name: 'Bodywork',
        description: 'Body repair',
        color: '#d97706',
        code: 'B01',
        user_id: userId
      },
      {
        id: 6,
        name: 'Other',
        description: 'Other services',
        color: '#0ea5e9',
        code: 'O01',
        user_id: userId
      }
    ];

    const { error } = await supabase
      .from('service_types')
      .insert(defaultServiceTypes);

    if (error) {
      console.error('Error initializing service types:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in initializeServiceTypesInDb:', error);
    return false;
  }
}
