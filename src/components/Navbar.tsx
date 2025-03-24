
import { useAuth } from "@/context/AuthContext";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";

interface NavbarProps {
  toggleSidebar: () => void;
}

export function Navbar({ toggleSidebar }: NavbarProps) {
  const { currentUser } = useAuth();
  
  return (
    <div className="h-16 border-b bg-white flex items-center justify-between px-4 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
          data-toggle="sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-bold text-lg sm:text-xl text-primary">Allinone Garage</h1>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {currentUser && (
          <span className="text-sm text-muted-foreground hidden md:block">
            Welcome, {currentUser.name}
          </span>
        )}
      </div>
    </div>
  );
}
