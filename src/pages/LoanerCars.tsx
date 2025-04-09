
import { Car } from "lucide-react";
import { format } from "date-fns";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoanerCarCard } from "@/components/loaner-cars/LoanerCarCard";
import { AssignDialog } from "@/components/loaner-cars/AssignDialog";
import { EditCarDialog } from "@/components/loaner-cars/EditCarDialog";
import { DeleteCarDialog } from "@/components/loaner-cars/DeleteCarDialog";
import { LoanerCarRequests } from "@/components/loaner-cars/LoanerCarRequests";
import { useLoanerCars } from "@/components/loaner-cars/useLoanerCars";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

export default function LoanerCarsPage() {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const isMobile = useIsMobile();
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
    handleAssignToAppointment
  } = useLoanerCars();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <h2 className="text-xl font-medium">{t('loanerCar.management')}</h2>
          
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

        {/* Tabs for Available Cars and Loaner Car Needs */}
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
            {/* Available Cars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              
              {loanerCars.length === 0 && (
                <div className="col-span-full text-center py-6 border-2 border-dashed rounded-md border-gray-300 bg-gray-50">
                  <Car className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-20" />
                  <p className="text-muted-foreground">
                    {isAdmin 
                      ? t('loanerCar.noAvailableCarsDescription') 
                      : t('loanerCar.noAvailableCars')}
                  </p>
                  {isAdmin && (
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => {
                        setSelectedCar(null);
                        setNewCar({
                          name: "",
                          license: "",
                          isAvailable: true
                        });
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Car className="h-4 w-4 mr-2" />
                      {t('loanerCar.addNew')}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="loanerNeeds" className="mt-0">
            {/* Loaner Car Needs Section */}
            <div className="bg-blue-50/50 border rounded-md p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center text-blue-800">
                <Car className="h-5 w-5 mr-2 text-blue-600" />
                {t('loanerCar.loanerNeedsTab')}
                <span className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {appointmentsNeedingCars.length}
                </span>
              </h3>
              
              <p className="text-sm text-blue-700 mb-4">
                {t('loanerCar.needsLoanerCarDescription')}
              </p>
              
              <LoanerCarRequests 
                appointments={appointmentsNeedingCars} 
                onAssign={handleAssignToAppointment} 
              />
              
              {appointmentsNeedingCars.length === 0 && (
                <div className="text-center py-10">
                  <Car className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
                  <p className="text-muted-foreground">{t('loanerCar.noLoanerNeeds')}</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
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
