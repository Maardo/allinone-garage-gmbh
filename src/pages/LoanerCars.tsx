
import { Layout } from "@/components/Layout";
import { useLoanerCars } from "@/components/loaner-cars/useLoanerCars";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useOverviewAppointments } from "@/hooks/useOverviewAppointments";
import { useCalendar } from "@/hooks/useCalendar";
import { useEffect } from "react";
import { LoanerCarsHeader } from "@/components/loaner-cars/LoanerCarsHeader";
import { LoanerCarsLoading } from "@/components/loaner-cars/LoanerCarsLoading";
import { LoanerCarsTabs } from "@/components/loaner-cars/LoanerCarsTabs";
import { LoanerCarsDialogs } from "@/components/loaner-cars/LoanerCarsDialogs";
import { useLoanerCarPageActions } from "@/hooks/useLoanerCarPageActions";

export default function LoanerCarsPage() {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const isMobile = useIsMobile();
  const isAdmin = currentUser?.role === 'admin';
  const { refreshData: refreshOverviewData } = useOverviewAppointments();
  const { loadAppointments } = useCalendar();
  
  const {
    loanerCars,
    selectedCar,
    setSelectedCar,
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

  // Extract page-specific actions to a custom hook
  const {
    isAssignDialogOpen,
    setIsAssignDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isEditDatesDialogOpen,
    setIsEditDatesDialogOpen,
    handleAssignToAppointmentWithRefresh,
    handleReturnWithRefresh,
    handleAddNewCar,
    handleAssignCar
  } = useLoanerCarPageActions({
    handleAssign,
    handleReturn,
    handleAddCar,
    handleUpdateCar,
    handleDeleteCar,
    handleUpdateDates,
    handleAssignToAppointment,
    setSelectedCar,
    setNewCar,
    setAssignData,
    refreshOverviewData,
    loadAppointments
  });

  // Load data when component mounts
  useEffect(() => {
    refreshOverviewData();
    loadAppointments();
  }, [refreshOverviewData, loadAppointments]);

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

        <LoanerCarsTabs 
          loanerCars={loanerCars}
          appointmentsNeedingCars={appointmentsNeedingCars}
          isAdmin={isAdmin}
          onAssignCar={handleAssignCar}
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
          onAssignToAppointment={handleAssignToAppointmentWithRefresh}
        />
      </div>

      <LoanerCarsDialogs 
        isAssignDialogOpen={isAssignDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        isEditDatesDialogOpen={isEditDatesDialogOpen}
        selectedCar={selectedCar}
        newCar={newCar}
        assignData={assignData}
        setAssignDialogOpen={setIsAssignDialogOpen}
        setEditDialogOpen={setIsEditDialogOpen}
        setDeleteDialogOpen={setIsDeleteDialogOpen}
        setEditDatesDialogOpen={setIsEditDatesDialogOpen}
        setAssignData={setAssignData}
        setSelectedCar={setSelectedCar}
        setNewCar={setNewCar}
        onAssign={handleAssign}
        onUpdateCar={handleUpdateCar}
        onAddCar={handleAddCar}
        onDeleteCar={handleDeleteCar}
        onUpdateDates={(startDate, returnDate) => {
          if (selectedCar) {
            return handleUpdateDates(selectedCar.id, startDate, returnDate);
          }
          return Promise.resolve();
        }}
        refreshOverviewData={refreshOverviewData}
        loadAppointments={loadAppointments}
      />
    </Layout>
  );
}
