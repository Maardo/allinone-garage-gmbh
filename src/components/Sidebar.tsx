
import { SidebarHeader } from './sidebar/SidebarHeader';
import { LanguageSelector } from './sidebar/LanguageSelector';
import { SidebarNavigation } from './sidebar/SidebarNavigation';
import { UserProfile } from './sidebar/UserProfile';

interface SidebarProps {
  isMobileOpen: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isMobileOpen, toggleSidebar }: SidebarProps) {
  const handleCloseSidebar = () => {
    if (toggleSidebar) {
      console.log("Closing sidebar from Sidebar component");
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Mobile overlay background */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={handleCloseSidebar}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed h-full w-64 bg-sidebar flex flex-col border-r border-sidebar-border z-50 shadow-lg md:translate-x-0 transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarHeader isMobileOpen={isMobileOpen} onClose={handleCloseSidebar} />
        <LanguageSelector />
        <SidebarNavigation />
        <UserProfile />
      </aside>
    </>
  );
}
