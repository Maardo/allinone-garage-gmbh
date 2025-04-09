
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

export function UserProfile() {
  const { logout, currentUser } = useAuth();
  const { t } = useLanguage();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success(t('common.logoutSuccess'));
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error(t('common.logoutError'));
    }
  };

  return (
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
          onClick={handleLogout}
          className="text-white hover:bg-blue-700"
          title={t('common.logout')}
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
