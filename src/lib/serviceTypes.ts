
export type ServiceType = 1 | 2 | 3 | 4 | 5 | 6;

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
  },
  6: {
    id: 6,
    name: 'Other',
    description: 'Other services',
    color: '#0ea5e9', // sky blue, accessible
    code: 'O01'
  }
};

// Available color options - expanded to 28 colors, colorblind-friendly
export const COLOR_OPTIONS = [
  // Blues
  { value: '#0284c7', name: 'blue' },        // Blue
  { value: '#0ea5e9', name: 'skyBlue' },     // Sky Blue
  { value: '#4338ca', name: 'indigo' },      // Indigo
  { value: '#06b6d4', name: 'cyan' },        // Cyan
  { value: '#1e40af', name: 'darkBlue' },    // Dark Blue
  { value: '#0f766e', name: 'teal' },        // Teal
  { value: '#1e3a8a', name: 'navyBlue' },    // Navy Blue

  // Greens
  { value: '#16a34a', name: 'green' },       // Green
  { value: '#4d7c0f', name: 'lime' },        // Lime
  { value: '#10b981', name: 'emerald' },     // Emerald
  { value: '#15803d', name: 'forestGreen' }, // Forest Green
  { value: '#14532d', name: 'darkGreen' },   // Dark Green

  // Reds/Pinks
  { value: '#dc2626', name: 'red' },         // Red
  { value: '#be123c', name: 'rose' },        // Rose
  { value: '#db2777', name: 'pink' },        // Pink
  { value: '#d946ef', name: 'fuchsia' },     // Fuchsia
  { value: '#9f1239', name: 'crimson' },     // Crimson
  { value: '#831843', name: 'burgundy' },    // Burgundy

  // Oranges/Yellows
  { value: '#ea580c', name: 'orange' },      // Orange
  { value: '#d97706', name: 'amber' },       // Amber
  { value: '#eab308', name: 'yellow' },      // Yellow
  { value: '#f97316', name: 'coral' },       // Coral
  { value: '#92400e', name: 'brown' },       // Brown

  // Purples
  { value: '#9333ea', name: 'purple' },      // Purple
  { value: '#7e22ce', name: 'violet' },      // Violet
  
  // Neutrals - good for contrast with other colors
  { value: '#64748b', name: 'slate' },       // Slate
  { value: '#334155', name: 'darkSlate' },   // Dark Slate
  { value: '#000000', name: 'black' }        // Black
];

// Available service code prefixes
export const CODE_PREFIXES = ['S', 'R', 'I', 'D', 'B', 'M', 'T', 'C', 'E'];
