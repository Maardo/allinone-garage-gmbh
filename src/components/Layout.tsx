
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function Layout({ children, title, subtitle }: LayoutProps) {
  const { currentUser, isLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const getPageKey = () => {
    const path = location.pathname.substring(1);
    return path || 'overview';
  };

  const getPageInfo = () => {
    const pageKey = getPageKey();
    
    if (title || subtitle) {
      return { 
        title: title, 
        subtitle: subtitle 
      };
    }

    const normalizedPageKey = pageKey.replace(/-/g, '');
    
    try {
      return {
        title: t(`pages.${pageKey}.title`) || t(`pages.${normalizedPageKey}.title`),
        subtitle: t(`pages.${pageKey}.subtitle`) || t(`pages.${normalizedPageKey}.subtitle`)
      };
    } catch (e) {
      console.error(`Translation missing for page: ${pageKey}`, e);
      return {
        title: pageKey,
        subtitle: ''
      };
    }
  };

  const pageInfo = getPageInfo();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate("/login");
    }
  }, [currentUser, isLoading, navigate]);

  const toggleSidebar = () => {
    console.log("Toggle sidebar called in Layout. Current state:", isMobileOpen);
    setIsMobileOpen(prevState => !prevState);
  };

  // Close sidebar on route change on mobile
  useEffect(() => {
    console.log("Route changed to:", location.pathname);
    if (isMobileOpen && window.innerWidth < 768) {
      setIsMobileOpen(false);
    }
  }, [location.pathname, isMobileOpen]);

  // Handle outside clicks on mobile
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      const isSidebar = !!target.closest('[data-sidebar="sidebar"]');
      const isToggle = !!target.closest('[data-toggle="sidebar"]');
      const isBackdrop = !!target.closest('[data-backdrop="sidebar"]');
      
      if (isMobileOpen && window.innerWidth < 768 && !isSidebar && !isToggle && !isBackdrop) {
        console.log("Outside click detected, closing sidebar");
        setIsMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isMobileOpen]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileOpen]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2">{t('common.loading')}</span>
      </div>
    );
  }

  if (!currentUser) {
    return null; // Will redirect to login
  }

  return (
    <div className="flex min-h-screen overflow-hidden">
      <Sidebar isMobileOpen={isMobileOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 pl-0 md:pl-64 transition-all bg-background text-foreground flex flex-col">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 bg-background text-foreground overflow-auto">
          <div className="p-3 sm:p-6 max-w-7xl mx-auto">
            {(pageInfo.title || pageInfo.subtitle) && (
              <div className="mb-4 sm:mb-8">
                {pageInfo.title && (
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{pageInfo.title}</h1>
                )}
                {pageInfo.subtitle && (
                  <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">{pageInfo.subtitle}</p>
                )}
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
