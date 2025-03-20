
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function Layout({ children, title, subtitle }: LayoutProps) {
  const { currentUser, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate("/login");
    }
  }, [currentUser, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) {
    return null; // Will redirect to login
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 pl-0 md:pl-64 transition-all">
        <div className="p-6 max-w-7xl mx-auto animate-fade-in">
          {(title || subtitle) && (
            <div className="mb-8">
              {title && (
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              )}
              {subtitle && (
                <p className="mt-2 text-muted-foreground">{subtitle}</p>
              )}
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
