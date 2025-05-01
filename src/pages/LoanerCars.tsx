
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
import { useEffect, useState } from "react";
import { LoanerCarsHeader } from "@/components/loaner-cars/LoanerCarsHeader";
import { LoanerCarsLoading } from "@/components/loaner-cars/LoanerCarsLoading";
import { LoanerCarsTabs } from "@/components/loaner-cars/LoanerCarsTabs";
import { useTabOperations } from "@/components/loaner-cars/hooks/useTabOperations";
import { useDialogOperations } from "@/components/loaner-cars/hooks/useDialogOperations";
import { format } from "date-fns";

export default function LoanerCarsPage() {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  const { refreshData: refreshOverviewData } = useOverviewAppointments();
  const { loadAppointments } = useCalendar();

  // Track dialog states
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDatesDialogOpen, setIsEditDatesDialogOpen] = useState(false);
  
  const {
    loanerCars,
    appointmentsNeedingCars,
    selectedCar,
    setSelectedCar,
    newCar,
    setNewCar,
    assignData,
    setAssignData,
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
      console.log("Assigning to appointment:", appointmentId);
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

  const handleAssignCar = (car: LoanerCar) => {
    setSelectedCar(car);
    const today = format(new Date(), "yyyy-MM-dd");
    setAssignData({
      customerId: "",
      startDate: today,
      returnDate: format(new Date(new Date().setDate(new Date().getDate() + 3)), "yyyy-MM-dd"),
    });
    setIsAssignDialogOpen(true);
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
        isOpen={isAssignDialogOpen}
        selectedCar={selectedCar}
        onOpenChange={(open) => setIsAssignDialogOpen(open)}
        onAssign={async () => {
          try {
            console.log("Assigning car in dialog:", { selectedCar, assignData });
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
            setIsEditDialogOpen(false);
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
            setIsDeleteDialogOpen(false);
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
