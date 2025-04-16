
import { Layout } from "@/components/Layout";
import { AssignDialog } from "@/components/loaner-cars/AssignDialog";
import { EditCarDialog } from "@/components/loaner-cars/EditCarDialog";
import { DeleteCarDialog } from "@/components/loaner-cars/DeleteCarDialog";
import { EditLoanerDateDialog } from "@/components/loaner-cars/EditLoanerDateDialog";
import { useLoanerCars } from "@/components/loaner-cars/useLoanerCars";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useOverviewAppointments } from "@/hooks/useOverviewAppointments";
import { useCalendar } from "@/hooks/useCalendar";
import { useEffect } from "react";
import { LoanerCarsHeader } from "@/components/loaner-cars/LoanerCarsHeader";
import { LoanerCarsLoading } from "@/components/loaner-cars/LoanerCarsLoading";
import { LoanerCarsTabs } from "@/components/loaner-cars/LoanerCarsTabs";
import { useTabOperations } from "@/components/loaner-cars/hooks/useTabOperations";
import { useDialogOperations } from "@/components/loaner-cars/hooks/useDialogOperations";

export default function LoanerCarsPage() {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  const { refreshData: refreshOverviewData } = useOverviewAppointments();
  const { loadAppointments } = useCalendar();
  
  const {
    loanerCars,
    appointmentsNeedingCars,
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

  const {
    isAssignDialogOpen,
    setIsAssignDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isEditDatesDialogOpen,
    setIsEditDatesDialogOpen,
    selectedCar,
    setSelectedCar,
    newCar,
    setNewCar,
    assignData,
    setAssignData,
    handleAddNewCar,
    handleAssignCar
  } = useDialogOperations();

  const { activeTab, setActiveTab } = useTabOperations(
    appointmentsNeedingCars,
    refreshOverviewData,
    loadAppointments
  );

  // Load data on component mount
  useEffect(() => {
    const loadAllData = async () => {
      await refreshOverviewData();
      await loadAppointments();
      await loadLoanerCars();
    };
    
    loadAllData();
  }, [refreshOverviewData, loadAppointments, loadLoanerCars]);

  const handleAssignToAppointmentWithRefresh = async (appointmentId: string) => {
    try {
      await handleAssignToAppointment(appointmentId);
      await refreshOverviewData();
      await loadAppointments();
      await loadLoanerCars();
    } catch (error) {
      console.error("Error in handleAssignToAppointmentWithRefresh:", error);
    }
  };

  const handleReturnWithRefresh = async (carId: string) => {
    try {
      await handleReturn(carId);
      await refreshOverviewData();
      await loadAppointments();
      await loadLoanerCars();
    } catch (error) {
      console.error("Error in handleReturnWithRefresh:", error);
    }
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

        <LoanerCarsTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          loanerCars={loanerCars}
          appointmentsNeedingCars={appointmentsNeedingCars}
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
          isAdmin={isAdmin}
        />
      </div>

      <AssignDialog 
        isOpen={isAssignDialogOpen && selectedCar !== null}
        selectedCar={selectedCar}
        onOpenChange={(open) => setIsAssignDialogOpen(open)}
        onAssign={async () => {
          try {
            await handleAssign();
            setIsAssignDialogOpen(false);
            await refreshOverviewData();
            await loadAppointments();
            await loadLoanerCars();
          } catch (error) {
            console.error("Error in AssignDialog onAssign:", error);
          }
        }}
        assignData={assignData}
        setAssignData={setAssignData}
      />

      <EditCarDialog 
        isOpen={isEditDialogOpen}
        isNewCar={!selectedCar}
        onOpenChange={(open) => setIsEditDialogOpen(open)}
        onSave={async () => {
          try {
            if (selectedCar) {
              await handleUpdateCar();
            } else {
              await handleAddCar();
            }
            await refreshOverviewData();
            await loadLoanerCars();
          } catch (error) {
            console.error("Error in EditCarDialog onSave:", error);
          }
        }}
        car={selectedCar || newCar}
        setCar={selectedCar ? setSelectedCar : setNewCar}
      />

      <DeleteCarDialog 
        isOpen={isDeleteDialogOpen && selectedCar !== null}
        selectedCar={selectedCar}
        onOpenChange={(open) => setIsDeleteDialogOpen(open)}
        onDelete={async () => {
          try {
            await handleDeleteCar();
            await refreshOverviewData();
            await loadLoanerCars();
          } catch (error) {
            console.error("Error in DeleteCarDialog onDelete:", error);
          }
        }}
      />
      
      <EditLoanerDateDialog
        isOpen={isEditDatesDialogOpen && selectedCar !== null}
        selectedCar={selectedCar}
        onOpenChange={(open) => setIsEditDatesDialogOpen(open)}
        onSave={async (startDate, returnDate) => {
          try {
            if (selectedCar) {
              await handleUpdateDates(selectedCar.id, startDate, returnDate);
              setIsEditDatesDialogOpen(false);
              await refreshOverviewData();
              await loadAppointments();
              await loadLoanerCars();
            }
          } catch (error) {
            console.error("Error in EditLoanerDateDialog onSave:", error);
          }
        }}
      />
    </Layout>
  );
}
