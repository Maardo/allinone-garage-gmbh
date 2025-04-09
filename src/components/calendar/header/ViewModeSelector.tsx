
import { Calendar as CalendarIcon, CalendarCheck, CalendarDays } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { CalendarViewMode } from "@/lib/calendar/types";

interface ViewModeSelectorProps {
  viewMode: CalendarViewMode;
  onChangeViewMode: (mode: CalendarViewMode) => void;
  className?: string;
}

export function ViewModeSelector({ viewMode, onChangeViewMode, className }: ViewModeSelectorProps) {
  const { t } = useLanguage();

  const getViewButtonLabel = () => {
    switch (viewMode) {
      case 'day':
        return t('calendar.day');
      case 'week':
        return t('calendar.week');
      case 'month':
        return t('calendar.month');
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
        <Button variant="outline" size="sm" className={`h-8 text-xs sm:text-sm ${className} min-w-[80px]`}>
          {getViewIcon()}
          {getViewButtonLabel()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="bg-white">
        <DropdownMenuItem onClick={() => onChangeViewMode('day')} className="cursor-pointer text-sm">
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>{t('calendar.day')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChangeViewMode('week')} className="cursor-pointer text-sm">
          <CalendarCheck className="mr-2 h-4 w-4" />
          <span>{t('calendar.week')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChangeViewMode('month')} className="cursor-pointer text-sm">
          <CalendarDays className="mr-2 h-4 w-4" />
          <span>{t('calendar.month')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
