
import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/context/LanguageContext";

interface LoanerCarsHeaderProps {
  isAdmin: boolean;
  onAddNewCar: () => void;
}

export function LoanerCarsHeader({ isAdmin, onAddNewCar }: LoanerCarsHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-wrap justify-between items-center gap-3">
      <h2 className="text-xl font-medium">{t('loanerCar.management')}</h2>
      
      {isAdmin && (
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={onAddNewCar}>
              <Car className="h-4 w-4 mr-2" />
              {t('loanerCar.addNew')}
            </Button>
          </DialogTrigger>
        </Dialog>
      )}
    </div>
  );
}
