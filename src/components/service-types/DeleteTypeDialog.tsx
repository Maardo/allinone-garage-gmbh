
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { ServiceType, ServiceTypeInfo } from "@/lib/serviceTypes";
import { AlertCircle } from "lucide-react";
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
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            {t('serviceTypes.deleteTitle')}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-3">{t('serviceTypes.deleteConfirmation')}</p>
          {typeToDelete && serviceTypes[typeToDelete] && (
            <div className="bg-muted/30 p-3 rounded-md border flex items-center gap-3">
              <div 
                className="h-8 w-8 rounded-md flex-shrink-0" 
                style={{ backgroundColor: serviceTypes[typeToDelete].color }}
              ></div>
              <div>
                <p className="font-semibold">{serviceTypes[typeToDelete].name}</p>
                <p className="text-sm text-muted-foreground">{serviceTypes[typeToDelete].code}</p>
              </div>
            </div>
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
