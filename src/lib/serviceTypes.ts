
export type ServiceType = 1 | 2 | 3 | 4 | 5;

export interface ServiceTypeInfo {
  id: ServiceType;
  name: string;
  description: string;
  color: string;
}

export const SERVICE_TYPES: Record<ServiceType, ServiceTypeInfo> = {
  1: {
    id: 1,
    name: 'service',
    description: 'Regular maintenance service',
    color: '#0284c7' // bright blue, accessible
  },
  2: {
    id: 2,
    name: 'repair',
    description: 'Mechanical repair',
    color: '#dc2626' // bright red, accessible
  },
  3: {
    id: 3,
    name: 'inspection',
    description: 'Vehicle inspection',
    color: '#16a34a' // bright green, accessible
  },
  4: {
    id: 4,
    name: 'diagnostic',
    description: 'Computer diagnostic',
    color: '#9333ea' // bright purple, accessible
  },
  5: {
    id: 5,
    name: 'bodywork',
    description: 'Body repair',
    color: '#d97706' // bright amber, accessible
  }
};
