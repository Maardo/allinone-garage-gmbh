
import { Calendar as CalendarIcon, CalendarCheck, CalendarDays } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { CalendarViewMode } from "@/lib/calendar/types";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ViewModeSelectorProps {
  viewMode: CalendarViewMode;
  onChangeViewMode: (mode: CalendarViewMode) => void;
  className?: string;
}

export function ViewModeSelector({ viewMode, onChangeViewMode, className }: ViewModeSelectorProps) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  const getViewButtonLabel = () => {
    switch (viewMode) {
      case 'day':
        return isMobile ? t('calendar.day').charAt(0) : t('calendar.day');
      case 'week':
        return isMobile ? t('calendar.week').charAt(0) : t('calendar.week');
      case 'month':
        return isMobile ? t('calendar.month').charAt(0) : t('calendar.month');
    }
  };

  const getViewIcon = () => {
    switch (viewMode) {
      case 'day':
        return <CalendarIcon className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />;
      case 'week':
        return <CalendarCheck className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />;
      case 'month':
        return <CalendarDays className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={cn(
            "h-8 text-xs sm:text-sm min-w-[40px] sm:min-w-[80px]", 
            className,
            viewMode === 'day' && "bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800",
            viewMode === 'week' && "bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800",
            viewMode === 'month' && "bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800"
          )}
        >
          {getViewIcon()}
          {getViewButtonLabel()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="bg-white">
        <DropdownMenuItem 
          onClick={() => onChangeViewMode('day')} 
          className={cn(
            "cursor-pointer text-sm",
            viewMode === 'day' && "bg-blue-50 text-blue-700"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>{t('calendar.day')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onChangeViewMode('week')} 
          className={cn(
            "cursor-pointer text-sm",
            viewMode === 'week' && "bg-green-50 text-green-700"
          )}
        >
          <CalendarCheck className="mr-2 h-4 w-4" />
          <span>{t('calendar.week')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onChangeViewMode('month')} 
          className={cn(
            "cursor-pointer text-sm",
            viewMode === 'month' && "bg-purple-50 text-purple-700"
          )}
        >
          <CalendarDays className="mr-2 h-4 w-4" />
          <span>{t('calendar.month')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
