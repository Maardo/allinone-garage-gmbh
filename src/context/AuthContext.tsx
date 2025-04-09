
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/lib/types';
import { useNavigate } from 'react-router-dom';

// Demo users for this prototype
const DEMO_USERS = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@workshop.com',
    password: 'admin123',
    role: 'admin' as UserRole
  },
  {
    id: '2',
    name: 'Mechanic 1',
    email: 'mechanic1@workshop.com',
    password: 'mechanic123',
    role: 'mechanic' as UserRole
  },
  {
    id: '3',
    name: 'Mechanic 2',
    email: 'mechanic2@workshop.com',
    password: 'mechanic123',
    role: 'mechanic' as UserRole
  }
];

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<typeof DEMO_USERS>(() => {
    const savedUsers = localStorage.getItem('workshop-users');
    return savedUsers ? JSON.parse(savedUsers) : DEMO_USERS;
  });

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('workshop-user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user from storage');
      }
    }
    setIsLoading(false);
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('workshop-users', JSON.stringify(users));
  }, [users]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      // All users get same access - set all roles to admin
      const userWithAdminAccess = { ...userWithoutPassword, role: 'admin' as UserRole };
      setCurrentUser(userWithAdminAccess);
      localStorage.setItem('workshop-user', JSON.stringify(userWithAdminAccess));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user with this email already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      setIsLoading(false);
      return false;
    }
    
    // Create new user (always as admin for equal access)
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password,
      role: 'admin' as UserRole // Give full access to all new users
    };
    
    // Add to users list
    setUsers(prevUsers => [...prevUsers, newUser]);
    
    // Log in the new user
    const { password: _, ...userWithoutPassword } = newUser;
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('workshop-user', JSON.stringify(userWithoutPassword));
    
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('workshop-user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
