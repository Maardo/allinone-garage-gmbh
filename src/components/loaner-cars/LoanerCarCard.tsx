
import { Car, User, Calendar, AlertCircle, Edit, Trash2, Clock } from "lucide-react";
import { format } from "date-fns";
import { LoanerCar } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface LoanerCarCardProps {
  car: LoanerCar;
  onAssign: (car: LoanerCar) => void;
  onReturn: (carId: string) => void;
  onEdit: (car: LoanerCar) => void;
  onDelete: (car: LoanerCar) => void;
  onEditDates: (car: LoanerCar) => void;
  isAdmin: boolean;
}

export function LoanerCarCard({ 
  car, 
  onAssign, 
  onReturn, 
  onEdit, 
  onDelete,
  onEditDates,
  isAdmin 
}: LoanerCarCardProps) {
  const { t } = useLanguage();

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
          <div className="flex items-center truncate mr-2">
            <Car className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{car.name}</span>
          </div>
          <Badge 
            variant={car.isAvailable ? "outline" : "secondary"}
            className={cn(
              "whitespace-nowrap ml-1 flex-shrink-0",
              car.isAvailable 
                ? "border-green-500 text-green-700 bg-green-50 font-bold" 
                : "border-amber-600 text-amber-900 bg-amber-100 font-bold"
            )}
          >
            {car.isAvailable ? t('loanerCar.available') : t('loanerCar.loanedOut')}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className={cn(
        "pt-4",
        !car.isAvailable && "bg-amber-50"
      )}>
        <div className="flex flex-col space-y-2">
          <div className="flex flex-col text-sm">
            <span className="font-medium mb-1">{t('loanerCar.licensePlate')}:</span>
            <span className="bg-gray-50 px-2 py-1 rounded-sm border border-gray-200">{car.license}</span>
          </div>
          
          {!car.isAvailable && car.assignedTo && (
            <>
              <div className="flex flex-col text-sm mt-3">
                <span className="font-medium mb-1">{t('loanerCar.assignedTo')}:</span>
                <div className="flex items-center truncate bg-gray-50 px-2 py-1 rounded-sm border border-gray-200">
                  <User className="h-4 w-4 mr-1 text-amber-700 flex-shrink-0" />
                  <span className="font-medium text-amber-900 truncate">{car.assignedTo}</span>
                </div>
              </div>
              
              {car.assignedFrom && (
                <div className="flex flex-col text-sm">
                  <span className="font-medium mb-1">{t('loanerCar.startDate')}:</span>
                  <div className="flex items-center bg-gray-50 px-2 py-1 rounded-sm border border-gray-200">
                    <Calendar className="h-4 w-4 mr-1 text-amber-700 flex-shrink-0" />
                    <span>{format(new Date(car.assignedFrom), "PPP")}</span>
                  </div>
                </div>
              )}
              
              {car.assignedUntil && (
                <div className="flex flex-col text-sm">
                  <span className="font-medium mb-1">{t('loanerCar.returnDate')}:</span>
                  <div className="flex items-center bg-gray-50 px-2 py-1 rounded-sm border border-gray-200">
                    <Calendar className="h-4 w-4 mr-1 text-amber-700 flex-shrink-0" />
                    <span>{format(new Date(car.assignedUntil), "PPP")}</span>
                  </div>
                </div>
              )}
              
              {car.assignedUntil && new Date(car.assignedUntil) < new Date() && (
                <div className="flex items-center text-sm text-red-600 mt-2 font-bold">
                  <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{t('loanerCar.overdue')}</span>
                </div>
              )}
            </>
          )}
          
          <div className="flex flex-col pt-3 gap-2">
            {car.isAvailable ? (
              <Button 
                size="sm"
                onClick={() => onAssign(car)}
              >
                {t('loanerCar.assignToCustomer')}
              </Button>
            ) : (
              <div className="space-y-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full border-amber-600 text-amber-700 hover:bg-amber-100"
                  onClick={() => onReturn(car.id)}
                >
                  {t('loanerCar.markAsReturned')}
                </Button>
                
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => onEditDates(car)}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {t('loanerCar.editDates')}
                </Button>
                
                {isAdmin && (
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(car)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      {t('actions.edit')}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(car)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      {t('actions.delete')}
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            {car.isAvailable && isAdmin && (
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(car)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  {t('actions.edit')}
                </Button>
                
                <Button
                  size="sm"
                  variant="destructive"
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
