
import { useState, useEffect } from "react";
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
import { format } from "date-fns";

interface EditLoanerDateDialogProps {
  isOpen: boolean;
  selectedCar: LoanerCar | null;
  onOpenChange: (open: boolean) => void;
  onSave: (startDate: string, returnDate: string) => Promise<void>;
}

export function EditLoanerDateDialog({
  isOpen,
  selectedCar,
  onOpenChange,
  onSave
}: EditLoanerDateDialogProps) {
  const { t } = useLanguage();
  
  const [startDate, setStartDate] = useState<string>(
    selectedCar?.assignedFrom 
      ? format(new Date(selectedCar.assignedFrom), "yyyy-MM-dd")
      : format(new Date(), "yyyy-MM-dd")
  );
  
  const [returnDate, setReturnDate] = useState<string>(
    selectedCar?.assignedUntil 
      ? format(new Date(selectedCar.assignedUntil), "yyyy-MM-dd")
      : format(new Date(new Date().setDate(new Date().getDate() + 3)), "yyyy-MM-dd")
  );

  // Update dates when the selected car changes
  useEffect(() => {
    if (selectedCar && isOpen) {
      if (selectedCar.assignedFrom) {
        setStartDate(format(new Date(selectedCar.assignedFrom), "yyyy-MM-dd"));
      }
      
      if (selectedCar.assignedUntil) {
        setReturnDate(format(new Date(selectedCar.assignedUntil), "yyyy-MM-dd"));
      }
    }
  }, [selectedCar, isOpen]);
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('loanerCar.editDates')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="car">{t('loanerCar.car')}</Label>
            <Input 
              id="car" 
              value={`${selectedCar?.name} (${selectedCar?.license})`} 
              readOnly 
            />
          </div>
          
          {selectedCar?.assignedTo && (
            <div className="space-y-2">
              <Label htmlFor="customer">{t('loanerCar.assignedTo')}</Label>
              <Input id="customer" value={selectedCar.assignedTo} readOnly />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="startDate">{t('loanerCar.startDate')}</Label>
            <Input 
              id="startDate" 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="returnDate">{t('loanerCar.returnDate')}</Label>
            <Input 
              id="returnDate" 
              type="date" 
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onSave(startDate, returnDate)}>
            {t('actions.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
