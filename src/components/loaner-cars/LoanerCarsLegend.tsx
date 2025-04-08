
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";

export function LoanerCarsLegend() {
  const { t } = useLanguage();
  
  return (
    <div className="text-sm text-muted-foreground">
      <div className="flex items-center gap-2 mb-1">
        <Badge 
          variant="outline"
          className="border-green-500 text-green-700 bg-green-100 font-bold"
        >
          {t('loanerCar.available')}
        </Badge>
        <span>{t('loanerCar.readyToBeAssigned')}</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge 
          variant="outline"
          className="border-amber-500 text-amber-700 bg-amber-100 font-bold"
        >
          {t('loanerCar.loanedOut')}
        </Badge>
        <span>{t('loanerCar.currentlyAssigned')}</span>
      </div>
    </div>
  );
}
