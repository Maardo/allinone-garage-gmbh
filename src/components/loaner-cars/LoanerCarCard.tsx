
import { Car, User, Calendar, AlertCircle, Edit, Trash2 } from "lucide-react";
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
  const { t } = useLanguage();

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-md",
        !car.isAvailable && "border-amber-200"
      )}
    >
      <CardHeader className={cn(
        "pb-2",
        car.isAvailable ? "bg-green-50" : "bg-amber-50"
      )}>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center">
            <Car className="h-5 w-5 mr-2" />
            {car.name}
          </div>
          <Badge 
            variant={car.isAvailable ? "outline" : "secondary"}
            className={cn(
              car.isAvailable ? "border-green-500 text-green-700 bg-green-50" : "border-amber-500 text-amber-700 bg-amber-50"
            )}
          >
            {car.isAvailable ? t('loanerCar.available') : t('loanerCar.loanedOut')}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center text-sm">
            <span className="font-medium min-w-24">{t('loanerCar.licensePlate')}:</span>
            {car.license}
          </div>
          
          {!car.isAvailable && car.assignedTo && (
            <>
              <div className="flex items-center text-sm">
                <span className="font-medium min-w-24">{t('loanerCar.assignedTo')}:</span>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1 text-muted-foreground" />
                  {car.assignedTo}
                </div>
              </div>
              
              {car.assignedUntil && (
                <div className="flex items-center text-sm">
                  <span className="font-medium min-w-24">{t('loanerCar.returnDate')}:</span>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    {format(new Date(car.assignedUntil), "PPP")}
                  </div>
                </div>
              )}
              
              {car.assignedUntil && new Date(car.assignedUntil) < new Date() && (
                <div className="flex items-center text-sm text-red-600 mt-2">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {t('loanerCar.overdue')}
                </div>
              )}
            </>
          )}
          
          <div className="flex justify-end pt-2 gap-2">
            {car.isAvailable ? (
              <Button 
                size="sm"
                onClick={() => onAssign(car)}
              >
                {t('loanerCar.assignToCustomer')}
              </Button>
            ) : (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onReturn(car.id)}
              >
                {t('loanerCar.markAsReturned')}
              </Button>
            )}
            
            {isAdmin && (
              <>
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
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
