
import { useState } from "react";
import { Car, User, Calendar, AlertCircle, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoanerCar } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Mock data for demo purposes
const INITIAL_LOANER_CARS: LoanerCar[] = [
  {
    id: "car1",
    name: "Volvo V60",
    license: "ABC123",
    isAvailable: true
  },
  {
    id: "car2",
    name: "Toyota Corolla",
    license: "XYZ789",
    isAvailable: false,
    assignedTo: "Johan Andersson",
    assignedUntil: new Date(new Date().setDate(new Date().getDate() + 2))
  }
];

// Mock customers for demo
const MOCK_CUSTOMERS = [
  { id: "c1", name: "Johan Andersson" },
  { id: "c2", name: "Maria Johansson" },
  { id: "c3", name: "Erik Svensson" },
  { id: "c4", name: "Anna Karlsson" },
];

export default function LoanerCarsPage() {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [loanerCars, setLoanerCars] = useState<LoanerCar[]>(INITIAL_LOANER_CARS);
  const [selectedCar, setSelectedCar] = useState<LoanerCar | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [assignData, setAssignData] = useState({
    customerId: "",
    returnDate: format(new Date(new Date().setDate(new Date().getDate() + 3)), "yyyy-MM-dd"),
  });
  const [newCar, setNewCar] = useState<Partial<LoanerCar>>({
    name: "",
    license: "",
    isAvailable: true
  });

  const isAdmin = currentUser?.role === 'admin';

  const handleAssign = () => {
    if (!selectedCar || !assignData.customerId) return;
    
    const customer = MOCK_CUSTOMERS.find(c => c.id === assignData.customerId);
    if (!customer) return;

    const updatedCars = loanerCars.map(car => {
      if (car.id === selectedCar.id) {
        return {
          ...car,
          isAvailable: false,
          assignedTo: customer.name,
          assignedUntil: new Date(assignData.returnDate)
        };
      }
      return car;
    });
    
    setLoanerCars(updatedCars);
    setIsAssignDialogOpen(false);
    
    toast({
      title: t('loanerCar.assigned'),
      description: t('loanerCar.assignedDescription'),
    });
  };

  const handleReturn = (carId: string) => {
    const updatedCars = loanerCars.map(car => {
      if (car.id === carId) {
        return {
          ...car,
          isAvailable: true,
          assignedTo: undefined,
          assignedUntil: undefined
        };
      }
      return car;
    });
    
    setLoanerCars(updatedCars);
    
    toast({
      title: t('loanerCar.returned'),
      description: t('loanerCar.returnedDescription'),
    });
  };

  const handleAddCar = () => {
    if (!newCar.name || !newCar.license) return;
    
    const car: LoanerCar = {
      id: Math.random().toString(36).substring(2, 9),
      name: newCar.name,
      license: newCar.license,
      isAvailable: true
    };
    
    setLoanerCars([...loanerCars, car]);
    setNewCar({
      name: "",
      license: "",
      isAvailable: true
    });
    setIsEditDialogOpen(false);
    
    toast({
      title: t('loanerCar.added'),
      description: t('loanerCar.addedDescription'),
    });
  };

  const handleUpdateCar = () => {
    if (!selectedCar || !selectedCar.name || !selectedCar.license) return;
    
    const updatedCars = loanerCars.map(car => 
      car.id === selectedCar.id ? selectedCar : car
    );
    
    setLoanerCars(updatedCars);
    setIsEditDialogOpen(false);
    
    toast({
      title: t('loanerCar.updated'),
      description: t('loanerCar.updatedDescription'),
    });
  };

  const handleDeleteCar = () => {
    if (!selectedCar) return;
    
    const updatedCars = loanerCars.filter(car => car.id !== selectedCar.id);
    setLoanerCars(updatedCars);
    setIsDeleteDialogOpen(false);
    
    toast({
      title: t('loanerCar.deleted'),
      description: t('loanerCar.deletedDescription'),
    });
  };

  return (
    <Layout title={t('navigation.loanerCars')} subtitle={t('loanerCar.manageSubtitle')}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">{t('loanerCar.availableCars')}</h2>
        
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
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('loanerCar.addNew')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="car-name">{t('loanerCar.carName')}</Label>
                  <Input 
                    id="car-name" 
                    value={newCar.name || ""}
                    onChange={(e) => setNewCar({...newCar, name: e.target.value})}
                    placeholder={t('loanerCar.carNamePlaceholder')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="car-license">{t('loanerCar.licensePlate')}</Label>
                  <Input 
                    id="car-license" 
                    value={newCar.license || ""}
                    onChange={(e) => setNewCar({...newCar, license: e.target.value})}
                    placeholder={t('loanerCar.licensePlatePlaceholder')}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleAddCar}
                  disabled={!newCar.name || !newCar.license}
                >
                  {t('actions.save')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {loanerCars.map((car) => (
          <Card 
            key={car.id} 
            className={cn(
              "overflow-hidden transition-all duration-300 hover:shadow-md",
              !car.isAvailable && "border-amber-200"
            )}
          >
            <CardHeader className={cn(
              "pb-2",
              car.isAvailable ? "bg-green-50" : "bg-amber-50"
            )}>
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center">
                  <Car className="h-5 w-5 mr-2" />
                  {car.name}
                </div>
                <Badge 
                  variant={car.isAvailable ? "outline" : "secondary"}
                  className={cn(
                    car.isAvailable ? "border-green-500 text-green-700 bg-green-50" : "border-amber-500 text-amber-700 bg-amber-50"
                  )}
                >
                  {car.isAvailable ? t('loanerCar.available') : t('loanerCar.loanedOut')}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center text-sm">
                  <span className="font-medium min-w-24">{t('loanerCar.licensePlate')}:</span>
                  {car.license}
                </div>
                
                {!car.isAvailable && car.assignedTo && (
                  <>
                    <div className="flex items-center text-sm">
                      <span className="font-medium min-w-24">{t('loanerCar.assignedTo')}:</span>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1 text-muted-foreground" />
                        {car.assignedTo}
                      </div>
                    </div>
                    
                    {car.assignedUntil && (
                      <div className="flex items-center text-sm">
                        <span className="font-medium min-w-24">{t('loanerCar.returnDate')}:</span>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          {format(new Date(car.assignedUntil), "PPP")}
                        </div>
                      </div>
                    )}
                    
                    {car.assignedUntil && new Date(car.assignedUntil) < new Date() && (
                      <div className="flex items-center text-sm text-red-600 mt-2">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {t('loanerCar.overdue')}
                      </div>
                    )}
                  </>
                )}
                
                <div className="flex justify-end pt-2 gap-2">
                  {car.isAvailable ? (
                    <Dialog open={isAssignDialogOpen && selectedCar?.id === car.id} 
                           onOpenChange={(open) => {
                             if (open) {
                               setSelectedCar(car);
                               setAssignData({
                                 customerId: "",
                                 returnDate: format(new Date(new Date().setDate(new Date().getDate() + 3)), "yyyy-MM-dd"),
                               });
                             }
                             setIsAssignDialogOpen(open);
                           }}>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm"
                          onClick={() => setSelectedCar(car)}
                        >
                          {t('loanerCar.assignToCustomer')}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{t('loanerCar.assignLoanerCar')}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="car">{t('loanerCar.car')}</Label>
                            <Input 
                              id="car" 
                              value={`${selectedCar?.name} (${selectedCar?.license})`} 
                              readOnly 
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="customer">{t('loanerCar.customer')}</Label>
                            <Select 
                              value={assignData.customerId}
                              onValueChange={(value) => setAssignData({...assignData, customerId: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={t('loanerCar.selectCustomer')} />
                              </SelectTrigger>
                              <SelectContent>
                                {MOCK_CUSTOMERS.map((customer) => (
                                  <SelectItem key={customer.id} value={customer.id}>
                                    {customer.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="returnDate">{t('loanerCar.returnDate')}</Label>
                            <Input 
                              id="returnDate" 
                              type="date" 
                              value={assignData.returnDate}
                              onChange={(e) => setAssignData({...assignData, returnDate: e.target.value})}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAssign}>{t('loanerCar.assignCar')}</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleReturn(car.id)}
                    >
                      {t('loanerCar.markAsReturned')}
                    </Button>
                  )}
                  
                  {isAdmin && (
                    <>
                      <Dialog open={isEditDialogOpen && selectedCar?.id === car.id} 
                             onOpenChange={(open) => {
                               if (open) {
                                 setSelectedCar(car);
                               }
                               setIsEditDialogOpen(open);
                             }}>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedCar(car)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            {t('actions.edit')}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{t('loanerCar.editTitle')}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-car-name">{t('loanerCar.carName')}</Label>
                              <Input 
                                id="edit-car-name" 
                                value={selectedCar?.name || ""}
                                onChange={(e) => setSelectedCar({...selectedCar!, name: e.target.value})}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="edit-car-license">{t('loanerCar.licensePlate')}</Label>
                              <Input 
                                id="edit-car-license" 
                                value={selectedCar?.license || ""}
                                onChange={(e) => setSelectedCar({...selectedCar!, license: e.target.value})}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button 
                              onClick={handleUpdateCar}
                              disabled={!selectedCar?.name || !selectedCar?.license}
                            >
                              {t('actions.save')}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      <Dialog open={isDeleteDialogOpen && selectedCar?.id === car.id} 
                             onOpenChange={(open) => {
                               if (open) {
                                 setSelectedCar(car);
                               }
                               setIsDeleteDialogOpen(open);
                             }}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setSelectedCar(car)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            {t('actions.delete')}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{t('loanerCar.deleteTitle')}</DialogTitle>
                          </DialogHeader>
                          <div className="py-4">
                            <p>{t('loanerCar.deleteConfirmation')}</p>
                            <p className="font-medium mt-2">{car.name} ({car.license})</p>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                              {t('actions.cancel')}
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteCar}>
                              {t('actions.confirmDelete')}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          <p>
            <Badge 
              variant="outline"
              className="mr-2 border-green-500 text-green-700 bg-green-50"
            >
              {t('loanerCar.available')}
            </Badge>
            {t('loanerCar.readyToBeAssigned')}
          </p>
          <p className="mt-1">
            <Badge 
              variant="outline"
              className="mr-2 border-amber-500 text-amber-700 bg-amber-50"
            >
              {t('loanerCar.loanedOut')}
            </Badge>
            {t('loanerCar.currentlyAssigned')}
          </p>
        </div>
      </div>
    </Layout>
  );
}
