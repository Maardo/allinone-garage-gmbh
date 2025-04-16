
import { LoanerCar } from "@/lib/types";
import { AssignDialog } from "@/components/loaner-cars/AssignDialog";
import { EditCarDialog } from "@/components/loaner-cars/EditCarDialog";
import { DeleteCarDialog } from "@/components/loaner-cars/DeleteCarDialog";
import { EditLoanerDateDialog } from "@/components/loaner-cars/EditLoanerDateDialog";

interface LoanerCarsDialogsProps {
  isAssignDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  isEditDatesDialogOpen: boolean;
  selectedCar: LoanerCar | null;
  newCar: Partial<LoanerCar>;
  assignData: {
    customerId: string;
    startDate: string;
    returnDate: string;
  };
  setAssignDialogOpen: (open: boolean) => void;
  setEditDialogOpen: (open: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setEditDatesDialogOpen: (open: boolean) => void;
  setAssignData: (data: { customerId: string; returnDate: string; startDate: string }) => void;
  setSelectedCar: (car: LoanerCar | null) => void;
  setNewCar: (car: Partial<LoanerCar>) => void;
  onAssign: () => Promise<void>;
  onUpdateCar: () => Promise<void>;
  onAddCar: () => Promise<void>;
  onDeleteCar: () => Promise<void>;
  onUpdateDates: (startDate: string, returnDate: string) => Promise<void>;
  refreshOverviewData: () => Promise<void>;
  loadAppointments: () => Promise<void>;
}

export function LoanerCarsDialogs({
  isAssignDialogOpen,
  isEditDialogOpen,
  isDeleteDialogOpen,
  isEditDatesDialogOpen,
  selectedCar,
  newCar,
  assignData,
  setAssignDialogOpen,
  setEditDialogOpen,
  setDeleteDialogOpen,
  setEditDatesDialogOpen,
  setAssignData,
  setSelectedCar,
  setNewCar,
  onAssign,
  onUpdateCar,
  onAddCar,
  onDeleteCar,
  onUpdateDates,
  refreshOverviewData,
  loadAppointments
}: LoanerCarsDialogsProps) {
  return (
    <>
      <AssignDialog 
        isOpen={isAssignDialogOpen && selectedCar !== null}
        selectedCar={selectedCar}
        onOpenChange={(open) => setAssignDialogOpen(open)}
        onAssign={async () => {
          await onAssign();
          setAssignDialogOpen(false);
          refreshOverviewData();
          loadAppointments();
        }}
        assignData={assignData}
        setAssignData={setAssignData}
      />

      <EditCarDialog 
        isOpen={isEditDialogOpen}
        isNewCar={!selectedCar}
        onOpenChange={(open) => setEditDialogOpen(open)}
        onSave={async () => {
          if (selectedCar) {
            await onUpdateCar();
          } else {
            await onAddCar();
          }
          refreshOverviewData();
        }}
        car={selectedCar || newCar}
        setCar={selectedCar ? setSelectedCar : setNewCar}
      />

      <DeleteCarDialog 
        isOpen={isDeleteDialogOpen && selectedCar !== null}
        selectedCar={selectedCar}
        onOpenChange={(open) => setDeleteDialogOpen(open)}
        onDelete={async () => {
          await onDeleteCar();
          refreshOverviewData();
        }}
      />
      
      <EditLoanerDateDialog
        isOpen={isEditDatesDialogOpen && selectedCar !== null}
        selectedCar={selectedCar}
        onOpenChange={(open) => setEditDatesDialogOpen(open)}
        onSave={async (startDate, returnDate) => {
          if (selectedCar) {
            await onUpdateDates(startDate, returnDate);
            setEditDatesDialogOpen(false);
            refreshOverviewData();
            loadAppointments();
          }
        }}
      />
    </>
  );
}
