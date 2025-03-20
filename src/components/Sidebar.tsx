
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { 
  Calendar, 
  Users, 
  Car, 
  ClipboardList, 
  Settings, 
  Menu, 
  LogOut 
} from 'lucide-react';

export function Sidebar() {
  const { logout, currentUser } = useAuth();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Close sidebar on mobile when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const menuItems = [
    {
      name: "Calendar",
      icon: <Calendar className="h-5 w-5" />,
      path: "/calendar",
    },
    {
      name: "Customers",
      icon: <Users className="h-5 w-5" />,
      path: "/customers",
    },
    {
      name: "Loaner Cars",
      icon: <Car className="h-5 w-5" />,
      path: "/loaner-cars",
    },
    {
      name: "Service Types",
      icon: <ClipboardList className="h-5 w-5" />,
      path: "/service-types",
    },
    ...(currentUser?.role === 'admin' ? [
      {
        name: "Settings",
        icon: <Settings className="h-5 w-5" />,
        path: "/settings",
      }
    ] : []),
  ];

  const toggleSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-6 w-6" />
      </Button>
      
      {/* Sidebar backdrop for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 md:hidden animate-fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          "fixed h-screen w-64 bg-sidebar flex flex-col border-r border-sidebar-border z-50 shadow-lg transition-transform duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo area */}
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-white">
            Workshop Manager
          </h1>
          <p className="text-sm text-gray-300 mt-1">
            {currentUser?.role === 'admin' ? 'Administrator' : 'Mechanic'}
          </p>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-gray-200 hover:bg-blue-700 transition-colors duration-200",
                    location.pathname === item.path && "bg-blue-700 text-white font-medium"
                  )}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User area */}
        <div className="p-4 border-t border-sidebar-border mt-auto">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">
                {currentUser?.name}
              </p>
              <p className="text-xs text-gray-300">
                {currentUser?.email}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={logout}
              className="text-white hover:bg-blue-700"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
