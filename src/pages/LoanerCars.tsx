
import { Car, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { LoanerCarCard } from "@/components/loaner-cars/LoanerCarCard";
import { AssignDialog } from "@/components/loaner-cars/AssignDialog";
import { EditCarDialog } from "@/components/loaner-cars/EditCarDialog";
import { DeleteCarDialog } from "@/components/loaner-cars/DeleteCarDialog";
import { LoanerCarRequests } from "@/components/loaner-cars/LoanerCarRequests";
import { useLoanerCars } from "@/components/loaner-cars/useLoanerCars";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SortOption, FilterOption } from "@/components/loaner-cars/useLoanerCarManagement";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function LoanerCarsPage() {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  
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
    handleAssignToAppointment,
    sortBy,
    sortOrder,
    filterBy,
    handleSort,
    handleFilter
  } = useLoanerCars();

  // Helper function to render sort icon
  const renderSortIcon = (column: SortOption) => {
    if (sortBy === column) {
      return sortOrder === 'asc' ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      );
    }
    return null;
  };

  return (
    <Layout>
      <Tabs defaultValue="cars">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-medium">{t('loanerCar.management')}</h2>
            <TabsList>
              <TabsTrigger value="cars">{t('loanerCar.availableCars')}</TabsTrigger>
              <TabsTrigger value="requests">{t('loanerCar.requestedCars')}</TabsTrigger>
            </TabsList>
          </div>
          
          {isAdmin && (
            <Dialog open={isEditDialogOpen && !selectedCar} onOpenChange={(open) => {
              if (open) {
                setSelectedCar(null);
                setNewCar({
                  name: "",
                  license: "",
                  isAvailable: true
                });
              }
              setIsEditDialogOpen(open);
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Car className="h-4 w-4 mr-2" />
                  {t('loanerCar.addNew')}
                </Button>
              </DialogTrigger>
              <EditCarDialog 
                isOpen={isEditDialogOpen && !selectedCar}
                isNewCar={true}
                onOpenChange={(open) => setIsEditDialogOpen(open)}
                onSave={handleAddCar}
                car={newCar}
                setCar={setNewCar}
              />
            </Dialog>
          )}
        </div>

        <TabsContent value="cars" className="mt-0">
          <div className="flex justify-between mb-4 items-center">
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center">
                    {t('loanerCar.sortBy')}: {t(`loanerCar.sort.${sortBy}`)}
                    {renderSortIcon(sortBy)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => handleSort('name')} className="flex justify-between">
                    {t('loanerCar.sort.name')}
                    {renderSortIcon('name')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('license')} className="flex justify-between">
                    {t('loanerCar.sort.license')}
                    {renderSortIcon('license')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('availability')} className="flex justify-between">
                    {t('loanerCar.sort.availability')}
                    {renderSortIcon('availability')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Select
                value={filterBy}
                onValueChange={(value) => handleFilter(value as FilterOption)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t('loanerCar.filterBy')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('loanerCar.filter.all')}</SelectItem>
                  <SelectItem value="available">{t('loanerCar.filter.available')}</SelectItem>
                  <SelectItem value="loaned">{t('loanerCar.filter.loaned')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {loanerCars.length} {loanerCars.length === 1 ? t('loanerCar.car') : t('loanerCar.cars')}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {loanerCars.map((car) => (
              <LoanerCarCard
                key={car.id}
                car={car}
                onAssign={(car) => {
                  setSelectedCar(car);
                  const today = format(new Date(), "yyyy-MM-dd");
                  setAssignData({
                    customerId: "",
                    startDate: today,
                    returnDate: format(new Date(new Date().setDate(new Date().getDate() + 3)), "yyyy-MM-dd"),
                  });
                  setIsAssignDialogOpen(true);
                }}
                onReturn={handleReturn}
                onEdit={(car) => {
                  setSelectedCar(car);
                  setIsEditDialogOpen(true);
                }}
                onDelete={(car) => {
                  setSelectedCar(car);
                  setIsDeleteDialogOpen(true);
                }}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="requests" className="mt-0">
          <div className="border rounded-md">
            <LoanerCarRequests 
              appointments={appointmentsNeedingCars} 
              onAssign={handleAssignToAppointment} 
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AssignDialog 
        isOpen={isAssignDialogOpen && selectedCar !== null}
        selectedCar={selectedCar}
        onOpenChange={(open) => setIsAssignDialogOpen(open)}
        onAssign={handleAssign}
        assignData={assignData}
        setAssignData={setAssignData}
      />

      <EditCarDialog 
        isOpen={isEditDialogOpen && selectedCar !== null}
        isNewCar={false}
        onOpenChange={(open) => setIsEditDialogOpen(open)}
        onSave={handleUpdateCar}
        car={selectedCar || {}}
        setCar={setSelectedCar as any}
      />

      <DeleteCarDialog 
        isOpen={isDeleteDialogOpen && selectedCar !== null}
        selectedCar={selectedCar}
        onOpenChange={(open) => setIsDeleteDialogOpen(open)}
        onDelete={handleDeleteCar}
      />
    </Layout>
  );
}
