
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
import { useCalendar } from "@/hooks/useCalendar";
import { useEffect, useState } from "react";
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
  const { loadAppointments } = useCalendar();
  
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

  // Force tab to "loanerNeeds" if there are appointments needing cars
  const [activeTab, setActiveTab] = useState(
    appointmentsNeedingCars.length > 0 ? "loanerNeeds" : "availableCars"
  );

  // Load data on component mount
  useEffect(() => {
    const loadAllData = async () => {
      await refreshOverviewData();
      await loadAppointments();
      await loadLoanerCars();
    };
    
    loadAllData();
    
    // Set active tab based on appointments needing cars
    if (appointmentsNeedingCars.length > 0) {
      setActiveTab("loanerNeeds");
    }
  }, [refreshOverviewData, loadAppointments, loadLoanerCars]);

  // Reload data when tab changes
  useEffect(() => {
    refreshOverviewData();
    loadAppointments();
  }, [activeTab, refreshOverviewData, loadAppointments]);

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
