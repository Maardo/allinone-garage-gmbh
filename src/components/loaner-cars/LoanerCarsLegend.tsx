
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";

export function LoanerCarsLegend() {
  const { t } = useLanguage();
  
  return (
    <div className="text-sm text-muted-foreground">
      <p>
        <Badge 
          variant="outline"
          className="mr-2 border-green-500 text-green-700 bg-green-50"
        >
          {t('loanerCar.available')}
        </Badge>
        {t('loanerCar.readyToBeAssigned')}
      </p>
      <p className="mt-1">
        <Badge 
          variant="outline"
          className="mr-2 border-amber-500 text-amber-700 bg-amber-50"
        >
          {t('loanerCar.loanedOut')}
        </Badge>
        {t('loanerCar.currentlyAssigned')}
      </p>
    </div>
  );
}
