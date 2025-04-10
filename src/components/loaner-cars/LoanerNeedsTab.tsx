
import { Car } from "lucide-react";
import { Appointment } from "@/lib/types";
import { LoanerCarRequests } from "@/components/loaner-cars/LoanerCarRequests";
import { useLanguage } from "@/context/LanguageContext";

interface LoanerNeedsTabProps {
  appointments: Appointment[];
  onAssign: (appointmentId: string) => void;
}

export function LoanerNeedsTab({ appointments, onAssign }: LoanerNeedsTabProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-blue-50/50 border rounded-md p-4">
      <h3 className="text-lg font-medium mb-3 flex items-center text-blue-800">
        <Car className="h-5 w-5 mr-2 text-blue-600" />
        {t('loanerCar.loanerNeedsTab')}
        <span className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {appointments.length}
        </span>
      </h3>
      
      <p className="text-sm text-blue-700 mb-4">
        {t('loanerCar.needsLoanerCarDescription')}
      </p>
      
      <LoanerCarRequests 
        appointments={appointments} 
        onAssign={onAssign} 
      />
      
      {appointments.length === 0 && (
        <div className="text-center py-10">
          <Car className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
          <p className="text-muted-foreground">{t('loanerCar.noLoanerNeeds')}</p>
        </div>
      )}
    </div>
  );
}
