
import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoanerCar } from "@/lib/types";
import { LoanerCarCard } from "@/components/loaner-cars/LoanerCarCard";
import { useLanguage } from "@/context/LanguageContext";
import { format } from "date-fns";

interface AvailableCarsTabProps {
  loanerCars: LoanerCar[];
  isAdmin: boolean;
  onAssign: (car: LoanerCar) => void;
  onReturn: (carId: string) => void;
  onEdit: (car: LoanerCar) => void;
  onDelete: (car: LoanerCar) => void;
  onEditDates: (car: LoanerCar) => void;
  onAddNew: () => void;
}

export function AvailableCarsTab({
  loanerCars,
  isAdmin,
  onAssign,
  onReturn,
  onEdit,
  onDelete,
  onEditDates,
  onAddNew
}: AvailableCarsTabProps) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {loanerCars.map((car) => (
        <LoanerCarCard
          key={car.id}
          car={car}
          onAssign={onAssign}
          onReturn={onReturn}
          onEdit={onEdit}
          onDelete={onDelete}
          onEditDates={onEditDates}
          isAdmin={isAdmin}
        />
      ))}
      
      {loanerCars.length === 0 && (
        <div className="col-span-full text-center py-6 border-2 border-dashed rounded-md border-gray-300 bg-gray-50">
          <Car className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-20" />
          <p className="text-muted-foreground">
            {isAdmin 
              ? t('loanerCar.noAvailableCarsDescription') 
              : t('loanerCar.noAvailableCars')}
          </p>
          {isAdmin && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={onAddNew}
            >
              <Car className="h-4 w-4 mr-2" />
              {t('loanerCar.addNew')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
