
import { useState } from "react";
import { Search, Plus, Phone, Mail, Car, Edit, Trash2, User, MapPin } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Customer, Vehicle } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Mock data for demo purposes
const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "c1",
    name: "Johan Andersson",
    email: "johan@example.com",
    phone: "070-123-4567",
    notes: "Regular customer, prefers service on Mondays",
    address: {
      street: "Storgatan 1",
      zipCode: "12345",
      city: "Stockholm"
    },
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
    address: {
      street: "Kungsgatan 15",
      zipCode: "54321",
      city: "Göteborg"
    },
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
    address: {
      street: "Vasagatan 5",
      zipCode: "11122",
      city: "Malmö"
    },
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
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: "",
    email: "",
    phone: "",
    notes: "",
    address: {
      street: "",
      zipCode: "",
      city: ""
    },
    vehicles: []
  });
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    license: "",
    vin: ""
  });

  const isAdmin = currentUser?.role === 'admin';

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm) ||
    customer.address?.street?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.address?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      address: newCustomer.address || { street: "", zipCode: "", city: "" },
      vehicles: newCustomer.vehicles as Vehicle[] || []
    };
    
    setCustomers([...customers, customer]);
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      notes: "",
      address: {
        street: "",
        zipCode: "",
        city: ""
      },
      vehicles: []
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: t('customer.addedTitle'),
      description: t('customer.addedDescription'),
    });
  };

  const handleUpdateCustomer = () => {
    if (!selectedCustomer || !selectedCustomer.name) return;
    
    const updatedCustomers = customers.map(c => 
      c.id === selectedCustomer.id ? selectedCustomer : c
    );
    
    setCustomers(updatedCustomers);
    setIsEditDialogOpen(false);
    
    toast({
      title: t('customer.updatedTitle'),
      description: t('customer.updatedDescription'),
    });
  };

  const handleDeleteCustomer = () => {
    if (!selectedCustomer) return;
    
    const updatedCustomers = customers.filter(c => c.id !== selectedCustomer.id);
    setCustomers(updatedCustomers);
    setIsDeleteDialogOpen(false);
    
    toast({
      title: t('customer.deletedTitle'),
      description: t('customer.deletedDescription'),
    });
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
    
    if (isEditDialogOpen && selectedCustomer) {
      setSelectedCustomer({
        ...selectedCustomer,
        vehicles: [...selectedCustomer.vehicles, vehicle]
      });
    } else {
      setNewCustomer({
        ...newCustomer,
        vehicles: [...(newCustomer.vehicles || []), vehicle]
      });
    }
    
    setNewVehicle({
      make: "",
      model: "",
      year: new Date().getFullYear(),
      license: "",
      vin: ""
    });
  };

  const handleRemoveVehicle = (vehicleId: string) => {
    if (isEditDialogOpen && selectedCustomer) {
      setSelectedCustomer({
        ...selectedCustomer,
        vehicles: selectedCustomer.vehicles.filter(v => v.id !== vehicleId)
      });
    } else {
      setNewCustomer({
        ...newCustomer,
        vehicles: (newCustomer.vehicles || []).filter(v => v.id !== vehicleId)
      });
    }
  };

  const renderCustomerForm = (isEdit = false) => {
    const customer = isEdit ? selectedCustomer : newCustomer;
    const setCustomer = isEdit ? setSelectedCustomer : setNewCustomer;
    
    if (!customer) return null;
    
    return (
      <Tabs defaultValue="details" className="mt-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">{t('customer.details')}</TabsTrigger>
          <TabsTrigger value="vehicles">{t('customer.vehiclesTab')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                {t('customer.name')}
              </label>
              <Input
                id="name"
                value={customer.name || ""}
                onChange={(e) => setCustomer({...customer, name: e.target.value})}
                placeholder={t('customer.namePlaceholder')}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                {t('customer.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="email"
                  value={customer.email || ""}
                  onChange={(e) => setCustomer({...customer, email: e.target.value})}
                  placeholder={t('customer.emailPlaceholder')}
                  className="pl-10"
                  type="email"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                {t('customer.phone')}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="phone"
                  value={customer.phone || ""}
                  onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                  placeholder={t('customer.phonePlaceholder')}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="street" className="text-sm font-medium">
                {t('customer.street')}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="street"
                  value={customer.address?.street || ""}
                  onChange={(e) => setCustomer({
                    ...customer, 
                    address: {...customer.address, street: e.target.value}
                  })}
                  placeholder={t('customer.streetPlaceholder')}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label htmlFor="zipCode" className="text-sm font-medium">
                  {t('customer.zipCode')}
                </label>
                <Input
                  id="zipCode"
                  value={customer.address?.zipCode || ""}
                  onChange={(e) => setCustomer({
                    ...customer, 
                    address: {...customer.address, zipCode: e.target.value}
                  })}
                  placeholder={t('customer.zipCodePlaceholder')}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">
                  {t('customer.city')}
                </label>
                <Input
                  id="city"
                  value={customer.address?.city || ""}
                  onChange={(e) => setCustomer({
                    ...customer, 
                    address: {...customer.address, city: e.target.value}
                  })}
                  placeholder={t('customer.cityPlaceholder')}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">
                {t('customer.notes')}
              </label>
              <Input
                id="notes"
                value={customer.notes || ""}
                onChange={(e) => setCustomer({...customer, notes: e.target.value})}
                placeholder={t('customer.notesPlaceholder')}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="vehicles" className="space-y-4 py-4">
          {customer.vehicles && customer.vehicles.length > 0 ? (
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">{t('customer.addedVehicles')}</h3>
              <div className="space-y-2">
                {customer.vehicles.map((vehicle, index) => (
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
                      onClick={() => handleRemoveVehicle(vehicle.id)}
                    >
                      {t('actions.remove')}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-muted/50 p-4 rounded-md text-center text-muted-foreground mb-4">
              <Car className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p>{t('customer.noVehicles')}</p>
            </div>
          )}
          
          <div className="bg-card border rounded-md p-4">
            <h3 className="text-sm font-medium mb-3">{t('customer.addVehicle')}</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="space-y-2">
                <label htmlFor="make" className="text-xs font-medium">
                  {t('vehicle.make')}
                </label>
                <Input
                  id="make"
                  value={newVehicle.make || ""}
                  onChange={(e) => setNewVehicle({...newVehicle, make: e.target.value})}
                  placeholder={t('vehicle.makePlaceholder')}
                  className="text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="model" className="text-xs font-medium">
                  {t('vehicle.model')}
                </label>
                <Input
                  id="model"
                  value={newVehicle.model || ""}
                  onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
                  placeholder={t('vehicle.modelPlaceholder')}
                  className="text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="year" className="text-xs font-medium">
                  {t('vehicle.year')}
                </label>
                <Input
                  id="year"
                  type="number"
                  value={newVehicle.year || ""}
                  onChange={(e) => setNewVehicle({...newVehicle, year: parseInt(e.target.value)})}
                  placeholder={t('vehicle.yearPlaceholder')}
                  className="text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="license" className="text-xs font-medium">
                  {t('vehicle.license')}
                </label>
                <Input
                  id="license"
                  value={newVehicle.license || ""}
                  onChange={(e) => setNewVehicle({...newVehicle, license: e.target.value})}
                  placeholder={t('vehicle.licensePlaceholder')}
                  className="text-sm"
                />
              </div>
              
              <div className="space-y-2 col-span-2">
                <label htmlFor="vin" className="text-xs font-medium">
                  {t('vehicle.vin')}
                </label>
                <Input
                  id="vin"
                  value={newVehicle.vin || ""}
                  onChange={(e) => setNewVehicle({...newVehicle, vin: e.target.value})}
                  placeholder={t('vehicle.vinPlaceholder')}
                  className="text-sm"
                />
              </div>
            </div>
            
            <Button
              size="sm"
              onClick={handleAddVehicle}
              disabled={!newVehicle.make || !newVehicle.model || !newVehicle.license}
            >
              {t('customer.addVehicle')}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <Layout title={t('navigation.customers')} subtitle={t('customer.manageSubtitle')}>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={t('customer.searchPlaceholder')}
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('customer.addNew')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{t('customer.addNew')}</DialogTitle>
            </DialogHeader>
            
            {renderCustomerForm(false)}
            
            <DialogFooter>
              <Button 
                onClick={handleAddCustomer}
                disabled={!newCustomer.name}
              >
                {t('actions.save')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {searchTerm && filteredCustomers.length === 0 ? (
        <div className="text-center py-12">
          <Search className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium mb-1">{t('customer.noResults')}</h3>
          <p className="text-muted-foreground">
            {t('customer.noResultsFor')} "{searchTerm}"
          </p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('customer.name')}</TableHead>
                  <TableHead>{t('customer.contact')}</TableHead>
                  <TableHead>{t('customer.address')}</TableHead>
                  <TableHead>{t('customer.vehicles')}</TableHead>
                  {isAdmin && <TableHead className="text-right">{t('actions.actions')}</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {customer.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {customer.email && (
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                            <a href={`mailto:${customer.email}`} className="text-primary hover:underline">
                              {customer.email}
                            </a>
                          </div>
                        )}
                        {customer.phone && (
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                            <a href={`tel:${customer.phone}`} className="text-primary hover:underline">
                              {customer.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {customer.address?.street && (
                        <div className="text-sm">
                          <div>{customer.address.street}</div>
                          <div>{customer.address.zipCode} {customer.address.city}</div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {customer.vehicles.map((vehicle) => (
                          <Badge 
                            key={vehicle.id} 
                            variant="outline"
                            className="flex items-center bg-secondary/50"
                          >
                            <Car className="h-3 w-3 mr-1" />
                            {vehicle.make} {vehicle.model} ({vehicle.license})
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog open={isEditDialogOpen && selectedCustomer?.id === customer.id} 
                                 onOpenChange={(open) => {
                                   if (open) {
                                     setSelectedCustomer(customer);
                                   }
                                   setIsEditDialogOpen(open);
                                 }}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedCustomer(customer)}>
                                <Edit className="h-3 w-3 mr-1" />
                                {t('actions.edit')}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                              <DialogHeader>
                                <DialogTitle>{t('customer.editTitle')}</DialogTitle>
                              </DialogHeader>
                              
                              {renderCustomerForm(true)}
                              
                              <DialogFooter>
                                <Button 
                                  onClick={handleUpdateCustomer}
                                  disabled={!selectedCustomer?.name}
                                >
                                  {t('actions.save')}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          <Dialog open={isDeleteDialogOpen && selectedCustomer?.id === customer.id} 
                                 onOpenChange={(open) => {
                                   if (open) {
                                     setSelectedCustomer(customer);
                                   }
                                   setIsDeleteDialogOpen(open);
                                 }}>
                            <DialogTrigger asChild>
                              <Button variant="destructive" size="sm" onClick={() => setSelectedCustomer(customer)}>
                                <Trash2 className="h-3 w-3 mr-1" />
                                {t('actions.delete')}
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{t('customer.deleteTitle')}</DialogTitle>
                              </DialogHeader>
                              <div className="py-4">
                                <p>{t('customer.deleteConfirmation')}</p>
                                <p className="font-medium mt-2">{customer.name}</p>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                  {t('actions.cancel')}
                                </Button>
                                <Button variant="destructive" onClick={handleDeleteCustomer}>
                                  {t('actions.confirmDelete')}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </Layout>
  );
}
