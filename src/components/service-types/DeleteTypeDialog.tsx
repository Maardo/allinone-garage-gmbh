
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { ServiceType, ServiceTypeInfo } from "@/lib/serviceTypes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface DeleteTypeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  typeToDelete: ServiceType | null;
  serviceTypes: Record<ServiceType, ServiceTypeInfo>;
  onConfirmDelete: () => void;
}

export function DeleteTypeDialog({
  isOpen,
  onOpenChange,
  typeToDelete,
  serviceTypes,
  onConfirmDelete,
}: DeleteTypeDialogProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('serviceTypes.deleteTitle')}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>{t('serviceTypes.deleteConfirmation')}</p>
          {typeToDelete && serviceTypes[typeToDelete] && (
            <p className="font-semibold mt-2">{serviceTypes[typeToDelete].name}</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('actions.cancel')}
          </Button>
          <Button variant="destructive" onClick={onConfirmDelete}>
            {t('actions.confirmDelete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
