
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useLanguage } from "@/context/LanguageContext";

interface EmailConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (sendEmail: boolean) => void;
  customerName: string;
}

export function EmailConfirmationDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  customerName
}: EmailConfirmationDialogProps) {
  const { t } = useLanguage();

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('overview.sendEmailConfirmation')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('overview.sendEmailConfirmationDescription', { customerName })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onConfirm(false)}>
            {t('common.no')}
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => onConfirm(true)}>
            {t('common.yes')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
