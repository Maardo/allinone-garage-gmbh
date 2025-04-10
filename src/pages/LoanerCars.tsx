
import { format } from "date-fns";
import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car } from "lucide-react";
import { AssignDialog } from "@/components/loaner-cars/AssignDialog";
import { EditCarDialog } from "@/components/loaner-cars/EditCarDialog";
import { DeleteCarDialog } from "@/components/loaner-cars/DeleteCarDialog";
import { EditLoanerDateDialog } from "@/components/loaner-cars/EditLoanerDateDialog";
import { useLoanerCars } from "@/components/loaner-cars/useLoanerCars";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useOverviewAppointments } from "@/hooks/useOverviewAppointments";
import { useEffect } from "react";
import { LoanerCarsHeader } from "@/components/loaner-cars/LoanerCarsHeader";
import { LoanerCarsLoading } from "@/components/loaner-cars/LoanerCarsLoading";
import { AvailableCarsTab } from "@/components/loaner-cars/AvailableCarsTab";
import { LoanerNeedsTab } from "@/components/loaner-cars/LoanerNeedsTab";

export default function LoanerCarsPage() {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const isMobile = useIsMobile();
  const isAdmin = currentUser?.role === 'admin';
  const { refreshData: refreshOverviewData } = useOverviewAppointments();
  
  const {
    loanerCars,
    selectedCar,
    setSelectedCar,
    isAssignDialogOpen,
    setIsAssignDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isEditDatesDialogOpen,
    setIsEditDatesDialogOpen,
    appointmentsNeedingCars,
    assignData,
    setAssignData,
    newCar,
    setNewCar,
    handleAssign,
    handleReturn,
    handleAddCar,
    handleUpdateCar,
    handleDeleteCar,
    handleUpdateDates,
    handleAssignToAppointment,
    isLoading,
    loadLoanerCars
  } = useLoanerCars();

  useEffect(() => {
    refreshOverviewData();
  }, [loanerCars, refreshOverviewData]);

  const handleAssignToAppointmentWithRefresh = async (appointmentId: string) => {
    await handleAssignToAppointment(appointmentId);
    await refreshOverviewData();
  };

  const handleReturnWithRefresh = async (carId: string) => {
    await handleReturn(carId);
    await refreshOverviewData();
  };

  const handleAddNewCar = () => {
    setSelectedCar(null);
    setNewCar({
      name: "",
      license: "",
      isAvailable: true
    });
    setIsEditDialogOpen(true);
  };

  const handleAssignCar = (car) => {
    setSelectedCar(car);
    const today = format(new Date(), "yyyy-MM-dd");
    setAssignData({
      customerId: "",
      startDate: today,
      returnDate: format(new Date(new Date().setDate(new Date().getDate() + 3)), "yyyy-MM-dd"),
    });
    setIsAssignDialogOpen(true);
  };

  if (isLoading) {
    return <LoanerCarsLoading />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <LoanerCarsHeader 
          isAdmin={isAdmin} 
          onAddNewCar={handleAddNewCar} 
        />

        <Tabs defaultValue="availableCars" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="availableCars" className="flex-grow">
              <Car className="h-4 w-4 mr-2 hidden sm:inline" />
              {t('loanerCar.tabAvailableCars')}
            </TabsTrigger>
            <TabsTrigger value="loanerNeeds" className="flex-grow">
              <Car className="h-4 w-4 mr-2 hidden sm:inline" />
              {t('loanerCar.tabLoanerNeeds')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="availableCars" className="mt-0">
            <AvailableCarsTab 
              loanerCars={loanerCars}
              isAdmin={isAdmin}
              onAssign={handleAssignCar}
              onReturn={handleReturnWithRefresh}
              onEdit={(car) => {
                setSelectedCar(car);
                setIsEditDialogOpen(true);
              }}
              onDelete={(car) => {
                setSelectedCar(car);
                setIsDeleteDialogOpen(true);
              }}
              onEditDates={(car) => {
                setSelectedCar(car);
                setIsEditDatesDialogOpen(true);
              }}
              onAddNew={handleAddNewCar}
            />
          </TabsContent>

          <TabsContent value="loanerNeeds" className="mt-0">
            <LoanerNeedsTab 
              appointments={appointmentsNeedingCars}
              onAssign={handleAssignToAppointmentWithRefresh}
            />
          </TabsContent>
        </Tabs>
      </div>

      <AssignDialog 
        isOpen={isAssignDialogOpen && selectedCar !== null}
        selectedCar={selectedCar}
        onOpenChange={(open) => setIsAssignDialogOpen(open)}
        onAssign={() => {
          handleAssign();
          setIsAssignDialogOpen(false);
        }}
        assignData={assignData}
        setAssignData={setAssignData}
      />

      <EditCarDialog 
        isOpen={isEditDialogOpen}
        isNewCar={!selectedCar}
        onOpenChange={(open) => setIsEditDialogOpen(open)}
        onSave={selectedCar ? handleUpdateCar : handleAddCar}
        car={selectedCar || newCar}
        setCar={selectedCar ? setSelectedCar : setNewCar}
      />

      <DeleteCarDialog 
        isOpen={isDeleteDialogOpen && selectedCar !== null}
        selectedCar={selectedCar}
        onOpenChange={(open) => setIsDeleteDialogOpen(open)}
        onDelete={handleDeleteCar}
      />
      
      <EditLoanerDateDialog
        isOpen={isEditDatesDialogOpen && selectedCar !== null}
        selectedCar={selectedCar}
        onOpenChange={(open) => setIsEditDatesDialogOpen(open)}
        onSave={(startDate, returnDate) => {
          if (selectedCar) {
            handleUpdateDates(selectedCar.id, startDate, returnDate);
            setIsEditDatesDialogOpen(false);
          }
        }}
      />
    </Layout>
  );
}
