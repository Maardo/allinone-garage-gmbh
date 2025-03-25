
import { useLanguage } from "@/context/LanguageContext";
import { Language, LANGUAGES } from "@/lib/types";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <div className="px-3 py-4 border-b border-sidebar-border">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full justify-between text-gray-200 hover:bg-blue-700"
          >
            <div className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              <span>{LANGUAGES[language]}</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52">
          {Object.entries(LANGUAGES).map(([code, name]) => (
            <DropdownMenuItem 
              key={code}
              onClick={() => handleLanguageChange(code as Language)}
              className={cn(
                "cursor-pointer",
                language === code && "bg-accent"
              )}
            >
              {name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
