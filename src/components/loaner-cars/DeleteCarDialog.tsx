
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

interface DeleteCarDialogProps {
  isOpen: boolean;
  selectedCar: LoanerCar | null;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
}

export function DeleteCarDialog({
  isOpen,
  selectedCar,
  onOpenChange,
  onDelete
}: DeleteCarDialogProps) {
  const { t } = useLanguage();
  
  const handleDelete = () => {
    onDelete();
    onOpenChange(false); // This will close the dialog automatically after deletion
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('loanerCar.deleteTitle')}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>{t('loanerCar.deleteConfirmation')}</p>
          <p className="font-medium mt-2">{selectedCar?.name} ({selectedCar?.license})</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('actions.cancel')}
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            {t('actions.confirmDelete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
