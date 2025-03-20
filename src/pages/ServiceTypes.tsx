
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SERVICE_TYPES, ServiceType, ServiceTypeInfo } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function ServiceTypesPage() {
  const [serviceTypes, setServiceTypes] = useState<Record<ServiceType, ServiceTypeInfo>>(SERVICE_TYPES);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<ServiceTypeInfo | null>(null);
  
  const colors = ["blue", "red", "green", "purple", "amber", "cyan", "pink", "indigo"];
  
  const handleEditType = (type: ServiceTypeInfo) => {
    setSelectedType(type);
    setIsDialogOpen(true);
  };
  
  const handleUpdateType = (updatedType: ServiceTypeInfo) => {
    setServiceTypes({
      ...serviceTypes,
      [updatedType.id]: updatedType
    });
    setIsDialogOpen(false);
    setSelectedType(null);
  };

  return (
    <Layout title="Service Types" subtitle="Manage and configure service categories">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-muted-foreground">
              Service types are used for categorizing workshop jobs in the calendar
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Service Type
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {selectedType ? "Edit Service Type" : "Create New Service Type"}
                </DialogTitle>
              </DialogHeader>
              
              <form 
                className="space-y-4 py-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const name = formData.get("name") as string;
                  const description = formData.get("description") as string;
                  const color = formData.get("color") as string;
                  
                  if (selectedType) {
                    handleUpdateType({
                      ...selectedType,
                      name,
                      description,
                      color
                    });
                  } else {
                    // For now, we just demonstrate the functionality without actually
                    // creating new types (since we're using a fixed set of types)
                    // In a real app, this would add a new type with a new ID
                    setIsDialogOpen(false);
                  }
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={selectedType?.name}
                    placeholder="Service type name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={selectedType?.description}
                    placeholder="Brief description of this service type"
                    className="h-20"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {colors.map((color) => (
                      <div key={color} className="flex items-center">
                        <input
                          type="radio"
                          id={`color-${color}`}
                          name="color"
                          value={color}
                          defaultChecked={selectedType?.color === color}
                          className="sr-only"
                        />
                        <label
                          htmlFor={`color-${color}`}
                          className={cn(
                            "w-full h-8 rounded-md border-2 cursor-pointer transition-all",
                            `bg-${color}-100 hover:bg-${color}-200`,
                            selectedType?.color === color && `border-${color}-500 ring-2 ring-${color}-500/30`
                          )}
                        ></label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">
                    {selectedType ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.values(serviceTypes).map((type) => (
            <Card 
              key={type.id} 
              className={cn(
                "overflow-hidden transition-all duration-200 hover:shadow-md",
                `border-${type.color}-200`
              )}
            >
              <CardHeader 
                className={cn(
                  "pb-3",
                  `bg-${type.color}-50`
                )}
              >
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div 
                      className={cn(
                        "w-4 h-4 rounded-full mr-2",
                        `bg-${type.color}-500`
                      )}
                    ></div>
                    <span>{type.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Info className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent side="left" className="w-80">
                        <div className="space-y-2">
                          <h4 className="font-medium">About this service type</h4>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                          <div className="pt-2">
                            <div 
                              className={cn(
                                "px-3 py-2 text-sm rounded-md",
                                `bg-${type.color}-100 text-${type.color}-800 border border-${type.color}-200`
                              )}
                            >
                              Used for job type {type.id}
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleEditType(type)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="py-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {type.description}
                </p>
              </CardContent>
              <CardFooter 
                className={cn(
                  "flex justify-between border-t pt-4",
                  `border-${type.color}-100`
                )}
              >
                <div 
                  className={cn(
                    "text-xs px-2 py-1 rounded",
                    `bg-${type.color}-100 text-${type.color}-800`
                  )}
                >
                  Code: {type.id}
                </div>
                <div className="text-sm text-muted-foreground">
                  Calendar Color
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
