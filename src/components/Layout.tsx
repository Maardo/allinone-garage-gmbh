
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function Layout({ children, title, subtitle }: LayoutProps) {
  const { currentUser, isLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate("/login");
    }
  }, [currentUser, isLoading, navigate]);

  const toggleSidebar = () => {
    setIsMobileOpen(prev => !prev);
    console.log("Toggling sidebar:", !isMobileOpen); // Debug
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isMobileOpen && window.innerWidth < 768) {
        const target = e.target as HTMLElement;
        // Don't close if clicking sidebar or navbar toggle button
        if (!target.closest('[data-sidebar="sidebar"]') && 
            !target.closest('[data-toggle="sidebar"]')) {
          setIsMobileOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isMobileOpen]);

  // Close sidebar when window is resized to desktop size
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
            {(title || subtitle) && (
              <div className="mb-4 sm:mb-8">
                {title && (
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{title}</h1>
                )}
                {subtitle && (
                  <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">{subtitle}</p>
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
