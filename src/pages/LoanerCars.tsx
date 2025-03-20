
import { useState } from "react";
import { Car, User, Calendar, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoanerCar } from "@/lib/types";
import { cn } from "@/lib/utils";

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
  const [loanerCars, setLoanerCars] = useState<LoanerCar[]>(INITIAL_LOANER_CARS);
  const [selectedCar, setSelectedCar] = useState<LoanerCar | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [assignData, setAssignData] = useState({
    customerId: "",
    returnDate: format(new Date(new Date().setDate(new Date().getDate() + 3)), "yyyy-MM-dd"),
  });

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
  };

  return (
    <Layout title="Loaner Cars" subtitle="Manage loaner car availability">
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
                  {car.isAvailable ? "Available" : "Loaned Out"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center text-sm">
                  <span className="font-medium min-w-24">License Plate:</span>
                  {car.license}
                </div>
                
                {!car.isAvailable && car.assignedTo && (
                  <>
                    <div className="flex items-center text-sm">
                      <span className="font-medium min-w-24">Assigned To:</span>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1 text-muted-foreground" />
                        {car.assignedTo}
                      </div>
                    </div>
                    
                    {car.assignedUntil && (
                      <div className="flex items-center text-sm">
                        <span className="font-medium min-w-24">Return Date:</span>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          {format(new Date(car.assignedUntil), "PPP")}
                        </div>
                      </div>
                    )}
                    
                    {car.assignedUntil && new Date(car.assignedUntil) < new Date() && (
                      <div className="flex items-center text-sm text-red-600 mt-2">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Overdue
                      </div>
                    )}
                  </>
                )}
                
                <div className="flex justify-end pt-2">
                  {car.isAvailable ? (
                    <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm"
                          onClick={() => setSelectedCar(car)}
                        >
                          Assign to Customer
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Assign Loaner Car</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="car">Car</Label>
                            <Input 
                              id="car" 
                              value={`${selectedCar?.name} (${selectedCar?.license})`} 
                              readOnly 
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="customer">Customer</Label>
                            <Select 
                              value={assignData.customerId}
                              onValueChange={(value) => setAssignData({...assignData, customerId: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a customer" />
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
                            <Label htmlFor="returnDate">Return Date</Label>
                            <Input 
                              id="returnDate" 
                              type="date" 
                              value={assignData.returnDate}
                              onChange={(e) => setAssignData({...assignData, returnDate: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button onClick={handleAssign}>Assign Car</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleReturn(car.id)}
                    >
                      Mark as Returned
                    </Button>
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
              Available
            </Badge>
            Loaner cars ready to be assigned
          </p>
          <p className="mt-1">
            <Badge 
              variant="outline"
              className="mr-2 border-amber-500 text-amber-700 bg-amber-50"
            >
              Loaned Out
            </Badge>
            Loaner cars currently assigned to customers
          </p>
        </div>
      </div>
    </Layout>
  );
}
