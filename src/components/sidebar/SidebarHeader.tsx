
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SidebarHeaderProps {
  isMobileOpen: boolean;
  onClose: () => void;
}

export function SidebarHeader({ isMobileOpen, onClose }: SidebarHeaderProps) {
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="p-6 border-b border-sidebar-border flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold text-white">
          {t('common.appName')}
        </h1>
        <p className="text-sm text-gray-300 mt-1">
          {currentUser?.role === 'admin' ? t('roles.administrator') : t('roles.mechanic')}
        </p>
      </div>
      {isMobileOpen && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="text-white hover:bg-blue-700 md:hidden"
          data-toggle="sidebar"
        >
          <X className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
