
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { AvailableCarsTab } from "@/components/loaner-cars/AvailableCarsTab";
import { LoanerNeedsTab } from "@/components/loaner-cars/LoanerNeedsTab";
import { Appointment, LoanerCar } from "@/lib/types";

interface LoanerCarsTabsProps {
  loanerCars: LoanerCar[];
  appointmentsNeedingCars: Appointment[];
  isAdmin: boolean;
  onAssignCar: (car: LoanerCar) => void;
  onReturn: (carId: string) => void;
  onEdit: (car: LoanerCar) => void;
  onDelete: (car: LoanerCar) => void;
  onEditDates: (car: LoanerCar) => void;
  onAddNew: () => void;
  onAssignToAppointment: (appointmentId: string) => Promise<void>;
}

export function LoanerCarsTabs({
  loanerCars,
  appointmentsNeedingCars,
  isAdmin,
  onAssignCar,
  onReturn,
  onEdit,
  onDelete,
  onEditDates,
  onAddNew,
  onAssignToAppointment
}: LoanerCarsTabsProps) {
  const { t } = useLanguage();
  
  // Force tab to "loanerNeeds" if there are appointments needing cars
  const [activeTab, setActiveTab] = useState(
    appointmentsNeedingCars.length > 0 ? "loanerNeeds" : "availableCars"
  );
  
  // Set active tab based on appointments needing cars
  useEffect(() => {
    if (appointmentsNeedingCars.length > 0) {
      setActiveTab("loanerNeeds");
    }
  }, [appointmentsNeedingCars.length]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="availableCars" className="flex-grow">
          <Car className="h-4 w-4 mr-2 hidden sm:inline" />
          {t('loanerCar.tabAvailableCars')}
        </TabsTrigger>
        <TabsTrigger value="loanerNeeds" className="flex-grow">
          <Car className="h-4 w-4 mr-2 hidden sm:inline" />
          {t('loanerCar.tabLoanerNeeds')}
          {appointmentsNeedingCars.length > 0 && (
            <span className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {appointmentsNeedingCars.length}
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="availableCars" className="mt-0">
        <AvailableCarsTab 
          loanerCars={loanerCars}
          isAdmin={isAdmin}
          onAssign={onAssignCar}
          onReturn={onReturn}
          onEdit={onEdit}
          onDelete={onDelete}
          onEditDates={onEditDates}
          onAddNew={onAddNew}
        />
      </TabsContent>

      <TabsContent value="loanerNeeds" className="mt-0">
        <LoanerNeedsTab 
          appointments={appointmentsNeedingCars}
          onAssign={onAssignToAppointment}
        />
      </TabsContent>
    </Tabs>
  );
}
