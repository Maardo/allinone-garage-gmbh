
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { 
  Calendar, 
  Users, 
  Car, 
  ClipboardList, 
  Settings 
} from 'lucide-react';

export function SidebarNavigation() {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  const menuItems = [
    {
      name: t('navigation.calendar'),
      icon: <Calendar className="h-5 w-5" />,
      path: "/calendar",
    },
    {
      name: t('navigation.customers'),
      icon: <Users className="h-5 w-5" />,
      path: "/customers",
    },
    {
      name: t('navigation.loanerCars'),
      icon: <Car className="h-5 w-5" />,
      path: "/loaner-cars",
    },
    {
      name: t('navigation.serviceTypes'),
      icon: <ClipboardList className="h-5 w-5" />,
      path: "/service-types",
    },
    ...(currentUser?.role === 'admin' ? [
      {
        name: t('navigation.settings'),
        icon: <Settings className="h-5 w-5" />,
        path: "/settings",
      }
    ] : []),
  ];

  return (
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
  );
}
