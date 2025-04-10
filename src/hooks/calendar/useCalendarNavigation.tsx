
import { useState, useCallback } from "react";
import { CalendarViewMode } from "@/lib/calendar/types";
import { 
  navigateToPreviousPeriod, 
  navigateToNextPeriod,
  getStartOfCurrentPeriod
} from "@/lib/calendar/calendarService";

export function useCalendarNavigation() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>('week');

  const handleNavigatePrev = useCallback(() => {
    setCurrentDate(navigateToPreviousPeriod(currentDate, viewMode));
  }, [currentDate, viewMode]);

  const handleNavigateNext = useCallback(() => {
    setCurrentDate(navigateToNextPeriod(currentDate, viewMode));
  }, [currentDate, viewMode]);

  const goToToday = useCallback(() => {
    const today = new Date();
    setCurrentDate(getStartOfCurrentPeriod(today, viewMode));
  }, [viewMode]);

  const handleChangeViewMode = useCallback((mode: CalendarViewMode) => {
    setViewMode(mode);
    setCurrentDate(getStartOfCurrentPeriod(currentDate, mode));
  }, [currentDate]);

  return {
    currentDate,
    viewMode,
    handleNavigatePrev,
    handleNavigateNext,
    goToToday,
    handleChangeViewMode
  };
}
