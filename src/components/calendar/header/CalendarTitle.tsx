
import { format } from "date-fns";
import { sv, de, enUS } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/context/LanguageContext";
import { CalendarViewMode } from "@/lib/calendar/types";

interface CalendarTitleProps {
  currentDate: Date;
  viewMode: CalendarViewMode;
}

export function CalendarTitle({ currentDate, viewMode }: CalendarTitleProps) {
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  
  const getLocale = () => {
    switch (language) {
      case 'sv': return sv;
      case 'de': return de;
      default: return enUS;
    }
  };
  
  const getViewTitle = () => {
    const locale = getLocale();
    
    switch (viewMode) {
      case 'day':
        return format(currentDate, isMobile ? 'd MMM' : 'd MMMM yyyy', { locale });
      case 'week':
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1)); // Start from Monday
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // End on Sunday
        
        if (isMobile) {
          // Shorter format for mobile
          return `${format(startOfWeek, 'd', { locale })}–${format(endOfWeek, 'd MMM', { locale })}`;
        }
        else if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
          return `${format(startOfWeek, 'd', { locale })}–${format(endOfWeek, 'd MMM yyyy', { locale })}`;
        }
        else if (startOfWeek.getFullYear() === endOfWeek.getFullYear()) {
          return `${format(startOfWeek, 'd MMM', { locale })}–${format(endOfWeek, 'd MMM yyyy', { locale })}`;
        }
        else {
          return `${format(startOfWeek, 'd MMM yyyy', { locale })}–${format(endOfWeek, 'd MMM yyyy', { locale })}`;
        }
      case 'month':
      default:
        return format(currentDate, isMobile ? 'MMM yyyy' : 'MMMM yyyy', { locale });
    }
  };

  return (
    <h2 className={isMobile ? "text-sm font-semibold px-1 min-w-20 text-center" : "text-base sm:text-lg font-semibold px-1 min-w-28 sm:min-w-32 text-center"}>
      {getViewTitle()}
    </h2>
  );
}
