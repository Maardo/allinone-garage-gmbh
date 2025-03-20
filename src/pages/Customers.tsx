
import { useState } from "react";
import { Search, Plus, Phone, Mail, Car } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CustomerCard } from "@/components/CustomerCard";
import { Customer, Vehicle } from "@/lib/types";

// Mock data for demo purposes
const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "c1",
    name: "Johan Andersson",
    email: "johan@example.com",
    phone: "070-123-4567",
    notes: "Regular customer, prefers service on Mondays",
    vehicles: [
      {
        id: "v1",
        make: "Volvo",
        model: "V70",
        year: 2018,
        license: "ABC123",
        vin: "YV1SW6111345678"
      }
    ]
  },
  {
    id: "c2",
    name: "Maria Johansson",
    email: "maria@example.com",
    phone: "073-456-7890",
    notes: "Has special insurance arrangement",
    vehicles: [
      {
        id: "v2",
        make: "Audi",
        model: "A4",
        year: 2020,
        license: "XYZ789",
        vin: "WAUZZZ885565432"
      }
    ]
  },
  {
    id: "c3",
    name: "Erik Svensson",
    email: "erik@example.com",
    phone: "076-789-1234",
    notes: "",
    vehicles: [
      {
        id: "v3",
        make: "BMW",
        model: "3 Series",
        year: 2019,
        license: "DEF456",
        vin: "WBA57210987654"
      },
      {
        id: "v4",
        make: "Toyota",
        model: "Corolla",
        year: 2021,
        license: "GHI789",
        vin: "SB153234567890"
      }
    ]
  }
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: "",
    email: "",
    phone: "",
    notes: "",
    vehicles: []
  });
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    license: "",
    vin: ""
  });

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.vehicles.some(v => 
      v.license.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleAddCustomer = () => {
    if (!newCustomer.name) return;
    
    const customer: Customer = {
      id: Math.random().toString(36).substring(2, 9),
      name: newCustomer.name || "",
      email: newCustomer.email || "",
      phone: newCustomer.phone || "",
      notes: newCustomer.notes || "",
      vehicles: newCustomer.vehicles as Vehicle[] || []
    };
    
    setCustomers([...customers, customer]);
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      notes: "",
      vehicles: []
    });
    setIsDialogOpen(false);
  };

  const handleAddVehicle = () => {
    if (!newVehicle.make || !newVehicle.model || !newVehicle.license) return;
    
    const vehicle: Vehicle = {
      id: Math.random().toString(36).substring(2, 9),
      make: newVehicle.make || "",
      model: newVehicle.model || "",
      year: newVehicle.year || new Date().getFullYear(),
      license: newVehicle.license || "",
      vin: newVehicle.vin || ""
    };
    
    setNewCustomer({
      ...newCustomer,
      vehicles: [...(newCustomer.vehicles || []), vehicle]
    });
    
    setNewVehicle({
      make: "",
      model: "",
      year: new Date().getFullYear(),
      license: "",
      vin: ""
    });
  };

  return (
    <Layout title="Customers" subtitle="Manage customer information">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search customers by name, email, phone, or vehicle..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="customer" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="customer">Customer Details</TabsTrigger>
                <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
              </TabsList>
              
              <TabsContent value="customer" className="space-y-4 py-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <Input
                      id="name"
                      value={newCustomer.name || ""}
                      onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                      placeholder="Customer name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="email"
                        value={newCustomer.email || ""}
                        onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                        placeholder="customer@example.com"
                        className="pl-10"
                        type="email"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="phone"
                        value={newCustomer.phone || ""}
                        onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                        placeholder="070-123-4567"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="notes" className="text-sm font-medium">
                      Notes
                    </label>
                    <Input
                      id="notes"
                      value={newCustomer.notes || ""}
                      onChange={(e) => setNewCustomer({...newCustomer, notes: e.target.value})}
                      placeholder="Any additional information"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="vehicles" className="space-y-4 py-4">
                {newCustomer.vehicles && newCustomer.vehicles.length > 0 ? (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Added Vehicles</h3>
                    <div className="space-y-2">
                      {newCustomer.vehicles.map((vehicle, index) => (
                        <div 
                          key={index} 
                          className="bg-muted p-3 rounded-md flex justify-between items-center"
                        >
                          <div>
                            <p className="font-medium">
                              {vehicle.make} {vehicle.model} ({vehicle.year})
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {vehicle.license}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const updatedVehicles = [...(newCustomer.vehicles || [])];
                              updatedVehicles.splice(index, 1);
                              setNewCustomer({
                                ...newCustomer,
                                vehicles: updatedVehicles
                              });
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-muted/50 p-4 rounded-md text-center text-muted-foreground mb-4">
                    <Car className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p>No vehicles added yet</p>
                  </div>
                )}
                
                <div className="bg-card border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-3">Add Vehicle</h3>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="space-y-2">
                      <label htmlFor="make" className="text-xs font-medium">
                        Make
                      </label>
                      <Input
                        id="make"
                        value={newVehicle.make || ""}
                        onChange={(e) => setNewVehicle({...newVehicle, make: e.target.value})}
                        placeholder="e.g. Volvo"
                        className="text-sm"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="model" className="text-xs font-medium">
                        Model
                      </label>
                      <Input
                        id="model"
                        value={newVehicle.model || ""}
                        onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
                        placeholder="e.g. V70"
                        className="text-sm"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="year" className="text-xs font-medium">
                        Year
                      </label>
                      <Input
                        id="year"
                        type="number"
                        value={newVehicle.year || ""}
                        onChange={(e) => setNewVehicle({...newVehicle, year: parseInt(e.target.value)})}
                        placeholder="e.g. 2020"
                        className="text-sm"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="license" className="text-xs font-medium">
                        License Plate
                      </label>
                      <Input
                        id="license"
                        value={newVehicle.license || ""}
                        onChange={(e) => setNewVehicle({...newVehicle, license: e.target.value})}
                        placeholder="e.g. ABC123"
                        className="text-sm"
                      />
                    </div>
                    
                    <div className="space-y-2 col-span-2">
                      <label htmlFor="vin" className="text-xs font-medium">
                        VIN (Optional)
                      </label>
                      <Input
                        id="vin"
                        value={newVehicle.vin || ""}
                        onChange={(e) => setNewVehicle({...newVehicle, vin: e.target.value})}
                        placeholder="Vehicle Identification Number"
                        className="text-sm"
                      />
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={handleAddVehicle}
                    disabled={!newVehicle.make || !newVehicle.model || !newVehicle.license}
                  >
                    Add Vehicle
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleAddCustomer}
                disabled={!newCustomer.name}
              >
                Save Customer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {searchTerm && filteredCustomers.length === 0 ? (
        <div className="text-center py-12">
          <Search className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium mb-1">No customers found</h3>
          <p className="text-muted-foreground">
            No customers match your search term "{searchTerm}"
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} />
          ))}
        </div>
      )}
    </Layout>
  );
}
