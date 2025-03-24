
import { useEffect } from 'react';
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
  LogOut,
  X
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen?: boolean;
  toggleSidebar?: () => void;
}

export function Sidebar({ isMobileOpen = false, toggleSidebar }: SidebarProps) {
  const { logout, currentUser } = useAuth();
  const location = useLocation();
  
  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobileOpen && toggleSidebar && window.innerWidth < 768) {
      toggleSidebar();
    }
  }, [location.pathname, isMobileOpen, toggleSidebar]);

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

  return (
    <>
      {/* Sidebar backdrop for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={toggleSidebar}
          data-backdrop="sidebar"
        />
      )}
      
      {/* Sidebar */}
      <div
        data-sidebar="sidebar"
        className={cn(
          "fixed h-full w-64 bg-sidebar flex flex-col border-r border-sidebar-border z-50 shadow-lg transition-all duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo area */}
        <div className="p-6 border-b border-sidebar-border flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-white">
              Allinone Garage
            </h1>
            <p className="text-sm text-gray-300 mt-1">
              {currentUser?.role === 'admin' ? 'Administrator' : 'Mechanic'}
            </p>
          </div>
          {isMobileOpen && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="text-white hover:bg-blue-700 md:hidden"
              data-toggle="sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 rounded-md text-gray-200 hover:bg-blue-700 transition-colors duration-200",
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
