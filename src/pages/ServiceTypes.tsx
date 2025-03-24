
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLanguage } from "@/context/LanguageContext";

export default function ServiceTypesPage() {
  const [serviceTypes, setServiceTypes] = useState<Record<ServiceType, ServiceTypeInfo>>(SERVICE_TYPES);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<ServiceTypeInfo | null>(null);
  const { t } = useLanguage();
  
  // Updated colorblind-friendly colors
  const colors = ["blue", "red", "green", "purple", "amber"];
  
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
    <Layout title={t('serviceTypes.title')} subtitle={t('serviceTypes.subtitle')}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-muted-foreground">
              {t('serviceTypes.description')}
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t('serviceTypes.new')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {selectedType ? t('serviceTypes.edit') : t('serviceTypes.create')}
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
                  <Label htmlFor="name">{t('serviceTypes.name')}</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={selectedType?.name}
                    placeholder={t('serviceTypes.name')}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">{t('serviceTypes.desc')}</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={selectedType?.description}
                    placeholder={t('serviceTypes.desc')}
                    className="h-20"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>{t('serviceTypes.color')}</Label>
                  <RadioGroup 
                    defaultValue={selectedType?.color} 
                    name="color"
                    className="grid grid-cols-5 gap-2"
                  >
                    {colors.map((color) => (
                      <div key={color} className="flex items-center justify-center">
                        <RadioGroupItem 
                          value={color} 
                          id={`color-${color}`} 
                          className="sr-only"
                        />
                        <Label
                          htmlFor={`color-${color}`}
                          className={cn(
                            "w-full h-10 rounded-md border-2 cursor-pointer transition-all flex items-center justify-center",
                            `border-${color}-400`,
                            selectedType?.color === color && `border-${color}-700 ring-2 ring-${color}-500/30`
                          )}
                        >
                          <div className={`w-6 h-6 rounded-full bg-${color}-swatch`}></div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">
                    {selectedType ? t('serviceTypes.update') : t('serviceTypes.create')}
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
                `border-${type.color}-300`
              )}
            >
              <CardHeader 
                className={cn(
                  "pb-3",
                  `bg-${type.color}-header`
                )}
              >
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div 
                      className={cn(
                        "w-5 h-5 rounded-full mr-2",
                        `bg-${type.color}-swatch`
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
                          <h4 className="font-medium">{t('serviceTypes.about')}</h4>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                          <div className="pt-2">
                            <div 
                              className={cn(
                                "px-3 py-2 text-sm rounded-md",
                                `bg-${type.color}-100 text-${type.color}-900 border border-${type.color}-300`
                              )}
                            >
                              {t('serviceTypes.code')} {type.id}
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
                  `border-${type.color}-200`
                )}
              >
                <div 
                  className={cn(
                    "text-xs px-2 py-1 rounded",
                    `bg-${type.color}-100 text-${type.color}-900`
                  )}
                >
                  {t('serviceTypes.code')}: {type.id}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t('serviceTypes.calendarColor')}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
