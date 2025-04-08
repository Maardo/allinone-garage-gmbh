
export type ServiceType = 1 | 2 | 3 | 4 | 5;

export interface ServiceTypeInfo {
  id: ServiceType;
  name: string;
  description: string;
  color: string;
  code?: string; // Added code field
}

export const SERVICE_TYPES: Record<ServiceType, ServiceTypeInfo> = {
  1: {
    id: 1,
    name: 'Service',
    description: 'Regular maintenance service',
    color: '#0284c7', // bright blue, accessible
    code: 'S01'
  },
  2: {
    id: 2,
    name: 'Repair',
    description: 'Mechanical repair',
    color: '#dc2626', // bright red, accessible
    code: 'R01'
  },
  3: {
    id: 3,
    name: 'Inspection',
    description: 'Vehicle inspection',
    color: '#16a34a', // bright green, accessible
    code: 'I01'
  },
  4: {
    id: 4,
    name: 'Diagnostic',
    description: 'Computer diagnostic',
    color: '#9333ea', // bright purple, accessible
    code: 'D01'
  },
  5: {
    id: 5,
    name: 'Bodywork',
    description: 'Body repair',
    color: '#d97706', // bright amber, accessible
    code: 'B01'
  }
};

// Available color options
export const COLOR_OPTIONS = [
  { value: '#0284c7', name: 'Blue' },
  { value: '#dc2626', name: 'Red' },
  { value: '#16a34a', name: 'Green' },
  { value: '#9333ea', name: 'Purple' },
  { value: '#d97706', name: 'Amber' },
  { value: '#0ea5e9', name: 'Sky Blue' },
  { value: '#ea580c', name: 'Orange' },
  { value: '#4338ca', name: 'Indigo' },
  { value: '#be123c', name: 'Rose' },
  { value: '#0f766e', name: 'Teal' },
  { value: '#4d7c0f', name: 'Lime' },
  { value: '#7e22ce', name: 'Violet' }
];

// Available service code prefixes
export const CODE_PREFIXES = ['S', 'R', 'I', 'D', 'B', 'M', 'T', 'C', 'E'];
