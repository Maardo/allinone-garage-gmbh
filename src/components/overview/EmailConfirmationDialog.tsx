
import { useLanguage } from "@/context/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Appointment, Stats } from '@/lib/overview/types';

interface EmailConfirmationDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  appointment: Appointment | null;
  onConfirmSendEmail: () => void;
  onConfirmNoEmail: () => void;
}

export function EmailConfirmationDialog({
  open,
  setOpen,
  appointment,
  onConfirmSendEmail,
  onConfirmNoEmail
}: EmailConfirmationDialogProps) {
  const { t } = useLanguage();
  
  if (!appointment) return null;
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('overview.sendEmailConfirmation')}</DialogTitle>
          <DialogDescription>{t('overview.sendEmailQuestion')}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col md:flex-row sm:justify-start gap-2 mt-5">
          <Button 
            variant="default"
            onClick={() => {
              onConfirmSendEmail();
              setOpen(false);
            }}
          >
            {t('actions.yes')}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              onConfirmNoEmail();
              setOpen(false);
            }}
          >
            {t('actions.no')}
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              setOpen(false);
            }}
            className="md:ml-auto"
          >
            {t('actions.cancel')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
