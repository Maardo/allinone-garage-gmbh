
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { LanguageSelector } from './sidebar/LanguageSelector';
import { SidebarNavigation } from './sidebar/SidebarNavigation';
import { UserProfile } from './sidebar/UserProfile';

interface SidebarProps {
  isMobileOpen?: boolean;
  toggleSidebar?: () => void;
}

export function Sidebar({ isMobileOpen = false, toggleSidebar }: SidebarProps) {
  const location = useLocation();
  
  // Stäng sidebar på mobil när route ändras
  useEffect(() => {
    if (isMobileOpen && toggleSidebar && window.innerWidth < 768) {
      toggleSidebar();
    }
  }, [location.pathname, isMobileOpen, toggleSidebar]);

  const handleCloseSidebar = () => {
    if (toggleSidebar) {
      toggleSidebar();
      console.log("Closing sidebar");
    }
  };

  return (
    <>
      {/* Sidebar bakgrund för mobil */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={handleCloseSidebar}
          data-backdrop="sidebar"
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <div
        data-sidebar="sidebar"
        className={`fixed h-full w-64 bg-sidebar flex flex-col border-r border-sidebar-border z-50 shadow-lg transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <SidebarHeader isMobileOpen={isMobileOpen} onClose={handleCloseSidebar} />
        <LanguageSelector />
        <SidebarNavigation />
        <UserProfile />
      </div>
    </>
  );
}
