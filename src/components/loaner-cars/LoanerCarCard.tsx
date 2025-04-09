
import { Car, User, Calendar, AlertCircle, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { sv, de, enUS } from "date-fns/locale";
import { LoanerCar } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface LoanerCarCardProps {
  car: LoanerCar;
  onAssign: (car: LoanerCar) => void;
  onReturn: (carId: string) => void;
  onEdit: (car: LoanerCar) => void;
  onDelete: (car: LoanerCar) => void;
  isAdmin: boolean;
}

export function LoanerCarCard({ 
  car, 
  onAssign, 
  onReturn, 
  onEdit, 
  onDelete, 
  isAdmin 
}: LoanerCarCardProps) {
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  
  // Format dates according to the selected language
  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return format(new Date(date), "PPP", { locale: language === "sv" ? sv : language === "de" ? de : enUS });
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-md border-2",
        car.isAvailable ? "border-green-500" : "border-amber-600"
      )}
    >
      <CardHeader className={cn(
        "pb-2",
        car.isAvailable ? "bg-green-100" : "bg-amber-200"
      )}>
        <CardTitle className="flex justify-between items-center text-base sm:text-lg">
          <div className="flex items-center">
            <Car className="h-4 w-4 mr-1.5" />
            <span className="truncate max-w-[150px] sm:max-w-none">{car.name}</span>
          </div>
          <Badge 
            variant={car.isAvailable ? "outline" : "secondary"}
            className={cn(
              "ml-2 whitespace-nowrap text-xs",
              car.isAvailable 
                ? "border-green-500 text-green-700 bg-green-50 font-medium" 
                : "border-amber-600 text-amber-900 bg-amber-100 font-medium"
            )}
          >
            {car.isAvailable ? t('loanerCar.available') : t('loanerCar.loanedOut')}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className={cn(
        "pt-3 px-4 pb-4",
        !car.isAvailable && "bg-amber-50"
      )}>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center text-sm">
            <span className="font-medium w-24 text-muted-foreground">{t('loanerCar.licensePlate')}:</span>
            <span className="font-medium">{car.license}</span>
          </div>
          
          {!car.isAvailable && car.assignedTo && (
            <>
              <div className="flex items-center text-sm">
                <span className="font-medium w-24 text-muted-foreground">{t('loanerCar.assignedTo')}:</span>
                <div className="flex items-center">
                  <User className="h-3.5 w-3.5 mr-1 text-amber-700" />
                  <span className="font-medium text-amber-900 truncate max-w-[150px] sm:max-w-none">{car.assignedTo}</span>
                </div>
              </div>
              
              {car.assignedFrom && (
                <div className="flex items-center text-sm">
                  <span className="font-medium w-24 text-muted-foreground">{t('loanerCar.startDate')}:</span>
                  <div className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1 text-amber-700" />
                    <span className="truncate max-w-[150px] sm:max-w-none">{formatDate(car.assignedFrom)}</span>
                  </div>
                </div>
              )}
              
              {car.assignedUntil && (
                <div className="flex items-center text-sm">
                  <span className="font-medium w-24 text-muted-foreground">{t('loanerCar.returnDate')}:</span>
                  <div className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1 text-amber-700" />
                    <span className="truncate max-w-[150px] sm:max-w-none">{formatDate(car.assignedUntil)}</span>
                  </div>
                </div>
              )}
              
              {car.assignedUntil && new Date(car.assignedUntil) < new Date() && (
                <div className="flex items-center text-xs sm:text-sm text-red-600 mt-2 font-medium">
                  <AlertCircle className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                  <span>{t('loanerCar.overdue')}</span>
                </div>
              )}
            </>
          )}
          
          <div className={cn("flex pt-3 gap-1.5 sm:gap-2", 
            isMobile ? (isAdmin ? "flex-col" : "justify-end") : "justify-end"
          )}>
            {car.isAvailable ? (
              <Button 
                size={isMobile ? "sm" : "default"}
                className="w-full sm:w-auto text-xs sm:text-sm px-2 sm:px-4"
                onClick={() => onAssign(car)}
              >
                {t('loanerCar.assignToCustomer')}
              </Button>
            ) : (
              <Button 
                size={isMobile ? "sm" : "default"}
                variant="outline" 
                className="w-full sm:w-auto border-amber-600 text-amber-700 hover:bg-amber-100 text-xs sm:text-sm px-2 sm:px-4"
                onClick={() => onReturn(car.id)}
              >
                {t('loanerCar.markAsReturned')}
              </Button>
            )}
            
            {isAdmin && (
              <div className={cn("flex gap-1.5 sm:gap-2", isMobile && "w-full")}>
                <Button 
                  size={isMobile ? "sm" : "default"}
                  variant="outline"
                  className={cn("text-xs sm:text-sm px-2 sm:px-3", isMobile && "flex-1")}
                  onClick={() => onEdit(car)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  {t('actions.edit')}
                </Button>
                
                <Button
                  size={isMobile ? "sm" : "default"}
                  variant="destructive"
                  className={cn("text-xs sm:text-sm px-2 sm:px-3", isMobile && "flex-1")}
                  onClick={() => onDelete(car)}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  {t('actions.delete')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
