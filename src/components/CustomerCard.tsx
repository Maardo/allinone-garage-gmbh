
import { useState } from "react";
import { Mail, Phone, Car, Edit, User } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Customer } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CustomerCardProps {
  customer: Customer;
}

export function CustomerCard({ customer }: CustomerCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3 bg-secondary/50">
        <CardTitle className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-primary" />
              {customer.name}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {customer.vehicles.length} vehicle{customer.vehicles.length !== 1 && "s"}
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Edit className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Customer Details</DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="details" className="mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Customer Info</TabsTrigger>
                  <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4 py-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Name</h3>
                      <p className="font-medium">{customer.name}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
                      <p>{customer.email || "Not provided"}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Phone</h3>
                      <p>{customer.phone || "Not provided"}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Notes</h3>
                      <p className="whitespace-pre-wrap">
                        {customer.notes || "No notes added for this customer"}
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="vehicles" className="space-y-4 py-4">
                  {customer.vehicles.length === 0 ? (
                    <div className="bg-muted p-4 rounded-md text-center text-muted-foreground">
                      <Car className="h-12 w-12 mx-auto mb-2 opacity-30" />
                      <p>No vehicles registered for this customer</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {customer.vehicles.map((vehicle) => (
                        <Card key={vehicle.id} className="overflow-hidden">
                          <CardHeader className="py-3 bg-secondary/30">
                            <CardTitle className="text-base flex items-center">
                              <Car className="h-4 w-4 mr-2 text-primary" />
                              {vehicle.make} {vehicle.model}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="py-4 text-sm">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-muted-foreground mb-1">Year</p>
                                <p className="font-medium">{vehicle.year}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-1">License Plate</p>
                                <p className="font-medium">{vehicle.license}</p>
                              </div>
                              {vehicle.vin && (
                                <div className="col-span-2">
                                  <p className="text-muted-foreground mb-1">VIN</p>
                                  <p className="font-medium font-mono text-xs">{vehicle.vin}</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="py-4">
        <div className="space-y-2">
          {customer.email && (
            <div className="flex items-center text-sm">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <a 
                href={`mailto:${customer.email}`} 
                className="text-primary hover:underline"
              >
                {customer.email}
              </a>
            </div>
          )}
          
          {customer.phone && (
            <div className="flex items-center text-sm">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <a 
                href={`tel:${customer.phone}`} 
                className="text-primary hover:underline"
              >
                {customer.phone}
              </a>
            </div>
          )}
          
          {customer.vehicles.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
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
          )}
        </div>
      </CardContent>
      {customer.notes && (
        <CardFooter className="pt-0 pb-4 px-6">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {customer.notes}
          </p>
        </CardFooter>
      )}
    </Card>
  );
}
