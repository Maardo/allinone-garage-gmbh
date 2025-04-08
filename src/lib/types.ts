
// This file re-exports all types from the more specific type files
export type UserRole = 'admin' | 'mechanic';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

export type Language = 'en' | 'sv' | 'de';

// Re-export types from specific files
export * from './serviceTypes';
export * from './customerTypes';
export * from './loanerCarTypes';
