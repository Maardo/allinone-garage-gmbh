
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";

interface NavbarProps {
  toggleSidebar: () => void;
}

export function Navbar({ toggleSidebar }: NavbarProps) {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  
  const handleToggleSidebar = () => {
    console.log("Sidebar toggle clicked from Navbar");
    toggleSidebar();
  };
  
  return (
    <div className="h-16 border-b bg-white flex items-center justify-between px-4 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden flex items-center justify-center"
          onClick={handleToggleSidebar}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
        <div>
          <h1 className="font-bold text-lg sm:text-xl text-primary">{t('common.appName')}</h1>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {currentUser && (
          <span className="text-sm text-muted-foreground hidden md:block">
            {t('common.welcome')}, {currentUser.name}
          </span>
        )}
      </div>
    </div>
  );
}
