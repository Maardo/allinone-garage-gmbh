import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Check, User, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Appointment, SERVICE_TYPES } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface AppointmentFormProps {
  initialData?: Appointment;
  onSubmit: (data: Appointment) => void;
}

export function AppointmentForm({ initialData, onSubmit }: AppointmentFormProps) {
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState<Appointment>(
    initialData || {
      id: "",
      date: new Date(),
      customerId: "",
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      customerAddress: {
        street: "",
        zipCode: "",
        city: ""
      },
      vehicleInfo: "",
      vehicleMake: "",
      vehicleModel: "",
      vehicleLicense: "",
      vehicleVin: "",
      vehicleCarId: "",
      serviceType: 1,
      notes: "",
      isPaid: false,
      isCompleted: false
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const previousDate = new Date(formData.date);
      date.setHours(previousDate.getHours());
      date.setMinutes(previousDate.getMinutes());
      setFormData({ ...formData, date });
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeString = e.target.value;
    const [hours, minutes] = timeString.split(":");
    const newDate = new Date(formData.date);
    newDate.setHours(parseInt(hours, 10));
    newDate.setMinutes(parseInt(minutes, 10));
    setFormData({ ...formData, date: newDate });
  };

  const handleServiceTypeChange = (value: string) => {
    setFormData({ ...formData, serviceType: parseInt(value) as 1 | 2 | 3 | 4 | 5 });
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData({ 
      ...formData, 
      customerAddress: {
        ...formData.customerAddress,
        [field]: value
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedFormData = {
      ...formData,
      vehicleInfo: `${formData.vehicleMake} ${formData.vehicleModel}, ${formData.vehicleLicense}`
    };
    
    onSubmit(updatedFormData);
  };

  const toggleCompleted = () => {
    setFormData({ ...formData, isCompleted: !formData.isCompleted });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col space-y-2">
        <Label>{t('appointment.date')}</Label>
        <div className="grid grid-cols-2 gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !formData.date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.date ? (
                  format(formData.date, "PPP")
                ) : (
                  <span>{t('appointment.pickDate')}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={handleDateChange}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
          <div>
            <Input
              id="time"
              type="time"
              value={format(formData.date, "HH:mm")}
              onChange={handleTimeChange}
              required
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="serviceType">{t('appointment.serviceType')}</Label>
        <Select 
          value={formData.serviceType.toString()} 
          onValueChange={handleServiceTypeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('appointment.selectServiceType')} />
          </SelectTrigger>
          <SelectContent>
            {Object.values(SERVICE_TYPES).map((type) => (
              <SelectItem key={type.id} value={type.id.toString()}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="customer" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="customer" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {t('customer.details')}
          </TabsTrigger>
          <TabsTrigger value="vehicle" className="flex items-center gap-1">
            <Car className="h-4 w-4" />
            {t('vehicle.details')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="customer" className="space-y-4 py-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="customerName">{t('customer.name')}</Label>
              <Input
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder={t('customer.namePlaceholder')}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="customerEmail">{t('customer.email')}</Label>
              <Input
                id="customerEmail"
                name="customerEmail"
                type="email"
                value={formData.customerEmail || ''}
                onChange={handleChange}
                placeholder={t('customer.emailPlaceholder')}
              />
            </div>
            
            <div>
              <Label htmlFor="customerPhone">{t('customer.phone')}</Label>
              <Input
                id="customerPhone"
                name="customerPhone"
                value={formData.customerPhone || ''}
                onChange={handleChange}
                placeholder={t('customer.phonePlaceholder')}
              />
            </div>
            
            <div className="space-y-2">
              <Label>{t('customer.address')}</Label>
              <div className="space-y-2">
                <Input
                  id="street"
                  placeholder={t('customer.streetPlaceholder')}
                  value={formData.customerAddress?.street || ''}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    id="zipCode"
                    placeholder={t('customer.zipCodePlaceholder')}
                    value={formData.customerAddress?.zipCode || ''}
                    onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                  />
                  <Input
                    id="city"
                    placeholder={t('customer.cityPlaceholder')}
                    value={formData.customerAddress?.city || ''}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="vehicle" className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vehicleMake">{t('vehicle.make')}</Label>
              <Input
                id="vehicleMake"
                name="vehicleMake"
                value={formData.vehicleMake || ''}
                onChange={handleChange}
                placeholder={t('vehicle.makePlaceholder')}
              />
            </div>
            
            <div>
              <Label htmlFor="vehicleModel">{t('vehicle.model')}</Label>
              <Input
                id="vehicleModel"
                name="vehicleModel"
                value={formData.vehicleModel || ''}
                onChange={handleChange}
                placeholder={t('vehicle.modelPlaceholder')}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="vehicleLicense">{t('vehicle.license')}</Label>
            <Input
              id="vehicleLicense"
              name="vehicleLicense"
              value={formData.vehicleLicense || ''}
              onChange={handleChange}
              placeholder={t('vehicle.licensePlaceholder')}
            />
          </div>
          
          <div>
            <Label htmlFor="vehicleVin">{t('vehicle.vin')}</Label>
            <Input
              id="vehicleVin"
              name="vehicleVin"
              value={formData.vehicleVin || ''}
              onChange={handleChange}
              placeholder={t('vehicle.vinPlaceholder')}
            />
          </div>
          
          <div>
            <Label htmlFor="vehicleCarId">{t('vehicle.carId')}</Label>
            <Input
              id="vehicleCarId"
              name="vehicleCarId"
              value={formData.vehicleCarId || ''}
              onChange={handleChange}
              placeholder={t('vehicle.carIdPlaceholder')}
            />
          </div>
        </TabsContent>
      </Tabs>

      <div>
        <Label htmlFor="notes">{t('appointment.notes')}</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder={t('appointment.notesPlaceholder')}
          className="h-24"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          id="completed" 
          checked={formData.isCompleted} 
          onCheckedChange={toggleCompleted} 
        />
        <Label htmlFor="completed" className="flex items-center cursor-pointer">
          <Check className="mr-2 h-4 w-4" />
          {formData.isCompleted ? (
            <span className="text-green-600">{t('appointment.completed')}</span>
          ) : (
            <span>{t('appointment.inProgress')}</span>
          )}
        </Label>
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          {initialData?.id ? t('appointment.updateAppointment') : t('appointment.createAppointment')}
        </Button>
      </div>
    </form>
  );
}
