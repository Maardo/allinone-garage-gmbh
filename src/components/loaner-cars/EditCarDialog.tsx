
import { LoanerCar } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SetStateAction, Dispatch } from 'react';

interface EditCarDialogProps {
  isOpen: boolean;
  isNewCar: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  car: LoanerCar | Partial<LoanerCar>;
  setCar: ((car: LoanerCar | Partial<LoanerCar>) => void) | Dispatch<SetStateAction<LoanerCar | null>> | Dispatch<SetStateAction<Partial<LoanerCar>>>;
}

export function EditCarDialog({
  isOpen,
  isNewCar,
  onOpenChange,
  onSave,
  car,
  setCar
}: EditCarDialogProps) {
  const { t } = useLanguage();
  
  // Helper function to handle the different types of setCar functions
  const handleCarUpdate = (updatedCar: LoanerCar | Partial<LoanerCar>) => {
    if (typeof setCar === 'function') {
      setCar(updatedCar);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isNewCar ? t('loanerCar.addNew') : t('loanerCar.editTitle')}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="car-name">{t('loanerCar.carName')}</Label>
            <Input 
              id="car-name" 
              value={car.name || ""}
              onChange={(e) => handleCarUpdate({...car, name: e.target.value})}
              placeholder={isNewCar ? t('loanerCar.carNamePlaceholder') : ""}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="car-license">{t('loanerCar.licensePlate')}</Label>
            <Input 
              id="car-license" 
              value={car.license || ""}
              onChange={(e) => handleCarUpdate({...car, license: e.target.value})}
              placeholder={isNewCar ? t('loanerCar.licensePlatePlaceholder') : ""}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={onSave}
            disabled={!car.name || !car.license}
          >
            {t('actions.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
